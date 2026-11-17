import React, { useState } from 'react';
import { Shield } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'Chiron Investigations',
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shield className="w-6 h-6 text-[#C59B27] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-tight text-[#0A0A0A]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#F1F5F9]">
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#F1F5F9] animate-pulse"
        >
          <Shield className="w-5 h-5 text-[#C59B27]/50" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};
