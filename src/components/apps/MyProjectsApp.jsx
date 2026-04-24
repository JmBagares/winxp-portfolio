import React from 'react';
import { Folder } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function MyProjectsApp() {
  const { projects } = portfolioData;

  return (
    <div className="flex flex-col h-full font-['Tahoma'] select-none">
      <div className="bg-[#ece9d8] border-b border-[#aca899] p-1 flex items-center space-x-2">
        <span className="text-gray-500 pl-1 text-sm">Address</span>
        <div className="bg-white border border-[#aca899] px-2 py-[2px] flex-1 text-sm flex items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <Folder size={14} className="mr-1 inline-block text-[#f1ca4b]" fill="#f1ca4b" /> My Projects
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[180px] bg-gradient-to-b from-[#7492ea] to-[#4567c9] p-2 overflow-y-auto">
           <div className="bg-white rounded-tl-sm rounded-tr-sm border border-blue-400 p-1 font-bold text-[#00136b] text-sm shadow-sm flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors">
             Folder Tasks
             <span className="text-[10px]">︽</span>
           </div>
           <div className="bg-[#d3e5fa] border border-t-0 border-blue-400 p-2 text-xs text-[#00136b] flex flex-col gap-2">
             <a href="#" className="hover:underline flex items-center"><Folder size={14} fill="#f1ca4b" className="mr-2 text-[#f1ca4b]" /> Make a new folder</a>
             <a href="#" className="hover:underline flex items-center"><Folder size={14} fill="#f1ca4b" className="mr-2 text-[#f1ca4b]" /> Share this folder</a>
           </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div key={project.title} className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-3 shadow-[inset_1px_1px_rgba(255,255,255,0.8)]">
                <div className="mb-2 flex items-start gap-3">
                  <Folder size={36} className="mt-0.5 text-[#f1ca4b] drop-shadow-sm" fill="#f8d775" />
                  <div>
                    <h3 className="text-sm font-bold text-[#003399]">{project.title}</h3>
                    <p className="text-xs text-gray-600">{project.status}</p>
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-gray-800">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span key={item} className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-0.5 text-xs text-[#003399]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-600">Projects stay in My Projects, while About Me and Education live in Resume.txt and skills stay in My Computer.</p>
        </div>
      </div>
    </div>
  );
}
