import React, { useState } from "react";
import { Business } from "@/app/types/business";
import { Textarea } from "@/app/components/ui/TextArea";
import { IconCopy } from "@tabler/icons-react";
import { cn, copyToClipboard as copyUtil } from "@/app/lib/utils";
import { useTranslation } from "react-i18next";
import CheckboxField from "./CheckboxField";

interface PositiveReviewProps {
  business?: Business | null;
  responses?: Record<string, any>;
  onChange?: (fieldId?: string, value?: any) => void;
  brandColor?: string;
}

const PositiveReview = ({
  business,
  responses,
  onChange,
  brandColor,
}: PositiveReviewProps) => {
  const { t } = useTranslation("common");
  const [showIsCopied, setShowIsCopied] = useState(false);
  const [goodFeedback, setGoodFeedback] = useState("");

  const handleCopy = async (text: string) => {
    try {
      await copyUtil(text);
      setShowIsCopied(true);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSelectOption = (text: string) => {
    setGoodFeedback(text);
    handleCopy(text);
  };

  const options = [
    t("form.default.positiveReview.option1"),
    t("form.default.positiveReview.option2"),
  ];

  return (
    <div className="mt-4 flex flex-col gap-3">
      <span
        className="font-bold text-[24px] text-center"
        style={{
          color: business?.BrandColor ? business?.BrandColor : "#058FFF",
        }}
      >
        {t("form.default.positiveReview.title")}
      </span>

      <div className="mt-4 flex gap-2 justify-center items-center flex-wrap w-full">
        {options?.map((option) => (
          <button
            key={option}
            className={cn(
              "w-full border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition",
              {
                "bg-qik text-white": goodFeedback.includes(option),
              }
            )}
            style={{
              color:
                goodFeedback.includes(option) && brandColor
                  ? "#ffffff"
                  : undefined,
              backgroundColor:
                goodFeedback.includes(option) && brandColor
                  ? brandColor
                  : undefined,
            }}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="my-3">
        {t("form.default.positiveReview.shareDetails")}{" "}
        <span
          className="font-bold"
          style={{
            color: business?.BrandColor ? business?.BrandColor : "#058FFF",
          }}
        >
          {business?.Name}
        </span>
      </div>
      <div className="w-full flex gap-3 items-center">
        <Textarea
          placeholder={t("form.default.positiveReview.placeholder")}
          onChange={(event) => handleSelectOption(event.target.value)}
          value={goodFeedback}
        />
        <IconCopy
          cursor="pointer"
          style={{
            color: business?.BrandColor ? business?.BrandColor : "#058FFF",
          }}
          onClick={() => handleCopy(goodFeedback)}
        />
      </div>
      <p
        className={cn(
          "transition-all font-bold text-[#ff0000] text-center",
          showIsCopied ? "opacity-100" : "opacity-0"
        )}
      >
        {t("form.default.positiveReview.copied")}
      </p>
      <CheckboxField
        field={{}}
        onChange={
          onChange
            ? (_) => onChange("AcceptTerms", !responses?.AcceptTerms)
            : (_) => {}
        }
        value={responses?.AcceptTerms}
        brandColor={brandColor}
      >
        <small className="text-gray-500">
          {t("form.default.negativeReview.termsPrefix")}{" "}
          <a
            className="text-primary hover:underline"
            href="https://qikstarts.com/terms-of-service"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("form.default.termsLink")}
          </a>{" "}
          {t("form.default.termsMiddle")}{" "}
          <a
            className="text-primary hover:underline"
            href="https://qikstarts.com/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("form.default.privacyLink")}
          </a>
        </small>
      </CheckboxField>
    </div>
  );
};

export default PositiveReview;
