import React, { useMemo, useState } from 'react';
import { ChevronRight, Cpu, Folder, FolderOpen, HardDrive, Monitor, Settings, Wrench } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

const DRIVES = [
  { id: 'local-disk', label: 'Local Disk (C:)', caption: 'System', free: '18.4 GB free of 40.0 GB', color: 'from-[#4aa4ff] to-[#1e68d6]' },
  { id: 'projects', label: 'Projects (D:)', caption: 'Portfolio Data', free: '7.2 GB free of 12.0 GB', color: 'from-[#68c96a] to-[#2f9140]' },
  { id: 'backup', label: 'Backup (E:)', caption: 'Archives', free: '3.1 GB free of 8.0 GB', color: 'from-[#f0b34c] to-[#cd7c1f]' },
];

const DRIVE_CONTENT = {
  'local-disk': {
    type: 'drive',
    children: ['program-files', 'documents-settings', 'windows-folder'],
  },
  'projects': {
    type: 'drive',
    children: ['portfolio-projects', 'deliverables'],
  },
  backup: {
    type: 'drive',
    children: ['snapshots', 'archives'],
  },
  'program-files': {
    type: 'folder',
    label: 'Program Files',
    detail: 'Installed front-end tooling and portfolio shell components.',
    summary: 'Core tools used to build and run the portfolio shell.',
    items: [
      { kind: 'folder', label: 'React Runtime', detail: 'Component tree, state, and rendering logic.' },
      { kind: 'folder', label: 'Vite Bundler', detail: 'Fast dev/build pipeline for the desktop shell.' },
      { kind: 'file', label: 'shell.dll', detail: 'Nostalgia renderer and fake XP window chrome.' },
    ],
  },
  'documents-settings': {
    type: 'folder',
    label: 'Documents and Settings',
    detail: `User profiles, wallpapers, and contact shortcuts for ${portfolioData.profile.name}.`,
    summary: 'Per-user files, notes, and shortcut metadata.',
    items: [
      { kind: 'folder', label: portfolioData.profile.name, detail: 'Desktop shortcuts, saved themes, and picture settings.' },
      { kind: 'file', label: 'Contacts.url', detail: 'Quick links for GitHub, LinkedIn, and email outreach.' },
      { kind: 'file', label: 'Wallpaper.ini', detail: 'Current wallpaper and Luna theme preferences.' },
    ],
  },
  'windows-folder': {
    type: 'folder',
    label: 'WINDOWS',
    detail: 'System resources, nostalgic branding, and shell behavior.',
    summary: 'Operating system assets and desktop shell internals.',
    items: [
      { kind: 'folder', label: 'system32', detail: 'Window chrome, fake command routing, and sound hooks.' },
      { kind: 'folder', label: 'Media', detail: 'Startup chimes, alert beeps, and UI sound effects.' },
      { kind: 'file', label: 'winver.exe', detail: 'About Windows profile summary entry point.' },
    ],
  },
  'portfolio-projects': {
    type: 'folder',
    label: 'Portfolio Projects',
    detail: 'Interactive project folders, screenshots, links, and stack details.',
    summary: 'Each folder maps to a polished case-study window in the portfolio.',
    items: portfolioData.projects.map((project) => ({ kind: 'folder', label: project.title, detail: `${project.status} - ${project.stack.join(', ')}` })),
  },
  deliverables: {
    type: 'folder',
    label: 'Client Deliverables',
    detail: 'Deployable builds, screenshots, and packaged walkthrough material.',
    summary: 'Artifacts prepared for demos, reviews, and deployment handoff.',
    items: [
      { kind: 'file', label: 'website-launch-checklist.doc', detail: 'Domain, SEO, and responsiveness release checks.' },
      { kind: 'file', label: 'app-demo-notes.txt', detail: 'Feature notes for thesis and portfolio walkthroughs.' },
      { kind: 'file', label: 'gallery-export.zip', detail: 'Mini captures exported into the project gallery.' },
    ],
  },
  snapshots: {
    type: 'folder',
    label: 'System Snapshots',
    detail: 'Recovery images and milestone screenshots preserved for safe rollback.',
    summary: 'Saved states and highlight captures from earlier iterations.',
    items: [
      { kind: 'file', label: 'desktop-build-04-2026.img', detail: 'Snapshot before the command palette and run dialog additions.' },
      { kind: 'file', label: 'security-report.log', detail: 'Restricted-folder incident notes and recovery details.' },
    ],
  },
  archives: {
    type: 'folder',
    label: 'Archives',
    detail: 'Old experiments, mockups, and retired shell ideas.',
    summary: 'Reference material preserved without surfacing it on the main desktop.',
    items: [
      { kind: 'file', label: 'xp-shell-v1.bak', detail: 'Earlier desktop prototype with basic windows only.' },
      { kind: 'file', label: 'ie-mockups.ppt', detail: 'Concepts for the retro social pages and browser shell.' },
    ],
  },
};

const HARDWARE = [
  { label: 'System', value: `${portfolioData.profile.role} / ${portfolioData.profile.location}`, icon: Monitor },
  { label: 'Processor', value: 'Creative Front-End Engine @ 3.20 GHz', icon: Cpu },
  { label: 'Memory', value: '2048 MB of nostalgia-backed workflow RAM', icon: HardDrive },
  { label: 'Tools', value: portfolioData.skills.flatMap((group) => group.items).slice(0, 4).join(', '), icon: Wrench },
];

const getNodeById = (id) => {
  if (DRIVES.some((drive) => drive.id === id)) {
    return DRIVE_CONTENT[id];
  }
  return DRIVE_CONTENT[id] || null;
};

const getTreeChildren = (selectedDriveId) => (DRIVE_CONTENT[selectedDriveId]?.children || []).map((childId) => ({ id: childId, ...DRIVE_CONTENT[childId] }));

export default function MyComputerApp({ onOpenProjects }) {
  const [selectedDriveId, setSelectedDriveId] = useState(DRIVES[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState(DRIVES[0].id);
  const selectedDrive = useMemo(() => DRIVES.find((drive) => drive.id === selectedDriveId) ?? DRIVES[0], [selectedDriveId]);
  const selectedNode = useMemo(() => getNodeById(selectedNodeId) ?? getNodeById(selectedDriveId), [selectedDriveId, selectedNodeId]);
  const treeChildren = useMemo(() => getTreeChildren(selectedDriveId), [selectedDriveId]);

  const handleDriveSelect = (driveId) => {
    setSelectedDriveId(driveId);
    setSelectedNodeId(driveId);
  };

  const handleOpenItem = (item) => {
    const matchingProject = portfolioData.projects.find((project) => project.title === item.label);
    if (matchingProject) {
      onOpenProjects?.();
      return;
    }
    const childEntry = Object.entries(DRIVE_CONTENT).find(([, value]) => value.label === item.label);
    if (childEntry) {
      setSelectedNodeId(childEntry[0]);
    }
  };

  const breadcrumbLabel = selectedNode?.label || selectedDrive.label;

  return (
    <div className="flex h-full flex-col font-['Tahoma'] select-none">
      <div className="flex items-center space-x-2 border-b border-[#aca899] bg-[#ece9d8] p-1">
        <span className="pl-1 text-sm text-gray-500">Address</span>
        <div className="flex flex-1 items-center border border-[#aca899] bg-white px-2 py-[2px] text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
          <Monitor size={14} className="mr-1 inline-block text-blue-600" /> My Computer\{selectedDrive.label}\{selectedNodeId === selectedDriveId ? '' : breadcrumbLabel}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[190px_minmax(0,1fr)] overflow-hidden">
        <aside className="overflow-y-auto bg-gradient-to-b from-[#7492ea] to-[#4567c9] p-2">
          <div className="flex items-center justify-between rounded-tl-sm rounded-tr-sm border border-blue-400 bg-white p-1 text-sm font-bold text-[#00136b] shadow-sm">
            System Tasks
            <span className="text-[10px]">︽</span>
          </div>
          <div className="flex flex-col gap-2 border border-t-0 border-blue-400 bg-[#d3e5fa] p-2 text-xs text-[#00136b]">
            <div className="flex items-center"><Monitor size={14} className="mr-2 text-blue-600" /> View system info</div>
            <div className="flex items-center"><Settings size={14} className="mr-2 text-blue-600" /> Change a setting</div>
            <div className="flex items-center"><HardDrive size={14} className="mr-2 text-blue-600" /> Manage storage</div>
          </div>

          <div className="mt-3 rounded-tl-sm rounded-tr-sm border border-blue-400 bg-white p-1 text-sm font-bold text-[#00136b] shadow-sm">Folders</div>
          <div className="border border-t-0 border-blue-400 bg-[#d3e5fa] p-2 text-xs text-[#00136b]">
            {DRIVES.map((drive) => (
              <button
                key={drive.id}
                type="button"
                onClick={() => handleDriveSelect(drive.id)}
                className={`mb-2 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left ${selectedDriveId === drive.id ? 'bg-white font-bold text-[#003399]' : 'hover:bg-white/60'}`}
              >
                <HardDrive size={14} />
                <span>{drive.label}</span>
              </button>
            ))}

            <div className="mt-2 border-t border-[#9eb5df] pt-2">
              {treeChildren.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`mb-1 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left ${selectedNodeId === node.id ? 'bg-white font-bold text-[#003399]' : 'hover:bg-white/60'}`}
                >
                  {selectedNodeId === node.id ? <FolderOpen size={14} className="text-[#c98200]" /> : <Folder size={14} className="text-[#c98200]" fill="#f8d775" />}
                  <span className="min-w-0 truncate">{node.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="overflow-y-auto bg-white p-4">
          <section>
            <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold text-[#00136b]">Hard Disk Drives</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {DRIVES.map((drive) => (
                <button
                  key={drive.id}
                  type="button"
                  onClick={() => handleDriveSelect(drive.id)}
                  className={`rounded border p-3 text-left shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] ${drive.id === selectedDrive.id ? 'border-[#3157a5] bg-[#f3f8ff]' : 'border-[#c8d4e8] bg-[#fbfdff] hover:bg-blue-50'}`}
                >
                  <div className={`mb-3 flex h-12 items-center justify-center rounded border border-white/20 bg-linear-to-r ${drive.color} text-white`}>
                    <HardDrive size={22} />
                  </div>
                  <div className="text-[12px] font-bold text-[#003399]">{drive.label}</div>
                  <div className="mt-1 text-[11px] text-[#5f6f8b]">{drive.caption}</div>
                  <div className="mt-2 text-[10px] text-[#68778f]">{drive.free}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.8)]">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#003399]">
                <span>Contents of {selectedNodeId === selectedDriveId ? selectedDrive.label : selectedNode?.label}</span>
                {selectedNodeId !== selectedDriveId && (
                  <button type="button" onClick={() => setSelectedNodeId(selectedDriveId)} className="rounded border border-[#b7c9e8] bg-[#eef4ff] px-2 py-1 text-[10px] text-[#214ea5] hover:bg-[#dfeafe]">
                    Back to root
                  </button>
                )}
              </div>

              <div className="mb-4 rounded border border-[#d5dff1] bg-white p-3">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#214ea5]">
                  <FolderOpen size={18} className="text-[#c98200]" />
                  <span>{selectedNodeId === selectedDriveId ? selectedDrive.label : selectedNode?.label}</span>
                </div>
                <div className="mt-2 text-[11px] leading-5 text-[#51617d]">
                  {selectedNodeId === selectedDriveId ? `${selectedDrive.caption}. Select a folder from the tree to browse deeper into the fake disk.` : selectedNode?.detail}
                </div>
                {selectedNode?.summary && <div className="mt-2 text-[11px] leading-5 text-[#62738f]">{selectedNode.summary}</div>}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(selectedNodeId === selectedDriveId ? treeChildren : selectedNode?.items || []).map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleOpenItem(item)}
                    className="rounded border border-[#d5dff1] bg-white p-3 text-left hover:bg-[#f5f9ff]"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      {item.kind === 'file' ? <Monitor size={24} className="text-[#4876d8]" /> : <Folder size={28} className="text-[#f1ca4b]" fill="#f8d775" />}
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-bold text-[#214ea5]">{item.label}</div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-[#6a7d9d]">
                          <span>{item.kind || 'folder'}</span>
                          {item.kind !== 'file' && <ChevronRight size={11} />}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] leading-5 text-[#51617d]">{item.detail}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded border border-[#c8d4e8] bg-[#fbfdff] p-4 shadow-[inset_1px_1px_rgba(255,255,255,0.8)]">
              <h3 className="mb-3 text-sm font-bold text-[#003399]">Hardware Properties</h3>
              <div className="space-y-3">
                {HARDWARE.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.label} className="rounded border border-[#d7e0ef] bg-white p-3">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-[#214ea5]">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      <div className="mt-2 text-[11px] leading-5 text-[#52617e]">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}