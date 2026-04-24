import React, { useEffect } from 'react';

export default function ContextMenu({ x, y, type, onClose, onAction }) {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  const desktopItems = [
    { label: 'Arrange Icons By', disabled: true, hasChildren: true },
    { label: 'Refresh', action: 'refresh' },
    { divider: true },
    { label: 'Paste', disabled: true },
    { label: 'Paste Shortcut', disabled: true },
    { divider: true },
    { label: 'Properties', disabled: true }
  ];

  const iconItems = [
    { label: 'Open', action: 'open', bold: true },
    { label: 'Explore', disabled: true },
    { divider: true },
    { label: 'Cut', disabled: true },
    { label: 'Copy', disabled: true },
    { divider: true },
    { label: 'Delete', action: 'delete' },
    { label: 'Rename', disabled: true },
  ];

  const items = type === 'icon' ? iconItems : desktopItems;

  // Make sure menu doesn't overflow screen
  const safeX = Math.min(x, window.innerWidth - 180);
  const safeY = Math.min(y, window.innerHeight - 200);

  return (
    <div 
      className="fixed z-[100] bg-white border border-[#aca899] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] flex flex-col font-['Tahoma'] text-[11px] py-[2px] min-w-[150px] cursor-default select-none"
      style={{ top: safeY, left: safeX }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {/* Vertical Blue/Gray Stripe */}
      <div className="absolute top-0 left-0 bottom-0 w-6 bg-gradient-to-r from-[#e3e3e3] to-[#ece9d8] border-r border-[#e0dfdb] z-0"></div>
      
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className="h-[1px] bg-[#aca899] mx-[2px] my-1 ml-7 relative z-10 shadow-[0_1px_0_rgba(255,255,255,1)]"></div>;
        }
        return (
          <div 
            key={i}
            className={`flex items-center px-4 py-[3px] ml-1 mr-1 relative z-10 ${item.disabled ? 'text-[#aca899]' : 'text-black hover:bg-[#316ac5] hover:text-white'} ${item.bold ? 'font-bold' : ''}`}
            onClick={() => {
              if (!item.disabled && item.action) {
                onAction(item.action);
                onClose();
              }
            }}
          >
            <span className="ml-6 flex-1">{item.label}</span>
            {item.hasChildren && <span className="ml-4 text-[9px] font-sans leading-none mt-[1px]">▶</span>}
          </div>
        );
      })}
    </div>
  );
}
