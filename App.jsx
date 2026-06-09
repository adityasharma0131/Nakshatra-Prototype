import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/pages/Home/Home";
import Profile from "./src/pages/Profile/Profile";
import AIJyotish from "./src/pages/AiJyotish/Jyotish";
import Consultation from "./src/pages/Consultation/Consultation";
import JyotishProfile from "./src/pages/JyotishProfile/JyotishProfile";
import JyotishChat from "./src/pages/Consultation/JyotishChat";
import Shop from "./src/pages/Shop/Shop";
import ProductPage from "./src/pages/Shop/ProductPage";
import KundliGenerator from "./src/pages/Kundli/KundliGenerator";
import CommunityHub from "./src/pages/CommunityHub/CommunityHub";
import Panchang from "./src/pages/Panchang/Panchang";
import Calendar from "./src/pages/Panchang/Calendar";
import Yoga from "./src/pages/Yoga/Yoga";
import SpiritualLearning from "./src/pages/SpiritualLearning/SpiritualLearning";
import SpiritualTravel from "./src/pages/SpiritualTravel/SpiritualTravel";
import ScriptureLibrary from "./src/pages/ScriptureLibrary/ScriptureLibrary";
import AstrologyVideoLibrary from "./src/pages/ScriptureLibrary/Astrologyvideolibrary";

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
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AIJyotish" component={AIJyotish} />
        <Stack.Screen name="Consultation" component={Consultation} />
        <Stack.Screen name="JyotishProfile" component={JyotishProfile} />
        <Stack.Screen name="JyotishChat" component={JyotishChat} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen name="ProductPage" component={ProductPage} />
        <Stack.Screen name="KundliGenerator" component={KundliGenerator} />
        <Stack.Screen name="CommunityHub" component={CommunityHub} />
        <Stack.Screen name="Panchang" component={Panchang} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Yoga" component={Yoga} />
        <Stack.Screen name="SpiritualLearning" component={SpiritualLearning} />
        <Stack.Screen name="SpiritualTravel" component={SpiritualTravel} />
        <Stack.Screen name="ScriptureLibrary" component={ScriptureLibrary} />
        <Stack.Screen
          name="AstrologyVideoLibrary"
          component={AstrologyVideoLibrary}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
