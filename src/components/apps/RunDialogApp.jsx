import React, { useEffect, useState } from 'react';

const RUN_HINTS = ['winver', 'notepad', 'iexplore', 'control', 'explorer', 'msnmsgr', 'shutdown'];

export default function RunDialogApp({ onRunCommand }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const firstHint = RUN_HINTS[0];
    setValue(firstHint);
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) {
      return;
    }

    onRunCommand?.(value.trim());
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#ece9d8] font-['Tahoma'] text-[11px] text-[#1f1f1f]">
      <div className="border-b border-[#aca899] px-4 py-3">
        <div className="text-[14px] font-bold text-[#003399]">Run</div>
      </div>

      <div className="flex flex-1 gap-4 px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded border border-[#6681b5] bg-linear-to-b from-[#b9d1ff] to-[#6f93de] text-[20px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          ›
        </div>
        <div className="flex-1">
          <p className="m-0 text-[12px] leading-5 text-[#3c3c3c]">
            Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
          </p>
          <div className="mt-4">
            <label className="mb-1 block font-bold text-[#3b3b3b]">Open:</label>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit();
                }
              }}
              className="w-full border border-[#7f9db9] bg-white px-2 py-1.5 shadow-[inset_1px_1px_0_rgba(0,0,0,0.08)] outline-none"
              spellCheck={false}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            {RUN_HINTS.map((hint) => (
              <button
                key={hint}
                type="button"
                onClick={() => setValue(hint)}
                className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-1 text-[#003399] hover:bg-[#dfeafe]"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#aca899] px-4 py-3">
        <button type="button" onClick={handleSubmit} className="min-w-18 border border-[#7f7f7f] bg-[#ece9d8] px-4 py-1 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92),inset_-1px_-1px_0_rgba(0,0,0,0.12)] hover:bg-[#f4f0e6]">
          OK
        </button>
        <button type="button" className="min-w-18 border border-[#7f7f7f] bg-[#ece9d8] px-4 py-1 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92),inset_-1px_-1px_0_rgba(0,0,0,0.12)] hover:bg-[#f4f0e6]">
          Cancel
        </button>
        <button type="button" className="min-w-18 border border-[#7f7f7f] bg-[#ece9d8] px-4 py-1 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92),inset_-1px_-1px_0_rgba(0,0,0,0.12)] hover:bg-[#f4f0e6]">
          Browse...
        </button>
      </div>
    </div>
  );
}
