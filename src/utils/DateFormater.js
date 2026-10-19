export const formatDate = (isoString) => {
  // ESPN publish times are UTC but arrive without an offset, which Date would read as local time
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(isoString);
  const date = new Date(hasZone ? isoString : `${isoString}Z`);

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }).format(date);
};
