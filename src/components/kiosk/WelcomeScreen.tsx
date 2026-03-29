import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Driver } from '@/types/kiosk';

interface Props {
  driver: Driver;
  onStart: () => void;
}

export default function WelcomeScreen({ driver, onStart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const vehicleIcon = driver.vehicleType === 'tram' ? 'Tram' : 'Bus';
  const vehicleLabel = driver.vehicleType === 'tram' ? 'Трамвай' : 'Троллейбус';
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex h-full w-full items-center justify-center kiosk-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-success/8 blur-3xl" />
      </div>

      <div className={`relative z-10 w-full max-w-lg mx-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Time */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-foreground tabular-nums">{timeStr}</div>
          <div className="text-muted-foreground capitalize mt-1">{dateStr}</div>
        </div>

        {/* Welcome card */}
        <div className="kiosk-surface rounded-3xl elevation-4 p-8 text-center">
          {/* Success icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/15 mb-4 animate-scale-bounce">
            <div className="w-16 h-16 rounded-full bg-success/25 flex items-center justify-center">
              <Icon name="CheckCircle2" size={40} className="text-success" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-1">Добро пожаловать!</h1>
          <p className="text-muted-foreground mb-6">Наряд успешно подтверждён</p>

          {/* Driver info */}
          <div className="bg-muted rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Водитель</div>
                <div className="font-semibold text-foreground">{driver.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Icon name="Route" size={20} className="text-accent-foreground" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Маршрут</div>
                <div className="font-semibold text-foreground text-lg">№{driver.routeNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                <Icon name={vehicleIcon} size={20} className="text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{vehicleLabel}</div>
                <div className="font-semibold text-foreground">{driver.vehicleNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Начало смены</div>
                <div className="font-semibold text-foreground">{driver.shiftStart}</div>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center gap-3 elevation-3 transition-all active:scale-[0.98] ripple"
          >
            <Icon name="PlayCircle" size={28} />
            Поехали!
          </button>
        </div>
      </div>
    </div>
  );
}