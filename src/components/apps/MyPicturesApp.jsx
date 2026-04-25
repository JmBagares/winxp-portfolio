import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, FolderOpen, Image as ImageIcon, PaintBucket, Sparkles } from 'lucide-react';
import ContextMenu from '../ContextMenu';

const FILE_MENU_ITEMS = [
  { label: 'Open', action: 'open', bold: true },
  { label: 'Set as Desktop Wallpaper', action: 'wallpaper' },
  { label: 'Delete', action: 'delete' },
  { label: 'Rename', action: 'rename' },
  { label: 'Properties', action: 'properties' },
];

export default function MyPicturesApp({
  pictures,
  onOpenImage,
  onSetWallpaper,
  onDeletePicture,
  onRenamePicture,
  onOpenProperties,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetId: null });
  const [renamingId, setRenamingId] = useState(null);
  const [draftName, setDraftName] = useState('');
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const selectedPicture = useMemo(
    () => pictures.find((picture) => picture.id === selectedId) ?? null,
    [pictures, selectedId],
  );
  const activeRenamingId = renamingId && pictures.some((picture) => picture.id === renamingId) ? renamingId : null;

  const runAction = (action, picture) => {
    if (!picture) {
      return;
    }

    switch (action) {
      case 'open':
        onOpenImage?.(picture);
        break;
      case 'wallpaper':
        onSetWallpaper?.(picture.id);
        break;
      case 'delete':
        onDeletePicture?.(picture.id);
        break;
      case 'rename':
        setRenamingId(picture.id);
        setDraftName(picture.displayName);
        break;
      case 'properties':
        onOpenProperties?.(picture);
        break;
      default:
        break;
    }
  };

  const commitRename = () => {
    if (!activeRenamingId) {
      return;
    }

    const picture = pictures.find((item) => item.id === activeRenamingId);
    const nextDisplayName = draftName.trim() || picture?.defaultDisplayName || picture?.displayName || 'Picture';
    onRenamePicture?.(activeRenamingId, nextDisplayName);
    setRenamingId(null);
    setDraftName('');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden font-['Tahoma'] text-[11px] text-black select-none">
      <div className="border-b border-[#aca899] bg-[#ece9d8] px-2 py-1">
        <div className="flex items-center gap-2 border border-[#7f9db9] bg-white px-2 py-[3px] shadow-[inset_1px_1px_0_#fff]">
          <FolderOpen size={14} className="text-[#215dc6]" />
          <span className="text-[11px] text-[#5d5d5d]">Address</span>
          <span className="rounded-sm border border-[#c9c7ba] bg-[#fdfdf8] px-2 py-[1px] text-[11px] text-[#333]">My Pictures</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="w-[190px] border-r border-[#7f9db9] bg-linear-to-b from-[#7ea2f4] via-[#5b7fdb] to-[#4469c4] p-2 text-[11px] text-white">
          <div className="mb-2 rounded-sm border border-[#7fa3ef] bg-white/95 px-2 py-1 text-[12px] font-bold text-[#15398c]">Picture Tasks</div>
          <div className="mb-3 rounded-sm border border-[#8fb0f2] bg-[#d7e6ff] px-2 py-2 text-[#14316a] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
            <button
              type="button"
              className="flex w-full items-center gap-2 px-1 py-1 text-left hover:bg-white/60"
              onClick={() => selectedPicture && onOpenImage?.(selectedPicture)}
              disabled={!selectedPicture}
            >
              <ImageIcon size={14} className="text-[#215dc6]" />
              <span className={!selectedPicture ? 'text-[#7b89a3]' : ''}>View this picture</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-1 py-1 text-left hover:bg-white/60"
              onClick={() => selectedPicture && onSetWallpaper?.(selectedPicture.id)}
              disabled={!selectedPicture}
            >
              <PaintBucket size={14} className="text-[#215dc6]" />
              <span className={!selectedPicture ? 'text-[#7b89a3]' : ''}>Set as wallpaper</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-1 py-1 text-left hover:bg-white/60"
              onClick={() => selectedPicture && onOpenProperties?.(selectedPicture)}
              disabled={!selectedPicture}
            >
              <Sparkles size={14} className="text-[#215dc6]" />
              <span className={!selectedPicture ? 'text-[#7b89a3]' : ''}>Show properties</span>
            </button>
          </div>

          <div className="rounded-sm border border-[#7fa3ef] bg-white/95 px-3 py-3 text-[#15398c] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
            <div className="mb-2 flex items-center gap-2 text-[12px] font-bold">
              <Camera size={16} className="text-[#215dc6]" />
              Picture Details
            </div>
            {selectedPicture ? (
              <>
                <img src={selectedPicture.src} alt="" className="mb-2 h-24 w-full border border-[#9db7e7] bg-white object-cover p-1" />
                <div className="truncate font-bold text-[#00136b]">{selectedPicture.displayName}</div>
                <div className="mt-1 truncate text-[10px] text-[#335]">{selectedPicture.originalFileName}</div>
                <div className="mt-1 text-[10px] text-[#335]">{selectedPicture.fileType}</div>
              </>
            ) : (
              <p className="m-0 leading-4 text-[10px] text-[#335]">Select a picture to see quick details.</p>
            )}
          </div>
        </aside>

        <div
          className="relative min-h-0 flex-1 overflow-auto bg-white px-4 py-4"
          onClick={() => {
            setSelectedId(null);
            setContextMenu((currentMenu) => ({ ...currentMenu, visible: false }));
          }}
        >
          <div className="mb-3 flex items-center justify-between border-b border-[#d8d8cf] pb-2">
            <div>
              <h2 className="m-0 text-[18px] font-bold text-[#003399]">My Pictures</h2>
              <p className="m-0 mt-1 text-[11px] text-[#5a5a5a]">The images in this folder can be viewed, renamed in-app, hidden, or used as the desktop wallpaper.</p>
            </div>
            <div className="rounded-sm border border-[#c6d7f7] bg-[#f4f8ff] px-2 py-1 text-[10px] text-[#3057a6]">
              {pictures.length} item{pictures.length === 1 ? '' : 's'}
            </div>
          </div>

          {pictures.length === 0 ? (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center border border-dashed border-[#b8c7e0] bg-[#fbfdff] text-center text-[#5b6d88]">
              <ImageIcon size={42} className="mb-3 text-[#7d9ee6]" />
              <div className="text-[14px] font-bold text-[#3359a8]">This folder is empty</div>
              <p className="m-0 mt-2 max-w-[280px] text-[11px] leading-4">Pictures hidden with Delete stay removed in the app until you clear local storage or restore them in code.</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-x-4 gap-y-5 pr-2">
              {pictures.map((picture) => {
                const isSelected = selectedId === picture.id;
                const isRenaming = activeRenamingId === picture.id;

                return (
                  <div
                    key={picture.id}
                    className="group flex cursor-default flex-col items-center rounded-sm px-2 py-2"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(picture.id);
                      setContextMenu((currentMenu) => ({ ...currentMenu, visible: false }));
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(picture.id);
                      onOpenImage?.(picture);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedId(picture.id);
                      setContextMenu({ visible: true, x: event.clientX, y: event.clientY, targetId: picture.id });
                    }}
                  >
                    <div className={`flex h-[88px] w-[88px] items-center justify-center border p-1 shadow-[inset_1px_1px_0_rgba(255,255,255,0.85)] ${isSelected ? 'border-[#6d91d6] bg-[#dce9ff]' : 'border-[#c8d4e8] bg-[#f7f9fd] group-hover:bg-[#f0f5ff]'}`}>
                      <img src={picture.src} alt="" className="max-h-full max-w-full object-contain" draggable="false" />
                    </div>

                    {isRenaming ? (
                      <input
                        ref={renameInputRef}
                        value={draftName}
                        onChange={(event) => setDraftName(event.target.value)}
                        onBlur={commitRename}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            commitRename();
                          }

                          if (event.key === 'Escape') {
                            event.preventDefault();
                            setRenamingId(null);
                            setDraftName('');
                          }
                        }}
                        className="mt-2 w-full border border-[#7f9db9] bg-white px-1 py-[2px] text-center text-[11px] shadow-[inset_1px_1px_0_rgba(0,0,0,0.08)] outline-none"
                      />
                    ) : (
                      <div className={`mt-2 max-w-full px-1 text-center leading-4 ${isSelected ? 'bg-[#316ac5] text-white outline outline-1 outline-dotted outline-[#f3f9ff] outline-offset-[-1px]' : 'text-[#222]'}`}>
                        {picture.displayName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {contextMenu.visible && (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              items={FILE_MENU_ITEMS}
              onClose={() => setContextMenu((currentMenu) => ({ ...currentMenu, visible: false }))}
              onAction={(action) => runAction(action, pictures.find((picture) => picture.id === contextMenu.targetId))}
            />
          )}
        </div>
      </div>
    </div>
  );
}