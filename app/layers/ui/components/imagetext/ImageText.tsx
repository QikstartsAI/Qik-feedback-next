import React from 'react';
import { Image, Typography } from "antd";
const { Text } = Typography;

type ImageTextProps = {
  src: string;
  alt?: string;
  text: string;
  position: "top" | "bottom"
  width?: number | string;
}

const ImageText = ({ src, alt = "image", text, position = "bottom", width = 200 }: ImageTextProps) => {
  return (
    <div style={{ display: "flex", flexDirection: position === "top" ? "column-reverse" : "column", alignItems: "center", textAlign: "center" }}>
      <Text>{text}</Text>
      <Image src={src} alt={alt} width={width} />
    </div>
  );
};
