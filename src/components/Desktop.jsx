import { useEffect, useMemo, useState } from 'react';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import BalloonNotification from './BalloonNotification';
import ContextMenu from './ContextMenu';
import MyComputerApp from './apps/MyComputerApp';
import MyProjectsApp from './apps/MyProjectsApp';
import NotepadApp from './apps/NotepadApp';
import InternetExplorerApp from './apps/InternetExplorerApp';
import MyPicturesApp from './apps/MyPicturesApp';
import ImageViewerApp from './apps/ImageViewerApp';
import ImagePropertiesApp from './apps/ImagePropertiesApp';
import { portfolioData } from '../data/portfolioData';
import { getPicturesFolderIconUrl, pictureLibrary } from '../data/pictureLibrary';

const DEFAULT_WALLPAPER = 'https://wallpaperaccess.com/full/90278.jpg';
const WALLPAPER_STORAGE_KEY = 'xp-wallpaper-picture-id';
const PICTURE_STATE_STORAGE_KEY = 'xp-picture-state';

const readStoredValue = (key, fallbackValue) => {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const DESKTOP_ITEMS = [
  {
    id: 'computer',
    title: 'My Computer',
    position: { x: 10, y: 10 },
    iconSrc: new URL('../assets/My Computer (1).ico', import.meta.url).href,
  },
  {
    id: 'projects',
    title: 'My Projects',
    position: { x: 10, y: 100 },
    iconSrc: new URL('../assets/Folder View.ico', import.meta.url).href,
  },
  {
    id: 'pictures',
    title: 'My Pictures',
    position: { x: 10, y: 190 },
    iconSrc: getPicturesFolderIconUrl(),
  },
  {
    id: 'resume',
    title: 'Resume.txt',
    position: { x: 10, y: 280 },
    iconSrc: new URL('../assets/Notepad.ico', import.meta.url).href,
  },
  {
    id: 'recycle',
    title: 'Recycle Bin',
    position: { x: 10, y: 370 },
    iconSrc: new URL('../assets/Recycle Bin (full).ico', import.meta.url).href,
  },
  {
    id: 'ie',
    title: 'Internet Explorer',
    position: { x: 10, y: 460 },
    iconSrc: new URL('../assets/Internet Explorer 6.ico', import.meta.url).href,
  },
];

const WINDOW_LAYOUTS = {
  computer: { width: 760, height: 520 },
  projects: { width: 820, height: 560 },
  pictures: { width: 860, height: 580 },
  resume: { width: 700, height: 540 },
  recycle: { width: 540, height: 360 },
  ie: { width: 960, height: 640 },
  intro: { width: 520, height: 320 },
  imageViewer: { width: 900, height: 620 },
  imageProperties: { width: 640, height: 430 },
};

const getTopWindowId = (windowList) => {
  const topWindow = windowList
    .filter((windowItem) => !windowItem.isMinimized)
    .sort((firstWindow, secondWindow) => secondWindow.zIndex - firstWindow.zIndex)[0];

  return topWindow?.id ?? null;
};

const buildWindowEntry = (app, zIndex, openCount) => {
  const offset = openCount % 5;
  const appId = app.appId ?? app.id;
  const windowId = app.instanceId ?? app.id;
  const layout = app.initialSize || WINDOW_LAYOUTS[appId] || { width: 720, height: 520 };

  return {
    ...app,
    id: windowId,
    appId,
    isMinimized: false,
    zIndex,
    initialSize: layout,
    initialPosition: app.initialPosition ?? {
      x: 120 + (offset * 28),
      y: 72 + (offset * 22),
    },
  };
};

const DesktopIconWrapper = ({ item, selectedIcons, setSelectedIcons, contextMenu, setContextMenu, openWindow, handleIconContextMenu }) => {
  const handleClick = (event) => {
    event.stopPropagation();
    setSelectedIcons([item.id]);

    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }

    openWindow(item);
  };

  return (
    <div className="absolute inline-block select-none" style={{ left: item.position.x, top: item.position.y }}>
      <DesktopIcon
        label={item.title}
        iconSrc={item.iconSrc}
        isSelected={selectedIcons.includes(item.id)}
        onClick={handleClick}
        onDoubleClick={() => openWindow(item)}
        onContextMenu={(event) => handleIconContextMenu(event, item.id)}
      />
    </div>
  );
};

export default function Desktop() {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const [balloonExpanding, setBalloonExpanding] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: 'desktop', targetId: null });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [marquee, setMarquee] = useState(null);
  const [wallpaperPictureId, setWallpaperPictureId] = useState(() => readStoredValue(WALLPAPER_STORAGE_KEY, null));
  const [pictureState, setPictureState] = useState(() => readStoredValue(PICTURE_STATE_STORAGE_KEY, { deletedIds: [], renamedById: {} }));
  const icons = useMemo(() => DESKTOP_ITEMS, []);
  const pictures = useMemo(
    () => pictureLibrary
      .filter((picture) => !pictureState.deletedIds.includes(picture.id))
      .map((picture) => ({
        ...picture,
        displayName: pictureState.renamedById[picture.id] || picture.defaultDisplayName,
      })),
    [pictureState.deletedIds, pictureState.renamedById],
  );
  const wallpaperUrl = useMemo(() => {
    const selectedWallpaper = pictureLibrary.find((picture) => picture.id === wallpaperPictureId);
    return selectedWallpaper?.src ?? DEFAULT_WALLPAPER;
  }, [wallpaperPictureId]);

  useEffect(() => {
    window.localStorage.setItem(PICTURE_STATE_STORAGE_KEY, JSON.stringify(pictureState));
  }, [pictureState]);

  useEffect(() => {
    window.localStorage.setItem(WALLPAPER_STORAGE_KEY, JSON.stringify(wallpaperPictureId));
  }, [wallpaperPictureId]);

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const focusWindow = (id) => {
    setWindows((currentWindows) => {
      const nextZIndex = Math.max(80, ...currentWindows.map((windowItem) => windowItem.zIndex || 80)) + 1;

      return currentWindows.map((windowItem) => (
        windowItem.id === id ? { ...windowItem, zIndex: nextZIndex, isMinimized: false } : windowItem
      ));
    });
    setActiveWindowId(id);
  };

  const openWindow = (app) => {
    const windowId = app.instanceId ?? app.id;

    setWindows((currentWindows) => {
      const nextZIndex = Math.max(80, ...currentWindows.map((windowItem) => windowItem.zIndex || 80)) + 1;
      const existingWindow = currentWindows.find((windowItem) => windowItem.id === windowId);

      if (!existingWindow) {
        return [...currentWindows, buildWindowEntry(app, nextZIndex, currentWindows.length)];
      }

      return currentWindows.map((windowItem) => (
        windowItem.id === windowId
          ? { ...windowItem, ...app, isMinimized: false, zIndex: nextZIndex }
          : windowItem
      ));
    });
    setActiveWindowId(windowId);
  };

  const closeWindow = (id) => {
    setWindows((currentWindows) => {
      const nextWindows = currentWindows.filter((windowItem) => windowItem.id !== id);

      if (activeWindowId === id) {
        setActiveWindowId(getTopWindowId(nextWindows));
      }

      return nextWindows;
    });
  };

  const handleTaskbarWindowClick = (id) => {
    const targetWindow = windows.find((windowItem) => windowItem.id === id);

    if (!targetWindow) {
      return;
    }

    if (targetWindow.id === activeWindowId && !targetWindow.isMinimized) {
      const nextWindows = windows.map((windowItem) => (
        windowItem.id === id ? { ...windowItem, isMinimized: true } : windowItem
      ));

      setWindows(nextWindows);
      setActiveWindowId(getTopWindowId(nextWindows));
      return;
    }

    focusWindow(id);
  };

  const openPictureViewer = (picture) => {
    openWindow({
      instanceId: `viewer:${picture.id}`,
      appId: 'imageViewer',
      title: picture.displayName,
      payload: { picture },
      initialSize: WINDOW_LAYOUTS.imageViewer,
    });
  };

  const openPictureProperties = (picture) => {
    openWindow({
      instanceId: `properties:${picture.id}`,
      appId: 'imageProperties',
      title: `${picture.displayName} Properties`,
      payload: { picture },
      initialSize: WINDOW_LAYOUTS.imageProperties,
      initialPosition: { x: 160, y: 96 },
    });
  };

  const handleSetWallpaper = (pictureId) => {
    setWallpaperPictureId(pictureId);
  };

  const handleRenamePicture = (pictureId, displayName) => {
    setPictureState((currentState) => ({
      ...currentState,
      renamedById: {
        ...currentState.renamedById,
        [pictureId]: displayName,
      },
    }));

    setWindows((currentWindows) => currentWindows.map((windowItem) => {
      const picture = windowItem.payload?.picture;

      if (!picture || picture.id !== pictureId) {
        return windowItem;
      }

      const nextPicture = { ...picture, displayName };

      return {
        ...windowItem,
        title: windowItem.appId === 'imageProperties' ? `${displayName} Properties` : displayName,
        payload: { ...windowItem.payload, picture: nextPicture },
      };
    }));
  };

  const handleDeletePicture = (pictureId) => {
    setPictureState((currentState) => ({
      ...currentState,
      deletedIds: currentState.deletedIds.includes(pictureId)
        ? currentState.deletedIds
        : [...currentState.deletedIds, pictureId],
    }));

    setWindows((currentWindows) => {
      const nextWindows = currentWindows.filter((windowItem) => windowItem.payload?.picture?.id !== pictureId);

      if (!nextWindows.some((windowItem) => windowItem.id === activeWindowId && !windowItem.isMinimized)) {
        setActiveWindowId(getTopWindowId(nextWindows));
      }

      return nextWindows;
    });

    if (wallpaperPictureId === pictureId) {
      setWallpaperPictureId(null);
    }
  };

  const handleMouseDown = (event) => {
    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }

    if (isStartMenuOpen) {
      setIsStartMenuOpen(false);
    }

    if (event.target.id === 'desktop-bg') {
      setMarquee({ startX: event.clientX, startY: event.clientY, left: event.clientX, top: event.clientY, width: 0, height: 0 });
      setSelectedIcons([]);
    }
  };

  const handleBalloonClick = () => {
    setBalloonExpanding(true);
    setTimeout(() => {
      setShowBalloon(false);
      setBalloonExpanding(false);
      openWindow({ id: 'intro', title: 'Introduction' });
    }, 280);
  };

  const handleMouseMove = (event) => {
    if (!marquee) {
      return;
    }

    const currentX = event.clientX;
    const currentY = event.clientY;
    const left = Math.min(marquee.startX, currentX);
    const top = Math.min(marquee.startY, currentY);
    const width = Math.abs(marquee.startX - currentX);
    const height = Math.abs(marquee.startY - currentY);

    setMarquee((currentMarquee) => ({ ...currentMarquee, left, top, width, height }));

    const newSelected = [];
    icons.forEach((icon) => {
      const iconRect = { left: icon.position.x, top: icon.position.y, right: icon.position.x + 80, bottom: icon.position.y + 80 };
      const selectionRect = { left, top, right: left + width, bottom: top + height };

      if (!(iconRect.left > selectionRect.right || iconRect.right < selectionRect.left || iconRect.top > selectionRect.bottom || iconRect.bottom < selectionRect.top)) {
        newSelected.push(icon.id);
      }
    });

    setSelectedIcons(newSelected);
  };

  const handleMouseUp = () => {
    if (marquee) {
      setMarquee(null);
    }
  };

  const handleDesktopContextMenu = (event) => {
    event.preventDefault();

    if (event.target.id === 'desktop-bg') {
      setContextMenu({ visible: true, x: event.clientX, y: event.clientY, type: 'desktop', targetId: null });
    }
  };

  const handleIconContextMenu = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedIcons([id]);
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, type: 'icon', targetId: id });
  };

  const handleContextAction = (action) => {
    if (action === 'refresh') {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 150);
      return;
    }

    if (action === 'open' && contextMenu.targetId) {
      const app = icons.find((icon) => icon.id === contextMenu.targetId);
      if (app) {
        openWindow(app);
      }
      return;
    }

    if (action === 'delete') {
      alert('Cannot delete system icons!');
    }
  };

  const renderAppContent = (windowItem) => {
    switch (windowItem.appId) {
      case 'computer':
        return <MyComputerApp />;
      case 'projects':
        return <MyProjectsApp />;
      case 'pictures':
        return (
          <MyPicturesApp
            pictures={pictures}
            onOpenImage={openPictureViewer}
            onSetWallpaper={handleSetWallpaper}
            onDeletePicture={handleDeletePicture}
            onRenamePicture={handleRenamePicture}
            onOpenProperties={openPictureProperties}
          />
        );
      case 'ie':
        return <InternetExplorerApp />;
      case 'resume':
        return <NotepadApp />;
      case 'imageViewer':
        return <ImageViewerApp picture={windowItem.payload?.picture} />;
      case 'imageProperties':
        return <ImagePropertiesApp picture={windowItem.payload?.picture} />;
      case 'intro':
        return (
          <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center font-['Tahoma']">
            <h2 className="mb-4 text-2xl font-bold text-[#003399] drop-shadow-sm">Welcome!</h2>
            <p className="max-w-md text-sm leading-relaxed text-gray-800">{portfolioData.profile.summary}</p>
          </div>
        );
      case 'recycle':
        return <div className="flex h-full items-center justify-center p-4 font-['Tahoma'] text-gray-500">Recycle Bin is empty.</div>;
      default:
        return <div className="p-4">Unknown Application</div>;
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#2250E5] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${wallpaperUrl}')` }}
      onContextMenu={handleDesktopContextMenu}
    >
      <div
        id="desktop-bg"
        className={`relative h-[calc(100vh-40px)] w-full ${isRefreshing ? 'opacity-0' : 'opacity-100 transition-opacity'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {icons.map((item) => (
          <DesktopIconWrapper
            key={item.id}
            item={item}
            selectedIcons={selectedIcons}
            setSelectedIcons={setSelectedIcons}
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            openWindow={openWindow}
            handleIconContextMenu={handleIconContextMenu}
          />
        ))}

        {marquee && (
          <div
            className="pointer-events-none absolute z-50 border border-dotted border-[#316ac5] bg-[#316ac5]/30"
            style={{ left: marquee.left, top: marquee.top, width: marquee.width, height: marquee.height }}
          />
        )}
      </div>

      {windows
        .slice()
        .sort((firstWindow, secondWindow) => firstWindow.zIndex - secondWindow.zIndex)
        .map((windowItem) => (
          !windowItem.isMinimized && (
            <Window
              key={windowItem.id}
              windowId={windowItem.id}
              title={windowItem.title}
              zIndex={windowItem.zIndex}
              isActive={activeWindowId === windowItem.id}
              initialPosition={windowItem.initialPosition}
              initialSize={windowItem.initialSize}
              onFocus={() => focusWindow(windowItem.id)}
              onClose={() => closeWindow(windowItem.id)}
              onMinimize={() => handleTaskbarWindowClick(windowItem.id)}
            >
              {renderAppContent(windowItem)}
            </Window>
          )
        ))}

      <StartMenu
        isOpen={isStartMenuOpen}
        toggleMenu={() => setIsStartMenuOpen(false)}
        onOpenWindow={(id) => {
          const target = icons.find((icon) => icon.id === id);
          if (target) {
            openWindow(target);
          }
        }}
        contacts={portfolioData.contacts}
      />

      <Taskbar
        openWindows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarWindowClick}
        onStartClick={(event) => {
          event.stopPropagation();
          setIsStartMenuOpen(!isStartMenuOpen);
        }}
      />

      {showBalloon && (
        <BalloonNotification
          onClose={() => setShowBalloon(false)}
          onClick={handleBalloonClick}
          isExpanding={balloonExpanding}
        />
      )}

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onAction={handleContextAction}
        />
      )}
    </div>
  );
}
