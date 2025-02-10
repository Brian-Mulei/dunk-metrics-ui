export const formatDate = (isoString) => {
    const date = new Date(isoString);
  
    // Format the date and time according to the user's locale
    
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    }).format(date);
  
    return formattedDate;
  };