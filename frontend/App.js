import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/app/providers/AuthProvider';
import AppNavigator from './src/app/navigation/AppNavigator';

const isWeb = Platform.OS === 'web';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          {isWeb ? (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e5e5e5' }}>
              <View style={{ flex: 1, width: '100%', maxWidth: 430 }}>
                <AppNavigator />
              </View>
            </View>
          ) : (
            <AppNavigator />
          )}
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
