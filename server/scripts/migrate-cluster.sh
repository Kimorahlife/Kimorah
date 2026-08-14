#!/usr/bin/env bash
#
# Copy this database to another cluster.
#
# Written for the move off the shared cluster, where dev and production both
# read a database called "test" — the default Mongo picks when the connection
# string has no database path. The new clusters get an explicit name.
#
#   ./scripts/migrate-cluster.sh --to "<target uri>"                # rehearse
#   ./scripts/migrate-cluster.sh --to "<target uri>" --commit       # do it
#
# Rehearsing is the default: it dumps, reports what it found, and stops without
# writing anything. Nothing here touches the source.
#
# Requires mongodump/mongorestore (brew install mongodb-database-tools).

set -euo pipefail

SOURCE_URI="${MONGO_URI:-}"
SOURCE_DB="test"
TARGET_URI=""
TARGET_DB="kimorah"
COMMIT=false
DUMP_DIR="${TMPDIR:-/tmp}/kimorah-migrate-$$"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from)      SOURCE_URI="$2"; shift 2 ;;
    --from-db)   SOURCE_DB="$2";  shift 2 ;;
    --to)        TARGET_URI="$2"; shift 2 ;;
    --to-db)     TARGET_DB="$2";  shift 2 ;;
    --commit)    COMMIT=true;     shift ;;
    -h|--help)   sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

fail() { echo "  ✗ $1" >&2; exit 1; }

[[ -n "$SOURCE_URI" ]] || fail "no source. Set MONGO_URI or pass --from '<uri>'."
[[ -n "$TARGET_URI" ]] || fail "no target. Pass --to '<uri>'."
command -v mongodump    >/dev/null || fail "mongodump not found — brew install mongodb-database-tools"
command -v mongorestore >/dev/null || fail "mongorestore not found — brew install mongodb-database-tools"
command -v mongosh      >/dev/null || fail "mongosh not found"

# Never let a typo point source and target at the same cluster.
host_of() {                       # scheme, then credentials, then path
  local u="${1#*://}"; u="${u#*@}"; u="${u%%/*}"; u="${u%%\?*}"; echo "$u"
}
[[ "$(host_of "$SOURCE_URI")" != "$(host_of "$TARGET_URI")" ]] \
  || fail "source and target are the same host — refusing to migrate onto itself."

echo "  source : $(host_of "$SOURCE_URI") / $SOURCE_DB"
echo "  target : $(host_of "$TARGET_URI") / $TARGET_DB"
echo "  mode   : $([[ "$COMMIT" == true ]] && echo 'COMMIT — the target will be written' || echo 'rehearsal — nothing will be written')"
echo

count_docs() {  # uri, db → "collection<TAB>count" per line
  mongosh "$1" --quiet --eval "
    const db = db.getSiblingDB('$2');
    db.getCollectionNames().sort().forEach(n => print(n + '\t' + db.getCollection(n).countDocuments()));
  "
}

echo "  reading the source…"
SOURCE_COUNTS="$(count_docs "$SOURCE_URI" "$SOURCE_DB")"
[[ -n "$SOURCE_COUNTS" ]] || fail "the source database '$SOURCE_DB' is empty or unreachable."
echo "$SOURCE_COUNTS" | awk -F'\t' '{ printf "    %-26s %s\n", $1, $2 }'
echo

# A target that already holds data is almost always the wrong target.
EXISTING="$(count_docs "$TARGET_URI" "$TARGET_DB" | awk -F'\t' '$2 > 0' || true)"
if [[ -n "$EXISTING" ]]; then
  echo "  the target already holds data:"
  echo "$EXISTING" | awk -F'\t' '{ printf "    %-26s %s\n", $1, $2 }'
  fail "target '$TARGET_DB' is not empty. Drop it first, or point --to-db somewhere new."
fi

trap 'rm -rf "$DUMP_DIR"' EXIT
echo "  dumping…"
mongodump --uri="$SOURCE_URI" --db="$SOURCE_DB" --out="$DUMP_DIR" --quiet
echo "    $(du -sh "$DUMP_DIR" | cut -f1) written to a temporary directory"
echo

if [[ "$COMMIT" != true ]]; then
  echo "  rehearsal complete — nothing was written."
  echo "  re-run with --commit to restore into $TARGET_DB."
  exit 0
fi

echo "  restoring…"
mongorestore --uri="$TARGET_URI" \
  --nsFrom="${SOURCE_DB}.*" --nsTo="${TARGET_DB}.*" \
  --quiet "$DUMP_DIR"
echo

# The restore is only done when both sides agree, collection by collection.
echo "  verifying…"
TARGET_COUNTS="$(count_docs "$TARGET_URI" "$TARGET_DB")"
MISMATCH=0
while IFS=$'\t' read -r name expected; do
  [[ -n "$name" ]] || continue
  actual="$(awk -F'\t' -v n="$name" '$1 == n { print $2 }' <<<"$TARGET_COUNTS")"
  actual="${actual:-0}"
  if [[ "$actual" == "$expected" ]]; then
    printf "    ✓ %-26s %s\n" "$name" "$actual"
  else
    printf "    ✗ %-26s %s, expected %s\n" "$name" "$actual" "$expected"
    MISMATCH=1
  fi
done <<<"$SOURCE_COUNTS"

echo
if [[ "$MISMATCH" -ne 0 ]]; then
  fail "counts do not match — do not switch MONGO_URI yet."
fi

cat <<DONE
  every collection matches.

  next, in this order:
    1. point the dev server's MONGO_URI at the new cluster, ending /$TARGET_DB
    2. exercise the app — open a curriculum, save it, check /api/health reports
       "db": { "name": "$TARGET_DB" }
    3. only then change MONGO_URI in Render and restart
    4. leave the old cluster untouched for a week before deleting anything
DONE
