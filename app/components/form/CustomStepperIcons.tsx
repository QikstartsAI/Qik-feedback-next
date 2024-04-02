import {styled} from "@mui/system";
import {StepIconProps} from "@mui/material";
import React from "react";

const StepIconRoot = styled('div')<{
	ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
	zIndex: 1,
	color: '#fff',
	width: 25,
	height: 25,
	display: 'flex',
	borderRadius: '50%',
	justifyContent: 'center',
	alignItems: 'center',
	cursor: 'pointer',
	...(ownerState.active && {
		backgroundColor:
			'hsl(var(--hooters))',
		boxShadow: '0 2px 5px 0 rgba(0,0,0,.25)',
	}),
	...(ownerState.completed && {
		backgroundColor:
			'hsl(var(--hooters))',
	}),
}));

function CustomStepperIcons(props: StepIconProps) {
	const { active, completed, className } = props;

	const icons: { [index: string]: string } = {
		1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8'
	};

	return (
		<StepIconRoot ownerState={{ completed, active }} className={className}>
			{icons[String(props.icon)]}
		</StepIconRoot>
	);
}

export default CustomStepperIcons