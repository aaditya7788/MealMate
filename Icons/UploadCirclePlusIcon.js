import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

const UploadCirclePlusIcon = ({ color = '#000000', size = 24, ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <Circle
      cx="12"
      cy="12"
      r="15"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke={color}
      strokeWidth="2"
    />
    <Line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

export default UploadCirclePlusIcon;