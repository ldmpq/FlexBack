import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import HomeTab from '../tabs/HomeTab';
import ProgramTab from '../tabs/ProgramTab';
import GuideTab from '../tabs/GuideTab';
import ResultTab from '../tabs/ResultTab';
import MeTab from '../tabs/MeTab';

const Tab = createBottomTabNavigator();

export const AppNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6f8f38',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Program') {
            iconName = 'list';
          } else if (route.name === 'Guide') {
            iconName = 'book-open';
          } else if (route.name === 'Result') {
            iconName = 'bar-chart-2';
          } else if (route.name === 'Me') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} options={{ tabBarLabel: 'Trang chủ' }} />
      <Tab.Screen name="Program" component={ProgramTab} options={{ tabBarLabel: 'Lộ trình' }} />
      <Tab.Screen name="Guide" component={GuideTab} options={{ tabBarLabel: 'Cẩm nang' }} />
      <Tab.Screen name="Result" component={ResultTab} options={{ tabBarLabel: 'Kết quả' }} />
      <Tab.Screen name="Me" component={MeTab} options={{ tabBarLabel: 'Tôi' }} />
    </Tab.Navigator>
  );
};