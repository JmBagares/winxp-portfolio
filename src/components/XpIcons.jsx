// Authentic Windows XP-style SVG Icon Components
// All drawn from scratch to match the Luna theme aesthetic

export const MyComputerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    {/* Monitor body */}
    <rect x="4" y="4" width="40" height="28" rx="3" fill="url(#monitorGrad)" stroke="#5a7090" strokeWidth="0.7"/>
    <defs>
      <linearGradient id="monitorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b4c8e0"/>
        <stop offset="100%" stopColor="#7a9abe"/>
      </linearGradient>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0855d4"/>
        <stop offset="100%" stopColor="#1b45a8"/>
      </linearGradient>
    </defs>
    {/* Screen */}
    <rect x="7" y="7" width="34" height="20" rx="1" fill="url(#screenGrad)"/>
    {/* Screen shine */}
    <rect x="7" y="7" width="34" height="5" rx="1" fill="rgba(255,255,255,0.15)"/>
    {/* XP logo on screen */}
    <text x="24" y="20" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle" fontFamily="Arial" fontStyle="italic">XP</text>
    {/* Base stand */}
    <rect x="17" y="32" width="14" height="3" rx="1" fill="#8aacc8"/>
    <rect x="14" y="35" width="20" height="3" rx="2" fill="#6a8caa"/>
    {/* Indicator light */}
    <circle cx="24" cy="29.5" r="1.2" fill="#4cee44"/>
  </svg>
);

export const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f7d96a"/>
        <stop offset="100%" stopColor="#e6a800"/>
      </linearGradient>
      <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe97a"/>
        <stop offset="100%" stopColor="#f0b800"/>
      </linearGradient>
    </defs>
    {/* Folder back */}
    <path d="M4 16 Q4 12 8 12 L20 12 L22 9 L40 9 Q44 9 44 13 L44 38 Q44 42 40 42 L8 42 Q4 42 4 38 Z" fill="url(#folderBack)" stroke="#c78a00" strokeWidth="0.6"/>
    {/* Folder front face */}
    <path d="M4 18 L44 18 L44 38 Q44 42 40 42 L8 42 Q4 42 4 38 Z" fill="url(#folderFront)" stroke="#c78a00" strokeWidth="0.6"/>
    {/* Shine */}
    <path d="M5 18 L43 18 L43 22 Q24 28 5 22 Z" fill="rgba(255,255,255,0.35)"/>
    {/* Lines to simulate files inside */}
    <rect x="14" y="28" width="20" height="2" rx="1" fill="rgba(180,130,0,0.4)"/>
    <rect x="14" y="33" width="14" height="2" rx="1" fill="rgba(180,130,0,0.4)"/>
  </svg>
);

export const DatabaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5ebbff"/>
        <stop offset="100%" stopColor="#0055cc"/>
      </linearGradient>
      <linearGradient id="dbTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8dd4ff"/>
        <stop offset="100%" stopColor="#4aabff"/>
      </linearGradient>
    </defs>
    {/* Cylinder body */}
    <rect x="8" y="14" width="32" height="24" rx="1" fill="url(#dbGrad)" stroke="#0044aa" strokeWidth="0.7"/>
    {/* Ellipse top */}
    <ellipse cx="24" cy="14" rx="16" ry="5" fill="url(#dbTop)" stroke="#0044aa" strokeWidth="0.7"/>
    {/* Middle dividers */}
    <ellipse cx="24" cy="22" rx="16" ry="4" fill="none" stroke="#0066dd" strokeWidth="1"/>
    <ellipse cx="24" cy="30" rx="16" ry="4" fill="none" stroke="#0066dd" strokeWidth="1"/>
    {/* Bottom ellipse */}
    <ellipse cx="24" cy="38" rx="16" ry="5" fill="#0048b8" stroke="#0044aa" strokeWidth="0.7"/>
    {/* Shine on top */}
    <ellipse cx="20" cy="12" rx="7" ry="2" fill="rgba(255,255,255,0.4)"/>
  </svg>
);

export const NotepadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="noteGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#d0dff0"/>
      </linearGradient>
    </defs>
    {/* Paper */}
    <rect x="8" y="4" width="32" height="40" rx="2" fill="url(#noteGrad)" stroke="#9ab0cc" strokeWidth="0.8"/>
    {/* Dog-ear fold */}
    <path d="M32 4 L40 12 L32 12 Z" fill="#b0c8e0" stroke="#9ab0cc" strokeWidth="0.5"/>
    {/* Blue margin line */}
    <line x1="15" y1="4" x2="15" y2="44" stroke="#c0c8ff" strokeWidth="1.2"/>
    {/* Text lines */}
    <rect x="17" y="13" width="18" height="1.5" rx="0.5" fill="#555"/>
    <rect x="17" y="18" width="18" height="1.5" rx="0.5" fill="#555"/>
    <rect x="17" y="23" width="14" height="1.5" rx="0.5" fill="#555"/>
    <rect x="17" y="28" width="18" height="1.5" rx="0.5" fill="#555"/>
    <rect x="17" y="33" width="10" height="1.5" rx="0.5" fill="#555"/>
    {/* Blue pencil */}
    <rect x="10" y="26" width="3" height="12" rx="1" fill="#4488cc" transform="rotate(35 11 30)"/>
    <polygon points="13,38 14,42 11,40" fill="#ffcc55" transform="rotate(35 11 30)"/>
  </svg>
);

export const RecycleBinIcon = ({ isEmpty = true }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
    <defs>
      <linearGradient id="binGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#90b8e0"/>
        <stop offset="100%" stopColor="#4a7ab0"/>
      </linearGradient>
    </defs>
    {/* Bin lid */}
    <rect x="10" y="8" width="28" height="5" rx="2" fill="url(#binGrad)" stroke="#3a6090" strokeWidth="0.7"/>
    <rect x="19" y="5" width="10" height="5" rx="2" fill="url(#binGrad)" stroke="#3a6090" strokeWidth="0.7"/>
    {/* Bin body */}
    <path d="M12 13 L15 42 L33 42 L36 13 Z" fill="url(#binGrad)" stroke="#3a6090" strokeWidth="0.7"/>
    {/* Vertical ribs */}
    <line x1="20" y1="16" x2="19" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
    <line x1="24" y1="16" x2="24" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
    <line x1="28" y1="16" x2="29" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
    {/* Shine */}
    <path d="M13 13 L18 13 L17 30 L13 25 Z" fill="rgba(255,255,255,0.2)"/>
    {/* Paper (if not empty) */}
    {!isEmpty && <rect x="18" y="18" width="12" height="10" rx="1" fill="white" opacity="0.7"/>}
  </svg>
);
