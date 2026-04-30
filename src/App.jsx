import React, { useEffect, useState } from 'react';
import Desktop from './components/Desktop';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';
import HackedOsApp from './components/apps/HackedOsApp';
import ShutdownScreen from './components/ShutdownScreen';
import { playSystemSound } from './utils/systemSounds';
import { readStoredValue, SECURITY_INCIDENT_STORAGE_KEY } from './utils/systemSettings';
import { VfsProvider } from './contexts/VfsContext';

function App() {
  const [phase, setPhase] = useState('boot'); // 'boot', 'login', 'desktop', 'restart', 'shutdown'
  const [isHackActive, setIsHackActive] = useState(false);
  const [isSecurityCompromised, setIsSecurityCompromised] = useState(() => readStoredValue(SECURITY_INCIDENT_STORAGE_KEY, false));

  useEffect(() => {
    window.localStorage.setItem(SECURITY_INCIDENT_STORAGE_KEY, JSON.stringify(isSecurityCompromised));
  }, [isSecurityCompromised]);

  const handleTriggerSecurityBreach = () => {
    playSystemSound('error');
    setIsHackActive(true);
  };

  const handleHackSequenceComplete = () => {
    setIsHackActive(false);
    setIsSecurityCompromised(true);
    setPhase('boot');
  };

  const handleRequestRestart = () => {
    playSystemSound('click');
    setPhase('restart');
  };

  const handleRequestShutdown = () => {
    playSystemSound('click');
    setPhase('shutdown');
  };

  if (isHackActive) {
    return <HackedOsApp onComplete={handleHackSequenceComplete} />;
  }

  if (phase === 'boot') {
    return <BootSequence onComplete={() => setPhase('login')} />;
  }

  if (phase === 'restart') {
    return <ShutdownScreen mode="restart" onComplete={() => setPhase('boot')} />;
  }

  if (phase === 'shutdown') {
    return <ShutdownScreen mode="shutdown" onComplete={() => setPhase('login')} />;
  }
  
  if (phase === 'login') {
    return <LoginScreen onLogin={() => setPhase('desktop')} />;
  }

  return (
    <VfsProvider>
      <Desktop
        isSecurityCompromised={isSecurityCompromised}
        onTriggerSecurityBreach={handleTriggerSecurityBreach}
        onRequestRestart={handleRequestRestart}
        onRequestShutdown={handleRequestShutdown}
      />
    </VfsProvider>
  );
}

export default App;
