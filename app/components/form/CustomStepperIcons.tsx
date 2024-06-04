import {styled} from "@mui/system";
import {StepIconProps} from "@mui/material";
import React from "react";

interface CustomStepperIconsProps extends StepIconProps {
  variant: "hooters" | "gus";
}

const StepIconRoot = styled('div')<{
  variant: "hooters" | "gus";
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState, variant}) => ({
	backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
	zIndex: 1,
	color: '#fff',
	width: 22,
	height: 22,
	display: 'flex',
	borderRadius: '100%',
	justifyContent: 'center',
	alignItems: 'center',
	cursor: 'pointer',
	...(ownerState.active && {
		backgroundColor:
			`hsl(var(--${variant}))`,
		boxShadow: '0 2px 5px 0 rgba(0,0,0,.25)',
	}),
	...(ownerState.completed && {
		backgroundColor:
      `hsl(var(--${variant}))`,
	}),
}));



function CustomStepperIcons(props: CustomStepperIconsProps) {
	const { active, completed, className, variant } = props;

	const icons: { [index: string]: string } = {
		1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9'
	};

	return (
		<StepIconRoot
      ownerState={{ completed, active }}
      className={className}
      variant={variant}
    >
			{icons[String(props.icon)]}
		</StepIconRoot>
	);
}
export function CustomStepperIconsGus(props: StepIconProps) {
	return <CustomStepperIcons {...props} variant="gus" />
}

export function CustomStepperIconsHooters(props: StepIconProps) {
	return <CustomStepperIcons {...props} variant="hooters" />
}


export default CustomStepperIcons