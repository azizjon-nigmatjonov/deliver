import { Button as MuiButton } from "@mui/material";
import "./index.scss";

export default function Button({ children, style = {}, ...props }) {
  return (
    <MuiButton
      disableElevation={true}
      sx={{ borderRadius: "6px", ...style }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
