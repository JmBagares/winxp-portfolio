import React, { useState } from 'react';
import { Power } from 'lucide-react';
import WindowsXpBranding from './WindowsXpBranding';
import { areSystemSoundsEnabled } from '../utils/systemSounds';

export default function LoginScreen({ onLogin }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);

    if (areSystemSoundsEnabled()) {
      const audioUrl = 'https://www.myinstants.com/media/sounds/windows-xp-startup.mp3';
      const a1 = new Audio(audioUrl);
      const a2 = new Audio(audioUrl);
      const a3 = new Audio(audioUrl);

      a1.play().catch(() => {});
      a2.play().catch(() => {});
      a3.play().catch(() => {});
    }
    
    // Delay the transition to Desktop to allow the animation and sound to play
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className={`w-screen h-screen overflow-hidden flex flex-col select-none transition-all duration-1500 ease-in-out ${isLoggingIn ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`} style={{ backgroundColor: '#003399' }}>
      
      {/* Top Banner */}
      <div className="h-24 bg-linear-to-b from-[#1b3499] to-[#2753c4] border-b-2 border-white/20 shadow-md"></div>
      
      {/* Main Content Area */}
      <div className="flex flex-1 bg-linear-to-r from-[#2954c2] via-[#3a6edb] to-[#2954c2]">
        
        {/* Left Side */}
        <div className="w-1/2 flex flex-col justify-center items-end pr-10 relative">
          {/* Vertical fading line divider */}
          <div className="absolute right-0 top-[10%] h-[80%] w-px bg-linear-to-b from-transparent via-white/60 to-transparent shadow-[1px_0_2px_rgba(0,0,0,0.5)]"></div>
          
          <WindowsXpBranding
            className="mb-6 mr-4"
            textColor="#111111"
            microsoftColor="#111111"
            windowsSizeClass="text-[4.8rem]"
            xpSizeClass="text-[2.5rem]"
            microsoftSizeClass="text-[0.95rem]"
            flagWidthClass="w-32"
          />
          <p className="text-white text-lg font-['Tahoma'] mr-4 drop-shadow-md text-shadow-desktop">
            To begin, click your user name
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex flex-col justify-center pl-10 space-y-6">
          {/* Guest Profile */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group w-80 p-2 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
            onClick={handleLogin}
          >
            <div className="w-16 h-16 rounded-md border-[3px] border-white/90 overflow-hidden shadow-lg group-hover:border-yellow-400 transition-colors bg-[#ece9d8]">
              <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest&backgroundColor=transparent" alt="Guest" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-['Tahoma'] drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] group-hover:text-white font-semibold">Guest</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Banner */}
      <div className="relative flex h-24 items-center justify-between bg-linear-to-b from-[#2753c4] to-[#1b3499] border-t-2 border-white/20 px-8 shadow-md">
        <div className="absolute top-0 left-0 h-px w-full bg-black/30"></div>
         
         <button className="flex items-center space-x-2 text-white hover:brightness-110 cursor-pointer p-2 rounded hover:bg-white/10 border border-transparent hover:border-white/20 transition-all">
           <div className="bg-[#e04343] rounded-md p-1.5 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.4)] border border-white/40"><Power size={22} /></div>
           <span className="text-lg font-['Tahoma'] font-bold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">Turn off computer</span>
         </button>
         
         <div className="flex items-center text-white/90 cursor-help pr-10">
           <span className="text-sm font-['Tahoma'] leading-tight drop-shadow-md">
             After you log on, you can add or change accounts.<br/>
             Just go to Control Panel and click User Accounts.
           </span>
         </div>
      </div>
    </div>
  );
}
