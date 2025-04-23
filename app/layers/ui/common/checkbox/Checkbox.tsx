import React from 'react';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd';

type QikCheckboxProps = {
  text?: string;
} & CheckboxProps;

const QikCheckBox = ({text} :QikCheckboxProps) => (
  <Checkbox>{text}</Checkbox>
)

export {QikCheckBox};