import { styled } from "@mui/system";
import { StepConnector, stepConnectorClasses } from "@mui/material";

type CustomStepperConnectorProps = {
  variant: "hooters" | "gus" | "delcampo";
};

const CustomStepperConnector = styled(
  ({
    variant,
    ...other
  }: CustomStepperConnectorProps &
    React.ComponentProps<typeof StepConnector>) => <StepConnector {...other} />
)(({ theme, variant }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 9,
    "@media (max-width: 529px)": {
      right: 12,
    },
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: `hsl(var(--${variant}))`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: `hsl(var(--${variant}))`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 6,
    border: 12,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
    width: 60,
    "@media (max-width: 529px)": {
      width: 44,
    },
    position: "absolute",
    left: "calc(-100%)",
    right: "calc(50%)",
  },
}));

export default CustomStepperConnector;
