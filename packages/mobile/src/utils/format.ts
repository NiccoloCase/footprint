/**
 * Restituisce il tempo passato dalla data passata
 */
export const timeSince = (dateParam: Date | number | string): string => {
  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);

  // Secondi
  const seconds = Math.round((new Date().getTime() - date.getTime()) / 1000);
  let i = seconds;

  if (i < 5) return "Ora";
  else if (i < 60) return `${i} secondi fa`;

  // Minuti
  i = Math.round(i / 60);

  if (i === 1) return "Un minuto fa";
  else if (i < 60) return `${i} minuti fa`;

  // Ore
  i = Math.floor(i / 60);

  if (i === 1) return `Un ora fa`;
  else if (i < 24) return `${i} ore fa`;

  // Giorni
  const days = Math.round(i / 24);
  i = days;

  if (i === 1) return `Un giorno fa`;
  else if (i < 7) return `${i} giorni fa`;

  // Settimane
  i = Math.round(i / 7);
  const months = Math.floor(seconds / 2592000);

  if (i === 1) return `Una settimana fa`;
  else if (months < 1) return `${i} settimane fa`;

  // Mesi
  i = months;
  const years = Math.floor(days / 360);

  if (i === 1) return `Un mese fa`;
  else if (years < 1) return `${i} mesi fa`;

  // Anni
  i = years;

  if (i === 1) return `Un anno fa`;
  else return `${i} anni fa`;
};
