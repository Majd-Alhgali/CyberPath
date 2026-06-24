import React, { useEffect, useState, useCallback } from 'react';
import { I18nManager, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { useProgressStore } from './src/store/useProgressStore';

// ---------------------------------------------------------------------------
// تفعيل اتجاه RTL على مستوى التطبيق كامل.
// ملاحظة: في Expo Go، التغيير الكامل لـ I18nManager قد يحتاج إعادة تشغيل
// التطبيق مرة واحدة بعد أول تثبيت (سلوك طبيعي في React Native).
// ---------------------------------------------------------------------------
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const hydrate = useProgressStore((state) => state.hydrate);

  useEffect(() => {
    async function prepare() {
      try {
        // تحميل الخطوط (يمكن إضافة خطوط عربية مخصصة هنا لاحقاً، مثل Cairo أو Tajawal)
        await Font.loadAsync({
          // 'Cairo-Regular': require('./assets/fonts/Cairo-Regular.ttf'),
          // 'Cairo-Bold': require('./assets/fonts/Cairo-Bold.ttf'),
        });

        // استعادة بيانات التقدم المحفوظة (XP, المستوى, الوحدات المفتوحة...)
        await hydrate();
      } catch (e) {
        console.warn('App preparation error:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [hydrate]);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
