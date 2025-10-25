import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RoomDashboardScreen from './screens/RoomDashboardScreen';
import AutomationScreen from './screens/AutomationScreen';
import RoomsScreen from './screens/RoomsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Automation" component={AutomationScreen} />
        <Stack.Screen name="Rooms" component={RoomsScreen} />
        <Stack.Screen name="Dashboard" component={RoomDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
