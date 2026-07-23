import Typography from "@mui/material/Typography";
import { JSX } from "react/jsx-runtime";

/** Toolpad session object — drives the Account avatar/menu in the header. */
export const getSession = (user: { name: string; email: string }) => ({
  user: {
    name: user.name,
    email: user.email,
  },
});

/** Small footer pinned to the bottom of the sidebar. */
export function SidebarFooter(): JSX.Element {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: "nowrap", overflow: "hidden", color: "text.secondary" }}
    >
      {`© ${new Date().getFullYear()} Kimorah`}
    </Typography>
  );
}
