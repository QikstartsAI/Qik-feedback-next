'use client'

import { useState } from 'react'

export function useMultistepForm(steps: number) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);

    const nextStep = () => {
        console.log('current index: ', currentStepIndex)
        if (currentStepIndex < steps - 1) {
            setCurrentStepIndex((i) => i + 1)
        }
    }

    const previousStep = () => {
        console.log('current index: ', currentStepIndex)
        if (currentStepIndex > 0) {
            setCurrentStepIndex((i) => i - 1)
        }
    }

    const goTo = (index: number) => {
        setCurrentStepIndex(index)
    }

    return {
        currentStepIndex,
        setCurrentStepIndex,
        steps,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps - 1,
        showSuccessMsg,
        goTo,
        nextStep,
        previousStep
    }
}