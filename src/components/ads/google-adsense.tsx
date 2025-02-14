import React, { useEffect } from 'react';

interface AdProps {
  slot: string;
  format?: 'auto' | 'fluid';
  layout?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAd({ slot, format = 'auto', layout, style }: AdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading ad:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: 'block' }}
      data-ad-client="YOUR_ADSENSE_CLIENT_ID" // Replace with your AdSense client ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
      data-ad-layout={layout}
    />
  );
}
