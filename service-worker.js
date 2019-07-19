console.log('Service worker loaded');
self.addEventListener('push', e => {
    const data = e.data.json();
   
    self.registration.showNotification(data.title, {
      body: data.body,
      actions: [
          {action: 'like', title: 'Like'},
          {action: 'reply', title: 'Reply'}
      ]
    });
   });