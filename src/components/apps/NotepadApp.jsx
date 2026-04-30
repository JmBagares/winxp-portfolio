import React from 'react';
import { portfolioData } from '../../data/portfolioData';

export default function NotepadApp({ content, documentTitle = 'Resume.txt' }) {
  const resumeText = content || [
    portfolioData.profile.name,
    portfolioData.profile.role,
    '',
    'ABOUT ME',
    ...portfolioData.profile.about.map((paragraph) => `- ${paragraph}`),
    '',
    'EDUCATION',
    ...portfolioData.education.map((entry) => `- ${entry.school}: ${entry.detail}`),
    '',
    'CONTACTS',
    `- Email: ${portfolioData.contacts.email}`,
    `- GitHub: ${portfolioData.contacts.github}`,
    `- LinkedIn: ${portfolioData.contacts.linkedin}`,
  ].join('\n');

  return (
    <div className="flex flex-col h-full bg-white font-['Tahoma']">
      <div className="flex space-x-3 text-sm px-2 py-1 bg-[#ece9d8] border-b border-[#aca899] select-none">
        <span className="hover:bg-blue-100 hover:border-blue-300 border border-transparent px-1 cursor-pointer rounded-sm">File</span>
        <span className="hover:bg-blue-100 hover:border-blue-300 border border-transparent px-1 cursor-pointer rounded-sm">Edit</span>
        <span className="hover:bg-blue-100 hover:border-blue-300 border border-transparent px-1 cursor-pointer rounded-sm">Format</span>
        <span className="hover:bg-blue-100 hover:border-blue-300 border border-transparent px-1 cursor-pointer rounded-sm">View</span>
        <span className="hover:bg-blue-100 hover:border-blue-300 border border-transparent px-1 cursor-pointer rounded-sm">Help</span>
      </div>
      <div className="border-b border-[#d4d0c8] bg-[#f7f4e8] px-2 py-0.5 text-[11px] text-[#555]">{documentTitle}</div>
      <textarea 
        className="flex-1 w-full p-2 resize-none outline-none font-mono text-sm leading-relaxed"
        readOnly
        value={resumeText}
      />
    </div>
  );
}
