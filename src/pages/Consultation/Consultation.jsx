/**
 * Nakshatra — Consultation Screen
 *
 * Fully React Native / Expo compatible.
 * Same design system as HomeScreen v5 — "Dark Celestial Luxury"
 *
 * Install (if not already in project):
 *   npx expo install expo-linear-gradient
 *   npx expo install @expo-google-fonts/cormorant-garamond expo-font
 *   npx expo install react-native-safe-area-context
 *   @expo/vector-icons — bundled with Expo SDK
 *
 * Usage in navigator:
 *   import NakshatraConsultation from './screens/NakshatraConsultation';
 *   <Stack.Screen name="Consultation" component={NakshatraConsultation} />
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
import { useNavigation } from "@react-navigation/native";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ─── Design Tokens (same as HomeScreen) ─────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.10)",
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

// ─── Data ────────────────────────────────────────────────────────────────────────
const ASTROLOGERS = [
  {
    id: 1,
    name: "Pandit Ramesh Sharma",
    exp: "18 yrs",
    expertise: ["Vedic", "Nadi Shastra"],
    lang: ["Hindi", "English"],
    rating: 4.9,
    sessions: "2.1k",
    status: "online",
    fee: 20,
    avatar: "PR",
    avatarColors: [C.moonLight, C.moonDark],
  },
  {
    id: 2,
    name: "Jyoti Devi Acharya",
    exp: "12 yrs",
    expertise: ["Tarot", "KP System"],
    lang: ["Hindi", "Tamil"],
    rating: 4.8,
    sessions: "1.4k",
    status: "online",
    fee: 15,
    avatar: "JD",
    avatarColors: [C.goldMid, C.goldDark],
  },
  {
    id: 3,
    name: "Dr. Acharya Dev",
    exp: "9 yrs",
    expertise: ["Numerology", "Vastu"],
    lang: ["English", "Marathi"],
    rating: 4.7,
    sessions: "980",
    status: "busy",
    fee: 12,
    avatar: "AD",
    avatarColors: ["#34D077", "#1a7040"],
  },
  {
    id: 4,
    name: "Sunita Krishnamurthy",
    exp: "22 yrs",
    expertise: ["Vedic", "Palmistry"],
    lang: ["Telugu", "English"],
    rating: 5.0,
    sessions: "3.2k",
    status: "online",
    fee: 25,
    avatar: "SK",
    avatarColors: [C.goldLight, "#c0920a"],
  },
  {
    id: 5,
    name: "Rajesh Joshi",
    exp: "6 yrs",
    expertise: ["Tarot", "Love & Marriage"],
    lang: ["Hindi", "Gujarati"],
    rating: 4.6,
    sessions: "540",
    status: "offline",
    fee: 10,
    avatar: "RJ",
    avatarColors: [C.moonLight, "#534AB7"],
  },
];

const AI_RECOMMENDED = [
  {
    id: 1,
    name: "Pt. Ramesh Sharma",
    match: "98%",
    focus: "Marriage & Relationships",
    rating: 4.9,
    avatar: "PR",
    avatarColors: [C.moonLight, C.moonDark],
  },
  {
    id: 2,
    name: "Jyoti Devi Acharya",
    match: "95%",
    focus: "Career & Finance",
    rating: 4.8,
    avatar: "JD",
    avatarColors: [C.goldMid, C.goldDark],
  },
  {
    id: 3,
    name: "Sunita Krishnamurthy",
    match: "92%",
    focus: "Spiritual Growth",
    rating: 5.0,
    avatar: "SK",
    avatarColors: [C.goldLight, "#c0920a"],
  },
];

const CONSULTATION_MODES = [
  {
    icon: "call",
    lib: "Ionicons",
    label: "Call Consultation",
    desc: "Instant voice guidance",
    price: "₹10/min",
    count: "142 live",
    accent: C.green,
    accentPale: C.greenPale,
    accentBorder: C.greenBorder,
    mode: "call",
  },
  {
    icon: "chatbubble-ellipses",
    lib: "Ionicons",
    label: "Chat Consultation",
    desc: "Private text astrology",
    price: "₹8/min",
    count: "89 live",
    accent: C.moon,
    accentPale: C.moonPale,
    accentBorder: C.moonBorder,
    mode: "chat",
  },
  {
    icon: "videocam",
    lib: "Ionicons",
    label: "Video Consultation",
    desc: "Face-to-face premium",
    price: "₹20/min",
    count: "43 live",
    accent: C.gold,
    accentPale: C.goldPale,
    accentBorder: C.goldBorder,
    mode: "video",
  },
];

const FILTERS = [
  {
    label: "Online Now",
    iconName: "radio-button-on",
    lib: "Ionicons",
    accent: C.green,
  },
  {
    label: "Under ₹200",
    iconName: "pricetag",
    lib: "Ionicons",
    accent: C.gold,
  },
  {
    label: "Under ₹500",
    iconName: "pricetag-outline",
    lib: "Ionicons",
    accent: C.gold,
  },
  { label: "Vedic", iconName: "sunny", lib: "Ionicons", accent: C.gold },
  {
    label: "Tarot",
    iconName: "star-four-points",
    lib: "MaterialCommunityIcons",
    accent: C.moon,
  },
  {
    label: "Numerology",
    iconName: "calculator",
    lib: "Ionicons",
    accent: C.moon,
  },
  { label: "Marriage", iconName: "heart", lib: "Ionicons", accent: "#E84040" },
  { label: "Career", iconName: "briefcase", lib: "Ionicons", accent: C.moon },
  {
    label: "Finance",
    iconName: "trending-up",
    lib: "Ionicons",
    accent: C.green,
  },
  { label: "Health", iconName: "medkit", lib: "Ionicons", accent: "#E84040" },
  { label: "Love", iconName: "rose", lib: "Ionicons", accent: "#E84040" },
];

const AI_TOPICS = [
  "Marriage",
  "Career",
  "Finance",
  "Health",
  "Education",
  "Spiritual",
];

const PACKAGES = [
  {
    label: "Quick Guidance",
    mins: 15,
    price: 199,
    orig: 299,
    tag: "Save ₹100",
    tagColor: C.gold,
    benefits: ["Written summary", "1 follow-up Q&A", "All modes"],
  },
  {
    label: "Detailed Consultation",
    mins: 30,
    price: 349,
    orig: 549,
    tag: "Most Popular",
    tagColor: C.moon,
    benefits: ["Written summary", "3 follow-up Q&As", "All modes", "Remedies"],
  },
  {
    label: "Complete Life Analysis",
    mins: 60,
    price: 599,
    orig: 999,
    tag: "Best Value",
    tagColor: C.green,
    benefits: [
      "Full report PDF",
      "Unlimited follow-up",
      "All modes",
      "Remedies",
      "Muhurta",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    type: "Video Consultation",
    rating: 5,
    text: "Pandit ji's reading was incredibly accurate. My marriage concerns were beautifully addressed.",
    avatar: "PM",
    avatarColors: [C.moonLight, C.moonDark],
  },
  {
    name: "Rahul Verma",
    type: "Chat Consultation",
    rating: 5,
    text: "Very detailed analysis of my career horoscope. Highly recommend for finance queries.",
    avatar: "RV",
    avatarColors: [C.goldMid, C.goldDark],
  },
  {
    name: "Ananya Singh",
    type: "Call Consultation",
    rating: 5,
    text: "The AI matching found me the perfect astrologer for my issue. Truly impressed!",
    avatar: "AS",
    avatarColors: ["#34D077", "#1a7040"],
  },
];

const TRUST_METRICS = [
  { val: "50,000+", label: "Consultations", color: C.gold },
  { val: "10,000+", label: "Verified Reviews", color: C.moon },
  { val: "500+", label: "Certified Jyotish", color: C.green },
  { val: "4.9 ★", label: "Average Rating", color: C.goldLight },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

function Icon({ lib, name, size, color, style }) {
  if (lib === "MaterialCommunityIcons")
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

// ─── PressScale ───────────────────────────────────────────────────────────────
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

// ─── SectionHeader ────────────────────────────────────────────────────────────
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

// ─── AvatarCircle ─────────────────────────────────────────────────────────────
function AvatarCircle({ initials: ini, colors, size = 52, fontSize = 18 }) {
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
        {ini}
      </Text>
    </LinearGradient>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, fontsLoaded }) {
  const cfg = {
    online: {
      color: C.green,
      bg: C.greenPale,
      border: C.greenBorder,
      label: "Online",
    },
    busy: {
      color: C.gold,
      bg: C.goldPale,
      border: C.goldBorder,
      label: "Busy",
    },
    offline: {
      color: C.inkMuted,
      bg: "rgba(110,104,152,0.1)",
      border: "rgba(110,104,152,0.2)",
      label: "Offline",
    },
  }[status];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: cfg.bg,
        borderWidth: 0.5,
        borderColor: cfg.border,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        alignSelf: "flex-start",
      }}
    >
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: cfg.color,
        }}
      />
      <Text
        style={[
          { fontSize: 10, color: cfg.color },
          fontsLoaded && { fontFamily: SERIF.semiBold },
        ]}
      >
        {cfg.label}
      </Text>
    </View>
  );
}

// ─── StarRow ─────────────────────────────────────────────────────────────────
function StarRow({ rating, fontsLoaded }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Ionicons name="star" size={11} color={C.gold} />
      <Text
        style={[
          { fontSize: 13, color: C.gold },
          fontsLoaded && { fontFamily: SERIF.semiBold },
        ]}
      >
        {rating}
      </Text>
    </View>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ fontsLoaded, navigation }) {
  return (
    <View style={s.heroWrap}>
      {/* Glow orbs */}
      <View
        style={[
          s.heroOrb,
          { top: -60, right: -60, width: 250, height: 250, opacity: 0.14 },
        ]}
      />
      <View
        style={[
          s.heroOrb,
          { bottom: -30, left: -30, width: 160, height: 160, opacity: 0.09 },
        ]}
      />

      {/* Tag pill */}
      <View style={s.heroTag}>
        <MaterialCommunityIcons
          name="star-four-points"
          size={10}
          color={C.gold}
        />
        <Text
          style={[s.heroTagTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          {" "}
          INDIA'S #1 VEDIC PLATFORM
        </Text>
      </View>

      <Text style={[s.heroH1, fontsLoaded && { fontFamily: SERIF.bold }]}>
        Connect with India's{"\n"}
        <Text style={{ color: C.goldLight }}>Best Jyotish Experts</Text>
      </Text>

      <Text style={[s.heroSub, fontsLoaded && { fontFamily: SERIF.regular }]}>
        AI-assisted matching connects you with verified Vedic astrologers
        instantly for call, chat, or video consultations.
      </Text>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          { val: "247", label: "Online Now", color: C.green },
          { val: "4.9 ★", label: "Avg Rating", color: C.gold },
          { val: "50k+", label: "Consultations", color: C.moonLight },
        ].map((m, i) => (
          <View key={i} style={[s.statItem, i < 2 && s.statBorder]}>
            <Text
              style={[
                s.statVal,
                { color: m.color },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {m.val}
            </Text>
            <Text
              style={[
                s.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {m.label}
            </Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={s.ctaRow}>
        <TouchableOpacity
          style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}
          activeOpacity={0.88}
          onPress={() =>
            navigation.navigate("JyotishProfile", { mode: "call" })
          }
        >
          <LinearGradient
            colors={[C.goldLight, C.goldMid, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.ctaPrimary}
          >
            <Ionicons name="call" size={16} color="#0D0B1A" />
            <Text
              style={[
                s.ctaPrimaryTxt,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              Consult Now
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.ctaSecondary}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("JyotishProfile")}
        >
          <MaterialCommunityIcons
            name="star-four-points"
            size={14}
            color={C.moonLight}
          />
          <Text
            style={[
              s.ctaSecondaryTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            AI Match
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Consultation Modes ───────────────────────────────────────────────────────
function ConsultationModes({ fontsLoaded, navigation }) {
  return (
    <View style={s.modesWrap}>
      <SecHeader
        title="Consultation Modes"
        sub="Choose how to connect"
        fontsLoaded={fontsLoaded}
      />
      {CONSULTATION_MODES.map((m, i) => (
        <PressScale
          key={i}
          style={{ marginBottom: 10 }}
          onPress={() =>
            navigation.navigate("JyotishProfile", { mode: m.mode })
          }
        >
          <View style={[s.modeCard, { borderColor: m.accentBorder }]}>
            <View
              style={[
                s.modeIcon,
                { backgroundColor: m.accentPale, borderColor: m.accentBorder },
              ]}
            >
              <Icon lib={m.lib} name={m.icon} size={22} color={m.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[s.modeLabel, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {m.label}
              </Text>
              <Text
                style={[
                  s.modeDesc,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {m.desc}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  s.modePrice,
                  { color: m.accent },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {m.price}
              </Text>
              <Text
                style={[
                  s.modeCount,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {m.count}
              </Text>
            </View>
          </View>
        </PressScale>
      ))}
    </View>
  );
}

// ─── Smart Filters ────────────────────────────────────────────────────────────
function SmartFilters({ fontsLoaded }) {
  const [active, setActive] = useState([]);
  const toggle = (label) =>
    setActive((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );

  return (
    <View>
      <SecHeader
        title="Find Your Astrologer"
        sub="Filter by specialty or budget"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterScroll}
      >
        {FILTERS.map((f, i) => {
          const isActive = active.includes(f.label);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggle(f.label)}
              style={[
                s.filterChip,
                isActive && {
                  backgroundColor: f.accent + "22",
                  borderColor: f.accent + "88",
                },
              ]}
              activeOpacity={0.8}
            >
              <Icon
                lib={f.lib}
                name={f.iconName}
                size={12}
                color={isActive ? f.accent : C.inkMuted}
              />
              <Text
                style={[
                  s.filterTxt,
                  isActive && { color: f.accent },
                  fontsLoaded && {
                    fontFamily: isActive ? SERIF.semiBold : SERIF.regular,
                  },
                ]}
              >
                {"  "}
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Astrologer Card ──────────────────────────────────────────────────────────
function AstroCard({ a, fontsLoaded, navigation }) {
  const sc = useRef(new Animated.Value(1)).current;

  const handleNavigate = (mode) => {
    navigation.navigate("JyotishProfile", { astrologer: a, mode });
  };

  return (
    <Animated.View style={[s.astroCard, { transform: [{ scale: sc }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() =>
          Animated.spring(sc, {
            toValue: 0.97,
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
        onPress={() => handleNavigate("profile")}
      >
        {/* Top row */}
        <View style={s.astroTop}>
          <View style={{ position: "relative" }}>
            <AvatarCircle
              initials={a.avatar}
              colors={a.avatarColors}
              size={58}
              fontSize={19}
            />
            {a.status === "online" && <View style={s.onlineDot} />}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[s.astroName, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {a.name}
            </Text>
            <Text
              style={[s.astroExp, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {a.exp} experience
            </Text>
            <StatusBadge status={a.status} fontsLoaded={fontsLoaded} />
          </View>
        </View>

        {/* Expertise chips */}
        <View style={s.chipRow}>
          {a.expertise.map((e) => (
            <View key={e} style={s.expertiseChip}>
              <Text
                style={[
                  s.expertiseTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {e}
              </Text>
            </View>
          ))}
          {a.lang.map((l) => (
            <View key={l} style={s.langChip}>
              <Text
                style={[
                  s.langTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {l}
              </Text>
            </View>
          ))}
        </View>

        {/* Rating + sessions */}
        <View style={s.astroMeta}>
          <StarRow rating={a.rating} fontsLoaded={fontsLoaded} />
          <Text style={[s.astroDot]}>·</Text>
          <Text
            style={[
              s.astroSessions,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {a.sessions} sessions
          </Text>
        </View>

        {/* Divider */}
        <View style={s.astroDivider} />

        {/* Fee + actions */}
        <View style={s.astroBottom}>
          <View>
            <Text
              style={[
                s.astroFeeLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              From
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}
            >
              <Text
                style={[
                  s.astroFeeVal,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                ₹{a.fee}
              </Text>
              <Text
                style={[
                  s.astroFeePer,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                /min
              </Text>
            </View>
          </View>
          <View style={s.astroActions}>
            <TouchableOpacity
              style={s.chatBtn}
              activeOpacity={0.85}
              onPress={() => handleNavigate("chat")}
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={13}
                color={C.moonLight}
              />
              <Text
                style={[
                  s.chatBtnTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ borderRadius: 14, overflow: "hidden" }}
              onPress={() => handleNavigate("call")}
            >
              <LinearGradient
                colors={[C.goldLight, C.goldMid, C.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.callBtn}
              >
                <Ionicons name="call" size={13} color="#0D0B1A" />
                <Text
                  style={[
                    s.callBtnTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  Call
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── AI Recommended ───────────────────────────────────────────────────────────
function AIRecommended({ fontsLoaded, navigation }) {
  const [activeTopic, setActiveTopic] = useState("Marriage");
  const dotColors = [C.gold, C.moon, C.green];

  return (
    <View style={s.aiRecWrap}>
      <LinearGradient
        colors={["#1C1850", "#110F30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.aiRecCard}
      >
        {/* Glow orb */}
        <View style={s.aiRecOrb} />

        {/* Header */}
        <View style={s.aiRecHeader}>
          <LinearGradient
            colors={[C.moonLight, C.moon, C.moonDark]}
            style={s.aiRecBadge}
          >
            <MaterialCommunityIcons
              name="crystal-ball"
              size={16}
              color="#FFF"
            />
          </LinearGradient>
          <View>
            <Text
              style={[s.aiRecTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              AI Recommended for You
            </Text>
            <Text
              style={[s.aiRecSub, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              Based on your birth chart & query
            </Text>
          </View>
        </View>

        {/* Topic chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.aiTopicScroll}
        >
          {AI_TOPICS.map((t) => {
            const isA = activeTopic === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTopic(t)}
                style={[s.aiTopicChip, isA && s.aiTopicChipActive]}
                activeOpacity={0.8}
              >
                {isA && (
                  <LinearGradient
                    colors={[C.moonLight + "33", C.moon + "22"]}
                    style={StyleSheet.absoluteFill}
                    borderRadius={20}
                  />
                )}
                <Text
                  style={[
                    s.aiTopicTxt,
                    isA && { color: C.moonLight },
                    fontsLoaded && {
                      fontFamily: isA ? SERIF.semiBold : SERIF.regular,
                    },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommended list */}
        {AI_RECOMMENDED.map((r, i) => (
          <View key={r.id} style={s.aiRecRow}>
            <View style={[s.aiRecDot, { backgroundColor: dotColors[i] }]} />
            <AvatarCircle
              initials={r.avatar}
              colors={r.avatarColors}
              size={42}
              fontSize={14}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text
                style={[s.aiRecName, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {r.name}
              </Text>
              <Text
                style={[
                  s.aiRecFocus,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
                numberOfLines={1}
              >
                {r.focus}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", marginRight: 10 }}>
              <Text
                style={[
                  s.aiRecMatch,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {r.match}
              </Text>
              <Text
                style={[
                  s.aiRecMatchLabel,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                match
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ borderRadius: 12, overflow: "hidden" }}
              onPress={() =>
                navigation.navigate("JyotishProfile", {
                  astrologer: r,
                  mode: "consult",
                })
              }
            >
              <LinearGradient
                colors={[C.goldLight, C.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.aiConsultBtn}
              >
                <Text
                  style={[
                    s.aiConsultTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  Consult
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

// ─── Packages ─────────────────────────────────────────────────────────────────
function PackagesSection({ fontsLoaded, navigation }) {
  const [active, setActive] = useState(1);

  return (
    <View style={s.packagesWrap}>
      <SecHeader
        title="Consultation Packages"
        sub="Choose the right depth"
        fontsLoaded={fontsLoaded}
      />
      {PACKAGES.map((p, i) => {
        const isActive = active === i;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => setActive(i)}
            activeOpacity={0.9}
          >
            <View style={[s.packageCard, isActive && s.packageCardActive]}>
              {/* Top gold line when active */}
              {isActive && (
                <LinearGradient
                  colors={[C.goldLight, C.goldMid, C.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.packageTopLine}
                />
              )}

              <View style={s.packageTop}>
                <View>
                  <View
                    style={[
                      s.packageTag,
                      {
                        backgroundColor: p.tagColor + "22",
                        borderColor: p.tagColor + "55",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.packageTagTxt,
                        { color: p.tagColor },
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      {p.tag}
                    </Text>
                  </View>
                  <Text
                    style={[
                      s.packageLabel,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    {p.label}
                  </Text>
                  <Text
                    style={[
                      s.packageMins,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {p.mins} Minutes
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      s.packagePrice,
                      { color: isActive ? C.goldLight : C.gold },
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    ₹{p.price}
                  </Text>
                  <Text
                    style={[
                      s.packageOrig,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    ₹{p.orig}
                  </Text>
                </View>
              </View>

              {/* Benefits */}
              <View style={s.benefitsRow}>
                {p.benefits.map((b) => (
                  <View
                    key={b}
                    style={[
                      s.benefitChip,
                      isActive && {
                        backgroundColor: C.moonPale,
                        borderColor: C.moonBorder,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={10}
                      color={isActive ? C.green : C.inkMuted}
                    />
                    <Text
                      style={[
                        s.benefitTxt,
                        isActive && { color: C.moonLight },
                        fontsLoaded && { fontFamily: SERIF.regular },
                      ]}
                    >
                      {"  "}
                      {b}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Action row when active */}
              {isActive && (
                <View style={s.packageActions}>
                  <TouchableOpacity
                    style={s.pkgCallBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("JyotishProfile", {
                        package: p,
                        mode: "call",
                      })
                    }
                  >
                    <Ionicons name="call" size={14} color={C.green} />
                    <Text
                      style={[
                        s.pkgCallTxt,
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      Call
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.pkgChatBtn}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("JyotishProfile", {
                        package: p,
                        mode: "chat",
                      })
                    }
                  >
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={14}
                      color={C.moonLight}
                    />
                    <Text
                      style={[
                        s.pkgChatTxt,
                        fontsLoaded && { fontFamily: SERIF.semiBold },
                      ]}
                    >
                      Chat
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.88}
                    style={{ flex: 1, borderRadius: 14, overflow: "hidden" }}
                    onPress={() =>
                      navigation.navigate("JyotishProfile", {
                        package: p,
                        mode: "video",
                      })
                    }
                  >
                    <LinearGradient
                      colors={[C.goldLight, C.goldMid, C.gold]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={s.pkgVideoBtn}
                    >
                      <Ionicons name="videocam" size={14} color="#0D0B1A" />
                      <Text
                        style={[
                          s.pkgVideoTxt,
                          fontsLoaded && { fontFamily: SERIF.bold },
                        ]}
                      >
                        Video
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials({ fontsLoaded }) {
  return (
    <View>
      <SecHeader
        title="Success Stories"
        sub="Real transformations, real guidance"
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.testScroll}
      >
        {TESTIMONIALS.map((t, i) => (
          <View key={i} style={s.testCard}>
            <View style={s.testTop}>
              <AvatarCircle
                initials={t.avatar}
                colors={t.avatarColors}
                size={42}
                fontSize={14}
              />
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={[
                    s.testName,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {t.name}
                </Text>
                <View style={s.testTypePill}>
                  <Text
                    style={[
                      s.testTypeTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {t.type}
                  </Text>
                </View>
              </View>
            </View>
            <View style={s.testStars}>
              {[...Array(t.rating)].map((_, j) => (
                <Ionicons key={j} name="star" size={12} color={C.gold} />
              ))}
            </View>
            <Text
              style={[s.testText, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              "{t.text}"
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────
function BottomCTA({ fontsLoaded, navigation }) {
  return (
    <View style={s.bottomCtaWrap}>
      <LinearGradient
        colors={["#1C1850", "#2A1400", "#110F30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.bottomCtaCard}
      >
        <View style={s.bottomCtaTopLine} />
        <View
          style={[
            s.heroOrb,
            { top: -50, left: "30%", width: 180, height: 180, opacity: 0.1 },
          ]}
        />

        <Text
          style={[
            s.bottomCtaTag,
            fontsLoaded && { fontFamily: SERIF.semiBold },
          ]}
        >
          ✦ Begin Your Journey
        </Text>
        <Text style={[s.bottomCtaH, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Your Stars Are{"\n"}
          <Text style={{ color: C.goldLight }}>Waiting</Text>
        </Text>
        <Text
          style={[s.bottomCtaSub, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          First consultation 50% off for new users. Connect with a Jyotish
          expert right now.
        </Text>

        <TouchableOpacity
          activeOpacity={0.88}
          style={{ borderRadius: 18, overflow: "hidden", marginTop: 22 }}
          onPress={() =>
            navigation.navigate("JyotishProfile", { mode: "consult" })
          }
        >
          <LinearGradient
            colors={[C.goldLight, C.goldMid, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.bottomCtaBtn}
          >
            <Ionicons name="star" size={16} color="#0D0B1A" />
            <Text
              style={[
                s.bottomCtaBtnTxt,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              Start Consultation — First 5 Mins Free
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text
          style={[
            s.bottomCtaNote,
            fontsLoaded && { fontFamily: SERIF.regular },
          ]}
        >
          ☽ 247 astrologers online now · No hidden charges
        </Text>
      </LinearGradient>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NakshatraConsultation() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeroSection fontsLoaded={fontsLoaded} navigation={navigation} />
        <ConsultationModes fontsLoaded={fontsLoaded} navigation={navigation} />
        <SmartFilters fontsLoaded={fontsLoaded} />

        {/* Featured Astrologers */}
        <SecHeader
          title="Top Astrologers"
          sub="Verified Jyotish experts"
          onAll={() => navigation.navigate("JyotishProfile")}
          fontsLoaded={fontsLoaded}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.astroScroll}
        >
          {ASTROLOGERS.map((a) => (
            <AstroCard
              key={a.id}
              a={a}
              fontsLoaded={fontsLoaded}
              navigation={navigation}
            />
          ))}
        </ScrollView>

        <AIRecommended fontsLoaded={fontsLoaded} navigation={navigation} />
        <PackagesSection fontsLoaded={fontsLoaded} navigation={navigation} />
        <Testimonials fontsLoaded={fontsLoaded} />
        <BottomCTA fontsLoaded={fontsLoaded} navigation={navigation} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

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

  // ── Hero ──
  heroWrap: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  heroOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: C.moon,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 18,
  },
  heroTagTxt: { fontSize: 10, color: C.goldMid, letterSpacing: 1.2 },
  heroH1: { fontSize: 34, color: C.ink, lineHeight: 42, marginBottom: 12 },
  heroSub: { fontSize: 14, color: C.inkMid, lineHeight: 22, marginBottom: 22 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 18,
    marginBottom: 22,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statBorder: { borderRightWidth: 0.5, borderRightColor: C.divider },
  statVal: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 10, color: C.inkMuted, marginTop: 3 },
  ctaRow: { flexDirection: "row", gap: 10 },
  ctaPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  ctaPrimaryTxt: { fontSize: 15, color: "#0D0B1A" },
  ctaSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  ctaSecondaryTxt: { fontSize: 15, color: C.moonLight },

  // ── Modes ──
  modesWrap: { paddingHorizontal: 20 },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    padding: 16,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  modeIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  modeLabel: { fontSize: 15, color: C.ink, marginBottom: 2 },
  modeDesc: { fontSize: 12, color: C.inkMuted },
  modePrice: { fontSize: 15, fontWeight: "700" },
  modeCount: { fontSize: 11, color: C.inkMuted, marginTop: 2 },

  // ── Filters ──
  filterScroll: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
  },
  filterTxt: { fontSize: 12, color: C.inkMid },

  // ── Astrologer Scroll ──
  astroScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },

  // ── Astrologer Card ──
  astroCard: {
    width: 290,
    backgroundColor: C.bgCard,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 18,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  astroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bgCard,
  },
  astroName: { fontSize: 16, color: C.ink, marginBottom: 2 },
  astroExp: { fontSize: 11, color: C.inkMuted, marginBottom: 5 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  expertiseChip: {
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  expertiseTxt: { fontSize: 11, color: C.moonLight },
  langChip: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  langTxt: { fontSize: 10, color: C.inkMuted },
  astroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  astroDot: { fontSize: 12, color: C.inkMuted },
  astroSessions: { fontSize: 12, color: C.inkMuted },
  astroDivider: { height: 0.5, backgroundColor: C.divider, marginBottom: 12 },
  astroBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  astroFeeLabel: { fontSize: 10, color: C.inkMuted },
  astroFeeVal: { fontSize: 22, color: C.gold },
  astroFeePer: { fontSize: 11, color: C.inkMuted },
  astroActions: { flexDirection: "row", gap: 8 },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  chatBtnTxt: { fontSize: 13, color: C.moonLight },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  callBtnTxt: { fontSize: 13, color: "#0D0B1A" },

  // ── AI Recommended ──
  aiRecWrap: { paddingHorizontal: 20, marginTop: 8 },
  aiRecCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    overflow: "hidden",
    position: "relative",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  aiRecOrb: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.moon,
    opacity: 0.1,
  },
  aiRecHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  aiRecBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  aiRecTitle: { fontSize: 15, color: C.ink },
  aiRecSub: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  aiTopicScroll: { gap: 8, paddingBottom: 2, marginBottom: 16 },
  aiTopicChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    overflow: "hidden",
  },
  aiTopicChipActive: { borderColor: C.moonLight },
  aiTopicTxt: { fontSize: 12, color: C.inkMuted },
  aiRecRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "rgba(165,168,248,0.12)",
    marginBottom: 8,
  },
  aiRecDot: { width: 7, height: 7, borderRadius: 4, marginRight: 10 },
  aiRecName: { fontSize: 13, color: C.ink },
  aiRecFocus: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  aiRecMatch: { fontSize: 14, color: C.green },
  aiRecMatchLabel: { fontSize: 10, color: C.inkMuted },
  aiConsultBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  aiConsultTxt: { fontSize: 12, color: "#0D0B1A" },

  // ── Packages ──
  packagesWrap: { paddingHorizontal: 20 },
  packageCard: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 18,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  packageCardActive: {
    backgroundColor: "#1E1A50",
    borderColor: C.goldBorder,
    borderWidth: 1.5,
  },
  packageTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  packageTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  packageTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
    marginBottom: 8,
  },
  packageTagTxt: { fontSize: 10 },
  packageLabel: { fontSize: 17, color: C.ink },
  packageMins: { fontSize: 12, color: C.inkMuted, marginTop: 3 },
  packagePrice: { fontSize: 28 },
  packageOrig: {
    fontSize: 13,
    color: C.inkMuted,
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  benefitsRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  benefitChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  benefitTxt: { fontSize: 11, color: C.inkMuted },
  packageActions: { flexDirection: "row", gap: 8, marginTop: 16 },
  pkgCallBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
  },
  pkgCallTxt: { fontSize: 13, color: C.green },
  pkgChatBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  pkgChatTxt: { fontSize: 13, color: C.moonLight },
  pkgVideoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  pkgVideoTxt: { fontSize: 13, color: "#0D0B1A" },

  // ── Trust ──
  trustWrap: { paddingHorizontal: 20, marginTop: 8 },
  trustCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  trustTopLine: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.35,
  },
  trustTitle: {
    fontSize: 22,
    color: C.ink,
    textAlign: "center",
    marginBottom: 18,
  },
  trustGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  trustItem: {
    width: (width - 40 - 44 - 12) / 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  trustVal: { fontSize: 24, fontWeight: "700" },
  trustLabel: {
    fontSize: 11,
    color: C.inkMuted,
    marginTop: 4,
    textAlign: "center",
  },

  // ── Testimonials ──
  testScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  testCard: {
    width: 256,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 18,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  testTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  testName: { fontSize: 14, color: C.ink },
  testTypePill: {
    marginTop: 3,
    alignSelf: "flex-start",
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  testTypeTxt: { fontSize: 10, color: C.moonLight },
  testStars: { flexDirection: "row", gap: 2, marginBottom: 10 },
  testText: {
    fontSize: 13,
    color: C.inkMid,
    lineHeight: 20,
    fontStyle: "italic",
  },

  // ── Bottom CTA ──
  bottomCtaWrap: { paddingHorizontal: 20, marginTop: 28 },
  bottomCtaCard: {
    borderRadius: 26,
    padding: 26,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  bottomCtaTopLine: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.45,
  },
  bottomCtaTag: {
    fontSize: 11,
    color: C.gold,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  bottomCtaH: {
    fontSize: 30,
    color: C.ink,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 10,
  },
  bottomCtaSub: {
    fontSize: 13,
    color: C.inkMid,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 17,
    width: "100%",
  },
  bottomCtaBtnTxt: { fontSize: 15, color: "#0D0B1A" },
  bottomCtaNote: {
    fontSize: 11,
    color: C.inkMuted,
    marginTop: 16,
    textAlign: "center",
  },
});
