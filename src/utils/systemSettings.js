export const SECURITY_INCIDENT_STORAGE_KEY = 'xp-system-security-breached';
export const WALLPAPER_STORAGE_KEY = 'xp-wallpaper-picture-id';
export const PICTURE_STATE_STORAGE_KEY = 'xp-picture-state';
export const ICON_POSITIONS_STORAGE_KEY = 'xp-desktop-icon-positions';
export const XP_THEME_STORAGE_KEY = 'xp-theme';
export const XP_SOUNDS_ENABLED_STORAGE_KEY = 'xp-sounds-enabled';

export function readStoredValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function writeStoredValue(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
