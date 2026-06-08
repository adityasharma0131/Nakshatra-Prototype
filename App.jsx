import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/pages/Home/Home";
import AIJyotish from "./src/pages/AiJyotish/Jyotish";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AIJyotish" component={AIJyotish} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
