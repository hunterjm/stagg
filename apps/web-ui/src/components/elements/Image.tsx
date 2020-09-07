import React, { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {}

export const Image = ({
  className,
  src,
  width,
  height,
  alt,
  ...props
}: ImageProps) => {
  return (
    <img
      {...props}
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
    />
  );
};
