import React, { useEffect } from 'react';

// Pure CSS Windows XP Logo
const XpLogo = () => (
  <div className="flex flex-wrap w-32 h-32 mr-6 transform skew-y-[-8deg] skew-x-[-8deg] filter drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
    <div className="w-[48%] h-[48%] bg-gradient-to-br from-[#f25316] to-[#d43700] rounded-tl-lg mb-[4%] mr-[4%] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4)]"></div>
    <div className="w-[48%] h-[48%] bg-gradient-to-br from-[#68a700] to-[#4c7a00] rounded-tr-sm mb-[4%] shadow-[inset_-2px_2px_4px_rgba(255,255,255,0.4)] relative top-[3px]"></div>
    <div className="w-[48%] h-[48%] bg-gradient-to-br from-[#0089e6] to-[#005fb8] rounded-bl-sm mr-[4%] shadow-[inset_2px_-2px_4px_rgba(255,255,255,0.4)] relative left-[2px]"></div>
    <div className="w-[48%] h-[48%] bg-gradient-to-br from-[#f2b300] to-[#c68800] rounded-br-lg shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.4)] relative top-[3px] left-[2px]"></div>
  </div>
);

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
        <div className="flex items-center mb-24 relative left-[-20px]">
          
          <XpLogo />
          
          <div className="flex flex-col text-white pb-2 relative">
            <span className="text-xl leading-none absolute top-[-20px] left-[5px] tracking-wide">
              Microsoft<sup className="text-[10px]">®</sup>
            </span>
            
            <div className="flex items-start leading-none relative">
              <span className="text-[6rem] font-bold tracking-tighter" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Windows
              </span>
              <sup className="text-[3rem] text-[#e86b24] absolute right-[-65px] top-[15px]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                xp
              </sup>
            </div>
            
            <span className="text-[2.2rem] leading-none mt-1 font-light tracking-widest text-white/90" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Professional
            </span>
          </div>
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
