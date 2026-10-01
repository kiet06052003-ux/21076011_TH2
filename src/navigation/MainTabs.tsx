import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '../screens/CartScreen';
import { MeScreen } from '../screens/MeScreen';
import { VARIANT } from '../constants/student';
import { COLORS } from '../constants/theme';
import { useCartStore } from '../stores/cartStore';

export type MainTabsParamList = {
  ShopTab: undefined;
  CartTab: undefined;
  MeTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabs() {
  const getTotalQuantity = useCartStore((state) => state.getTotalQuantity);
  const totalQty = getTotalQuantity();

  const shopTabScreen = (
    <Tab.Screen
      key="ShopTab"
      name="ShopTab"
      component={ShopStack}
      options={{
        title: 'Cửa hàng',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '🏪' : '🏬'}</Text>
        ),
      }}
    />
  );

  const cartTabScreen = (
    <Tab.Screen
      key="CartTab"
      name="CartTab"
      component={CartScreen}
      options={{
        title: 'Giỏ hàng',
        tabBarBadge: totalQty > 0 ? totalQty : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: 'bold',
        },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '🛒' : '🛍️'}</Text>
        ),
      }}
    />
  );

  const meTabScreen = (
    <Tab.Screen
      key="MeTab"
      name="MeTab"
      component={MeScreen}
      options={{
        title: 'Tôi',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👥'}</Text>
        ),
      }}
    />
  );

  const screensInOrder =
    VARIANT.tabOrder === 'cartFirst'
      ? [cartTabScreen, shopTabScreen, meTabScreen]
      : [shopTabScreen, cartTabScreen, meTabScreen];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      {screensInOrder}
    </Tab.Navigator>
  );
}
