import Toast from 'react-native-toast-message';

/**
 * Display a cross-platform alert using Toast notifications
 * @param {string} title - The title/heading of the alert
 * @param {string} message - The message content
 * @param {string} type - Optional: 'success', 'error', 'info' (default: 'info')
 */
export function crossAlert(title, message, type = 'info') {
  // Determine type based on title if not explicitly provided
  let alertType = type;
  if (type === 'info') {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('success') || lowerTitle.includes('created') || lowerTitle.includes('updated')) {
      alertType = 'success';
    } else if (lowerTitle.includes('error') || lowerTitle.includes('failed') || lowerTitle.includes('invalid')) {
      alertType = 'error';
    } else if (lowerTitle.includes('warning')) {
      alertType = 'error'; // Use error style for warnings
    }
  }

  Toast.show({
    type: alertType,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
  });
}
