import { Grid } from "@mui/material";
import ByComment from "./byComments";
import ByOrder from "./byOrder";
import ByPayment from "./byPayment";

const PieChartStatistics = () => {
  return (
    <Grid container spacing={1} sx={{ my: 1 }}>
      <Grid item xs={12} lg={4}>
        <ByOrder />
      </Grid>
      <Grid item xs={12} lg={4}>
        <ByPayment />
      </Grid>
      <Grid item xs={12} lg={4}>
        <ByComment />
      </Grid>
    </Grid>
  );
};

export default PieChartStatistics;
