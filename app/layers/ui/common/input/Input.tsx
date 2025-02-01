import React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/es/input';

type QikInputProps = {
  placeholder?: string
  size?: 'small' | 'large'
  defaultValue?: string
} & InputProps;

const QikInput = ({ placeholder, size, defaultValue }: QikInputProps) => (
  <Input placeholder={placeholder} size={size} defaultValue={defaultValue}/>
)

export { QikInput };