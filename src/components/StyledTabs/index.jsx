import { Tab, Tabs } from "@mui/material";
import { withStyles } from "@mui/styles";

export const StyledTabs = withStyles((props) => {
  return {
    indicator: {
      backgroundColor: "#0D72F6",
      height: "3px",
    },
    scroller: {
      height: 56,
      justifyContent: "center",
      display: "flex",
      flexDirection: "column",
    },
  };
})((props) => <Tabs scrollButtons={false} {...props} />);

export const StyledTab = withStyles((theme) => ({
  root: {
    color: "#6E8BB7",
    textTransform: "none",
    opacity: "1",
    padding: "0 4px !important",
    marginRight: "20px !important",
  },
}))((props) => <Tab disableRipple {...props} />);
