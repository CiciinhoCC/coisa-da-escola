import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogueScreen from './screens/CatalogueScreen';
import DetailsScreen from './screens/DetailsScreen';
import InsertScreen from './screens/InsertScreen';

const Stack = createNativeStackNavigator();

// Steam-flavored dark theme for React Navigation
const SteamTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#66c0f4',        // accent (back arrow, active tint)
    background: '#1b2838',     // screen background
    card: '#171a21',           // header background (Steam's darkest bar)
    text: '#c7d5e0',           // header title / label color
    border: '#000000',         // header bottom border
    notification: '#66c0f4',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        initialRouteName="Catálogo"
        screenOptions={{
          headerStyle: { backgroundColor: '#171a21' },
          headerTintColor: '#c7d5e0',
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,        // flat look, no hairline
          contentStyle: { backgroundColor: '#1b2838' }, // avoids white flash between screens
        }}
      >
        <Stack.Screen name="Catálogo" component={CatalogueScreen} />
        <Stack.Screen name="Detalhes" component={DetailsScreen} />
        <Stack.Screen name="Cadastrar" component={InsertScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}