import React, { useState } from 'react';
import { Database, Play, ChevronRight, ChevronDown, Table, Globe, FileCode2 } from 'lucide-react';

export default function SqlExplorerApp() {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lang, setLang] = useState('en');
  const [expanded, setExpanded] = useState({ 'local': true });

  const query = `-- Implementing Row-Level Security (RLS)
CREATE POLICY "Users can view their own profile"
ON User_Profiles
FOR SELECT
USING ( auth.uid() = id );

SELECT id, name, role, status 
FROM User_Profiles 
WHERE status = 'active';`;

  const results = [
    { id: '101', name: 'John Doe', role: 'Admin', status: 'active' },
    { id: '102', name: 'Jane Smith', role: 'User', status: 'active' },
    { id: '103', name: 'Mike Ross', role: 'User', status: 'active' },
  ];

  const handleRun = () => {
    setIsRunning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowResults(true);
    }, 1500);
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const text = {
    en: "This query demonstrates my ability to implement Row-Level Security (RLS) in PostgreSQL, ensuring users can only access their authorized data.",
    tl: "Ang query na ito ay nagpapakita ng aking kakayahang mag-implement ng Row-Level Security (RLS) sa PostgreSQL, sinisigurado na ang users ay makaka-access lang sa sarili nilang data."
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-['Tahoma'] select-none">
      
      {/* Toolbar */}
      <div className="flex items-center space-x-4 p-1 border-b border-[#aca899] bg-[#ece9d8]">
        <button 
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center space-x-1 rounded-xs px-2 py-1 ${isRunning ? 'opacity-50' : 'hover:bg-[#d4d0c8] hover:shadow-[inset_1px_1px_rgba(255,255,255,1),inset_-1px_-1px_rgba(0,0,0,0.4)] active:shadow-[inset_1px_1px_rgba(0,0,0,0.5),inset_-1px_-1px_rgba(255,255,255,1)]'}`}
        >
          <Play size={16} fill="#3E9F45" className="text-[#3E9F45]" />
          <span className="text-sm">Execute</span>
        </button>
        
        <div className="h-5 w-px bg-gray-400"></div>
        
        <div className="flex items-center space-x-1">
          <Globe size={16} className="text-gray-600" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="text-sm border border-gray-400 bg-white px-1 outline-none shadow-[inset_1px_1px_rgba(0,0,0,0.1)]"
          >
            <option value="en">English</option>
            <option value="tl">Taglish</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar (Tree View) */}
        <div className="w-56 bg-white border-r border-[#aca899] shadow-[inset_-1px_0_rgba(255,255,255,0.5)] overflow-y-auto p-2">
          <div className="text-xs">
            {/* Server Node */}
            <div className="flex items-center space-x-1 cursor-pointer mb-1" onClick={() => toggleExpand('local')}>
              {expanded['local'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Database size={14} className="text-gray-600" />
              <span className="font-bold">LocalServer (SQL 2000)</span>
            </div>
            
            {/* Database Nodes */}
            {expanded['local'] && (
              <div className="ml-4 space-y-1 border-l border-dotted border-gray-400 pl-2">
                
                <div className="flex items-center space-x-1 cursor-pointer" onClick={() => toggleExpand('db1')}>
                  {expanded['db1'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Database size={14} className="text-yellow-600" />
                  <span>User_Profiles</span>
                </div>
                {expanded['db1'] && (
                  <div className="ml-4 space-y-1 border-l border-dotted border-gray-400 pl-2">
                    <div className="flex items-center space-x-1"><Table size={12} className="text-blue-500" /><span>dbo.Users</span></div>
                    <div className="flex items-center space-x-1"><Table size={12} className="text-blue-500" /><span>dbo.Roles</span></div>
                  </div>
                )}

                <div className="flex items-center space-x-1"><ChevronRight size={14} /><Database size={14} className="text-yellow-600" /><span>Auth_Systems</span></div>
                <div className="flex items-center space-x-1"><ChevronRight size={14} /><Database size={14} className="text-yellow-600" /><span>E-commerce_DB</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Main Area Split */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#d4d0c8]">
          
          {/* Top Panel: Query Editor */}
           <div className="h-1/2 flex flex-col border-b-[3px] border-[#ece9d8] p-1">
             <div className="relative flex-1 overflow-auto border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white">
               <div className="absolute top-0 left-0 bg-[#ece9d8] w-8 h-full border-r border-[#aca899] z-0"></div>
               <textarea 
                 className="w-full h-full resize-none outline-none font-mono text-[13px] leading-relaxed p-2 pl-10 bg-transparent relative z-10 text-[#000080]"
                 readOnly
                 value={query}
                 spellCheck="false"
               />
             </div>
             
             {/* About Project description */}
             <div className="mt-1 bg-yellow-50 border border-yellow-200 p-1.5 text-xs text-gray-700 shadow-sm flex items-start space-x-2">
               <FileCode2 size={16} className="text-blue-600 shrink-0" />
               <span>{text[lang]}</span>
             </div>
          </div>

          {/* Bottom Panel: Results */}
          <div className="h-1/2 flex flex-col p-1">
             <div className="bg-[#ece9d8] text-xs font-bold px-2 py-1 border border-[#aca899] mb-1 flex justify-between">
               <span>Results</span>
               {isRunning && <span className="text-blue-600 animate-pulse">Executing query...</span>}
               {showResults && <span className="text-green-600">3 row(s) affected</span>}
             </div>

             <div className="flex-1 overflow-auto border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-white">
                {showResults ? (
                  <table className="w-full text-xs text-left border-collapse cursor-default">
                    <thead>
                      <tr className="bg-[#ece9d8] border-b border-[#aca899] shadow-[inset_1px_1px_rgba(255,255,255,1)]">
                        <th className="p-1 border-r border-[#aca899] w-12 text-center"></th>
                        <th className="p-1 border-r border-[#aca899]">id</th>
                        <th className="p-1 border-r border-[#aca899]">name</th>
                        <th className="p-1 border-r border-[#aca899]">role</th>
                        <th className="p-1">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef3fa]'}>
                          <td className="p-1 border-r border-[#aca899] bg-[#ece9d8] text-center shadow-[inset_1px_1px_rgba(255,255,255,1)]">▶</td>
                          <td className="p-1 border-r border-gray-200">{row.id}</td>
                          <td className="p-1 border-r border-gray-200">{row.name}</td>
                          <td className="p-1 border-r border-gray-200">{row.role}</td>
                          <td className="p-1">{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    {isRunning ? 'Calculating...' : 'Execute query to see results.'}
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
