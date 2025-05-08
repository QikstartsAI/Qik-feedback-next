import React, { useCallback } from "react";
import { Form, Checkbox, Input } from "antd";
import { useTranslation } from "react-i18next";

interface NegativeReviewProps {
  form?: any;
  responses?: Record<string, any>;
  onChange?: (fieldId?: string, value?: any) => void;
}

const NegativeReview: React.FC<NegativeReviewProps> = React.memo(
  ({ form, responses, onChange }) => {
    const { t } = useTranslation("common");

    const handleSetImprove = (event: any) => {
      const improve = responses?.Improve ?? [];
      const { name, checked } = event.target;
      if (onChange) {
        if (checked === true) {
          onChange("Improve", [...improve, name]);
        } else {
          onChange(
            "Improve",
            improve.filter((el: string) => el !== name)
          );
        }
      }
    };

    const isChecked = (name: string): boolean =>
      responses?.Improve?.some((el: string) => el === name);

    const handleImproveTextChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
          onChange("ImproveText", e.target.value);
        }
      },
      [onChange]
    );

    return (
      <>
        <Form.Item>
          <label>{t("form.default.negativeReview.improveLabel")}</label>
        </Form.Item>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900">
          <Checkbox
            name="Food"
            onChange={handleSetImprove}
            checked={isChecked("Food")}
          >
            <div className="flex gap-3 items-center">
              <span>🍴</span>
              <p className="w-full text-[10px] sm:text-[11px]">
                {t("form.default.negativeReview.food")}
              </p>
            </div>
          </Checkbox>

          <Checkbox
            name="Service"
            onChange={handleSetImprove}
            checked={isChecked("Service")}
          >
            <div className="flex gap-3 items-center">
              <span>👥</span>
              <p className="w-full text-[10px] sm:text-[11px]">
                {t("form.default.negativeReview.service")}
              </p>
            </div>
          </Checkbox>

          <Checkbox
            name="Ambience"
            onChange={handleSetImprove}
            checked={isChecked("Ambience")}
          >
            <div className="flex gap-3 items-center">
              <span>🏢</span>
              <p className="w-full text-[10px] sm:text-[11px]">
                {t("form.default.negativeReview.ambience")}
              </p>
            </div>
          </Checkbox>
        </div>
        {form.getFieldError("hiddenInput").length > 0 && (
          <div className="text-red-500">
            {t("form.default.negativeReview.selectError")}
          </div>
        )}
        <Form.Item name="ImproveText">
          <label>{t("form.default.negativeReview.detailsLabel")}</label>
          <Input.TextArea
            value={responses?.ImproveText ?? null}
            onChange={handleImproveTextChange}
            placeholder={t("form.default.negativeReview.detailsPlaceholder")}
          />
        </Form.Item>
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
            .
          </small>
        </div>
      </>
    );
  }
);

NegativeReview.displayName = "NegativeReview";

export default NegativeReview;
