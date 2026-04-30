import React from 'react';
import { portfolioData } from '../../data/portfolioData';

export default function WinverApp() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#ece9d8] font-['Tahoma'] text-[11px] text-[#1f1f1f]">
      <div className="border-b border-[#aca899] px-4 py-3">
        <div className="text-[14px] font-bold text-[#003399]">About Windows</div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-auto px-5 py-5">
        <div className="rounded border border-[#b9cbe8] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)]">
          <div className="text-[22px] font-bold text-[#214ea5]">Microsoft Windows XP</div>
          <div className="mt-1 text-[12px] text-[#5b6d8f]">Portfolio Edition 2026</div>
          <div className="mt-3 text-[12px] leading-6 text-[#3e3e3e]">
            Registered to: {portfolioData.profile.name}
            <br />
            Role: {portfolioData.profile.role}
            <br />
            Location: {portfolioData.profile.location}
          </div>
        </div>

        <div className="rounded border border-[#b9cbe8] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)]">
          <div className="mb-2 text-[13px] font-bold text-[#214ea5]">System Summary</div>
          <p className="m-0 text-[12px] leading-6 text-[#3a3a3a]">{portfolioData.profile.summary}</p>
        </div>

        <div className="rounded border border-[#b9cbe8] bg-white p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.92)]">
          <div className="mb-2 text-[13px] font-bold text-[#214ea5]">Installed Components</div>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.flatMap((group) => group.items).slice(0, 10).map((item) => (
              <span key={item} className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-1 text-[11px] text-[#003399]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}