import React from 'react';
import { XP_THEME_OPTIONS } from '../../data/xpThemes';

export default function ControlPanelApp({
  pictures,
  wallpaperPictureId,
  onChangeWallpaper,
  soundsEnabled,
  onToggleSounds,
  theme,
  onThemeChange,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden font-['Tahoma'] text-[11px] text-[#1f1f1f]">
      <div className="border-b border-[#aca899] bg-[#ece9d8] px-3 py-2">
        <div className="text-[18px] font-bold text-[#003399]">Control Panel</div>
        <div className="text-[11px] text-[#5d5d5d]">Adjust wallpaper, sounds, and your desktop theme.</div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 overflow-auto bg-white p-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded border border-[#c8d4e8] bg-[#f7fbff] p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.85)]">
          <div className="text-[13px] font-bold text-[#003399]">Tasks</div>
          <div className="mt-3 space-y-2 text-[11px] text-[#33507e]">
            <div>Display and wallpaper</div>
            <div>Sounds and audio devices</div>
            <div>Themes and appearance</div>
          </div>
        </aside>

        <div className="space-y-4">
          <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.85)]">
            <div className="text-[14px] font-bold text-[#003399]">Themes</div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {XP_THEME_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onThemeChange(option.key)}
                  className={`rounded border px-3 py-3 text-left shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)] ${theme === option.key ? 'border-[#295cc5] bg-[#dfeaff]' : 'border-[#c8d4e8] bg-white hover:bg-[#f2f7ff]'}`}
                >
                  <div className="text-[12px] font-bold text-[#1b3d83]">{option.label}</div>
                  <div className="mt-2 h-14 rounded border border-white/40 bg-linear-to-br from-[#8eb7ff] via-[#3d77df] to-[#2344a2]" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.85)]">
            <div className="text-[14px] font-bold text-[#003399]">Sounds</div>
            <label className="mt-3 flex items-center gap-3 rounded border border-[#d7e1f0] bg-white px-3 py-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)]">
              <input type="checkbox" checked={soundsEnabled} onChange={(event) => onToggleSounds(event.target.checked)} />
              <div>
                <div className="text-[12px] font-bold text-[#24478d]">Enable XP system sounds</div>
                <div className="text-[11px] text-[#627394]">Startup, click, folder, and error effects follow this setting.</div>
              </div>
            </label>
          </section>

          <section className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.85)]">
            <div className="text-[14px] font-bold text-[#003399]">Wallpaper</div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {pictures.slice(0, 6).map((picture) => (
                <button
                  key={picture.id}
                  type="button"
                  onClick={() => onChangeWallpaper(picture.id)}
                  className={`overflow-hidden rounded border text-left shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)] ${wallpaperPictureId === picture.id ? 'border-[#295cc5] bg-[#dfeaff]' : 'border-[#c8d4e8] bg-white hover:bg-[#f2f7ff]'}`}
                >
                  <div className="aspect-[4/3] bg-[#dfe8f6]">
                    <img src={picture.src} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="px-3 py-2 text-[11px] font-bold text-[#24478d]">{picture.displayName}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}