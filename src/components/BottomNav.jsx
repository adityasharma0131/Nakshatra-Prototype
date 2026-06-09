/**
 * Nakshatra — BottomNav (Rich / Modern)
 *
 * Design language: Celestial luxury
 * - Gold active state with glow (purple for AI tab)
 * - Top-edge pill indicator per active tab
 * - Icon bg glow on active
 * - Spring-scale press animation via Animated API
 * - Frosted deep-space background with gold hairline top border + gradient sheen
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Config ───────────────────────────────────────────────────────────────────

const GOLD = "#F0C842";
const PURPLE = "#C084FC";
const INACTIVE = "rgba(255,255,255,0.28)";

const TABS = [
  {
    id: 0,
    label: "Home",
    screen: "Home",
    icon: "home-outline",
    iconActive: "home",
    accent: GOLD,
    glowColor: "rgba(212,160,23,0.14)",
  },
  {
    id: 1,
    label: "Kundli",
    screen: "KundliGenerator",
    icon: "moon-outline",
    iconActive: "moon",
    accent: GOLD,
    glowColor: "rgba(212,160,23,0.14)",
  },
  {
    id: 2,
    label: "AI Jyotish",
    screen: "AIJyotish",
    icon: "sparkles-outline",
    iconActive: "sparkles",
    accent: PURPLE,
    glowColor: "rgba(147,51,234,0.18)",
  },
  {
    id: 3,
    label: "Learn",
    screen: "SpiritualLearning",
    icon: "book-outline",
    iconActive: "book",
    accent: GOLD,
    glowColor: "rgba(212,160,23,0.14)",
  },
  {
    id: 4,
    label: "Profile",
    screen: "Profile",
    icon: "person-outline",
    iconActive: "person",
    accent: GOLD,
    glowColor: "rgba(212,160,23,0.14)",
  },
];
// ─── Tab Item ─────────────────────────────────────────────────────────────────

function TabItem({ tab, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pillWidth = useRef(new Animated.Value(isActive ? 32 : 20)).current;
  const pillOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const accent = tab.accent ?? GOLD;

  // Animate pill in/out when isActive changes
  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(pillWidth, {
        toValue: isActive ? 32 : 20,
        useNativeDriver: false,
        speed: 28,
        bounciness: 10,
      }),
      Animated.timing(pillOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.86,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 28,
      bounciness: 14,
    }).start();
  };

  return (
    <Pressable
      style={s.tab}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
    >
      {/* Animated top-edge pill indicator */}
      <Animated.View
        style={[
          s.pill,
          {
            width: pillWidth,
            opacity: pillOpacity,
            backgroundColor: accent,
          },
        ]}
      />

      <Animated.View style={[s.iconWrap, { transform: [{ scale }] }]}>
        {/* Icon bg glow */}
        {isActive && (
          <View
            style={[
              s.iconGlow,
              { backgroundColor: tab.glowColor ?? "rgba(212,160,23,0.14)" },
            ]}
          />
        )}

        <Ionicons
          name={isActive ? tab.iconActive : tab.icon}
          size={22}
          color={isActive ? accent : INACTIVE}
          style={
            isActive
              ? {
                  textShadowColor: accent,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }
              : undefined
          }
        />
      </Animated.View>

      <Text
        style={[
          s.label,
          isActive && { color: accent, fontWeight: "600", letterSpacing: 1 },
        ]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────

export default function BottomNav({ activeTab = 0, onTabChange, navigation }) {
  const [active, setActive] = useState(activeTab);
  const insets = useSafeAreaInsets();
  const handlePress = (tab) => {
    setActive(tab.id);

    if (navigation && tab.screen) {
      navigation.navigate(tab.screen);
    }

    onTabChange?.(tab.id);
  };

  return (
    <View
      style={[
        s.container,
        {
          paddingBottom: Math.max(
            insets.bottom,
            Platform.OS === "android" ? 8 : 16,
          ),
        },
      ]}
    >
      {TABS.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={active === tab.id}
          onPress={() => handlePress(tab)}
        />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(8,5,22,0.97)",
    paddingTop: 0,
    borderRadius: 25,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },

  sheen: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: 1,
    backgroundColor: "rgba(212,160,23,0.35)",
    opacity: 0.7,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
    overflow: "hidden",
  },

  pill: {
    height: 2.5,
    borderRadius: 2,
    marginBottom: 2,
  },

  iconWrap: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 11,
  },

  label: {
    fontSize: 9.5,
    color: INACTIVE,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontWeight: "400",
  },
});
