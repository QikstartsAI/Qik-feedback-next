import React from "react";
import { Button } from "antd";
import { BaseButtonProps } from "antd/es/button/button";

type ButtonProps = {
  type?: "primary" | "default";
  text?: string;
  isLoading?: boolean;
} & BaseButtonProps;

const QikButton = ({ type, text, isLoading }: ButtonProps) => (
  <Button type={type} loading={isLoading}>
    {text}
  </Button>
);

export { QikButton };
