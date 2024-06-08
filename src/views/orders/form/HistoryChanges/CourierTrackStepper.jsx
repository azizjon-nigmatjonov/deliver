import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import StepContent from "@mui/material/StepContent";
import Typography from "@mui/material/Typography";
import { statusText } from "utils/statusText";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import moment from "moment";

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundColor: "var(--primary-color)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "var(--primary-color)",
  }),
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  "&": {
    marginRight: "32px",
    marginLeft: "auto",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "var(--primary-color)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "var(--primary-color)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    width: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {String(props.icon)}
    </ColorlibStepIconRoot>
  );
}

export const CourierTrackStepper = ({ data }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (data?.status_notes) {
      setActiveStep(data?.status_notes?.length - 1);
    }
  }, [data?.status_id, data?.status_notes]);

  return (
    <div style={{ width: "255px" }}>
      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        style={{ maxWidth: "256px", width: "100%" }}
        className="stepper_wrap"
        connector={<ColorlibConnector />}
      >
        {data?.status_notes?.map((status_note) => (
          <Step key={status_note.id}>
            <StepLabel
              className="stepper_label"
              StepIconComponent={ColorlibStepIcon}
            >
              <Typography variant="body1" fontWeight={600}>
                {statusText(status_note?.status_id)}
              </Typography>
              <Typography variant="body2">
                {moment(status_note?.created_at).format("DD.MM.YYYY HH:mm:ss")}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
