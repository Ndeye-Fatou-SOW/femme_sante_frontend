 import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Text } from 'react-native';
import { loadUser } from '../store/slices/authSlice';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CycleScreen from '../screens/CycleScreen';
import LogScreen from '../screens/LogScreen';
import MedicalScreen from '../screens/MedicalScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerShown: true,   // ← booléen, PAS "true"
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Mon Cycle"
        component={CycleScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>🌸</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={LogScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>📓</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Médical"
        component={MedicalScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>🏥</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}