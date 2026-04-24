import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function BalloonNotification({ onClose, onClick, isExpanding }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Wait 2 seconds before showing
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Play the balloon pop sound. Using a generic 'ding' or 'hardware' sound since 'balloon' might 404, 
      // but let's try 'windows-xp-balloon.mp3' first or fallback to ding.
      const audioUrl = 'https://www.myinstants.com/media/sounds/windows-xp-ding.mp3'; 
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.log('Audio playback prevented'));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`absolute bottom-12 right-4 z-70 w-64 origin-bottom-right cursor-pointer rounded-md border border-black bg-[#ffffe1] p-3 font-['Tahoma'] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] ${isExpanding ? 'animate-grow-out' : 'animate-slide-up'}`}
      onClick={onClick}
    >
      {/* The Stem pointing to the system tray */}
      <div className="absolute -bottom-2.5 right-10 h-0 w-0 border-r-10 border-r-transparent border-l-10 border-l-transparent border-t-10 border-t-black"></div>
      <div className="absolute -bottom-2 right-10.25 h-0 w-0 border-r-9 border-r-transparent border-l-9 border-l-transparent border-t-9 border-t-[#ffffe1]"></div>

      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1b44c6] pb-px text-[10px] font-bold italic text-white shadow-sm font-serif">i</div>
          <span className="font-bold text-xs text-black">Welcome to my Portfolio!</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-gray-600 hover:text-black">
          <X size={14} />
        </button>
      </div>
      <p className="text-xs text-black leading-snug">
        Click here to learn more about this project.
      </p>
    </div>
  );
}
