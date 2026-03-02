class NotificationCenter {
  constructor() {
    this.observers = new Set();
  }

  subscribe(observer) {
    if (typeof observer !== 'function') {
      return () => {};
    }
    this.observers.add(observer);
    return () => {
      this.observers.delete(observer);
    };
  }

  publish(notification) {
    this.observers.forEach((observer) => {
      try {
        observer(notification);
      } catch (error) {
        console.warn('Notification observer failed:', error);
      }
    });
  }
}

export const notificationCenter = new NotificationCenter();
