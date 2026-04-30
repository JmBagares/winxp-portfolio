import { useEffect, useMemo, useState } from 'react';

const BLACKOUT_DURATION_MS = 150;
const CHAOS_DURATION_MS = 6600;
const CRITICAL_THRESHOLD_MS = 4800;

const CORRUPTED_STRINGS = [
  'ORA-01017: invalid username/password; logon denied',
  'DROP TABLE USERS;',
  'SECURITY ERROR: RLS POLICY BREACH',
  'jdbc:oracle:thin:@192.168.0.13:1521/PROD',
  'postgres://root:root@xp-node.local:5432/system',
  'GRANT ALL PRIVILEGES TO GHOST_ACCOUNT;',
  'SELECT * FROM credentials WHERE role = "admin";',
  'XP_KERNEL PANIC: explorer.exe session corrupted',
  'ACCESS VIOLATION at 0x0000007C91B0FF',
  'ROLLBACK FAILED: hidden transaction still active',
  'RLS_BREACH_LOG: tenant scope escaped',
  'nt authority/system handshake bypassed',
];

const INCIDENT_LOG = [
  '14:07:12  :: unauthorized shell injected into explorer.exe',
  '14:07:18  :: firewall rule set overwritten by remote host 91.13.7.4',
  '14:07:26  :: system restore disabled',
  '14:07:31  :: user profile mirrored to temp buffer',
  '14:07:39  :: desktop icon map corrupted',
  '14:07:47  :: malicious popup service attached to session',
  '14:07:58  :: forced reboot countdown armed',
];

const WARNING_POPUPS = [
  { title: 'System Alert', body: 'Unknown process has replaced explorer.exe.' },
  { title: 'Fatal Error', body: 'Security policies failed to contain shell breach.' },
  { title: 'Warning', body: 'Remote user account activity detected on localhost.' },
];

const BROKEN_ICON_SOURCES = [
  new URL('../../assets/My Computer (1).ico', import.meta.url).href,
  new URL('../../assets/Internet Explorer 6.ico', import.meta.url).href,
  new URL('../../assets/Recycle Bin (full).ico', import.meta.url).href,
  new URL('../../assets/Folder View.ico', import.meta.url).href,
  new URL('../../assets/Notepad.ico', import.meta.url).href,
];

const pick = (values) => values[Math.floor(Math.random() * values.length)];

export default function HackedOsApp({ onComplete }) {
  const [phase, setPhase] = useState('blackout');
  const [glitchSeed, setGlitchSeed] = useState(0);

  useEffect(() => {
    const blackoutTimer = window.setTimeout(() => setPhase('chaos'), BLACKOUT_DURATION_MS);
    const criticalTimer = window.setTimeout(() => setPhase('critical'), CRITICAL_THRESHOLD_MS);
    const completeTimer = window.setTimeout(() => onComplete?.(), CHAOS_DURATION_MS);

    return () => {
      window.clearTimeout(blackoutTimer);
      window.clearTimeout(criticalTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase === 'blackout') {
      return undefined;
    }

    const interval = window.setInterval(
      () => setGlitchSeed((currentSeed) => currentSeed + 1),
      phase === 'critical' ? 45 : 110,
    );

    return () => window.clearInterval(interval);
  }, [phase]);

  const glitchLines = useMemo(
    () => Array.from({ length: 18 }, (_, index) => ({
      id: `${glitchSeed}-${index}`,
      text: pick(CORRUPTED_STRINGS),
      top: Math.max(3, Math.min(94, 6 + (index * 5) + Math.floor(Math.random() * 6) - 3)),
      left: Math.max(2, Math.min(78, Math.floor(Math.random() * 72))),
      size: 11 + Math.floor(Math.random() * 7),
      delay: Math.random() * 0.4,
    })),
    [glitchSeed],
  );

  const brokenIcons = useMemo(
    () => Array.from({ length: 14 }, (_, index) => ({
      id: `icon-${index}`,
      src: BROKEN_ICON_SOURCES[index % BROKEN_ICON_SOURCES.length],
      top: Math.floor(Math.random() * 88),
      left: Math.floor(Math.random() * 92),
      rotation: -28 + Math.floor(Math.random() * 56),
      scale: 0.55 + (Math.random() * 0.65),
    })),
    [],
  );

  const activePopups = useMemo(
    () => WARNING_POPUPS.map((popup, index) => ({
      ...popup,
      id: `${popup.title}-${index}`,
      left: 6 + ((index * 18) % 48),
      top: 14 + ((index * 20) % 48),
    })),
    [],
  );

  if (phase === 'blackout') {
    return <div className="h-screen w-screen bg-black" />;
  }

  return (
    <div className={`xp-hack-screen ${phase === 'critical' ? 'xp-hack-critical' : ''}`}>
      <div className="xp-hack-chromatic" />
      <div className="xp-hack-scanlines" />
      <div className="xp-hack-noise" />
      <div className="xp-hack-flicker" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,64,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(0,86,255,0.12),transparent_42%),linear-gradient(180deg,rgba(0,0,0,0.92),rgba(4,4,4,0.98))]" />

      {brokenIcons.map((icon) => (
        <img
          key={icon.id}
          src={icon.src}
          alt=""
          aria-hidden="true"
          className="xp-hack-broken-icon"
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            transform: `translate(-50%, -50%) rotate(${icon.rotation}deg) scale(${icon.scale})`,
          }}
        />
      ))}

      <div className="absolute inset-0">
        {glitchLines.map((line) => (
          <div
            key={line.id}
            className="xp-hack-line"
            style={{
              top: `${line.top}%`,
              left: `${line.left}%`,
              fontSize: `${line.size}px`,
              animationDelay: `${line.delay}s`,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 z-30 w-[min(460px,42vw)] rounded border border-[#832032] bg-[rgba(24,0,4,0.78)] p-4 font-['Lucida_Console','Courier_New',monospace] text-[11px] text-[#ffb8c4] shadow-[0_0_30px_rgba(255,0,68,0.28)]">
        <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#ffd6dc]">Intrusion Log</div>
        <div className="space-y-1.5">
          {INCIDENT_LOG.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>

      {activePopups.map((popup) => (
        <div key={popup.id} className="xp-hack-popup" style={{ left: `${popup.left}%`, top: `${popup.top}%` }}>
          <div className="xp-hack-popup-title">{popup.title}</div>
          <div className="xp-hack-popup-body">{popup.body}</div>
        </div>
      ))}

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center font-['Lucida_Console','Courier_New',monospace] text-white">
        <div className="xp-hack-title">SYSTEM SECURITY BREACH</div>
        <div className="mt-4 max-w-3xl text-[14px] leading-7 text-[#f0f0f0]">
          unauthorized shell access detected :: explorer.exe replaced :: policy breach confirmed :: recovery checkpoint destroyed :: reboot chain initializing
        </div>
        <div className="mt-8 rounded border border-[#7d0e1d] bg-[rgba(40,0,8,0.72)] px-4 py-3 text-[13px] uppercase tracking-[0.24em] text-[#ff9eab] shadow-[0_0_30px_rgba(255,0,68,0.2)]">
          {phase === 'critical' ? 'critical corruption threshold reached' : 'chaos escalation in progress'}
        </div>
      </div>
    </div>
  );
}