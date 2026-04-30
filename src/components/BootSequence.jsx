import React, { useEffect } from 'react';
import WindowsXpBranding from './WindowsXpBranding';

export default function BootSequence({ onComplete }) {
  useEffect(() => {
    // Finish sequence after 4.5 seconds total
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center cursor-none select-none relative font-sans">
      <div className="flex flex-col items-center mt-[-10vh]">
        
        {/* Microsoft Windows XP Professional Logo Lockup */}
        <div className="mb-24 flex flex-col items-center relative">
          <WindowsXpBranding
            textColor="#ffffff"
            microsoftColor="#ffffff"
            professionLabel="Professional"
            professionColor="rgba(255,255,255,0.92)"
            windowsSizeClass="text-[6rem]"
            xpSizeClass="text-[3rem]"
            microsoftSizeClass="text-[1.15rem]"
            flagWidthClass="w-36"
          />
        </div>
        
        {/* Exact Replica Marquee Loader */}
        <div className="xp-marquee-container">
          <div className="xp-marquee-blocks">
            <div className="xp-marquee-block"></div>
            <div className="xp-marquee-block"></div>
            <div className="xp-marquee-block"></div>
          </div>
        </div>
      </div>
      
      {/* Bottom Left Copyright */}
      <div className="absolute bottom-10 left-12 text-[#b0b0b0] text-[15px] font-sans flex flex-col leading-tight">
        <span>Copyright © 1985-2001</span>
        <span>Microsoft Corporation</span>
      </div>

      {/* Bottom Right Logo Text */}
      <div className="absolute bottom-10 right-12 text-white text-3xl font-bold italic tracking-wider" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Microsoft<sup className="text-[12px] font-normal">®</sup>
      </div>
    </div>
  );
}
