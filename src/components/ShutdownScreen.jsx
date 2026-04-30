import React, { useEffect } from 'react';

export default function ShutdownScreen({ mode = 'shutdown', onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onComplete?.();
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black font-['Tahoma'] text-white select-none">
      <div className="text-center">
        <div className="text-[28px] font-bold tracking-wide">
          {mode === 'restart' ? 'Windows is restarting...' : 'It is now safe to turn off your computer.'}
        </div>
        <div className="mt-4 text-[13px] text-white/80">
          {mode === 'restart' ? 'Saving your settings and preparing the system.' : 'Windows Portfolio session closed.'}
        </div>
      </div>
    </div>
  );
}