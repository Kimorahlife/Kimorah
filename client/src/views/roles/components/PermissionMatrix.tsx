import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getPermission } from "../../../store/store";

// 3-column matrix per the "pages always render" agreement. View column
// dropped: page visibility + nav gating now derived from holding any of
// Add / Edit / Delete.
//
// The `:read` keys still exist in the catalog and both client and server still
// authorize on them, so they cannot simply be left alone — see
// reconcileReadKeys below for how they are kept in step with these three.
const ACTIONS = [
  { action: "add", label: "Add" },
  { action: "write", label: "Edit" },
  { action: "delete", label: "Delete" },
] as const;

export { reconcileReadKeys } from "../permissions/reconcileReadKeys";

type DisplayGroup = { label: string; members: string[] };

// Each `members` entry is a catalog `group` value from
// server/src/config/permissions.ts. Rows render only when the DB actually holds
// permissions for the group, so this list can lead the catalog safely.
const DISPLAY_GROUPS: DisplayGroup[] = [
  { label: "Dashboard", members: ["Dashboard"] },
  { label: "Professional Dashboard", members: ["Professional Dashboard"] },
  { label: "Users", members: ["Users"] },
  { label: "Roles", members: ["Roles"] },
  { label: "Research (Coquí)", members: ["Research"] },
  { label: "Curriculums", members: ["Curriculums"] },
  { label: "Groups", members: ["Groups"] },
  // Member workspace — assignable now, pages land later.
  { label: "My Profile", members: ["My Profile"] },
  { label: "Bookmarks", members: ["Bookmarks"] },
  { label: "Community Forum", members: ["Community Forum"] },
  { label: "Messages", members: ["Messages"] },
  { label: "Settings", members: ["Settings"] },
  { label: "Help Center", members: ["Help Center"] },
];

type Props = {
  selected: string[];
  onChange: (keys: string[]) => void;
  readOnly?: boolean;
};

const PermissionMatrix = ({ selected, onChange, readOnly = false }: Props) => {
  const { list: permissions } = useSelector(getPermission);

  const keysFor = (members: string[], action: string): string[] =>
    permissions
      .filter(
        (p) =>
          members.includes(p.group) &&
          (p.action === action || p.key.endsWith(`:${action}`))
      )
      .map((p) => p.key);

  const toggleGroup = (keys: string[]) => {
    const allChecked = keys.every((k) => selected.includes(k));
    const someChecked = keys.some((k) => selected.includes(k));
    // Three-state click semantics: all/indeterminate → clear; none → add all.
    if (allChecked || someChecked) {
      onChange(selected.filter((k) => !keys.includes(k)));
    } else {
      onChange([...selected, ...keys]);
    }
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="subtitle2">Feature</Typography>
          </TableCell>
          {ACTIONS.map(({ label }) => (
            <TableCell key={label} align="center">
              <Typography variant="subtitle2">{label}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {DISPLAY_GROUPS.map((g) => {
          const perAction = ACTIONS.map(({ action }) => ({
            action,
            keys: keysFor(g.members, action),
          }));
          // Skip the row entirely when it has no keys in any column.
          if (perAction.every((c) => c.keys.length === 0)) return null;
          return (
            <TableRow key={g.label} hover>
              <TableCell>{g.label}</TableCell>
              {perAction.map(({ action, keys }) => {
                if (keys.length === 0) {
                  return (
                    <TableCell key={action} align="center" padding="checkbox">
                      <Typography variant="caption" color="text.disabled">
                        —
                      </Typography>
                    </TableCell>
                  );
                }
                const allChecked = keys.every((k) => selected.includes(k));
                const someChecked = keys.some((k) => selected.includes(k));
                return (
                  <TableCell key={action} align="center" padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={allChecked}
                      indeterminate={!allChecked && someChecked}
                      onChange={() => !readOnly && toggleGroup(keys)}
                      disabled={readOnly}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PermissionMatrix;
