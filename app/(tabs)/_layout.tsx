import { Tabs } from "expo-router";
import React from "react";
import HomeScreen from "./index";
import { createStackNavigator } from "@react-navigation/stack";

export default function TabLayout() {
  const Stack = createStackNavigator();
  return <HomeScreen />;
}
