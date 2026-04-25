import { Image as ImageIcon } from 'lucide-react';

export default function ImageViewerApp({ picture }) {
  if (!picture) {
    return <div className="flex h-full items-center justify-center font-['Tahoma'] text-[#666]">Image unavailable.</div>;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f0f3fb] font-['Tahoma'] text-[11px] text-black">
      <div className="flex items-center gap-2 border-b border-[#aca899] bg-[#ece9d8] px-3 py-1.5">
        <ImageIcon size={14} className="text-[#215dc6]" />
        <span>{picture.displayName}</span>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[radial-gradient(circle_at_top,#ffffff_0%,#eef3fb_45%,#d7e4fb_100%)] p-5">
        <img
          src={picture.src}
          alt={picture.displayName}
          className="max-h-full max-w-full border border-[#879cc2] bg-white p-2 shadow-[0_10px_24px_rgba(33,63,130,0.22)]"
        />
      </div>

      <div className="flex items-center justify-between border-t border-[#cac6b6] bg-[#ece9d8] px-3 py-1 text-[10px] text-[#4f4f4f]">
        <span>{picture.originalFileName}</span>
        <span>{picture.fileType}</span>
      </div>
    </div>
  );
}