/**
 * Nakshatra — JyotishProfile Screen
 *
 * Full profile page for a Jyotish expert.
 * Design language: "Dark Celestial Luxury" — matches HomeScreen v5
 *
 * Dependencies (already in project):
 *   expo-linear-gradient
 *   @expo-google-fonts/cormorant-garamond
 *   @expo/vector-icons
 *   react-native-safe-area-context
 *
 * Usage:
 *   <Stack.Screen name="JyotishProfile" component={JyotishProfile} />
 *   navigation.navigate('JyotishProfile', { astrologerId: 1 })
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

// ─── Design Tokens ────────────────────────────────────────────────────────────
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ASTROLOGER = {
  name: "Pandit Ramesh Sharma",
  title: "Vedic Jyotish Acharya",
  exp: "18 Years",
  location: "Varanasi, India",
  status: "online",
  rating: 4.9,
  totalRatings: "2,140",
  sessions: "2,100+",
  followers: "8.4k",
  languages: ["Hindi", "English", "Sanskrit"],
  expertise: [
    "Vedic Astrology",
    "Nadi Shastra",
    "Kundli Reading",
    "Marriage Matching",
    "Career Guidance",
    "Muhurta",
  ],
  about: `Pandit Ramesh Sharma is a distinguished Vedic Jyotish Acharya with over 18 years of dedicated practice in Jyotish Vidya. Trained under the tutelage of renowned scholars in Varanasi, he specialises in Nadi Shastra and precise birth-chart analysis.\n\nHis readings are rooted in classical Parashari and Jaimini traditions, offering profound insight into karma, dharma, and life's deeper purpose.`,
  fees: { call: 20, chat: 15, video: 35 },
  avatarColors: [C.moonLight, C.moonDark],
  avatar: "PR",
  verified: true,
  topRated: true,
  badges: ["Verified Expert", "Top Rated", "18+ Years"],
  availability: [
    { day: "Mon", slots: ["9 AM", "11 AM", "3 PM", "6 PM"] },
    { day: "Tue", slots: ["10 AM", "2 PM", "5 PM"] },
    { day: "Wed", slots: ["9 AM", "12 PM", "4 PM", "7 PM"] },
    { day: "Thu", slots: ["11 AM", "3 PM"] },
    { day: "Fri", slots: ["9 AM", "1 PM", "5 PM", "8 PM"] },
  ],
};

const REVIEWS = [
  {
    name: "Priya Mehta",
    avatar: "PM",
    avatarColors: ["#A5A8F8", "#3A3DA8"],
    rating: 5,
    date: "2 days ago",
    type: "Video",
    text: "Pandit ji's reading was astoundingly accurate. He identified my career struggles without me mentioning them — purely from my chart. His remedies have already started showing results.",
  },
  {
    name: "Arjun Kapoor",
    avatar: "AK",
    avatarColors: [C.goldMid, C.goldDark],
    rating: 5,
    date: "1 week ago",
    type: "Call",
    text: "The most insightful astrology reading I've ever received. His knowledge of Nadi Shastra is extraordinary. Highly recommended for marriage-related queries.",
  },
  {
    name: "Kavitha Nair",
    avatar: "KN",
    avatarColors: ["#34D077", "#1a7040"],
    rating: 5,
    date: "2 weeks ago",
    type: "Chat",
    text: "Very patient and thorough. He explained every aspect of my kundli with clarity. The remedies he suggested were practical and deeply grounded in scripture.",
  },
  {
    name: "Rohit Sharma",
    avatar: "RS",
    avatarColors: [C.moonLight, "#534AB7"],
    rating: 4,
    date: "3 weeks ago",
    type: "Video",
    text: "Excellent session on business muhurta. Very knowledgeable and responsive. Will definitely consult again for my new venture launch.",
  },
];

const SIMILAR = [
  {
    name: "Jyoti Devi",
    exp: "12 yrs",
    rating: 4.8,
    fee: 15,
    avatar: "JD",
    avatarColors: [C.goldMid, C.goldDark],
    status: "online",
  },
  {
    name: "Acharya Dev",
    exp: "9 yrs",
    rating: 4.7,
    fee: 12,
    avatar: "AD",
    avatarColors: ["#34D077", "#1a7040"],
    status: "busy",
  },
  {
    name: "Sunita K.",
    exp: "22 yrs",
    rating: 5.0,
    fee: 25,
    avatar: "SK",
    avatarColors: [C.goldLight, "#c0920a"],
    status: "online",
  },
];

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

function AvatarCircle({ initials, colors, size = 52, fontSize = 18 }) {
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

// ─── Top Header ───────────────────────────────────────────────────────────────
function TopHeader({ fontsLoaded, navigation }) {
  return (
    <View style={s.topHeader}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={s.backBtn}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={20} color={C.inkMid} />
      </TouchableOpacity>
      <Text
        style={[
          s.topHeaderTitle,
          fontsLoaded && { fontFamily: SERIF.semiBold },
        ]}
      >
        Jyotish Profile
      </Text>
      <TouchableOpacity style={s.shareBtn} activeOpacity={0.8}>
        <Ionicons name="share-social-outline" size={19} color={C.inkMid} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ fontsLoaded, navigation }) {
  const [saved, setSaved] = useState(false);

  return (
    <View style={s.heroWrap}>
      {/* Background gradient sweep */}
      <LinearGradient
        colors={["#1C1A3A", "#0D0B1A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Glow orb behind avatar */}
      <View style={s.heroGlow} />

      {/* Avatar ring */}
      <View style={s.avatarRingOuter}>
        <LinearGradient
          colors={[C.goldLight, C.goldMid, C.gold, C.moonLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.avatarRingGrad}
        >
          <View style={s.avatarRingInner}>
            <AvatarCircle
              initials={ASTROLOGER.avatar}
              colors={ASTROLOGER.avatarColors}
              size={88}
              fontSize={30}
            />
          </View>
        </LinearGradient>
        {/* Online dot */}
        <View style={s.onlineDot} />
      </View>

      {/* Name + title */}
      <Text style={[s.heroName, fontsLoaded && { fontFamily: SERIF.bold }]}>
        {ASTROLOGER.name}
      </Text>
      <Text style={[s.heroTitle, fontsLoaded && { fontFamily: SERIF.regular }]}>
        {ASTROLOGER.title}
      </Text>

      {/* Location + language */}
      <View style={s.heroMeta}>
        <Ionicons name="location-outline" size={13} color={C.inkMuted} />
        <Text
          style={[s.heroMetaTxt, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {ASTROLOGER.location}
        </Text>
        <View style={s.heroDot} />
        <Ionicons name="language-outline" size={13} color={C.inkMuted} />
        <Text
          style={[s.heroMetaTxt, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {ASTROLOGER.languages.slice(0, 2).join(", ")}
        </Text>
      </View>

      {/* Badges */}
      <View style={s.badgesRow}>
        {ASTROLOGER.badges.map((b, i) => (
          <View
            key={i}
            style={[
              s.badge,
              i === 0 && {
                borderColor: C.goldBorder,
                backgroundColor: C.goldPale,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={
                i === 0
                  ? "shield-check"
                  : i === 1
                    ? "star-circle"
                    : "clock-outline"
              }
              size={11}
              color={i === 0 ? C.goldMid : i === 1 ? C.moonLight : C.inkMid}
            />
            <Text
              style={[
                s.badgeTxt,
                {
                  color: i === 0 ? C.goldMid : i === 1 ? C.moonLight : C.inkMid,
                },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {"  "}
              {b}
            </Text>
          </View>
        ))}
      </View>

      {/* Stats row */}
      <View style={s.statsRow}>
        {[
          {
            val: ASTROLOGER.rating,
            label: "Rating",
            icon: "star",
            color: C.gold,
          },
          {
            val: ASTROLOGER.sessions,
            label: "Sessions",
            icon: "people",
            color: C.moonLight,
          },
          {
            val: ASTROLOGER.exp,
            label: "Experience",
            icon: "time",
            color: C.green,
          },
          {
            val: ASTROLOGER.followers,
            label: "Followers",
            icon: "heart",
            color: "#E84040",
          },
        ].map((st, i) => (
          <View
            key={i}
            style={[
              s.statItem,
              i < 3 && { borderRightWidth: 0.5, borderRightColor: C.divider },
            ]}
          >
            <Ionicons
              name={st.icon}
              size={13}
              color={st.color}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[
                s.statVal,
                { color: st.color },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {st.val}
            </Text>
            <Text
              style={[
                s.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {st.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Save + Follow */}
      <View style={s.heroActions}>
        <TouchableOpacity
          onPress={() => setSaved(!saved)}
          style={s.saveBtn}
          activeOpacity={0.85}
        >
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={16}
            color={saved ? C.goldMid : C.inkMid}
          />
          <Text
            style={[
              s.saveBtnTxt,
              { color: saved ? C.goldMid : C.inkMid },
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {"  "}
            {saved ? "Saved" : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.followBtn} activeOpacity={0.85}>
          <Ionicons name="person-add-outline" size={15} color={C.moonLight} />
          <Text
            style={[
              s.followBtnTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {"  "}Follow
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Consult CTA Strip ────────────────────────────────────────────────────────
function ConsultStrip({ fontsLoaded, navigation }) {
  return (
    <View style={s.consultStrip}>
      {/* Call */}
      <PressScale
        style={{ flex: 1 }}
        onPress={() => navigation.navigate("JyotishChat", { mode: "call" })}
      >
        <View style={s.consultBtnCall}>
          <Ionicons name="call" size={16} color={C.green} />
          <Text
            style={[
              s.consultBtnLabel,
              { color: C.green },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            Call
          </Text>
          <Text
            style={[
              s.consultBtnPrice,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            ₹{ASTROLOGER.fees.call}/min
          </Text>
        </View>
      </PressScale>

      {/* Chat */}
      <PressScale
        style={{ flex: 1.3 }}
        onPress={() => navigation.navigate("JyotishChat", { mode: "chat" })}
      >
        <LinearGradient
          colors={[C.goldLight, C.goldMid, C.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.consultBtnChat}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color="#0D0B1A" />
          <Text
            style={[
              s.consultBtnChatLabel,
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            Chat Now
          </Text>
          <Text
            style={[
              s.consultBtnChatPrice,
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            ₹{ASTROLOGER.fees.chat}/min
          </Text>
        </LinearGradient>
      </PressScale>

      {/* Video */}
      <PressScale
        style={{ flex: 1 }}
        onPress={() => navigation.navigate("JyotishChat", { mode: "video" })}
      >
        <View style={s.consultBtnVideo}>
          <Ionicons name="videocam" size={16} color={C.moonLight} />
          <Text
            style={[
              s.consultBtnLabel,
              { color: C.moonLight },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            Video
          </Text>
          <Text
            style={[
              s.consultBtnPrice,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            ₹{ASTROLOGER.fees.video}/min
          </Text>
        </View>
      </PressScale>
    </View>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection({ fontsLoaded }) {
  const [expanded, setExpanded] = useState(false);
  const text = ASTROLOGER.about;
  const preview = text.slice(0, 180) + "...";

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <MaterialCommunityIcons
          name="script-text-outline"
          size={16}
          color={C.gold}
        />
        <Text
          style={[s.sectionTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
        >
          {"  "}About
        </Text>
      </View>
      <Text style={[s.aboutText, fontsLoaded && { fontFamily: SERIF.regular }]}>
        {expanded ? text : preview}
      </Text>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
        style={s.readMoreBtn}
      >
        <Text
          style={[s.readMoreTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          {expanded ? "Show less" : "Read more"}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={13}
          color={C.moon}
          style={{ marginLeft: 4 }}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── Expertise Section ────────────────────────────────────────────────────────
function ExpertiseSection({ fontsLoaded }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <MaterialCommunityIcons
          name="star-four-points"
          size={15}
          color={C.gold}
        />
        <Text
          style={[s.sectionTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
        >
          {"  "}Areas of Expertise
        </Text>
      </View>
      <View style={s.expertiseGrid}>
        {ASTROLOGER.expertise.map((e, i) => (
          <View
            key={i}
            style={[
              s.expertiseChip,
              {
                borderColor: i % 2 === 0 ? C.goldBorder : C.moonBorder,
                backgroundColor: i % 2 === 0 ? C.goldPale : C.moonPale,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={i % 2 === 0 ? "star-four-points" : "moon-waning-crescent"}
              size={11}
              color={i % 2 === 0 ? C.goldMid : C.moonLight}
            />
            <Text
              style={[
                s.expertiseTxt,
                { color: i % 2 === 0 ? C.goldMid : C.moonLight },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {"  "}
              {e}
            </Text>
          </View>
        ))}
      </View>
      {/* Languages */}
      <View style={s.langRow}>
        <Ionicons name="language-outline" size={14} color={C.inkMuted} />
        <Text
          style={[s.langLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {"  "}Languages:{" "}
        </Text>
        {ASTROLOGER.languages.map((l, i) => (
          <Text
            key={i}
            style={[s.langVal, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            {l}
            {i < ASTROLOGER.languages.length - 1 ? "  ·  " : ""}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─── Availability Section ─────────────────────────────────────────────────────
function AvailabilitySection({ fontsLoaded }) {
  const [activeDay, setActiveDay] = useState(0);
  const slots = ASTROLOGER.availability[activeDay]?.slots || [];

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Ionicons name="calendar-outline" size={15} color={C.gold} />
        <Text
          style={[s.sectionTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
        >
          {"  "}Availability
        </Text>
        <View style={s.availLiveBadge}>
          <View style={s.availLiveDot} />
          <Text
            style={[
              s.availLiveTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Live Today
          </Text>
        </View>
      </View>

      {/* Day tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.dayScroll}
      >
        {ASTROLOGER.availability.map((d, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveDay(i)}
            style={[s.dayTab, i === activeDay && s.dayTabActive]}
            activeOpacity={0.8}
          >
            {i === activeDay && (
              <LinearGradient
                colors={[C.moonLight, C.moon]}
                style={StyleSheet.absoluteFill}
                borderRadius={20}
              />
            )}
            <Text
              style={[
                s.dayTabTxt,
                i === activeDay && { color: "#FFF" },
                fontsLoaded && {
                  fontFamily: i === activeDay ? SERIF.semiBold : SERIF.regular,
                },
              ]}
            >
              {d.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time slots */}
      <View style={s.slotsGrid}>
        {slots.map((sl, i) => (
          <TouchableOpacity key={i} style={s.slotChip} activeOpacity={0.8}>
            <Ionicons name="time-outline" size={11} color={C.moon} />
            <Text
              style={[s.slotTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
            >
              {"  "}
              {sl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Rating Summary ───────────────────────────────────────────────────────────
function RatingSummary({ fontsLoaded }) {
  const bars = [
    { stars: 5, pct: 82 },
    { stars: 4, pct: 11 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];
  return (
    <View style={s.ratingSummary}>
      <View style={s.ratingLeft}>
        <Text style={[s.ratingBig, fontsLoaded && { fontFamily: SERIF.bold }]}>
          {ASTROLOGER.rating}
        </Text>
        <View style={{ flexDirection: "row", gap: 3, marginVertical: 6 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons key={i} name="star" size={14} color={C.gold} />
          ))}
        </View>
        <Text
          style={[s.ratingCount, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {ASTROLOGER.totalRatings} reviews
        </Text>
      </View>
      <View style={s.ratingBars}>
        {bars.map((b) => (
          <View key={b.stars} style={s.ratingBarRow}>
            <Text
              style={[
                s.ratingBarLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {b.stars}★
            </Text>
            <View style={s.ratingBarBg}>
              <LinearGradient
                colors={[C.goldLight, C.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[s.ratingBarFill, { width: `${b.pct}%` }]}
              />
            </View>
            <Text
              style={[
                s.ratingBarPct,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {b.pct}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Reviews ─────────────────────────────────────────────────────────────────
function ReviewsSection({ fontsLoaded }) {
  return (
    <View style={s.section}>
      <View style={[s.sectionHeader, { justifyContent: "space-between" }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="star" size={15} color={C.gold} />
          <Text
            style={[s.sectionTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            {"  "}Reviews
          </Text>
        </View>
        <TouchableOpacity style={s.seeAllBtn}>
          <Text
            style={[s.seeAllTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            See all
          </Text>
          <Ionicons name="arrow-forward" size={12} color={C.moon} />
        </TouchableOpacity>
      </View>

      <RatingSummary fontsLoaded={fontsLoaded} />

      <View
        style={{ height: 0.5, backgroundColor: C.divider, marginVertical: 16 }}
      />

      {REVIEWS.map((r, i) => (
        <View
          key={i}
          style={[
            s.reviewCard,
            i < REVIEWS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: C.divider,
            },
          ]}
        >
          <View style={s.reviewTop}>
            <AvatarCircle
              initials={r.avatar}
              colors={r.avatarColors}
              size={38}
              fontSize={13}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text
                style={[
                  s.reviewName,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {r.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <View style={{ flexDirection: "row", gap: 2 }}>
                  {[...Array(r.rating)].map((_, j) => (
                    <Ionicons key={j} name="star" size={10} color={C.gold} />
                  ))}
                </View>
                <Text
                  style={[
                    s.reviewDate,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {r.date}
                </Text>
                <View style={s.reviewTypePill}>
                  <Text
                    style={[
                      s.reviewTypeTxt,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {r.type}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={[s.reviewText, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {r.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ─── Similar Astrologers ──────────────────────────────────────────────────────
function SimilarSection({ fontsLoaded }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Ionicons name="people-outline" size={15} color={C.gold} />
        <Text
          style={[s.sectionTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
        >
          {"  "}Similar Jyotish
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        {SIMILAR.map((a, i) => (
          <View key={i} style={s.similarCard}>
            <View style={{ position: "relative", marginBottom: 10 }}>
              <AvatarCircle
                initials={a.avatar}
                colors={a.avatarColors}
                size={50}
                fontSize={16}
              />
              {a.status === "online" && (
                <View
                  style={[
                    s.onlineDot,
                    {
                      bottom: 0,
                      right: 0,
                      width: 11,
                      height: 11,
                      borderRadius: 6,
                    },
                  ]}
                />
              )}
            </View>
            <Text
              style={[s.similarName, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {a.name}
            </Text>
            <Text
              style={[
                s.similarExp,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {a.exp}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginVertical: 4,
              }}
            >
              <Ionicons name="star" size={10} color={C.gold} />
              <Text
                style={[
                  s.similarRating,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {a.rating}
              </Text>
            </View>
            <Text
              style={[s.similarFee, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              ₹{a.fee}/min
            </Text>
            <TouchableOpacity style={s.similarConsultBtn} activeOpacity={0.85}>
              <Text
                style={[
                  s.similarConsultTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Consult
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JyotishProfile() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopHeader fontsLoaded={fontsLoaded} navigation={navigation} />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <HeroSection fontsLoaded={fontsLoaded} navigation={navigation} />
        <ConsultStrip fontsLoaded={fontsLoaded} navigation={navigation} />
        <AboutSection fontsLoaded={fontsLoaded} />
        <ExpertiseSection fontsLoaded={fontsLoaded} />
        <AvailabilitySection fontsLoaded={fontsLoaded} />
        <ReviewsSection fontsLoaded={fontsLoaded} />
        <SimilarSection fontsLoaded={fontsLoaded} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={s.stickyBar}>
        <LinearGradient
          colors={["rgba(13,11,26,0)", "rgba(13,11,26,0.96)", C.bg]}
          style={s.stickyGrad}
          pointerEvents="none"
        />
        <View style={s.stickyContent}>
          <View>
            <Text
              style={[
                s.stickyFeeLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              Chat from
            </Text>
            <Text
              style={[
                s.stickyFeeVal,
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              ₹{ASTROLOGER.fees.chat}
              <Text style={s.stickyFeePer}>/min</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              marginLeft: 16,
              borderRadius: 18,
              overflow: "hidden",
            }}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("JyotishChat")}
          >
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.stickyBtn}
            >
              <Ionicons name="chatbubble-ellipses" size={17} color="#0D0B1A" />
              <Text
                style={[
                  s.stickyBtnTxt,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {"  "}Consult Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  // ── Top Header ──
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  topHeaderTitle: { fontSize: 16, color: C.inkMid, letterSpacing: 0.5 },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Hero ──
  heroWrap: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: 10,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.moon,
    opacity: 0.1,
  },
  avatarRingOuter: { position: "relative", marginBottom: 16 },
  avatarRingGrad: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarRingInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.green,
    borderWidth: 2.5,
    borderColor: C.bg,
  },
  heroName: {
    fontSize: 26,
    color: C.ink,
    textAlign: "center",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 14,
    color: C.inkMuted,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  heroMeta: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  heroMetaTxt: { fontSize: 12, color: C.inkMuted, marginHorizontal: 3 },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.inkMuted,
    marginHorizontal: 5,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 18,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    backgroundColor: C.moonPale,
  },
  badgeTxt: { fontSize: 10 },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 18,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statVal: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  statLabel: {
    fontSize: 9,
    color: C.inkMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heroActions: { flexDirection: "row", gap: 10, width: "100%" },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  saveBtnTxt: { fontSize: 13 },
  followBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  followBtnTxt: { fontSize: 13, color: C.moonLight },

  // ── Consult Strip ──
  consultStrip: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  consultBtnCall: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
  },
  consultBtnChat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  consultBtnVideo: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  consultBtnLabel: { fontSize: 13, fontWeight: "700", marginTop: 4 },
  consultBtnChatLabel: { fontSize: 13, color: "#0D0B1A", marginTop: 4 },
  consultBtnPrice: { fontSize: 10, color: C.inkMuted, marginTop: 2 },
  consultBtnChatPrice: {
    fontSize: 10,
    color: "rgba(13,11,26,0.7)",
    marginTop: 2,
  },

  // ── Sections ──
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, color: C.ink },

  // ── About ──
  aboutText: {
    fontSize: 15,
    color: C.inkMid,
    lineHeight: 26,
    marginBottom: 10,
  },
  readMoreBtn: { flexDirection: "row", alignItems: "center" },
  readMoreTxt: { fontSize: 13, color: C.moon },

  // ── Expertise ──
  expertiseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  expertiseChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  expertiseTxt: { fontSize: 12 },
  langRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  langLabel: { fontSize: 13, color: C.inkMuted },
  langVal: { fontSize: 13, color: C.inkMid },

  // ── Availability ──
  availLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: "auto",
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  availLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  availLiveTxt: { fontSize: 10, color: C.green },
  dayScroll: { gap: 8, paddingBottom: 4, marginBottom: 14 },
  dayTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    backgroundColor: C.bgCard,
  },
  dayTabActive: { borderColor: C.moon },
  dayTabTxt: { fontSize: 13, color: C.inkMuted },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  slotTxt: { fontSize: 13, color: C.moonLight },

  // ── Rating ──
  ratingSummary: { flexDirection: "row", gap: 16, marginBottom: 4 },
  ratingLeft: { alignItems: "center", justifyContent: "center", width: 90 },
  ratingBig: { fontSize: 48, color: C.gold, lineHeight: 52 },
  ratingCount: { fontSize: 11, color: C.inkMuted, textAlign: "center" },
  ratingBars: { flex: 1, gap: 5, justifyContent: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingBarLabel: {
    width: 22,
    fontSize: 11,
    color: C.inkMuted,
    textAlign: "right",
  },
  ratingBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: C.bgCardAlt,
    borderRadius: 4,
    overflow: "hidden",
  },
  ratingBarFill: { height: "100%", borderRadius: 4 },
  ratingBarPct: { width: 28, fontSize: 10, color: C.inkMuted },

  // ── Reviews ──
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  seeAllTxt: { fontSize: 12, color: C.moon },
  reviewCard: { paddingVertical: 14 },
  reviewTop: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  reviewName: { fontSize: 14, color: C.ink },
  reviewDate: { fontSize: 11, color: C.inkMuted },
  reviewTypePill: {
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reviewTypeTxt: { fontSize: 9, color: C.moonLight },
  reviewText: { fontSize: 13, color: C.inkMid, lineHeight: 21 },

  // ── Similar ──
  similarCard: {
    width: 130,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 14,
    alignItems: "center",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  similarName: { fontSize: 13, color: C.ink, textAlign: "center" },
  similarExp: { fontSize: 10, color: C.inkMuted, marginTop: 2 },
  similarRating: { fontSize: 12, color: C.gold },
  similarFee: { fontSize: 13, color: C.gold, marginBottom: 8 },
  similarConsultBtn: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
  },
  similarConsultTxt: { fontSize: 12, color: C.goldMid },

  // ── Sticky Bar ──
  stickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  stickyGrad: { position: "absolute", top: -20, left: 0, right: 0, height: 40 },
  stickyContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20, // ← add this
    backgroundColor: C.bg,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
  },
  stickyFeeLabel: { fontSize: 20, color: C.inkMuted },
  stickyFeeVal: { fontSize: 30, color: C.gold },
  stickyFeePer: { fontSize: 20, color: C.inkMuted },
  stickyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  stickyBtnTxt: { fontSize: 16, color: "#0D0B1A" },
});
