/**
 * Nakshatra — PanchangScreen (Module 10 · Panchang Pro)
 *
 * Design language: "Dark Celestial Luxury" — mirrors HomeScreen v5
 * Sections:
 *  1. Hero Date Header — sunrise/sunset arc, city selector, Sanskrit date
 *  2. Panchang Five — Tithi, Vara, Nakshatra, Yoga, Karana with interpretations
 *  3. Rahu Kaal — daily timeline bar with inauspicious slot highlighted
 *  4. Choghadiya — colour-coded auspicious time grid (day + night)
 *  5. Muhurta Planner — AI-assisted event picker
 *  6. Eclipse Calendar — upcoming solar/lunar events
 *  7. Festival Calendar — scrollable month grid with puja guidance
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

// ─── Design Tokens ───────────────────────────────────────────────────────────────
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
  greenBorder: "rgba(52,208,119,0.25)",

  red: "#E84040",
  redPale: "rgba(232,64,64,0.14)",
  redBorder: "rgba(232,64,64,0.28)",

  amber: "#F59E0B",
  amberPale: "rgba(245,158,11,0.13)",
  amberBorder: "rgba(245,158,11,0.28)",

  teal: "#2DD4BF",
  tealPale: "rgba(45,212,191,0.12)",
  tealBorder: "rgba(45,212,191,0.25)",

  border: "rgba(255,255,255,0.07)",
  borderGold: "rgba(212,160,23,0.30)",
  shadow: "rgba(0,0,0,0.55)",
  shadowGold: "rgba(212,160,23,0.25)",
  shadowMoon: "rgba(123,127,232,0.30)",
  divider: "rgba(255,255,255,0.06)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── Panchang Data ────────────────────────────────────────────────────────────────
const TODAY = {
  weekday: "Tuesday",
  date: "9 June 2025",
  samvat: "Vikram Samvat 2082",
  masa: "Jyeshtha Shukla Paksha",
  city: "Mumbai",
  sunrise: "6:03 AM",
  sunset: "7:22 PM",
  sunriseDecimal: 6.05,
  sunsetDecimal: 19.37,
};

const PANCHA = [
  {
    key: "Tithi",
    glyph: "☽",
    value: "Chaturthi",
    number: "4th",
    quality: "Auspicious",
    qualityColor: C.green,
    lord: "Lord Ganesha",
    interpretation:
      "Chaturthi is dedicated to Lord Ganesha, the remover of obstacles. Excellent for prayers to Ganesha, beginning new ventures with his blessings, and resolving disputes. Avoid undertaking work requiring high precision.",
    end: "9:58 PM",
    sanskrit: "चतुर्थी",
  },
  {
    key: "Vara",
    glyph: "♂",
    value: "Mangalavara",
    number: "Tuesday",
    quality: "Active",
    qualityColor: C.red,
    lord: "Mars (Mangala)",
    interpretation:
      "Mangala-vara is ruled by Mars. Energy, courage, and drive are heightened today. Favourable for physical work, bold decisions, and matters of property and land. Avoid initiating legal disputes.",
    end: "All day",
    sanskrit: "मंगलवार",
  },
  {
    key: "Nakshatra",
    glyph: "✦",
    value: "Mrigashira",
    number: "5th",
    quality: "Auspicious",
    qualityColor: C.green,
    lord: "Mars (Mangala)",
    interpretation:
      "Mrigashira, the deer-head nakshatra, bestows curiosity, charm, and gentle restlessness. Excellent for travel, creative pursuits, new searches, and romantic endeavours. The mind is sharp and inquisitive today.",
    end: "7:44 PM",
    sanskrit: "मृगशिरा",
  },
  {
    key: "Yoga",
    glyph: "◎",
    value: "Sadhya",
    number: "22nd",
    quality: "Auspicious",
    qualityColor: C.green,
    lord: "Savitri",
    interpretation:
      "Sadhya Yoga supports accomplishment of goals through steady effort. Activities requiring sustained concentration — study, research, craftsmanship — are especially favoured today.",
    end: "7:19 PM",
    sanskrit: "साध्य",
  },
  {
    key: "Karana",
    glyph: "◑",
    value: "Balava",
    number: "3rd",
    quality: "Auspicious",
    qualityColor: C.green,
    lord: "Indra",
    interpretation:
      "Balava is a Chara (movable) karana governed by Indra. Good for all general activities, travel, and social engagements. Commerce and trade proceed smoothly under this karana.",
    end: "9:58 AM",
    sanskrit: "बालव",
  },
];

// Rahu Kaal: Tuesday Mumbai = 3:00 PM – 4:30 PM
const RAHU_KAAL = {
  start: "3:00 PM",
  end: "4:30 PM",
  startH: 15.0,
  endH: 16.5,
  day: "Tuesday",
  significance:
    "Rahu Kaal is inauspicious for starting new ventures. Avoid signing contracts, travel departure, or puja commencement during this window.",
};

// Choghadiya slots for Tuesday (Mangalavara) — each ~96 min
const CHOGHADIYA_DAY = [
  {
    slot: "6:03 – 7:39",
    name: "Rog",
    type: "Inauspicious",
    color: C.red,
    icon: "close-circle-outline",
    suitable: "Avoid health matters",
  },
  {
    slot: "7:39 – 9:15",
    name: "Udveg",
    type: "Inauspicious",
    color: C.red,
    icon: "warning-outline",
    suitable: "Govt. work only",
  },
  {
    slot: "9:15 – 10:51",
    name: "Char",
    type: "Auspicious",
    color: C.green,
    icon: "checkmark-circle-outline",
    suitable: "Travel, sales",
  },
  {
    slot: "10:51 – 12:27",
    name: "Labh",
    type: "Very Auspicious",
    color: C.goldMid,
    icon: "star-outline",
    suitable: "Business, learning",
  },
  {
    slot: "12:27 – 2:03",
    name: "Amrit",
    type: "Excellent",
    color: C.teal,
    icon: "sparkles-outline",
    suitable: "All activities",
  },
  {
    slot: "2:03 – 3:39",
    name: "Kaal",
    type: "Inauspicious",
    color: C.red,
    icon: "warning-outline",
    suitable: "Avoid new starts",
  },
  {
    slot: "3:39 – 5:15",
    name: "Shubh",
    type: "Auspicious",
    color: C.green,
    icon: "checkmark-circle-outline",
    suitable: "Auspicious ceremonies",
  },
  {
    slot: "5:15 – 7:22",
    name: "Rog",
    type: "Inauspicious",
    color: C.red,
    icon: "close-circle-outline",
    suitable: "Avoid health matters",
  },
];

const CHOGHADIYA_NIGHT = [
  {
    slot: "7:22 – 9:14",
    name: "Kaal",
    type: "Inauspicious",
    color: C.red,
    icon: "warning-outline",
    suitable: "Avoid",
  },
  {
    slot: "9:14 – 11:06",
    name: "Labh",
    type: "Very Auspicious",
    color: C.goldMid,
    icon: "star-outline",
    suitable: "Learning, business",
  },
  {
    slot: "11:06 – 12:58",
    name: "Udveg",
    type: "Inauspicious",
    color: C.red,
    icon: "warning-outline",
    suitable: "Govt. work only",
  },
  {
    slot: "12:58 – 2:50",
    name: "Shubh",
    type: "Auspicious",
    color: C.green,
    icon: "checkmark-circle-outline",
    suitable: "Ceremonies",
  },
  {
    slot: "2:50 – 4:42",
    name: "Amrit",
    type: "Excellent",
    color: C.teal,
    icon: "sparkles-outline",
    suitable: "All activities",
  },
  {
    slot: "4:42 – 6:03",
    name: "Char",
    type: "Auspicious",
    color: C.green,
    icon: "checkmark-circle-outline",
    suitable: "Travel",
  },
];

const MUHURTA_EVENTS = [
  { icon: "diamond-outline", lib: "Ionicons", label: "Wedding", color: C.moon },
  {
    icon: "briefcase-outline",
    lib: "Ionicons",
    label: "Business Launch",
    color: C.gold,
  },
  {
    icon: "home-outline",
    lib: "Ionicons",
    label: "Griha Pravesh",
    color: C.green,
  },
  { icon: "airplane-outline", lib: "Ionicons", label: "Travel", color: C.teal },
  {
    icon: "car-outline",
    lib: "Ionicons",
    label: "Vehicle Purchase",
    color: C.amber,
  },
  {
    icon: "school-outline",
    lib: "Ionicons",
    label: "Vidyarambha",
    color: C.moonLight,
  },
];

const MUHURTA_RESULTS = [
  {
    date: "14 Jun",
    day: "Sat",
    time: "10:21 AM – 12:07 PM",
    quality: "Excellent",
    nakshatra: "Hasta",
    tithi: "Ekadashi",
    color: C.green,
  },
  {
    date: "17 Jun",
    day: "Tue",
    time: "7:45 AM – 9:30 AM",
    quality: "Good",
    nakshatra: "Anuradha",
    tithi: "Chaturdashi",
    color: C.gold,
  },
  {
    date: "22 Jun",
    day: "Sun",
    time: "6:15 AM – 8:00 AM",
    quality: "Auspicious",
    nakshatra: "Pushya",
    tithi: "Purnima",
    color: C.moon,
  },
];

const ECLIPSES = [
  {
    type: "Lunar",
    glyph: "🌑",
    name: "Chandra Grahan",
    date: "7 Sep 2025",
    time: "11:16 PM – 3:14 AM",
    visibility: "Visible in India",
    magnitude: "Partial · 0.82",
    significance:
      "Powerful time for inner reflection and mantra chanting. Avoid food intake 9 hrs prior. Donate sesame & black cloth.",
    colorFrom: "#1A0A3A",
    colorTo: "#4A1080",
    accent: C.moon,
  },
  {
    type: "Solar",
    glyph: "🌞",
    name: "Surya Grahan",
    date: "21 Sep 2025",
    time: "3:58 PM – 7:37 PM",
    visibility: "Not visible in India",
    magnitude: "Annular · 0.95",
    significance:
      "Surya Grahan invokes transformation of career path and ego dissolution. Perform Surya mantras at sunrise on the following day.",
    colorFrom: "#2A1400",
    colorTo: "#7A3A00",
    accent: C.gold,
  },
  {
    type: "Lunar",
    glyph: "🌕",
    name: "Chandra Grahan",
    date: "3 Mar 2026",
    time: "12:02 AM – 5:18 AM",
    visibility: "Fully visible in India",
    magnitude: "Total · 1.18",
    significance:
      "Total lunar eclipse — the most spiritually significant grahan. Ideal for deep meditation, Goddess worship, and ancestral offerings.",
    colorFrom: "#1A0015",
    colorTo: "#5A0035",
    accent: "#E040A0",
  },
];

const FESTIVALS = [
  {
    date: "Jun 11",
    name: "Nirjala Ekadashi",
    type: "Vrat",
    color: C.moon,
    desc: "Most significant Ekadashi — waterless fast",
    glyph: "🪔",
  },
  {
    date: "Jun 14",
    name: "Pradosh Vrat",
    type: "Vrat",
    color: C.gold,
    desc: "Shiva worship at dusk",
    glyph: "🕉️",
  },
  {
    date: "Jun 16",
    name: "Jyeshtha Purnima",
    type: "Festival",
    color: C.green,
    desc: "Full moon — Vata Savitri Vrat for women",
    glyph: "🌕",
  },
  {
    date: "Jun 21",
    name: "Sankashti Chaturthi",
    type: "Vrat",
    color: C.amber,
    desc: "Ganesh fast — moonrise puja at night",
    glyph: "🐘",
  },
  {
    date: "Jun 25",
    name: "Yogini Ekadashi",
    type: "Vrat",
    color: C.moon,
    desc: "Southern fast to ward off sins",
    glyph: "🪔",
  },
  {
    date: "Jul 4",
    name: "Jagannath Rath Yatra",
    type: "Festival",
    color: C.teal,
    desc: "Grand chariot procession of Lord Jagannath",
    glyph: "🎪",
  },
  {
    date: "Jul 10",
    name: "Devshayani Ekadashi",
    type: "Festival",
    color: C.green,
    desc: "Vishnu's sleep begins — Chaturmas starts",
    glyph: "🌙",
  },
  {
    date: "Jul 21",
    name: "Guru Purnima",
    type: "Festival",
    color: C.goldLight,
    desc: "Honour your teachers and spiritual lineage",
    glyph: "🌟",
  },
];

// ─── Icon Helper ────────────────────────────────────────────────────────────────
function Icon({ lib, name, size, color }) {
  if (lib === "MaterialCommunityIcons")
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Section Header ──────────────────────────────────────────────────────────────
function SecHeader({ title, sub, icon, accent = C.gold, fontsLoaded, right }) {
  return (
    <View style={sh.wrap}>
      <View style={sh.left}>
        <View
          style={[
            sh.iconDot,
            { backgroundColor: accent + "22", borderColor: accent + "44" },
          ]}
        >
          <Ionicons name={icon} size={14} color={accent} />
        </View>
        <View>
          <Text style={[sh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
            {title}
          </Text>
          {sub ? (
            <Text
              style={[sh.sub, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {sub}
            </Text>
          ) : null}
        </View>
      </View>
      {right}
    </View>
  );
}
const sh = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 14,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconDot: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, color: C.ink },
  sub: { fontSize: 11.5, color: C.inkMuted, marginTop: 1, letterSpacing: 0.3 },
});

// ─── 1. Hero Date Header ─────────────────────────────────────────────────────────
function HeroHeader({ fontsLoaded, navigation }) {
  const [city, setCity] = useState("Mumbai");
  const cities = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Varanasi",
  ];
  const [cityIdx, setCityIdx] = useState(0);
  const cycleCity = () => {
    const next = (cityIdx + 1) % cities.length;
    setCityIdx(next);
    setCity(cities[next]);
  };

  // Sun arc progress — fraction of day elapsed
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const dayLen = TODAY.sunsetDecimal - TODAY.sunriseDecimal;
  const progress = Math.max(
    0,
    Math.min(1, (nowH - TODAY.sunriseDecimal) / dayLen),
  );
  const arcWidth = width - 36;
  const sunX = 16 + progress * (arcWidth - 16);

  return (
    <LinearGradient
      colors={["#0F0D22", "#1A1545", "#0F0D22"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={hero.wrap}
    >
      {/* Decorative celestial orbs */}
      <View
        style={[
          hero.orb,
          { width: 220, height: 220, top: -90, right: -70, opacity: 0.07 },
        ]}
      />
      <View
        style={[
          hero.orb,
          { width: 100, height: 100, top: 20, left: -30, opacity: 0.05 },
        ]}
      />

      {/* City selector */}
      <TouchableOpacity
        style={hero.cityBtn}
        activeOpacity={0.8}
        onPress={cycleCity}
      >
        <Ionicons name="location-outline" size={13} color={C.gold} />
        <Text
          style={[hero.cityTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          {city}
        </Text>
        <Ionicons name="chevron-down" size={12} color={C.inkMuted} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={hero.calendarTrigger}
        onPress={() => navigation.navigate("Calendar")}
      >
        {/* Sanskrit date row */}
        <Text style={[hero.masa, fontsLoaded && { fontFamily: SERIF.regular }]}>
          {TODAY.masa}
        </Text>

        {/* Main date */}
        <Text style={[hero.weekday, fontsLoaded && { fontFamily: SERIF.bold }]}>
          {TODAY.weekday}
        </Text>

        <Text style={[hero.date, fontsLoaded && { fontFamily: SERIF.regular }]}>
          {TODAY.date}
        </Text>

        <Text
          style={[hero.samvat, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {TODAY.samvat}
        </Text>

        <View style={hero.calendarHint}>
          <Ionicons name="calendar-outline" size={14} color={C.gold} />
          <Text
            style={[
              hero.calendarHintText,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            Open Panchang Calendar
          </Text>
        </View>
      </TouchableOpacity>
      {/* Sun Arc */}
      <View style={hero.arcWrap}>
        {/* Arc track */}
        <View style={hero.arcTrack} />
        {/* Elapsed filled line */}
        <View style={[hero.arcFill, { width: progress * (arcWidth - 16) }]} />
        {/* Moving sun dot */}
        <View style={[hero.sunDot, { left: sunX - 10 }]}>
          <LinearGradient
            colors={[C.goldLight, C.gold]}
            style={hero.sunDotGrad}
          >
            <Text style={{ fontSize: 10 }}>☀️</Text>
          </LinearGradient>
        </View>
        {/* Sunrise / Sunset labels */}
        <View style={hero.arcLabels}>
          <View style={hero.arcLabelItem}>
            <Ionicons name="sunny-outline" size={11} color={C.goldMid} />
            <Text
              style={[
                hero.arcLabelTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {" "}
              {TODAY.sunrise}
            </Text>
          </View>
          <View style={hero.arcLabelItem}>
            <Ionicons name="moon-outline" size={11} color={C.moon} />
            <Text
              style={[
                hero.arcLabelTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {" "}
              {TODAY.sunset}
            </Text>
          </View>
        </View>
      </View>

      {/* Gold shimmer line */}
      <LinearGradient
        colors={["transparent", C.goldBorder, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={hero.shimmer}
      />
    </LinearGradient>
  );
}
const hero = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "android" ? 48 : 60,
    paddingBottom: 26,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
    position: "relative",
    overflow: "hidden",
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  cityBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: C.goldPale,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    marginBottom: 16,
  },
  cityTxt: { fontSize: 13, color: C.gold },
  masa: {
    fontSize: 13,
    color: C.inkMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  weekday: { fontSize: 54, color: C.ink, lineHeight: 56, letterSpacing: -0.5 },
  date: { fontSize: 17, color: C.inkMid, marginTop: 2 },
  samvat: {
    fontSize: 12,
    color: C.inkMuted,
    marginTop: 4,
    letterSpacing: 0.8,
    marginBottom: 22,
  },

  arcWrap: { position: "relative", marginTop: 4, height: 36 },
  arcTrack: {
    position: "absolute",
    top: 11,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: C.border,
    borderRadius: 2,
  },
  arcFill: {
    position: "absolute",
    top: 11,
    left: 0,
    height: 2,
    backgroundColor: C.goldMid,
    borderRadius: 2,
    opacity: 0.7,
  },
  sunDot: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  sunDotGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
  arcLabels: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arcLabelItem: { flexDirection: "row", alignItems: "center" },
  arcLabelTxt: { fontSize: 11, color: C.inkMuted },
  shimmer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 1 },
  calendarTrigger: {
    alignSelf: "stretch",
  },

  calendarHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,168,76,0.08)",
    borderWidth: 1,
    borderColor: C.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  calendarHintText: {
    fontSize: 11,
    color: C.gold,
  },
});

// ─── 2. Panchang Five ────────────────────────────────────────────────────────────
function PanchangFive({ fontsLoaded }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <View style={pf.wrap}>
      <SecHeader
        title="Panchang"
        sub="Five sacred elements of today"
        icon="moon-outline"
        accent={C.moon}
        fontsLoaded={fontsLoaded}
      />
      {PANCHA.map((p, i) => {
        const isOpen = expanded === i;
        return (
          <TouchableOpacity
            key={i}
            style={[pf.card, isOpen && pf.cardOpen]}
            activeOpacity={0.88}
            onPress={() => setExpanded(isOpen ? null : i)}
          >
            {/* Accent left bar */}
            <View style={[pf.accentBar, { backgroundColor: p.qualityColor }]} />

            <View style={pf.cardMain}>
              {/* Glyph */}
              <View
                style={[
                  pf.glyphWrap,
                  {
                    backgroundColor: p.qualityColor + "18",
                    borderColor: p.qualityColor + "40",
                  },
                ]}
              >
                <Text style={pf.glyph}>{p.glyph}</Text>
              </View>

              <View style={pf.cardMid}>
                {/* Key + Sanskrit */}
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={[
                      pf.key,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {p.key}
                  </Text>
                  <Text
                    style={[
                      pf.sanskrit,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {p.sanskrit}
                  </Text>
                </View>
                <Text
                  style={[pf.value, fontsLoaded && { fontFamily: SERIF.bold }]}
                >
                  {p.value}
                </Text>
                <View style={pf.metaRow}>
                  <Text
                    style={[
                      pf.lord,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {p.lord}
                  </Text>
                  <View
                    style={[
                      pf.qualBadge,
                      {
                        backgroundColor: p.qualityColor + "20",
                        borderColor: p.qualityColor + "45",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        pf.qualTxt,
                        { color: p.qualityColor },
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      {p.quality}
                    </Text>
                  </View>
                </View>
              </View>

              {/* End time + chevron */}
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={pf.endTimePill}>
                  <Ionicons name="time-outline" size={10} color={C.inkMuted} />
                  <Text
                    style={[
                      pf.endTime,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    Ends {p.end}
                  </Text>
                </View>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={C.inkMuted}
                />
              </View>
            </View>

            {/* Expandable interpretation */}
            {isOpen && (
              <View style={pf.interpretation}>
                <View
                  style={[pf.interpLine, { backgroundColor: p.qualityColor }]}
                />
                <Text
                  style={[
                    pf.interpText,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {p.interpretation}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const pf = StyleSheet.create({
  wrap: { paddingHorizontal: 16 },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
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
  cardOpen: { borderColor: C.moonBorder },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingLeft: 18,
    gap: 12,
  },
  glyphWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  glyph: { fontSize: 22 },
  cardMid: { flex: 1, gap: 3 },
  key: {
    fontSize: 11,
    color: C.inkMuted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sanskrit: { fontSize: 14, color: C.inkMuted },
  value: { fontSize: 22, color: C.ink },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  lord: { fontSize: 12, color: C.inkMuted },
  qualBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  qualTxt: { fontSize: 11 },
  endTimePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgSurface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  endTime: { fontSize: 10.5, color: C.inkMuted },
  interpretation: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    paddingTop: 4,
    flexDirection: "row",
    gap: 12,
  },
  interpLine: { width: 2, borderRadius: 2, opacity: 0.7 },
  interpText: { fontSize: 14, color: C.inkMid, lineHeight: 22, flex: 1 },
});

// ─── 3. Rahu Kaal ────────────────────────────────────────────────────────────────
function RahuKaal({ fontsLoaded }) {
  const [notifOn, setNotifOn] = useState(false);
  const totalDayMins = (TODAY.sunsetDecimal - TODAY.sunriseDecimal) * 60;
  const rahuStartMins = (RAHU_KAAL.startH - TODAY.sunriseDecimal) * 60;
  const rahuDurMins = (RAHU_KAAL.endH - RAHU_KAAL.startH) * 60;
  const leftPct = rahuStartMins / totalDayMins;
  const widthPct = rahuDurMins / totalDayMins;

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Rahu Kaal"
        sub="Inauspicious window — avoid new starts"
        icon="warning-outline"
        accent={C.red}
        fontsLoaded={fontsLoaded}
        right={
          <TouchableOpacity
            style={[rk.notifBtn, notifOn && rk.notifBtnOn]}
            onPress={() => setNotifOn((v) => !v)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={notifOn ? "notifications" : "notifications-outline"}
              size={14}
              color={notifOn ? C.red : C.inkMuted}
            />
            <Text
              style={[
                rk.notifTxt,
                notifOn && { color: C.red },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {notifOn ? "On" : "Notify"}
            </Text>
          </TouchableOpacity>
        }
      />

      <View style={rk.card}>
        {/* Time display */}
        <View style={rk.timeRow}>
          <View style={rk.timeBlock}>
            <Text
              style={[
                rk.timeLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Starts
            </Text>
            <Text
              style={[rk.timeVal, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {RAHU_KAAL.start}
            </Text>
          </View>
          <View style={rk.timeDivide}>
            <View style={rk.timeDivideLine} />
            <View style={[rk.rahupill]}>
              <Text style={rk.rahuGlyph}>☿</Text>
            </View>
            <View style={rk.timeDivideLine} />
          </View>
          <View style={[rk.timeBlock, { alignItems: "flex-end" }]}>
            <Text
              style={[
                rk.timeLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Ends
            </Text>
            <Text
              style={[rk.timeVal, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {RAHU_KAAL.end}
            </Text>
          </View>
        </View>

        {/* Timeline bar */}
        <View style={rk.barWrap}>
          <View style={rk.barTrack} />
          {/* Rahu Kaal highlighted segment */}
          <View
            style={[
              rk.barSegment,
              {
                left: `${(leftPct * 100).toFixed(1)}%`,
                width: `${(widthPct * 100).toFixed(1)}%`,
              },
            ]}
          />
          {/* Sunrise marker */}
          <View style={[rk.barMarker, { left: 0 }]}>
            <Ionicons name="sunny" size={10} color={C.gold} />
          </View>
          {/* Sunset marker */}
          <View style={[rk.barMarker, { right: 0, left: undefined }]}>
            <Ionicons name="moon" size={10} color={C.moon} />
          </View>
        </View>

        <View style={rk.barLabels}>
          <Text
            style={[rk.barLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {TODAY.sunrise}
          </Text>
          <Text
            style={[
              rk.barLabel,
              { color: C.red },
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {RAHU_KAAL.start} – {RAHU_KAAL.end}
          </Text>
          <Text
            style={[rk.barLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {TODAY.sunset}
          </Text>
        </View>

        {/* Significance */}
        <View style={rk.significance}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={C.inkMuted}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
          <Text
            style={[rk.sigText, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {RAHU_KAAL.significance}
          </Text>
        </View>
      </View>
    </View>
  );
}
const rk = StyleSheet.create({
  notifBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
  },
  notifBtnOn: { borderColor: C.redBorder, backgroundColor: C.redPale },
  notifTxt: { fontSize: 12, color: C.inkMuted },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.redBorder,
    shadowColor: "rgba(232,64,64,0.20)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  timeRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  timeBlock: { flex: 1 },
  timeLabel: {
    fontSize: 11,
    color: C.inkMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timeVal: { fontSize: 28, color: C.ink, marginTop: 2 },
  timeDivide: { alignItems: "center", gap: 4, paddingHorizontal: 12 },
  timeDivideLine: { flex: 1, height: 1, width: 1, backgroundColor: C.divider },
  rahupill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.redPale,
    borderWidth: 1,
    borderColor: C.redBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  rahuGlyph: { fontSize: 16 },
  barWrap: {
    height: 20,
    position: "relative",
    justifyContent: "center",
    marginBottom: 6,
  },
  barTrack: {
    height: 6,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    position: "absolute",
    left: 0,
    right: 0,
  },
  barSegment: {
    position: "absolute",
    height: 6,
    backgroundColor: C.red,
    borderRadius: 3,
    opacity: 0.85,
  },
  barMarker: { position: "absolute", top: 1 },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  barLabel: { fontSize: 10.5, color: C.inkMuted },
  significance: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: C.bgSurface,
    borderRadius: 14,
    padding: 12,
  },
  sigText: { fontSize: 13, color: C.inkMid, lineHeight: 20, flex: 1 },
});

// ─── 4. Choghadiya ───────────────────────────────────────────────────────────────
function Choghadiya({ fontsLoaded }) {
  const [tab, setTab] = useState(0);
  const slots = tab === 0 ? CHOGHADIYA_DAY : CHOGHADIYA_NIGHT;

  // Determine current slot index (daytime only)
  const now = new Date();
  const nowH = now.getHours() + now.getMinutes() / 60;
  const currentIdx =
    tab === 0
      ? Math.min(
          Math.floor((nowH - TODAY.sunriseDecimal) / 1.6),
          CHOGHADIYA_DAY.length - 1,
        )
      : -1;

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Choghadiya"
        sub="Auspicious time slots for activities"
        icon="time-outline"
        accent={C.teal}
        fontsLoaded={fontsLoaded}
      />

      {/* Day / Night tabs */}
      <View style={cg.tabRow}>
        {["Day", "Night"].map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[cg.tab, tab === i && cg.tabActive]}
            onPress={() => setTab(i)}
            activeOpacity={0.8}
          >
            {tab === i && (
              <LinearGradient
                colors={[C.teal + "30", C.teal + "08"]}
                style={StyleSheet.absoluteFill}
                borderRadius={14}
              />
            )}
            <Ionicons
              name={i === 0 ? "sunny-outline" : "moon-outline"}
              size={13}
              color={tab === i ? C.teal : C.inkMuted}
            />
            <Text
              style={[
                cg.tabTxt,
                tab === i && { color: C.teal },
                fontsLoaded && {
                  fontFamily: tab === i ? SERIF.semiBold : SERIF.regular,
                },
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Slots */}
      {slots.map((sl, i) => {
        const isCurrent = i === currentIdx;
        return (
          <View key={i} style={[cg.slotRow, isCurrent && cg.slotRowCurrent]}>
            {isCurrent && (
              <View style={[cg.currentPulse, { backgroundColor: sl.color }]} />
            )}
            <View style={[cg.colorDot, { backgroundColor: sl.color }]} />
            <View style={cg.slotMid}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text
                  style={[
                    cg.slotName,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {sl.name}
                </Text>
                {isCurrent && (
                  <View style={cg.nowBadge}>
                    <Text
                      style={[
                        cg.nowTxt,
                        fontsLoaded && { fontFamily: SERIF.bold },
                      ]}
                    >
                      NOW
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  cg.slotSuitable,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {sl.suitable}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <Text
                style={[
                  cg.slotTime,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {sl.slot}
              </Text>
              <View
                style={[
                  cg.typePill,
                  {
                    backgroundColor: sl.color + "20",
                    borderColor: sl.color + "45",
                  },
                ]}
              >
                <Text
                  style={[
                    cg.typeTxt,
                    { color: sl.color },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {sl.type}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
const cg = StyleSheet.create({
  tabRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  tabActive: { borderColor: C.tealBorder },
  tabTxt: { fontSize: 14, color: C.inkMuted },

  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: C.border,
    gap: 12,
    position: "relative",
    overflow: "hidden",
  },
  slotRowCurrent: { borderColor: C.tealBorder },
  currentPulse: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  slotMid: { flex: 1 },
  slotName: { fontSize: 17, color: C.ink },
  slotSuitable: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  slotTime: { fontSize: 12.5, color: C.inkMid },
  typePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    alignSelf: "flex-end",
  },
  typeTxt: { fontSize: 10.5 },
  nowBadge: {
    backgroundColor: C.teal + "30",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
  },
  nowTxt: { fontSize: 9.5, color: C.teal, letterSpacing: 1 },
});

// ─── 5. Muhurta Planner ──────────────────────────────────────────────────────────
function MuhurtaPlanner({ fontsLoaded }) {
  const [selected, setSelected] = useState(0);
  const [showResults, setShowResults] = useState(false);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Muhurta Planner"
        sub="AI-assisted auspicious timing"
        icon="sparkles-outline"
        accent={C.gold}
        fontsLoaded={fontsLoaded}
        right={
          <View style={mp.aiBadge}>
            <MaterialCommunityIcons
              name="crystal-ball"
              size={12}
              color={C.moonLight}
            />
            <Text
              style={[mp.aiTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
            >
              {" "}
              AI
            </Text>
          </View>
        }
      />

      {/* Event type grid */}
      <View style={mp.eventGrid}>
        {MUHURTA_EVENTS.map((ev, i) => (
          <TouchableOpacity
            key={i}
            style={[mp.eventCard, selected === i && mp.eventCardActive]}
            activeOpacity={0.82}
            onPress={() => {
              setSelected(i);
              setShowResults(false);
            }}
          >
            {selected === i && (
              <LinearGradient
                colors={[ev.color + "28", "transparent"]}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
            )}
            <View
              style={[
                mp.eventIcon,
                {
                  backgroundColor: ev.color + "20",
                  borderColor: ev.color + "45",
                },
                selected === i && { backgroundColor: ev.color + "35" },
              ]}
            >
              <Icon
                lib={ev.lib}
                name={ev.icon}
                size={18}
                color={selected === i ? ev.color : C.inkMuted}
              />
            </View>
            <Text
              style={[
                mp.eventLabel,
                selected === i && { color: ev.color },
                fontsLoaded && {
                  fontFamily: selected === i ? SERIF.semiBold : SERIF.regular,
                },
              ]}
              numberOfLines={2}
            >
              {ev.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={mp.findBtn}
        activeOpacity={0.88}
        onPress={() => setShowResults(true)}
      >
        <LinearGradient
          colors={[C.goldLight, C.goldMid, C.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={mp.findBtnGrad}
        >
          <MaterialCommunityIcons
            name="crystal-ball"
            size={16}
            color="#0D0B1A"
          />
          <Text
            style={[mp.findBtnTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Find Best Muhurtas for {MUHURTA_EVENTS[selected].label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Results */}
      {showResults && (
        <View style={mp.results}>
          <Text
            style={[
              mp.resultsTitle,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Top muhurtas in next 30 days
          </Text>
          {MUHURTA_RESULTS.map((r, i) => (
            <View key={i} style={mp.resultRow}>
              <LinearGradient
                colors={[r.color + "28", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <View style={[mp.resultAccent, { backgroundColor: r.color }]} />
              <View style={mp.resultDate}>
                <Text
                  style={[
                    mp.resultDateNum,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {r.date}
                </Text>
                <Text
                  style={[
                    mp.resultDay,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {r.day}
                </Text>
              </View>
              <View style={mp.resultMid}>
                <Text
                  style={[
                    mp.resultTime,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {r.time}
                </Text>
                <Text
                  style={[
                    mp.resultMeta,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {r.nakshatra} · {r.tithi}
                </Text>
              </View>
              <View
                style={[
                  mp.resultQual,
                  {
                    backgroundColor: r.color + "22",
                    borderColor: r.color + "45",
                  },
                ]}
              >
                <Text
                  style={[
                    mp.resultQualTxt,
                    { color: r.color },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {r.quality}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const mp = StyleSheet.create({
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  aiTxt: { fontSize: 12, color: C.moonLight },
  eventGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  eventCard: {
    width: (width - 32 - 20) / 3,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 8,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  eventCardActive: { borderColor: C.goldBorder },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: {
    fontSize: 12.5,
    color: C.inkMuted,
    textAlign: "center",
    lineHeight: 16,
  },
  findBtn: { borderRadius: 18, overflow: "hidden", marginBottom: 4 },
  findBtnGrad: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  findBtnTxt: { fontSize: 14, color: "#0D0B1A" },
  results: { marginTop: 14, gap: 8 },
  resultsTitle: {
    fontSize: 13,
    color: C.inkMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    gap: 12,
    overflow: "hidden",
    position: "relative",
  },
  resultAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  resultDate: { alignItems: "center", width: 42 },
  resultDateNum: { fontSize: 18, color: C.ink },
  resultDay: { fontSize: 11, color: C.inkMuted },
  resultMid: { flex: 1, gap: 3 },
  resultTime: { fontSize: 14, color: C.ink },
  resultMeta: { fontSize: 11.5, color: C.inkMuted },
  resultQual: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    alignSelf: "center",
  },
  resultQualTxt: { fontSize: 11.5 },
});

// ─── 6. Eclipse Calendar ─────────────────────────────────────────────────────────
function EclipseCalendar({ fontsLoaded }) {
  const [open, setOpen] = useState(0);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Eclipse Calendar"
        sub="Grahan — solar & lunar cycles"
        icon="eye-outline"
        accent={C.moon}
        fontsLoaded={fontsLoaded}
      />
      {ECLIPSES.map((ec, i) => (
        <TouchableOpacity
          key={i}
          activeOpacity={0.88}
          onPress={() => setOpen(open === i ? -1 : i)}
        >
          <LinearGradient
            colors={[ec.colorFrom, ec.colorTo, ec.colorFrom]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[ec_s.card, { borderColor: ec.accent + "40" }]}
          >
            {/* Glow orb */}
            <View style={[ec_s.orb, { backgroundColor: ec.accent }]} />

            <View style={ec_s.cardTop}>
              <Text style={ec_s.glyph}>{ec.glyph}</Text>
              <View style={ec_s.topMid}>
                <View
                  style={[
                    ec_s.typePill,
                    {
                      backgroundColor: ec.accent + "30",
                      borderColor: ec.accent + "55",
                    },
                  ]}
                >
                  <Text
                    style={[
                      ec_s.typeStr,
                      { color: ec.accent },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {ec.type} Eclipse
                  </Text>
                </View>
                <Text
                  style={[ec_s.name, fontsLoaded && { fontFamily: SERIF.bold }]}
                >
                  {ec.name}
                </Text>
                <Text
                  style={[
                    ec_s.date,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {ec.date}
                </Text>
              </View>
              <Ionicons
                name={open === i ? "chevron-up" : "chevron-down"}
                size={16}
                color="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={ec_s.metaRow}>
              <View style={ec_s.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={11}
                  color="rgba(255,255,255,0.5)"
                />
                <Text
                  style={[
                    ec_s.metaTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {" "}
                  {ec.time}
                </Text>
              </View>
              <View style={ec_s.metaDot} />
              <View style={ec_s.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={11}
                  color="rgba(255,255,255,0.5)"
                />
                <Text
                  style={[
                    ec_s.metaTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {" "}
                  {ec.visibility}
                </Text>
              </View>
              <View style={ec_s.metaDot} />
              <Text
                style={[
                  ec_s.metaTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {ec.magnitude}
              </Text>
            </View>

            {open === i && (
              <View style={ec_s.significance}>
                <View style={[ec_s.sigLine, { backgroundColor: ec.accent }]} />
                <Text
                  style={[
                    ec_s.sigTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {ec.significance}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const ec_s = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 0.5,
    overflow: "hidden",
    position: "relative",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 5,
  },
  orb: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    opacity: 0.08,
    top: -50,
    right: -30,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  glyph: { fontSize: 36 },
  topMid: { flex: 1, gap: 4 },
  typePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  typeStr: { fontSize: 10.5, letterSpacing: 0.5 },
  name: { fontSize: 22, color: "#FFF" },
  date: { fontSize: 13, color: "rgba(255,255,255,0.65)" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaTxt: { fontSize: 11.5, color: "rgba(255,255,255,0.60)" },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  significance: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    padding: 12,
  },
  sigLine: { width: 2, borderRadius: 2, opacity: 0.75 },
  sigTxt: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.80)",
    lineHeight: 21,
    flex: 1,
  },
});

// ─── 7. Festival Calendar ────────────────────────────────────────────────────────
function FestivalCalendar({ fontsLoaded }) {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Festival Calendar"
        sub="100+ Hindu festivals & vrats"
        icon="calendar-outline"
        accent={C.goldMid}
        fontsLoaded={fontsLoaded}
        right={
          <TouchableOpacity style={fc.filterBtn} activeOpacity={0.8}>
            <Ionicons name="funnel-outline" size={13} color={C.inkMuted} />
            <Text
              style={[
                fc.filterTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Filter
            </Text>
          </TouchableOpacity>
        }
      />

      {FESTIVALS.map((f, i) => {
        const isOpen = activeIdx === i;
        return (
          <TouchableOpacity
            key={i}
            style={[fc.festCard, isOpen && { borderColor: f.color + "50" }]}
            activeOpacity={0.86}
            onPress={() => setActiveIdx(isOpen ? null : i)}
          >
            {/* Top color bar */}
            <View style={[fc.topBar, { backgroundColor: f.color }]} />

            <View style={fc.festRow}>
              {/* Glyph + date column */}
              <View
                style={[
                  fc.dateCol,
                  {
                    backgroundColor: f.color + "18",
                    borderColor: f.color + "40",
                  },
                ]}
              >
                <Text style={fc.festGlyph}>{f.glyph}</Text>
                <Text
                  style={[
                    fc.festDateTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {f.date}
                </Text>
              </View>

              <View style={fc.festMid}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={[
                      fc.festName,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    {f.name}
                  </Text>
                  <View
                    style={[
                      fc.festTypePill,
                      {
                        backgroundColor: f.color + "22",
                        borderColor: f.color + "44",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        fc.festType,
                        { color: f.color },
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      {f.type}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    fc.festDesc,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {f.desc}
                </Text>
              </View>

              <Ionicons
                name={isOpen ? "chevron-up" : "chevron-down"}
                size={15}
                color={C.inkMuted}
              />
            </View>

            {isOpen && (
              <View style={fc.festDetail}>
                <LinearGradient
                  colors={[f.color + "18", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={14}
                />
                {/* Puja guidance */}
                <Text
                  style={[
                    fc.detailHead,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  Puja Guidance
                </Text>
                <Text
                  style={[
                    fc.detailBody,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {f.type === "Vrat"
                    ? `Begin fast at sunrise. Perform puja with fresh flowers and ghee lamp. Chant relevant mantras 108 times. Break fast after sighting the moon or at the specified end time.`
                    : `Decorate the home with flowers and diyas. Perform the main puja at the auspicious muhurta. Distribute prasad to family and community.`}
                </Text>

                {/* Product recommendations chips */}
                <Text
                  style={[
                    fc.detailHead,
                    { marginTop: 12 },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  Puja Items
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={fc.itemsScroll}
                >
                  {[
                    "Ghee Lamp",
                    "Incense",
                    "Flowers",
                    "Prasad Kit",
                    "Sacred Thread",
                  ].map((item, j) => (
                    <TouchableOpacity
                      key={j}
                      style={[fc.itemChip, { borderColor: f.color + "50" }]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          fc.itemTxt,
                          { color: f.color },
                          fontsLoaded && { fontFamily: SERIF.semiBold },
                        ]}
                      >
                        {item}
                      </Text>
                      <Ionicons
                        name="cart-outline"
                        size={11}
                        color={f.color}
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Set reminder */}
                <TouchableOpacity
                  style={[
                    fc.reminderBtn,
                    {
                      borderColor: f.color + "55",
                      backgroundColor: f.color + "14",
                    },
                  ]}
                  activeOpacity={0.82}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={14}
                    color={f.color}
                  />
                  <Text
                    style={[
                      fc.reminderTxt,
                      { color: f.color },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    Set Reminder
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* View all button */}
      <TouchableOpacity style={fc.viewAllBtn} activeOpacity={0.85}>
        <LinearGradient
          colors={[C.goldPale, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={fc.viewAllGrad}
        >
          <Text
            style={[
              fc.viewAllTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            View All 100+ Festivals
          </Text>
          <Ionicons name="arrow-forward" size={14} color={C.gold} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
const fc = StyleSheet.create({
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
  },
  filterTxt: { fontSize: 12, color: C.inkMuted },
  festCard: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
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
  topBar: { height: 2.5, opacity: 0.7 },
  festRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  dateCol: {
    width: 58,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
    flexShrink: 0,
  },
  festGlyph: { fontSize: 20 },
  festDateTxt: { fontSize: 12.5, color: C.ink },
  festMid: { flex: 1, gap: 4 },
  festName: { fontSize: 17, color: C.ink, flexShrink: 1 },
  festTypePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    flexShrink: 0,
  },
  festType: { fontSize: 10.5 },
  festDesc: { fontSize: 12.5, color: C.inkMuted, lineHeight: 17 },
  festDetail: {
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    position: "relative",
  },
  detailHead: {
    fontSize: 12,
    color: C.gold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  detailBody: { fontSize: 13.5, color: C.inkMid, lineHeight: 21 },
  itemsScroll: { gap: 8, paddingBottom: 2 },
  itemChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 0.5,
    backgroundColor: C.bgSurface,
  },
  itemTxt: { fontSize: 12 },
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 0.5,
    marginTop: 12,
  },
  reminderTxt: { fontSize: 13 },
  viewAllBtn: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 8,
  },
  viewAllGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  viewAllTxt: { fontSize: 14, color: C.gold },
});

// ─── Quote Footer ────────────────────────────────────────────────────────────────
function QuoteFooter({ fontsLoaded }) {
  return (
    <View style={qf.wrap}>
      <View style={qf.line} />
      <Text style={[qf.text, fontsLoaded && { fontFamily: SERIF.regular }]}>
        "Time is the substance of which I am made. Time is a river which carries
        me along, but I am the river."
      </Text>
      <Text style={[qf.src, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
        — Surya Siddhanta
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
    alignItems: "center",
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: C.goldBorder,
    marginVertical: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 29,
    color: C.inkMid,
    textAlign: "center",
    fontStyle: "italic",
  },
  src: {
    fontSize: 12.5,
    color: C.gold,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});

// ─── Top Nav ─────────────────────────────────────────────────────────────────────
function TopNav({ fontsLoaded, navigation }) {
  return (
    <View style={tn.wrap}>
      <TouchableOpacity
        style={tn.backBtn}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={20} color={C.inkMid} />
      </TouchableOpacity>
      <View style={tn.center}>
        <Text style={[tn.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Panchang Pro
        </Text>
        <Text style={[tn.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Daily Hindu Almanac
        </Text>
      </View>
      <TouchableOpacity style={tn.shareBtn} activeOpacity={0.8}>
        <Ionicons name="share-outline" size={18} color={C.inkMid} />
      </TouchableOpacity>
    </View>
  );
}
const tn = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 42 : 56,
    paddingBottom: 10,
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center" },
  title: { fontSize: 20, color: C.ink },
  sub: { fontSize: 10.5, color: C.inkMuted, letterSpacing: 1, marginTop: 1 },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Section Navigation Pills ────────────────────────────────────────────────────
const SECTIONS = [
  { label: "Panchang", icon: "moon-outline" },
  { label: "Rahu Kaal", icon: "warning-outline" },
  { label: "Choghadiya", icon: "time-outline" },
  { label: "Muhurta", icon: "sparkles-outline" },
  { label: "Eclipse", icon: "eye-outline" },
  { label: "Festivals", icon: "calendar-outline" },
];

function SectionNav({ active, setActive, fontsLoaded }) {
  return (
    <View style={sn.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sn.scroll}
      >
        {SECTIONS.map((sec, i) => (
          <TouchableOpacity
            key={i}
            style={[sn.pill, active === i && sn.pillActive]}
            onPress={() => setActive(i)}
            activeOpacity={0.82}
          >
            {active === i && (
              <LinearGradient
                colors={[C.goldMid + "35", C.gold + "15"]}
                style={StyleSheet.absoluteFill}
                borderRadius={20}
              />
            )}
            <Ionicons
              name={sec.icon}
              size={13}
              color={active === i ? C.gold : C.inkMuted}
            />
            <Text
              style={[
                sn.pillTxt,
                active === i && sn.pillTxtActive,
                fontsLoaded && {
                  fontFamily: active === i ? SERIF.semiBold : SERIF.regular,
                },
              ]}
            >
              {sec.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const sn = StyleSheet.create({
  wrap: {
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  scroll: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  pillActive: { borderColor: C.goldBorder },
  pillTxt: { fontSize: 13, color: C.inkMuted },
  pillTxtActive: { color: C.gold },
});

// ─── Main ─────────────────────────────────────────────────────────────────────────
export default function PanchangScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const [activeSection, setActiveSection] = useState(0);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} navigation={navigation} />
      <SectionNav
        active={activeSection}
        setActive={setActiveSection}
        fontsLoaded={fontsLoaded}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero always visible */}
        <HeroHeader fontsLoaded={fontsLoaded} navigation={navigation} />

        {/* Conditionally render sections based on activeSection, but show all on "0" */}
        {(activeSection === 0 || activeSection === 0) && (
          <PanchangFive fontsLoaded={fontsLoaded} />
        )}
        {(activeSection === 0 || activeSection === 1) && (
          <>
            <View style={{ height: activeSection === 1 ? 0 : 8 }} />
            <RahuKaal fontsLoaded={fontsLoaded} />
          </>
        )}
        {(activeSection === 0 || activeSection === 2) && (
          <Choghadiya fontsLoaded={fontsLoaded} />
        )}
        {(activeSection === 0 || activeSection === 3) && (
          <MuhurtaPlanner fontsLoaded={fontsLoaded} />
        )}
        {(activeSection === 0 || activeSection === 4) && (
          <EclipseCalendar fontsLoaded={fontsLoaded} />
        )}
        {(activeSection === 0 || activeSection === 5) && (
          <FestivalCalendar fontsLoaded={fontsLoaded} />
        )}

        <QuoteFooter fontsLoaded={fontsLoaded} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
