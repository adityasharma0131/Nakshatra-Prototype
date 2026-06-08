import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/pages/Home/Home";
import AIJyotish from "./src/pages/AiJyotish/Jyotish";
import Consultation from "./src/pages/Consultation/Consultation";
import JyotishProfile from "./src/pages/JyotishProfile/JyotishProfile";
import JyotishChat from "./src/pages/Consultation/JyotishChat";
import Shop from "./src/pages/Shop/Shop";
import ProductPage from "./src/pages/Shop/ProductPage";

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
        <Stack.Screen name="Consultation" component={Consultation} />
        <Stack.Screen name="JyotishProfile" component={JyotishProfile} />
        <Stack.Screen name="JyotishChat" component={JyotishChat} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="ProductPage" component={ProductPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
