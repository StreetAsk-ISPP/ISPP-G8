import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/app/providers/AuthProvider';
import AppNavigator from './src/app/navigation/AppNavigator';
import { WebSocketProvider } from './src/app/providers/WebSocketProvider';
import { NotificationProvider } from './src/app/providers/NotificationProvider';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const isWeb = Platform.OS === 'web';

// Configuración personalizada para mover las alertas a la derecha
const toastConfig = {
  // 1. Diseño para alertas de éxito
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#47d22b',
        borderLeftWidth: 8,
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 80,
        width: '90%',           // <-- Ocupa hasta el 90% de la pantalla en móviles
        maxWidth: 400,          // <-- Pero no se hace más grande que 400px en web
        height: 'auto',
        minHeight: 80,
        paddingVertical: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{ fontSize: 18, fontWeight: '700' }}
      text2Style={{ fontSize: 15, color: '#4b5563' }}
      text2NumberOfLines={0}
    />
  ),

  // 2. Diseño para alertas de error
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#a52019',
        borderLeftWidth: 8,
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        width: '90%',
        maxWidth: 400,
        height: 'auto',
        minHeight: 80,
        paddingVertical: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{ fontSize: 18, fontWeight: '700' }}
      text2Style={{ fontSize: 15, color: '#4b5563' }}
      text2NumberOfLines={0}
    />
  ),

  // 3. Diseño para alertas de información
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#764ba2',
        borderLeftWidth: 8,
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        width: '90%',
        maxWidth: 400,
        height: 'auto',
        minHeight: 80,
        paddingVertical: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{ fontSize: 18, fontWeight: '700' }}
      text2Style={{ fontSize: 15, color: '#4b5563' }}
      text2NumberOfLines={0}
    />
  )
};

export default function App() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.setAttribute('data-password-reveal-fix', 'true');
    style.textContent = `
      input[type="password"]::-ms-reveal,
      input[type="password"]::-ms-clear {
        display: none !important;
        visibility: hidden !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const webContainerStyle = {
    flex: 1,
    width: '100%',
    backgroundColor: '#e5e5e5',
  };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <WebSocketProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              {isWeb ? (
                <View style={webContainerStyle}>
                  <AppNavigator />
                </View>
              ) : (
                <AppNavigator />
              )}
            </NavigationContainer>
            <Toast config={toastConfig} position="top" />
          </NotificationProvider>
        </WebSocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
