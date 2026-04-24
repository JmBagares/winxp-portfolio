import React, { useState } from 'react';
import Desktop from './components/Desktop';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';

function App() {
  const [phase, setPhase] = useState('boot'); // 'boot', 'login', 'desktop'

  if (phase === 'boot') {
    return <BootSequence onComplete={() => setPhase('login')} />;
  }
  
  if (phase === 'login') {
    return <LoginScreen onLogin={() => setPhase('desktop')} />;
  }

  return (
    <Desktop />
  );
}

export default App;
