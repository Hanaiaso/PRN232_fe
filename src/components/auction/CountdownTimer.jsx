import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        totalSeconds: Math.floor(difference / 1000)
      };
    } else {
      timeLeft = { totalSeconds: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.totalSeconds <= 0) {
        clearInterval(timer);
        if (onEnd) onEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const isUrgent = timeLeft.totalSeconds > 0 && timeLeft.totalSeconds <= 10;
  const isEnded = timeLeft.totalSeconds <= 0;

  if (isEnded) {
    return <span className="countdown-ended">Ended</span>;
  }

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className={`countdown-timer ${isUrgent ? 'urgent' : ''}`}>
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      <span>{formatNumber(timeLeft.hours)}:</span>
      <span>{formatNumber(timeLeft.minutes)}:</span>
      <span>{formatNumber(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
