import { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.scss";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Modal({
  open,
  onClose,
  title,
  tools = null,
  children,
  fullScreen,
  contentsx,
  noCloseIcon,
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="custom-dialog-title"
      aria-describedby="custom-dialog-description"
      TransitionComponent={Transition}
      fullScreen={fullScreen}
      PaperProps={{ sx: { overflowY: "visible" } }}
      {...props}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className={styles.app_bar}
      >
        {fullScreen ? (
          <Toolbar>
            {!noCloseIcon && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            {tools}
          </Toolbar>
        ) : (
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {title}
            </Typography>
            {!noCloseIcon && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        )}
      </AppBar>
      <DialogContent sx={contentsx}>{children}</DialogContent>
    </Dialog>
  );
}
