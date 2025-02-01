import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

type TypographyProps = {
  text?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p';
};

const typographyMap = {
  h1: (text: string) => <Title level={1}>{text}</Title>,
  h2: (text: string) => <Title level={2}>{text}</Title>,
  h3: (text: string) => <Title level={3}>{text}</Title>,
  h4: (text: string) => <Title level={4}>{text}</Title>,
  h5: (text: string) => <Title level={5}>{text}</Title>,
  p: (text: string) => <Paragraph>{text}</Paragraph>,
};

const QikTypography = ({ text = '', type = 'p' }: TypographyProps) => (
  typographyMap[type](text)
);

export { QikTypography };