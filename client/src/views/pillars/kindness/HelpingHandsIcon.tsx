import React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const HelpingHandsIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 100">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M37 50c-3 2-6 1-7-1-1-2 1-4 3-6l17-13c4-3 8-5 13-5h10c3 0 6-1 9-3" strokeWidth="5.2" />
      <path d="M34 48c3 3 5 2 8 0l8-6c-3 3-4 7-1 9 2 1 4 0 7-1l12-3c4-1 7-3 10-6l5-4" strokeWidth="5.2" />
      <path d="M63 57c3-2 6-1 7 1 1 2-1 4-3 6L50 77c-4 3-8 5-13 5H27c-3 0-6 1-9 3" strokeWidth="5.2" />
      <path d="M66 59c-3-3-5-2-8 0l-8 6c3-3 4-7 1-9-2-1-4 0-7 1l-12 3c-4 1-7 3-10 6l-5 4" strokeWidth="5.2" />
    </g>
  </SvgIcon>
);

export default HelpingHandsIcon;
