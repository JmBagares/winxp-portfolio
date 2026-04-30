export const XP_THEMES = {
  luna: {
    key: 'luna',
    label: 'Luna Blue',
    desktopOverlay: 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_42%),linear-gradient(180deg,rgba(27,81,208,0.14),rgba(0,0,0,0.08))]',
    launcherCard: 'bg-[rgba(27,71,174,0.48)] border-white/35',
    taskbar: 'from-[#1F2F86] via-[#3165CA] to-[#1F2F86]',
    tray: 'from-[#0E8FE8] via-[#15ACF6] to-[#0E8FE8]',
    startButton: 'from-[#3E9F45] via-[#4FBE56] to-[#3E9F45]',
    windowFrame: 'bg-[#0055e5]',
    windowHeader: 'from-[#0058ee] via-[#3593ff] to-[#0058ee]',
    startHeader: 'from-[#215dc6] via-[#358cf5] to-[#215dc6]',
    startFooter: 'from-[#215dc6] via-[#358cf5] to-[#215dc6]',
  },
  olive: {
    key: 'olive',
    label: 'Olive Green',
    desktopOverlay: 'bg-[radial-gradient(circle_at_top,rgba(255,248,215,0.14),transparent_44%),linear-gradient(180deg,rgba(86,111,39,0.18),rgba(0,0,0,0.1))]',
    launcherCard: 'bg-[rgba(94,118,48,0.46)] border-[#e5efca]/40',
    taskbar: 'from-[#5f6b2f] via-[#84932f] to-[#556320]',
    tray: 'from-[#a6b74f] via-[#b7ca58] to-[#92a13f]',
    startButton: 'from-[#6f8722] via-[#8cad2e] to-[#69811c]',
    windowFrame: 'bg-[#65772c]',
    windowHeader: 'from-[#6a7a2f] via-[#8ea53d] to-[#69792b]',
    startHeader: 'from-[#5d6e26] via-[#89a23a] to-[#5d6e26]',
    startFooter: 'from-[#5d6e26] via-[#89a23a] to-[#5d6e26]',
  },
  royale: {
    key: 'royale',
    label: 'Royale Noir',
    desktopOverlay: 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_44%),linear-gradient(180deg,rgba(45,58,105,0.22),rgba(10,12,18,0.16))]',
    launcherCard: 'bg-[rgba(39,46,80,0.62)] border-white/20',
    taskbar: 'from-[#1c2242] via-[#31436d] to-[#1a223f]',
    tray: 'from-[#4b5f95] via-[#5b72ad] to-[#445785]',
    startButton: 'from-[#2f8d46] via-[#43ae5d] to-[#2e8041]',
    windowFrame: 'bg-[#253354]',
    windowHeader: 'from-[#2b3961] via-[#5872ab] to-[#2a385f]',
    startHeader: 'from-[#20315e] via-[#4d6fb7] to-[#20315e]',
    startFooter: 'from-[#20315e] via-[#4d6fb7] to-[#20315e]',
  },
};

export const XP_THEME_OPTIONS = Object.values(XP_THEMES).map(({ key, label }) => ({ key, label }));

export function getXpTheme(themeKey) {
  return XP_THEMES[themeKey] ?? XP_THEMES.luna;
}
