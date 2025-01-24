import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const ClockSpoonForkIcon = ({ color = '#000000', size = 24, ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    {...props}
  >
    {/* Clock */}
    <Circle cx="512" cy="512" r="400" stroke={color} strokeWidth="40" fill="none" />
    <Path
      fill={color}
      d="M512 272c-13.2 0-24 10.8-24 24v216h-144c-13.2 0-24 10.8-24 24s10.8 24 24 24h168c13.2 0 24-10.8 24-24V296c0-13.2-10.8-24-24-24z"
    />
    {/* Spoon */}
    <Path
      fill={color}
      d="M112 192c0-53.02 42.98-96 96-96s96 42.98 96 96v320c0 53.02-42.98 96-96 96s-96-42.98-96-96V192zm64 0v320c0 17.64 14.36 32 32 32s32-14.36 32-32V192c0-17.64-14.36-32-32-32s-32 14.36-32 32z"
    />
    {/* Fork */}
    <Path
      fill={color}
      d="M816 192c0-53.02 42.98-96 96-96s96 42.98 96 96v320c0 53.02-42.98 96-96 96s-96-42.98-96-96V192zm64 0v320c0 17.64 14.36 32 32 32s32-14.36 32-32V192c0-17.64-14.36-32-32-32s-32 14.36-32 32z"
    />
  </Svg>
);

export default ClockSpoonForkIcon;