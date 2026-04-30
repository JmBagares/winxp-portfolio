import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, MessageCircleMore, Settings2 } from 'lucide-react';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import BalloonNotification from './BalloonNotification';
import ContextMenu from './ContextMenu';
import CommandPalette from './CommandPalette';
import WindowsXpBranding from './WindowsXpBranding';
import MyComputerApp from './apps/MyComputerApp';
import MyProjectsApp from './apps/MyProjectsApp';
import NotepadApp from './apps/NotepadApp';
import InternetExplorerApp from './apps/InternetExplorerApp';
import MyPicturesApp from './apps/MyPicturesApp';
import ImageViewerApp from './apps/ImageViewerApp';
import ImagePropertiesApp from './apps/ImagePropertiesApp';
import MessengerApp from './apps/MessengerApp';
import ControlPanelApp from './apps/ControlPanelApp';
import RunDialogApp from './apps/RunDialogApp';
import WinverApp from './apps/WinverApp';
import { portfolioData } from '../data/portfolioData';
import { getPicturesFolderIconUrl, pictureLibrary } from '../data/pictureLibrary';
import { getXpTheme } from '../data/xpThemes';
import { playSystemSound } from '../utils/systemSounds';
import {
  PICTURE_STATE_STORAGE_KEY,
  WALLPAPER_STORAGE_KEY,
  XP_SOUNDS_ENABLED_STORAGE_KEY,
  XP_THEME_STORAGE_KEY,
  readStoredValue,
  writeStoredValue,
} from '../utils/systemSettings';
import { useVfs } from '../contexts/VfsContext';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1100;
const DEFAULT_WALLPAPER = 'https://wallpaperaccess.com/full/90278.jpg';
const IDLE_TIMEOUT_MS = 45000;

const SECURITY_REPORT_CONTENT = [
  'SYSTEM SECURITY REPORT',
  '======================',
  '',
  'Status: INCIDENT CONFIRMED',
  'Date: 27 APR 2026',
  'Subsystem: explorer.exe desktop shell',
  '',
  'Summary:',
  '- User opened a restricted folder marked DO NOT OPEN.',
  '- Desktop session was interrupted by a hostile glitch payload.',
  '- Emergency reboot sequence was forced to preserve the shell.',
  '- Restricted folder has been quarantined and removed from the desktop.',
  '',
  'Evidence:',
  '- ORA-01017: invalid username/password',
  '- SECURITY ERROR: RLS POLICY BREACH',
  '- DROP TABLE USERS; intercepted during shell corruption event',
  '',
  'Action Taken:',
  '- Rebooted through Windows XP boot sequence.',
  '- Replaced compromised folder with this report.',
  '- Further interaction with unknown folders is not recommended.',
].join('\n');

const COMMAND_DEFINITIONS = [
  { command: 'winver', label: 'About Windows', description: 'Open the Windows XP Portfolio version dialog.' },
  { command: 'notepad', label: 'Notepad', description: 'Open a plain text note window.' },
  { command: 'iexplore', label: 'Internet Explorer', description: 'Launch the portfolio browser.' },
  { command: 'control', label: 'Control Panel', description: 'Open system settings for wallpaper, themes, and sounds.' },
  { command: 'explorer', label: 'Windows Explorer', description: 'Open My Computer and browse the fake disk tree.' },
  { command: 'msnmsgr', label: 'MSN Messenger', description: 'Launch the portfolio messenger window.' },
  { command: 'shutdown', label: 'Turn Off Computer', description: 'Start the XP shutdown flow.' },
];

const DEFAULT_ICON_POSITIONS = {
  computer: { x: 10, y: 10 },
  projects: { x: 10, y: 100 },
  pictures: { x: 10, y: 190 },
  resume: { x: 10, y: 280 },
  recycle: { x: 10, y: 370 },
  ie: { x: 10, y: 460 },
  messenger: { x: 100, y: 10 },
  controlPanel: { x: 100, y: 100 },
  doNotOpen: { x: 100, y: 190 },
  securityReport: { x: 100, y: 190 },
};

const WINDOW_LAYOUTS = {
  computer: { width: 900, height: 620 },
  projects: { width: 920, height: 610 },
  pictures: { width: 860, height: 580 },
  resume: { width: 700, height: 540 },
  recycle: { width: 540, height: 360 },
  ie: { width: 980, height: 650 },
  messenger: { width: 900, height: 560 },
  controlPanel: { width: 920, height: 620 },
  runDialog: { width: 520, height: 250 },
  winver: { width: 580, height: 460 },
  securityReport: { width: 740, height: 560 },
  intro: { width: 520, height: 320 },
  imageViewer: { width: 900, height: 620 },
  imageProperties: { width: 640, height: 430 },
};

const APP_SOUND_TYPES = {
  computer: 'folder',
  projects: 'folder',
  pictures: 'folder',
  messenger: 'click',
  controlPanel: 'click',
  runDialog: 'click',
  winver: 'click',
  resume: 'click',
  recycle: 'click',
  ie: 'click',
  securityReport: 'click',
};

const getTopWindowId = (windowList) => {
  const topWindow = windowList
    .filter((windowItem) => !windowItem.isMinimized)
    .sort((firstWindow, secondWindow) => secondWindow.zIndex - firstWindow.zIndex)[0];

  return topWindow?.id ?? null;
};

const WarningBadge = () => (
  <div className="rounded-full border border-[#6b1200] bg-linear-to-b from-[#ffd978] to-[#ff9b22] p-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
    <AlertTriangle size={10} strokeWidth={2.4} className="text-[#8a2b00]" />
  </div>
);

const MessengerIcon = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2b4d95] bg-linear-to-b from-[#92b9ff] via-[#4d7fe0] to-[#295dbd] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
    <MessageCircleMore size={18} className="text-white" />
  </div>
);

const ControlPanelIcon = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded border border-[#6a6a6a] bg-linear-to-b from-[#f5f5f5] to-[#c9c9c9] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
    <Settings2 size={17} className="text-[#2754aa]" />
  </div>
);

const buildDesktopItems = ({ isSecurityCompromised, iconPositions }) => {
  const resolvePosition = (id, fallbackId = id) => (
    iconPositions[id] || iconPositions[fallbackId] || DEFAULT_ICON_POSITIONS[id] || DEFAULT_ICON_POSITIONS[fallbackId]
  );

  const baseItems = [
    { id: 'computer', title: 'My Computer', position: resolvePosition('computer'), iconSrc: new URL('../assets/My Computer (1).ico', import.meta.url).href },
    { id: 'projects', title: 'My Projects', position: resolvePosition('projects'), iconSrc: new URL('../assets/Folder View.ico', import.meta.url).href },
    { id: 'pictures', title: 'My Pictures', position: resolvePosition('pictures'), iconSrc: getPicturesFolderIconUrl() },
    { id: 'resume', title: 'Resume.txt', position: resolvePosition('resume'), iconSrc: new URL('../assets/Notepad.ico', import.meta.url).href },
    { id: 'recycle', title: 'Recycle Bin', position: resolvePosition('recycle'), iconSrc: new URL('../assets/Recycle Bin (full).ico', import.meta.url).href },
    { id: 'ie', title: 'Internet Explorer', position: resolvePosition('ie'), iconSrc: new URL('../assets/Internet Explorer 6.ico', import.meta.url).href },
    { id: 'messenger', title: 'MSN Messenger', position: resolvePosition('messenger'), iconElement: <MessengerIcon /> },
    { id: 'controlPanel', title: 'Control Panel', position: resolvePosition('controlPanel'), iconElement: <ControlPanelIcon /> },
  ];

  if (isSecurityCompromised) {
    return [
      ...baseItems,
      {
        id: 'securityReport',
        title: 'System Security Report.txt',
        position: resolvePosition('securityReport', 'doNotOpen'),
        iconSrc: new URL('../assets/Notepad.ico', import.meta.url).href,
        overlayElement: <WarningBadge />,
      },
    ];
  }

  return [
    ...baseItems,
    {
      id: 'doNotOpen',
      title: 'DO NOT OPEN',
      position: resolvePosition('doNotOpen'),
      iconSrc: getPicturesFolderIconUrl(),
      overlayElement: <WarningBadge />,
      openOnClick: false,
      onDoubleActivate: 'securityBreach',
    },
  ];
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
    initialPosition: app.initialPosition ?? { x: 120 + (offset * 28), y: 72 + (offset * 22) },
  };
};

function DesktopIconWrapper({ item, selectedIcons, setSelectedIcons, contextMenu, setContextMenu, openWindow, handleIconContextMenu, onTriggerSecurityBreach, onMoveIcon }) {
  const dragStateRef = useRef(null);
  const suppressClickRef = useRef(false);

  const handleMouseDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const initialPosition = item.position;

    dragStateRef.current = { startX, startY, initialPosition, moved: false };

    const onMouseMove = (moveEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      const deltaX = moveEvent.clientX - dragState.startX;
      const deltaY = moveEvent.clientY - dragState.startY;

      if (!dragState.moved && Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) {
        return;
      }

      dragState.moved = true;
      suppressClickRef.current = true;
      onMoveIcon(item.id, { x: dragState.initialPosition.x + deltaX, y: dragState.initialPosition.y + deltaY });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const dragState = dragStateRef.current;
      dragStateRef.current = null;

      if (dragState?.moved) {
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    if (suppressClickRef.current) {
      return;
    }

    setSelectedIcons([item.id]);

    if (contextMenu.visible) {
      setContextMenu({ ...contextMenu, visible: false });
    }

    if (item.openOnClick === false) {
      return;
    }

    openWindow(item);
  };

  const handleDoubleClick = () => {
    if (item.onDoubleActivate === 'securityBreach') {
      onTriggerSecurityBreach?.();
      return;
    }

    openWindow(item);
  };

  return (
    <div className="absolute inline-block select-none" style={{ left: item.position.x, top: item.position.y }} onMouseDown={handleMouseDown}>
      <DesktopIcon
        label={item.title}
        iconSrc={item.iconSrc}
        iconElement={item.iconElement}
        overlayElement={item.overlayElement}
        isSelected={selectedIcons.includes(item.id)}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(event) => handleIconContextMenu(event, item.id)}
      />
    </div>
  );
}

function MobileLauncher({ icons, openWindow, theme }) {
  const activeTheme = getXpTheme(theme);

  return (
    <div className="absolute inset-0 overflow-auto px-4 pb-20 pt-6">
      <div className={`mx-auto max-w-xl rounded-2xl border p-4 shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-[2px] ${activeTheme.launcherCard}`}>
        <div className="mb-4 rounded-xl border border-white/15 bg-black/10 px-4 py-3 text-white">
          <div className="text-[24px] font-bold drop-shadow-[1px_1px_2px_rgba(0,0,0,0.55)]">XP Launcher</div>
          <div className="mt-1 text-[12px] text-white/85">Touch-friendly shortcuts for mobile while keeping the nostalgic shell feel intact.</div>
        </div>

        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">Programs</div>
        <div className="grid grid-cols-2 gap-3">
          {icons.filter((item) => item.id !== 'doNotOpen').map((item) => (
            <button key={item.id} type="button" onClick={() => openWindow(item)} className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/15 px-3 py-3 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:bg-white/22">
              <div className="relative flex h-10 w-10 items-center justify-center">
                {item.iconElement ? item.iconElement : <img src={item.iconSrc} alt="" aria-hidden="true" className="h-10 w-10 object-contain drop-shadow-[1px_2px_2px_rgba(0,0,0,0.65)]" />}
                {item.overlayElement && <div className="pointer-events-none absolute -bottom-0.5 -right-0.5">{item.overlayElement}</div>}
              </div>
              <div>
                <div className="text-[13px] font-bold">{item.title}</div>
                <div className="text-[11px] text-white/80">Open app</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationToasts({ notifications }) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 z-[90] flex w-[320px] flex-col gap-2">
      {notifications.map((notification) => (
        <div key={notification.id} className="rounded border border-[#8eb0e2] bg-[#f8fbff] px-3 py-3 font-['Tahoma'] shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
          <div className="text-[12px] font-bold text-[#214ea5]">{notification.title}</div>
          <div className="mt-1 text-[11px] leading-5 text-[#53647f]">{notification.message}</div>
        </div>
      ))}
    </div>
  );
}

function ScreensaverOverlay({ onDismiss }) {
  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/92" onMouseDown={onDismiss}>
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(30,98,255,0.16),transparent_42%)]" />
      <div className="animate-[floatSaver_9s_linear_infinite] text-center">
        <WindowsXpBranding textColor="#ffffff" microsoftColor="#ffffff" professionLabel="Portfolio" professionColor="rgba(255,255,255,0.88)" windowsSizeClass="text-[5rem]" xpSizeClass="text-[2.5rem]" microsoftSizeClass="text-[1rem]" flagWidthClass="w-32" />
        <div className="mt-8 font-['Tahoma'] text-[13px] uppercase tracking-[0.24em] text-white/75">Move mouse or press any key</div>
      </div>
    </div>
  );
}

export default function Desktop({ isSecurityCompromised = false, onTriggerSecurityBreach, onRequestRestart, onRequestShutdown }) {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const [balloonExpanding, setBalloonExpanding] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: 'desktop', targetId: null });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [marquee, setMarquee] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === 'undefined' ? TABLET_BREAKPOINT : window.innerWidth));
  const [wallpaperPictureId, setWallpaperPictureId] = useState(() => readStoredValue(WALLPAPER_STORAGE_KEY, null));
  const [pictureState, setPictureState] = useState(() => readStoredValue(PICTURE_STATE_STORAGE_KEY, { deletedIds: [], renamedById: {} }));
  const [theme, setTheme] = useState(() => readStoredValue(XP_THEME_STORAGE_KEY, 'luna'));
  const [soundsEnabled, setSoundsEnabled] = useState(() => readStoredValue(XP_SOUNDS_ENABLED_STORAGE_KEY, true));
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const notificationIdRef = useRef(0);
  const idleTimerRef = useRef(null);

  const { fileSystem, updateFilePosition, toggleFileOpen } = useVfs();

  const iconPositions = useMemo(() => {
    const pos = {};
    fileSystem.forEach(f => {
      pos[f.id] = { x: f.x_position, y: f.y_position };
    });
    return pos;
  }, [fileSystem]);

  const icons = useMemo(() => buildDesktopItems({ isSecurityCompromised, iconPositions }), [iconPositions, isSecurityCompromised]);
  const activeTheme = getXpTheme(theme);
  const responsiveMode = viewportWidth < MOBILE_BREAKPOINT ? 'mobile' : viewportWidth < TABLET_BREAKPOINT ? 'tablet' : 'desktop';
  const isMobile = responsiveMode === 'mobile';
  const isTablet = responsiveMode === 'tablet';
  const desktopAreaHeightClass = isMobile ? 'h-[calc(100vh-48px)]' : 'h-[calc(100vh-40px)]';
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

  useEffect(() => { writeStoredValue(PICTURE_STATE_STORAGE_KEY, pictureState); }, [pictureState]);
  useEffect(() => { writeStoredValue(WALLPAPER_STORAGE_KEY, wallpaperPictureId); }, [wallpaperPictureId]);
  useEffect(() => { writeStoredValue(XP_THEME_STORAGE_KEY, theme); }, [theme]);
  useEffect(() => { writeStoredValue(XP_SOUNDS_ENABLED_STORAGE_KEY, soundsEnabled); }, [soundsEnabled]);

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pushNotification = (title, message) => {
    const id = notificationIdRef.current + 1;
    notificationIdRef.current = id;
    setNotifications((current) => [...current, { id, title, message }]);
    window.setTimeout(() => {
      setNotifications((current) => current.filter((notification) => notification.id !== id));
    }, 3600);
  };

  useEffect(() => {
    pushNotification('Windows XP Portfolio', 'Desktop ready. Press Ctrl+Space for the command palette or open Run from Start.');
    
    // Also re-open any previously open VFS items when the desktop loads
    fileSystem.forEach(f => {
      if (f.isOpen) {
        const matchingApp = icons.find(icon => icon.id === f.id);
        if (matchingApp) {
          openWindow(matchingApp, { playSound: false });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      if (!isMobile) {
        setIsScreensaverActive(true);
      }
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    const handleActivity = () => {
      if (isScreensaverActive) {
        setIsScreensaverActive(false);
      }
      resetIdleTimer();
    };

    resetIdleTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [isScreensaverActive, isMobile]);

  const playDesktopSound = (type) => {
    if (!soundsEnabled) {
      return;
    }

    playSystemSound(type);
  };

  const focusWindow = (id) => {
    setWindows((currentWindows) => {
      const nextZIndex = Math.max(80, ...currentWindows.map((windowItem) => windowItem.zIndex || 80)) + 1;
      return currentWindows.map((windowItem) => (windowItem.id === id ? { ...windowItem, zIndex: nextZIndex, isMinimized: false } : windowItem));
    });
    setActiveWindowId(id);
  };

  const openWindow = (app, options = {}) => {
    const windowId = app.instanceId ?? app.id;
    if (options.playSound !== false) {
      playDesktopSound(options.soundType || APP_SOUND_TYPES[app.appId ?? app.id] || 'click');
    }

    // Sync to VFS
    toggleFileOpen(app.appId ?? app.id, true);

    setWindows((currentWindows) => {
      const nextZIndex = Math.max(80, ...currentWindows.map((windowItem) => windowItem.zIndex || 80)) + 1;
      const existingWindow = currentWindows.find((windowItem) => windowItem.id === windowId);

      if (!existingWindow) {
        return [...currentWindows, buildWindowEntry(app, nextZIndex, currentWindows.length)];
      }

      return currentWindows.map((windowItem) => (
        windowItem.id === windowId ? { ...windowItem, ...app, isMinimized: false, zIndex: nextZIndex } : windowItem
      ));
    });
    setActiveWindowId(windowId);
  };

  const openRunDialog = () => openWindow({ id: 'runDialog', title: 'Run', appId: 'runDialog' });
  const openWinver = () => openWindow({ id: 'winver', title: 'About Windows', appId: 'winver' });
  const openCommandNotepad = () => openWindow({ id: 'notepadGeneric', title: 'Untitled - Notepad', appId: 'notepadGeneric' });

  const executeCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase();
    setShowCommandPalette(false);

    if (!command) {
      return;
    }

    if (command === 'winver') {
      openWinver();
      pushNotification('Command executed', 'winver opened About Windows.');
      return;
    }

    if (command === 'notepad') {
      openCommandNotepad();
      pushNotification('Command executed', 'notepad opened a text document.');
      return;
    }

    if (command === 'iexplore') {
      openWindow({ id: 'ie', title: 'Internet Explorer', appId: 'ie' });
      pushNotification('Command executed', 'iexplore opened Internet Explorer.');
      return;
    }

    if (command === 'control') {
      openWindow({ id: 'controlPanel', title: 'Control Panel', appId: 'controlPanel' });
      pushNotification('Command executed', 'control opened Control Panel.');
      return;
    }

    if (command === 'explorer') {
      openWindow({ id: 'computer', title: 'My Computer', appId: 'computer' }, { soundType: 'folder' });
      pushNotification('Command executed', 'explorer opened My Computer.');
      return;
    }

    if (command === 'msnmsgr') {
      openWindow({ id: 'messenger', title: 'MSN Messenger', appId: 'messenger' });
      pushNotification('Command executed', 'msnmsgr opened Messenger.');
      return;
    }

    if (command === 'shutdown') {
      pushNotification('Command executed', 'shutdown started the XP power-down sequence.');
      onRequestShutdown?.();
      return;
    }

    playDesktopSound('error');
    pushNotification('Command not found', `${rawCommand} is not a recognized portfolio command.`);
  };

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
        event.preventDefault();
        setShowCommandPalette(true);
      }

      if ((event.metaKey || event.altKey) && event.key.toLowerCase() === 'r') {
        event.preventDefault();
        openRunDialog();
      }

      if (event.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const closeWindow = (id) => {
    // Determine the base appId to close in VFS
    const windowToClose = windows.find(w => w.id === id);
    if (windowToClose) {
      toggleFileOpen(windowToClose.appId, false);
    }

    setWindows((currentWindows) => {
      const nextWindows = currentWindows.filter((windowItem) => windowItem.id !== id);
      if (activeWindowId === id) {
        setActiveWindowId(getTopWindowId(nextWindows));
      }
      return nextWindows;
    });
  };

  const handleTaskbarWindowClick = (id) => {
    playDesktopSound('click');
    const targetWindow = windows.find((windowItem) => windowItem.id === id);
    if (!targetWindow) {
      return;
    }

    if (targetWindow.id === activeWindowId && !targetWindow.isMinimized) {
      const nextWindows = windows.map((windowItem) => (windowItem.id === id ? { ...windowItem, isMinimized: true } : windowItem));
      setWindows(nextWindows);
      setActiveWindowId(getTopWindowId(nextWindows));
      return;
    }

    focusWindow(id);
  };

  const openPictureViewer = (picture) => openWindow({ instanceId: `viewer:${picture.id}`, appId: 'imageViewer', title: picture.displayName, payload: { picture }, initialSize: WINDOW_LAYOUTS.imageViewer }, { soundType: 'click' });
  const openPictureProperties = (picture) => openWindow({ instanceId: `properties:${picture.id}`, appId: 'imageProperties', title: `${picture.displayName} Properties`, payload: { picture }, initialSize: WINDOW_LAYOUTS.imageProperties, initialPosition: { x: 160, y: 96 } }, { soundType: 'click' });

  const moveIcon = (id, nextPosition) => {
    const clamped = { x: Math.max(0, Math.min(nextPosition.x, window.innerWidth - 84)), y: Math.max(0, Math.min(nextPosition.y, window.innerHeight - 140)) };
    updateFilePosition(id, clamped.x, clamped.y);
    if (id === 'doNotOpen') updateFilePosition('securityReport', clamped.x, clamped.y);
    if (id === 'securityReport') updateFilePosition('doNotOpen', clamped.x, clamped.y);
  };

  const handleSetWallpaper = (pictureId) => setWallpaperPictureId(pictureId);

  const handleThemeChange = (themeKey) => {
    setTheme(themeKey);
    pushNotification('Theme changed', `${getXpTheme(themeKey).label} is now active.`);
  };

  const handleSoundsToggle = (enabled) => {
    setSoundsEnabled(enabled);
    pushNotification('Sound setting updated', enabled ? 'System sounds enabled.' : 'System sounds muted.');
  };

  const handleRenamePicture = (pictureId, displayName) => {
    setPictureState((currentState) => ({ ...currentState, renamedById: { ...currentState.renamedById, [pictureId]: displayName } }));
    setWindows((currentWindows) => currentWindows.map((windowItem) => {
      const picture = windowItem.payload?.picture;
      if (!picture || picture.id !== pictureId) {
        return windowItem;
      }
      const nextPicture = { ...picture, displayName };
      return { ...windowItem, title: windowItem.appId === 'imageProperties' ? `${displayName} Properties` : displayName, payload: { ...windowItem.payload, picture: nextPicture } };
    }));
  };

  const handleDeletePicture = (pictureId) => {
    setPictureState((currentState) => ({ ...currentState, deletedIds: currentState.deletedIds.includes(pictureId) ? currentState.deletedIds : [...currentState.deletedIds, pictureId] }));
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
    if (!isMobile && event.target.id === 'desktop-bg') {
      setMarquee({ startX: event.clientX, startY: event.clientY, left: event.clientX, top: event.clientY, width: 0, height: 0 });
      setSelectedIcons([]);
    }
  };

  const handleBalloonClick = () => {
    playDesktopSound('click');
    setBalloonExpanding(true);
    setTimeout(() => {
      setShowBalloon(false);
      setBalloonExpanding(false);
      openWindow({ id: 'intro', title: 'Introduction' });
    }, 280);
  };

  const handleMouseMove = (event) => {
    if (!marquee || isMobile || isTablet) {
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
    if (isMobile) {
      return;
    }
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
      playDesktopSound('click');
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 150);
      return;
    }
    if (action === 'open' && contextMenu.targetId) {
      const app = icons.find((icon) => icon.id === contextMenu.targetId);
      if (app?.onDoubleActivate === 'securityBreach') {
        onTriggerSecurityBreach?.();
        return;
      }
      if (app) {
        openWindow(app);
      }
      return;
    }
    if (action === 'delete') {
      playDesktopSound('error');
      alert('Cannot delete system icons!');
    }
  };

  const renderAppContent = (windowItem) => {
    switch (windowItem.appId) {
      case 'computer': return <MyComputerApp onOpenProjects={() => openWindow({ id: 'projects', title: 'My Projects', appId: 'projects' }, { soundType: 'folder' })} />;
      case 'projects': return <MyProjectsApp />;
      case 'pictures':
        return <MyPicturesApp pictures={pictures} onOpenImage={openPictureViewer} onSetWallpaper={handleSetWallpaper} onDeletePicture={handleDeletePicture} onRenamePicture={handleRenamePicture} onOpenProperties={openPictureProperties} />;
      case 'messenger': return <MessengerApp />;
      case 'controlPanel':
        return <ControlPanelApp pictures={pictures} wallpaperPictureId={wallpaperPictureId} onChangeWallpaper={handleSetWallpaper} soundsEnabled={soundsEnabled} onToggleSounds={handleSoundsToggle} theme={theme} onThemeChange={handleThemeChange} />;
      case 'runDialog': return <RunDialogApp onRunCommand={executeCommand} />;
      case 'winver': return <WinverApp />;
      case 'notepadGeneric': return <NotepadApp documentTitle="Untitled.txt" content={'Notes\n=====\n\nThis notepad window was launched from the Run dialog or command palette.'} />;
      case 'ie': return <InternetExplorerApp />;
      case 'securityReport': return <NotepadApp documentTitle="System Security Report.txt" content={SECURITY_REPORT_CONTENT} />;
      case 'resume': return <NotepadApp />;
      case 'imageViewer': return <ImageViewerApp picture={windowItem.payload?.picture} />;
      case 'imageProperties': return <ImagePropertiesApp picture={windowItem.payload?.picture} />;
      case 'intro':
        return (
          <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center font-['Tahoma']">
            <h2 className="mb-4 text-2xl font-bold text-[#003399] drop-shadow-sm">Welcome!</h2>
            <p className="max-w-md text-sm leading-relaxed text-gray-800">{portfolioData.profile.summary}</p>
          </div>
        );
      case 'recycle': return <div className="flex h-full items-center justify-center p-4 font-['Tahoma'] text-gray-500">Recycle Bin is empty.</div>;
      default: return <div className="p-4">Unknown Application</div>;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#2250E5] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${wallpaperUrl}')` }} onContextMenu={handleDesktopContextMenu}>
      <div className={`pointer-events-none absolute inset-0 ${activeTheme.desktopOverlay}`} />

      <div id="desktop-bg" className={`relative w-full ${desktopAreaHeightClass} ${isRefreshing ? 'opacity-0' : 'opacity-100 transition-opacity'}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {isMobile ? (
          <MobileLauncher icons={icons} openWindow={openWindow} theme={theme} />
        ) : isTablet ? (
          <div className="grid max-w-[430px] grid-cols-3 gap-y-4 px-3 py-4">
            {icons.map((item) => (
              <div key={item.id} className="flex justify-center">
                <DesktopIcon
                  label={item.title}
                  iconSrc={item.iconSrc}
                  iconElement={item.iconElement}
                  overlayElement={item.overlayElement}
                  isSelected={selectedIcons.includes(item.id)}
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedIcons([item.id]);
                    if (contextMenu.visible) {
                      setContextMenu({ ...contextMenu, visible: false });
                    }
                    if (item.openOnClick === false) {
                      return;
                    }
                    openWindow(item);
                  }}
                  onDoubleClick={() => {
                    if (item.onDoubleActivate === 'securityBreach') {
                      onTriggerSecurityBreach?.();
                      return;
                    }
                    openWindow(item);
                  }}
                  onContextMenu={(event) => handleIconContextMenu(event, item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          icons.map((item) => (
            <DesktopIconWrapper key={item.id} item={item} selectedIcons={selectedIcons} setSelectedIcons={setSelectedIcons} contextMenu={contextMenu} setContextMenu={setContextMenu} openWindow={openWindow} handleIconContextMenu={handleIconContextMenu} onTriggerSecurityBreach={onTriggerSecurityBreach} onMoveIcon={moveIcon} />
          ))
        )}

        {marquee && !isMobile && !isTablet && <div className="pointer-events-none absolute z-50 border border-dotted border-[#316ac5] bg-[#316ac5]/30" style={{ left: marquee.left, top: marquee.top, width: marquee.width, height: marquee.height }} />}
      </div>

      {windows.slice().sort((firstWindow, secondWindow) => firstWindow.zIndex - secondWindow.zIndex).map((windowItem) => (!windowItem.isMinimized && (
        <Window key={windowItem.id} windowId={windowItem.id} title={windowItem.title} zIndex={windowItem.zIndex} isActive={activeWindowId === windowItem.id} initialPosition={windowItem.initialPosition} initialSize={windowItem.initialSize} responsiveMode={responsiveMode} theme={theme} onFocus={() => focusWindow(windowItem.id)} onClose={() => closeWindow(windowItem.id)} onMinimize={() => handleTaskbarWindowClick(windowItem.id)}>
          {renderAppContent(windowItem)}
        </Window>
      )))}

      <StartMenu
        isOpen={isStartMenuOpen}
        toggleMenu={() => setIsStartMenuOpen(false)}
        onOpenWindow={(id) => {
          const target = icons.find((icon) => icon.id === id) || { id, appId: id, title: id };
          if (id === 'runDialog') {
            openRunDialog();
            return;
          }
          if (id === 'winver') {
            openWinver();
            return;
          }
          if (target) {
            openWindow(target);
          }
        }}
        onOpenRun={openRunDialog}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onRequestRestart={onRequestRestart}
        onRequestShutdown={onRequestShutdown}
        contacts={portfolioData.contacts}
        responsiveMode={responsiveMode}
        theme={theme}
      />

      <Taskbar openWindows={windows} activeWindowId={activeWindowId} onWindowClick={handleTaskbarWindowClick} responsiveMode={responsiveMode} theme={theme} onStartClick={(event) => { event.stopPropagation(); playDesktopSound('click'); setIsStartMenuOpen(!isStartMenuOpen); }} />

      {showBalloon && !isMobile && <BalloonNotification onClose={() => setShowBalloon(false)} onClick={handleBalloonClick} isExpanding={balloonExpanding} />}

      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} type={contextMenu.type} onClose={() => setContextMenu({ ...contextMenu, visible: false })} onAction={handleContextAction} />}

      {!!notifications.length && <NotificationToasts notifications={notifications} />}
      {showCommandPalette && <CommandPalette commands={COMMAND_DEFINITIONS} onRunCommand={executeCommand} onClose={() => setShowCommandPalette(false)} />}
      {isScreensaverActive && <ScreensaverOverlay onDismiss={() => setIsScreensaverActive(false)} />}
    </div>
  );
}