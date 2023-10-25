export const sendEvent = (eventData: { type: string, payload: any, timestamp: number }) => {
    fetch('/api/sendEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Событие успешно отправлено');
        } else {
          throw new Error('Ошибка при отправке события');
        }
      })
      .catch((error) => {
        console.error(error); // Вывести ошибку в консоль
      });
  };
  
  