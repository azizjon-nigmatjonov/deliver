import { Box, useTheme } from "@mui/material";

const IconButton = ({ icon, color = "primary", classNameForIcon }) => {
  const theme = useTheme();

  return (
    <div className="inline-block">
      <Box
        className={`icon-button ${classNameForIcon}`}
        bgcolor={theme.palette[color]?.light}
        color={theme.palette[color]?.main}
      >
        {{
          ...icon,
          props: {
            ...icon.props,
            style: { ...icon.props.style, fontSize: 20 },
          },
        }}
      </Box>
    </div>
  );
};

export default IconButton;
