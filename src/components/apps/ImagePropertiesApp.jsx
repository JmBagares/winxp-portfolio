import { Fragment, useEffect, useState } from 'react';

export default function ImagePropertiesApp({ picture }) {
  const [dimensions, setDimensions] = useState(null);
  const [loadedPictureId, setLoadedPictureId] = useState(null);

  useEffect(() => {
    if (!picture?.src || !picture?.id) {
      return undefined;
    }

    let isActive = true;
    const image = new Image();
    image.onload = () => {
      if (isActive) {
        setDimensions({ width: image.naturalWidth, height: image.naturalHeight });
        setLoadedPictureId(picture.id);
      }
    };
    image.src = picture.src;

    return () => {
      isActive = false;
    };
  }, [picture]);

  if (!picture) {
    return <div className="flex h-full items-center justify-center font-['Tahoma'] text-[#666]">No picture selected.</div>;
  }

  const detailRows = [
    { label: 'Display name', value: picture.displayName },
    { label: 'Original file', value: picture.originalFileName },
    { label: 'Type', value: picture.fileType },
    { label: 'Dimensions', value: loadedPictureId === picture.id && dimensions ? `${dimensions.width} x ${dimensions.height}` : 'Loading...' },
    { label: 'Location', value: picture.fakePath },
  ];

  return (
    <div className="flex h-full flex-col bg-[#ece9d8] font-['Tahoma'] text-[11px] text-black">
      <div className="border-b border-[#b7b29d] bg-linear-to-b from-[#fdfdf6] to-[#e7e1ce] px-3 py-2 text-[12px] font-bold text-[#20438f]">
        {picture.displayName} Properties
      </div>

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <div className="w-40 shrink-0 rounded border border-[#b6c9eb] bg-white p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
          <img src={picture.src} alt={picture.displayName} className="h-32 w-full border border-[#a7b9d5] bg-[#f7f9fd] object-contain p-1" />
        </div>

        <div className="min-w-0 flex-1 rounded border border-[#b6c9eb] bg-white p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9)]">
          <div className="mb-3 border-b border-[#d6e0f3] pb-2 text-[13px] font-bold text-[#003399]">Summary</div>
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-2">
            {detailRows.map((row) => (
              <Fragment key={row.label}>
                <div className="text-[#666]">{row.label}</div>
                <div className="truncate text-[#1f1f1f]" title={row.value}>{row.value}</div>
              </Fragment>
            ))}
          </div>

          <div className="mt-4 rounded border border-[#dae4f6] bg-[#f7faff] px-3 py-2 text-[10px] leading-4 text-[#4d5b77]">
            This dialog reflects app-level metadata for bundled image assets. File operations here change the portfolio UI state, not the original files in your source folder.
          </div>
        </div>
      </div>
    </div>
  );
}