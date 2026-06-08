/**
 * Nakshatra — JyotishChat Screen
 * Premium Astrology Chat Consultation
 * Design: "Dark Celestial Luxury" — matches app design system
 *
 * Dependencies:
 *   expo-linear-gradient
 *   @expo-google-fonts/cormorant-garamond
 *   @expo/vector-icons
 *   react-native-safe-area-context
 *
 * Usage:
 *   <Stack.Screen name="JyotishChat" component={JyotishChat} />
 *   navigation.navigate('JyotishChat', { astrologer, mode })
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
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
  TextInput,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  bgDeep: "#090818",
  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.10)",
  goldBorder: "rgba(212,160,23,0.25)",
  goldGlow: "rgba(212,160,23,0.18)",
  moon: "#7B7FE8",
  moonLight: "#A5A8F8",
  moonDark: "#3A3DA8",
  moonPale: "rgba(123,127,232,0.12)",
  moonBorder: "rgba(123,127,232,0.25)",
  moonGlow: "rgba(123,127,232,0.20)",
  ink: "#F2EED8",
  inkMid: "#B8B0D8",
  inkMuted: "#6E6898",
  green: "#34D077",
  greenPale: "rgba(52,208,119,0.12)",
  greenBorder: "rgba(52,208,119,0.25)",
  orange: "#F09A3E",
  orangePale: "rgba(240,154,62,0.12)",
  orangeBorder: "rgba(240,154,62,0.25)",
  red: "#E84040",
  redPale: "rgba(232,64,64,0.12)",
  redBorder: "rgba(232,64,64,0.25)",
  border: "rgba(255,255,255,0.07)",
  shadow: "rgba(0,0,0,0.55)",
  shadowGold: "rgba(212,160,23,0.22)",
  shadowMoon: "rgba(123,127,232,0.28)",
  divider: "rgba(255,255,255,0.06)",
  userBubble1: "#F7CE58",
  userBubble2: "#D4A017",
  astroBubble: "#181535",
  aiInsight1: "#1C1A4A",
  aiInsight2: "#13112A",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ASTROLOGER = {
  name: "Pandit Ramesh Sharma",
  shortName: "Pt. Ramesh",
  title: "Vedic Jyotish Acharya",
  exp: "18 Years",
  expertise: ["Vedic", "Nadi Shastra", "Kundli"],
  fee: 20,
  avatar: "PR",
  avatarColors: [C.moonLight, C.moonDark],
  status: "online",
};

const KUNDLI = {
  sunSign: "Leo",
  moonSign: "Taurus",
  nakshatra: "Rohini",
  ascendant: "Scorpio",
  transits: ["Moon in Rohini", "Jupiter in Taurus", "Saturn in Aquarius"],
  energy: 4,
  energyLabel: "Positive Day",
};

const INITIAL_MESSAGES = [
  {
    id: "1",
    type: "system",
    text: "Consultation started · 30 min package · ₹349",
    time: "10:00 AM",
  },
  {
    id: "2",
    type: "astro",
    text: "Jai Shri Ram 🙏\n\nNamaste! I am Pandit Ramesh Sharma. I have carefully reviewed your birth chart details. Your Kundli shows a very interesting planetary alignment at this time.\n\nHow may I guide you today? Please feel free to ask about any aspect of your life — career, marriage, health, or spiritual journey.",
    time: "10:01 AM",
  },
  {
    id: "3",
    type: "ai",
    title: "✦ AI Cosmic Insight",
    text: "Based on your birth chart, Jupiter's current transit through Taurus activates your 7th house of partnerships. This is a highly auspicious window — next 60 days favour both marriage and business collaborations.",
    time: "10:01 AM",
  },
  {
    id: "4",
    type: "user",
    text: "Please analyze my career prospects for the next 6 months.",
    time: "10:02 AM",
    status: "read",
  },
  {
    id: "5",
    type: "astro",
    text: "Excellent question. Looking at your 10th house — the house of career — Saturn is currently aspecting it from your 4th house. This creates a period of hard work and discipline.\n\nHowever, Jupiter's benevolent gaze on your 10th lord suggests a significant promotion or recognition is imminent, likely between the 3rd and 5th month from now.\n\nI recommend performing Shani Puja every Saturday for the next 3 months.",
    time: "10:04 AM",
  },
];

const QUICK_TOPICS = [
  {
    label: "Career",
    question: "Please analyze my career prospects for the next 6 months.",
  },
  {
    label: "Marriage",
    question: "What does my Kundli say about my marriage timing and partner?",
  },
  {
    label: "Finance",
    question:
      "Please analyze my financial prospects and wealth yogas in my chart.",
  },
  {
    label: "Love",
    question: "Can you guide me about my love life and compatibility?",
  },
  {
    label: "Health",
    question: "What health precautions should I take based on my birth chart?",
  },
  {
    label: "Education",
    question: "How are my academic prospects? Is further education favourable?",
  },
  {
    label: "Business",
    question: "Is starting a new business favourable for me at this time?",
  },
  {
    label: "Spirituality",
    question: "What is my spiritual path as indicated by my birth chart?",
  },
  {
    label: "Foreign Travel",
    question: "Does my Kundli indicate foreign travel or settlement abroad?",
  },
];

const EXTENSION_PACKAGES = [
  { mins: 15, price: 199, tag: null },
  { mins: 30, price: 349, tag: "Popular" },
  { mins: 60, price: 599, tag: "Best Value" },
];

const SESSION_SUMMARY = {
  topics: ["Career Growth", "Financial Planning", "Marriage Timing"],
  remedies: [
    "Shani Puja every Saturday",
    "Wear Blue Sapphire (consult first)",
    "Chant Shani Mantra 108x daily",
  ],
  puja: ["Navgraha Shanti Puja", "Lakshmi Puja on Fridays"],
  gemstone: "Yellow Sapphire (Pukhraj) — 5 carats, set in gold",
  muhurta: "15th of next month — highly auspicious for new beginnings",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Icon({ lib, name, size, color, style }) {
  if (lib === "Mci")
    return (
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={style}
      />
    );
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

function AvatarCircle({ initials, colors, size = 36, fontSize = 13 }) {
  return (
    <LinearGradient
      colors={colors}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFF",
          fontSize,
          fontFamily: "serif",
          fontWeight: "700",
        }}
      >
        {initials}
      </Text>
    </LinearGradient>
  );
}

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────
function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const color = secs > 900 ? C.green : secs > 300 ? C.orange : C.red;
  const colorPale =
    secs > 900 ? C.greenPale : secs > 300 ? C.orangePale : C.redPale;
  const colorBorder =
    secs > 900 ? C.greenBorder : secs > 300 ? C.orangeBorder : C.redBorder;
  return { display, color, colorPale, colorBorder, secs };
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ fontsLoaded }) {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(d, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.typingWrap}>
      <AvatarCircle
        initials={ASTROLOGER.avatar}
        colors={ASTROLOGER.avatarColors}
        size={28}
        fontSize={10}
      />
      <View style={styles.typingBubble}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={[
              styles.typingDot,
              {
                opacity: d,
                transform: [
                  {
                    translateY: d.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -4],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, fontsLoaded }) {
  if (msg.type === "system") {
    return (
      <View style={styles.systemMsgWrap}>
        <View style={styles.systemMsgPill}>
          <MaterialCommunityIcons
            name="star-four-points"
            size={9}
            color={C.gold}
          />
          <Text
            style={[
              styles.systemMsgTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {" "}
            {msg.text}
          </Text>
        </View>
      </View>
    );
  }

  if (msg.type === "ai") {
    return (
      <View style={styles.aiMsgWrap}>
        <LinearGradient
          colors={["#1C1A4A", "#13112A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiCard}
        >
          <View style={styles.aiCardTopLine} />
          <View style={styles.aiCardHeader}>
            <LinearGradient
              colors={[C.moonLight, C.moon, C.moonDark]}
              style={styles.aiCardBadge}
            >
              <MaterialCommunityIcons
                name="crystal-ball"
                size={13}
                color="#FFF"
              />
            </LinearGradient>
            <Text
              style={[
                styles.aiCardTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {msg.title}
            </Text>
          </View>
          <Text
            style={[
              styles.aiCardText,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {msg.text}
          </Text>
          <Text
            style={[
              styles.msgTime,
              { textAlign: "right", marginTop: 6 },
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {msg.time}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  if (msg.type === "astro") {
    return (
      <View style={styles.astroMsgRow}>
        <AvatarCircle
          initials={ASTROLOGER.avatar}
          colors={ASTROLOGER.avatarColors}
          size={30}
          fontSize={11}
        />
        <View style={styles.astroBubble}>
          <Text
            style={[
              styles.astroBubbleTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {msg.text}
          </Text>
          <Text
            style={[
              styles.msgTime,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {msg.time}
          </Text>
        </View>
      </View>
    );
  }

  if (msg.type === "user") {
    return (
      <View style={styles.userMsgRow}>
        <View>
          <LinearGradient
            colors={[C.goldLight, C.goldMid, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userBubble}
          >
            <Text
              style={[
                styles.userBubbleTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {msg.text}
            </Text>
          </LinearGradient>
          <View style={styles.userMsgMeta}>
            <Text
              style={[
                styles.msgTime,
                { textAlign: "right" },
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {msg.time}
            </Text>
            <Ionicons
              name={msg.status === "read" ? "checkmark-done" : "checkmark"}
              size={13}
              color={msg.status === "read" ? C.moon : C.inkMuted}
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
      </View>
    );
  }

  return null;
}

// ─── Kundli Context Card ──────────────────────────────────────────────────────
function KundliCard({ fontsLoaded, collapsed, onToggle }) {
  const anim = useRef(new Animated.Value(collapsed ? 0 : 1)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: collapsed ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [collapsed]);
  const maxH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 160] });

  return (
    <View style={styles.kundliCard}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.kundliHeader}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="orbit" size={14} color={C.gold} />
        <Text
          style={[
            styles.kundliTitle,
            fontsLoaded && { fontFamily: SERIF.bold },
          ]}
        >
          {" "}
          Kundli Snapshot
        </Text>
        <View
          style={[styles.energyPill, { marginLeft: "auto", marginRight: 10 }]}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <MaterialCommunityIcons
              key={i}
              name="star"
              size={9}
              color={i <= KUNDLI.energy ? C.gold : C.inkMuted}
            />
          ))}
          <Text
            style={[
              styles.energyLabel,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {" "}
            {KUNDLI.energyLabel}
          </Text>
        </View>
        <Ionicons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={14}
          color={C.inkMuted}
        />
      </TouchableOpacity>
      <Animated.View style={{ maxHeight: maxH, overflow: "hidden" }}>
        <View style={styles.kundliBody}>
          <View style={styles.kundliGrid}>
            {[
              { label: "Sun Sign", val: KUNDLI.sunSign },
              { label: "Moon Sign", val: KUNDLI.moonSign },
              { label: "Nakshatra", val: KUNDLI.nakshatra },
              { label: "Ascendant", val: KUNDLI.ascendant },
            ].map((k, i) => (
              <View key={i} style={styles.kundliItem}>
                <Text
                  style={[
                    styles.kundliLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {k.label}
                </Text>
                <Text
                  style={[
                    styles.kundliVal,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {k.val}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.kundliDivider} />
          <View style={styles.transitRow}>
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={11}
              color={C.moonLight}
            />
            <Text
              style={[
                styles.transitTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {"  "}
              {KUNDLI.transits.slice(0, 2).join("  ·  ")}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function ChatHeader({ fontsLoaded, navigation, timer, isTyping }) {
  const [moreVisible, setMoreVisible] = useState(false);

  return (
    <View style={styles.header}>
      <LinearGradient
        colors={["#181535", "#0D0B1A"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerTop}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.hdrBackBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={20} color={C.inkMid} />
        </TouchableOpacity>

        {/* Astrologer info */}
        <View style={styles.hdrInfo}>
          <View style={{ position: "relative" }}>
            <AvatarCircle
              initials={ASTROLOGER.avatar}
              colors={ASTROLOGER.avatarColors}
              size={40}
              fontSize={14}
            />
            <View style={styles.hdrOnlineDot} />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              style={[
                styles.hdrName,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
              numberOfLines={1}
            >
              {ASTROLOGER.name}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              {isTyping ? (
                <View style={styles.typingStatusPill}>
                  <View style={styles.typingStatusDot} />
                  <Text
                    style={[
                      styles.typingStatusTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    Typing…
                  </Text>
                </View>
              ) : (
                <View style={styles.onlineStatusPill}>
                  <View style={styles.onlineStatusDot} />
                  <Text
                    style={[
                      styles.onlineStatusTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    Online
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.hdrExp,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {ASTROLOGER.exp}
              </Text>
            </View>
          </View>
        </View>

        {/* Header Actions */}
        <View style={styles.hdrActions}>
          <TouchableOpacity style={styles.hdrActionBtn} activeOpacity={0.8}>
            <Ionicons name="call" size={17} color={C.green} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.hdrActionBtn} activeOpacity={0.8}>
            <Ionicons name="videocam" size={17} color={C.moonLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.hdrActionBtn}
            activeOpacity={0.8}
            onPress={() => setMoreVisible(true)}
          >
            <Ionicons name="ellipsis-vertical" size={17} color={C.inkMid} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Session info strip */}
      <View style={styles.sessionStrip}>
        <View style={styles.sessionInfo}>
          <MaterialCommunityIcons
            name="chat-processing-outline"
            size={11}
            color={C.green}
          />
          <Text
            style={[
              styles.sessionInfoTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {" "}
            Chat Active
          </Text>
        </View>
        <View
          style={[
            styles.sessionTimer,
            {
              borderColor: timer.colorBorder,
              backgroundColor: timer.colorPale,
            },
          ]}
        >
          <Ionicons name="time-outline" size={11} color={timer.color} />
          <Text
            style={[
              styles.sessionTimerTxt,
              { color: timer.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {"  "}
            {timer.display}
          </Text>
        </View>
        <View style={styles.sessionPkg}>
          <Text
            style={[
              styles.sessionPkgTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            30 Min Package
          </Text>
        </View>
        <TouchableOpacity style={styles.extendBtn} activeOpacity={0.85}>
          <Text
            style={[
              styles.extendBtnTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            + Extend
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expertise chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expertiseScroll}
      >
        {ASTROLOGER.expertise.map((e, i) => (
          <View key={i} style={styles.expertiseChip}>
            <Text
              style={[
                styles.expertiseChipTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {e}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Quick Topics ─────────────────────────────────────────────────────────────
function QuickTopics({ fontsLoaded, onSelect }) {
  return (
    <View style={styles.quickWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickScroll}
      >
        {QUICK_TOPICS.map((t, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onSelect(t.question)}
            style={styles.quickChip}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.quickChipTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Input Bar ────────────────────────────────────────────────────────────────
function InputBar({ fontsLoaded, value, onChangeText, onSend }) {
  return (
    <View style={styles.inputBar}>
      <TouchableOpacity style={styles.inputAttach} activeOpacity={0.8}>
        <MaterialCommunityIcons name="paperclip" size={20} color={C.inkMuted} />
      </TouchableOpacity>
      <View style={styles.inputWrap}>
        <TextInput
          style={[styles.input, fontsLoaded && { fontFamily: SERIF.regular }]}
          placeholder="Ask your question…"
          placeholderTextColor={C.inkMuted}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={400}
        />
      </View>
      <TouchableOpacity
        onPress={onSend}
        style={styles.sendBtn}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[C.goldLight, C.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sendBtnGrad}
        >
          <Ionicons name="send" size={16} color="#0D0B1A" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ─── Extension Modal ──────────────────────────────────────────────────────────
function ExtensionModal({ visible, onClose, fontsLoaded }) {
  const [selected, setSelected] = useState(1);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.extensionSheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Celestial top line */}
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sheetTopLine}
            />

            <Text
              style={[
                styles.sheetTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              Continue Your Consultation?
            </Text>
            <Text
              style={[
                styles.sheetSub,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Your session is ending soon. Select a package to extend.
            </Text>

            <View style={{ gap: 10, marginTop: 16 }}>
              {EXTENSION_PACKAGES.map((p, i) => {
                const isActive = selected === i;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelected(i)}
                    activeOpacity={0.9}
                  >
                    <View
                      style={[
                        styles.extPackage,
                        isActive && styles.extPackageActive,
                      ]}
                    >
                      {isActive && (
                        <LinearGradient
                          colors={[C.goldLight, C.goldMid, C.gold]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.extPackageTopLine}
                        />
                      )}
                      <View style={{ flex: 1 }}>
                        {p.tag && (
                          <View
                            style={[
                              styles.extTag,
                              {
                                backgroundColor: C.moonPale,
                                borderColor: C.moonBorder,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.extTagTxt,
                                fontsLoaded && { fontFamily: SERIF.semiBold },
                              ]}
                            >
                              {p.tag}
                            </Text>
                          </View>
                        )}
                        <Text
                          style={[
                            styles.extMins,
                            fontsLoaded && { fontFamily: SERIF.bold },
                          ]}
                        >
                          {p.mins} Minutes
                        </Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={[
                            styles.extPrice,
                            { color: isActive ? C.goldLight : C.gold },
                            fontsLoaded && { fontFamily: SERIF.bold },
                          ]}
                        >
                          ₹{p.price}
                        </Text>
                        {isActive && (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 3,
                              marginTop: 2,
                            }}
                          >
                            <Ionicons
                              name="checkmark-circle"
                              size={12}
                              color={C.green}
                            />
                            <Text
                              style={[
                                styles.extSelected,
                                fontsLoaded && { fontFamily: SERIF.semiBold },
                              ]}
                            >
                              Selected
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={{ borderRadius: 18, overflow: "hidden", marginTop: 18 }}
              activeOpacity={0.88}
              onPress={onClose}
            >
              <LinearGradient
                colors={[C.goldLight, C.goldMid, C.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.extendCTA}
              >
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={15}
                  color="#0D0B1A"
                />
                <Text
                  style={[
                    styles.extendCTATxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {" "}
                  Extend Session — ₹{EXTENSION_PACKAGES[selected].price}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={{ alignSelf: "center", marginTop: 12 }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.extendCancel,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                End consultation
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Session Summary Modal ────────────────────────────────────────────────────
function SessionSummaryModal({ visible, onClose, fontsLoaded }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.summaryOverlay}>
        <View style={styles.summarySheet}>
          <LinearGradient
            colors={[C.goldLight, C.goldMid, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sheetTopLine}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={[
                styles.summaryTitle,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              Session Summary
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.summaryClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={18} color={C.inkMid} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Topics */}
            <View style={styles.summarySection}>
              <View style={styles.summarySectionHeader}>
                <Ionicons name="chatbubbles-outline" size={14} color={C.gold} />
                <Text
                  style={[
                    styles.summarySectionTitle,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {" "}
                  Topics Discussed
                </Text>
              </View>
              {SESSION_SUMMARY.topics.map((t, i) => (
                <View key={i} style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="star-four-points"
                    size={9}
                    color={C.gold}
                  />
                  <Text
                    style={[
                      styles.summaryItemTxt,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    {t}
                  </Text>
                </View>
              ))}
            </View>

            {/* Remedies */}
            <View style={styles.summarySection}>
              <View style={styles.summarySectionHeader}>
                <MaterialCommunityIcons
                  name="spa-outline"
                  size={14}
                  color={C.moonLight}
                />
                <Text
                  style={[
                    styles.summarySectionTitle,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {" "}
                  Recommended Remedies
                </Text>
              </View>
              {SESSION_SUMMARY.remedies.map((r, i) => (
                <View key={i} style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={12} color={C.green} />
                  <Text
                    style={[
                      styles.summaryItemTxt,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    {r}
                  </Text>
                </View>
              ))}
            </View>

            {/* Gemstone + Muhurta */}
            <View style={styles.summaryTwoCol}>
              <View
                style={[
                  styles.summaryMiniCard,
                  { borderColor: C.goldBorder, backgroundColor: C.goldPale },
                ]}
              >
                <MaterialCommunityIcons
                  name="diamond-stone"
                  size={16}
                  color={C.goldMid}
                />
                <Text
                  style={[
                    styles.summaryMiniLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  Gemstone
                </Text>
                <Text
                  style={[
                    styles.summaryMiniVal,
                    { color: C.goldMid },
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {SESSION_SUMMARY.gemstone}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryMiniCard,
                  { borderColor: C.moonBorder, backgroundColor: C.moonPale },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={C.moonLight}
                />
                <Text
                  style={[
                    styles.summaryMiniLabel,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  Muhurta
                </Text>
                <Text
                  style={[
                    styles.summaryMiniVal,
                    { color: C.moonLight },
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {SESSION_SUMMARY.muhurta}
                </Text>
              </View>
            </View>

            {/* Puja */}
            <View style={styles.summarySection}>
              <View style={styles.summarySectionHeader}>
                <MaterialCommunityIcons
                  name="fire"
                  size={14}
                  color={C.orange}
                />
                <Text
                  style={[
                    styles.summarySectionTitle,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {" "}
                  Recommended Puja
                </Text>
              </View>
              {SESSION_SUMMARY.puja.map((p, i) => (
                <View key={i} style={styles.summaryItem}>
                  <Ionicons name="flame-outline" size={12} color={C.orange} />
                  <Text
                    style={[
                      styles.summaryItemTxt,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {" "}
                    {p}
                  </Text>
                </View>
              ))}
            </View>

            {/* Download actions */}
            <View style={styles.summaryActions}>
              {[
                {
                  icon: "document-text-outline",
                  label: "PDF Summary",
                  color: C.gold,
                },
                {
                  icon: "mic-outline",
                  label: "Audio Recording",
                  color: C.moonLight,
                },
                {
                  icon: "chatbubbles-outline",
                  label: "Chat Transcript",
                  color: C.green,
                },
              ].map((a, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.summaryActionBtn}
                  activeOpacity={0.85}
                >
                  <Ionicons name={a.icon} size={16} color={a.color} />
                  <Text
                    style={[
                      styles.summaryActionTxt,
                      { color: a.color },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {"  "}
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={{
                borderRadius: 16,
                overflow: "hidden",
                marginTop: 6,
                marginBottom: 20,
              }}
              activeOpacity={0.88}
              onPress={onClose}
            >
              <LinearGradient
                colors={[C.goldLight, C.goldMid, C.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.summaryDoneBtn}
              >
                <Text
                  style={[
                    styles.summaryDoneTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  Done
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JyotishChat() {
  const navigation = useNavigation();
  const route = useRoute();
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const timer = useCountdown(28 * 60 + 45);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [kundliCollapsed, setKundliCollapsed] = useState(true);
  const [extModalVisible, setExtModalVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const scrollRef = useRef(null);

  // Show extension modal when < 5 minutes remain
  useEffect(() => {
    if (timer.secs === 290) setExtModalVisible(true);
  }, [timer.secs]);

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg = {
      id: String(Date.now()),
      type: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate astrologer reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          type: "astro",
          text: "Thank you for your question. Based on your current planetary positions, I can see that this is indeed an important matter. Let me carefully study your chart and provide you with a detailed reading…",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 2800);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText]);

  const handleQuickTopic = useCallback((question) => {
    setInputText(question);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bgDeep} />

      <ChatHeader
        fontsLoaded={fontsLoaded}
        navigation={navigation}
        timer={timer}
        isTyping={isTyping}
      />

      {/*
       * ── Keyboard Fix ──────────────────────────────────────────────────────
       * Using behavior="padding" on both platforms lifts the entire inner
       * layout (scroll + input bar) above the keyboard.
       *
       * keyboardVerticalOffset tells RN how much non-KAV space sits above
       * the KAV itself (i.e. the fixed ChatHeader height).
       *   iOS  — the header is taller due to the safe-area notch; 0 works
       *           because the header sits outside KAV and RN measures from
       *           the KAV's own top edge automatically on iOS.
       *   Android — pass the status-bar height so the math stays accurate
       *           when windowSoftInputMode is adjustResize/adjustPan.
       *           If your navigator adds a header, add its height here too.
       * ─────────────────────────────────────────────────────────────────────
       */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : (StatusBar.currentHeight ?? 24)
        }
      >
        {/* Kundli card */}
        <KundliCard
          fontsLoaded={fontsLoaded}
          collapsed={kundliCollapsed}
          onToggle={() => setKundliCollapsed(!kundliCollapsed)}
        />

        {/* Chat area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} fontsLoaded={fontsLoaded} />
          ))}
          {isTyping && <TypingIndicator fontsLoaded={fontsLoaded} />}
        </ScrollView>

        {/* Quick topics */}
        <QuickTopics fontsLoaded={fontsLoaded} onSelect={handleQuickTopic} />

        {/* Input bar */}
        <InputBar
          fontsLoaded={fontsLoaded}
          value={inputText}
          onChangeText={setInputText}
          onSend={sendMessage}
        />

        {/* End session button */}
        <TouchableOpacity
          onPress={() => setSummaryVisible(true)}
          style={styles.endSessionBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="close-circle-outline" size={13} color={C.inkMuted} />
          <Text
            style={[
              styles.endSessionTxt,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {" "}
            End consultation
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <ExtensionModal
        visible={extModalVisible}
        onClose={() => setExtModalVisible(false)}
        fontsLoaded={fontsLoaded}
      />
      <SessionSummaryModal
        visible={summaryVisible}
        onClose={() => setSummaryVisible(false)}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // ── Header ──
  header: {
    paddingTop: Platform.OS === "android" ? 38 : 54,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  hdrBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  hdrInfo: { flex: 1, flexDirection: "row", alignItems: "center" },
  hdrOnlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.green,
    borderWidth: 1.5,
    borderColor: C.bg,
  },
  hdrName: { fontSize: 15, color: C.ink, marginBottom: 2 },
  hdrExp: { fontSize: 10, color: C.inkMuted },
  hdrActions: { flexDirection: "row", gap: 6 },
  hdrActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  onlineStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.green,
    marginRight: 4,
  },
  onlineStatusTxt: { fontSize: 9, color: C.green },
  typingStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  typingStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.goldMid,
    marginRight: 4,
  },
  typingStatusTxt: { fontSize: 9, color: C.goldMid },

  sessionStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 8,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  sessionInfo: { flexDirection: "row", alignItems: "center" },
  sessionInfoTxt: { fontSize: 10, color: C.green },
  sessionTimer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  sessionTimerTxt: { fontSize: 11 },
  sessionPkg: { flex: 1 },
  sessionPkgTxt: { fontSize: 10, color: C.inkMuted },
  extendBtn: {
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  extendBtnTxt: { fontSize: 10, color: C.goldMid },
  expertiseScroll: { paddingHorizontal: 14, gap: 6, paddingBottom: 10 },
  expertiseChip: {
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  expertiseChipTxt: { fontSize: 10, color: C.moonLight },

  // ── Kundli Card ──
  kundliCard: {
    backgroundColor: C.bgCard,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  kundliHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  kundliTitle: { fontSize: 13, color: C.inkMid },
  energyPill: { flexDirection: "row", alignItems: "center" },
  energyLabel: { fontSize: 10, color: C.gold },
  kundliBody: { paddingHorizontal: 14, paddingBottom: 12 },
  kundliGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kundliItem: {
    backgroundColor: C.bgSurface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: (width - 28 - 30) / 2 - 5,
  },
  kundliLabel: {
    fontSize: 9,
    color: C.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  kundliVal: { fontSize: 14, color: C.ink },
  kundliDivider: { height: 0.5, backgroundColor: C.divider, marginVertical: 8 },
  transitRow: { flexDirection: "row", alignItems: "center" },
  transitTxt: { fontSize: 11, color: C.inkMuted },

  // ── Chat ──
  chatScroll: { flex: 1 },
  chatContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },

  systemMsgWrap: { alignItems: "center" },
  systemMsgPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  systemMsgTxt: { fontSize: 11, color: C.goldMid },

  aiMsgWrap: { marginVertical: 4 },
  aiCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    overflow: "hidden",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  aiCardTopLine: {
    position: "absolute",
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: C.moonLight,
    opacity: 0.3,
  },
  aiCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  aiCardBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  aiCardTitle: { fontSize: 13, color: C.moonLight, marginLeft: 10 },
  aiCardText: { fontSize: 14, color: C.inkMid, lineHeight: 22 },

  astroMsgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    maxWidth: "82%",
  },
  astroBubble: {
    backgroundColor: C.astroBubble,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 13,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  astroBubbleTxt: { fontSize: 14, color: C.inkMid, lineHeight: 22 },

  userMsgRow: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 13,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  userBubbleTxt: { fontSize: 14, color: "#0D0B1A", lineHeight: 21 },
  userMsgMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  msgTime: { fontSize: 10, color: C.inkMuted },

  typingWrap: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.astroBubble,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.inkMuted,
  },

  // ── Quick Topics ──
  quickWrap: {
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
    paddingVertical: 8,
  },
  quickScroll: { paddingHorizontal: 14, gap: 7 },
  quickChip: {
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  quickChipTxt: { fontSize: 12, color: C.moonLight },

  // ── Input Bar ──
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: C.bgCard,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  inputAttach: { paddingBottom: 10 },
  inputWrap: {
    flex: 1,
    backgroundColor: C.bgSurface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    maxHeight: 110,
  },
  input: { fontSize: 14, color: C.ink, padding: 0 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  sendBtnGrad: { flex: 1, alignItems: "center", justifyContent: "center" },

  endSessionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: C.bg,
  },
  endSessionTxt: { fontSize: 11, color: C.inkMuted },

  // ── Extension Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  extensionSheet: {
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.inkMuted,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTopLine: {
    position: "absolute",
    top: 0,
    left: 60,
    right: 60,
    height: 2,
  },
  sheetTitle: { fontSize: 22, color: C.ink, marginBottom: 6 },
  sheetSub: { fontSize: 13, color: C.inkMuted, lineHeight: 20 },
  extPackage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgSurface,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 16,
    overflow: "hidden",
  },
  extPackageActive: {
    backgroundColor: "#1E1A50",
    borderColor: C.goldBorder,
    borderWidth: 1.5,
  },
  extPackageTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  extTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 5,
  },
  extTagTxt: { fontSize: 9, color: C.moonLight },
  extMins: { fontSize: 16, color: C.ink },
  extPrice: { fontSize: 22 },
  extSelected: { fontSize: 10, color: C.green },
  extendCTA: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  extendCTATxt: { fontSize: 15, color: "#0D0B1A" },
  extendCancel: { fontSize: 13, color: C.inkMuted },

  // ── Session Summary Modal ──
  summaryOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  summarySheet: {
    backgroundColor: C.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 22,
    maxHeight: "90%",
    borderTopWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
  },
  summaryTitle: { fontSize: 24, color: C.ink },
  summaryClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bgSurface,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  summarySection: { marginBottom: 18 },
  summarySectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  summarySectionTitle: { fontSize: 15, color: C.ink },
  summaryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },
  summaryItemTxt: { fontSize: 13, color: C.inkMid, lineHeight: 20, flex: 1 },
  summaryTwoCol: { flexDirection: "row", gap: 10, marginBottom: 18 },
  summaryMiniCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 12,
    gap: 6,
  },
  summaryMiniLabel: { fontSize: 10, color: C.inkMuted },
  summaryMiniVal: { fontSize: 12, lineHeight: 18 },
  summaryActions: { gap: 8, marginBottom: 16 },
  summaryActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgSurface,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryActionTxt: { fontSize: 13 },
  summaryDoneBtn: { alignItems: "center", paddingVertical: 16 },
  summaryDoneTxt: { fontSize: 15, color: "#0D0B1A" },
});
