/**
 * Nakshatra — SpiritualTravel.jsx
 * "Dark Celestial Luxury" design language — matches HomeScreen v5
 *
 * Sections:
 *  1. Hero — search + muhurta badge + AI CTA
 *  2. AI Recommendations carousel
 *  3. Pilgrimage Packages
 *  4. Jyotirlinga Explorer + tracker
 *  5. Spiritual Retreats
 *  6. Temple Discovery Hub
 *  7. AI Temple Guide card
 *  8. Astro-Tourism International
 *  9. Muhurta Travel Planner
 * 10. Live Temple Intelligence
 * 11. Spiritual Journey Tracker
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
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";

const { width } = Dimensions.get("window");

// ── Design tokens (same as HomeScreen) ──────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.12)",
  goldBorder: "rgba(212,160,23,0.25)",
  goldGlow: "rgba(212,160,23,0.20)",
  moon: "#7B7FE8",
  moonLight: "#A5A8F8",
  moonDark: "#3A3DA8",
  moonPale: "rgba(123,127,232,0.12)",
  moonBorder: "rgba(123,127,232,0.25)",
  ink: "#F2EED8",
  inkMid: "#B8B0D8",
  inkMuted: "#6E6898",
  green: "#34D077",
  greenPale: "rgba(52,208,119,0.12)",
  teal: "#2DD4BF",
  tealPale: "rgba(45,212,191,0.12)",
  rose: "#F472B6",
  rosePale: "rgba(244,114,182,0.12)",
  border: "rgba(255,255,255,0.07)",
  borderGold: "rgba(212,160,23,0.30)",
  shadow: "rgba(0,0,0,0.50)",
  shadowGold: "rgba(212,160,23,0.25)",
  shadowMoon: "rgba(123,127,232,0.30)",
  divider: "rgba(255,255,255,0.06)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ── Mock Data ────────────────────────────────────────────────────────────────
const AI_RECS = [
  {
    dest: "Kashi Vishwanath",
    city: "Varanasi, UP",
    reason: "Jupiter transit in 9th house",
    benefit: "Spiritual liberation & moksha",
    score: 96,
    glyph: "🕉️",
    colors: ["#1A0A2E", "#4A1580", "#7A30C0"],
  },
  {
    dest: "Kedarnath",
    city: "Uttarakhand",
    reason: "Saturn Dasha — Shiva propitiation",
    benefit: "Karma cleansing & strength",
    score: 91,
    glyph: "⛰️",
    colors: ["#0A1A2E", "#1B4A8A", "#2A7ACA"],
  },
  {
    dest: "Tirupati Balaji",
    city: "Andhra Pradesh",
    reason: "Venus exalted — Vishnu blessings",
    benefit: "Wealth, beauty & harmony",
    score: 88,
    glyph: "🏛️",
    colors: ["#1A0E00", "#5A3200", "#C47A10"],
  },
  {
    dest: "Vrindavan",
    city: "Mathura, UP",
    reason: "Moon in Rohini — Krishna Nakshatra",
    benefit: "Love, joy & devotion",
    score: 85,
    glyph: "🌿",
    colors: ["#0A2E1A", "#1B6A3A", "#2A9A5A"],
  },
];

const PILGRIMAGES = [
  {
    name: "Char Dham Yatra",
    duration: "14 Days",
    price: "₹32,000",
    rating: "4.9",
    pilgrims: "12k+",
    season: "May–Jun",
    glyph: "🗻",
    colors: ["#0F0A2E", "#2A1880"],
    tag: "Most Sacred",
    tagColor: C.gold,
  },
  {
    name: "Kashi Vishwanath",
    duration: "4 Days",
    price: "₹8,500",
    rating: "4.8",
    pilgrims: "50k+",
    season: "Nov–Feb",
    glyph: "🕉️",
    colors: ["#1A0A2E", "#4A1580"],
    tag: "Trending",
    tagColor: C.moon,
  },
  {
    name: "Tirupati Darshan",
    duration: "3 Days",
    price: "₹6,200",
    rating: "4.9",
    pilgrims: "100k+",
    season: "Year Round",
    glyph: "🏛️",
    colors: ["#1A0E00", "#5A3200"],
    tag: "Top Rated",
    tagColor: C.green,
  },
  {
    name: "Rishikesh & Haridwar",
    duration: "5 Days",
    price: "₹9,800",
    rating: "4.7",
    pilgrims: "8k+",
    season: "Feb–Apr",
    glyph: "🌊",
    colors: ["#0A1A2E", "#1B4A7A"],
    tag: "New",
    tagColor: C.teal,
  },
  {
    name: "Ujjain Mahakal",
    duration: "3 Days",
    price: "₹5,500",
    rating: "4.8",
    pilgrims: "20k+",
    season: "Oct–Mar",
    glyph: "☀️",
    colors: ["#1E0A00", "#602000"],
    tag: "Popular",
    tagColor: C.rose,
  },
  {
    name: "Vrindavan Yatra",
    duration: "4 Days",
    price: "₹7,200",
    rating: "4.6",
    pilgrims: "15k+",
    season: "Aug–Nov",
    glyph: "🌸",
    colors: ["#0A2E1A", "#1B6A3A"],
    tag: "Devotional",
    tagColor: C.gold,
  },
];

const JYOTIRLINGAS = [
  { name: "Somnath", loc: "Gujarat", glyph: "🌙", visited: true },
  { name: "Mallikarjuna", loc: "Andhra Pradesh", glyph: "⭐", visited: true },
  { name: "Mahakaleshwar", loc: "Ujjain, MP", glyph: "☀️", visited: true },
  { name: "Omkareshwar", loc: "Madhya Pradesh", glyph: "🕉️", visited: false },
  { name: "Kedarnath", loc: "Uttarakhand", glyph: "⛰️", visited: false },
  { name: "Bhimashankar", loc: "Maharashtra", glyph: "🌿", visited: false },
  {
    name: "Kashi Vishwanath",
    loc: "Varanasi, UP",
    glyph: "🔱",
    visited: false,
  },
  { name: "Trimbakeshwar", loc: "Maharashtra", glyph: "💫", visited: false },
  { name: "Vaidyanath", loc: "Jharkhand", glyph: "🌺", visited: false },
  { name: "Nageshwar", loc: "Gujarat", glyph: "🐍", visited: false },
  { name: "Rameshwaram", loc: "Tamil Nadu", glyph: "🌊", visited: false },
  { name: "Grishneshwar", loc: "Maharashtra", glyph: "✨", visited: false },
];

const RETREATS = [
  {
    name: "Isha Foundation",
    loc: "Coimbatore",
    duration: "7 Days",
    theme: "Inner Engineering",
    level: "Beginner",
    glyph: "🧘",
    accent: C.gold,
    colors: ["#1A0800", "#4A2000"],
  },
  {
    name: "Art of Living",
    loc: "Bangalore",
    duration: "5 Days",
    theme: "Sudarshan Kriya",
    level: "All Levels",
    glyph: "🌬️",
    accent: C.moon,
    colors: ["#0A1040", "#1A2880"],
  },
  {
    name: "Vipassana Centre",
    loc: "Igatpuri",
    duration: "10 Days",
    theme: "Noble Silence",
    level: "Dedicated",
    glyph: "🤫",
    accent: C.teal,
    colors: ["#001A1A", "#004040"],
  },
  {
    name: "Himalayan Ashram",
    loc: "Rishikesh",
    duration: "21 Days",
    theme: "Vedic Immersion",
    level: "Advanced",
    glyph: "🏔️",
    accent: C.rose,
    colors: ["#1A0A18", "#481040"],
  },
];

const TEMPLES = [
  {
    name: "Lotus Temple",
    city: "Delhi",
    history: "Bahá'í House of Worship, 1986",
    darshan: "9am–7pm",
    crowd: "High",
    crowdColor: C.rose,
    glyph: "🌸",
  },
  {
    name: "Meenakshi Amman",
    city: "Madurai",
    history: "Ancient Dravidian, 7th century",
    darshan: "5am–12pm, 4–10pm",
    crowd: "Medium",
    crowdColor: C.gold,
    glyph: "🏯",
  },
  {
    name: "Sun Temple",
    city: "Konark, Odisha",
    history: "13th century Kalinga architecture",
    darshan: "6am–8pm",
    crowd: "Low",
    crowdColor: C.green,
    glyph: "☀️",
  },
  {
    name: "Akshardham",
    city: "Delhi",
    history: "BAPS Swaminarayan, 2005",
    darshan: "10am–6pm",
    crowd: "High",
    crowdColor: C.rose,
    glyph: "🕌",
  },
];

const INTERNATIONAL = [
  {
    name: "Bali",
    country: "Indonesia",
    vedic: "Shakti pilgrimage, cosmic energy vortex",
    period: "Mar–Sep",
    glyph: "🌺",
    colors: ["#1A0E00", "#6A3010", "#C07030"],
  },
  {
    name: "Angkor Wat",
    country: "Cambodia",
    vedic: "Vishnu cosmic temple, Hindu cosmology",
    period: "Nov–Feb",
    glyph: "🏛️",
    colors: ["#0A1A2E", "#1B4A7A", "#2A7AB0"],
  },
  {
    name: "Mount Kailash",
    country: "Tibet",
    vedic: "Shiva's cosmic abode, ultimate pilgrimage",
    period: "May–Sep",
    glyph: "⛰️",
    colors: ["#0F0A2E", "#2A1870", "#5040A0"],
  },
  {
    name: "Kyoto Temples",
    country: "Japan",
    vedic: "Buddhist dharma, Zen consciousness",
    period: "Apr, Oct–Nov",
    glyph: "⛩️",
    colors: ["#1A0A1A", "#4A1040", "#8A2080"],
  },
];

const MUHURTA_DATES = [
  {
    date: "12 Aug",
    day: "Tue",
    quality: "Excellent",
    color: C.green,
    note: "Shubha Yoga",
  },
  {
    date: "15 Aug",
    day: "Fri",
    quality: "Auspicious",
    color: C.gold,
    note: "Purnima",
  },
  {
    date: "18 Aug",
    day: "Mon",
    quality: "Very Good",
    color: C.moon,
    note: "Siddha Yoga",
  },
  {
    date: "22 Aug",
    day: "Fri",
    quality: "Good",
    color: C.teal,
    note: "Pushya Nakshatra",
  },
];

const AVOID_DATES = [
  { date: "9 Aug", reason: "Rahu Kaal" },
  { date: "13 Aug", reason: "Amavasya" },
];

const LIVE_STATUS = [
  {
    temple: "Kashi Vishwanath",
    crowd: "High",
    crowdColor: C.rose,
    wait: "90 min",
    open: true,
    weather: "31°C ☁️",
    festival: "Shravan Somvar",
    icon: "people",
  },
  {
    temple: "Tirupati",
    crowd: "Very High",
    crowdColor: "#FF4444",
    wait: "3 hrs",
    open: true,
    weather: "28°C 🌤",
    festival: null,
    icon: "trending-up",
  },
  {
    temple: "Kedarnath",
    crowd: "Medium",
    crowdColor: C.gold,
    wait: "30 min",
    open: true,
    weather: "12°C ❄️",
    festival: null,
    icon: "people-outline",
  },
];

const JOURNEY_STATS = [
  { label: "Temples", val: "12", icon: "business", color: C.gold },
  { label: "Pilgrimages", val: "3", icon: "map", color: C.moon },
  { label: "Retreats", val: "2", icon: "leaf", color: C.green },
  { label: "Countries", val: "1", icon: "airplane", color: C.teal },
];

const MILESTONES = [
  {
    title: "Temple Seeker",
    desc: "Visited 10+ temples",
    unlocked: true,
    glyph: "🏛️",
  },
  {
    title: "Pilgrimage Soul",
    desc: "Completed first Yatra",
    unlocked: true,
    glyph: "🚶",
  },
  {
    title: "Jyotirlinga Quest",
    desc: "3/12 Jyotirlingas",
    unlocked: true,
    glyph: "🔱",
  },
  {
    title: "Silent Seeker",
    desc: "Complete a silent retreat",
    unlocked: false,
    glyph: "🤫",
  },
  {
    title: "Himalayan Yogi",
    desc: "Visit a Himalayan ashram",
    unlocked: false,
    glyph: "🏔️",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function SecHeader({ title, sub, onAll, fontsLoaded, light }) {
  return (
    <View style={sh.wrap}>
      <View>
        <Text
          style={[
            sh.title,
            fontsLoaded && { fontFamily: SERIF.bold },
            light && { color: C.ink },
          ]}
        >
          {title}
        </Text>
        {sub && (
          <Text style={[sh.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
            {sub}
          </Text>
        )}
      </View>
      {onAll && (
        <TouchableOpacity onPress={onAll} style={sh.btn}>
          <Text style={[sh.all, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
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
const sh = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: { fontSize: 26, color: C.ink },
  sub: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  all: { fontSize: 12, color: C.moon },
});

// ── 1. Hero ──────────────────────────────────────────────────────────────────
function HeroSection({ fontsLoaded }) {
  const [search, setSearch] = useState("");
  return (
    <View>
      <LinearGradient
        colors={["#060418", "#0F0B2E", "#1A1060", "#0D0B1A"]}
        locations={[0, 0.3, 0.7, 1]}
        style={hero.wrap}
      >
        {/* Celestial orbs */}
        <View
          style={[
            hero.orb,
            {
              width: 300,
              height: 300,
              top: -120,
              right: -100,
              backgroundColor: C.moon,
              opacity: 0.06,
            },
          ]}
        />
        <View
          style={[
            hero.orb,
            {
              width: 200,
              height: 200,
              top: 60,
              left: -80,
              backgroundColor: C.gold,
              opacity: 0.05,
            },
          ]}
        />
        <View
          style={[
            hero.orb,
            {
              width: 120,
              height: 120,
              bottom: 40,
              right: 60,
              backgroundColor: C.moon,
              opacity: 0.08,
            },
          ]}
        />

        {/* Stars */}
        {[...Array(16)].map((_, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: 2,
              backgroundColor: C.ink,
              opacity: 0.3 + (i % 4) * 0.1,
              top: 20 + ((i * 37) % 280),
              left: (i * 83) % (width - 20),
            }}
          />
        ))}

        {/* Muhurta badge */}
        <View style={hero.muhurtaBadge}>
          <LinearGradient
            colors={[C.goldPale, "rgba(212,160,23,0.18)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={hero.muhurtaGrad}
          >
            <Ionicons name="flash" size={11} color={C.gold} />
            <Text
              style={[
                hero.muhurtaTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {"  "}Best Travel Muhurta: 12–18 Aug · Highly Favorable
            </Text>
          </LinearGradient>
        </View>

        {/* Heading */}
        <Text style={[hero.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          AI-Powered Pilgrimage Planner
        </Text>
        <Text style={[hero.h1, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Where is your{"\n"}
          <Text style={{ color: C.goldLight }}>soul calling</Text> you?
        </Text>

        {/* Glyph art */}
        <Text style={hero.glyph}>🕉️</Text>

        {/* Search */}
        <View style={hero.searchBox}>
          <Ionicons
            name="search"
            size={16}
            color={C.inkMuted}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search temples, retreats, pilgrimages…"
            placeholderTextColor={C.inkMuted}
            style={[
              hero.searchInput,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          />
          <TouchableOpacity style={hero.searchBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={[C.goldLight, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={hero.searchBtnGrad}
            >
              <Ionicons name="arrow-forward" size={14} color="#0D0B1A" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* AI CTA */}
        <TouchableOpacity style={hero.aiCta} activeOpacity={0.88}>
          <LinearGradient
            colors={[C.moonLight, C.moon, C.moonDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={hero.aiCtaGrad}
          >
            <MaterialCommunityIcons
              name="crystal-ball"
              size={16}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                hero.aiCtaTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              Get My AI Travel Plan
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={hero.chips}
          style={{ marginTop: 16 }}
        >
          {[
            "✦ All",
            "🏛️ Temples",
            "⛰️ Yatra",
            "🧘 Retreats",
            "🌍 International",
            "🔱 Jyotirlinga",
          ].map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[hero.chip, i === 0 && hero.chipActive]}
              activeOpacity={0.8}
            >
              {i === 0 && (
                <LinearGradient
                  colors={[C.moonLight, C.moon]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={20}
                />
              )}
              <Text
                style={[
                  hero.chipTxt,
                  i === 0 && { color: "#FFF" },
                  fontsLoaded && {
                    fontFamily: i === 0 ? SERIF.semiBold : SERIF.regular,
                  },
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
const hero = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "android" ? 56 : 72,
    paddingBottom: 32,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  orb: { position: "absolute", borderRadius: 999 },
  muhurtaBadge: {
    alignSelf: "flex-start",
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    marginBottom: 16,
  },
  muhurtaGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  muhurtaTxt: { fontSize: 11, color: C.gold, letterSpacing: 0.4 },
  sub: { fontSize: 13, color: C.inkMuted, letterSpacing: 0.8, marginBottom: 8 },
  h1: { fontSize: 44, color: C.ink, lineHeight: 50 },
  glyph: {
    fontSize: 72,
    position: "absolute",
    top: Platform.OS === "android" ? 60 : 80,
    right: 20,
    opacity: 0.12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 24,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: { flex: 1, color: C.ink, fontSize: 14 },
  searchBtn: { borderRadius: 12, overflow: "hidden" },
  searchBtnGrad: { padding: 8 },
  aiCta: {
    marginTop: 12,
    borderRadius: 22,
    overflow: "hidden",
    alignSelf: "flex-start",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 5,
  },
  aiCtaGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  aiCtaTxt: { color: "#FFF", fontSize: 14 },
  chips: { paddingRight: 20, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  chipActive: { borderColor: C.moon },
  chipTxt: { fontSize: 12.5, color: C.inkMid },
});

// ── 2. AI Recommendations ────────────────────────────────────────────────────
function AIRecommendations({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Your AI Recommendations"
        sub="Based on your Kundli & current Dasha"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {AI_RECS.map((r, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <LinearGradient
              colors={r.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ai.card}
            >
              <View
                style={[
                  ai.orb,
                  { width: 120, height: 120, top: -40, right: -30 },
                ]}
              />
              {/* Score ring placeholder */}
              <View style={ai.scoreRing}>
                <Text
                  style={[
                    ai.scoreTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {r.score}%
                </Text>
                <Text
                  style={[
                    ai.scoreLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  Auspicious
                </Text>
              </View>
              <Text style={ai.glyph}>{r.glyph}</Text>
              <View style={ai.aiTag}>
                <MaterialCommunityIcons
                  name="robot"
                  size={10}
                  color={C.moonLight}
                />
                <Text
                  style={[
                    ai.aiTagTxt,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {"  "}AI Pick
                </Text>
              </View>
              <Text
                style={[ai.dest, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {r.dest}
              </Text>
              <Text
                style={[ai.city, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {r.city}
              </Text>
              <View style={ai.reasonWrap}>
                <Ionicons name="star" size={11} color={C.gold} />
                <Text
                  style={[
                    ai.reasonTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {"  "}
                  {r.reason}
                </Text>
              </View>
              <Text
                style={[
                  ai.benefit,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                ✦ {r.benefit}
              </Text>
              <TouchableOpacity style={ai.bookBtn} activeOpacity={0.85}>
                <LinearGradient
                  colors={[C.goldLight, C.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={ai.bookGrad}
                >
                  <Text
                    style={[
                      ai.bookTxt,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    Explore
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color="#0D0B1A"
                    style={{ marginLeft: 5 }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const ai = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 6,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    opacity: 0.05,
  },
  scoreRing: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  scoreTxt: { fontSize: 15, color: C.goldLight },
  scoreLabel: { fontSize: 8, color: C.inkMuted, marginTop: 1 },
  glyph: { fontSize: 40, marginBottom: 8, marginTop: 4 },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  aiTagTxt: { fontSize: 10, color: C.moonLight },
  dest: { fontSize: 20, color: C.ink, lineHeight: 24 },
  city: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  reasonWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 6,
  },
  reasonTxt: { fontSize: 11, color: C.inkMid, flex: 1, lineHeight: 16 },
  benefit: { fontSize: 12, color: C.gold, lineHeight: 17 },
  bookBtn: {
    marginTop: 14,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  bookGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookTxt: { fontSize: 13, color: "#0D0B1A" },
});

// ── 3. Pilgrimage Packages ───────────────────────────────────────────────────
function PilgrimagePackages({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Pilgrimage Packages"
        sub="Curated sacred journeys"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {PILGRIMAGES.map((p, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <View style={pkg.card}>
              <LinearGradient
                colors={p.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={pkg.imgArea}
              >
                <View
                  style={[
                    pkg.orb,
                    { width: 140, height: 140, top: -50, right: -40 },
                  ]}
                />
                <Text style={pkg.glyph}>{p.glyph}</Text>
                <View
                  style={[
                    pkg.tagPill,
                    {
                      backgroundColor: p.tagColor + "30",
                      borderColor: p.tagColor + "60",
                    },
                  ]}
                >
                  <Text
                    style={[
                      pkg.tagTxt,
                      { color: p.tagColor },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {p.tag}
                  </Text>
                </View>
              </LinearGradient>
              <View style={pkg.body}>
                <Text
                  style={[pkg.name, fontsLoaded && { fontFamily: SERIF.bold }]}
                >
                  {p.name}
                </Text>
                <View style={pkg.metaRow}>
                  <Ionicons name="star" size={11} color={C.gold} />
                  <Text
                    style={[
                      pkg.meta,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {" "}
                    {p.rating}
                  </Text>
                  <Text style={pkg.dot}>·</Text>
                  <Ionicons name="people" size={11} color={C.inkMuted} />
                  <Text
                    style={[
                      pkg.meta,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    {p.pilgrims}
                  </Text>
                </View>
                <View style={pkg.metaRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color={C.inkMuted}
                  />
                  <Text
                    style={[
                      pkg.metaMuted,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    {p.duration}
                    {"  "}·{"  "}
                    {p.season}
                  </Text>
                </View>
                <View style={pkg.footer}>
                  <View>
                    <Text
                      style={[
                        pkg.fromTxt,
                        fontsLoaded && { fontFamily: SERIF.regular },
                      ]}
                    >
                      From
                    </Text>
                    <Text
                      style={[
                        pkg.price,
                        fontsLoaded && { fontFamily: SERIF.bold },
                      ]}
                    >
                      {p.price}
                    </Text>
                  </View>
                  <TouchableOpacity style={pkg.bookBtn} activeOpacity={0.85}>
                    <LinearGradient
                      colors={[C.goldLight, C.gold]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={pkg.bookGrad}
                    >
                      <Text
                        style={[
                          pkg.bookTxt,
                          fontsLoaded && { fontFamily: SERIF.bold },
                        ]}
                      >
                        Book
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const pkg = StyleSheet.create({
  card: {
    width: 210,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  imgArea: {
    height: 150,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 14,
    position: "relative",
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.05,
  },
  glyph: {
    position: "absolute",
    bottom: 12,
    left: 14,
    fontSize: 52,
    opacity: 0.9,
  },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  tagTxt: { fontSize: 10.5 },
  body: { padding: 14 },
  name: { fontSize: 17, color: C.ink, lineHeight: 22, marginBottom: 6 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 2,
  },
  meta: { fontSize: 12, color: C.inkMid },
  metaMuted: { fontSize: 12, color: C.inkMuted },
  dot: { fontSize: 12, color: C.inkMuted, marginHorizontal: 2 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  fromTxt: { fontSize: 10, color: C.inkMuted },
  price: { fontSize: 20, color: C.goldLight },
  bookBtn: { borderRadius: 14, overflow: "hidden" },
  bookGrad: { paddingHorizontal: 18, paddingVertical: 9 },
  bookTxt: { fontSize: 13, color: "#0D0B1A" },
});

// ── 4. Jyotirlinga Explorer ──────────────────────────────────────────────────
function JyotirlingaExplorer({ fontsLoaded }) {
  const visited = JYOTIRLINGAS.filter((j) => j.visited).length;
  return (
    <View style={jyo.section}>
      <LinearGradient
        colors={["#0F0A2E", "#1A1560", "#0F0A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={jyo.bg}
      >
        {/* Decorative orbs */}
        <View
          style={[
            jyo.orb,
            { width: 280, height: 280, top: -100, right: -100, opacity: 0.07 },
          ]}
        />
        <View
          style={[
            jyo.orb,
            { width: 160, height: 160, bottom: -60, left: -40, opacity: 0.05 },
          ]}
        />

        <SecHeader
          title="Jyotirlinga Explorer"
          sub="The 12 sacred abodes of Shiva"
          fontsLoaded={fontsLoaded}
        />

        {/* Progress tracker */}
        <View style={jyo.tracker}>
          <LinearGradient
            colors={["#1A1550", "#2A2070"]}
            style={jyo.trackerCard}
          >
            <View style={jyo.trackerRing}>
              <Text
                style={[
                  jyo.trackerNum,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {visited}
              </Text>
              <Text
                style={[
                  jyo.trackerSlash,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                / 12
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  jyo.trackerTitle,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                Jyotirlingas Completed
              </Text>
              <Text
                style={[
                  jyo.trackerSub,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {12 - visited} more to attain Moksha
              </Text>
              {/* Progress bar */}
              <View style={jyo.progressBg}>
                <LinearGradient
                  colors={[C.goldLight, C.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    jyo.progressFill,
                    { width: `${(visited / 12) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
            paddingBottom: 4,
          }}
        >
          {JYOTIRLINGAS.map((j, i) => (
            <TouchableOpacity key={i} activeOpacity={0.88}>
              <LinearGradient
                colors={
                  j.visited
                    ? [C.goldPale + "40", "rgba(212,160,23,0.08)"]
                    : ["#13112A", "#1C1A3A"]
                }
                style={[jyo.card, j.visited && { borderColor: C.goldBorder }]}
              >
                {j.visited && (
                  <View style={jyo.visitedBadge}>
                    <Ionicons name="checkmark" size={10} color="#0D0B1A" />
                  </View>
                )}
                <View style={jyo.cardNum}>
                  <Text
                    style={[
                      jyo.cardNumTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                </View>
                <Text style={jyo.cardGlyph}>{j.glyph}</Text>
                <Text
                  style={[
                    jyo.cardName,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {j.name}
                </Text>
                <Text
                  style={[
                    jyo.cardLoc,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {j.loc}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
const jyo = StyleSheet.create({
  section: { marginTop: 8 },
  bg: { paddingBottom: 24 },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  tracker: { paddingHorizontal: 16, marginBottom: 8 },
  trackerCard: {
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  trackerRing: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
    backgroundColor: C.goldPale,
    borderWidth: 1.5,
    borderColor: C.goldBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  trackerNum: { fontSize: 32, color: C.goldLight },
  trackerSlash: { fontSize: 16, color: C.inkMuted },
  trackerTitle: { fontSize: 18, color: C.ink, marginBottom: 4 },
  trackerSub: { fontSize: 12, color: C.inkMuted, marginBottom: 10 },
  progressBg: {
    height: 4,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: 4, borderRadius: 4 },
  card: {
    width: 116,
    borderRadius: 20,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    position: "relative",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  visitedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNum: {
    marginBottom: 8,
    alignSelf: "flex-start",
    backgroundColor: C.bgSurface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardNumTxt: { fontSize: 10, color: C.inkMuted },
  cardGlyph: { fontSize: 28, marginBottom: 8 },
  cardName: { fontSize: 14, color: C.ink, lineHeight: 18 },
  cardLoc: { fontSize: 10, color: C.inkMuted, marginTop: 3 },
});

// ── 5. Spiritual Retreats ────────────────────────────────────────────────────
function SpiritualRetreats({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Spiritual Retreats"
        sub="Transform mind, body & soul"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {RETREATS.map((r, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <LinearGradient
              colors={r.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={ret.card}
            >
              <View
                style={[
                  ret.orb,
                  { width: 140, height: 140, top: -40, right: -40 },
                ]}
              />
              <Text style={ret.glyph}>{r.glyph}</Text>
              <View
                style={[
                  ret.levelBadge,
                  {
                    backgroundColor: r.accent + "22",
                    borderColor: r.accent + "44",
                  },
                ]}
              >
                <Text
                  style={[
                    ret.levelTxt,
                    { color: r.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {r.level}
                </Text>
              </View>
              <Text
                style={[ret.name, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {r.name}
              </Text>
              <Text
                style={[ret.loc, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {r.loc}
              </Text>
              <Text
                style={[
                  ret.theme,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                ✦ {r.theme}
              </Text>
              <View style={ret.durationRow}>
                <Ionicons name="time-outline" size={12} color={C.inkMuted} />
                <Text
                  style={[
                    ret.durationTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {"  "}
                  {r.duration}
                </Text>
              </View>
              <TouchableOpacity
                style={[ret.exploreBtn, { borderColor: r.accent + "55" }]}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    ret.exploreTxt,
                    { color: r.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  Apply Now
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={r.accent}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const ret = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.04,
  },
  glyph: { fontSize: 36, marginBottom: 10 },
  levelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  levelTxt: { fontSize: 10.5 },
  name: { fontSize: 19, color: C.ink, lineHeight: 23 },
  loc: { fontSize: 11, color: C.inkMuted, marginTop: 3 },
  theme: { fontSize: 12, color: C.inkMid, marginTop: 8 },
  durationRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  durationTxt: { fontSize: 12, color: C.inkMuted },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 0.5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  exploreTxt: { fontSize: 12 },
});

// ── 6. Temple Discovery Hub ──────────────────────────────────────────────────
function TempleDiscoveryHub({ fontsLoaded }) {
  return (
    <View style={tph.section}>
      <SecHeader
        title="Temple Discovery Hub"
        sub="Explore 1,000+ sacred temples"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      {TEMPLES.map((t, i) => (
        <TouchableOpacity key={i} style={tph.card} activeOpacity={0.88}>
          <LinearGradient
            colors={[C.goldPale + "30", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
            borderRadius={20}
          />
          <View style={tph.glyphBox}>
            <Text style={tph.glyph}>{t.glyph}</Text>
          </View>
          <View style={tph.mid}>
            <Text style={[tph.name, fontsLoaded && { fontFamily: SERIF.bold }]}>
              {t.name}
            </Text>
            <Text
              style={[tph.city, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {t.city}
            </Text>
            <Text
              style={[
                tph.history,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
              numberOfLines={1}
            >
              {t.history}
            </Text>
            <View style={tph.row}>
              <Ionicons name="time-outline" size={11} color={C.inkMuted} />
              <Text
                style={[tph.meta, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {"  "}
                {t.darshan}
              </Text>
            </View>
          </View>
          <View style={tph.right}>
            <View
              style={[
                tph.crowdBadge,
                {
                  backgroundColor: t.crowdColor + "22",
                  borderColor: t.crowdColor + "44",
                },
              ]}
            >
              <View style={[tph.crowdDot, { backgroundColor: t.crowdColor }]} />
              <Text
                style={[
                  tph.crowdTxt,
                  { color: t.crowdColor },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {t.crowd}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.inkMuted}
              style={{ marginTop: 12 }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const tph = StyleSheet.create({
  section: { paddingHorizontal: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  glyphBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  glyph: { fontSize: 26 },
  mid: { flex: 1, marginLeft: 12 },
  name: { fontSize: 17, color: C.ink },
  city: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  history: { fontSize: 11.5, color: C.inkMid, marginTop: 3 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  meta: { fontSize: 11, color: C.inkMuted },
  right: { alignItems: "flex-end" },
  crowdBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  crowdDot: { width: 5, height: 5, borderRadius: 3 },
  crowdTxt: { fontSize: 10.5 },
});

// ── 7. AI Temple Guide ───────────────────────────────────────────────────────
function AITempleGuide({ fontsLoaded }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <LinearGradient
        colors={["#100E2A", "#1E1A60", "#0A0820"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={atg.card}
      >
        {/* Glow */}
        <View style={atg.glow} />
        <View
          style={[
            atg.orb,
            { width: 200, height: 200, top: -80, right: -60, opacity: 0.08 },
          ]}
        />

        <LinearGradient
          colors={[C.moonLight, C.moon, C.moonDark]}
          style={atg.iconWrap}
        >
          <MaterialCommunityIcons name="robot" size={22} color="#FFF" />
        </LinearGradient>

        <Text
          style={[atg.label, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          AI Temple Guide
        </Text>
        <Text style={[atg.heading, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Ask anything about{"\n"}
          <Text style={{ color: C.goldLight }}>any sacred place</Text>
        </Text>
        <Text style={[atg.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Temple history · Rituals · Dress code · Best Muhurta · Offerings ·
          Spiritual significance
        </Text>

        <View style={atg.featureRow}>
          {["History", "Rituals", "Muhurta", "Offerings"].map((f, i) => (
            <View key={i} style={atg.featureChip}>
              <Text
                style={[
                  atg.featureTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {f}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={atg.ctaBtn} activeOpacity={0.88}>
          <LinearGradient
            colors={[C.moonLight, C.moon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={atg.ctaGrad}
          >
            <MaterialCommunityIcons
              name="crystal-ball"
              size={15}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text
              style={[atg.ctaTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Ask AI Guide
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
const atg = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  glow: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: C.moon,
    opacity: 0.12,
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    color: C.moon,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heading: { fontSize: 30, color: C.ink, lineHeight: 36, marginBottom: 10 },
  sub: { fontSize: 13, color: C.inkMuted, lineHeight: 20, marginBottom: 16 },
  featureRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  featureChip: {
    backgroundColor: C.moonPale,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  featureTxt: { fontSize: 12, color: C.moonLight },
  ctaBtn: { borderRadius: 22, overflow: "hidden", alignSelf: "flex-start" },
  ctaGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  ctaTxt: { color: "#FFF", fontSize: 14 },
});

// ── 8. International Astro-Tourism ───────────────────────────────────────────
function InternationalSection({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Astro-Tourism International"
        sub="Sacred journeys beyond India"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {INTERNATIONAL.map((d, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <LinearGradient
              colors={d.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={intl.card}
            >
              <View
                style={[
                  intl.orb,
                  { width: 200, height: 200, top: -60, right: -60 },
                ]}
              />
              <Text style={intl.glyph}>{d.glyph}</Text>
              <View style={intl.countryTag}>
                <Ionicons name="globe-outline" size={10} color={C.inkMid} />
                <Text
                  style={[
                    intl.countryTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {"  "}
                  {d.country}
                </Text>
              </View>
              <Text
                style={[intl.name, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {d.name}
              </Text>
              <Text
                style={[
                  intl.vedic,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {d.vedic}
              </Text>
              <View style={intl.periodRow}>
                <Ionicons name="calendar-outline" size={11} color={C.gold} />
                <Text
                  style={[
                    intl.period,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {"  "}Best: {d.period}
                </Text>
              </View>
              <TouchableOpacity style={intl.exploreBtn} activeOpacity={0.85}>
                <Text
                  style={[
                    intl.exploreTxt,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  Explore
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color="rgba(255,255,255,0.85)"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const intl = StyleSheet.create({
  card: {
    width: 220,
    height: 280,
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.04,
  },
  glyph: { position: "absolute", top: 20, left: 20, fontSize: 48 },
  countryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.30)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  countryTxt: { fontSize: 11, color: C.inkMid },
  name: { fontSize: 26, color: "#FFF", lineHeight: 30, marginBottom: 6 },
  vedic: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 17,
    marginBottom: 10,
  },
  periodRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  period: { fontSize: 12, color: C.gold },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.28)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: "flex-start",
  },
  exploreTxt: { fontSize: 13, color: "rgba(255,255,255,0.90)" },
});

// ── 9. Muhurta Travel Planner ────────────────────────────────────────────────
function MuhurtaPlanner({ fontsLoaded }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <LinearGradient
        colors={["#0F0A1E", "#1A1440", "#100E2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={mhp.card}
      >
        <View
          style={[
            mhp.orb,
            { width: 250, height: 250, top: -80, right: -80, opacity: 0.07 },
          ]}
        />
        <View
          style={[
            mhp.orb,
            {
              width: 120,
              height: 120,
              bottom: -30,
              left: -30,
              opacity: 0.05,
              backgroundColor: C.gold,
            },
          ]}
        />

        <View style={mhp.header}>
          <View>
            <Text
              style={[mhp.label, fontsLoaded && { fontFamily: SERIF.semiBold }]}
            >
              ✦ AI-POWERED
            </Text>
            <Text
              style={[mhp.title, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Muhurta Travel{"\n"}
              <Text style={{ color: C.goldLight }}>Planner</Text>
            </Text>
          </View>
          <View style={mhp.cosmicScore}>
            <Text
              style={[mhp.scoreNum, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              88
            </Text>
            <Text
              style={[
                mhp.scoreLbl,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Travel{"\n"}Score
            </Text>
          </View>
        </View>

        {/* Dasha info */}
        <View style={mhp.dashaRow}>
          {[
            { label: "Current Dasha", val: "Jupiter" },
            { label: "Nakshatra", val: "Rohini" },
            { label: "Alignment", val: "Favorable" },
          ].map((d, i) => (
            <View
              key={i}
              style={[
                mhp.dashaItem,
                i < 2 && { borderRightWidth: 0.5, borderRightColor: C.divider },
              ]}
            >
              <Text
                style={[
                  mhp.dashaLabel,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {d.label}
              </Text>
              <Text
                style={[
                  mhp.dashaVal,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {d.val}
              </Text>
            </View>
          ))}
        </View>

        {/* Recommended dates */}
        <Text
          style={[
            mhp.sectionLabel,
            fontsLoaded && { fontFamily: SERIF.semiBold },
          ]}
        >
          Recommended Dates
        </Text>
        {MUHURTA_DATES.map((d, i) => (
          <View key={i} style={mhp.dateRow}>
            <View style={[mhp.dateAccent, { backgroundColor: d.color }]} />
            <View
              style={[
                mhp.dateBadge,
                {
                  backgroundColor: d.color + "22",
                  borderColor: d.color + "44",
                },
              ]}
            >
              <Text
                style={[
                  mhp.dateDay,
                  { color: d.color },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {d.date}
              </Text>
              <Text
                style={[
                  mhp.dateDow,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {d.day}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[
                  mhp.dateQuality,
                  { color: d.color },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {d.quality}
              </Text>
              <Text
                style={[
                  mhp.dateNote,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {d.note}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color={d.color} />
          </View>
        ))}

        {/* Avoid dates */}
        <Text
          style={[
            mhp.sectionLabel,
            { color: "#FF6B6B", marginTop: 16 },
            fontsLoaded && { fontFamily: SERIF.semiBold },
          ]}
        >
          Dates to Avoid
        </Text>
        {AVOID_DATES.map((d, i) => (
          <View key={i} style={[mhp.dateRow, { opacity: 0.75 }]}>
            <View style={[mhp.dateAccent, { backgroundColor: "#FF6B6B" }]} />
            <View
              style={[
                mhp.dateBadge,
                {
                  backgroundColor: "rgba(255,107,107,0.15)",
                  borderColor: "rgba(255,107,107,0.3)",
                },
              ]}
            >
              <Text
                style={[
                  mhp.dateDay,
                  { color: "#FF6B6B", fontSize: 13 },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {d.date}
              </Text>
            </View>
            <Text
              style={[
                mhp.dateNote,
                { marginLeft: 12 },
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {d.reason}
            </Text>
            <Ionicons name="close-circle" size={18} color="#FF6B6B" />
          </View>
        ))}

        <TouchableOpacity style={mhp.ctaBtn} activeOpacity={0.88}>
          <LinearGradient
            colors={[C.goldLight, C.goldMid, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={mhp.ctaGrad}
          >
            <MaterialCommunityIcons
              name="star-four-points"
              size={14}
              color="#0D0B1A"
              style={{ marginRight: 8 }}
            />
            <Text
              style={[mhp.ctaTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Generate My Travel Muhurta
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
const mhp = StyleSheet.create({
  card: {
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  label: { fontSize: 11, color: C.gold, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 30, color: C.ink, lineHeight: 36 },
  cosmicScore: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.goldPale,
  },
  scoreNum: { fontSize: 26, color: C.goldLight },
  scoreLbl: {
    fontSize: 9,
    color: C.inkMuted,
    textAlign: "center",
    lineHeight: 13,
  },
  dashaRow: {
    flexDirection: "row",
    backgroundColor: C.bgSurface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 20,
  },
  dashaItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  dashaLabel: {
    fontSize: 9,
    color: C.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dashaVal: { fontSize: 16, color: C.ink, marginTop: 4 },
  sectionLabel: {
    fontSize: 13,
    color: C.inkMid,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateAccent: {
    width: 3,
    height: "100%",
    borderRadius: 2,
    minHeight: 44,
    marginRight: 10,
  },
  dateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 0.5,
    minWidth: 64,
    alignItems: "center",
  },
  dateDay: { fontSize: 15 },
  dateDow: { fontSize: 10, color: C.inkMuted, marginTop: 1 },
  dateQuality: { fontSize: 14 },
  dateNote: { fontSize: 11.5, color: C.inkMuted, marginTop: 2 },
  ctaBtn: { marginTop: 20, borderRadius: 22, overflow: "hidden" },
  ctaGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  ctaTxt: { fontSize: 15, color: "#0D0B1A" },
});

// ── 10. Live Temple Intelligence ─────────────────────────────────────────────
function LiveTempleIntelligence({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Live Temple Intelligence"
        sub="Real-time updates"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {LIVE_STATUS.map((t, i) => (
          <View key={i} style={live.card}>
            <LinearGradient
              colors={[C.bgCard, C.bgCardAlt]}
              style={StyleSheet.absoluteFill}
              borderRadius={22}
            />
            {/* Live badge */}
            <View style={live.liveBadge}>
              <View style={live.liveDot} />
              <Text
                style={[
                  live.liveTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                LIVE
              </Text>
            </View>
            <Text
              style={[
                live.templeName,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
              numberOfLines={1}
            >
              {t.temple}
            </Text>
            {/* Crowd meter */}
            <View style={live.row}>
              <View
                style={[live.statusDot, { backgroundColor: t.crowdColor }]}
              />
              <Text
                style={[
                  live.crowdLbl,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Crowd:{" "}
              </Text>
              <Text
                style={[
                  live.crowdVal,
                  { color: t.crowdColor },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {t.crowd}
              </Text>
            </View>
            <View style={live.divider} />
            {[
              { icon: "time-outline", label: "Wait", val: t.wait },
              {
                icon: "partly-sunny-outline",
                label: "Weather",
                val: t.weather,
              },
              {
                icon: "checkmark-circle-outline",
                label: "Status",
                val: t.open ? "Open" : "Closed",
                color: t.open ? C.green : "#FF6B6B",
              },
            ].map((r, j) => (
              <View key={j} style={live.infoRow}>
                <Ionicons name={r.icon} size={13} color={C.inkMuted} />
                <Text
                  style={[
                    live.infoLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {"  "}
                  {r.label}
                </Text>
                <Text
                  style={[
                    live.infoVal,
                    r.color && { color: r.color },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {r.val}
                </Text>
              </View>
            ))}
            {t.festival && (
              <View style={live.festivalTag}>
                <Ionicons name="star" size={10} color={C.gold} />
                <Text
                  style={[
                    live.festivalTxt,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {"  "}
                  {t.festival}
                </Text>
              </View>
            )}
          </View>
        ))}
        {/* Quick action card */}
        <TouchableOpacity activeOpacity={0.88}>
          <LinearGradient
            colors={[C.moonPale, C.moonPale]}
            style={[live.card, live.addCard]}
          >
            <Ionicons name="add-circle-outline" size={32} color={C.moon} />
            <Text
              style={[
                live.addTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              Add Temple Alert
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const live = StyleSheet.create({
  card: {
    width: 186,
    borderRadius: 22,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,60,60,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "rgba(255,60,60,0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF4444",
    marginRight: 5,
  },
  liveTxt: { fontSize: 10, color: "#FF4444", letterSpacing: 1 },
  templeName: { fontSize: 17, color: C.ink, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  statusDot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  crowdLbl: { fontSize: 12.5, color: C.inkMid },
  crowdVal: { fontSize: 12.5 },
  divider: { height: 0.5, backgroundColor: C.divider, marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  infoLabel: { fontSize: 12, color: C.inkMuted, flex: 1 },
  infoVal: { fontSize: 12, color: C.inkMid },
  festivalTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 10,
  },
  festivalTxt: { fontSize: 10.5, color: C.gold },
  addCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderColor: C.moonBorder,
  },
  addTxt: { fontSize: 13, color: C.moon, textAlign: "center" },
});

// ── 11. Spiritual Journey Tracker ────────────────────────────────────────────
function JourneyTracker({ fontsLoaded }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Your Spiritual Journey"
        sub="Sacred milestones & achievements"
        fontsLoaded={fontsLoaded}
      />
      {/* Stats row */}
      <View style={jt.statsRow}>
        {JOURNEY_STATS.map((s, i) => (
          <LinearGradient
            key={i}
            colors={[s.color + "20", s.color + "08"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[jt.statCard, { borderColor: s.color + "44" }]}
          >
            <Ionicons
              name={s.icon}
              size={20}
              color={s.color}
              style={{ marginBottom: 6 }}
            />
            <Text
              style={[
                jt.statVal,
                { color: s.color },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {s.val}
            </Text>
            <Text
              style={[
                jt.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {s.label}
            </Text>
          </LinearGradient>
        ))}
      </View>

      {/* Spiritual score */}
      <LinearGradient colors={["#13112A", "#1C1A3A"]} style={jt.scoreCard}>
        <View>
          <Text
            style={[jt.scoreTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Spiritual Score
          </Text>
          <Text
            style={[jt.scoreSub, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Based on pilgrimages, temples & retreats
          </Text>
          <View style={jt.scoreBarBg}>
            <LinearGradient
              colors={[C.moonLight, C.moon, C.moonDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[jt.scoreBarFill, { width: "62%" }]}
            />
          </View>
          <Text
            style={[jt.scoreNum, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            620{" "}
            <Text style={{ fontSize: 14, color: C.inkMuted }}>
              /1000 Karma Points
            </Text>
          </Text>
        </View>
      </LinearGradient>

      {/* Milestones */}
      <Text
        style={[jt.milestonesTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
      >
        Divine Milestones
      </Text>
      {MILESTONES.map((m, i) => (
        <View key={i} style={[jt.milestone, !m.unlocked && { opacity: 0.45 }]}>
          {m.unlocked ? (
            <LinearGradient
              colors={[C.goldPale, C.goldPale]}
              style={[jt.milestoneIcon, { borderColor: C.goldBorder }]}
            >
              <Text style={{ fontSize: 20 }}>{m.glyph}</Text>
            </LinearGradient>
          ) : (
            <View
              style={[
                jt.milestoneIcon,
                { backgroundColor: C.bgSurface, borderColor: C.border },
              ]}
            >
              <Ionicons name="lock-closed" size={16} color={C.inkMuted} />
            </View>
          )}
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text
              style={[
                jt.milestoneTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {m.title}
            </Text>
            <Text
              style={[
                jt.milestoneDesc,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {m.desc}
            </Text>
          </View>
          {m.unlocked ? (
            <View style={jt.unlockedBadge}>
              <Ionicons name="checkmark" size={12} color="#0D0B1A" />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={16} color={C.inkMuted} />
          )}
        </View>
      ))}
    </View>
  );
}
const jt = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 0.5,
  },
  statVal: { fontSize: 24 },
  statLabel: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  scoreCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  scoreTitle: { fontSize: 20, color: C.ink, marginBottom: 4 },
  scoreSub: { fontSize: 12, color: C.inkMuted, marginBottom: 12 },
  scoreBarBg: {
    height: 6,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  scoreBarFill: { height: 6, borderRadius: 4 },
  scoreNum: { fontSize: 22, color: C.moonLight },
  milestonesTitle: { fontSize: 20, color: C.ink, marginBottom: 14 },
  milestone: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  milestoneTitle: { fontSize: 16, color: C.ink },
  milestoneDesc: { fontSize: 12, color: C.inkMuted, marginTop: 3 },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── Quote Footer ─────────────────────────────────────────────────────────────
function QuoteFooter({ fontsLoaded }) {
  return (
    <View style={qf.wrap}>
      <View style={qf.line} />
      <Text style={[qf.text, fontsLoaded && { fontFamily: SERIF.regular }]}>
        "He who undertakes a pilgrimage with pure intent — the very road becomes
        his teacher."
      </Text>
      <Text style={[qf.src, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
        — Skanda Purana
      </Text>
      <View style={qf.line} />
    </View>
  );
}
const qf = StyleSheet.create({
  wrap: {
    paddingHorizontal: 28,
    paddingVertical: 28,
    marginTop: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: C.goldBorder,
    marginVertical: 16,
  },
  text: {
    fontSize: 19,
    lineHeight: 30,
    color: C.inkMid,
    textAlign: "center",
    fontStyle: "italic",
  },
  src: {
    fontSize: 13,
    color: C.gold,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SpiritualTravel({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection fontsLoaded={fontsLoaded} />
        <AIRecommendations fontsLoaded={fontsLoaded} />
        <PilgrimagePackages fontsLoaded={fontsLoaded} />
        <JyotirlingaExplorer fontsLoaded={fontsLoaded} />
        <SpiritualRetreats fontsLoaded={fontsLoaded} />
        <TempleDiscoveryHub fontsLoaded={fontsLoaded} />
        <AITempleGuide fontsLoaded={fontsLoaded} />
        <InternationalSection fontsLoaded={fontsLoaded} />
        <MuhurtaPlanner fontsLoaded={fontsLoaded} />
        <LiveTempleIntelligence fontsLoaded={fontsLoaded} />
        <JourneyTracker fontsLoaded={fontsLoaded} />
        <QuoteFooter fontsLoaded={fontsLoaded} />
      </ScrollView>
    </View>
  );
}
