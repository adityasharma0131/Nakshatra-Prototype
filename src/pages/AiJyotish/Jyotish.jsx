/**
 * Nakshatra — AIJyotishEngine
 *
 * Design language: "Dark Celestial Luxury" (matches HomeScreen v5)
 *  - ChatGPT-style layout: collapsible sidebar + main chat area
 *  - Voice mode with pulsing celestial orb animation
 *  - Typing indicator with bouncing dots
 *  - Cormorant Garamond serif headlines
 *  - Gold + violet accent system
 *
 * Install (same as HomeScreen):
 *   npx expo install expo-linear-gradient
 *   npx expo install @expo-google-fonts/cormorant-garamond expo-font
 *   npx expo install react-native-safe-area-context
 *   npx expo install @react-native-async-storage/async-storage (optional, for history)
 *
 * CHANGES:
 *  - NakshatraLogoImg → sidebar logo mark + AI chat avatar
 *  - AVATAR_URL       → user profile in sidebar bottom row + user chat bubbles
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";

// ─── Asset Imports ───────────────────────────────────────────────────────────────
import NakshatraLogoImg from "../../../assets/ChatGPT Image Jun 7, 2026, 01_36_49 AM-Photoroom.png";
const AVATAR_URL = "https://randomuser.me/api/portraits/men/1.jpg";

import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const SIDEBAR_W = width * 0.75;

// ─── Design Tokens ───────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  bgInput: "#0F0D20",

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

// ─── Seed Data ───────────────────────────────────────────────────────────────────
const CHAT_HISTORY = [
  {
    id: "1",
    title: "My Kundli Reading",
    sub: "Moon in Rohini...",
    date: "Today",
    active: true,
  },
  {
    id: "2",
    title: "Marriage Muhurta 2025",
    sub: "Best dates for ceremony",
    date: "Yesterday",
    active: false,
  },
  {
    id: "3",
    title: "Career & Saturn Transit",
    sub: "Shani mahadasha impact",
    date: "Jun 5",
    active: false,
  },
  {
    id: "4",
    title: "Mangal Dosha Analysis",
    sub: "Compatibility concerns",
    date: "Jun 3",
    active: false,
  },
  {
    id: "5",
    title: "Daily Horoscope — Simha",
    sub: "Leo forecast for June",
    date: "Jun 1",
    active: false,
  },
];

const SUGGESTION_CHIPS = [
  "Read my Kundli",
  "Today's Panchang",
  "Rahu Ketu transit",
  "Lucky numbers today",
  "Career guidance",
  "Marriage timing",
];

const SEED_MESSAGES = [
  {
    id: "m1",
    role: "ai",
    text: "Namaste 🙏 I am Jyotish AI — your Vedic astrology companion powered by ancient wisdom and modern intelligence.\n\nShare your birth details or ask me anything about your stars, Kundli, or life path.",
    ts: "9:41 AM",
  },
  {
    id: "m2",
    role: "user",
    text: "What does Moon in Rohini mean for me?",
    ts: "9:42 AM",
  },
  {
    id: "m3",
    role: "ai",
    text: "Moon in Rohini is one of the most auspicious placements in Vedic astrology ✦\n\nRohini is ruled by the Moon itself and governed by Brahma, the creator. This nakshatra blesses you with:\n\n• Natural beauty and magnetic charm\n• Deep creative and artistic gifts\n• Strong material instincts and love of luxury\n• Emotional depth with nurturing tendencies\n\nFor you, the Moon here amplifies your intuition — trust your gut feelings, especially in relationships and financial decisions this month.",
    ts: "9:42 AM",
  },
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────────
function TypingDots({ fontsLoaded }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.spring(d, {
            toValue: -6,
            useNativeDriver: true,
            speed: 40,
            bounciness: 10,
          }),
          Animated.spring(d, {
            toValue: 0,
            useNativeDriver: true,
            speed: 40,
            bounciness: 8,
          }),
          Animated.delay(400),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={td.wrap}>
      {/* AI avatar — NakshatraLogoImg */}
      <View style={td.iconWrap}>
        <Image
          source={NakshatraLogoImg}
          style={{ width: 18, height: 18, borderRadius: 9 }}
          resizeMode="contain"
        />
      </View>
      <View style={td.dotsRow}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={[td.dot, { transform: [{ translateY: d }] }]}
          />
        ))}
      </View>
    </View>
  );
}

const td = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 5,
    backgroundColor: C.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.moonLight,
  },
});

// ─── Voice Orb ────────────────────────────────────────────────────────────────────
function VoiceOrb({ fontsLoaded, onClose }) {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.4)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const [listening, setListening] = useState(true);
  const [transcript, setTranscript] = useState("");

  const DEMO_PHRASES = [
    "What is my moon sign significance...",
    "Tell me about Saturn in my chart...",
    "When is my best muhurta for...",
  ];
  const phraseRef = useRef(0);

  useEffect(() => {
    const makePulse = (anim, delay, range) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: range,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
      );

    const p1 = makePulse(pulse1, 0, 1.25);
    const p2 = makePulse(pulse2, 300, 1.5);
    const p3 = makePulse(pulse3, 600, 1.75);

    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    const rotAnim = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    );

    [p1, p2, p3, glowAnim, rotAnim].forEach((a) => a.start());

    let charIdx = 0;
    const phrase = DEMO_PHRASES[phraseRef.current];
    const timer = setInterval(() => {
      charIdx++;
      setTranscript(phrase.slice(0, charIdx));
      if (charIdx >= phrase.length) clearInterval(timer);
    }, 60);

    return () => {
      [p1, p2, p3, glowAnim, rotAnim].forEach((a) => a.stop());
      clearInterval(timer);
    };
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={vo.overlay}>
      <LinearGradient
        colors={["rgba(13,11,26,0.92)", "rgba(13,11,26,0.98)"]}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={vo.closeBtn} onPress={onClose}>
        <Ionicons name="close" size={20} color={C.inkMid} />
      </TouchableOpacity>

      <Text
        style={[vo.modeLabel, fontsLoaded && { fontFamily: SERIF.semiBold }]}
      >
        ✦ Voice Conversation
      </Text>

      <View style={vo.orbArea}>
        <Animated.View
          style={[
            vo.pulseRing,
            {
              width: 220,
              height: 220,
              borderRadius: 110,
              borderColor: "rgba(123,127,232,0.08)",
              transform: [{ scale: pulse3 }],
            },
          ]}
        />
        <Animated.View
          style={[
            vo.pulseRing,
            {
              width: 170,
              height: 170,
              borderRadius: 85,
              borderColor: "rgba(123,127,232,0.15)",
              transform: [{ scale: pulse2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            vo.pulseRing,
            {
              width: 128,
              height: 128,
              borderRadius: 64,
              borderColor: "rgba(212,160,23,0.25)",
              transform: [{ scale: pulse1 }],
            },
          ]}
        />

        <Animated.View
          style={[vo.arcRing, { transform: [{ rotate: spin }] }]}
        />

        {/* Core orb — NakshatraLogoImg */}
        <Animated.View style={[vo.orbCore, { opacity: glow }]}>
          <Image
            source={NakshatraLogoImg}
            style={{ width: 90, height: 90, borderRadius: 45 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <WaveformBars listening={listening} />

      <View style={vo.transcriptWrap}>
        {transcript ? (
          <Text
            style={[
              vo.transcriptTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            "{transcript}"
          </Text>
        ) : (
          <Text
            style={[
              vo.listeningTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            Listening to your stars...
          </Text>
        )}
      </View>

      <View style={vo.controls}>
        <TouchableOpacity style={vo.ctrlBtn}>
          <Ionicons name="volume-mute-outline" size={20} color={C.inkMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={vo.micBtn}
          onPress={() => setListening((v) => !v)}
        >
          <LinearGradient
            colors={
              listening
                ? [C.goldLight, C.goldMid, C.gold]
                : ["#2A2850", "#1A1640"]
            }
            style={vo.micBtnGrad}
          >
            <Ionicons
              name={listening ? "mic" : "mic-off"}
              size={26}
              color={listening ? "#0D0B1A" : C.inkMuted}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={vo.ctrlBtn}>
          <Ionicons name="chatbubble-outline" size={20} color={C.inkMuted} />
        </TouchableOpacity>
      </View>

      <Text style={[vo.hint, fontsLoaded && { fontFamily: SERIF.regular }]}>
        Tap mic to pause · Tap chat to switch mode
      </Text>
    </View>
  );
}

// ─── Waveform Bars ────────────────────────────────────────────────────────────────
function WaveformBars({ listening }) {
  const NUM = 28;
  const anims = useRef(
    Array.from({ length: NUM }, () => new Animated.Value(4)),
  ).current;

  useEffect(() => {
    if (!listening) {
      anims.forEach((a) =>
        Animated.spring(a, { toValue: 4, useNativeDriver: false }).start(),
      );
      return;
    }

    const loops = anims.map((a, i) => {
      const h = 6 + Math.random() * 28;
      return Animated.loop(
        Animated.sequence([
          Animated.delay(i * 40),
          Animated.timing(a, {
            toValue: h,
            duration: 220 + Math.random() * 200,
            useNativeDriver: false,
          }),
          Animated.timing(a, {
            toValue: 4,
            duration: 220 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ]),
      );
    });
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [listening]);

  return (
    <View style={wf.wrap}>
      {anims.map((a, i) => (
        <Animated.View
          key={i}
          style={[
            wf.bar,
            {
              height: a,
              backgroundColor:
                i % 3 === 0
                  ? C.gold
                  : i % 3 === 1
                    ? C.moonLight
                    : "rgba(255,255,255,0.3)",
            },
          ]}
        />
      ))}
    </View>
  );
}

const wf = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 44,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    minHeight: 4,
  },
});

const vo = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  closeBtn: {
    position: "absolute",
    top: Platform.OS === "android" ? 52 : 64,
    right: 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  modeLabel: {
    fontSize: 12,
    color: C.gold,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    position: "absolute",
    top: Platform.OS === "android" ? 56 : 68,
  },
  orbArea: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pulseRing: {
    position: "absolute",
    borderWidth: 1,
  },
  arcRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderTopColor: C.gold,
    borderRightColor: "rgba(212,160,23,0.3)",
  },
  orbCore: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    shadowColor: C.moonLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  transcriptWrap: {
    minHeight: 48,
    paddingHorizontal: 32,
    marginTop: 12,
    alignItems: "center",
  },
  transcriptTxt: {
    fontSize: 18,
    color: C.ink,
    textAlign: "center",
    lineHeight: 26,
    fontStyle: "italic",
  },
  listeningTxt: {
    fontSize: 15,
    color: C.inkMuted,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 32,
  },
  ctrlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 10,
  },
  micBtnGrad: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 11,
    color: C.inkMuted,
    marginTop: 20,
    letterSpacing: 0.4,
  },
});

// ─── Sidebar ──────────────────────────────────────────────────────────────────────
function Sidebar({
  fontsLoaded,
  slideAnim,
  onClose,
  onNewChat,
  activeId,
  onSelectChat,
}) {
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SIDEBAR_W, 0],
  });

  return (
    <>
      {/* Scrim */}
      <Animated.View
        style={[sb.scrim, { opacity: slideAnim }]}
        pointerEvents={slideAnim._value > 0 ? "auto" : "none"}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Panel */}
      <Animated.View style={[sb.panel, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={["#100E28", "#0D0B1A"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={sb.topSheen} />

        {/* Header — NakshatraLogoImg as logo mark */}
        <View style={sb.header}>
          <View style={sb.logoRow}>
            <View style={sb.logoImgWrap}>
              <Image
                source={NakshatraLogoImg}
                style={{ width: 30, height: 30, borderRadius: 9 }}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text
                style={[sb.logoName, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                NAKSHATRA
              </Text>
              <Text
                style={[
                  sb.logoSub,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                Jyotish AI
              </Text>
            </View>
          </View>
          <TouchableOpacity style={sb.closeBtn} onPress={onClose}>
            <Ionicons name="chevron-back" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>

        {/* New Chat */}
        <TouchableOpacity
          style={sb.newChatBtn}
          onPress={onNewChat}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[C.goldPale, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
            borderRadius={14}
          />
          <Ionicons name="add" size={18} color={C.gold} />
          <Text
            style={[
              sb.newChatTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            New Reading
          </Text>
        </TouchableOpacity>

        <View style={sb.sectionLabel}>
          <Text
            style={[
              sb.sectionTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Recent
          </Text>
        </View>

        {/* History list */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {CHAT_HISTORY.map((h) => (
            <TouchableOpacity
              key={h.id}
              style={[sb.histItem, h.id === activeId && sb.histItemActive]}
              onPress={() => onSelectChat(h.id)}
              activeOpacity={0.8}
            >
              {h.id === activeId && (
                <LinearGradient
                  colors={[C.goldPale, "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={14}
                />
              )}
              <View style={sb.histIcon}>
                <MaterialCommunityIcons
                  name="weather-sunny"
                  size={14}
                  color={h.id === activeId ? C.gold : C.inkMuted}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={[
                    sb.histTitle,
                    fontsLoaded && { fontFamily: SERIF.semiBold },
                    h.id === activeId && { color: C.ink },
                  ]}
                >
                  {h.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    sb.histSub,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {h.sub}
                </Text>
              </View>
              <Text
                style={[
                  sb.histDate,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {h.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom user row — AVATAR_URL photo */}
        <View style={sb.userRow}>
          <Image source={{ uri: AVATAR_URL }} style={sb.userAvatarImg} />
          <View style={{ flex: 1 }}>
            <Text
              style={[sb.userName, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Arjun Sharma
            </Text>
            <Text
              style={[
                sb.userPlan,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              ✦ Premium
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const sb = StyleSheet.create({
  scrim: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 50,
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_W,
    zIndex: 60,
    paddingTop: Platform.OS === "android" ? 44 : 56,
    paddingBottom: 24,
    overflow: "hidden",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1,
    backgroundColor: "rgba(212,160,23,0.35)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoImgWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  logoName: { fontSize: 13, color: C.ink, letterSpacing: 2.5 },
  logoSub: { fontSize: 9, color: C.inkMuted, letterSpacing: 1, marginTop: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 14,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
  },
  newChatTxt: { fontSize: 14, color: C.gold },
  sectionLabel: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  sectionTxt: {
    fontSize: 10,
    color: C.inkMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  histItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 2,
    overflow: "hidden",
    position: "relative",
  },
  histItemActive: { borderWidth: 0.5, borderColor: C.goldBorder },
  histIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.bgSurface,
    alignItems: "center",
    justifyContent: "center",
  },
  histTitle: { fontSize: 13, color: C.inkMid },
  histSub: { fontSize: 10.5, color: C.inkMuted, marginTop: 1 },
  histDate: { fontSize: 10, color: C.inkMuted },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
    marginTop: 8,
  },
  // ← AVATAR_URL photo replaces the gradient initials circle
  userAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: C.moonBorder,
  },
  userName: { fontSize: 14, color: C.ink },
  userPlan: { fontSize: 10, color: C.gold, marginTop: 1 },
});

// ─── Message Bubble ───────────────────────────────────────────────────────────────
function MessageBubble({ msg, fontsLoaded }) {
  const isAI = msg.role === "ai";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 30,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        mb.row,
        isAI ? mb.rowAI : mb.rowUser,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* AI avatar — NakshatraLogoImg */}
      {isAI && (
        <View style={mb.aiAvatarWrap}>
          <View style={mb.aiAvatarImgWrap}>
            <Image
              source={NakshatraLogoImg}
              style={{ width: 30, height: 30, borderRadius: 15 }}
              resizeMode="contain"
            />
          </View>
        </View>
      )}

      <View style={[mb.bubble, isAI ? mb.bubbleAI : mb.bubbleUser]}>
        {isAI && (
          <LinearGradient
            colors={["rgba(123,127,232,0.06)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
        )}
        {!isAI && (
          <LinearGradient
            colors={["rgba(212,160,23,0.10)", "rgba(212,160,23,0.04)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
        )}
        <Text
          style={[
            mb.txt,
            fontsLoaded && { fontFamily: SERIF.regular },
            isAI ? mb.txtAI : mb.txtUser,
          ]}
        >
          {msg.text}
        </Text>
        <Text style={[mb.ts, fontsLoaded && { fontFamily: SERIF.regular }]}>
          {msg.ts}
        </Text>
      </View>

      {/* User avatar — AVATAR_URL photo */}
      {!isAI && <Image source={{ uri: AVATAR_URL }} style={mb.userAvatarImg} />}
    </Animated.View>
  );
}

const mb = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 14,
    gap: 10,
  },
  rowAI: { alignItems: "flex-start" },
  rowUser: { alignItems: "flex-end", flexDirection: "row-reverse" },
  aiAvatarWrap: { paddingTop: 2 },
  // NakshatraLogoImg container with moon border
  aiAvatarImgWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.moonBorder,
    backgroundColor: C.moonPale,
  },
  // AVATAR_URL user photo in chat
  userAvatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: C.goldBorder,
  },
  bubble: {
    maxWidth: width * 0.7,
    padding: 14,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  bubbleAI: {
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    borderTopLeftRadius: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleUser: {
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    borderTopRightRadius: 4,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  txt: { fontSize: 15, lineHeight: 23 },
  txtAI: { color: C.inkMid },
  txtUser: { color: C.ink },
  ts: { fontSize: 10, color: C.inkMuted, marginTop: 6, alignSelf: "flex-end" },
});

// ─── Input Bar ────────────────────────────────────────────────────────────────────
function InputBar({ fontsLoaded, onSend, onVoice }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View style={ib.wrap}>
      {!focused && text.length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={ib.chips}
          style={{ marginBottom: 10 }}
        >
          {SUGGESTION_CHIPS.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={ib.chip}
              activeOpacity={0.8}
              onPress={() => onSend(c)}
            >
              <Text
                style={[
                  ib.chipTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={[ib.row, focused && ib.rowFocused]}>
        <TouchableOpacity style={ib.iconBtn} onPress={onVoice}>
          <Ionicons
            name="mic-outline"
            size={20}
            color={focused ? C.gold : C.inkMuted}
          />
        </TouchableOpacity>

        <TextInput
          style={[ib.input, fontsLoaded && { fontFamily: SERIF.regular }]}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask the stars anything..."
          placeholderTextColor={C.inkMuted}
          multiline
          maxLength={500}
          returnKeyType="default"
        />

        <TouchableOpacity
          style={[ib.sendBtn, text.trim() && ib.sendBtnActive]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          {text.trim() ? (
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              style={ib.sendGrad}
            >
              <Ionicons name="arrow-up" size={18} color="#0D0B1A" />
            </LinearGradient>
          ) : (
            <Ionicons name="arrow-up" size={18} color={C.inkMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ib = StyleSheet.create({
  wrap: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 12 : 8,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
    backgroundColor: C.bg,
  },
  chips: { gap: 8, paddingHorizontal: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  chipTxt: { fontSize: 12, color: C.inkMid },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: C.bgInput,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 4,
  },
  rowFocused: { borderColor: C.goldBorder },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: C.ink,
    maxHeight: 120,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 4,
    lineHeight: 22,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sendBtnActive: {
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  sendGrad: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────────
export default function AIJyotishEngine() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState("1");

  const sidebarAnim = useRef(new Animated.Value(0)).current;

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    Animated.spring(sidebarAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 4,
    }).start();
  }, []);

  const closeSidebar = useCallback(() => {
    Animated.spring(sidebarAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 28,
      bounciness: 0,
    }).start(() => setSidebarOpen(false));
  }, []);

  const AI_REPLIES = [
    "Based on your birth chart, the current planetary alignment is highly favourable. Jupiter's aspect on your 10th house signals career advancement in the coming months ✦",
    "The Moon transiting Rohini today amplifies your creative energies. This is an excellent time for artistic pursuits or new relationships.",
    "Saturn's Sade Sati is a transformative seven-and-a-half year period. Rather than fearing it, embrace the lessons — it builds character and resilience.",
    "Your ascendant lord placed in the 5th house creates a strong Raj Yoga. Intelligence and wisdom will be your greatest assets in life.",
    "Rahu in your 7th house suggests an unconventional partnership or foreign connection in your destiny. Embrace what feels different — it holds your growth.",
  ];
  const replyIdx = useRef(0);

  const handleSend = useCallback((text) => {
    const userMsg = {
      id: `m${Date.now()}`,
      role: "user",
      text,
      ts: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(
      () => {
        const aiMsg = {
          id: `m${Date.now() + 1}`,
          role: "ai",
          text: AI_REPLIES[replyIdx.current % AI_REPLIES.length],
          ts: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        replyIdx.current++;
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          100,
        );
      },
      1800 + Math.random() * 800,
    );

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  return (
    <View style={[sc.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Top Bar ── */}
      <View style={sc.topBar}>
        <TouchableOpacity style={sc.menuBtn} onPress={openSidebar}>
          <Ionicons name="menu" size={20} color={C.inkMid} />
        </TouchableOpacity>

        <View style={sc.titleWrap}>
          <Text
            style={[sc.titleMain, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Jyotish AI
          </Text>
          <View style={sc.statusDot} />
        </View>

        <TouchableOpacity style={sc.menuBtn} onPress={() => setVoiceOpen(true)}>
          <Ionicons name="mic-outline" size={20} color={C.gold} />
        </TouchableOpacity>
      </View>

      {/* Gold sheen under topbar */}
      <View style={sc.topSheen} />

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={sc.scroll}
          contentContainerStyle={sc.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={sc.bgOrb} pointerEvents="none" />

          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} fontsLoaded={fontsLoaded} />
          ))}

          {isTyping && <TypingDots fontsLoaded={fontsLoaded} />}
        </ScrollView>

        {/* ── Input ── */}
        <InputBar
          fontsLoaded={fontsLoaded}
          onSend={handleSend}
          onVoice={() => setVoiceOpen(true)}
        />
      </KeyboardAvoidingView>

      {/* ── Sidebar ── */}
      {sidebarOpen && (
        <Sidebar
          fontsLoaded={fontsLoaded}
          slideAnim={sidebarAnim}
          onClose={closeSidebar}
          onNewChat={() => {
            setMessages([SEED_MESSAGES[0]]);
            closeSidebar();
          }}
          activeId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            closeSidebar();
          }}
        />
      )}

      {/* ── Voice Orb Modal ── */}
      {voiceOpen && (
        <VoiceOrb
          fontsLoaded={fontsLoaded}
          onClose={() => setVoiceOpen(false)}
        />
      )}
    </View>
  );
}

// ─── Screen Styles ────────────────────────────────────────────────────────────────
const sc = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  titleMain: { fontSize: 22, color: C.ink, letterSpacing: 0.5 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
    shadowColor: C.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  topSheen: {
    height: 0.5,
    marginHorizontal: 32,
    backgroundColor: "rgba(212,160,23,0.25)",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 16, paddingBottom: 24 },
  bgOrb: {
    position: "absolute",
    top: 40,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(123,127,232,0.04)",
  },
});
