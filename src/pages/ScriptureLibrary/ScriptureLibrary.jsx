/**
 * Nakshatra — ScriptureLibrary.jsx
 * Module 09: Comprehensive Vedic Knowledge Repository
 *
 * Sections:
 *  1. Header + Search (AI semantic search)
 *  2. Tab Bar (sticky)
 *  3. Currently Reading / Resume strip
 *  4. Daily Verse card (Dasha-matched)
 *  5. Featured Scriptures — horizontal big cards
 *  6. ★ NEW: Astrology Video Library promo banner → navigates to AstrologyVideoLibrary
 *  7. Audiobooks carousel
 *  8. Browse by Category — grid
 *  9. AI Personalized Recommendations
 * 10. All Texts — vertical list with language tags
 * 11. AI Commentary modal trigger
 */

import React, { useState } from "react";
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

// ── Design tokens ─────────────────────────────────────────────────────────────
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

// ── Mock Data ─────────────────────────────────────────────────────────────────

const TABS = ["All", "Vedas", "Upanishads", "Epics", "Jyotish", "Audiobooks"];

const FEATURED_BOOKS = [
  {
    id: "bg",
    title: "Bhagavad Gita",
    subtitle: "18 Chapters · 18 Commentaries",
    category: "Epic Literature",
    catColor: C.moon,
    desc: "The celestial song of Lord Krishna — a timeless guide to dharma, karma, and self-realization.",
    chapters: 18,
    verses: 700,
    langs: ["Sanskrit", "Hindi", "English", "+8"],
    progress: 0.34,
    glyph: "📿",
    colors: ["#1A0A2E", "#3A1580", "#6030B0"],
    readTime: "42 hrs",
    audioAvailable: true,
    aiCommentaries: 18,
  },
  {
    id: "rv",
    title: "Rigveda",
    subtitle: "Complete · Book I–X",
    category: "Vedas",
    catColor: C.gold,
    desc: "The oldest sacred text of humanity — 10,552 hymns of cosmic wisdom and divine invocation.",
    chapters: 10,
    verses: 10552,
    langs: ["Sanskrit", "Hindi", "English"],
    progress: 0.08,
    glyph: "🔥",
    colors: ["#1A0800", "#5A2800", "#AA5000"],
    readTime: "120 hrs",
    audioAvailable: true,
    aiCommentaries: 10,
  },
  {
    id: "bup",
    title: "Brihadaranyaka Upanishad",
    subtitle: "Largest Upanishad",
    category: "Upanishads",
    catColor: C.teal,
    desc: "The great forest text — profound dialogues on Brahman, Atman, and the nature of consciousness.",
    chapters: 6,
    verses: 435,
    langs: ["Sanskrit", "Hindi", "English", "+5"],
    progress: 0,
    glyph: "🌿",
    colors: ["#001A1A", "#005050", "#009080"],
    readTime: "18 hrs",
    audioAvailable: false,
    aiCommentaries: 6,
  },
  {
    id: "vr",
    title: "Valmiki Ramayana",
    subtitle: "7 Kandas · Complete",
    category: "Epic Literature",
    catColor: C.rose,
    desc: "The first poem of mankind — the divine journey of Rama, a saga of virtue, devotion, and cosmic order.",
    chapters: 7,
    verses: 24000,
    langs: ["Sanskrit", "Hindi", "English", "+8"],
    progress: 0.12,
    glyph: "🏹",
    colors: ["#1A0A0A", "#6A1818", "#B03030"],
    readTime: "200 hrs",
    audioAvailable: true,
    aiCommentaries: 7,
  },
];

const AUDIOBOOKS = [
  {
    id: "a1",
    title: "Bhagavad Gita",
    narrator: "Pt. Ravi Shankar",
    duration: "42 hrs",
    lang: "Hindi",
    episodes: 18,
    glyph: "📿",
    colors: ["#1A0A2E", "#3A1580"],
    accent: C.moon,
    rating: "4.9",
    currentEp: 3,
  },
  {
    id: "a2",
    title: "Rigveda Hymns",
    narrator: "Acharya Devendra",
    duration: "28 hrs",
    lang: "Sanskrit",
    episodes: 40,
    glyph: "🔥",
    colors: ["#1A0800", "#5A2800"],
    accent: C.gold,
    rating: "4.8",
    currentEp: null,
  },
  {
    id: "a3",
    title: "Yoga Sutras of Patanjali",
    narrator: "Swami Advaita",
    duration: "8 hrs",
    lang: "English",
    episodes: 12,
    glyph: "🧘",
    colors: ["#0A1A0A", "#1A5030"],
    accent: C.green,
    rating: "4.9",
    currentEp: null,
  },
  {
    id: "a4",
    title: "Valmiki Ramayana",
    narrator: "Morari Bapu",
    duration: "96 hrs",
    lang: "Hindi",
    episodes: 84,
    glyph: "🏹",
    colors: ["#1A0A0A", "#6A1818"],
    accent: C.rose,
    rating: "5.0",
    currentEp: null,
  },
  {
    id: "a5",
    title: "Chanakya Niti",
    narrator: "Dr. Aryan Gupta",
    duration: "6 hrs",
    lang: "Hindi",
    episodes: 17,
    glyph: "⚖️",
    colors: ["#100E1A", "#2A2060"],
    accent: C.moonLight,
    rating: "4.7",
    currentEp: null,
  },
];

const CATEGORIES = [
  {
    label: "Vedas",
    count: 4,
    glyph: "🔥",
    accent: C.gold,
    bg: C.goldPale,
    border: C.goldBorder,
  },
  {
    label: "Upanishads",
    count: 108,
    glyph: "🌿",
    accent: C.teal,
    bg: C.tealPale,
    border: "rgba(45,212,191,0.25)",
  },
  {
    label: "Epics",
    count: 3,
    glyph: "📖",
    accent: C.rose,
    bg: C.rosePale,
    border: "rgba(244,114,182,0.25)",
  },
  {
    label: "Jyotish",
    count: 11,
    glyph: "⭐",
    accent: C.moon,
    bg: C.moonPale,
    border: C.moonBorder,
  },
  {
    label: "Puranas",
    count: 18,
    glyph: "🕉️",
    accent: C.goldLight,
    bg: C.goldPale,
    border: C.goldBorder,
  },
  {
    label: "Sutras",
    count: 24,
    glyph: "📿",
    accent: C.green,
    bg: C.greenPale,
    border: "rgba(52,208,119,0.25)",
  },
];

const AI_RECS = [
  {
    id: "r1",
    title: "Mundaka Upanishad",
    reason: "Jupiter Dasha — seeking higher knowledge",
    relevance: "98%",
    verse: "2.1.1",
    glyph: "✨",
    accent: C.moon,
    category: "Upanishads",
  },
  {
    id: "r2",
    title: "Vishnu Sahasranama",
    reason: "Venus transit — devotional energy peaked",
    relevance: "94%",
    verse: "Stotram",
    glyph: "🙏",
    accent: C.gold,
    category: "Stotra",
  },
  {
    id: "r3",
    title: "Brihat Parashara Hora Shastra",
    reason: "Your Jyotish interest & Saturn aspects",
    relevance: "91%",
    verse: "Ch. 3",
    glyph: "⭐",
    accent: C.teal,
    category: "Jyotish",
  },
  {
    id: "r4",
    title: "Ashtavakra Gita",
    reason: "Moon in Uttara Phalguni — self-inquiry",
    relevance: "89%",
    verse: "Ch. 1",
    glyph: "🌙",
    accent: C.rose,
    category: "Epics",
  },
];

const ALL_TEXTS = [
  {
    title: "Bhagavad Gita",
    category: "Epics",
    verses: 700,
    langs: ["Sa", "Hi", "En", "+8"],
    glyph: "📿",
    acc: C.moon,
    progress: 0.34,
    audio: true,
  },
  {
    title: "Rigveda",
    category: "Vedas",
    verses: 10552,
    langs: ["Sa", "Hi", "En"],
    glyph: "🔥",
    acc: C.gold,
    progress: 0.08,
    audio: true,
  },
  {
    title: "Yajurveda",
    category: "Vedas",
    verses: 1975,
    langs: ["Sa", "Hi", "En"],
    glyph: "🕯️",
    acc: C.gold,
    progress: 0,
    audio: false,
  },
  {
    title: "Samaveda",
    category: "Vedas",
    verses: 1875,
    langs: ["Sa", "Hi", "En"],
    glyph: "🎵",
    acc: C.gold,
    progress: 0,
    audio: true,
  },
  {
    title: "Atharvaveda",
    category: "Vedas",
    verses: 5987,
    langs: ["Sa", "Hi", "En"],
    glyph: "🌿",
    acc: C.gold,
    progress: 0,
    audio: false,
  },
  {
    title: "Isha Upanishad",
    category: "Upanishads",
    verses: 18,
    langs: ["Sa", "Hi", "En", "+5"],
    glyph: "✨",
    acc: C.teal,
    progress: 1.0,
    audio: true,
  },
  {
    title: "Kena Upanishad",
    category: "Upanishads",
    verses: 35,
    langs: ["Sa", "Hi", "En"],
    glyph: "🌊",
    acc: C.teal,
    progress: 0,
    audio: false,
  },
  {
    title: "Mandukya Upanishad",
    category: "Upanishads",
    verses: 12,
    langs: ["Sa", "Hi", "En"],
    glyph: "🔯",
    acc: C.teal,
    progress: 0.5,
    audio: true,
  },
  {
    title: "Valmiki Ramayana",
    category: "Epics",
    verses: 24000,
    langs: ["Sa", "Hi", "En", "+8"],
    glyph: "🏹",
    acc: C.rose,
    progress: 0.12,
    audio: true,
  },
  {
    title: "Mahabharata",
    category: "Epics",
    verses: 100000,
    langs: ["Sa", "Hi", "En", "+8"],
    glyph: "⚔️",
    acc: C.rose,
    progress: 0,
    audio: false,
  },
  {
    title: "Brihat Parashara Hora Shastra",
    category: "Jyotish",
    verses: 1000,
    langs: ["Sa", "Hi", "En"],
    glyph: "⭐",
    acc: C.moonLight,
    progress: 0,
    audio: false,
  },
  {
    title: "Saravali",
    category: "Jyotish",
    verses: 4000,
    langs: ["Sa", "Hi"],
    glyph: "🪐",
    acc: C.moonLight,
    progress: 0,
    audio: false,
  },
  {
    title: "Jataka Parijata",
    category: "Jyotish",
    verses: 2500,
    langs: ["Sa", "Hi", "En"],
    glyph: "💫",
    acc: C.moonLight,
    progress: 0,
    audio: false,
  },
];

const DAILY_VERSE = {
  text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
  translation:
    "Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure. Such evenness of mind is called yoga.",
  source: "Bhagavad Gita 2.48",
  dashaNote: "Matched to your Jupiter Dasha — equanimity in action",
  glyph: "📿",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function SecHeader({ title, sub, onAll, fontsLoaded }) {
  return (
    <View style={sh.wrap}>
      <View style={{ flex: 1 }}>
        <Text style={[sh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
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

// ── 1. Header + Search ────────────────────────────────────────────────────────
function LibraryHeader({ fontsLoaded, search, setSearch }) {
  return (
    <LinearGradient colors={["#080618", "#0F0B2E", "#0D0B1A"]} style={hdr.wrap}>
      <View
        style={[
          hdr.orb,
          { width: 260, height: 260, top: -100, right: -80, opacity: 0.06 },
        ]}
      />
      {[...Array(12)].map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: 2,
            backgroundColor: C.ink,
            opacity: 0.2 + (i % 4) * 0.08,
            top: 10 + ((i * 29) % 120),
            left: (i * 67) % (width - 10),
          }}
        />
      ))}

      <View style={hdr.topRow}>
        <View>
          <Text
            style={[hdr.eyebrow, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            ✦ Vedic Knowledge Repository
          </Text>
          <Text style={[hdr.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
            Scripture{"\n"}
            <Text style={{ color: C.goldLight }}>Library</Text>
          </Text>
        </View>
        <LinearGradient colors={[C.goldMid, C.gold]} style={hdr.iconBox}>
          <MaterialCommunityIcons
            name="book-open-variant"
            size={22}
            color="#FFF"
          />
        </LinearGradient>
      </View>

      <View style={hdr.statsRow}>
        {[
          { val: "5,000+", label: "Years of Wisdom" },
          { val: "150+", label: "Sacred Texts" },
          { val: "12", label: "Languages" },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              hdr.stat,
              i < 2 && { borderRightWidth: 0.5, borderRightColor: C.divider },
            ]}
          >
            <Text
              style={[hdr.statVal, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {s.val}
            </Text>
            <Text
              style={[
                hdr.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={hdr.searchWrap}>
        <View style={hdr.searchBox}>
          <MaterialCommunityIcons
            name="robot"
            size={16}
            color={C.moon}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by concept, verse, or ask AI…"
            placeholderTextColor={C.inkMuted}
            style={[
              hdr.searchInput,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          />
          <TouchableOpacity style={hdr.searchBtn}>
            <LinearGradient
              colors={[C.moonLight, C.moon]}
              style={hdr.searchBtnGrad}
            >
              <Ionicons name="search" size={14} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text
          style={[hdr.searchHint, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          Try: "verses on detachment" · "Shiva mantras" · "karma yoga"
        </Text>
      </View>
    </LinearGradient>
  );
}
const hdr = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "android" ? 52 : 68,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative",
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  eyebrow: { fontSize: 11, color: C.gold, letterSpacing: 1.2, marginBottom: 6 },
  title: { fontSize: 42, color: C.ink, lineHeight: 48 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 18,
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statVal: { fontSize: 18, color: C.goldLight },
  statLabel: { fontSize: 10, color: C.inkMuted, marginTop: 2 },
  searchWrap: {},
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: { flex: 1, color: C.ink, fontSize: 14 },
  searchBtn: { borderRadius: 12, overflow: "hidden" },
  searchBtnGrad: { padding: 8 },
  searchHint: {
    fontSize: 11,
    color: C.inkMuted,
    marginTop: 8,
    textAlign: "center",
  },
});

// ── 2. Tab Bar ─────────────────────────────────────────────────────────────────
function TabBar({ active, setActive, fontsLoaded }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tb.scroll}
      style={tb.wrap}
    >
      {TABS.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={[tb.tab, active === i && tb.tabActive]}
          activeOpacity={0.8}
          onPress={() => setActive(i)}
        >
          {active === i && (
            <LinearGradient
              colors={[C.goldLight, C.gold]}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
          )}
          <Text
            style={[
              tb.txt,
              active === i && { color: "#0D0B1A" },
              fontsLoaded && {
                fontFamily: active === i ? SERIF.bold : SERIF.regular,
              },
            ]}
          >
            {t}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const tb = StyleSheet.create({
  wrap: { borderBottomWidth: 0.5, borderBottomColor: C.divider },
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  tabActive: { borderColor: C.gold },
  txt: { fontSize: 13, color: C.inkMid },
});

// ── 3. Currently Reading ───────────────────────────────────────────────────────
function CurrentlyReading({ fontsLoaded }) {
  const book = FEATURED_BOOKS[0];
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
      <TouchableOpacity activeOpacity={0.88}>
        <LinearGradient
          colors={["#1A1550", "#110F30"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={cr.card}
        >
          <View
            style={[
              cr.orb,
              { width: 160, height: 160, top: -60, right: -40, opacity: 0.07 },
            ]}
          />
          <LinearGradient colors={book.colors} style={cr.cover}>
            <View
              style={[
                cr.coverOrb,
                { width: 80, height: 80, top: -20, right: -20 },
              ]}
            />
            <Text style={cr.coverGlyph}>{book.glyph}</Text>
          </LinearGradient>
          <View style={cr.info}>
            <View style={cr.resumeBadge}>
              <View style={cr.resumeDot} />
              <Text
                style={[
                  cr.resumeTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Continue Reading
              </Text>
            </View>
            <Text style={[cr.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
              {book.title}
            </Text>
            <Text
              style={[cr.sub, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {book.subtitle}
            </Text>
            <View style={cr.progressWrap}>
              <View style={cr.progressBg}>
                <LinearGradient
                  colors={[C.moonLight, C.moon]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    cr.progressFill,
                    { width: `${book.progress * 100}%` },
                  ]}
                />
              </View>
              <Text
                style={[
                  cr.progressTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {Math.round(book.progress * 100)}%
              </Text>
            </View>
            <Text
              style={[cr.meta, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              Chapter 6 · Verse 23 · {book.readTime} total
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
const cr = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    overflow: "hidden",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 5,
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: C.moon },
  cover: {
    width: 88,
    height: 116,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  coverOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.08,
  },
  coverGlyph: { fontSize: 36 },
  info: { flex: 1 },
  resumeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  resumeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  resumeTxt: { fontSize: 10.5, color: C.green, letterSpacing: 0.4 },
  title: { fontSize: 20, color: C.ink, lineHeight: 24, marginBottom: 3 },
  sub: { fontSize: 11.5, color: C.inkMuted, marginBottom: 12 },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  progressBg: {
    flex: 1,
    height: 5,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: 5, borderRadius: 4 },
  progressTxt: { fontSize: 12, color: C.moonLight },
  meta: { fontSize: 11.5, color: C.inkMuted },
});

// ── 4. Daily Verse ─────────────────────────────────────────────────────────────
function DailyVerseCard({ fontsLoaded, onAITap }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <LinearGradient
        colors={["#10080E", "#2A1040", "#120A1E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={dv.card}
      >
        <View
          style={[
            dv.orb,
            {
              width: 200,
              height: 200,
              top: -70,
              right: -60,
              opacity: 0.08,
              backgroundColor: C.gold,
            },
          ]}
        />
        <View
          style={[
            dv.orb,
            {
              width: 120,
              height: 120,
              bottom: -40,
              left: -30,
              opacity: 0.06,
              backgroundColor: C.moon,
            },
          ]}
        />
        <View style={dv.header}>
          <View style={dv.dayBadge}>
            <Ionicons name="sunny" size={11} color={C.gold} />
            <Text
              style={[dv.dayTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
            >
              {" "}
              Daily Verse
            </Text>
          </View>
          <View style={dv.dashaBadge}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={10}
              color={C.moonLight}
            />
            <Text
              style={[
                dv.dashaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {" "}
              Jupiter Dasha
            </Text>
          </View>
        </View>
        <Text
          style={[dv.sanskrit, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          {DAILY_VERSE.text}
        </Text>
        <View style={dv.divider} />
        <Text
          style={[dv.translation, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {DAILY_VERSE.translation}
        </Text>
        <Text style={[dv.source, fontsLoaded && { fontFamily: SERIF.bold }]}>
          — {DAILY_VERSE.source}
        </Text>
        <View style={dv.footer}>
          <Text
            style={[dv.dashaNote, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            ✦ {DAILY_VERSE.dashaNote}
          </Text>
          <TouchableOpacity
            style={dv.aiBtn}
            activeOpacity={0.85}
            onPress={onAITap}
          >
            <LinearGradient
              colors={[C.moonLight, C.moon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={dv.aiBtnGrad}
            >
              <MaterialCommunityIcons
                name="robot"
                size={13}
                color="#FFF"
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  dv.aiBtnTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                AI Commentary
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
const dv = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 22,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 6,
  },
  orb: { position: "absolute", borderRadius: 999 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  dayTxt: { fontSize: 11, color: C.gold },
  dashaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  dashaTxt: { fontSize: 10.5, color: C.moonLight },
  sanskrit: {
    fontSize: 17,
    color: C.goldLight,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 14,
  },
  divider: { height: 0.5, backgroundColor: C.goldBorder, marginBottom: 14 },
  translation: {
    fontSize: 15,
    color: C.inkMid,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 10,
  },
  source: {
    fontSize: 13,
    color: C.gold,
    textAlign: "center",
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashaNote: { fontSize: 11, color: C.inkMuted, flex: 1, marginRight: 10 },
  aiBtn: { borderRadius: 16, overflow: "hidden" },
  aiBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  aiBtnTxt: { fontSize: 12, color: "#FFF" },
});

// ── 5. Featured Books ──────────────────────────────────────────────────────────
function FeaturedBooks({ fontsLoaded, onAITap }) {
  return (
    <View>
      <SecHeader
        title="Featured Scriptures"
        sub="Start your journey"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {FEATURED_BOOKS.map((b, i) => (
          <TouchableOpacity key={i} activeOpacity={0.88}>
            <View style={fb.card}>
              <LinearGradient
                colors={b.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={fb.cover}
              >
                <View
                  style={[
                    fb.coverOrb,
                    { width: 160, height: 160, top: -50, right: -50 },
                  ]}
                />
                <Text style={fb.coverGlyph}>{b.glyph}</Text>
                {b.audioAvailable && (
                  <View style={fb.audioBadge}>
                    <Ionicons name="headset" size={11} color="#FFF" />
                    <Text style={fb.audioBadgeTxt}> Audio</Text>
                  </View>
                )}
                <View
                  style={[
                    fb.catPill,
                    {
                      backgroundColor: b.catColor + "30",
                      borderColor: b.catColor + "55",
                    },
                  ]}
                >
                  <Text style={[fb.catTxt, { color: b.catColor }]}>
                    {b.category}
                  </Text>
                </View>
              </LinearGradient>
              <View style={fb.body}>
                <Text
                  style={[fb.title, fontsLoaded && { fontFamily: SERIF.bold }]}
                >
                  {b.title}
                </Text>
                <Text
                  style={[
                    fb.subtitle,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {b.subtitle}
                </Text>
                <Text
                  style={[
                    fb.desc,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                  numberOfLines={2}
                >
                  {b.desc}
                </Text>
                <View style={fb.statsRow}>
                  {[
                    { icon: "library-outline", val: `${b.chapters} ch` },
                    {
                      icon: "text-outline",
                      val: `${b.verses.toLocaleString()} verses`,
                    },
                    { icon: "time-outline", val: b.readTime },
                  ].map((s, j) => (
                    <View key={j} style={fb.statItem}>
                      <Ionicons name={s.icon} size={11} color={C.inkMuted} />
                      <Text
                        style={[
                          fb.statTxt,
                          fontsLoaded && { fontFamily: SERIF.regular },
                        ]}
                      >
                        {" "}
                        {s.val}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={fb.langRow}>
                  {b.langs.map((l, j) => (
                    <View key={j} style={fb.langTag}>
                      <Text
                        style={[
                          fb.langTxt,
                          fontsLoaded && { fontFamily: SERIF.regular },
                        ]}
                      >
                        {l}
                      </Text>
                    </View>
                  ))}
                </View>
                {b.progress > 0 && (
                  <View style={fb.progressWrap}>
                    <View style={fb.progressBg}>
                      <LinearGradient
                        colors={[C.moonLight, C.moon]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                          fb.progressFill,
                          { width: `${b.progress * 100}%` },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        fb.progressTxt,
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      {Math.round(b.progress * 100)}%
                    </Text>
                  </View>
                )}
                <View style={fb.ctaRow}>
                  <TouchableOpacity style={fb.readBtn} activeOpacity={0.88}>
                    <LinearGradient
                      colors={[C.goldLight, C.gold]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={fb.readGrad}
                    >
                      <Ionicons
                        name="book-outline"
                        size={13}
                        color="#0D0B1A"
                        style={{ marginRight: 5 }}
                      />
                      <Text
                        style={[
                          fb.readTxt,
                          fontsLoaded && { fontFamily: SERIF.bold },
                        ]}
                      >
                        {b.progress > 0 ? "Continue" : "Read"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={fb.aiBtn}
                    activeOpacity={0.85}
                    onPress={onAITap}
                  >
                    <MaterialCommunityIcons
                      name="robot"
                      size={15}
                      color={C.moon}
                    />
                  </TouchableOpacity>
                  {b.audioAvailable && (
                    <TouchableOpacity style={fb.audioBtn} activeOpacity={0.85}>
                      <Ionicons
                        name="headset-outline"
                        size={15}
                        color={C.gold}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const fb = StyleSheet.create({
  card: {
    width: 240,
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
  cover: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  coverOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.05,
  },
  coverGlyph: { fontSize: 48 },
  audioBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  audioBadgeTxt: { fontSize: 9.5, color: "#FFF" },
  catPill: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  catTxt: { fontSize: 10 },
  body: { padding: 14 },
  title: { fontSize: 19, color: C.ink, lineHeight: 24, marginBottom: 3 },
  subtitle: { fontSize: 11, color: C.inkMuted, marginBottom: 8 },
  desc: { fontSize: 12, color: C.inkMid, lineHeight: 17, marginBottom: 10 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  statItem: { flexDirection: "row", alignItems: "center" },
  statTxt: { fontSize: 11, color: C.inkMuted },
  langRow: { flexDirection: "row", gap: 5, marginBottom: 10, flexWrap: "wrap" },
  langTag: {
    backgroundColor: C.bgSurface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  langTxt: { fontSize: 10, color: C.inkMuted },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: 4, borderRadius: 4 },
  progressTxt: { fontSize: 11, color: C.moonLight },
  ctaRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  readBtn: { flex: 1, borderRadius: 14, overflow: "hidden" },
  readGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
  },
  readTxt: { fontSize: 13, color: "#0D0B1A" },
  aiBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  audioBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── ★ 6. Astrology Video Library Banner ───────────────────────────────────────
function AstrologyVideoBanner({ fontsLoaded, onNavigate }) {
  // The 4 video planet glyphs as a mini preview strip
  const PREVIEW_VIDEOS = [
    { glyph: "♄", accent: "#7B7FE8", label: "Saturn" },
    { glyph: "☽", accent: "#D4A017", label: "Moon" },
    { glyph: "♃", accent: "#2DD4BF", label: "Jupiter" },
    { glyph: "☊", accent: "#F472B6", label: "Rahu" },
  ];

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <TouchableOpacity activeOpacity={0.9} onPress={onNavigate}>
        {/* Outer card */}
        <View style={avb.card}>
          {/* Deep space gradient background */}
          <LinearGradient
            colors={["#0A0620", "#160B2E", "#1A0A1A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            borderRadius={26}
          />

          {/* Decorative orbs */}
          <View
            style={[
              avb.orb,
              {
                width: 220,
                height: 220,
                top: -80,
                right: -70,
                backgroundColor: C.rose,
                opacity: 0.06,
              },
            ]}
          />
          <View
            style={[
              avb.orb,
              {
                width: 140,
                height: 140,
                bottom: -50,
                left: -40,
                backgroundColor: C.moon,
                opacity: 0.07,
              },
            ]}
          />

          {/* Star particles */}
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: i % 2 === 0 ? 2 : 1.5,
                height: i % 2 === 0 ? 2 : 1.5,
                borderRadius: 2,
                backgroundColor: C.ink,
                opacity: 0.2 + (i % 3) * 0.1,
                top: 12 + ((i * 23) % 100),
                left: (i * 53) % (width - 52),
              }}
            />
          ))}

          {/* NEW badge */}
          <View style={avb.newBadge}>
            <LinearGradient
              colors={[C.rose, "#B03060"]}
              style={avb.newBadgeGrad}
            >
              <Ionicons name="sparkles" size={9} color="#FFF" />
              <Text
                style={[
                  avb.newBadgeTxt,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {" "}
                NEW
              </Text>
            </LinearGradient>
          </View>

          {/* Top row: icon + title */}
          <View style={avb.topRow}>
            <View style={avb.iconWrap}>
              <LinearGradient colors={[C.rose, "#A02858"]} style={avb.iconGrad}>
                <MaterialCommunityIcons
                  name="play-circle"
                  size={20}
                  color="#FFF"
                />
              </LinearGradient>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text
                style={[
                  avb.eyebrow,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                ✦ Jyotish Video Repository
              </Text>
              <Text
                style={[avb.title, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                Astrology <Text style={{ color: C.rose }}>Video Library</Text>
              </Text>
            </View>
            {/* Arrow CTA */}
            <View style={avb.arrowBtn}>
              <LinearGradient
                colors={[C.rose + "CC", "#A02858CC"]}
                style={avb.arrowGrad}
              >
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
              </LinearGradient>
            </View>
          </View>

          {/* Description */}
          <Text
            style={[avb.desc, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Watch astrology videos · AI extracts transcripts · Simplifies
            concepts · Key insights & glossary
          </Text>

          {/* Thin gold divider */}
          <View style={avb.divider} />

          {/* Planet preview strip */}
          <View style={avb.previewRow}>
            {PREVIEW_VIDEOS.map((v, i) => (
              <View
                key={i}
                style={[
                  avb.previewChip,
                  {
                    backgroundColor: v.accent + "18",
                    borderColor: v.accent + "44",
                  },
                ]}
              >
                <Text style={[avb.previewGlyph]}>{v.glyph}</Text>
                <Text
                  style={[
                    avb.previewLabel,
                    { color: v.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {v.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Stats row */}
          <View style={avb.statsRow}>
            {[
              { icon: "play-circle-outline", val: "4 Videos", accent: C.rose },
              { icon: "robot-outline", val: "AI Simplified", accent: C.moon },
              { icon: "lightbulb-outline", val: "16 Insights", accent: C.gold },
            ].map((s, i) => (
              <View key={i} style={[avb.statChip, i < 2 && avb.statDivider]}>
                <MaterialCommunityIcons
                  name={s.icon}
                  size={13}
                  color={s.accent}
                />
                <Text
                  style={[
                    avb.statTxt,
                    { color: s.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {" "}
                  {s.val}
                </Text>
              </View>
            ))}
          </View>

          {/* CTA button */}
          <TouchableOpacity
            onPress={onNavigate}
            activeOpacity={0.88}
            style={avb.ctaBtn}
          >
            <LinearGradient
              colors={[C.rose, "#A02858"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={avb.ctaGrad}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={15}
                color="#FFF"
                style={{ marginRight: 8 }}
              />
              <Text
                style={[avb.ctaTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                Explore Video Library
              </Text>
              <Ionicons
                name="arrow-forward"
                size={14}
                color="#FFF"
                style={{ marginLeft: 6 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}
const avb = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(244,114,182,0.30)",
    shadowColor: "rgba(244,114,182,0.25)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 7,
  },
  orb: { position: "absolute", borderRadius: 999 },
  newBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  newBadgeGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newBadgeTxt: { fontSize: 10, color: "#FFF" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 60,
  },
  iconWrap: { borderRadius: 16, overflow: "hidden" },
  iconGrad: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  eyebrow: { fontSize: 10, color: C.rose, letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 22, color: C.ink, lineHeight: 28 },
  arrowBtn: { borderRadius: 14, overflow: "hidden" },
  arrowGrad: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    fontSize: 13,
    color: C.inkMid,
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(244,114,182,0.20)",
    marginBottom: 14,
  },
  previewRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  previewChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 5,
  },
  previewGlyph: { fontSize: 14 },
  previewLabel: { fontSize: 12 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 14,
    overflow: "hidden",
  },
  statChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  statDivider: { borderRightWidth: 0.5, borderRightColor: C.divider },
  statTxt: { fontSize: 11 },
  ctaBtn: { borderRadius: 18, overflow: "hidden" },
  ctaGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  ctaTxt: { fontSize: 14, color: "#FFF" },
});

// ── 7. Audiobooks ──────────────────────────────────────────────────────────────
function AudiobooksSection({ fontsLoaded }) {
  const [playing, setPlaying] = useState(null);
  return (
    <View>
      <SecHeader
        title="Audiobooks"
        sub="Sacred texts — listen anywhere"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
          paddingBottom: 4,
        }}
      >
        {AUDIOBOOKS.map((a, i) => (
          <View key={i} style={ab.card}>
            <LinearGradient colors={a.colors} style={ab.coverArea}>
              <View
                style={[
                  ab.orb,
                  { width: 100, height: 100, top: -30, right: -30 },
                ]}
              />
              <Text style={ab.glyph}>{a.glyph}</Text>
              {a.currentEp && (
                <View style={ab.nowPlayingBadge}>
                  <View style={ab.nowDot} />
                  <Text style={ab.nowTxt}>Playing</Text>
                </View>
              )}
            </LinearGradient>
            <View style={ab.body}>
              <Text
                style={[ab.title, fontsLoaded && { fontFamily: SERIF.bold }]}
                numberOfLines={1}
              >
                {a.title}
              </Text>
              <Text
                style={[
                  ab.narrator,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {a.narrator}
              </Text>
              <View style={ab.metaRow}>
                <Ionicons name="star" size={11} color={C.gold} />
                <Text
                  style={[
                    ab.rating,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {" "}
                  {a.rating}
                </Text>
                <Text style={ab.dot}>·</Text>
                <Text
                  style={[
                    ab.meta,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {a.episodes} eps
                </Text>
                <Text style={ab.dot}>·</Text>
                <Text
                  style={[
                    ab.meta,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {a.duration}
                </Text>
              </View>
              <View
                style={[
                  ab.langBadge,
                  {
                    backgroundColor: a.accent + "20",
                    borderColor: a.accent + "44",
                  },
                ]}
              >
                <Text
                  style={[
                    ab.langTxt,
                    { color: a.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {a.lang}
                </Text>
              </View>
              <TouchableOpacity
                style={ab.playBtn}
                activeOpacity={0.85}
                onPress={() => setPlaying(playing === a.id ? null : a.id)}
              >
                <LinearGradient
                  colors={
                    playing === a.id
                      ? [C.green, "#20A060"]
                      : [a.accent + "EE", a.accent + "AA"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={ab.playGrad}
                >
                  <Ionicons
                    name={playing === a.id ? "pause" : "play"}
                    size={14}
                    color="#FFF"
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      ab.playTxt,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    {playing === a.id
                      ? "Pause"
                      : a.currentEp
                        ? `Ep ${a.currentEp}`
                        : "Play"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const ab = StyleSheet.create({
  card: {
    width: 186,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  coverArea: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "#FFF",
    opacity: 0.06,
  },
  glyph: { fontSize: 38 },
  nowPlayingBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52,208,119,0.25)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(52,208,119,0.4)",
  },
  nowDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 4,
  },
  nowTxt: { fontSize: 9.5, color: C.green },
  body: { padding: 12 },
  title: { fontSize: 16, color: C.ink, lineHeight: 20, marginBottom: 3 },
  narrator: { fontSize: 11, color: C.inkMuted, marginBottom: 7 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 3,
  },
  rating: { fontSize: 12, color: C.gold },
  dot: { fontSize: 11, color: C.inkMuted },
  meta: { fontSize: 11, color: C.inkMuted },
  langBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 10,
  },
  langTxt: { fontSize: 10.5 },
  playBtn: { borderRadius: 14, overflow: "hidden" },
  playGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  playTxt: { fontSize: 13, color: "#FFF" },
});

// ── 8. Browse by Category ──────────────────────────────────────────────────────
function BrowseCategories({ fontsLoaded }) {
  return (
    <View>
      <SecHeader title="Browse Categories" fontsLoaded={fontsLoaded} />
      <View style={bc.grid}>
        {CATEGORIES.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[bc.tile, { backgroundColor: c.bg, borderColor: c.border }]}
            activeOpacity={0.85}
          >
            <Text style={bc.glyph}>{c.glyph}</Text>
            <Text
              style={[
                bc.label,
                { color: c.accent },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {c.label}
            </Text>
            <Text
              style={[bc.count, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {c.count} texts
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const bc = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 10,
  },
  tile: {
    width: (width - 52) / 3,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 0.5,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  glyph: { fontSize: 28, marginBottom: 6 },
  label: { fontSize: 14, textAlign: "center" },
  count: { fontSize: 10.5, color: C.inkMuted, marginTop: 3 },
});

// ── 9. AI Personalized Recommendations ────────────────────────────────────────
function AIRecommendations({ fontsLoaded, onAITap }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="AI Picks for You"
        sub="Matched to your Dasha & life challenges"
        fontsLoaded={fontsLoaded}
      />
      {AI_RECS.map((r, i) => (
        <TouchableOpacity key={i} style={air.card} activeOpacity={0.88}>
          <LinearGradient
            colors={[r.accent + "18", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
            borderRadius={20}
          />
          <View
            style={[
              air.iconWrap,
              {
                backgroundColor: r.accent + "22",
                borderColor: r.accent + "44",
              },
            ]}
          >
            <Text style={air.glyph}>{r.glyph}</Text>
          </View>
          <View style={air.mid}>
            <View style={air.topRow}>
              <Text
                style={[air.title, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {r.title}
              </Text>
              <View
                style={[
                  air.relevancePill,
                  {
                    backgroundColor: r.accent + "25",
                    borderColor: r.accent + "50",
                  },
                ]}
              >
                <Text
                  style={[
                    air.relevanceTxt,
                    { color: r.accent },
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {r.relevance}
                </Text>
              </View>
            </View>
            <Text
              style={[
                air.category,
                { color: r.accent },
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {r.category} · {r.verse}
            </Text>
            <View style={air.reasonRow}>
              <MaterialCommunityIcons name="robot" size={11} color={C.moon} />
              <Text
                style={[
                  air.reason,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {" "}
                {r.reason}
              </Text>
            </View>
          </View>
          <View style={air.actions}>
            <TouchableOpacity style={air.readBtn} activeOpacity={0.85}>
              <Ionicons name="book-outline" size={16} color={C.gold} />
            </TouchableOpacity>
            <TouchableOpacity
              style={air.aiCommentaryBtn}
              activeOpacity={0.85}
              onPress={onAITap}
            >
              <MaterialCommunityIcons name="robot" size={16} color={C.moon} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const air = StyleSheet.create({
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
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    flexShrink: 0,
  },
  glyph: { fontSize: 22 },
  mid: { flex: 1, marginLeft: 12 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  title: { fontSize: 16, color: C.ink, flex: 1, marginRight: 8 },
  relevancePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  relevanceTxt: { fontSize: 11 },
  category: { fontSize: 11.5, marginBottom: 5 },
  reasonRow: { flexDirection: "row", alignItems: "flex-start" },
  reason: { fontSize: 11.5, color: C.inkMuted, flex: 1, lineHeight: 16 },
  actions: { gap: 7, marginLeft: 10 },
  readBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  aiCommentaryBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── 10. All Texts List ──────────────────────────────────────────────────────────
function AllTextsList({ fontsLoaded, onAITap }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? ALL_TEXTS : ALL_TEXTS.slice(0, 6);
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SecHeader
        title="Complete Library"
        sub={`${ALL_TEXTS.length} sacred texts`}
        fontsLoaded={fontsLoaded}
      />
      {displayed.map((t, i) => (
        <TouchableOpacity key={i} style={atl.row} activeOpacity={0.88}>
          <View
            style={[
              atl.glyphBox,
              { backgroundColor: t.acc + "18", borderColor: t.acc + "35" },
            ]}
          >
            <Text style={atl.glyph}>{t.glyph}</Text>
          </View>
          <View style={atl.mid}>
            <Text
              style={[atl.title, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {t.title}
            </Text>
            <View style={atl.metaRow}>
              <Text
                style={[
                  atl.cat,
                  { color: t.acc },
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {t.category}
              </Text>
              <Text style={atl.dot}>·</Text>
              <Text
                style={[atl.meta, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {t.verses.toLocaleString()} verses
              </Text>
            </View>
            <View style={atl.langRow}>
              {t.langs.map((l, j) => (
                <View key={j} style={atl.langTag}>
                  <Text
                    style={[
                      atl.langTxt,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {l}
                  </Text>
                </View>
              ))}
            </View>
            {t.progress > 0 && (
              <View style={atl.progressWrap}>
                <View style={atl.progressBg}>
                  <View
                    style={[
                      atl.progressFill,
                      {
                        width: `${t.progress * 100}%`,
                        backgroundColor: t.progress === 1 ? C.green : C.moon,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    atl.progressTxt,
                    { color: t.progress === 1 ? C.green : C.moonLight },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {t.progress === 1 ? "✓" : `${Math.round(t.progress * 100)}%`}
                </Text>
              </View>
            )}
          </View>
          <View style={atl.right}>
            {t.audio && (
              <View style={atl.audioBadge}>
                <Ionicons name="headset" size={11} color={C.gold} />
              </View>
            )}
            <TouchableOpacity
              style={atl.aiBtn}
              activeOpacity={0.85}
              onPress={onAITap}
            >
              <MaterialCommunityIcons name="robot" size={14} color={C.moon} />
            </TouchableOpacity>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={C.inkMuted}
              style={{ marginTop: 4 }}
            />
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={atl.showMoreBtn}
        activeOpacity={0.85}
        onPress={() => setShowAll(!showAll)}
      >
        <Text
          style={[
            atl.showMoreTxt,
            fontsLoaded && { fontFamily: SERIF.semiBold },
          ]}
        >
          {showAll ? "Show Less" : `Show ${ALL_TEXTS.length - 6} More Texts`}
        </Text>
        <Ionicons
          name={showAll ? "chevron-up" : "chevron-down"}
          size={14}
          color={C.moon}
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
}
const atl = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  glyphBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    flexShrink: 0,
  },
  glyph: { fontSize: 22 },
  mid: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, color: C.ink, lineHeight: 20, marginBottom: 4 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  cat: { fontSize: 11.5 },
  dot: { fontSize: 11, color: C.inkMuted },
  meta: { fontSize: 11.5, color: C.inkMuted },
  langRow: { flexDirection: "row", gap: 5, flexWrap: "wrap", marginBottom: 4 },
  langTag: {
    backgroundColor: C.bgSurface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  langTxt: { fontSize: 9.5, color: C.inkMuted },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  progressBg: {
    flex: 1,
    height: 3,
    backgroundColor: C.bgSurface,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 3, borderRadius: 3 },
  progressTxt: { fontSize: 10.5 },
  right: { alignItems: "center", gap: 5, marginLeft: 8 },
  audioBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  showMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    borderRadius: 18,
    marginTop: 4,
    backgroundColor: C.moonPale,
  },
  showMoreTxt: { fontSize: 14, color: C.moon },
});

// ── 11. AI Commentary Modal ────────────────────────────────────────────────────
function AICommentaryModal({ visible, onClose, fontsLoaded }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={aicm.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={aicm.sheet}>
        <LinearGradient colors={["#13112A", "#1C1A40"]} style={aicm.sheetInner}>
          <View style={aicm.handle} />
          <View style={aicm.header}>
            <LinearGradient
              colors={[C.moonLight, C.moon, C.moonDark]}
              style={aicm.aiIcon}
            >
              <MaterialCommunityIcons name="robot" size={20} color="#FFF" />
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[aicm.title, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                AI Commentary
              </Text>
              <Text
                style={[aicm.sub, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                Bhagavad Gita 2.48
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={aicm.closeBtn}>
              <Ionicons name="close" size={18} color={C.inkMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={aicm.scroll}>
            <View style={aicm.verseBox}>
              <Text
                style={[
                  aicm.verseSanskrit,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                योगस्थः कुरु कर्माणि…
              </Text>
              <Text
                style={[
                  aicm.verseTranslation,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                "Perform action while established in yoga…"
              </Text>
            </View>

            {[
              {
                icon: "book-open-variant",
                label: "Core Meaning",
                color: C.gold,
                text: "This verse introduces the concept of Nishkama Karma — action without attachment to results. Krishna instructs Arjuna to act from a state of equanimity (samatvam), performing his dharmic duty without being bound by success or failure.",
              },
              {
                icon: "history",
                label: "Historical Context",
                color: C.moon,
                text: "Spoken on the battlefield of Kurukshetra approximately 5,000 years ago. Shankaracharya, Ramanuja, and Madhvacharya each interpreted this verse through the lenses of Advaita, Vishishtadvaita, and Dvaita respectively.",
              },
              {
                icon: "lightning-bolt",
                label: "Practical Application",
                color: C.green,
                text: "In modern life: focus on giving your best effort in work, relationships, and spiritual practice — without obsessing over outcomes. This frees the mind from anxiety and cultivates a state of flow.",
              },
              {
                icon: "star-four-points",
                label: "Your Dasha Connection",
                color: C.teal,
                text: "Currently in Jupiter Dasha — the guru planet naturally inclines you toward this wisdom. This verse is especially potent for you at this time. Contemplate it during morning meditation.",
              },
            ].map((s, i) => (
              <View key={i} style={aicm.section}>
                <View style={aicm.sectionHeader}>
                  <MaterialCommunityIcons
                    name={s.icon}
                    size={15}
                    color={s.color}
                  />
                  <Text
                    style={[
                      aicm.sectionTitle,
                      { color: s.color },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {" "}
                    {s.label}
                  </Text>
                </View>
                <Text
                  style={[
                    aicm.sectionText,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {s.text}
                </Text>
              </View>
            ))}

            <View style={aicm.commentatorsWrap}>
              <Text
                style={[
                  aicm.commentatorsTitle,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                Classical Commentaries
              </Text>
              {[
                "Adi Shankaracharya",
                "Swami Vivekananda",
                "B.G. Tilak",
                "Swami Prabhupada",
              ].map((c, i) => (
                <TouchableOpacity
                  key={i}
                  style={aicm.commentatorRow}
                  activeOpacity={0.85}
                >
                  <View style={aicm.commentatorDot} />
                  <Text
                    style={[
                      aicm.commentatorName,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {c}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={C.inkMuted}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
const aicm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: {
    maxHeight: "85%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  sheetInner: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.inkMuted,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, color: C.ink },
  sub: { fontSize: 12, color: C.inkMuted, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { paddingHorizontal: 20 },
  verseBox: {
    backgroundColor: C.bgSurface,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  verseSanskrit: {
    fontSize: 15,
    color: C.goldLight,
    lineHeight: 24,
    marginBottom: 8,
  },
  verseTranslation: {
    fontSize: 13,
    color: C.inkMid,
    lineHeight: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 16,
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14 },
  sectionText: { fontSize: 13.5, color: C.inkMid, lineHeight: 22 },
  commentatorsWrap: { marginBottom: 24 },
  commentatorsTitle: { fontSize: 18, color: C.ink, marginBottom: 12 },
  commentatorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  commentatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
    marginRight: 12,
  },
  commentatorName: { flex: 1, fontSize: 15, color: C.inkMid },
});

// ── Quote Footer ───────────────────────────────────────────────────────────────
function QuoteFooter({ fontsLoaded }) {
  return (
    <View style={qf.wrap}>
      <View style={qf.line} />
      <Text style={[qf.text, fontsLoaded && { fontFamily: SERIF.regular }]}>
        "In the beginning was the Word, and the Word was Brahman."
      </Text>
      <Text style={[qf.src, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
        — Vedanta Sutra
      </Text>
      <View style={qf.line} />
    </View>
  );
}
const qf = StyleSheet.create({
  wrap: {
    paddingHorizontal: 28,
    paddingVertical: 28,
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

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ScriptureLibrary({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // Navigate to the Astrology Video Library screen
  const handleVideoLibraryNav = () => {
    if (navigation) {
      navigation.navigate("AstrologyVideoLibrary");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* 0 — Header */}
        <LibraryHeader
          fontsLoaded={fontsLoaded}
          search={search}
          setSearch={setSearch}
        />

        {/* 1 — Sticky tab bar */}
        <View style={{ backgroundColor: C.bg }}>
          <TabBar
            active={activeTab}
            setActive={setActiveTab}
            fontsLoaded={fontsLoaded}
          />
        </View>

        {/* 2 — Currently Reading */}
        <SecHeader title="Continue Reading" fontsLoaded={fontsLoaded} />
        <CurrentlyReading fontsLoaded={fontsLoaded} />

        {/* 3 — Daily Verse */}
        <SecHeader
          title="Daily Verse"
          sub="Personalized for your Dasha"
          fontsLoaded={fontsLoaded}
        />
        <DailyVerseCard
          fontsLoaded={fontsLoaded}
          onAITap={() => setAiModalVisible(true)}
        />

        {/* 4 — Featured Books */}
        <FeaturedBooks
          fontsLoaded={fontsLoaded}
          onAITap={() => setAiModalVisible(true)}
        />

        {/* ★ 5 — Astrology Video Library Banner */}
        <SecHeader
          title="Video Wisdom"
          sub="AI-decoded astrology videos"
          fontsLoaded={fontsLoaded}
        />
        <AstrologyVideoBanner
          fontsLoaded={fontsLoaded}
          onNavigate={handleVideoLibraryNav}
        />

        {/* 6 — Audiobooks */}
        <AudiobooksSection fontsLoaded={fontsLoaded} />

        {/* 7 — Browse Categories */}
        <BrowseCategories fontsLoaded={fontsLoaded} />

        {/* 8 — AI Recommendations */}
        <AIRecommendations
          fontsLoaded={fontsLoaded}
          onAITap={() => setAiModalVisible(true)}
        />

        {/* 9 — All Texts */}
        <AllTextsList
          fontsLoaded={fontsLoaded}
          onAITap={() => setAiModalVisible(true)}
        />

        {/* 10 — Footer */}
        <QuoteFooter fontsLoaded={fontsLoaded} />
      </ScrollView>

      {/* AI Commentary Modal */}
      <AICommentaryModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}
