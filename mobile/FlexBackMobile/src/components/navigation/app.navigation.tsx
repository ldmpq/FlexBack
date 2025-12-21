import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeTab from '../tabs/HomeTab';
import ProgramTab from '../tabs/ProgramTab';
import ResultTab from '../tabs/ResultTab';
import MeTab from '../tabs/MeTab';
import GuideTab from '../tabs/GuideTab';

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
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Program':
              iconName = 'progress-clock';
              break;
            case 'Guide':
              iconName = 'book-open-page-variant';
              break;
            case 'Result':
              iconName = 'chart-line';
              break;
            case 'Me':
              iconName = 'account-outline';
              break;
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
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
