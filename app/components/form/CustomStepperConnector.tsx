import {styled} from "@mui/system";
import {StepConnector, stepConnectorClasses} from "@mui/material";

const CustomStepperConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 9,
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor:
				'hsl(var(--hooters))',
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			backgroundColor:
				'hsl(var(--hooters))',
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		height: 6,
		border: 12,
		backgroundColor:
			theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
		borderRadius: 1,
		width: 60,
		'@media (max-width: 529px)': {
			width: 44,
		},
		position: 'absolute',
		left: 'calc(-100%)',
		right: 'calc(50%)',
	},
}));

export default CustomStepperConnector