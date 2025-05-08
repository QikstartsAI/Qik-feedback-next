import React, { useEffect, useState } from "react";
import { Business } from "@/app/types/business";
import { Textarea } from "@/app/components/ui/TextArea";
import { IconCopy } from "@tabler/icons-react";
import { cn, copyToClipboard as copyUtil } from "@/app/lib/utils";
import { useTranslation } from "react-i18next";

interface PositiveReviewProps {
  business?: Business | null;
  responses?: Record<string, any>;
  onChange?: (fieldId?: string, value?: any) => void;
}

const PositiveReview = ({
  business,
  responses,
  onChange,
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
      <span className="font-bold text-[24px] text-center text-qik">
        {t("form.default.positiveReview.title")}
      </span>

      <div className="mt-4 flex gap-2 justify-center items-center flex-wrap w-full">
        {options?.map((option) => (
          <button
            key={option}
            className={cn(
              "w-full border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-qik hover:border-qik transition",
              {
                "bg-qik text-white border-qik": goodFeedback.includes(option),
              }
            )}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="my-3">
        {t("form.default.positiveReview.shareDetails")}{" "}
        <span className="text-qik font-bold">{business?.Name}</span>
      </div>
      <div className="w-full flex gap-3 items-center">
        <Textarea
          placeholder={t("form.default.positiveReview.placeholder")}
          onChange={(event) => handleSelectOption(event.target.value)}
          value={goodFeedback}
        />
        <IconCopy
          className="text-qik"
          cursor="pointer"
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
      <div className="flex gap-3">
        <input
          type="checkbox"
          className="form-checkbox min-h-[12px] min-w-[12px] text-green-500"
          onChange={
            onChange
              ? (_) => onChange("AcceptTerms", !responses?.AcceptTerms)
              : (_) => {}
          }
          checked={responses?.AcceptTerms}
        />
        <small className="text-gray-500">
          {t("form.default.termsPrefix")}{" "}
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
          .
        </small>
      </div>
    </div>
  );
};

export default PositiveReview;
