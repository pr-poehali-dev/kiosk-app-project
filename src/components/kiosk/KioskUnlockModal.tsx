import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function KioskUnlockModal({ isOpen, onClose, onUnlock }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const tryUnlock = () => {
    if (pin === '1234567890') { onUnlock(); onClose(); setPin(''); setError(''); }
    else { setError('Неверный служебный пароль'); setPin(''); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="kiosk-surface rounded-3xl elevation-4 p-8 max-w-sm w-full mx-4 animate-scale-in">
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-destructive/10 items-center justify-center mb-3">
            <Icon name="Unlock" size={32} className="text-destructive" />
          </div>
          <h2 className="font-bold text-foreground text-xl">Выход из киоск-режима</h2>
          <p className="text-muted-foreground text-sm mt-1">Введите служебный пароль</p>
        </div>

        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryUnlock()}
          placeholder="Служебный пароль"
          className="w-full text-center px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-xl tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-primary/40"
          autoFocus
        />

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4 animate-shake">
            <Icon name="AlertCircle" size={16} />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium text-sm ripple">
            Отмена
          </button>
          <button onClick={tryUnlock}
            className="flex-1 py-3 rounded-xl bg-destructive text-white font-semibold text-sm ripple elevation-1">
            Разблокировать
          </button>
        </div>
      </div>
    </div>
  );
}
