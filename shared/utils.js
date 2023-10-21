
function formatCurrency(number) {
    if (typeof number !== 'number') {
      throw new Error('El valor proporcionado no es un número.');
    }
  
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
 
  function formatDecimal(number) {
    if (typeof number !== 'number') {
      throw new Error('El valor proporcionado no es un número.');
    }
  
    return number.toFixed(2);
  }
  

  function formatM2(number) {
    if (typeof number !== 'number') {
      throw new Error('El valor proporcionado no es un número.');
    }
  
    return number.toFixed(2) + ' m²';
  }

  function formatDate(date) {
    if (!(date instanceof Date)) {
      throw new Error('El valor proporcionado no es una instancia de Date.');
    }
  
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
  