"use client";
import { useState, useEffect } from "react";

interface Props {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculate(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function CountdownTimer({ targetDate }: Props) {
  const [time, setTime] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    setTime(calculate(targetDate));
    const id = setInterval(() => setTime(calculate(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <div className="countdown-pill">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-white/30 text-xs">·</span>}
          <div className="flex flex-col items-center min-w-[2.5rem]">
            <span className="text-xl font-light tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-white/50 mt-0.5">
              {u.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}