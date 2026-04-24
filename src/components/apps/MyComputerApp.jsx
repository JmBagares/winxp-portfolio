import React from 'react';
import { Database, Layout, Server, Monitor, Settings } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function MyComputerApp() {
  const skillIcons = [Layout, Monitor, Server, Database];

  return (
    <div className="flex h-full flex-col font-['Tahoma'] select-none">
      <div className="bg-[#ece9d8] border-b border-[#aca899] p-1 flex items-center space-x-2">
        <span className="text-gray-500 pl-1 text-sm">Address</span>
        <div className="bg-white border border-[#aca899] px-2 py-[2px] flex-1 text-sm flex items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <Monitor size={14} className="mr-1 inline-block text-blue-600" /> My Computer
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7492ea] to-[#4567c9] p-2 overflow-y-auto">
           <div className="bg-white rounded-tl-sm rounded-tr-sm border border-blue-400 p-1 font-bold text-[#00136b] text-sm shadow-sm flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors">
             System Tasks
             <span className="text-[10px]">︽</span>
           </div>
           <div className="bg-[#d3e5fa] border border-t-0 border-blue-400 p-2 text-xs text-[#00136b] flex flex-col gap-2">
             <a href="#" className="hover:underline flex items-center"><Monitor size={14} className="mr-2 text-blue-600" /> View system info</a>
             <a href="#" className="hover:underline flex items-center"><Layout size={14} className="mr-2 text-blue-600" /> Add or remove programs</a>
             <a href="#" className="hover:underline flex items-center"><Settings size={14} className="mr-2 text-blue-600" /> Change a setting</a>
           </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <h2 className="text-[#00136b] font-bold border-b border-gray-300 pb-1 mb-4 flex items-center text-sm">
            Skills and Technical Strengths
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {portfolioData.skills.map((skillGroup, index) => {
              const Icon = skillIcons[index % skillIcons.length];

              return (
                <div key={skillGroup.category} className="rounded border border-[#c8d4e8] p-3 transition-colors hover:bg-blue-50">
                  <div className="mb-3 flex items-center space-x-3">
                    <Icon className="text-[#215dc6]" size={28} />
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-black">{skillGroup.category}</span>
                      <span className="text-xs text-gray-500">Capability cluster</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item) => (
                      <span key={item} className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-0.5 text-xs text-[#003399]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-600">Skills stay in My Computer to keep the operating-system metaphor clean and predictable.</p>
        </div>
      </div>
    </div>
  );
}
