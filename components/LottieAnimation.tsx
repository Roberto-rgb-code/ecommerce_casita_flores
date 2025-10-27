"use client";

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LottieAnimationProps {
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ 
  src, 
  className = "", 
  width = 200, 
  height = 200 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width, height }}
      />
    </div>
  );
};

export default LottieAnimation;
