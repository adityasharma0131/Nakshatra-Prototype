/**
 * Nakshatra — NakshatraProfile.jsx
 * User Profile Screen
 *
 * Sections:
 *  1. Hero Header — zodiac banner with avatar, name, rashi & nakshatra
 *  2. Birth Details Card — date, time, place, ascendant
 *  3. Planetary Snapshot — compact planet positions grid
 *  4. Active Dasha Strip — current mahadasha + antardasha timeline
 *  5. Saved Insights — bookmarked video insights
 *  6. My Video Library shortcut — recent videos
 *  7. Compatibility score tease
 *  8. Settings / account rows
 *  9. Edit Profile bottom sheet
 * 10. Sign-out confirm sheet
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  StatusBar,
  Platform,
  Modal,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";

const { width, height } = Dimensions.get("window");

// ── Design tokens (identical to Nakshatra system) ─────────────────────────────
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
  teal: "#2DD4BF",
  tealPale: "rgba(45,212,191,0.12)",
  tealBorder: "rgba(45,212,191,0.25)",
  rose: "#F472B6",
  rosePale: "rgba(244,114,182,0.12)",
  roseBorder: "rgba(244,114,182,0.25)",
  border: "rgba(255,255,255,0.07)",
  shadow: "rgba(0,0,0,0.50)",
  shadowGold: "rgba(212,160,23,0.25)",
  shadowMoon: "rgba(123,127,232,0.30)",
  divider: "rgba(255,255,255,0.06)",
  red: "#F87171",
  redPale: "rgba(248,113,113,0.12)",
  redBorder: "rgba(248,113,113,0.25)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ── Seed data ─────────────────────────────────────────────────────────────────
const USER = {
  name: "Arjun Mehta",
  handle: "@arjun.nakshatra",
  avatar: null, // no image — we render initials
  initials: "AM",
  rashi: "Vrishabha",
  rashiEn: "Taurus",
  rashiGlyph: "♉",
  nakshatra: "Rohini",
  pada: "2nd Pada",
  ascendant: "Dhanu (Sagittarius)",
  ascendantGlyph: "♐",
  birthDate: "14 May 1993",
  birthTime: "07:32 AM",
  birthPlace: "Mumbai, Maharashtra",
  sunSign: "Vrishabha ♉",
  currentDasha: "Jupiter",
  dashaGlyph: "♃",
  dashaStart: "Oct 2019",
  dashaEnd: "Oct 2035",
  dashaProgress: 0.38,
  antardasha: "Saturn",
  antardashaEnd: "Apr 2026",
  videosWatched: 28,
  insightsSaved: 14,
  daysStreak: 9,
};

const PLANETS = [
  { name: "Sun", glyph: "☉", sign: "Taurus", house: "5th", state: "Own", accent: C.gold },
  { name: "Moon", glyph: "☽", sign: "Taurus", house: "5th", state: "Exalted", accent: C.moonLight },
  { name: "Mars", glyph: "♂", sign: "Cancer", house: "7th", state: "Debil.", accent: C.red },
  { name: "Mercury", glyph: "☿", sign: "Aries", house: "4th", state: "Neutral", accent: C.teal },
  { name: "Jupiter", glyph: "♃", sign: "Virgo", house: "9th", state: "Debil.", accent: C.green },
  { name: "Venus", glyph: "♀", sign: "Gemini", house: "6th", state: "Neutral", accent: C.rose },
  { name: "Saturn", glyph: "♄", sign: "Aquarius", house: "2nd", state: "Own", accent: C.moon },
  { name: "Rahu", glyph: "☊", sign: "Scorpio", house: "11th", state: "–", accent: C.inkMuted },
  { name: "Ketu", glyph: "☋", sign: "Taurus", house: "5th", state: "–", accent: C.inkMuted },
];

const SAVED_INSIGHTS = [
  {
    emoji: "♄",
    title: "Sade Sati decoded",
    body: "The 7.5-year Saturn transit over your Moon sign is intense, but it's a cleansing — not a curse.",
    videoTitle: "Saturn's Influence on Your Destiny",
    accent: C.moon,
    accentPale: C.moonPale,
    accentBorder: C.moonBorder,
  },
  {
    emoji: "🌙",
    title: "Moon > Sun in Vedic astrology",
    body: "Forget your Western Sun sign — in Jyotish, your Moon sign (Rashi) is the foundation of your chart.",
    videoTitle: "Moon Signs & Emotional Patterns",
    accent: C.gold,
    accentPale: C.goldPale,
    accentBorder: C.goldBorder,
  },
  {
    emoji: "♃",
    title: "16 years of expansion",
    body: "Jupiter Dasha is the longest-running benefic period. Growth happens in waves — spiritually, materially, and relationally.",
    videoTitle: "Jupiter Dasha: Growth & Expansion",
    accent: C.teal,
    accentPale: C.tealPale,
    accentBorder: C.tealBorder,
  },
];

const RECENT_VIDEOS = [
  { id: "jaa8EhLt9JE", title: "Saturn's Influence", duration: "18:42", accent: C.moon },
  { id: "aIYrqn2bdcE", title: "Moon Signs", duration: "22:10", accent: C.gold },
  { id: "Rl2g4pUcOwE", title: "Jupiter Dasha", duration: "26:05", accent: C.teal },
];

const thumbUrlMQ = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

// ── Shared: Bottom Sheet ───────────────────────────────────────────────────────
function BottomSheet({ visible, onClose, children, heightFraction = 0.88, borderColor = C.moonBorder }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={bss.root}>
        <TouchableOpacity style={bss.backdrop} activeOpacity={1} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[bss.sheet, { maxHeight: height * heightFraction, borderColor }]}
        >
          {children}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
const bss = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 0.5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 24,
  },
});

const Handle = () => (
  <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
    <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.inkMuted }} />
  </View>
);

// ── Shared: Section Header ─────────────────────────────────────────────────────
function SecHeader({ title, sub, action, onAction, fontsLoaded }) {
  return (
    <View style={sh.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={[sh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>{title}</Text>
        {sub && <Text style={[sh.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>{sub}</Text>}
      </View>
      {action && (
        <TouchableOpacity onPress={onAction} style={sh.btn}>
          <Text style={[sh.all, fontsLoaded && { fontFamily: SERIF.semiBold }]}>{action}</Text>
          <Ionicons name="arrow-forward" size={12} color={C.moon} style={{ marginLeft: 3 }} />
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
    paddingTop: 28,
    paddingBottom: 14,
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

// ── 1. Hero Header ─────────────────────────────────────────────────────────────
function ProfileHero({ user, fontsLoaded, onEdit, onSettings }) {
  return (
    <View style={hero.wrap}>
      {/* Cosmic background */}
      <LinearGradient
        colors={["#080618", "#120E30", "#0F0B24", "#0D0B1A"]}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative star field */}
      {[...Array(18)].map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
            height: i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
            borderRadius: 2,
            backgroundColor: i % 5 === 0 ? C.goldLight : C.ink,
            opacity: 0.1 + (i % 5) * 0.05,
            top: 10 + ((i * 37) % 180),
            left: (i * 83) % (width - 10),
          }}
        />
      ))}

      {/* Zodiac arc decoration */}
      <View style={hero.arcDecor}>
        <Text style={hero.arcTxt}>♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓</Text>
      </View>

      {/* Top bar */}
      <View style={hero.topBar}>
        <Text style={[hero.appLabel, fontsLoaded && { fontFamily: SERIF.regular }]}>✦ Nakshatra</Text>
        <View style={hero.topRight}>
          <TouchableOpacity onPress={onSettings} style={hero.iconBtn}>
            <Ionicons name="settings-outline" size={18} color={C.inkMid} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={[hero.iconBtn, { marginLeft: 8 }]}>
            <Ionicons name="create-outline" size={18} color={C.inkMid} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar + Name */}
      <View style={hero.centerBlock}>
        {/* Avatar ring */}
        <View style={hero.avatarRing}>
          <LinearGradient
            colors={[C.goldLight, C.gold, C.moonLight, C.moon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={hero.avatarGradRing}
          >
            <View style={hero.avatarInner}>
              <LinearGradient colors={["#1C1A3A", "#0D0B1A"]} style={hero.avatarBg}>
                <Text style={[hero.initials, fontsLoaded && { fontFamily: SERIF.bold }]}>
                  {user.initials}
                </Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        <Text style={[hero.name, fontsLoaded && { fontFamily: SERIF.bold }]}>{user.name}</Text>
        <Text style={[hero.handle, fontsLoaded && { fontFamily: SERIF.regular }]}>{user.handle}</Text>

        {/* Rashi + Nakshatra badges */}
        <View style={hero.badgeRow}>
          <View style={hero.rashiBadge}>
            <Text style={[hero.rashiGlyph, { color: C.goldLight }]}>{user.rashiGlyph}</Text>
            <Text style={[hero.rashiTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
              {user.rashi} · {user.rashiEn}
            </Text>
          </View>
          <View style={hero.nakshatraBadge}>
            <Text style={[hero.nakshatraTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
              ✦ {user.nakshatra}
            </Text>
            <Text style={[hero.padaTxt, fontsLoaded && { fontFamily: SERIF.regular }]}>
              {" "}· {user.pada}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats row */}
      <View style={hero.statsCard}>
        {[
          { val: user.videosWatched, label: "Videos Watched", icon: "play-circle-outline" },
          { val: user.insightsSaved, label: "Insights Saved", icon: "bookmark-outline" },
          { val: `${user.daysStreak}d`, label: "Day Streak", icon: "flame-outline" },
        ].map((s, i) => (
          <View
            key={i}
            style={[hero.stat, i < 2 && { borderRightWidth: 0.5, borderRightColor: C.divider }]}
          >
            <Ionicons name={s.icon} size={14} color={C.gold} style={{ marginBottom: 4 }} />
            <Text style={[hero.statVal, fontsLoaded && { fontFamily: SERIF.bold }]}>{s.val}</Text>
            <Text style={[hero.statLabel, fontsLoaded && { fontFamily: SERIF.regular }]}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const hero = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "android" ? 48 : 64,
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  arcDecor: {
    position: "absolute",
    top: Platform.OS === "android" ? 44 : 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  arcTxt: { fontSize: 13, color: C.goldBorder, letterSpacing: 4, opacity: 0.5 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  appLabel: { fontSize: 12, color: C.gold, letterSpacing: 1.4 },
  topRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  centerBlock: { alignItems: "center", marginBottom: 20 },
  avatarRing: { marginBottom: 14 },
  avatarGradRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 45,
    overflow: "hidden",
  },
  avatarBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 34, color: C.goldLight, lineHeight: 40 },
  name: { fontSize: 30, color: C.ink, marginBottom: 4 },
  handle: { fontSize: 13, color: C.inkMuted, marginBottom: 12 },
  badgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  rashiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 5,
  },
  rashiGlyph: { fontSize: 16 },
  rashiTxt: { fontSize: 13, color: C.goldLight },
  nakshatraBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  nakshatraTxt: { fontSize: 13, color: C.moonLight },
  padaTxt: { fontSize: 12, color: C.inkMuted },
  statsCard: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statVal: { fontSize: 20, color: C.goldLight },
  statLabel: { fontSize: 10, color: C.inkMuted, marginTop: 2, textAlign: "center" },
});

// ── 2. Birth Details ───────────────────────────────────────────────────────────
function BirthDetails({ user, fontsLoaded }) {
  const rows = [
    { label: "Date of Birth", value: user.birthDate, icon: "calendar-outline", accent: C.gold },
    { label: "Birth Time", value: user.birthTime, icon: "time-outline", accent: C.moon },
    { label: "Birth Place", value: user.birthPlace, icon: "location-outline", accent: C.rose },
    { label: "Ascendant (Lagna)", value: `${user.ascendantGlyph} ${user.ascendant}`, icon: "compass-outline", accent: C.teal },
    { label: "Sun Sign", value: user.sunSign, icon: "sunny-outline", accent: C.goldLight },
  ];

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={bd.card}>
        <LinearGradient
          colors={[C.goldPale, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
        />
        <View style={bd.cardHeader}>
          <LinearGradient colors={[C.goldLight, C.gold]} style={bd.headerIcon}>
            <MaterialCommunityIcons name="zodiac-aries" size={15} color="#0D0B1A" />
          </LinearGradient>
          <Text style={[bd.cardTitle, fontsLoaded && { fontFamily: SERIF.bold }]}>Birth Chart Details</Text>
          <View style={bd.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={C.green} />
            <Text style={[bd.verifiedTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}> Verified</Text>
          </View>
        </View>

        {rows.map((r, i) => (
          <View key={i} style={[bd.row, i < rows.length - 1 && bd.rowBorder]}>
            <View style={[bd.iconWrap, { backgroundColor: r.accent + "18" }]}>
              <Ionicons name={r.icon} size={14} color={r.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[bd.label, fontsLoaded && { fontFamily: SERIF.regular }]}>{r.label}</Text>
              <Text style={[bd.value, fontsLoaded && { fontFamily: SERIF.semiBold }]}>{r.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const bd = StyleSheet.create({
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  headerIcon: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 17, color: C.ink, flex: 1 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.greenPale,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
  },
  verifiedTxt: { fontSize: 11, color: C.green },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 11 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: C.divider },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, color: C.inkMuted, marginBottom: 2 },
  value: { fontSize: 15, color: C.ink },
});

// ── 3. Planetary Snapshot ──────────────────────────────────────────────────────
function PlanetarySnapshot({ fontsLoaded }) {
  const stateColor = (state) => {
    if (state === "Exalted") return C.green;
    if (state === "Own") return C.teal;
    if (state === "Debil.") return C.red;
    return C.inkMuted;
  };

  return (
    <View>
      <SecHeader title="Planetary Positions" sub="Natal chart snapshot" fontsLoaded={fontsLoaded} />
      <View style={{ paddingHorizontal: 16 }}>
        <View style={ps.grid}>
          {PLANETS.map((p, i) => (
            <View key={i} style={ps.cell}>
              <View style={[ps.glyphCircle, { backgroundColor: p.accent + "18", borderColor: p.accent + "40" }]}>
                <Text style={[ps.glyph, { color: p.accent }]}>{p.glyph}</Text>
              </View>
              <Text style={[ps.planetName, fontsLoaded && { fontFamily: SERIF.semiBold }]}>{p.name}</Text>
              <Text style={[ps.sign, fontsLoaded && { fontFamily: SERIF.regular }]}>{p.sign}</Text>
              <View style={ps.metaRow}>
                <Text style={[ps.house, fontsLoaded && { fontFamily: SERIF.regular }]}>{p.house}</Text>
                {p.state !== "–" && (
                  <Text style={[ps.state, { color: stateColor(p.state) }, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
                    {" "}· {p.state}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
const ps = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  cell: {
    width: (width - 32 - 20) / 3,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  glyphCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    marginBottom: 7,
  },
  glyph: { fontSize: 20 },
  planetName: { fontSize: 12, color: C.ink, marginBottom: 2 },
  sign: { fontSize: 11, color: C.inkMid, marginBottom: 3 },
  metaRow: { flexDirection: "row", alignItems: "center" },
  house: { fontSize: 10, color: C.inkMuted },
  state: { fontSize: 10 },
});

// ── 4. Active Dasha Strip ──────────────────────────────────────────────────────
function DashaStrip({ user, fontsLoaded }) {
  const pct = Math.round(user.dashaProgress * 100);
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={ds.card}>
        <LinearGradient
          colors={[C.tealPale, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
        />
        <View style={ds.topRow}>
          <View style={ds.dashaLeft}>
            <Text style={[ds.eyebrow, fontsLoaded && { fontFamily: SERIF.regular }]}>
              Active Mahadasha
            </Text>
            <View style={ds.dashaNameRow}>
              <Text style={[ds.dashaGlyph, { color: C.teal }]}>{user.dashaGlyph}</Text>
              <Text style={[ds.dashaName, fontsLoaded && { fontFamily: SERIF.bold }]}>
                {" "}{user.currentDasha}
              </Text>
              <Text style={[ds.dashaWord, fontsLoaded && { fontFamily: SERIF.regular }]}>
                {" "}Dasha
              </Text>
            </View>
            <Text style={[ds.dateRange, fontsLoaded && { fontFamily: SERIF.regular }]}>
              {user.dashaStart} — {user.dashaEnd}
            </Text>
          </View>
          <View style={ds.pctCircle}>
            <Text style={[ds.pctVal, fontsLoaded && { fontFamily: SERIF.bold }]}>{pct}%</Text>
            <Text style={[ds.pctLabel, fontsLoaded && { fontFamily: SERIF.regular }]}>done</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={ds.barBg}>
          <LinearGradient
            colors={[C.teal, C.moonLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[ds.barFill, { width: `${pct}%` }]}
          />
        </View>

        {/* Antardasha */}
        <View style={ds.antarRow}>
          <MaterialCommunityIcons name="chevron-right" size={14} color={C.inkMuted} />
          <Text style={[ds.antarLabel, fontsLoaded && { fontFamily: SERIF.regular }]}>
            Antardasha:{" "}
          </Text>
          <Text style={[ds.antarValue, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
            {user.antardasha}
          </Text>
          <Text style={[ds.antarDate, fontsLoaded && { fontFamily: SERIF.regular }]}>
            {" "}· ends {user.antardashaEnd}
          </Text>
        </View>
      </View>
    </View>
  );
}
const ds = StyleSheet.create({
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.tealBorder,
    overflow: "hidden",
    shadowColor: "rgba(45,212,191,0.2)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
  dashaLeft: { flex: 1 },
  eyebrow: { fontSize: 11, color: C.inkMuted, letterSpacing: 0.8, marginBottom: 4 },
  dashaNameRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 4 },
  dashaGlyph: { fontSize: 22 },
  dashaName: { fontSize: 26, color: C.ink },
  dashaWord: { fontSize: 16, color: C.inkMid },
  dateRange: { fontSize: 12, color: C.inkMuted },
  pctCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.tealPale,
    borderWidth: 1.5,
    borderColor: C.teal + "60",
    alignItems: "center",
    justifyContent: "center",
  },
  pctVal: { fontSize: 17, color: C.teal },
  pctLabel: { fontSize: 9, color: C.inkMuted, marginTop: 1 },
  barBg: {
    height: 6,
    backgroundColor: C.bgSurface,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  barFill: { height: "100%", borderRadius: 3 },
  antarRow: { flexDirection: "row", alignItems: "center" },
  antarLabel: { fontSize: 12, color: C.inkMuted },
  antarValue: { fontSize: 13, color: C.teal },
  antarDate: { fontSize: 12, color: C.inkMuted },
});

// ── 5. Saved Insights ──────────────────────────────────────────────────────────
function SavedInsights({ fontsLoaded }) {
  const [saved, setSaved] = useState(SAVED_INSIGHTS);

  return (
    <View>
      <SecHeader
        title="Saved Insights"
        sub={`${saved.length} bookmarked`}
        action="See all"
        fontsLoaded={fontsLoaded}
      />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {saved.map((ins, i) => (
          <View key={i} style={si.card}>
            <LinearGradient
              colors={[ins.accent + "10", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            />
            <View style={[si.iconWrap, { backgroundColor: ins.accentPale, borderColor: ins.accentBorder }]}>
              <Text style={si.emoji}>{ins.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[si.title, fontsLoaded && { fontFamily: SERIF.bold }]}>{ins.title}</Text>
              <Text style={[si.body, fontsLoaded && { fontFamily: SERIF.regular }]} numberOfLines={2}>
                {ins.body}
              </Text>
              <View style={si.sourceRow}>
                <Ionicons name="play-circle-outline" size={11} color={ins.accent} />
                <Text style={[si.source, { color: ins.accent }, fontsLoaded && { fontFamily: SERIF.regular }]}>
                  {" "}{ins.videoTitle}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSaved(saved.filter((_, j) => j !== i))} style={si.removeBtn}>
              <Ionicons name="bookmark" size={16} color={ins.accent} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
const si = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    flexShrink: 0,
  },
  emoji: { fontSize: 18 },
  title: { fontSize: 15, color: C.ink, marginBottom: 4, lineHeight: 20 },
  body: { fontSize: 13, color: C.inkMid, lineHeight: 19, marginBottom: 6 },
  sourceRow: { flexDirection: "row", alignItems: "center" },
  source: { fontSize: 11 },
  removeBtn: { padding: 4, marginLeft: 8 },
});

// ── 6. Recent Videos ───────────────────────────────────────────────────────────
function RecentVideos({ fontsLoaded }) {
  return (
    <View>
      <SecHeader title="Recently Watched" sub="Pick up where you left off" action="Library" fontsLoaded={fontsLoaded} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {RECENT_VIDEOS.map((v, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88} style={rv.card}>
            <View style={rv.thumbWrap}>
              <Image source={{ uri: thumbUrlMQ(v.id) }} style={rv.thumb} resizeMode="cover" />
              <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={StyleSheet.absoluteFill} />
              <View style={[rv.accentBar, { backgroundColor: v.accent }]} />
              <View style={rv.durationBadge}>
                <Text style={rv.durationTxt}>{v.duration}</Text>
              </View>
              <View style={rv.playOverlay}>
                <LinearGradient colors={[v.accent + "CC", v.accent]} style={rv.playBtn}>
                  <Ionicons name="play" size={14} color="#FFF" />
                </LinearGradient>
              </View>
            </View>
            <View style={rv.body}>
              <Text style={[rv.title, fontsLoaded && { fontFamily: SERIF.bold }]} numberOfLines={2}>
                {v.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const rv = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  thumbWrap: { height: 96, position: "relative", overflow: "hidden", backgroundColor: "#000" },
  thumb: { width: "100%", height: "100%" },
  accentBar: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2 },
  durationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
  durationTxt: { fontSize: 10, color: "#FFF", fontWeight: "600" },
  playOverlay: { position: "absolute", bottom: 10, left: 10 },
  playBtn: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  body: { padding: 10 },
  title: { fontSize: 13, color: C.ink, lineHeight: 18 },
});

// ── 7. Compatibility Tease ─────────────────────────────────────────────────────
function CompatibilityTease({ fontsLoaded }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <TouchableOpacity activeOpacity={0.88} style={ct.card}>
        <LinearGradient
          colors={["#1C0A2E", "#0D0B1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          borderRadius={22}
        />
        {/* Decorative glyphs */}
        <Text style={ct.bgGlyph}>♉</Text>
        <View style={ct.inner}>
          <View style={ct.leftCol}>
            <Text style={[ct.eyebrow, fontsLoaded && { fontFamily: SERIF.regular }]}>
              ✦ Kundali Milan
            </Text>
            <Text style={[ct.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
              Check Your{"\n"}
              <Text style={{ color: C.rose }}>Compatibility</Text>
            </Text>
            <Text style={[ct.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
              Match charts · 36 Gunas · Doshas
            </Text>
          </View>
          <LinearGradient colors={[C.rose, "#9B2460"]} style={ct.cta}>
            <Text style={[ct.ctaTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Explore</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFF" style={{ marginLeft: 4 }} />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const ct = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.roseBorder,
    shadowColor: "rgba(244,114,182,0.3)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
    minHeight: 130,
    justifyContent: "center",
  },
  bgGlyph: {
    position: "absolute",
    right: 20,
    fontSize: 90,
    color: C.rosePale,
    opacity: 0.3,
  },
  inner: { padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  leftCol: { flex: 1 },
  eyebrow: { fontSize: 11, color: C.rose, letterSpacing: 0.8, marginBottom: 6 },
  title: { fontSize: 24, color: C.ink, lineHeight: 30, marginBottom: 6 },
  sub: { fontSize: 12, color: C.inkMuted },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  ctaTxt: { fontSize: 14, color: "#FFF" },
});

// ── 8. Settings Rows ───────────────────────────────────────────────────────────
function SettingsSection({ fontsLoaded, onSignOut }) {
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const ROWS = [
    {
      group: "Preferences",
      items: [
        { icon: "notifications-outline", label: "Daily Transit Alerts", accent: C.moon, toggle: true, value: notifs, onChange: setNotifs },
        { icon: "moon-outline", label: "Dark Mode", accent: C.inkMid, toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: "language-outline", label: "Language", accent: C.teal, right: "English", toggle: false },
      ],
    },
    {
      group: "Account",
      items: [
        { icon: "shield-checkmark-outline", label: "Privacy & Data", accent: C.green, toggle: false },
        { icon: "help-circle-outline", label: "Help & Support", accent: C.gold, toggle: false },
        { icon: "information-circle-outline", label: "About Nakshatra", accent: C.inkMuted, toggle: false },
      ],
    },
  ];

  return (
    <View>
      {ROWS.map((group, gi) => (
        <View key={gi}>
          <SecHeader title={group.group} fontsLoaded={fontsLoaded} />
          <View style={{ paddingHorizontal: 16 }}>
            <View style={stg.card}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  activeOpacity={item.toggle ? 1 : 0.8}
                  style={[stg.row, ii < group.items.length - 1 && stg.rowBorder]}
                  onPress={item.toggle ? undefined : undefined}
                >
                  <View style={[stg.iconWrap, { backgroundColor: item.accent + "18" }]}>
                    <Ionicons name={item.icon} size={15} color={item.accent} />
                  </View>
                  <Text style={[stg.label, fontsLoaded && { fontFamily: SERIF.regular }]}>{item.label}</Text>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      trackColor={{ false: C.bgSurface, true: C.moon + "90" }}
                      thumbColor={item.value ? C.moonLight : C.inkMuted}
                      ios_backgroundColor={C.bgSurface}
                    />
                  ) : (
                    <View style={stg.rightRow}>
                      {item.right && (
                        <Text style={[stg.rightTxt, fontsLoaded && { fontFamily: SERIF.regular }]}>{item.right}</Text>
                      )}
                      <Ionicons name="chevron-forward" size={14} color={C.inkMuted} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      ))}

      {/* Sign out */}
      <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
        <TouchableOpacity onPress={onSignOut} activeOpacity={0.85} style={stg.signOut}>
          <Ionicons name="log-out-outline" size={16} color={C.red} />
          <Text style={[stg.signOutTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const stg = StyleSheet.create({
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: C.divider },
  iconWrap: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, fontSize: 15, color: C.ink },
  rightRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  rightTxt: { fontSize: 13, color: C.inkMuted },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.redPale,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: C.redBorder,
  },
  signOutTxt: { fontSize: 15, color: C.red },
});

// ── 9. Edit Profile Sheet ──────────────────────────────────────────────────────
function EditProfileSheet({ visible, onClose, user, fontsLoaded }) {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [birthDate, setBirthDate] = useState(user.birthDate);
  const [birthTime, setBirthTime] = useState(user.birthTime);
  const [birthPlace, setBirthPlace] = useState(user.birthPlace);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 1200);
  };

  const Field = ({ label, value, onChangeText, icon, accent = C.moon }) => (
    <View style={ep.fieldWrap}>
      <Text style={[ep.fieldLabel, fontsLoaded && { fontFamily: SERIF.regular }]}>{label}</Text>
      <View style={ep.inputRow}>
        <Ionicons name={icon} size={14} color={accent} style={{ marginRight: 8 }} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[ep.input, fontsLoaded && { fontFamily: SERIF.regular }]}
          placeholderTextColor={C.inkMuted}
        />
      </View>
    </View>
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} heightFraction={0.92} borderColor={C.moonBorder}>
      <LinearGradient colors={["#0F0B2E", "#1C1A40"]} style={{ flex: 1 }}>
        <Handle />
        {/* Header */}
        <View style={ep.header}>
          <LinearGradient colors={[C.moonLight, C.moon]} style={ep.headerIcon}>
            <Ionicons name="create-outline" size={16} color="#FFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[ep.headerTitle, fontsLoaded && { fontFamily: SERIF.bold }]}>Edit Profile</Text>
            <Text style={[ep.headerSub, fontsLoaded && { fontFamily: SERIF.regular }]}>
              Update your details & birth chart
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={ep.closeBtn}>
            <Ionicons name="close" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ep.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <View style={ep.avatarSection}>
            <View style={ep.avatarRing}>
              <LinearGradient colors={[C.goldLight, C.gold, C.moonLight, C.moon]} style={ep.avatarGrad}>
                <View style={ep.avatarInner}>
                  <LinearGradient colors={["#1C1A3A", "#0D0B1A"]} style={ep.avatarBg}>
                    <Text style={[ep.initials, fontsLoaded && { fontFamily: SERIF.bold }]}>{user.initials}</Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>
            <TouchableOpacity style={ep.changePhotoCta}>
              <Text style={[ep.changePhotoTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={[ep.sectionLabel, fontsLoaded && { fontFamily: SERIF.bold }]}>Personal</Text>
          <Field label="Full Name" value={name} onChangeText={setName} icon="person-outline" accent={C.moon} />
          <Field label="Username" value={handle} onChangeText={setHandle} icon="at-outline" accent={C.moon} />

          <View style={ep.divider} />
          <Text style={[ep.sectionLabel, fontsLoaded && { fontFamily: SERIF.bold }]}>Birth Details</Text>
          <Field label="Date of Birth" value={birthDate} onChangeText={setBirthDate} icon="calendar-outline" accent={C.gold} />
          <Field label="Birth Time" value={birthTime} onChangeText={setBirthTime} icon="time-outline" accent={C.gold} />
          <Field label="Birth Place" value={birthPlace} onChangeText={setBirthPlace} icon="location-outline" accent={C.gold} />

          <View style={ep.aiNote}>
            <MaterialCommunityIcons name="robot" size={14} color={C.moon} />
            <Text style={[ep.aiNoteTxt, fontsLoaded && { fontFamily: SERIF.regular }]}>
              {" "}Updating birth details will recalculate your full chart via AI
            </Text>
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={[ep.saveBtn, saving && { opacity: 0.6 }]}
            activeOpacity={0.88}
          >
            <LinearGradient colors={[C.moonLight, C.moon]} style={ep.saveGrad}>
              {saving ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={[ep.saveTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </BottomSheet>
  );
}
const ep = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  headerIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, color: C.ink },
  headerSub: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { paddingHorizontal: 20 },
  avatarSection: { alignItems: "center", paddingVertical: 20 },
  avatarRing: {},
  avatarGrad: { width: 84, height: 84, borderRadius: 42, padding: 3, alignItems: "center", justifyContent: "center" },
  avatarInner: { width: "100%", height: "100%", borderRadius: 39, overflow: "hidden" },
  avatarBg: { flex: 1, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 28, color: C.goldLight },
  changePhotoCta: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  changePhotoTxt: { fontSize: 13, color: C.moon },
  sectionLabel: { fontSize: 18, color: C.ink, marginTop: 4, marginBottom: 12 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, color: C.inkMuted, marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  input: { flex: 1, color: C.ink, fontSize: 15 },
  divider: { height: 0.5, backgroundColor: C.divider, marginVertical: 16 },
  aiNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    marginTop: 4,
    marginBottom: 20,
  },
  aiNoteTxt: { fontSize: 12, color: C.moonLight, flex: 1 },
  saveBtn: { borderRadius: 18, overflow: "hidden", marginBottom: 8 },
  saveGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14 },
  saveTxt: { fontSize: 15, color: "#FFF" },
});

// ── 10. Sign Out Confirm Sheet ─────────────────────────────────────────────────
function SignOutSheet({ visible, onClose, fontsLoaded }) {
  return (
    <BottomSheet visible={visible} onClose={onClose} heightFraction={0.38} borderColor={C.redBorder}>
      <LinearGradient colors={["#1A0A0A", "#1C1A3A"]} style={{ flex: 1 }}>
        <Handle />
        <View style={so.content}>
          <View style={so.iconRing}>
            <LinearGradient colors={[C.redPale, C.bgSurface]} style={so.iconBg}>
              <Ionicons name="log-out-outline" size={26} color={C.red} />
            </LinearGradient>
          </View>
          <Text style={[so.title, fontsLoaded && { fontFamily: SERIF.bold }]}>Sign Out?</Text>
          <Text style={[so.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
            Your chart, insights, and saved videos will be here when you return.
          </Text>
          <View style={so.btnRow}>
            <TouchableOpacity onPress={onClose} style={so.cancelBtn} activeOpacity={0.8}>
              <Text style={[so.cancelTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Stay</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={so.signOutBtn} activeOpacity={0.85}>
              <LinearGradient colors={["#7F1D1D", C.red]} style={so.signOutGrad}>
                <Text style={[so.signOutTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </BottomSheet>
  );
}
const so = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 10, alignItems: "center" },
  iconRing: { marginBottom: 12 },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.redBorder,
  },
  title: { fontSize: 26, color: C.ink, marginBottom: 8 },
  sub: { fontSize: 14, color: C.inkMid, textAlign: "center", lineHeight: 22, marginBottom: 24 },
  btnRow: { flexDirection: "row", gap: 12, width: "100%" },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  cancelTxt: { fontSize: 15, color: C.inkMid },
  signOutBtn: { flex: 1, borderRadius: 16, overflow: "hidden" },
  signOutGrad: { paddingVertical: 14, alignItems: "center" },
  signOutTxt: { fontSize: 15, color: "#FFF" },
});

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function NakshatraProfile({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const [editVisible, setEditVisible] = useState(false);
  const [signOutVisible, setSignOutVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 1. Hero */}
        <ProfileHero
          user={USER}
          fontsLoaded={fontsLoaded}
          onEdit={() => setEditVisible(true)}
          onSettings={() => {}}
        />

        {/* 2. Birth Details */}
        <SecHeader title="Birth Chart" sub="Your cosmic coordinates" fontsLoaded={fontsLoaded} />
        <BirthDetails user={USER} fontsLoaded={fontsLoaded} />

        {/* 3. Planetary Snapshot */}
        <PlanetarySnapshot fontsLoaded={fontsLoaded} />

        {/* 4. Active Dasha */}
        <SecHeader title="Current Dasha" sub="Your planetary period" fontsLoaded={fontsLoaded} />
        <DashaStrip user={USER} fontsLoaded={fontsLoaded} />

        {/* 5. Saved Insights */}
        <SavedInsights fontsLoaded={fontsLoaded} />

        {/* 6. Recent Videos */}
        <RecentVideos fontsLoaded={fontsLoaded} />

        {/* 7. Compatibility */}
        <SecHeader title="Kundali Milan" sub="Chart compatibility" fontsLoaded={fontsLoaded} />
        <CompatibilityTease fontsLoaded={fontsLoaded} />

        {/* 8. Settings */}
        <SettingsSection fontsLoaded={fontsLoaded} onSignOut={() => setSignOutVisible(true)} />

        {/* Footer quote */}
        <View style={{ paddingHorizontal: 28, paddingTop: 28, paddingBottom: 8, alignItems: "center" }}>
          <View style={{ width: 40, height: 1, backgroundColor: C.goldBorder, marginBottom: 16 }} />
          <Text
            style={[
              { fontSize: 15, lineHeight: 26, color: C.inkMid, textAlign: "center", fontStyle: "italic" },
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            "Know thyself through the stars — for the chart is a mirror, not a map."
          </Text>
          <Text
            style={[
              { fontSize: 11, color: C.gold, textAlign: "center", marginTop: 6 },
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            — Parashara Hora Shastra
          </Text>
          <View style={{ width: 40, height: 1, backgroundColor: C.goldBorder, marginTop: 16 }} />
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileSheet
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        user={USER}
        fontsLoaded={fontsLoaded}
      />
      <SignOutSheet
        visible={signOutVisible}
        onClose={() => setSignOutVisible(false)}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}