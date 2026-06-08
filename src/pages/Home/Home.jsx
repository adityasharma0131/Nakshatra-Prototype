/**
 * Nakshatra — HomeScreen v5 · Rich Modern Redesign
 *
 * Design language: "Dark Celestial Luxury"
 *  - Deep midnight navy base with warm gold accents
 *  - Glassmorphism cards with subtle frosted borders
 *  - Rich gradients, layered depth, premium spacing
 *  - Cormorant Garamond serif for headlines (celestial, editorial)
 *  - React-native vector icons throughout
 *
 * Install:
 *   npx expo install expo-linear-gradient
 *   npx expo install @expo-google-fonts/cormorant-garamond expo-font
 *   npx expo install react-native-safe-area-context
 *   @expo/vector-icons — bundled in Expo SDK
 */

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import NakshatraLogoImg from "../../../assets/ChatGPT Image Jun 7, 2026, 01_36_49 AM-Photoroom.png";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../../components/BottomNav";

const AVATAR_URL = "https://randomuser.me/api/portraits/men/1.jpg";
const { width } = Dimensions.get("window");

// ─── Design Tokens ──────────────────────────────────────────────────────────────
const C = {
  // Base — deep midnight
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",

  // Gold family
  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.12)",
  goldBorder: "rgba(212,160,23,0.25)",
  goldGlow: "rgba(212,160,23,0.20)",

  // Violet/moon family
  moon: "#7B7FE8",
  moonLight: "#A5A8F8",
  moonDark: "#3A3DA8",
  moonPale: "rgba(123,127,232,0.12)",
  moonBorder: "rgba(123,127,232,0.25)",

  // Text
  ink: "#F2EED8",
  inkMid: "#B8B0D8",
  inkMuted: "#6E6898",

  // Status
  green: "#34D077",
  greenPale: "rgba(52,208,119,0.12)",

  // Borders & shadows
  border: "rgba(255,255,255,0.07)",
  borderGold: "rgba(212,160,23,0.30)",
  shadow: "rgba(0,0,0,0.50)",
  shadowGold: "rgba(212,160,23,0.25)",
  shadowMoon: "rgba(123,127,232,0.30)",

  // Divider
  divider: "rgba(255,255,255,0.06)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── Data ───────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 1,
    iconLib: "MaterialCommunityIcons",
    iconName: "star-four-points",
    label: "AI Jyotish",
    navigation: "AIJyotish",
    sub: "Vedic AI",
    accent: C.gold,
    bg: C.goldPale,
  },
  {
    id: 2,
    iconLib: "Ionicons",
    iconName: "chatbubble-ellipses",
    label: "Chat & Call",
    navigation: "Consultation",
    sub: "Live",
    accent: C.moon,
    bg: C.moonPale,
  },
  {
    id: 3,
    iconLib: "MaterialCommunityIcons",
    iconName: "chart-donut",
    label: "Kundli",
    navigation: "Kundli",
    sub: "Birth Chart",
    accent: C.gold,
    bg: C.goldPale,
  },
  {
    id: 4,
    iconLib: "Ionicons",
    iconName: "calendar",
    label: "Panchang",
    navigation: "Panchang",
    sub: "Almanac",
    accent: C.moon,
    bg: C.moonPale,
  },
  {
    id: 5,
    iconLib: "MaterialCommunityIcons",
    iconName: "yoga",
    label: "Yoga",
    sub: "Spiritual",
    accent: C.gold,
    bg: C.goldPale,
  },
  {
    id: 6,
    iconLib: "Ionicons",
    iconName: "book",
    label: "Learn",
    sub: "Courses",
    accent: C.moon,
    bg: C.moonPale,
  },
  {
    id: 7,
    iconLib: "MaterialCommunityIcons",
    iconName: "script-text-outline",
    label: "Scriptures",
    sub: "Books",
    accent: C.gold,
    bg: C.goldPale,
  },
  {
    id: 8,
    iconLib: "Ionicons",
    iconName: "people",
    label: "Community",
    sub: "Social",
    accent: C.moon,
    bg: C.moonPale,
  },
  {
    id: 9,
    iconLib: "Ionicons",
    iconName: "airplane",
    label: "Travel",
    sub: "Sacred",
    accent: C.gold,
    bg: C.goldPale,
  },
  {
    id: 10,
    iconLib: "Ionicons",
    iconName: "storefront",
    label: "Shop",
    sub: "Store",
    accent: C.moon,
    bg: C.moonPale,
  },
];

const ASTROLOGERS = [
  {
    name: "Pandit Ramesh",
    title: "Vedic · Nadi Shastra",
    rating: "4.9",
    sessions: "2.1k",
    online: true,
    exp: "18 yrs",
    fee: "₹20/min",
  },
  {
    name: "Jyoti Devi",
    title: "Tarot · KP System",
    rating: "4.8",
    sessions: "1.4k",
    online: true,
    exp: "12 yrs",
    fee: "₹15/min",
  },
  {
    name: "Acharya Dev",
    title: "Numerology · Vaastu",
    rating: "4.7",
    sessions: "980",
    online: false,
    exp: "9 yrs",
    fee: "₹12/min",
  },
];

const PANCHANG = [
  { label: "Tithi", val: "Purnima", icon: "sunny" },
  { label: "Nakshatra", val: "Rohini", icon: "star" },
  { label: "Yoga", val: "Siddha", icon: "flash" },
  { label: "Karana", val: "Vishti", icon: "moon" },
];

const BANNERS = [
  {
    tag: "✦ New Feature",
    title: "AI Kundli\nAnalysis",
    sub: "Personalized Vedic reading in seconds",
    cta: "Try Free",
    navigation: "AIJyotish",
    colors: ["#1A1060", "#3A30C0", "#6B5FE8"],
  },
  {
    tag: "☽ Daily Insight",
    title: "Today's\nNakshatra",
    sub: "Rohini — Favourable for new beginnings",
    cta: "Read More",
    navigation: "Panchang",
    colors: ["#2A1400", "#7A4500", "#C47A10"],
  },
];

const REMEDIES = [
  {
    glyph: "🪔",
    title: "Dhan Yoga Puja",
    desc: "Remove financial blocks",
    tag: "Popular",
    tagColor: C.gold,
  },
  {
    glyph: "🧿",
    title: "Nazar Dosh Nivaran",
    desc: "Protection from evil eye",
    tag: "Trending",
    tagColor: C.moon,
  },
  {
    glyph: "🌸",
    title: "Mangal Dosha Shanti",
    desc: "Harmony in relationships",
    tag: "New",
    tagColor: C.green,
  },
  {
    glyph: "☀️",
    title: "Surya Graha Shanti",
    desc: "Boost career & confidence",
    tag: "Classic",
    tagColor: C.inkMid,
  },
];

const COURSES = [
  {
    title: "Vedic Astrology 101",
    lessons: "24 lessons",
    level: "Beginner",
    accent: C.gold,
    iconName: "telescope-outline",
    iconLib: "Ionicons",
  },
  {
    title: "Nakshatra Deep Dive",
    lessons: "18 lessons",
    level: "Intermediate",
    accent: C.moon,
    iconName: "moon-outline",
    iconLib: "Ionicons",
  },
  {
    title: "Predictive Techniques",
    lessons: "32 lessons",
    level: "Advanced",
    accent: C.green,
    iconName: "analytics-outline",
    iconLib: "Ionicons",
  },
];

const SACRED_PLACES = [
  {
    name: "Varanasi",
    desc: "City of Light",
    glyph: "🕉️",
    colors: ["#1A0A2E", "#3B1F6A"],
  },
  {
    name: "Tirupati",
    desc: "Hill Shrine",
    glyph: "⛰️",
    colors: ["#0A1F2E", "#1B4A6A"],
  },
  {
    name: "Vrindavan",
    desc: "Krishna's Land",
    glyph: "🌿",
    colors: ["#0A2E1A", "#1B6A3A"],
  },
  {
    name: "Rameswaram",
    desc: "Sacred Island",
    glyph: "🌊",
    colors: ["#0A1A2E", "#1B3A6A"],
  },
];

const MUHURTAS = [
  {
    event: "Marriage",
    date: "14 Jun",
    day: "Sat",
    quality: "Excellent",
    color: C.green,
  },
  {
    event: "New Business",
    date: "17 Jun",
    day: "Tue",
    quality: "Good",
    color: C.gold,
  },
  {
    event: "Travel",
    date: "20 Jun",
    day: "Fri",
    quality: "Auspicious",
    color: C.moon,
  },
  {
    event: "Griha Pravesh",
    date: "22 Jun",
    day: "Sun",
    quality: "Excellent",
    color: C.green,
  },
];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

// ─── Shared: Press scale animation ──────────────────────────────────────────────
function PressScale({ children, style, onPress, scaleVal = 0.96 }) {
  const sc = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[style, { transform: [{ scale: sc }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(sc, {
            toValue: scaleVal,
            useNativeDriver: true,
            speed: 50,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(sc, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
          }).start()
        }
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Icon helper ────────────────────────────────────────────────────────────────
function Icon({ lib, name, size, color }) {
  if (lib === "MaterialCommunityIcons")
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Logo ───────────────────────────────────────────────────────────────────────
function NakshatraLogo({ fontsLoaded }) {
  return (
    <View style={logo.wrap}>
      <LinearGradient
        colors={[C.goldMid, C.gold, C.goldDark]}
        style={logo.mark}
      >
        <MaterialCommunityIcons
          name="star-four-points"
          size={14}
          color="#FFF"
        />
      </LinearGradient>
      <View>
        <Text style={[logo.name, fontsLoaded && { fontFamily: SERIF.bold }]}>
          NAKSHATRA
        </Text>
        <Text
          style={[logo.tagline, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          Vedic · AI · Astrology
        </Text>
      </View>
    </View>
  );
}
const logo = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  name: { fontSize: 14, color: C.ink, letterSpacing: 3 },
  tagline: { fontSize: 9, color: C.inkMuted, letterSpacing: 1.5, marginTop: 1 },
});

// ─── Top Nav ────────────────────────────────────────────────────────────────────

function TopNav({ fontsLoaded }) {
  return (
    <View style={s.topNav}>
      <View style={s.navLeft}>
        {/* Logo image replaces NakshatraLogo component */}
        <Image
          source={NakshatraLogoImg}
          style={s.logoImg}
          resizeMode="contain"
        />

        <View style={s.navDivider} />

        <View>
          <Text
            style={[s.navGreet, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Namaste 🙏
          </Text>
          <Text style={[s.navUser, fontsLoaded && { fontFamily: SERIF.bold }]}>
            Arjun Sharma
          </Text>
        </View>
      </View>

      <View style={s.navRight}>
        <TouchableOpacity style={s.navBell} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={18} color={C.inkMid} />
          <View style={s.notifDot} />
        </TouchableOpacity>

        {/* Avatar — random profile photo with gradient fallback */}
        <TouchableOpacity activeOpacity={0.85} style={s.navAvatar}>
          <Image source={{ uri: AVATAR_URL }} style={s.avatarImg} />
          {/* Subtle gold ring */}
          <View style={s.avatarRing} pointerEvents="none" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Banner Carousel ────────────────────────────────────────────────────────────

function BannerCarousel({ fontsLoaded, navigation }) {
  const [active, setActive] = useState(0);

  const handleBannerPress = (screen) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={s.carouselWrap}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setActive(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))
        }
      >
        {BANNERS.map((b, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.9}
            onPress={() => handleBannerPress(b.navigation)}
          >
            <LinearGradient
              colors={b.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.bannerCard}
            >
              {/* Decorative orbs */}
              <View
                style={[
                  s.bannerOrb,
                  {
                    width: 180,
                    height: 180,
                    top: -60,
                    right: -50,
                    opacity: 0.15,
                  },
                ]}
              />

              <View
                style={[
                  s.bannerOrb,
                  {
                    width: 100,
                    height: 100,
                    bottom: -30,
                    right: 90,
                    opacity: 0.08,
                  },
                ]}
              />

              <View
                style={[
                  s.bannerOrb,
                  {
                    width: 60,
                    height: 60,
                    top: 30,
                    left: 30,
                    opacity: 0.1,
                  },
                ]}
              />

              {/* Gold shimmer line */}
              <LinearGradient
                colors={["transparent", "rgba(212,160,23,0.35)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.bannerShimmer}
              />

              <View style={s.bannerInner}>
                <View style={s.bannerTagWrap}>
                  <Text
                    style={[
                      s.bannerTag,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {b.tag}
                  </Text>
                </View>

                <Text
                  style={[
                    s.bannerTitle,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {b.title}
                </Text>

                <Text
                  style={[
                    s.bannerSub,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {b.sub}
                </Text>

                <TouchableOpacity
                  style={s.bannerCta}
                  activeOpacity={0.85}
                  onPress={() => handleBannerPress(b.navigation)}
                >
                  <Text
                    style={[
                      s.bannerCtaTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {b.cta}
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={13}
                    color="#FFF"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[s.dot, active === i && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}
// ─── Panchang Bar ───────────────────────────────────────────────────────────────
function PanchangBar({ fontsLoaded }) {
  return (
    <View style={s.panchangWrap}>
      <View style={s.panchangHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="moon" size={13} color={C.gold} />
          <Text
            style={[
              s.panchangHeadLabel,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Today's Panchang
          </Text>
        </View>
        <Text
          style={[s.panchangDate, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          Mon, 9 Jun
        </Text>
      </View>
      <View style={s.panchangInner}>
        {PANCHANG.map((p, i) => (
          <View
            key={i}
            style={[s.panchangItem, i < PANCHANG.length - 1 && s.panchangSep]}
          >
            <Ionicons
              name={p.icon}
              size={14}
              color={C.gold}
              style={{ marginBottom: 5 }}
            />
            <Text
              style={[
                s.panchangLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {p.label}
            </Text>
            <Text
              style={[s.panchangVal, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {p.val}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── AI Insight Strip ───────────────────────────────────────────────────────────
function AIInsightStrip({ fontsLoaded }) {
  return (
    <View style={s.aiWrap}>
      <LinearGradient
        colors={["#1C1850", "#110F30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.aiStrip}
      >
        {/* Glow accent */}
        <View style={s.aiGlowDot} />
        <LinearGradient
          colors={[C.moonLight, C.moon, C.moonDark]}
          style={s.aiIcon}
        >
          <MaterialCommunityIcons name="crystal-ball" size={18} color="#FFF" />
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text
            style={[s.aiLabel, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            Your AI Reading Today
          </Text>
          <Text style={[s.aiSub, fontsLoaded && { fontFamily: SERIF.regular }]}>
            Moon in Rohini — creative energy. Ideal for new connections.
          </Text>
        </View>
        <TouchableOpacity style={s.aiBtn} activeOpacity={0.85}>
          <Text style={[s.aiBtnTxt, fontsLoaded && { fontFamily: SERIF.bold }]}>
            Read
          </Text>
          <Ionicons name="chevron-forward" size={12} color={C.moonLight} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────────
function SecHeader({ title, sub, onAll, fontsLoaded }) {
  return (
    <View style={s.secHeader}>
      <View>
        <Text style={[s.secTitle, fontsLoaded && { fontFamily: SERIF.bold }]}>
          {title}
        </Text>
        {sub && (
          <Text
            style={[s.secSub, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {sub}
          </Text>
        )}
      </View>
      {onAll && (
        <TouchableOpacity onPress={onAll} style={s.seeAllBtn}>
          <Text
            style={[s.seeAll, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            See all
          </Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color={C.moon}
            style={{ marginLeft: 3 }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Feature Grid ───────────────────────────────────────────────────────────────

function FeatCard({ item, fontsLoaded, cardWidth }) {
  const navigation = useNavigation();
  const sc = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (item.navigation) {
      navigation.navigate(item.navigation);
    }
  };

  return (
    <Animated.View
      style={{
        width: cardWidth,
        alignItems: "center",
        paddingVertical: 10,
        transform: [{ scale: sc }],
      }}
    >
      <TouchableOpacity
        style={{ alignItems: "center", width: "100%" }}
        activeOpacity={1}
        onPress={handlePress}
        onPressIn={() =>
          Animated.spring(sc, {
            toValue: 0.9,
            useNativeDriver: true,
            speed: 50,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(sc, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
          }).start()
        }
      >
        <View
          style={[
            s.featIconWrap,
            {
              backgroundColor: item.bg,
              borderColor: item.accent + "35",
            },
          ]}
        >
          <Icon
            lib={item.iconLib}
            name={item.iconName}
            size={20}
            color={item.accent}
          />
        </View>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[s.featLabel, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          {item.label}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[s.featSub, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {item.sub}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
// ─── Rashi Strip ────────────────────────────────────────────────────────────────
function RashiStrip({ fontsLoaded }) {
  const [activeRashi, setActiveRashi] = useState(4);
  const rashis = [
    "♈ Mesh",
    "♉ Vrishabh",
    "♊ Mithun",
    "♋ Kark",
    "♌ Simha",
    "♍ Kanya",
    "♎ Tula",
    "♏ Vrishchik",
    "♐ Dhanu",
    "♑ Makar",
    "♒ Kumbh",
    "♓ Meen",
  ];
  return (
    <View>
      <SecHeader
        title="Daily Rashi"
        sub="Your zodiac forecast"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.rashiScroll}
      >
        {rashis.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={[s.rashiChip, i === activeRashi && s.rashiChipActive]}
            activeOpacity={0.8}
            onPress={() => setActiveRashi(i)}
          >
            {i === activeRashi && (
              <LinearGradient
                colors={[C.moonLight, C.moon]}
                style={StyleSheet.absoluteFill}
                borderRadius={20}
              />
            )}
            <Text
              style={[
                s.rashiTxt,
                fontsLoaded && {
                  fontFamily:
                    i === activeRashi ? SERIF.semiBold : SERIF.regular,
                },
                i === activeRashi && { color: "#FFF" },
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Promo Banner ───────────────────────────────────────────────────────────────
function PromoBanner({ fontsLoaded }) {
  return (
    <View style={s.promoWrap}>
      <LinearGradient
        colors={["#100E2A", "#1E1A50", "#120E30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.promoBanner}
      >
        {/* Animated shimmer border */}
        <View style={s.promoBorderGold} />
        <View
          style={[
            s.promoOrb,
            { width: 220, height: 220, top: -90, right: -70, opacity: 0.06 },
          ]}
        />
        <View
          style={[
            s.promoOrb,
            { width: 90, height: 90, bottom: -25, left: 50, opacity: 0.05 },
          ]}
        />
        <View style={{ flex: 1, zIndex: 1 }}>
          <View style={s.promoTagWrap}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={10}
              color={C.goldMid}
            />
            <Text
              style={[
                s.promoTag,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {" "}
              Limited Offer
            </Text>
          </View>
          <Text style={[s.promoH, fontsLoaded && { fontFamily: SERIF.bold }]}>
            First Kundli{"\n"}
            <Text style={{ color: C.goldLight }}>Free </Text>
            <Text style={{ color: "rgba(242,238,216,0.85)" }}>
              for new users
            </Text>
          </Text>
          <Text
            style={[s.promoSub, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Unlock your complete birth chart powered by AI
          </Text>
          <TouchableOpacity style={s.promoBtn} activeOpacity={0.88}>
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.promoBtnGrad}
            >
              <Text
                style={[
                  s.promoBtnTxt,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                Claim Now
              </Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color="#0D0B1A"
                style={{ marginLeft: 6 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={s.promoMoon}>☽</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Astrologer Card ────────────────────────────────────────────────────────────
function AstroCard({ a, fontsLoaded }) {
  const sc = useRef(new Animated.Value(1)).current;
  const avatarColors = a.online
    ? [C.moonLight, C.moon, C.moonDark]
    : ["#4A4670", "#2E2C50"];
  return (
    <Animated.View style={[s.astroCard, { transform: [{ scale: sc }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        style={s.astroCardInner}
        onPressIn={() =>
          Animated.spring(sc, {
            toValue: 0.975,
            useNativeDriver: true,
            speed: 50,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(sc, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
          }).start()
        }
      >
        {/* Left avatar */}
        <View style={s.astroAvatarWrap}>
          <LinearGradient colors={avatarColors} style={s.astroAvatar}>
            <Text
              style={[
                s.astroInitials,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {initials(a.name)}
            </Text>
          </LinearGradient>
          {a.online && <View style={s.onlineDot} />}
        </View>
        {/* Mid info */}
        <View style={s.astroMid}>
          <Text
            style={[s.astroName, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            {a.name}
          </Text>
          <Text
            style={[s.astroTitle, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {a.title}
          </Text>
          <View style={s.astroRow}>
            <Ionicons name="star" size={11} color={C.gold} />
            <Text
              style={[
                s.astroRating,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {" "}
              {a.rating}
            </Text>
            <Text style={s.astroDot}>·</Text>
            <Text
              style={[
                s.astroMeta,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {a.sessions} sessions
            </Text>
            <Text style={s.astroDot}>·</Text>
            <Text
              style={[
                s.astroMeta,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {a.exp}
            </Text>
          </View>
          <View style={s.astroFeeRow}>
            <View
              style={[
                s.onlineBadge,
                a.online
                  ? {
                      backgroundColor: C.greenPale,
                      borderColor: "rgba(52,208,119,0.35)",
                    }
                  : {
                      backgroundColor: "rgba(110,104,152,0.15)",
                      borderColor: "rgba(110,104,152,0.25)",
                    },
              ]}
            >
              <View
                style={[
                  s.onlineBadgeDot,
                  { backgroundColor: a.online ? C.green : C.inkMuted },
                ]}
              />
              <Text
                style={[
                  s.onlineBadgeTxt,
                  { color: a.online ? C.green : C.inkMuted },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {a.online ? "Online" : "Offline"}
              </Text>
            </View>
            <Text
              style={[
                s.astroFee,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {a.fee}
            </Text>
          </View>
        </View>
        {/* CTA */}
        <LinearGradient
          colors={[C.goldLight, C.goldMid, C.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={s.consultBtn}
        >
          <Text
            style={[s.consultTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Consult
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Muhurta Section ────────────────────────────────────────────────────────────
function MuhurtaSection({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Auspicious Muhurtas"
        sub="Upcoming favourable dates"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.muhurtaScroll}
      >
        {MUHURTAS.map((m, i) => (
          <View key={i} style={s.muhurtaCard}>
            <LinearGradient
              colors={[m.color + "30", m.color + "08"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              borderRadius={18}
            />
            <View style={[s.muhurtaAccent, { backgroundColor: m.color }]} />
            <Text
              style={[
                s.muhurtaEvent,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {m.event}
            </Text>
            <Text
              style={[
                s.muhurtaDate,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {m.date}
            </Text>
            <Text
              style={[
                s.muhurtaDay,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {m.day}
            </Text>
            <View
              style={[
                s.muhurtaBadge,
                {
                  backgroundColor: m.color + "22",
                  borderColor: m.color + "55",
                },
              ]}
            >
              <Text
                style={[
                  s.muhurtaBadgeTxt,
                  { color: m.color },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {m.quality}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Remedies Section ───────────────────────────────────────────────────────────
function RemediesSection({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Vedic Remedies"
        sub="Balance your planetary energies"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.remedyScroll}
      >
        {REMEDIES.map((r, i) => (
          <TouchableOpacity key={i} style={s.remedyCard} activeOpacity={0.88}>
            <LinearGradient
              colors={[r.tagColor + "18", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <Text style={s.remedyGlyph}>{r.glyph}</Text>
            <View
              style={[
                s.remedyTagPill,
                {
                  backgroundColor: r.tagColor + "22",
                  borderColor: r.tagColor + "44",
                },
              ]}
            >
              <Text
                style={[
                  s.remedyTagTxt,
                  { color: r.tagColor },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {r.tag}
              </Text>
            </View>
            <Text
              style={[s.remedyTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {r.title}
            </Text>
            <Text
              style={[
                s.remedyDesc,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {r.desc}
            </Text>
            <View style={s.remedyBookBtn}>
              <Text
                style={[
                  s.remedyBookTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Book
              </Text>
              <Ionicons
                name="arrow-forward"
                size={11}
                color={C.gold}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Courses Section ────────────────────────────────────────────────────────────
function CoursesSection({ fontsLoaded }) {
  return (
    <View style={s.coursesWrap}>
      <SecHeader
        title="Learn Astrology"
        sub="Courses for all levels"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      {COURSES.map((c, i) => (
        <TouchableOpacity key={i} style={s.courseCard} activeOpacity={0.88}>
          <LinearGradient
            colors={[c.accent + "18", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
          <View
            style={[
              s.courseIcon,
              {
                backgroundColor: c.accent + "20",
                borderColor: c.accent + "40",
              },
            ]}
          >
            <Icon
              lib={c.iconLib}
              name={c.iconName}
              size={20}
              color={c.accent}
            />
          </View>
          <View style={s.courseMid}>
            <Text
              style={[s.courseTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {c.title}
            </Text>
            <Text
              style={[
                s.courseLessons,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {c.lessons}
            </Text>
            <View
              style={[
                s.courseLevelBadge,
                {
                  backgroundColor: c.accent + "18",
                  borderColor: c.accent + "40",
                },
              ]}
            >
              <Text
                style={[
                  s.courseLevelTxt,
                  { color: c.accent },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {c.level}
              </Text>
            </View>
          </View>
          <View
            style={[
              s.courseArrow,
              {
                backgroundColor: c.accent + "20",
                borderColor: c.accent + "35",
              },
            ]}
          >
            <Ionicons name="chevron-forward" size={16} color={c.accent} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Sacred Travel ──────────────────────────────────────────────────────────────
function SacredTravelSection({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Sacred Travel"
        sub="Pilgrimage destinations"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.travelScroll}
      >
        {SACRED_PLACES.map((p, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <LinearGradient
              colors={p.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.travelCard}
            >
              <View
                style={[
                  s.bannerOrb,
                  {
                    width: 100,
                    height: 100,
                    top: -25,
                    right: -25,
                    opacity: 0.18,
                  },
                ]}
              />
              <Text style={s.travelGlyph}>{p.glyph}</Text>
              <Text
                style={[
                  s.travelName,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {p.name}
              </Text>
              <Text
                style={[
                  s.travelDesc,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {p.desc}
              </Text>
              <View style={s.travelCtaWrap}>
                <Text
                  style={[
                    s.travelCta,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  Explore
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={11}
                  color="rgba(255,255,255,0.85)"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Plain Quote ────────────────────────────────────────────────────────────────
function PlainQuote({ fontsLoaded }) {
  return (
    <View style={s.plainQuoteWrap}>
      <View style={s.plainQuoteLine} />
      <Text
        style={[s.plainQuoteText, fontsLoaded && { fontFamily: SERIF.regular }]}
      >
        "The stars incline, they do not compel. Your karma is the compass of
        your destiny."
      </Text>
      <Text
        style={[s.plainQuoteSrc, fontsLoaded && { fontFamily: SERIF.semiBold }]}
      >
        — Brihat Parashara Hora Shastra
      </Text>
      <View style={s.plainQuoteLine} />
    </View>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const cardWidth = width / 5;

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        <BannerCarousel fontsLoaded={fontsLoaded} navigation={navigation} />
        <PanchangBar fontsLoaded={fontsLoaded} />
        <AIInsightStrip fontsLoaded={fontsLoaded} />
        {/* Explore Grid */}
        <SecHeader
          title="Explore"
          sub="All spiritual services"
          fontsLoaded={fontsLoaded}
        />
        <View style={s.featGrid}>
          {FEATURES.map((f) => (
            <FeatCard
              key={f.id}
              item={f}
              fontsLoaded={fontsLoaded}
              cardWidth={cardWidth}
            />
          ))}
        </View>
        <RashiStrip fontsLoaded={fontsLoaded} />
        <PromoBanner fontsLoaded={fontsLoaded} />
        <SecHeader
          title="Top Astrologers"
          sub="Available now"
          onAll={() => {}}
          fontsLoaded={fontsLoaded}
        />
        {ASTROLOGERS.map((a, i) => (
          <AstroCard key={i} a={a} fontsLoaded={fontsLoaded} />
        ))}
        <MuhurtaSection fontsLoaded={fontsLoaded} />
        <RemediesSection fontsLoaded={fontsLoaded} />
        <CoursesSection fontsLoaded={fontsLoaded} />
        <SacredTravelSection fontsLoaded={fontsLoaded} />
        <PlainQuote fontsLoaded={fontsLoaded} />
      </ScrollView>

      <BottomNav fontsLoaded={fontsLoaded} navigation={navigation} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingBottom: 14,
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  navLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  navDivider: {
    width: 1,
    height: 30,
    backgroundColor: C.divider,
    marginHorizontal: 2,
  },
  navGreet: { fontSize: 13, color: C.inkMuted, letterSpacing: 0.5 },
  navUser: { fontSize: 20, color: C.ink, marginTop: 1 },
  navRight: { flexDirection: "row", alignItems: "center", gap: 10 },

  logoImg: {
    width: 38,
    height: 38,
  },

  navBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E84040",
    borderWidth: 1.5,
    borderColor: C.bgCard,
  },

  navAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarRing: {
    position: "absolute",
    inset: 0,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(212,160,23,0.5)",
  },
  scroll: { flex: 1 },

  // ── Banner ──
  carouselWrap: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 },
  bannerCard: {
    width: width - 32,
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  bannerOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  bannerShimmer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: "45%",
    opacity: 0.6,
  },
  bannerInner: { flex: 1, padding: 22, justifyContent: "flex-end" },
  bannerTagWrap: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.22)",
  },
  bannerTag: {
    fontSize: 11,
    color: "rgba(255,255,255,0.90)",
    letterSpacing: 0.8,
  },
  bannerTitle: { fontSize: 36, color: "#FFF", lineHeight: 40, marginBottom: 6 },
  bannerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 18,
    marginBottom: 18,
  },
  bannerCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  bannerCtaTxt: { color: "#FFF", fontSize: 13, letterSpacing: 0.4 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.border },
  dotActive: { width: 24, backgroundColor: C.gold, borderRadius: 3 },

  // ── Panchang ──
  panchangWrap: { paddingHorizontal: 16, marginTop: 20 },
  panchangHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  panchangHeadLabel: { fontSize: 13, color: C.gold, letterSpacing: 0.5 },
  panchangDate: { fontSize: 12, color: C.inkMuted },
  panchangInner: {
    borderRadius: 20,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: C.borderGold,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 4,
  },
  panchangItem: { flex: 1, alignItems: "center", paddingVertical: 16 },
  panchangSep: { borderRightWidth: 0.5, borderRightColor: C.divider },
  panchangLabel: {
    fontSize: 9,
    color: C.gold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  panchangVal: { fontSize: 14, color: C.ink, marginTop: 3 },

  // ── AI Strip ──
  aiWrap: { paddingHorizontal: 16, marginTop: 14 },
  aiStrip: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
  },
  aiGlowDot: {
    position: "absolute",
    top: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.moon,
    opacity: 0.08,
  },
  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  aiLabel: { fontSize: 14, color: C.ink, marginBottom: 3 },
  aiSub: { fontSize: 12, color: C.inkMid, lineHeight: 17 },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    flexShrink: 0,
  },
  aiBtnTxt: { color: C.moonLight, fontSize: 12 },

  // ── Section Header ──
  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 14,
  },
  secTitle: { fontSize: 26, color: C.ink },
  secSub: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  seeAll: { fontSize: 12, color: C.moon },

  // ── Feature Grid ──
  featGrid: { flexDirection: "row", flexWrap: "wrap", width: "100%" },
  featIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  featLabel: {
    fontSize: 15,
    color: C.ink,
    textAlign: "center",
    paddingHorizontal: 2,
  },
  featSub: {
    fontSize: 12,
    color: C.inkMuted,
    textAlign: "center",
    marginTop: 1,
    paddingHorizontal: 2,
  },

  // ── Rashi ──
  rashiScroll: { paddingHorizontal: 16, gap: 8 },
  rashiChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    backgroundColor: C.bgCard,
  },
  rashiChipActive: { borderColor: C.moon },
  rashiTxt: { fontSize: 13, color: C.inkMid },

  // ── Promo ──
  promoWrap: { paddingHorizontal: 16, marginTop: 24 },
  promoBanner: {
    borderRadius: 26,
    padding: 26,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  promoBorderGold: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.4,
  },
  promoOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  promoTagWrap: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  promoTag: { fontSize: 11, color: C.goldMid, letterSpacing: 0.8 },
  promoH: { fontSize: 30, color: C.ink, lineHeight: 36 },
  promoSub: { fontSize: 12.5, color: C.inkMuted, marginTop: 8, lineHeight: 18 },
  promoBtn: {
    marginTop: 18,
    alignSelf: "flex-start",
    borderRadius: 22,
    overflow: "hidden",
  },
  promoBtnGrad: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  promoBtnTxt: { color: "#0D0B1A", fontSize: 14 },
  promoMoon: {
    fontSize: 88,
    color: "rgba(123,127,232,0.15)",
    marginLeft: 10,
    lineHeight: 100,
  },

  // ── Astro Card ──
  astroCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  astroCardInner: { flexDirection: "row", alignItems: "center", padding: 16 },
  astroAvatarWrap: { position: "relative" },
  astroAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  astroInitials: { color: "#FFF", fontSize: 19 },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bgCard,
  },
  astroMid: { flex: 1, marginLeft: 14 },
  astroName: { fontSize: 18, color: C.ink },
  astroTitle: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  astroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },
  astroRating: { fontSize: 13, color: C.gold },
  astroDot: { fontSize: 12, color: C.inkMuted },
  astroMeta: { fontSize: 12, color: C.inkMuted },
  astroFeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 10,
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  onlineBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  onlineBadgeTxt: { fontSize: 10.5 },
  astroFee: { fontSize: 12, color: C.moon },
  consultBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  consultTxt: { color: "#0D0B1A", fontSize: 14 },

  // ── Muhurta ──
  muhurtaScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  muhurtaCard: {
    width: 136,
    borderRadius: 20,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    position: "relative",
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
    backgroundColor: C.bgCard,
  },
  muhurtaAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  muhurtaEvent: { fontSize: 14, color: C.ink, marginTop: 8 },
  muhurtaDate: { fontSize: 24, color: C.ink, marginTop: 6 },
  muhurtaDay: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  muhurtaBadge: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  muhurtaBadgeTxt: { fontSize: 10.5 },

  // ── Remedies ──
  remedyScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  remedyCard: {
    width: 164,
    borderRadius: 22,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  remedyGlyph: { fontSize: 30, marginBottom: 10 },
  remedyTagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 8,
  },
  remedyTagTxt: { fontSize: 10 },
  remedyTitle: { fontSize: 15, color: C.ink, lineHeight: 20 },
  remedyDesc: {
    fontSize: 11.5,
    color: C.inkMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  remedyBookBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: C.goldPale,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  remedyBookTxt: { fontSize: 12, color: C.gold },

  // ── Courses ──
  coursesWrap: { paddingHorizontal: 16 },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  courseMid: { flex: 1, marginLeft: 14 },
  courseTitle: { fontSize: 16, color: C.ink },
  courseLessons: { fontSize: 12, color: C.inkMuted, marginTop: 3 },
  courseLevelBadge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  courseLevelTxt: { fontSize: 10.5 },
  courseArrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Travel ──
  travelScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  travelCard: {
    width: 154,
    height: 196,
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 5,
  },
  travelGlyph: { fontSize: 32, marginBottom: 10 },
  travelName: { fontSize: 20, color: "#FFF" },
  travelDesc: { fontSize: 11, color: "rgba(255,255,255,0.70)", marginTop: 3 },
  travelCtaWrap: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  travelCta: {
    fontSize: 12,
    color: "rgba(255,255,255,0.88)",
    letterSpacing: 0.3,
  },

  // ── Plain Quote ──
  plainQuoteWrap: {
    paddingHorizontal: 28,
    paddingVertical: 28,
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  plainQuoteLine: {
    width: 40,
    height: 1,
    backgroundColor: C.goldBorder,
    marginVertical: 16,
  },
  plainQuoteText: {
    fontSize: 19,
    lineHeight: 30,
    color: C.inkMid,
    textAlign: "center",
    fontStyle: "italic",
  },
  plainQuoteSrc: {
    fontSize: 13,
    color: C.gold,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
