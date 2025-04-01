import React, { useEffect, useState } from "react";
import { Form, Checkbox, Input } from "antd";

interface NegativeReviewProps {
  form?: any;
  responses?: Record<string, any>;
  onChange?: (fieldId?: string, value?: any) => void;
}

const NegativeReview: React.FC<NegativeReviewProps> = ({
  form,
  responses,
  onChange,
}) => {
  const [isTermsChecked, setIsTermsChecked] = useState(true);

  return (
    <>
      <Form.Item>
        <label>¿En qué podemos mejorar?</label>
      </Form.Item>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900">
        <Form.Item name="Food" valuePropName="checked">
          <Checkbox>
            <div className="flex gap-3 items-center">
              <span>🍴</span>
              <p className="w-full text-[10px] sm:text-[11px]">Comida</p>
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item name="Service" valuePropName="checked">
          <Checkbox>
            <div className="flex gap-3 items-center">
              <span>👥</span>
              <p className="w-full text-[10px] sm:text-[11px]">Servicio</p>
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item name="Ambience" valuePropName="checked">
          <Checkbox>
            <div className="flex gap-3 items-center">
              <span>🏢</span>
              <p className="w-full text-[10px] sm:text-[11px]">Ambiente</p>
            </div>
          </Checkbox>
        </Form.Item>
      </div>
      {form.getFieldError("hiddenInput").length > 0 && (
        <div className="text-red-500">
          Por favor selecciona al menos una opción
        </div>
      )}
      <Form.Item name="ImproveText">
        <label>Compartenos detalles sobre tu experiencia en este lugar</label>
        <Input.TextArea
          value={responses ? responses["ImproveText"] : null}
          onChange={(e) =>
            onChange ? onChange("ImproveText", e.target.value) : null
          }
          placeholder="Ej: La comida estuvo muy buena, pero el servicio fue lento."
        />
      </Form.Item>
      <div className="flex gap-3">
        <input
          type="checkbox"
          className="form-checkbox min-h-[12px] min-w-[12px] text-green-500"
          onChange={() => setIsTermsChecked(!isTermsChecked)}
          checked={isTermsChecked}
        />
        <small className="text-gray-500">
          Al presionar &quot;Enviar&quot;, declaro que acepto los{" "}
          <a
            className="text-primary hover:underline"
            href="https://qikstarts.com/terms-of-service"
            rel="noopener noreferrer"
            target="_blank"
          >
            Términos y Condiciones
          </a>{" "}
          y las{" "}
          <a
            className="text-primary hover:underline"
            href="https://qikstarts.com/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Políticas de Privacidad
          </a>
          .
        </small>
      </div>
    </>
  );
};

export default NegativeReview;
