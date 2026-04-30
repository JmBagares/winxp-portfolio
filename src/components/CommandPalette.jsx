import React, { useMemo, useState } from 'react';

export default function CommandPalette({ commands, onRunCommand, onClose }) {
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return commands;
    }

    return commands.filter((command) => (
      command.command.includes(normalized)
      || command.label.toLowerCase().includes(normalized)
      || command.description.toLowerCase().includes(normalized)
    ));
  }, [commands, query]);

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/35 px-4 pt-[14vh]" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-[#2954b3] bg-[#f3f5fb] shadow-[0_16px_50px_rgba(0,0,0,0.35)]" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-[#b7c8e8] bg-linear-to-r from-[#e8f0ff] to-[#dce8ff] px-4 py-3 font-['Tahoma']">
          <div className="text-[16px] font-bold text-[#214ea5]">Command Palette</div>
          <div className="mt-1 text-[11px] text-[#5f6f90]">Quick-launch fake XP commands and system tools.</div>
        </div>

        <div className="border-b border-[#c7d3e7] bg-white px-4 py-3">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filteredCommands[0]) {
                onRunCommand(filteredCommands[0].command);
              }
              if (event.key === 'Escape') {
                onClose();
              }
            }}
            className="w-full border border-[#7f9db9] bg-white px-3 py-2 font-['Tahoma'] text-[12px] outline-none shadow-[inset_1px_1px_0_rgba(0,0,0,0.08)]"
            placeholder="Type a command like winver, notepad, iexplore, control..."
            spellCheck={false}
          />
        </div>

        <div className="max-h-[420px] overflow-auto bg-[#f8fbff] p-2">
          {filteredCommands.map((command) => (
            <button
              key={command.command}
              type="button"
              onClick={() => onRunCommand(command.command)}
              className="mb-2 flex w-full items-start gap-3 rounded border border-[#c6d6ee] bg-white px-3 py-3 text-left font-['Tahoma'] shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)] hover:bg-[#eef4ff]"
            >
              <div className="rounded border border-[#9bb6e5] bg-[#dce8ff] px-2 py-1 text-[11px] font-bold text-[#214ea5]">
                {command.command}
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#1f3668]">{command.label}</div>
                <div className="mt-1 text-[11px] leading-5 text-[#5f6d88]">{command.description}</div>
              </div>
            </button>
          ))}

          {!filteredCommands.length && (
            <div className="rounded border border-dashed border-[#b9cbe5] bg-white px-3 py-5 text-center font-['Tahoma'] text-[11px] text-[#6a7894]">
              No matching command.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
