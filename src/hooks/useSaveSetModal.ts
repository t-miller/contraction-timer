import { useState, useCallback } from 'react';

interface UseSaveSetModalOptions {
  onSave: (name: string) => void;
  defaultName?: string;
  fallbackName?: string;
}

interface UseSaveSetModalResult {
  isVisible: boolean;
  setName: string;
  open: () => void;
  cancel: () => void;
  save: () => void;
  updateSetName: (name: string) => void;
}

export function useSaveSetModal({
  onSave,
  defaultName,
  fallbackName,
}: UseSaveSetModalOptions): UseSaveSetModalResult {
  const [isVisible, setIsVisible] = useState(false);
  const [setName, setSetName] = useState('');

  const open = useCallback(() => {
    setSetName(defaultName ?? '');
    setIsVisible(true);
  }, [defaultName]);

  const cancel = useCallback(() => {
    setIsVisible(false);
    setSetName('');
  }, []);

  const save = useCallback(() => {
    const name = setName.trim() || fallbackName || '';
    if (name) {
      onSave(name);
    }
    setIsVisible(false);
    setSetName('');
  }, [setName, onSave, fallbackName]);

  const updateSetName = useCallback((name: string) => {
    setSetName(name);
  }, []);

  return { isVisible, setName, open, cancel, save, updateSetName };
}
