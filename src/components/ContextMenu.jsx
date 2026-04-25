import { useEffect } from 'react';

export default function ContextMenu({ x, y, type, items: customItems, onClose, onAction }) {
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

  const items = customItems?.length ? customItems : (type === 'icon' ? iconItems : desktopItems);

  const estimatedHeight = Math.max(80, items.length * 22);
  const safeX = Math.min(x, window.innerWidth - 190);
  const safeY = Math.min(y, window.innerHeight - estimatedHeight);

  return (
    <div 
      className="fixed z-100 min-w-44 cursor-default select-none border border-[#7f7f7f] bg-white py-0.5 font-['Tahoma'] text-[11px] shadow-[2px_2px_5px_rgba(0,0,0,0.35)]"
      style={{ top: safeY, left: safeX }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className="mx-0.5 my-[3px] h-px bg-[#c3c3c3] shadow-[0_1px_0_rgba(255,255,255,0.95)]"></div>;
        }
        return (
          <div 
            key={i}
            className={`flex items-center px-3 py-0.75 ${item.disabled ? 'text-[#aca899]' : 'text-black hover:bg-[#316ac5] hover:text-white'} ${item.bold ? 'font-bold' : ''}`}
            onClick={() => {
              if (!item.disabled && item.action) {
                onAction(item.action);
                onClose();
              }
            }}
          >
            <span className="flex-1">{item.label}</span>
            {item.hasChildren && <span className="mt-px ml-4 text-[9px] leading-none font-sans">▶</span>}
          </div>
        );
      })}
    </div>
  );
}
