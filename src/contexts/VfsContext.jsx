import React, { createContext, useContext, useState, useEffect } from 'react';
import { readStoredValue, writeStoredValue } from '../utils/systemSettings';

const VfsContext = createContext(null);

const VFS_STORAGE_KEY = 'xp-vfs-state';

const DEFAULT_VFS_STATE = [
  { id: 'computer', name: 'My Computer', type: 'app', x_position: 10, y_position: 10, isOpen: false },
  { id: 'projects', name: 'My Projects', type: 'folder', x_position: 10, y_position: 100, isOpen: false },
  { id: 'pictures', name: 'My Pictures', type: 'folder', x_position: 10, y_position: 190, isOpen: false },
  { id: 'resume', name: 'Resume.txt', type: 'text', x_position: 10, y_position: 280, isOpen: false },
  { id: 'recycle', name: 'Recycle Bin', type: 'app', x_position: 10, y_position: 370, isOpen: false },
  { id: 'ie', name: 'Internet Explorer', type: 'app', x_position: 10, y_position: 460, isOpen: false },
  { id: 'messenger', name: 'MSN Messenger', type: 'app', x_position: 100, y_position: 10, isOpen: false },
  { id: 'controlPanel', name: 'Control Panel', type: 'app', x_position: 100, y_position: 100, isOpen: false },
  { id: 'doNotOpen', name: 'DO NOT OPEN', type: 'folder', x_position: 100, y_position: 190, isOpen: false },
];

export function VfsProvider({ children }) {
  const [fileSystem, setFileSystem] = useState(() => {
    return readStoredValue(VFS_STORAGE_KEY, DEFAULT_VFS_STATE);
  });

  useEffect(() => {
    writeStoredValue(VFS_STORAGE_KEY, fileSystem);
  }, [fileSystem]);

  const updateFilePosition = (id, x, y) => {
    setFileSystem(prev => prev.map(f => f.id === id ? { ...f, x_position: x, y_position: y } : f));
  };

  const toggleFileOpen = (id, isOpen) => {
    setFileSystem(prev => prev.map(f => f.id === id ? { ...f, isOpen } : f));
  };

  const addFile = (file) => {
    setFileSystem(prev => [...prev, file]);
  };

  const deleteFile = (id) => {
    setFileSystem(prev => prev.filter(f => f.id !== id));
  };

  const updateFile = (id, updates) => {
    setFileSystem(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <VfsContext.Provider value={{ fileSystem, updateFilePosition, toggleFileOpen, addFile, deleteFile, updateFile }}>
      {children}
    </VfsContext.Provider>
  );
}

export function useVfs() {
  const context = useContext(VfsContext);
  if (!context) {
    throw new Error('useVfs must be used within a VfsProvider');
  }
  return context;
}
