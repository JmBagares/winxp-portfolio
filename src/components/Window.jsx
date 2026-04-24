import React, { useEffect, useRef, useState } from 'react';

export default function Window({
  windowId,
  title,
  zIndex,
  isActive,
  initialPosition,
  initialSize,
  onFocus,
  onClose,
  onMinimize,
  children,
}) {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState(initialPosition ?? { x: 120, y: 72 });
  const [size, setSize] = useState(initialSize ?? { width: 720, height: 520 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [restoreState, setRestoreState] = useState(null);

  const clampSize = (nextWidth, nextHeight, parentWidth, parentHeight) => ({
    width: Math.max(420, Math.min(nextWidth, parentWidth - 24)),
    height: Math.max(260, Math.min(nextHeight, parentHeight - 48)),
  });

  const handleFocus = () => {
    onFocus?.(windowId);
  };

  const clampPosition = (nextX, nextY, nextSize = size) => {
    const parent = nodeRef.current?.parentElement;

    if (!parent) {
      return { x: nextX, y: nextY };
    }

    const maxX = Math.max(0, parent.clientWidth - nextSize.width - 8);
    const maxY = Math.max(0, parent.clientHeight - 40 - nextSize.height);

    return {
      x: Math.max(0, Math.min(nextX, maxX)),
      y: Math.max(0, Math.min(nextY, maxY)),
    };
  };

  const startDrag = (event) => {
    if (isMaximized || event.button !== 0) {
      return;
    }

    event.preventDefault();
    handleFocus();

    const startX = event.clientX;
    const startY = event.clientY;
    const initialWindowPosition = position;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const nextPosition = clampPosition(initialWindowPosition.x + deltaX, initialWindowPosition.y + deltaY);
      setPosition(nextPosition);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const toggleMaximize = () => {
    const parent = nodeRef.current?.parentElement;

    if (!parent) {
      return;
    }

    if (isMaximized && restoreState) {
      setPosition(restoreState.position);
      setSize(restoreState.size);
      setIsMaximized(false);
      return;
    }

    setRestoreState({ position, size });
    setPosition({ x: 0, y: 0 });
    setSize({ width: parent.clientWidth, height: parent.clientHeight - 40 });
    setIsMaximized(true);
  };

  useEffect(() => {
    if (!isMaximized) {
      return undefined;
    }

    const handleResize = () => {
      const parent = nodeRef.current?.parentElement;

      if (!parent) {
        return;
      }

      setPosition({ x: 0, y: 0 });
      setSize({ width: parent.clientWidth, height: parent.clientHeight - 40 });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMaximized]);

  useEffect(() => {
    if (isMaximized) {
      return;
    }

    setPosition((currentPosition) => clampPosition(currentPosition.x, currentPosition.y));
  }, [isMaximized, size.width, size.height]);

  const startResize = (direction, event) => {
    event.preventDefault();
    event.stopPropagation();
    handleFocus();

    if (isMaximized) {
      return;
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const initialWindowSize = size;
    const initialWindowPosition = position;

    const onMouseMove = (moveEvent) => {
      const parent = nodeRef.current?.parentElement;

      if (!parent) {
        return;
      }

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      let nextWidth = initialWindowSize.width;
      let nextHeight = initialWindowSize.height;
      let nextX = initialWindowPosition.x;
      let nextY = initialWindowPosition.y;

      if (direction.includes('right')) {
        nextWidth = initialWindowSize.width + deltaX;
      }

      if (direction.includes('bottom')) {
        nextHeight = initialWindowSize.height + deltaY;
      }

      if (direction.includes('left')) {
        nextWidth = initialWindowSize.width - deltaX;
        nextX = initialWindowPosition.x + deltaX;
      }

      if (direction.includes('top')) {
        nextHeight = initialWindowSize.height - deltaY;
        nextY = initialWindowPosition.y + deltaY;
      }

      nextX = Math.max(0, nextX);
      nextY = Math.max(0, nextY);

      const maxWidth = parent.clientWidth - nextX;
      const maxHeight = parent.clientHeight - 40 - nextY;
      const clamped = clampSize(nextWidth, nextHeight, maxWidth + 24, maxHeight + 48);

      if (direction.includes('left')) {
        nextX = initialWindowPosition.x + (initialWindowSize.width - clamped.width);
      }

      if (direction.includes('top')) {
        nextY = initialWindowPosition.y + (initialWindowSize.height - clamped.height);
      }

      const clampedPosition = clampPosition(nextX, nextY, clamped);
      setPosition(clampedPosition);
      setSize(clamped);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const resizeHandles = [
    { direction: 'right', className: 'top-2 right-0 h-[calc(100%-16px)] w-2 cursor-ew-resize' },
    { direction: 'left', className: 'top-2 left-0 h-[calc(100%-16px)] w-2 cursor-ew-resize' },
    { direction: 'bottom', className: 'bottom-0 left-2 h-2 w-[calc(100%-16px)] cursor-ns-resize' },
    { direction: 'top', className: 'top-0 left-2 h-2 w-[calc(100%-16px)] cursor-ns-resize' },
    { direction: 'bottom-right', className: 'bottom-0 right-0 h-4 w-4 cursor-nwse-resize' },
    { direction: 'bottom-left', className: 'bottom-0 left-0 h-4 w-4 cursor-nesw-resize' },
    { direction: 'top-right', className: 'top-0 right-0 h-4 w-4 cursor-nesw-resize' },
    { direction: 'top-left', className: 'top-0 left-0 h-4 w-4 cursor-nwse-resize' },
  ];

  return (
    <div
      ref={nodeRef}
      className={`absolute flex flex-col overflow-hidden rounded-t-lg bg-[#0055e5] pb-1 px-1 shadow-2xl ${isActive ? 'ring-1 ring-white/35' : ''}`}
      onMouseDown={handleFocus}
      style={{ left: `${position.x}px`, top: `${position.y}px`, width: `${size.width}px`, height: `${size.height}px`, zIndex }}
    >
      <div
        className="window-header flex cursor-grab items-center justify-between rounded-t-md bg-linear-to-b from-[#0058ee] via-[#3593ff] to-[#0058ee] px-2 py-1 active:cursor-grabbing"
        onDoubleClick={toggleMaximize}
        onMouseDown={startDrag}
      >
        <span className="select-none text-sm font-bold tracking-wide text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.8)]">
          {title}
        </span>

        <div className="window-controls flex space-x-0.5">
          <button type="button" onClick={onMinimize} className="flex h-5.5 w-5.5 items-center justify-center rounded-xs border border-white bg-[#3a72f0] shadow-sm hover:bg-[#5b8af4] active:bg-[#1a4dc0]">
            <span className="mt-2 h-0.5 w-2.5 bg-white"></span>
          </button>
          <button type="button" onClick={toggleMaximize} className="flex h-5.5 w-5.5 items-center justify-center rounded-xs border border-white bg-[#3a72f0] shadow-sm hover:bg-[#5b8af4] active:bg-[#1a4dc0]">
            <span className="mt-px h-2.5 w-2.5 border-2 border-white"></span>
          </button>
          <button type="button" onClick={onClose} className="flex h-5.5 w-5.5 items-center justify-center rounded-xs border border-white bg-[#e04343] shadow-sm hover:bg-[#ff5a5a] active:bg-[#b02222]">
            <span className="mb-0.5 text-lg font-bold leading-none text-white drop-shadow-sm">×</span>
          </button>
        </div>
      </div>

      <div className="mt-0.5 flex min-h-0 flex-1 flex-col bg-[#ece9d8] p-1">
        <div className="relative flex-1 min-h-0 overflow-auto border-t-2 border-r-2 border-b-2 border-l-2 border-t-black/40 border-r-white border-b-white border-l-black/40 bg-white p-4">
          {children}
        </div>
      </div>

      {!isMaximized && resizeHandles.map((handle) => (
        <div
          key={handle.direction}
          className={`absolute ${handle.className}`}
          onMouseDown={(event) => startResize(handle.direction, event)}
        />
      ))}
    </div>
  );
}
