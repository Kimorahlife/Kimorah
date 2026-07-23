import { CircularProgress, Box } from "@mui/material";

const FullPageSpinner = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={60} thickness={5} color="primary" />
    </Box>
  );
};

export default FullPageSpinner;
