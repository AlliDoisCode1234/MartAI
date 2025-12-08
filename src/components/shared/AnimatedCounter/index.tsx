'use client';

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

/**
 * Animated counter that counts up from 0 to the target value.
 * Reusable for any numeric animation needs.
 */
export function AnimatedCounter({ value, duration = 1.5 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    let start = 0;
    const end = value;
    const totalMs = duration * 1000;
    const incrementTime = Math.max(totalMs / end, 10); // Min 10ms per increment

    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{displayValue}</>;
}
