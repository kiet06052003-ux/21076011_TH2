import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { VARIANT } from '../constants/student';

export type ShopStackParamList = {
  HomeScreen: undefined;
  DetailScreen: { id: string };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{
          presentation: VARIANT.detailPresentation === 'modal' ? 'modal' : 'card',
        }}
      />
    </Stack.Navigator>
  );
}
