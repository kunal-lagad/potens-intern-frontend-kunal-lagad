import { useEffect, useRef, useState } from 'react';

export default function Flap({ value, className = '' }) {
  const [flip, setFlip] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlip(false);
      // restart animation on next frame
      const id = requestAnimationFrame(() => setFlip(true));
      return () => cancelAnimationFrame(id);
    }
  }, [value]);

  return (
    <span className={`flap ${className} ${flip ? 'flap-flip' : ''}`}>
      {value}
    </span>
  );
}
