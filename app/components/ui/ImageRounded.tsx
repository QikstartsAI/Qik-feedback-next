import React from 'react'
import Image from 'next/image';

interface Props {
  imageUrl: string;
  imageAlt: string;
}

const ImageRounded: React.FC<Props> = ({ imageUrl, imageAlt }) => (
  <Image
    className='rounded-full'
    width={100}
    height={100}
    src={imageUrl}
    alt={imageAlt}
  />
)

export default ImageRounded
