import React from "react";
import { Form, Checkbox, Input } from "antd";
import { FormField } from "../types/wizardTypes";

interface NegativeReviewProps {
  form?: any;
}

const NegativeReview: React.FC<NegativeReviewProps> = ({ form }) => {
  return (
    <>
      <Form.Item>
        <label>¿En qué podemos mejorar?</label>
      </Form.Item>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900">
        <Form.Item name="Food" valuePropName="checked">
          <Checkbox>
            <div className="flex flex-col items-center">
              <span>🍴</span>
              <p className="w-full text-[10px] sm:text-[11px]">Comida</p>
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item name="Service" valuePropName="checked">
          <Checkbox>
            <div className="flex flex-col items-center">
              <span>👥</span>
              <p className="w-full text-[10px] sm:text-[11px]">Servicio</p>
            </div>
          </Checkbox>
        </Form.Item>
        <Form.Item name="Ambience" valuePropName="checked">
          <Checkbox>
            <div className="flex flex-col items-center">
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
        <Input.TextArea placeholder="Ej: La comida estuvo muy buena, pero el servicio fue lento." />
      </Form.Item>
    </>
  );
};

export default NegativeReview;
