import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import '../global.css';
import { AuthProvider } from '../lib/auth';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'pages/login',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="pages/login" options={{ headerShown: false }} />
        <Stack.Screen name="pages/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/DeliveryManagement" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/MyEarnings" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/MyRoutes" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/ChatList" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/ChatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/Notifications" options={{ headerShown: false }} />
        <Stack.Screen name="pages/driver/Profile" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
