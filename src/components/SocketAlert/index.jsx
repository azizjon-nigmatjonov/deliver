import React from "react";
import styles from "./SocketAlert.module.scss";
import LinearProgress from "@mui/material/LinearProgress";
import { withStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "components/Button";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  CLEAR_ALL_REPORT_DOWNLOAD_FILE,
  CLEAR_ALL_REPORT_WS,
} from "redux/constants";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const SocketAlert = () => {
  const { t } = useTranslation();
  const [closeIconStatus, setCloseIconStatus] = useState(false);
  const allOrderData = useSelector((state) => state.allOrderReport.payload);
  const allReportExcel = useSelector((state) => state.allReportExcel);

  const dispatch = useDispatch();

  useEffect(() => {
    if (allOrderData?.percent || allReportExcel?.payload?.length) {
      setCloseIconStatus(true);
    }
  }, [allOrderData, allReportExcel]);

  return (
    <>
      {closeIconStatus && (
        <div className={styles.wrapper}>
          <div className={styles.insideWrapper}>
            <div
              className={styles.closeIcon}
              onClick={(e) => {
                e.stopPropagation();
                setCloseIconStatus(false);
                dispatch({
                  type: CLEAR_ALL_REPORT_DOWNLOAD_FILE,
                });
                dispatch({
                  type: CLEAR_ALL_REPORT_WS,
                });
              }}
            >
              <h2 className={styles.progressText}>Progress</h2>
              <CloseIcon className={styles.icon} />
            </div>
            <div className={styles.progressWrapper}>
              <LinearProgressWithLabel
                value={
                  !allReportExcel.payload ? allOrderData?.percent : 100 ?? 0
                }
              />
            </div>
            {allReportExcel?.payload?.length && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setCloseIconStatus(false);
                }}
              >
                <a href={allReportExcel?.payload}>{t("download")}</a>
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SocketAlert;
