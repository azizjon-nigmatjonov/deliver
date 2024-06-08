import { useState, useEffect } from "react";
import RightSide from "./Rightside";
import LeftSide from "./Leftside";
import { Grid } from "@mui/material";
import { getNearestBranch, useBranchList } from "services";
import { useSelector } from "react-redux";

export default function MainContent({
  formik,
  distance,
  mapLoading,
  mapGeometry,
  handleUserLogs,
  setMapGeometry,
  isOrderEditable,
  setIsCourierCall,
  placemarkGeometry,
  setPlacemarkGeometry,
}) {
  const [branchOptions, setBranchOptions] = useState([]);
  const { setFieldValue } = formik;
  const { shipper_id } = useSelector((state) => state.auth);

  const { data: branches } = useBranchList({
    shipper_id,
    params: { limit: 200, page: 1 },
    props: {
      onSuccess: (data) => {
        setBranchOptions(
          data?.branches?.map((elm) => ({
            label: `${elm?.name} (${elm.real_time_orders_amount})`,
            value: elm?.id,
            elm,
          })),
        );
      },
    },
  });

  useEffect(() => {
    if (
      placemarkGeometry.length > 0 &&
      placemarkGeometry[0] &&
      placemarkGeometry[1] &&
      isOrderEditable
    ) {
      getNearestBranch({
        lat: placemarkGeometry[0],
        long: placemarkGeometry[1],
      }).then((res) => {
        const nearestBranch = res?.branches[0];
        setFieldValue(
          "branch",
          nearestBranch
            ? {
                label: nearestBranch.name,
                value: nearestBranch.id,
                elm: nearestBranch,
              }
            : "",
        );
        // if (
        //   values?.delivery_type === "delivery" ||
        //   values?.delivery_type === "external"
        // ) {
        //   setFieldValue(
        //     "delivery_price",
        //     nearestBranch !== null ? nearestBranch?.base_price || 0 : 0,
        //   );
        // } else
        // if (values?.delivery_type === "self-pickup") {
        //   setFieldValue("delivery_price", 0);
        // }
      });
    }
  }, [placemarkGeometry, setFieldValue, isOrderEditable]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <LeftSide
          formik={formik}
          distance={distance}
          mapGeometry={mapGeometry}
          branchOption={branchOptions}
          handleUserLogs={handleUserLogs}
          setMapGeometry={setMapGeometry}
          isOrderEditable={isOrderEditable}
          setIsCourierCall={setIsCourierCall}
          placemarkGeometry={placemarkGeometry}
          setPlacemarkGeometry={setPlacemarkGeometry}
        />
      </Grid>
      <Grid item xs={6}>
        <RightSide
          formik={formik}
          branches={branches}
          mapLoading={mapLoading}
          mapGeometry={mapGeometry}
          handleUserLogs={handleUserLogs}
          setMapGeometry={setMapGeometry}
          placemarkGeometry={placemarkGeometry}
          setPlacemarkGeometry={setPlacemarkGeometry}
        />
      </Grid>
    </Grid>
  );
}
