import React, {useState, useEffect} from "react";

export const useEmailTimer = (
  canEmailBeSentDefault: boolean = true,
): [
  (interval?: number) => void,
  {canEmailBeSent: boolean; timeLeft: number | null},
] => {
  //  tempo che manca prima che si possa spedrire un'altra email
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  // se l'emial può essere spedita
  const [canEmailBeSent, setCanEmailBeSent] = useState(canEmailBeSentDefault);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null);
      setCanEmailBeSent(true);
    }
    if (!timeLeft) return;
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const startTimer = (interval: number = 30) => {
    setCanEmailBeSent(false);
    setTimeLeft(interval);
  };

  return [startTimer, {canEmailBeSent, timeLeft}];
};
