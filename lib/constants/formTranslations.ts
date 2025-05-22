import translations from "./translations";

// dictionary of translations depending on the country of the business
/**
 * @typedef {Object} Translations
 * @property {string} [US] - The translation for the US
 * @property {string} [CA] - The translation for Canada
 * @property {string} [FR] - The translation for France
 * @property {string} [default] - The default translation
 * @description The translations for the different countries where the business is located
 * @param {businessCountry} businessCountry - The country of the business to get the translations
 */

const {
  formSubTitle,
  formTitle,
  fullNameQuestion,
  emailQuestion,
  birthdayQuestion,
  phoneNumberQuestion,
  courtesyQuestion,
  placeCleannessQuestion,
  quicknessQuestion,
  foodQualityQuestion,
  ambienceQuestion,
  experienceQuestion,
  recommendingQuestion,
  comeBackQuestion,
  oneStarLabel,
  twoStarLabel,
  threeStarLabel,
  fourStarLabel,
  fiveStarLabel,
  nextButton,
  yesButton,
  noButton,
  submitButton,
  whyText,
  recommendingPlaceholder,
  noRecommendingPlaceholder,
  submitText1,
  submitText2,
  submitText3,
  submitText4,
  submitText5,
  toImproveText,
  foodButton,
  serviceButton,
  ambienceButton,
  shareDetailsText,
  shareDetailsPlaceholder,
  termsAndConditions1,
  termsAndConditions2,
  termsAndConditions3,
  termsAndConditions4,
  formErrorMessage,
  formUserDataErrorMessage,
  formUserPhoneNumberDataErrorMessage,
  emptyRecommendingError,
  emptyNoRecommendingError,
  chooseOneOptionError,
  howToImprovementError,
  whyComeBackError,
  feedbackLimit,
} = translations;

const getTranslatedFormTitle = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formTitle[businessCountry as keyof typeof formTitle] || formTitle.default
  );
};

const getTranslatedFormSubTitle = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formSubTitle[businessCountry as keyof typeof formSubTitle] ||
    formSubTitle.default
  );
};

const getTranslatedFullNameQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    fullNameQuestion[businessCountry as keyof typeof fullNameQuestion] ||
    fullNameQuestion.default
  );
};

const getTranslatedEmailQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    emailQuestion[businessCountry as keyof typeof emailQuestion] ||
    emailQuestion.default
  );
};

const getTranslatedBirthdayQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    birthdayQuestion[businessCountry as keyof typeof birthdayQuestion] ||
    birthdayQuestion.default
  );
};

const getTranslatedPhoneNumberQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    phoneNumberQuestion[businessCountry as keyof typeof phoneNumberQuestion] ||
    phoneNumberQuestion.default
  );
};

const getTranslatedCourtesyQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    courtesyQuestion[businessCountry as keyof typeof courtesyQuestion] ||
    courtesyQuestion.default
  );
};

const getTranslatedPlaceCleannessQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    placeCleannessQuestion[
      businessCountry as keyof typeof placeCleannessQuestion
    ] || placeCleannessQuestion.default
  );
};

const getTranslatedQuicknessQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    quicknessQuestion[businessCountry as keyof typeof quicknessQuestion] ||
    quicknessQuestion.default
  );
};

const getTranslatedFoodQualityQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    foodQualityQuestion[businessCountry as keyof typeof foodQualityQuestion] ||
    foodQualityQuestion.default
  );
};

const getTranslatedAmbienceQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    ambienceQuestion[businessCountry as keyof typeof ambienceQuestion] ||
    ambienceQuestion.default
  );
};

const getTranslatedExperienceQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    experienceQuestion[businessCountry as keyof typeof experienceQuestion] ||
    experienceQuestion.default
  );
};

const getTranslatedRecommendingQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    recommendingQuestion[
      businessCountry as keyof typeof recommendingQuestion
    ] || recommendingQuestion.default
  );
};

const getTranslatedComeBackQuestion = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    comeBackQuestion[businessCountry as keyof typeof comeBackQuestion] ||
    comeBackQuestion.default
  );
};

const getOneStarLabel = ({ businessCountry }: { businessCountry: string }) => {
  return (
    oneStarLabel[businessCountry as keyof typeof oneStarLabel] ||
    oneStarLabel.default
  );
};

const getTwoStarLabel = ({ businessCountry }: { businessCountry: string }) => {
  return (
    twoStarLabel[businessCountry as keyof typeof twoStarLabel] ||
    twoStarLabel.default
  );
};

const getThreeStarLabel = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    threeStarLabel[businessCountry as keyof typeof threeStarLabel] ||
    threeStarLabel.default
  );
};

const getFourStarLabel = ({ businessCountry }: { businessCountry: string }) => {
  return (
    fourStarLabel[businessCountry as keyof typeof fourStarLabel] ||
    fourStarLabel.default
  );
};

const getFiveStarLabel = ({ businessCountry }: { businessCountry: string }) => {
  return (
    fiveStarLabel[businessCountry as keyof typeof fiveStarLabel] ||
    fiveStarLabel.default
  );
};

const getNextButton = ({ businessCountry }: { businessCountry: string }) => {
  return (
    nextButton[businessCountry as keyof typeof nextButton] || nextButton.default
  );
};

const getYesButton = ({ businessCountry }: { businessCountry: string }) => {
  return (
    yesButton[businessCountry as keyof typeof yesButton] || yesButton.default
  );
};

const getNoButton = ({ businessCountry }: { businessCountry: string }) => {
  return noButton[businessCountry as keyof typeof noButton] || noButton.default;
};

const getSubmitButton = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitButton[businessCountry as keyof typeof submitButton] ||
    submitButton.default
  );
};

const getWhyText = ({ businessCountry }: { businessCountry: string }) => {
  return whyText[businessCountry as keyof typeof whyText] || whyText.default;
};

const getRecommendingPlaceholder = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    recommendingPlaceholder[
      businessCountry as keyof typeof recommendingPlaceholder
    ] || recommendingPlaceholder.default
  );
};

const getNoRecommendingPlaceholder = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    noRecommendingPlaceholder[
      businessCountry as keyof typeof noRecommendingPlaceholder
    ] || noRecommendingPlaceholder.default
  );
};

const getSubmitText1 = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitText1[businessCountry as keyof typeof submitText1] ||
    submitText1.default
  );
};

const getSubmitText2 = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitText2[businessCountry as keyof typeof submitText2] ||
    submitText2.default
  );
};

const getSubmitText3 = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitText3[businessCountry as keyof typeof submitText3] ||
    submitText3.default
  );
};

const getSubmitText4 = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitText4[businessCountry as keyof typeof submitText4] ||
    submitText4.default
  );
};

const getSubmitText5 = ({ businessCountry }: { businessCountry: string }) => {
  return (
    submitText5[businessCountry as keyof typeof submitText5] ||
    submitText5.default
  );
};

const getToImproveText = ({ businessCountry }: { businessCountry: string }) => {
  return (
    toImproveText[businessCountry as keyof typeof toImproveText] ||
    toImproveText.default
  );
};

const getFoodButton = ({ businessCountry }: { businessCountry: string }) => {
  return (
    foodButton[businessCountry as keyof typeof foodButton] || foodButton.default
  );
};

const getServiceButton = ({ businessCountry }: { businessCountry: string }) => {
  return (
    serviceButton[businessCountry as keyof typeof serviceButton] ||
    serviceButton.default
  );
};

const getAmbienceButton = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    ambienceButton[businessCountry as keyof typeof ambienceButton] ||
    ambienceButton.default
  );
};

const getShareDetailsText = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    shareDetailsText[businessCountry as keyof typeof shareDetailsText] ||
    shareDetailsText.default
  );
};

const getShareDetailsPlaceholder = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    shareDetailsPlaceholder[
      businessCountry as keyof typeof shareDetailsPlaceholder
    ] || shareDetailsPlaceholder.default
  );
};

const getTermsAndConditions1 = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    termsAndConditions1[businessCountry as keyof typeof termsAndConditions1] ||
    termsAndConditions1.default
  );
};

const getTermsAndConditions2 = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    termsAndConditions2[businessCountry as keyof typeof termsAndConditions2] ||
    termsAndConditions2.default
  );
};

const getTermsAndConditions3 = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    termsAndConditions3[businessCountry as keyof typeof termsAndConditions3] ||
    termsAndConditions3.default
  );
};

const getTermsAndConditions4 = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    termsAndConditions4[businessCountry as keyof typeof termsAndConditions4] ||
    termsAndConditions4.default
  );
};

const getFormErrorMessage = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[businessCountry as keyof typeof formErrorMessage] ||
    formErrorMessage.default
  );
};

const getFormUserDataErrorMessage = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formUserDataErrorMessage[
      businessCountry as keyof typeof formErrorMessage
    ] || formUserDataErrorMessage.default
  );
};

const getFormUserPhoneNumberDataErrorMessage = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formUserPhoneNumberDataErrorMessage[
      businessCountry as keyof typeof formErrorMessage
    ] || formUserPhoneNumberDataErrorMessage.default
  );
};

const getRecommendingError = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[businessCountry as keyof typeof emptyRecommendingError] ||
    emptyRecommendingError.default
  );
};

const getNoRecommendingError = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[
      businessCountry as keyof typeof emptyNoRecommendingError
    ] || emptyNoRecommendingError.default
  );
};

const getChooseOneOptionError = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[businessCountry as keyof typeof chooseOneOptionError] ||
    chooseOneOptionError.default
  );
};

const getHowToImprovementError = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[businessCountry as keyof typeof howToImprovementError] ||
    howToImprovementError.default
  );
};

const getWhyComeBackError = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return (
    formErrorMessage[businessCountry as keyof typeof whyComeBackError] ||
    whyComeBackError.default
  );
};

const getFeedbackLimit = ({ businessCountry }: { businessCountry: string }) => {
  return (
    formErrorMessage[businessCountry as keyof typeof feedbackLimit] ||
    feedbackLimit.default
  );
};

const getFormTranslations = ({
  businessCountry,
}: {
  businessCountry: string;
}) => {
  return {
    title: getTranslatedFormTitle({ businessCountry }),
    subTitle: getTranslatedFormSubTitle({ businessCountry }),
    fullNameQuestion: getTranslatedFullNameQuestion({ businessCountry }),
    emailQuestion: getTranslatedEmailQuestion({ businessCountry }),
    birthdayQuestion: getTranslatedBirthdayQuestion({ businessCountry }),
    phoneNumberQuestion: getTranslatedPhoneNumberQuestion({ businessCountry }),
    courtesyQuestion: getTranslatedCourtesyQuestion({ businessCountry }),
    placeCleannessQuestion: getTranslatedPlaceCleannessQuestion({
      businessCountry,
    }),
    quicknessQuestion: getTranslatedQuicknessQuestion({ businessCountry }),
    foodQualityQuestion: getTranslatedFoodQualityQuestion({ businessCountry }),
    ambienceQuestion: getTranslatedAmbienceQuestion({ businessCountry }),
    experienceQuestion: getTranslatedExperienceQuestion({ businessCountry }),
    recommendingQuestion: getTranslatedRecommendingQuestion({
      businessCountry,
    }),
    comeBackQuestion: getTranslatedComeBackQuestion({ businessCountry }),
    oneStarLabel: getOneStarLabel({ businessCountry }),
    twoStarLabel: getTwoStarLabel({ businessCountry }),
    threeStarLabel: getThreeStarLabel({ businessCountry }),
    fourStarLabel: getFourStarLabel({ businessCountry }),
    fiveStarLabel: getFiveStarLabel({ businessCountry }),
    nextButton: getNextButton({ businessCountry }),
    yesButton: getYesButton({ businessCountry }),
    noButton: getNoButton({ businessCountry }),
    submitButton: getSubmitButton({ businessCountry }),
    whyText: getWhyText({ businessCountry }),
    recommendingPlaceholder: getRecommendingPlaceholder({ businessCountry }),
    noRecommendingPlaceholder: getNoRecommendingPlaceholder({
      businessCountry,
    }),
    submitText1: getSubmitText1({ businessCountry }),
    submitText2: getSubmitText2({ businessCountry }),
    submitText3: getSubmitText3({ businessCountry }),
    submitText4: getSubmitText4({ businessCountry }),
    submitText5: getSubmitText5({ businessCountry }),
    toImproveText: getToImproveText({ businessCountry }),
    foodButton: getFoodButton({ businessCountry }),
    serviceButton: getServiceButton({ businessCountry }),
    ambienceButton: getAmbienceButton({ businessCountry }),
    shareDetailsText: getShareDetailsText({ businessCountry }),
    shareDetailsPlaceholder: getShareDetailsPlaceholder({ businessCountry }),
    termsAndConditions1: getTermsAndConditions1({ businessCountry }),
    termsAndConditions2: getTermsAndConditions2({ businessCountry }),
    termsAndConditions3: getTermsAndConditions3({ businessCountry }),
    termsAndConditions4: getTermsAndConditions4({ businessCountry }),
    formErrorMessage: getFormErrorMessage({ businessCountry }),
    formUserDataErrorMessage: getFormUserDataErrorMessage({ businessCountry }),
    formUserPhoneNumberErrorMessage: getFormUserPhoneNumberDataErrorMessage({
      businessCountry,
    }),
    emptyRecommendingError: getRecommendingError({ businessCountry }),
    emptyNoRecommendingError: getNoRecommendingError({ businessCountry }),
    chooseOneOptionError: getChooseOneOptionError({ businessCountry }),
    howToImprovementError: getHowToImprovementError({ businessCountry }),
    whyComeBackError: getWhyComeBackError({ businessCountry }),
    feedbackLimit: getFeedbackLimit({ businessCountry }),
  };
};

export default getFormTranslations;
