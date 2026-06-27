import { useEffect, useState } from "react";

export default function Timer({ seconds, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(seconds || 0);

  useEffect(() => {
    setTimeLeft(seconds || 0);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <h3 style={{ color: timeLeft < 60 ? "red" : "black" }}>
      Time Left: {mins}:{secs.toString().padStart(2, "0")}
    </h3>
  );
}