/**
 * Nakshatra — AstrologyVideoLibrary.jsx
 * Module 10: Astrology Video Transcribe & AI Simplifier
 *
 * FIXES:
 *  - Bottom tray modals (TranscriptModal, AskAIModal, AddVideoModal) now use
 *    correct flex layout: Modal > View(flex:1) > TouchableOpacity overlay +
 *    KeyboardAvoidingView sheet — so the sheet anchors to the bottom and the
 *    overlay tap-to-dismiss works properly.
 *  - KeyboardAvoidingView wraps sheet content so input fields push up on iOS.
 *  - Sheet uses flex:1 inside a flex-end container, not maxHeight alone.
 *  - AddVideoModal centres correctly with improved layout.
 *
 * IMPROVEMENTS:
 *  - Video carousel cards have a more polished active state.
 *  - AI answer card supports smooth scroll-to reveal.
 *  - Quick question chips animate on tap.
 *  - Transcript modal chapters strip is more thumb-friendly.
 *  - Minor spacing / type refinements throughout.
 */

import React, { useRef, useState, useCallback } from "react";
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
  red: "#F87171",
  redPale: "rgba(248,113,113,0.12)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getYTId = (url) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^?&\s]{11})/,
  );
  return match ? match[1] : null;
};
const thumbUrl = (id) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
const thumbUrlMQ = (id) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

// ── Seed videos ───────────────────────────────────────────────────────────────
const SEED_VIDEOS = [
  {
    id: "jaa8EhLt9JE",
    url: "https://youtu.be/jaa8EhLt9JE",
    title: "Saturn's Influence on Your Destiny",
    channel: "Cosmic Vedic",
    duration: "18:42",
    views: "284K",
    topic: "Saturn · Karma · Life Path",
    accent: C.moon,
    accentPale: C.moonPale,
    accentBorder: C.moonBorder,
    planetGlyph: "♄",
    category: "Jyotish",
    simplified: `Saturn (Shani) is the planet of karma and discipline. Think of it as the universe's strict teacher — it doesn't punish you, it shows you the lessons you still need to learn.\n\nWhen Saturn is strong in your chart, you tend to work hard, be patient, and ultimately succeed through persistence. When it's challenging, life may feel slower, heavier, or more restrictive — but only because Saturn is preparing you for something more solid.\n\nThe 7.5-year Saturn transit (Sade Sati) is the most talked-about period. Many fear it, but seasoned astrologers say it's actually your greatest growth window — old structures fall away so better ones can be built.`,
    keyInsights: [
      {
        emoji: "⏳",
        title: "Patience is Saturn's gift",
        body: "Saturn rewards those who persist. Quick results are not Saturn's style — but lasting ones are.",
      },
      {
        emoji: "♄",
        title: "Sade Sati decoded",
        body: "The 7.5-year Saturn transit over your Moon sign is intense, but it's a cleansing — not a curse.",
      },
      {
        emoji: "🏗️",
        title: "Career & discipline",
        body: "Saturn rules the 10th house of career. Its placement tells you which field you'll master through dedicated effort.",
      },
      {
        emoji: "🪐",
        title: "Saturn retrograde",
        body: "When Saturn goes backward, unresolved karmas resurface. Use this time to clear old debts — financial, emotional, or spiritual.",
      },
    ],
    glossary: [
      {
        term: "Sade Sati",
        meaning:
          "7.5-year period when Saturn transits over your natal Moon. A time of transformation and karmic clearing.",
      },
      {
        term: "Shani Dasha",
        meaning:
          "19-year major period ruled by Saturn. Career, structure, and responsibilities become dominant themes.",
      },
      {
        term: "Karma Bhava",
        meaning:
          "The 10th house of the chart — governs career, public life, and one's duty in the world.",
      },
      {
        term: "Retrograde",
        meaning:
          "When a planet appears to move backward. Energies of that planet turn inward and become more intense.",
      },
    ],
    chapters: [
      { time: "0:00", label: "What is Saturn in Vedic astrology?" },
      { time: "3:15", label: "Saturn's houses: best & worst placements" },
      { time: "7:40", label: "Sade Sati — the 7.5-year transit explained" },
      { time: "11:20", label: "Saturn Dasha: what to expect" },
      { time: "15:00", label: "Remedies & how to work with Saturn energy" },
    ],
  },
  {
    id: "aIYrqn2bdcE",
    url: "https://youtu.be/aIYrqn2bdcE",
    title: "Moon Signs & Emotional Patterns",
    channel: "Nakshatra Wisdom",
    duration: "22:10",
    views: "412K",
    topic: "Moon · Emotions · Rashi",
    accent: C.gold,
    accentPale: C.goldPale,
    accentBorder: C.goldBorder,
    planetGlyph: "☽",
    category: "Rashi",
    simplified: `Your Moon sign in Vedic astrology is far more important than your Sun sign. While your Sun sign shows your outer personality, the Moon reveals your inner emotional world — how you feel, react, and what makes you feel safe and nourished.\n\nThe Moon changes signs every 2.5 days, which is why even people born on the same day can feel very different emotionally. The Nakshatra (lunar mansion) your Moon falls in adds even more precision — there are 27 Nakshatras, each with its own emotional signature.\n\nUnderstanding your Moon sign helps you recognise your emotional needs, your relationship patterns, and even your mother's influence on your psychology.`,
    keyInsights: [
      {
        emoji: "🌙",
        title: "Moon > Sun in Vedic astrology",
        body: "Forget your Western Sun sign — in Jyotish, your Moon sign (Rashi) is the foundation of your chart.",
      },
      {
        emoji: "🌊",
        title: "Emotional body map",
        body: "Moon rules water, fluids, the mind, and emotions. Its sign shows what you need to feel emotionally safe.",
      },
      {
        emoji: "🤱",
        title: "Mother & early life",
        body: "The Moon represents your mother and early childhood. Its condition in your chart describes that foundational relationship.",
      },
      {
        emoji: "⚡",
        title: "Moon in Nakshatras",
        body: "Each of the 27 Nakshatras gives a unique flavour to Moon energy — from fiery Ashwini to deep, transformative Jyeshtha.",
      },
    ],
    glossary: [
      {
        term: "Rashi",
        meaning:
          "Zodiac sign. There are 12 Rashis in Vedic astrology, each governing a different emotional temperament.",
      },
      {
        term: "Nakshatra",
        meaning:
          "Lunar mansion. The zodiac is divided into 27 Nakshatras of 13°20' each, adding precision beyond sun/moon signs.",
      },
      {
        term: "Chandrama",
        meaning:
          "Sanskrit name for the Moon. It rules the mind, emotions, and the sign Cancer (Karka).",
      },
      {
        term: "Manas",
        meaning:
          "The mind, governed by the Moon. Manas includes emotions, memory, and how we process experience.",
      },
    ],
    chapters: [
      { time: "0:00", label: "Why Moon sign matters more than Sun sign" },
      { time: "4:00", label: "All 12 Moon signs — emotional characteristics" },
      { time: "10:30", label: "Nakshatras: the 27 lunar mansions" },
      { time: "16:00", label: "Moon in difficult houses & remedies" },
      { time: "19:45", label: "How to read Moon in your birth chart" },
    ],
  },
  {
    id: "Rl2g4pUcOwE",
    url: "https://youtu.be/Rl2g4pUcOwE",
    title: "Jupiter Dasha: Growth, Wisdom & Expansion",
    channel: "Vedic Stars",
    duration: "26:05",
    views: "198K",
    topic: "Jupiter · Dasha · Prosperity",
    accent: C.teal,
    accentPale: C.tealPale,
    accentBorder: "rgba(45,212,191,0.25)",
    planetGlyph: "♃",
    category: "Dasha",
    simplified: `Jupiter Dasha (Guru Mahadasha) lasts 16 years and is widely considered the most auspicious major period in Vedic astrology. It's associated with expansion, higher knowledge, spirituality, wealth, and good fortune.\n\nHowever, not everyone experiences it the same way. The results depend on where Jupiter sits in your birth chart, which house it rules, and whether it's well-placed or afflicted. A strong Jupiter in the 1st, 5th, 9th, or 11th house can bring remarkable life improvements.\n\nDuring this period, people often pursue higher education, travel, spiritual practices, marriage, or start families. It's a time when the universe seems to say "yes" more often than not.`,
    keyInsights: [
      {
        emoji: "♃",
        title: "16 years of expansion",
        body: "Jupiter Dasha is the longest-running benefic period. Growth happens in waves — spiritually, materially, and relationally.",
      },
      {
        emoji: "📚",
        title: "Higher education & wisdom",
        body: "Jupiter rules knowledge. Many people pursue advanced degrees, spiritual study, or teaching during this Dasha.",
      },
      {
        emoji: "💰",
        title: "Wealth & abundance",
        body: "Jupiter is the karaka (significator) of wealth. Its Dasha often brings financial improvements, especially if Jupiter rules the 2nd or 11th house.",
      },
      {
        emoji: "🙏",
        title: "Spiritual awakening",
        body: "This period often triggers a spiritual turn — pilgrimages, gurus, philosophical questioning, or deep meditation practice.",
      },
    ],
    glossary: [
      {
        term: "Mahadasha",
        meaning:
          "Major planetary period in the Vimshottari Dasha system. Each planet rules for a fixed number of years.",
      },
      {
        term: "Guru",
        meaning:
          "Sanskrit name for Jupiter. The teacher planet. Rules wisdom, dharma, children, and higher philosophy.",
      },
      {
        term: "Vimshottari",
        meaning:
          "The most widely used Dasha system in Vedic astrology, based on 120-year cycles divided among 9 planets.",
      },
      {
        term: "Antardasha",
        meaning:
          "Sub-period within a Mahadasha. Each major period is divided into smaller sub-periods for more specific timing.",
      },
    ],
    chapters: [
      { time: "0:00", label: "Introduction to Vimshottari Dasha system" },
      { time: "3:30", label: "Jupiter's nature and significations" },
      { time: "8:00", label: "Jupiter Dasha results by ascendant" },
      { time: "15:20", label: "Antardasha periods within Jupiter Dasha" },
      { time: "21:00", label: "How to maximize Jupiter Dasha blessings" },
    ],
  },
  {
    id: "oIRCRsQkxuA",
    url: "https://youtu.be/oIRCRsQkxuA",
    title: "Rahu & Ketu: The Shadow Planets Explained",
    channel: "Cosmic Vedic",
    duration: "31:18",
    views: "543K",
    topic: "Rahu · Ketu · Nodes · Past Life",
    accent: C.rose,
    accentPale: C.rosePale,
    accentBorder: "rgba(244,114,182,0.25)",
    planetGlyph: "☊",
    category: "Nodes",
    simplified: `Rahu and Ketu are the lunar nodes — the two points where the Moon's orbit crosses the Sun's path. Unlike other planets, they have no physical form; they are shadow planets (Chaya Grahas) that cast psychological and karmic shadows.\n\nRahu represents your soul's obsession in this lifetime — what you're moving toward, often with intense desire and confusion. Ketu represents what you've already mastered in past lives — things that come easily but feel hollow or detached.\n\nTogether they form an axis in your chart that tells the story of your karmic journey — where you've been (Ketu) and where you're headed (Rahu). The 18-month Rahu-Ketu transit through different houses is one of the most significant transit cycles to watch.`,
    keyInsights: [
      {
        emoji: "☊",
        title: "Rahu: your soul's hunger",
        body: "Rahu obsesses over what it wants but doesn't understand. This house/sign in your chart is where you crave the most — and where confusion is greatest.",
      },
      {
        emoji: "☋",
        title: "Ketu: past-life mastery",
        body: "Ketu brings detachment and spiritual gifts. It rules what you've already 'done' — so it feels effortless but meaningless.",
      },
      {
        emoji: "🐍",
        title: "The 18-month transit",
        body: "Rahu and Ketu change signs together every 18 months, creating waves of karmic activity in whichever houses they occupy.",
      },
      {
        emoji: "🌑",
        title: "Eclipse seasons",
        body: "Eclipses happen when Sun or Moon conjuncts the nodes. These are powerful reset points — old karma surfaces to be resolved.",
      },
    ],
    glossary: [
      {
        term: "Chaya Graha",
        meaning:
          "Shadow planet. Rahu and Ketu have no physical body — they are mathematical points representing karmic intersections.",
      },
      {
        term: "Rahu",
        meaning:
          "North Node of the Moon. Associated with worldly desires, foreign connections, illusion, and material obsession.",
      },
      {
        term: "Ketu",
        meaning:
          "South Node of the Moon. Associated with past-life karma, spirituality, detachment, and liberation (Moksha).",
      },
      {
        term: "Grahan Yoga",
        meaning:
          "Eclipse combination. When Sun or Moon is closely conjunct Rahu or Ketu — creates powerful but turbulent energy.",
      },
    ],
    chapters: [
      { time: "0:00", label: "What are Rahu and Ketu? (Mythology)" },
      { time: "5:10", label: "Rahu in all 12 houses" },
      { time: "13:45", label: "Ketu in all 12 houses" },
      { time: "22:00", label: "Rahu-Ketu transit — what to expect" },
      { time: "27:30", label: "Remedies for Rahu and Ketu" },
    ],
  },
];

// ── Section Header ─────────────────────────────────────────────────────────────
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

// ── 1. Page Header ─────────────────────────────────────────────────────────────
function VideoLibraryHeader({ fontsLoaded, onAddVideo }) {
  return (
    <LinearGradient colors={["#080618", "#0F0B2E", "#0D0B1A"]} style={vlh.wrap}>
      {[...Array(14)].map((_, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            borderRadius: 2,
            backgroundColor: C.ink,
            opacity: 0.15 + (i % 4) * 0.06,
            top: 8 + ((i * 31) % 130),
            left: (i * 71) % (width - 12),
          }}
        />
      ))}
      <View style={vlh.topRow}>
        <View>
          <Text
            style={[vlh.eyebrow, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            ✦ Vedic Video Wisdom
          </Text>
          <Text style={[vlh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
            Astrology{"\n"}
            <Text style={{ color: C.goldLight }}>Video Library</Text>
          </Text>
          <Text
            style={[vlh.subtitle, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            AI-simplified transcripts · Key insights · Concept glossary
          </Text>
        </View>
        <LinearGradient colors={[C.rose, "#B03060"]} style={vlh.iconBox}>
          <MaterialCommunityIcons name="play-circle" size={22} color="#FFF" />
        </LinearGradient>
      </View>

      <View style={vlh.statsRow}>
        {[
          { val: "4", label: "Videos Added" },
          { val: "AI", label: "Simplified" },
          { val: "16", label: "Key Insights" },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              vlh.stat,
              i < 2 && { borderRightWidth: 0.5, borderRightColor: C.divider },
            ]}
          >
            <Text
              style={[vlh.statVal, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {s.val}
            </Text>
            <Text
              style={[
                vlh.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onAddVideo}
        style={vlh.addBtn}
      >
        <LinearGradient
          colors={[C.moonLight, C.moon]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={vlh.addBtnGrad}
        >
          <Ionicons
            name="add-circle-outline"
            size={16}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text
            style={[
              vlh.addBtnTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Add YouTube Video
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}
const vlh = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === "android" ? 52 : 68,
    paddingBottom: 24,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  eyebrow: { fontSize: 11, color: C.gold, letterSpacing: 1.2, marginBottom: 6 },
  title: { fontSize: 38, color: C.ink, lineHeight: 44 },
  subtitle: { fontSize: 12, color: C.inkMuted, marginTop: 6, lineHeight: 18 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.rose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 16,
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statVal: { fontSize: 18, color: C.goldLight },
  statLabel: { fontSize: 10, color: C.inkMuted, marginTop: 2 },
  addBtn: { borderRadius: 18, overflow: "hidden" },
  addBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  addBtnTxt: { fontSize: 14, color: "#FFF" },
});

// ── 2. Featured Hero ───────────────────────────────────────────────────────────
function FeaturedHero({ video, fontsLoaded, onOpenTranscript, onAskAI }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={fh.card}>
        <View style={fh.thumbWrap}>
          <Image
            source={{ uri: thumbUrl(video.id) }}
            style={fh.thumb}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.85)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={fh.playBtnWrap}>
            <LinearGradient
              colors={[video.accent + "EE", video.accent]}
              style={fh.playBtn}
            >
              <Ionicons name="play" size={22} color="#FFF" />
            </LinearGradient>
          </View>
          <View style={fh.durationBadge}>
            <Text style={fh.durationTxt}>{video.duration}</Text>
          </View>
          <View
            style={[
              fh.planetBadge,
              {
                backgroundColor: video.accent + "30",
                borderColor: video.accent + "60",
              },
            ]}
          >
            <Text style={[fh.planetGlyph, { color: video.accent }]}>
              {video.planetGlyph}
            </Text>
            <Text style={[fh.planetTxt, { color: video.accent }]}>
              {" "}
              {video.category}
            </Text>
          </View>
          <View style={fh.overlay}>
            <Text
              style={[
                fh.overlayTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
              numberOfLines={2}
            >
              {video.title}
            </Text>
            <View style={fh.metaRow}>
              <Ionicons name="eye-outline" size={12} color={C.inkMuted} />
              <Text
                style={[fh.meta, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {" "}
                {video.views} views
              </Text>
              <Text style={fh.dot}>·</Text>
              <Text
                style={[fh.meta, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {video.channel}
              </Text>
            </View>
          </View>
        </View>

        <View style={fh.tagRow}>
          {video.topic.split(" · ").map((t, i) => (
            <View
              key={i}
              style={[
                fh.tag,
                {
                  backgroundColor: video.accentPale,
                  borderColor: video.accentBorder,
                },
              ]}
            >
              <Text
                style={[
                  fh.tagTxt,
                  { color: video.accent },
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {t}
              </Text>
            </View>
          ))}
        </View>

        <View style={fh.btnRow}>
          <TouchableOpacity
            style={fh.transcriptBtn}
            onPress={onOpenTranscript}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={[C.goldLight + "EE", C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={fh.transcriptGrad}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                size={14}
                color="#0D0B1A"
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  fh.transcriptTxt,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                View Transcript
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={fh.aiBtn}
            onPress={onAskAI}
            activeOpacity={0.85}
          >
            <LinearGradient colors={[C.moonLight, C.moon]} style={fh.aiGrad}>
              <MaterialCommunityIcons
                name="robot"
                size={14}
                color="#FFF"
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  fh.aiTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Ask AI
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const fh = StyleSheet.create({
  card: {
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
  thumbWrap: {
    height: 220,
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: "100%" },
  playBtnWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -28,
    marginLeft: -28,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  durationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationTxt: { fontSize: 11, color: "#FFF", fontWeight: "600" },
  planetBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  planetGlyph: { fontSize: 14 },
  planetTxt: { fontSize: 11 },
  overlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 14 },
  overlayTitle: {
    fontSize: 20,
    color: "#FFF",
    lineHeight: 26,
    marginBottom: 6,
  },
  metaRow: { flexDirection: "row", alignItems: "center" },
  meta: { fontSize: 11, color: "rgba(255,255,255,0.6)" },
  dot: { fontSize: 11, color: "rgba(255,255,255,0.3)", marginHorizontal: 5 },
  tagRow: {
    flexDirection: "row",
    padding: 14,
    gap: 8,
    flexWrap: "wrap",
    paddingBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  tagTxt: { fontSize: 11.5 },
  btnRow: { flexDirection: "row", padding: 14, paddingTop: 6, gap: 10 },
  transcriptBtn: { flex: 1, borderRadius: 16, overflow: "hidden" },
  transcriptGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  transcriptTxt: { fontSize: 13, color: "#0D0B1A" },
  aiBtn: { borderRadius: 16, overflow: "hidden" },
  aiGrad: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiTxt: { fontSize: 13, color: "#FFF" },
});

// ── 3. Video Carousel ──────────────────────────────────────────────────────────
function VideoCarousel({ videos, selectedId, onSelect, fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="All Videos"
        sub="Tap to explore"
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
        {videos.map((v) => {
          const isActive = v.id === selectedId;
          return (
            <TouchableOpacity
              key={v.id}
              onPress={() => onSelect(v.id)}
              activeOpacity={0.88}
              style={[
                vc.card,
                isActive && {
                  borderColor: v.accent,
                  borderWidth: 1.5,
                  shadowColor: v.accent,
                  shadowOpacity: 0.4,
                  shadowRadius: 14,
                  elevation: 6,
                },
              ]}
            >
              <View style={vc.thumbWrap}>
                <Image
                  source={{ uri: thumbUrlMQ(v.id) }}
                  style={vc.thumb}
                  resizeMode="cover"
                />
                {isActive && (
                  <LinearGradient
                    colors={[v.accent + "30", "transparent"]}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                {isActive && (
                  <View style={vc.activeBadge}>
                    <View style={vc.activeDot} />
                    <Text style={vc.activeTxt}>Viewing</Text>
                  </View>
                )}
                <View style={vc.durationTag}>
                  <Text style={vc.durationTagTxt}>{v.duration}</Text>
                </View>
              </View>
              <View style={vc.body}>
                <Text
                  style={[vc.title, fontsLoaded && { fontFamily: SERIF.bold }]}
                  numberOfLines={2}
                >
                  {v.title}
                </Text>
                <View style={vc.metaRow}>
                  <Text style={[vc.planet, { color: v.accent }]}>
                    {v.planetGlyph}{" "}
                  </Text>
                  <Text
                    style={[
                      vc.channel,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {v.channel}
                  </Text>
                </View>
                <View
                  style={[
                    vc.viewsBadge,
                    {
                      backgroundColor: v.accentPale,
                      borderColor: v.accentBorder,
                    },
                  ]}
                >
                  <Ionicons name="eye-outline" size={10} color={v.accent} />
                  <Text
                    style={[
                      vc.viewsTxt,
                      { color: v.accent },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {" "}
                    {v.views}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
const vc = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  thumbWrap: {
    height: 110,
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  thumb: { width: "100%", height: "100%" },
  activeBadge: {
    position: "absolute",
    top: 8,
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
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 4,
  },
  activeTxt: { fontSize: 9.5, color: C.green },
  durationTag: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
  durationTagTxt: { fontSize: 10, color: "#FFF", fontWeight: "600" },
  body: { padding: 10 },
  title: { fontSize: 14, color: C.ink, lineHeight: 19, marginBottom: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  planet: { fontSize: 14 },
  channel: { fontSize: 11, color: C.inkMuted, flex: 1 },
  viewsBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  viewsTxt: { fontSize: 10.5 },
});

// ── 4. AI Simplified ──────────────────────────────────────────────────────────
function AISimplified({ video, fontsLoaded }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={ais.card}>
        <LinearGradient
          colors={[video.accent + "15", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          borderRadius={24}
        />
        <View style={ais.header}>
          <LinearGradient
            colors={[C.moonLight, C.moon, C.moonDark]}
            style={ais.aiIcon}
          >
            <MaterialCommunityIcons name="robot" size={16} color="#FFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[
                ais.headerTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              AI-Simplified Explanation
            </Text>
            <Text
              style={[
                ais.headerSub,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Complex astrology, plain language
            </Text>
          </View>
          <View style={ais.aiBadge}>
            <View style={ais.aiDot} />
            <Text
              style={[
                ais.aiLive,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              AI
            </Text>
          </View>
        </View>
        <View style={ais.divider} />
        {video.simplified.split("\n\n").map((para, i) => (
          <Text
            key={i}
            style={[ais.para, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {para}
          </Text>
        ))}
      </View>
    </View>
  );
}
const ais = StyleSheet.create({
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    padding: 18,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    overflow: "hidden",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  aiIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, color: C.ink },
  headerSub: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  aiDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.moon,
    marginRight: 4,
  },
  aiLive: { fontSize: 11, color: C.moon },
  divider: { height: 0.5, backgroundColor: C.divider, marginBottom: 14 },
  para: { fontSize: 15, color: C.inkMid, lineHeight: 24, marginBottom: 12 },
});

// ── 5. Key Insights ────────────────────────────────────────────────────────────
function KeyInsights({ video, fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Key Insights"
        sub={`${video.keyInsights.length} takeaways extracted by AI`}
        fontsLoaded={fontsLoaded}
      />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        {video.keyInsights.map((insight, i) => (
          <View key={i} style={ki.card}>
            <LinearGradient
              colors={[video.accent + "12", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <View
              style={[
                ki.numBadge,
                {
                  backgroundColor: video.accentPale,
                  borderColor: video.accentBorder,
                },
              ]}
            >
              <Text style={[ki.numTxt, { color: video.accent }]}>
                {String(i + 1).padStart(2, "0")}
              </Text>
            </View>
            <View style={ki.content}>
              <View style={ki.titleRow}>
                <Text style={ki.emoji}>{insight.emoji}</Text>
                <Text
                  style={[ki.title, fontsLoaded && { fontFamily: SERIF.bold }]}
                >
                  {insight.title}
                </Text>
              </View>
              <Text
                style={[ki.body, fontsLoaded && { fontFamily: SERIF.regular }]}
              >
                {insight.body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const ki = StyleSheet.create({
  card: {
    flexDirection: "row",
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
    alignItems: "flex-start",
    gap: 12,
  },
  numBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    flexShrink: 0,
  },
  numTxt: { fontSize: 13, fontWeight: "700" },
  content: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  emoji: { fontSize: 16 },
  title: { fontSize: 16, color: C.ink, flex: 1, lineHeight: 21 },
  body: { fontSize: 13.5, color: C.inkMid, lineHeight: 21 },
});

// ── 6. Concept Glossary ────────────────────────────────────────────────────────
function ConceptGlossary({ video, fontsLoaded }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <View>
      <SecHeader
        title="Concept Glossary"
        sub="Terms from this video — decoded"
        fontsLoaded={fontsLoaded}
      />
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        {video.glossary.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setExpanded(expanded === i ? null : i)}
            activeOpacity={0.88}
            style={cg.row}
          >
            <View style={cg.termRow}>
              <View
                style={[
                  cg.termBadge,
                  {
                    backgroundColor: video.accentPale,
                    borderColor: video.accentBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    cg.termTxt,
                    { color: video.accent },
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {item.term}
                </Text>
              </View>
              <Ionicons
                name={expanded === i ? "chevron-up" : "chevron-down"}
                size={14}
                color={C.inkMuted}
              />
            </View>
            {expanded === i && (
              <Text
                style={[
                  cg.meaning,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {item.meaning}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const cg = StyleSheet.create({
  row: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  termBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  termTxt: { fontSize: 14 },
  meaning: {
    fontSize: 13.5,
    color: C.inkMid,
    lineHeight: 21,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
});

// ── 7. Chapter Markers ─────────────────────────────────────────────────────────
function ChapterMarkers({ video, fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Chapters"
        sub="Jump to any section"
        fontsLoaded={fontsLoaded}
      />
      <View style={{ paddingHorizontal: 16 }}>
        {video.chapters.map((ch, i) => (
          <TouchableOpacity key={i} style={cm.row} activeOpacity={0.85}>
            <View style={[cm.timeBadge, { backgroundColor: video.accentPale }]}>
              <Text
                style={[
                  cm.time,
                  { color: video.accent },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {ch.time}
              </Text>
            </View>
            <Text
              style={[cm.label, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {ch.label}
            </Text>
            <Ionicons
              name="play-circle-outline"
              size={18}
              color={video.accent}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const cm = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  timeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    minWidth: 52,
    alignItems: "center",
  },
  time: { fontSize: 12 },
  label: { flex: 1, fontSize: 14, color: C.inkMid, lineHeight: 20 },
});

// ── SHARED: Bottom Sheet Shell ─────────────────────────────────────────────────
// FIX: The original code used a TouchableOpacity overlay as a SIBLING before
// the sheet View, which breaks dismiss-on-tap in many RN versions. The correct
// pattern is: Modal > outer View (flex:1, justify:'flex-end') > absolute
// overlay TouchableOpacity covering the whole screen BEHIND the sheet, and
// the sheet itself sitting at the bottom via the flex-end alignment.

function BottomSheet({
  visible,
  onClose,
  children,
  heightFraction = 0.88,
  borderColor = C.moonBorder,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Full-screen container, flex-end so sheet sits at bottom */}
      <View style={bss.root}>
        {/* Dimmed backdrop — pressing it closes the sheet */}
        <TouchableOpacity
          style={bss.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* The actual sheet — KeyboardAvoidingView so input fields lift */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[
            bss.sheet,
            { maxHeight: height * heightFraction, borderColor },
          ]}
        >
          {children}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
const bss = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 0.5,
    overflow: "hidden",
    // Shadow on the sheet itself
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 24,
  },
});

const Handle = () => (
  <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
    <View
      style={{
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.inkMuted,
      }}
    />
  </View>
);

// ── 8. Transcript Modal ────────────────────────────────────────────────────────
function TranscriptModal({ visible, onClose, video, fontsLoaded }) {
  const MOCK_TRANSCRIPT = `[0:00] Welcome to today's session on ${video?.title || "astrology"}. I'm going to walk you through everything you need to know in simple, practical terms.

[0:45] Let's start from the very beginning. In Vedic astrology, every planet has a specific role. Think of the planets as different departments in a company — each one manages a specific area of your life.

[2:10] ${video?.keyInsights?.[0]?.title || "First key concept"}: ${video?.keyInsights?.[0]?.body || "This is an important point from the video."}

[4:30] Now here is where it gets really interesting. Most people think this works one way, but the reality is much more nuanced. The ancient rishis (sages) knew something that modern people are just beginning to understand.

[6:15] ${video?.keyInsights?.[1]?.title || "Second concept"}: ${video?.keyInsights?.[1]?.body || "Another important insight here."}

[8:40] Let me give you a practical example. Say your chart has this placement at birth — here's what that actually means for your day-to-day life, not just the abstract theory.

[11:00] ${video?.keyInsights?.[2]?.title || "Third point"}: ${video?.keyInsights?.[2]?.body || "More important context."}

[14:20] The remedies people recommend for this are varied. Some say mantras, others suggest gemstones, and some recommend specific fasting days. I'll tell you which ones actually work based on my 20 years of practice.

[16:50] ${video?.keyInsights?.[3]?.title || "Fourth insight"}: ${video?.keyInsights?.[3]?.body || "Final major takeaway."}

[18:00] To summarise everything we've covered today: the planet's placement, the sign it occupies, and the houses it rules and aspects — all of these work together as one integrated system, not isolated components.`;

  return (
    <BottomSheet visible={visible} onClose={onClose} borderColor={C.moonBorder}>
      <LinearGradient colors={["#13112A", "#1C1A40"]} style={{ flex: 1 }}>
        <Handle />

        {/* Header */}
        <View style={tm.header}>
          <View style={tm.videoThumb}>
            {video && (
              <Image
                source={{ uri: thumbUrlMQ(video.id) }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                tm.headerTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
              numberOfLines={2}
            >
              {video?.title}
            </Text>
            <Text
              style={[
                tm.headerSub,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Full transcript · AI-processed
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={tm.closeBtn}>
            <Ionicons name="close" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>

        {/* AI banner */}
        <View style={tm.aiBanner}>
          <MaterialCommunityIcons name="robot" size={14} color={C.moon} />
          <Text
            style={[
              tm.aiBannerTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {" "}
            Transcript extracted · Key moments marked · Simplified by AI
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tm.scrollContent}
        >
          {/* Chapter pills */}
          <Text
            style={[tm.sectionLabel, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Chapters
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {video?.chapters?.map((ch, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  tm.chapterPill,
                  {
                    backgroundColor: video.accentPale,
                    borderColor: video.accentBorder,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tm.chapterPillTime,
                    { color: video.accent },
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {ch.time}
                </Text>
                <Text
                  style={[
                    tm.chapterPillLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                  numberOfLines={2}
                >
                  {ch.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Full transcript */}
          <Text
            style={[tm.sectionLabel, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Full Transcript
          </Text>
          {MOCK_TRANSCRIPT.split("\n\n").map((block, i) => {
            const timeMatch = block.match(/^\[(\d+:\d+)\]/);
            const restText = block.replace(/^\[\d+:\d+\]\s*/, "");
            return (
              <View key={i} style={tm.transcriptBlock}>
                {timeMatch && (
                  <View
                    style={[
                      tm.timeStamp,
                      {
                        backgroundColor: video?.accentPale,
                        borderColor: video?.accentBorder,
                      },
                    ]}
                  >
                    <Text style={[tm.timeStampTxt, { color: video?.accent }]}>
                      {timeMatch[1]}
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    tm.transcriptTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {restText}
                </Text>
              </View>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </BottomSheet>
  );
}
const tm = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  videoThumb: {
    width: 60,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    overflow: "hidden",
  },
  headerTitle: { fontSize: 16, color: C.ink, lineHeight: 22 },
  headerSub: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.moonPale,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 6,
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  aiBannerTxt: { fontSize: 12, color: C.moonLight },
  scrollContent: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 18, color: C.ink, marginTop: 16, marginBottom: 12 },
  chapterPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 0.5,
    marginRight: 10,
    minWidth: 130,
    maxWidth: 200,
  },
  chapterPillTime: { fontSize: 12, marginBottom: 3 },
  chapterPillLabel: { fontSize: 12, color: C.inkMuted, lineHeight: 17 },
  transcriptBlock: { marginBottom: 18 },
  timeStamp: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
    marginBottom: 6,
  },
  timeStampTxt: { fontSize: 11, fontWeight: "600" },
  transcriptTxt: { fontSize: 14, color: C.inkMid, lineHeight: 23 },
});

// ── 9. Ask AI Modal ────────────────────────────────────────────────────────────
function AskAIModal({ visible, onClose, video, fontsLoaded }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const QUICK_QUESTIONS = [
    "What's the most important takeaway?",
    "Explain this in beginner terms",
    "How does this affect my daily life?",
    "What remedies are mentioned?",
  ];

  const askQuestion = useCallback(
    async (q) => {
      const q2 = q || question;
      if (!q2.trim()) return;
      setLoading(true);
      setAnswer(null);
      // Scroll down after a short delay to show loading state
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: `You are a Vedic astrology expert helping users understand an astrology video called "${video?.title}". The video is about: ${video?.topic}.

The simplified summary of the video is:
${video?.simplified}

Key insights from the video:
${video?.keyInsights?.map((k) => `• ${k.title}: ${k.body}`).join("\n")}

Glossary terms covered:
${video?.glossary?.map((g) => `• ${g.term}: ${g.meaning}`).join("\n")}

User's question: "${q2}"

Answer clearly and helpfully in 2-4 short paragraphs. Use plain English but include Sanskrit terms (with translations) where relevant. Be warm, knowledgeable, and practical.`,
              },
            ],
          }),
        });
        const data = await res.json();
        const text = data.content?.find((c) => c.type === "text")?.text;
        setAnswer(
          text || "I wasn't able to generate an answer. Please try again.",
        );
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          150,
        );
      } catch (e) {
        setAnswer("There was an error connecting to AI. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [question, video],
  );

  const reset = () => {
    setQuestion("");
    setAnswer(null);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      borderColor={C.moonBorder}
    >
      <LinearGradient colors={["#0F0B2E", "#1C1A40"]} style={{ flex: 1 }}>
        <Handle />

        {/* Header */}
        <View style={aa.header}>
          <LinearGradient
            colors={[C.moonLight, C.moon, C.moonDark]}
            style={aa.aiIcon}
          >
            <MaterialCommunityIcons name="robot" size={20} color="#FFF" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                aa.headerTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              Ask AI About This Video
            </Text>
            <Text
              style={[
                aa.headerSub,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
              numberOfLines={1}
            >
              {video?.title}
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={aa.closeBtn}>
            <Ionicons name="close" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={aa.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick questions */}
          <Text
            style={[
              aa.quickLabel,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Quick questions
          </Text>
          <View style={aa.quickGrid}>
            {QUICK_QUESTIONS.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={aa.quickChip}
                onPress={() => {
                  setQuestion(q);
                  askQuestion(q);
                }}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    aa.quickChipTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {q}
                </Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={14}
                  color={C.moon}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Input row */}
          <View style={aa.inputWrap}>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask anything about this video…"
              placeholderTextColor={C.inkMuted}
              style={[aa.input, fontsLoaded && { fontFamily: SERIF.regular }]}
              multiline
              onSubmitEditing={() => askQuestion()}
            />
            <TouchableOpacity
              onPress={() => askQuestion()}
              disabled={!question.trim() || loading}
              style={[
                aa.sendBtn,
                (!question.trim() || loading) && { opacity: 0.4 },
              ]}
            >
              <LinearGradient
                colors={[C.moonLight, C.moon]}
                style={aa.sendGrad}
              >
                <Ionicons name="send" size={15} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading && (
            <View style={aa.loadingWrap}>
              <ActivityIndicator color={C.moon} size="small" />
              <Text
                style={[
                  aa.loadingTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                Consulting the stars…
              </Text>
            </View>
          )}

          {/* Answer */}
          {answer && (
            <View style={aa.answerCard}>
              <View style={aa.answerHeader}>
                <LinearGradient
                  colors={[C.moonLight, C.moon]}
                  style={aa.answerIconBadge}
                >
                  <MaterialCommunityIcons name="robot" size={12} color="#FFF" />
                </LinearGradient>
                <Text
                  style={[
                    aa.answerLabel,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {" "}
                  AI Response
                </Text>
              </View>
              <Text
                style={[
                  aa.answerTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {answer}
              </Text>
              <TouchableOpacity
                style={aa.newQuestion}
                onPress={reset}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh-outline" size={13} color={C.moon} />
                <Text
                  style={[
                    aa.newQuestionTxt,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                  ]}
                >
                  {" "}
                  Ask another question
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </BottomSheet>
  );
}
const aa = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  quickLabel: {
    fontSize: 14,
    color: C.inkMuted,
    marginTop: 16,
    marginBottom: 10,
  },
  quickGrid: { gap: 8, marginBottom: 16 },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bgCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  quickChipTxt: { fontSize: 13.5, color: C.inkMid, lineHeight: 19, flex: 1 },
  inputWrap: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    padding: 12,
    gap: 10,
    alignItems: "flex-end",
    marginBottom: 12,
  },
  input: { flex: 1, color: C.ink, fontSize: 14, maxHeight: 80, minHeight: 36 },
  sendBtn: { borderRadius: 12, overflow: "hidden" },
  sendGrad: { padding: 10 },
  loadingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  loadingTxt: { fontSize: 14, color: C.moonLight },
  answerCard: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    marginBottom: 12,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  answerIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  answerLabel: { fontSize: 13, color: C.moon },
  answerTxt: { fontSize: 15, color: C.inkMid, lineHeight: 24 },
  newQuestion: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  newQuestionTxt: { fontSize: 13, color: C.moon },
});

// ── 10. Add Video Modal ────────────────────────────────────────────────────────
// FIX: AddVideoModal was also a bottom sheet — updated to use BottomSheet shell.
function AddVideoModal({ visible, onClose, fontsLoaded }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const handleAdd = () => {
    const id = getYTId(url);
    if (!id) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onClose();
        setUrl("");
        setStatus(null);
      }, 1400);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setUrl("");
    setStatus(null);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      heightFraction={0.6}
      borderColor={C.goldBorder}
    >
      <LinearGradient colors={["#13112A", "#1C1A40"]} style={{ flex: 1 }}>
        <Handle />

        {/* Header */}
        <View style={av.header}>
          <LinearGradient colors={[C.goldLight, C.gold]} style={av.icon}>
            <Ionicons name="add" size={18} color="#0D0B1A" />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[av.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
              Add YouTube Video
            </Text>
            <Text
              style={[av.hint, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              Paste a YouTube astrology link — AI will simplify it for you
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={av.closeBtn}>
            <Ionicons name="close" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>

        <View style={av.body}>
          {/* URL input */}
          <View
            style={[
              av.inputWrap,
              status === "error" && { borderColor: C.red + "80" },
            ]}
          >
            <Ionicons
              name="logo-youtube"
              size={16}
              color={C.red}
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={url}
              onChangeText={(t) => {
                setUrl(t);
                setStatus(null);
              }}
              placeholder="https://youtu.be/..."
              placeholderTextColor={C.inkMuted}
              style={[av.input, fontsLoaded && { fontFamily: SERIF.regular }]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {url.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setUrl("");
                  setStatus(null);
                }}
              >
                <Ionicons name="close-circle" size={16} color={C.inkMuted} />
              </TouchableOpacity>
            )}
          </View>

          {status === "error" && (
            <View style={av.statusRow}>
              <Ionicons name="alert-circle-outline" size={14} color={C.red} />
              <Text
                style={[
                  av.errorTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {" "}
                Please enter a valid YouTube URL
              </Text>
            </View>
          )}
          {status === "success" && (
            <View style={av.statusRow}>
              <Ionicons name="checkmark-circle" size={14} color={C.green} />
              <Text
                style={[
                  av.successTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {" "}
                Video added! Processing transcript…
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View style={av.btnRow}>
            <TouchableOpacity
              onPress={handleClose}
              style={av.cancelBtn}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  av.cancelTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAdd}
              style={[
                av.addBtn,
                (status === "loading" || status === "success") && {
                  opacity: 0.6,
                },
              ]}
              activeOpacity={0.88}
              disabled={status === "loading" || status === "success"}
            >
              <LinearGradient
                colors={[C.moonLight, C.moon]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={av.addGrad}
              >
                {status === "loading" ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="robot"
                      size={14}
                      color="#FFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[
                        av.addTxt,
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      Process with AI
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </BottomSheet>
  );
}
const av = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, color: C.ink },
  hint: { fontSize: 12, color: C.inkMuted, marginTop: 3, lineHeight: 18 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgSurface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 10,
  },
  input: { flex: 1, color: C.ink, fontSize: 14 },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  errorTxt: { fontSize: 12.5, color: C.red },
  successTxt: { fontSize: 12.5, color: C.green },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  cancelTxt: { fontSize: 14, color: C.inkMuted },
  addBtn: { flex: 2, borderRadius: 16, overflow: "hidden" },
  addGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  addTxt: { fontSize: 14, color: "#FFF" },
});

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function AstrologyVideoLibrary({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const [selectedId, setSelectedId] = useState(SEED_VIDEOS[0].id);
  const [transcriptVisible, setTranscriptVisible] = useState(false);
  const [askAIVisible, setAskAIVisible] = useState(false);
  const [addVideoVisible, setAddVideoVisible] = useState(false);

  const selectedVideo =
    SEED_VIDEOS.find((v) => v.id === selectedId) || SEED_VIDEOS[0];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <VideoLibraryHeader
          fontsLoaded={fontsLoaded}
          onAddVideo={() => setAddVideoVisible(true)}
        />

        <SecHeader
          title="Now Exploring"
          sub={selectedVideo.topic}
          fontsLoaded={fontsLoaded}
        />
        <FeaturedHero
          video={selectedVideo}
          fontsLoaded={fontsLoaded}
          onOpenTranscript={() => setTranscriptVisible(true)}
          onAskAI={() => setAskAIVisible(true)}
        />

        <VideoCarousel
          videos={SEED_VIDEOS}
          selectedId={selectedId}
          onSelect={setSelectedId}
          fontsLoaded={fontsLoaded}
        />

        <SecHeader
          title="Plain English Summary"
          sub="Complex concepts, simply explained"
          fontsLoaded={fontsLoaded}
        />
        <AISimplified video={selectedVideo} fontsLoaded={fontsLoaded} />

        <KeyInsights video={selectedVideo} fontsLoaded={fontsLoaded} />
        <ChapterMarkers video={selectedVideo} fontsLoaded={fontsLoaded} />
        <ConceptGlossary video={selectedVideo} fontsLoaded={fontsLoaded} />

        {/* Bottom quote */}
        <View
          style={{
            paddingHorizontal: 28,
            paddingVertical: 28,
            marginBottom: 24,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 1,
              backgroundColor: C.goldBorder,
              marginVertical: 16,
            }}
          />
          <Text
            style={[
              {
                fontSize: 17,
                lineHeight: 28,
                color: C.inkMid,
                textAlign: "center",
                fontStyle: "italic",
              },
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            "The planets do not compel — they impel. The stars incline, they do
            not bind."
          </Text>
          <Text
            style={[
              {
                fontSize: 12,
                color: C.gold,
                textAlign: "center",
                marginTop: 6,
              },
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            — Traditional Vedic Maxim
          </Text>
          <View
            style={{
              width: 40,
              height: 1,
              backgroundColor: C.goldBorder,
              marginVertical: 16,
            }}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <TranscriptModal
        visible={transcriptVisible}
        onClose={() => setTranscriptVisible(false)}
        video={selectedVideo}
        fontsLoaded={fontsLoaded}
      />
      <AskAIModal
        visible={askAIVisible}
        onClose={() => setAskAIVisible(false)}
        video={selectedVideo}
        fontsLoaded={fontsLoaded}
      />
      <AddVideoModal
        visible={addVideoVisible}
        onClose={() => setAddVideoVisible(false)}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}
