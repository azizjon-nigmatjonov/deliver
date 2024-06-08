import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography, Popover } from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   typography: {
//     padding: "8px 12px",
//     cursor: "pointer",
//     transition: "all 0.3s ease-in-out",
//     "&:hover": {
//       backgroundColor: "#0d72f62b",
//       border: "none",
//     },
//   },
//   popover: {
//     boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
//   },
// }));

export default function CPopover({
  contents,
  onChange = () => {},
  children,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {children({ handleClick, id })}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          style={{
            border: "1px solid #c2c2c2",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {contents?.length > 0 ? (
            contents?.map((content, index) => (
              <Typography
                key={index}
                onClick={() => {
                  onChange(content);
                  handleClose();
                }}
              >
                {content.title}
              </Typography>
            ))
          ) : (
            <Typography>{t("no_options")}</Typography>
          )}
        </Box>
      </Popover>
    </div>
  );
}
