import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, Volume2 } from 'lucide-react';
import { getXpTheme } from '../data/xpThemes';

export default function Taskbar({ openWindows = [], activeWindowId, onWindowClick, onStartClick, responsiveMode = 'desktop', theme = 'luna' }) {
  const [time, setTime] = useState(new Date());
  const isMobile = responsiveMode === 'mobile';
  const activeTheme = getXpTheme(theme);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={`absolute bottom-0 z-60 flex w-full items-center justify-between select-none bg-linear-to-b ${activeTheme.taskbar} shadow-[0_-1px_3px_rgba(0,0,0,0.5)] ${isMobile ? 'h-12' : 'h-10'}`}
      onClick={(e) => e.stopPropagation()} // Prevent clicks here from closing the start menu
    >
      
      {/* Start Button Area */}
      <div className="h-full flex items-center flex-1 overflow-hidden">
        <button 
          onClick={onStartClick}
          className={`relative z-10 flex h-full cursor-pointer items-center justify-center space-x-1 rounded-r-xl bg-linear-to-b ${activeTheme.startButton} text-lg font-bold italic text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:brightness-90 ${isMobile ? 'px-3' : 'px-4'}`}
        >
          <div className="flex flex-wrap w-5 h-5 mr-1 skew-y-[-10deg] skew-x-[-10deg]">
            <div className="w-1/2 h-1/2 bg-[#F86A27] border-b-[0.5px] border-r-[0.5px] border-transparent"></div>
            <div className="w-1/2 h-1/2 bg-[#7AB800] border-b-[0.5px] border-l-[0.5px] border-transparent"></div>
            <div className="w-1/2 h-1/2 bg-[#00A1F1] border-t-[0.5px] border-r-[0.5px] border-transparent"></div>
            <div className="w-1/2 h-1/2 bg-[#FFC300] border-t-[0.5px] border-l-[0.5px] border-transparent"></div>
          </div>
          <span className="drop-shadow-md pr-2 font-['Tahoma']">start</span>
        </button>

        <div className="h-full w-0.5 bg-linear-to-b from-[#ffffff60] to-[#00000040]"></div>

        {/* Taskbar Active Apps Area */}
        <div className="flex h-full flex-1 items-center space-x-1 overflow-x-auto px-2">
          {openWindows.map((win) => (
            <button 
              key={win.id}
              type="button"
              onClick={() => onWindowClick(win.id)}
              className={`flex h-[80%] items-center rounded-xs border font-['Tahoma'] transition-colors ${isMobile ? 'max-w-28 min-w-22 px-2' : 'w-full max-w-37.5 px-3'} ${
                win.isMinimized 
                  ? 'bg-[#3A6EA5] border-[#1e4178] text-white hover:bg-[#487ec2]' 
                  : win.id === activeWindowId
                    ? 'bg-[#1b44c6] border-[#0c2477] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
                    : 'bg-[#3A6EA5] border-[#1e4178] text-white hover:bg-[#487ec2]'
              }`}
            >
              <span className="text-xs truncate font-semibold">{win.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Tray */}
      <div className={`flex h-full items-center border-l border-[#1F2F86] bg-linear-to-b ${activeTheme.tray} text-xs tracking-wide text-white shadow-[inset_1px_0_1px_rgba(255,255,255,0.4)] font-['Tahoma'] ${isMobile ? 'px-2' : 'px-3'}`}>
        {!isMobile && (
          <div className="flex items-center space-x-2 opacity-90 pr-3">
            <ShieldCheck size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
            <Wifi size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
            <Volume2 size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
          </div>
        )}
        <span className="mt-px">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
