import { Navigate, useParams } from "react-router-dom";

/**
 * Opening a group's curriculum lands on its first session.
 *
 * There was an index page here listing every session, but the session rail
 * added to the session page now does that job from inside the curriculum
 * itself — so a separate index was one more screen between a professional and
 * the material. Landing straight on session one makes a group's curriculum
 * look and behave exactly like the Mission template of it, which is the point:
 * the only difference between the two should be whose curriculum it is, not
 * how it reads.
 */
function GroupCurriculumEntry() {
  const { groupId = "", slug = "" } = useParams();
  return <Navigate to={`/groups/${groupId}/c/${slug}/session/1`} replace />;
}

export default GroupCurriculumEntry;
