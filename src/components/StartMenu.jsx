import React from 'react';
import { User, LogOut, Power, Folder, Monitor, Settings, Search, HelpCircle, Briefcase, FileCode, Globe, Users } from 'lucide-react';
import { getXpTheme } from '../data/xpThemes';

export default function StartMenu({
  isOpen,
  toggleMenu,
  onOpenWindow,
  onOpenRun,
  onOpenCommandPalette,
  onRequestRestart,
  onRequestShutdown,
  contacts,
  responsiveMode = 'desktop',
  theme = 'luna',
}) {
  if (!isOpen) return null;
  const isMobile = responsiveMode === 'mobile';
  const activeTheme = getXpTheme(theme);

  const handleOpenWindow = (id) => {
    onOpenWindow?.(id);
    toggleMenu();
  };

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toggleMenu();
  };

  return (
    <div className={`absolute z-50 flex flex-col overflow-hidden border border-[#003399] bg-white font-['Tahoma'] select-none shadow-2xl ${isMobile ? 'bottom-12 left-0 right-0 max-h-[calc(100vh-3rem)] rounded-t-2xl' : 'bottom-10 left-0 w-95 rounded-tr-lg'}`}>
      
      {/* Header */}
      <div className={`flex h-16 items-center border-b border-[#00136b] bg-linear-to-r ${activeTheme.startHeader} px-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]`}>
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border-2 border-white/80 bg-white shadow-md">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full" />
        </div>
        <span className="text-white font-bold text-xl ml-3 drop-shadow-md">Visitor</span>
      </div>

      {/* Columns */}
      <div className={`flex ${isMobile ? 'max-h-[70vh] flex-col overflow-auto' : 'h-87.5'}`}>
        {/* Left Column (White) */}
        <div className={`bg-white flex flex-col py-2 ${isMobile ? 'w-full border-b border-[#d4d0c8]' : 'w-[55%] border-r border-[#d4d0c8]'}`}>
          <div className="flex flex-col gap-1 px-1">
             <button type="button" onClick={() => handleOpenWindow('ie')} className="flex items-center space-x-2 px-2 py-2 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left group">
               <Briefcase size={28} className="text-gray-600 group-hover:text-white" />
               <div className="flex flex-col leading-tight">
                 <span className="font-bold">Internet</span>
                 <span className="text-xs text-gray-500 group-hover:text-white">Portfolio Explorer</span>
               </div>
             </button>
             <button type="button" onClick={() => openExternal(`mailto:${contacts.email}`)} className="flex items-center space-x-2 px-2 py-2 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left group">
               <FileCode size={28} className="text-gray-600 group-hover:text-white" />
               <div className="flex flex-col leading-tight">
                 <span className="font-bold">E-mail</span>
                 <span className="text-xs text-gray-500 group-hover:text-white">Contact Me</span>
               </div>
             </button>
             
             <div className="my-1 border-t border-gray-200" />
             
             <button type="button" onClick={() => openExternal(contacts.github)} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left group">
               <Globe size={24} className="text-gray-700 group-hover:text-white" />
               <span className="text-sm">GitHub</span>
             </button>
             <button type="button" onClick={() => openExternal(contacts.linkedin)} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left group">
               <Users size={24} className="text-blue-700 group-hover:text-white" />
               <span className="text-sm">LinkedIn</span>
             </button>
          </div>
          <div className="mt-auto px-1 pt-2 border-t border-gray-200">
             <button className="flex items-center justify-center space-x-2 w-full py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm font-bold text-sm">
               <span>All Programs</span>
               <span className="text-[#358cf5]">►</span>
             </button>
          </div>
        </div>

        {/* Right Column (Light Blue) */}
        <div className={`bg-[#d3e5fa] flex flex-col py-2 text-[#00136b] ${isMobile ? 'w-full border-t border-white' : 'w-[45%] border-l border-white'}`}>
           <div className="flex flex-col gap-0.5 px-1 font-bold text-sm">
              <button type="button" onClick={() => handleOpenWindow('projects')} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left">
               <Folder size={18} fill="#f1ca4b" className="text-[#f1ca4b]" />
               <span>My Projects</span>
             </button>
             <button type="button" onClick={() => handleOpenWindow('resume')} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left">
               <Folder size={18} fill="#f1ca4b" className="text-[#f1ca4b]" />
               <span>My Resume</span>
             </button>
             <button type="button" onClick={() => handleOpenWindow('computer')} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left">
               <Monitor size={18} />
               <span>My Computer</span>
             </button>

             <div className="my-2 border-t border-[#8fbdf8]" />

             <button type="button" onClick={() => handleOpenWindow('controlPanel')} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left font-normal">
               <Settings size={18} />
               <span>Control Panel</span>
             </button>
             <button type="button" onClick={() => handleOpenWindow('messenger')} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left font-normal">
               <User size={18} />
               <span>MSN Messenger</span>
             </button>
             <button className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left font-normal">
               <HelpCircle size={18} />
               <span>Help and Support</span>
             </button>
             <button type="button" onClick={() => { onOpenRun?.(); toggleMenu(); }} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left font-normal">
               <Search size={18} />
               <span>Run...</span>
             </button>
             <button type="button" onClick={() => { onOpenCommandPalette?.(); toggleMenu(); }} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-[#2f71cd] hover:text-white rounded-sm text-left font-normal">
               <Search size={18} />
               <span>Command Palette</span>
             </button>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-end space-x-4 border-t border-white/50 bg-linear-to-r ${activeTheme.startFooter} px-4 ${isMobile ? 'h-12' : 'h-10'}`}>
         <button type="button" onClick={onRequestRestart} className="flex items-center space-x-1 text-white hover:brightness-110">
           <div className="bg-[#e2a829] rounded-sm p-1 border border-white/50"><LogOut size={16} /></div>
           <span className="text-xs font-bold">Restart</span>
         </button>
         <button type="button" onClick={onRequestShutdown} className="flex items-center space-x-1 text-white hover:brightness-110">
           <div className="bg-[#e04343] rounded-sm p-1 border border-white/50"><Power size={16} /></div>
           <span className="text-xs font-bold">Turn Off Computer</span>
         </button>
      </div>
    </div>
  );
}
