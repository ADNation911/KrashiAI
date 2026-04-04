import React from 'react';

interface LinearGradientProps {
  colors: string[];
  style?: React.CSSProperties;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children?: React.ReactNode;
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  children,
}) => {
  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(to ${end.x > start.x ? 'right' : 'left'}, ${colors.join(', ')})`,
  };
  if (style && typeof style === 'object' && !Array.isArray(style)) {
    Object.assign(gradientStyle, style);
  }

  return <div style={gradientStyle}>{children}</div>;
};

export default LinearGradient;


