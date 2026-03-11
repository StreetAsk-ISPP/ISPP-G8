import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on both web and native.
 * On web, falls back to window.alert().
 */
export function crossAlert(title, message) {
    if (Platform.OS === 'web') {
        window.alert(message ? `${title}\n\n${message}` : title);
    } else {
        Alert.alert(title, message);
    }
}
