import React from 'react';

export default function DesktopIcon({ icon: Icon, iconElement, iconSrc, overlayElement, label, onDoubleClick, onContextMenu, isSelected, onClick }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <div 
      className="xp-desktop-icon group relative flex w-[76px] cursor-pointer flex-col items-center justify-start"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isSelected}
    >
      <div className="relative mb-[2px] flex h-12 w-12 items-center justify-center rounded-sm group-focus-visible:outline group-focus-visible:outline-1 group-focus-visible:outline-[#f3f9ff] group-focus-visible:outline-offset-1">
        {iconElement
          ? <div>{iconElement}</div>
          : iconSrc
            ? <img src={iconSrc} alt="" aria-hidden="true" className={`h-8 w-8 object-contain ${isSelected ? 'brightness-[1.06]' : ''} drop-shadow-[1px_2px_2px_rgba(0,0,0,0.65)]`} />
            : Icon && <Icon size={32} className="text-white drop-shadow-[1px_2px_2px_rgba(0,0,0,0.8)]" />
        }
        {overlayElement && <div className="pointer-events-none absolute -bottom-0.5 -right-0.5">{overlayElement}</div>}
      </div>
      <span className={`xp-desktop-label ${isSelected ? 'xp-desktop-label-selected' : ''}`}>
        {label}
      </span>
    </div>
  );
}
