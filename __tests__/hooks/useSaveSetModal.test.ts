import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSaveSetModal } from '../../src/hooks/useSaveSetModal';

describe('useSaveSetModal', () => {
  it('starts with modal closed', () => {
    const { result } = renderHook(() => useSaveSetModal({ onSave: vi.fn() }));

    expect(result.current.isVisible).toBe(false);
    expect(result.current.setName).toBe('');
  });

  it('opens modal with empty name by default', () => {
    const { result } = renderHook(() => useSaveSetModal({ onSave: vi.fn() }));

    act(() => {
      result.current.open();
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.setName).toBe('');
  });

  it('opens modal with default name when provided', () => {
    const { result } = renderHook(() =>
      useSaveSetModal({ onSave: vi.fn(), defaultName: 'Custom Name' })
    );

    act(() => {
      result.current.open();
    });

    expect(result.current.setName).toBe('Custom Name');
  });

  it('updates set name', () => {
    const { result } = renderHook(() => useSaveSetModal({ onSave: vi.fn() }));

    act(() => {
      result.current.open();
      result.current.updateSetName('New Name');
    });

    expect(result.current.setName).toBe('New Name');
  });

  it('calls onSave with trimmed name and closes modal', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useSaveSetModal({ onSave }));

    act(() => {
      result.current.open();
      result.current.updateSetName('  Test Set  ');
    });

    act(() => {
      result.current.save();
    });

    expect(onSave).toHaveBeenCalledWith('Test Set');
    expect(result.current.isVisible).toBe(false);
    expect(result.current.setName).toBe('');
  });

  it('calls onSave with fallback name when input is empty', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() =>
      useSaveSetModal({ onSave, fallbackName: 'Set 3' })
    );

    act(() => {
      result.current.open();
      result.current.save();
    });

    expect(onSave).toHaveBeenCalledWith('Set 3');
  });

  it('closes modal without saving on cancel', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useSaveSetModal({ onSave }));

    act(() => {
      result.current.open();
      result.current.updateSetName('Test');
      result.current.cancel();
    });

    expect(onSave).not.toHaveBeenCalled();
    expect(result.current.isVisible).toBe(false);
    expect(result.current.setName).toBe('');
  });
});
