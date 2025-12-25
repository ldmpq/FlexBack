import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

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

        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },

        tabBarActiveTintColor: '#1ec8a5',
        tabBarInactiveTintColor: '#9ca3af',

        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          height: 70,
          borderRadius: 40,
          paddingHorizontal: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIconStyle: {
          marginTop: 15,
        },

        tabBarIcon: ({ color, focused }) => {
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
            <View style={[
              styles.iconWrapper,
              focused && styles.iconWrapperActive
            ]}>
              <MaterialCommunityIcons
                name={iconName}
                size={27}
                color={focused ? '#fff' : color}
              />
            </View>
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

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapperActive: {
    backgroundColor: '#1ec8a5',
    shadowColor: '#1ec8a5',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
});
