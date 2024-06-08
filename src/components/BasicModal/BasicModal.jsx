import { Box, Dialog, IconButton } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  backgroundColor: "white",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "6px",
  boxShadow: 24,
};

const titleStyle = {
  fontWeight: "700",
  fontSize: "18px",
  lineHeight: "22px",
  color: "#1A2024",
  marginBottom: "8px",
};

const BasicModal = ({
  open,
  onClose,
  title,
  children,
  titleStyleCustom,
  closeButton,
  setNotificationOpen,
  textStyle,
  handleCloseNotification,
  notificationId,
  userId,
  buttons,
}) => {
  const handleClose = () => {
    onClose();
    setNotificationOpen(false);
    handleCloseNotification(userId, notificationId);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {closeButton && (
          <div
            style={{
              width: "100%",
              position: "absolute",
              left: "91%",
              top: "21px",
            }}
          >
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => handleClose()}
            >
              {/* <closeIcon sx={{ fontSize: "22px", color: "#161616" }} /> */}
            </IconButton>
          </div>
        )}
        <div style={titleStyleCustom ? titleStyleCustom : titleStyle}>
          {title}
        </div>

        <div style={textStyle}>
          {children ||
            "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."}
        </div>
        {buttons}
      </Box>
    </Dialog>
  );
};

export default BasicModal;
