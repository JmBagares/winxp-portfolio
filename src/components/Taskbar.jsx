import React, { useState, useEffect } from 'react';
import { ShieldCheck, Wifi, Volume2 } from 'lucide-react';

export default function Taskbar({ openWindows = [], activeWindowId, onWindowClick, onStartClick }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="absolute bottom-0 z-60 flex h-10 w-full items-center justify-between select-none bg-linear-to-b from-[#1F2F86] via-[#3165CA] to-[#1F2F86] shadow-[0_-1px_3px_rgba(0,0,0,0.5)]"
      onClick={(e) => e.stopPropagation()} // Prevent clicks here from closing the start menu
    >
      
      {/* Start Button Area */}
      <div className="h-full flex items-center flex-1 overflow-hidden">
        <button 
          onClick={onStartClick}
          className="relative z-10 flex h-full cursor-pointer items-center justify-center space-x-1 rounded-r-xl bg-linear-to-b from-[#3E9F45] via-[#4FBE56] to-[#3E9F45] px-4 text-lg italic text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:brightness-90 font-bold"
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
        <div className="flex-1 flex px-2 space-x-1 h-full items-center overflow-x-auto">
          {openWindows.map((win) => (
            <button 
              key={win.id}
              type="button"
              onClick={() => onWindowClick(win.id)}
              className={`flex h-[80%] w-full max-w-37.5 items-center rounded-xs border px-3 font-['Tahoma'] transition-colors ${
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
      <div className="flex h-full items-center border-l border-[#1F2F86] bg-linear-to-b from-[#0E8FE8] via-[#15ACF6] to-[#0E8FE8] px-3 text-xs tracking-wide text-white shadow-[inset_1px_0_1px_rgba(255,255,255,0.4)] font-['Tahoma']">
        <div className="flex items-center space-x-2 opacity-90 pr-3">
          <ShieldCheck size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
          <Wifi size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
          <Volume2 size={14} className="cursor-pointer hover:opacity-100 drop-shadow-sm" />
        </div>
        <span className="mt-px">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
