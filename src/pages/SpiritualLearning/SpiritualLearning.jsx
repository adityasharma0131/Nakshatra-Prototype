/**
 * Nakshatra — SpiritualLearning Screen
 *
 * Design language: "Dark Celestial Luxury" — mirrors CalendarScreen / YogaScreen
 * A premium spiritual learning hub combining MasterClass elegance with
 * Vedic mysticism. All 8 sections fully implemented.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";

const { width, height } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  bgTray: "#110F26",
  bgDeep: "#0A0817",

  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.12)",
  goldBorder: "rgba(212,160,23,0.25)",

  moon: "#7B7FE8",
  moonLight: "#A5A8F8",
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

  pink: "#E040A0",
  pinkPale: "rgba(224,64,160,0.14)",
  pinkBorder: "rgba(224,64,160,0.28)",

  amber: "#F59E0B",
  amberPale: "rgba(245,158,11,0.13)",
  amberBorder: "rgba(245,158,11,0.28)",

  red: "#E84040",
  redPale: "rgba(232,64,64,0.14)",

  indigo: "#6366F1",
  indigoPale: "rgba(99,102,241,0.14)",
  indigoBorder: "rgba(99,102,241,0.28)",

  rose: "#FB7185",
  rosePale: "rgba(251,113,133,0.13)",

  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  overlay: "rgba(0,0,0,0.72)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const FEATURED_COURSES = [
  {
    id: "fc1",
    title: "Complete Vedic Astrology Mastery",
    subtitle: "From Kundli to Prediction",
    instructor: "Pt. Rajesh Sharma",
    image:
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80",
    gradient: [C.indigo + "CC", C.bg],
    tag: "BESTSELLER",
    tagColor: C.goldMid,
    rating: 4.9,
    students: "12.4K",
    lessons: 84,
    hours: "42h",
  },
  {
    id: "fc2",
    title: "Bhagavad Gita: Living Wisdom",
    subtitle: "18 Chapters · Life Transforming",
    instructor: "Swami Anandamurti",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    gradient: [C.gold + "AA", C.bg],
    tag: "NEW",
    tagColor: C.teal,
    rating: 5.0,
    students: "8.7K",
    lessons: 56,
    hours: "28h",
  },
  {
    id: "fc3",
    title: "Nakshatras & Planetary Transits",
    subtitle: "Advanced Predictive Techniques",
    instructor: "Dr. Meera Iyer",
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80",
    gradient: [C.moon + "CC", C.bg],
    tag: "PREMIUM",
    tagColor: C.pink,
    rating: 4.8,
    students: "5.2K",
    lessons: 62,
    hours: "35h",
  },
];

const CATEGORIES = [
  {
    id: "cat1",
    label: "Vedic Astrology",
    icon: "⭐",
    color: C.gold,
    bg: C.goldPale,
    border: C.goldBorder,
  },
  {
    id: "cat2",
    label: "Horoscope",
    icon: "♈",
    color: C.moon,
    bg: C.moonPale,
    border: C.moonBorder,
  },
  {
    id: "cat3",
    label: "Nakshatras",
    icon: "✦",
    color: C.teal,
    bg: C.tealPale,
    border: C.tealBorder,
  },
  {
    id: "cat4",
    label: "Numerology",
    icon: "🔢",
    color: C.amber,
    bg: C.amberPale,
    border: C.amberBorder,
  },
  {
    id: "cat5",
    label: "Tarot Reading",
    icon: "🃏",
    color: C.pink,
    bg: C.pinkPale,
    border: C.pinkBorder,
  },
  {
    id: "cat6",
    label: "Palmistry",
    icon: "🤲",
    color: C.rose,
    bg: C.rosePale,
    border: C.pinkBorder,
  },
  {
    id: "cat7",
    label: "Vastu Shastra",
    icon: "🏛️",
    color: C.green,
    bg: C.greenPale,
    border: C.greenBorder,
  },
  {
    id: "cat8",
    label: "Meditation",
    icon: "🧘",
    color: C.indigo,
    bg: C.indigoPale,
    border: C.indigoBorder,
  },
  {
    id: "cat9",
    label: "Yoga",
    icon: "🌿",
    color: C.teal,
    bg: C.tealPale,
    border: C.tealBorder,
  },
  {
    id: "cat10",
    label: "Bhagavad Gita",
    icon: "📿",
    color: C.gold,
    bg: C.goldPale,
    border: C.goldBorder,
  },
  {
    id: "cat11",
    label: "Sanskrit",
    icon: "ॐ",
    color: C.amber,
    bg: C.amberPale,
    border: C.amberBorder,
  },
  {
    id: "cat12",
    label: "Spiritual Healing",
    icon: "💫",
    color: C.moon,
    bg: C.moonPale,
    border: C.moonBorder,
  },
];

const IN_PROGRESS = [
  {
    id: "ip1",
    title: "Kundli Analysis Fundamentals",
    instructor: "Pt. Rajesh Sharma",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    progress: 68,
    lastLesson: "Lesson 14: Dasha Calculations",
    totalLessons: 42,
    color: C.gold,
  },
  {
    id: "ip2",
    title: "Pranayama & Breathwork",
    instructor: "Yogi Suresh Das",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    progress: 35,
    lastLesson: "Lesson 6: Nadi Shodhana",
    totalLessons: 28,
    color: C.teal,
  },
  {
    id: "ip3",
    title: "Tarot: Major Arcana",
    instructor: "Priya Moonrise",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    progress: 82,
    lastLesson: "Lesson 18: The World Card",
    totalLessons: 22,
    color: C.pink,
  },
];

const POPULAR_COURSES = [
  {
    id: "pc1",
    title: "Vastu Shastra: Sacred Architecture",
    instructor: "Ar. Deepak Vyas",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80",
    duration: "18h 30m",
    lessons: 48,
    rating: 4.7,
    enrolled: "3.8K",
    level: "Beginner",
    levelColor: C.green,
    price: "₹1,299",
    color: C.green,
  },
  {
    id: "pc2",
    title: "Numerology: Numbers & Destiny",
    instructor: "Acharya Vinod Kumar",
    image:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=500&q=80",
    duration: "12h 15m",
    lessons: 36,
    rating: 4.6,
    enrolled: "6.1K",
    level: "Beginner",
    levelColor: C.green,
    price: "₹999",
    color: C.amber,
  },
  {
    id: "pc3",
    title: "Advanced Palmistry Secrets",
    instructor: "Dr. Kavita Rao",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
    duration: "22h 45m",
    lessons: 58,
    rating: 4.8,
    enrolled: "2.9K",
    level: "Intermediate",
    levelColor: C.amber,
    price: "₹1,599",
    color: C.rose,
  },
  {
    id: "pc4",
    title: "Mantra Science & Chanting",
    instructor: "Swami Brahmananda",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
    duration: "15h 20m",
    lessons: 40,
    rating: 4.9,
    enrolled: "9.4K",
    level: "All Levels",
    levelColor: C.teal,
    price: "₹1,199",
    color: C.moon,
  },
];

const GURUS = [
  {
    id: "g1",
    name: "Pt. Rajesh Sharma",
    expertise: "Vedic Astrology · Kundli",
    years: 28,
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80",
    students: "42K",
    courses: 12,
    color: C.gold,
    following: false,
  },
  {
    id: "g2",
    name: "Swami Anandamurti",
    expertise: "Bhagavad Gita · Vedanta",
    years: 35,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    students: "28K",
    courses: 8,
    color: C.amber,
    following: true,
  },
  {
    id: "g3",
    name: "Dr. Meera Iyer",
    expertise: "Nakshatras · Jyotish",
    years: 22,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    students: "19K",
    courses: 9,
    color: C.pink,
    following: false,
  },
  {
    id: "g4",
    name: "Yogi Suresh Das",
    expertise: "Yoga · Pranayama",
    years: 18,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    students: "31K",
    courses: 15,
    color: C.teal,
    following: false,
  },
];

const JOURNEY_LEVELS = [
  {
    id: "jl1",
    level: "Beginner",
    title: "Seeker",
    subtitle: "Birth Chart Basics, Intro to Vedas",
    icon: "🌱",
    color: C.green,
    courses: 14,
    unlocked: true,
    completed: 8,
  },
  {
    id: "jl2",
    level: "Intermediate",
    title: "Practitioner",
    subtitle: "Dasha Systems, Transit Analysis",
    icon: "🔥",
    color: C.amber,
    courses: 18,
    unlocked: true,
    completed: 3,
  },
  {
    id: "jl3",
    level: "Advanced",
    title: "Adept",
    subtitle: "Prashna, Muhurta, Remedies",
    icon: "⚡",
    color: C.moon,
    courses: 22,
    unlocked: false,
    completed: 0,
  },
  {
    id: "jl4",
    level: "Master",
    title: "Jyotishi",
    subtitle: "Nadi Astrology, Ancient Texts",
    icon: "👑",
    color: C.gold,
    courses: 16,
    unlocked: false,
    completed: 0,
  },
];

const ACHIEVEMENTS = [
  {
    id: "ach1",
    title: "First Star",
    icon: "⭐",
    desc: "Completed first course",
    color: C.gold,
    earned: true,
  },
  {
    id: "ach2",
    title: "Fire Seeker",
    icon: "🔥",
    desc: "7-day learning streak",
    color: C.amber,
    earned: true,
  },
  {
    id: "ach3",
    title: "Moon Scholar",
    icon: "🌙",
    desc: "10 lessons in one day",
    color: C.moon,
    earned: true,
  },
  {
    id: "ach4",
    title: "Nakshatra Guide",
    icon: "✦",
    desc: "Mastered all 27 stars",
    color: C.teal,
    earned: false,
  },
  {
    id: "ach5",
    title: "Guru's Choice",
    icon: "📿",
    desc: "Top-rated student",
    color: C.pink,
    earned: false,
  },
  {
    id: "ach6",
    title: "Ancient Keeper",
    icon: "🏺",
    desc: "Completed Sanskrit I",
    color: C.rose,
    earned: false,
  },
];

const DAILY_WISDOMS = [
  {
    quote:
      "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.",
    source: "Bhagavad Gita",
    chapter: "Chapter 2, Verse 20",
    icon: "📿",
    color: C.gold,
  },
  {
    quote:
      "Whatever happened, happened for the good. Whatever is happening is happening for the good. Whatever will happen, will also happen for the good.",
    source: "Bhagavad Gita",
    chapter: "Chapter 2",
    icon: "🕉️",
    color: C.teal,
  },
];

// ─── Animated Progress Bar ────────────────────────────────────────────────────
function ProgressBar({ progress, color, height: h = 5 }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress / 100,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={{
        height: h,
        backgroundColor: C.bgSurface,
        borderRadius: h,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height: "100%",
          borderRadius: h,
          backgroundColor: color,
          width: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function Skeleton({ w, h, radius = 8, style }) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        {
          width: w,
          height: h,
          borderRadius: radius,
          backgroundColor: C.bgSurface,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  iconColor,
  iconBg,
  title,
  actionLabel,
  onAction,
  fontsLoaded,
}) {
  return (
    <View style={sh.wrap}>
      <View style={sh.left}>
        <View
          style={[
            sh.iconWrap,
            { backgroundColor: iconBg, borderColor: iconColor + "40" },
          ]}
        >
          <Ionicons name={icon} size={14} color={iconColor} />
        </View>
        <Text style={[sh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
          {title}
        </Text>
      </View>
      {actionLabel && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.75}>
          <Text
            style={[sh.action, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
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
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, color: C.ink },
  action: { fontSize: 12.5, color: C.moonLight, letterSpacing: 0.3 },
});

// ─── 1. TOP NAV ───────────────────────────────────────────────────────────────
function TopNav({ fontsLoaded, navigation }) {
  return (
    <View style={tn.wrap}>
      <TouchableOpacity
        style={tn.btn}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={20} color={C.inkMid} />
      </TouchableOpacity>
      <View style={tn.center}>
        <Text style={[tn.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Spiritual Learning
        </Text>
        <Text style={[tn.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Vidya · Wisdom · Transformation
        </Text>
      </View>
      <TouchableOpacity style={tn.btn} activeOpacity={0.8}>
        <Ionicons name="notifications-outline" size={18} color={C.inkMid} />
        <View style={tn.notifDot} />
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
    paddingBottom: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.pink,
    borderWidth: 1.5,
    borderColor: C.bg,
  },
  center: { flex: 1, alignItems: "center" },
  title: { fontSize: 19, color: C.ink },
  sub: { fontSize: 10, color: C.inkMuted, letterSpacing: 1.2, marginTop: 1 },
});

// ─── 1. HERO BANNER ───────────────────────────────────────────────────────────
function HeroBanner({ fontsLoaded }) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [searchText, setSearchText] = useState("");
  const dotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIdx((i) => (i + 1) % FEATURED_COURSES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const course = FEATURED_COURSES[featuredIdx];

  return (
    <View style={hb.wrap}>
      {/* Greeting + streak */}
      <View style={hb.greeting}>
        <View>
          <Text
            style={[hb.greetSub, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            ✦ Namaste, Aditya
          </Text>
          <Text
            style={[hb.greetMain, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Your Path to Wisdom
          </Text>
        </View>
        <View style={hb.streakBadge}>
          <Text style={hb.streakFire}>🔥</Text>
          <View>
            <Text
              style={[hb.streakNum, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              14
            </Text>
            <Text
              style={[
                hb.streakLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              day streak
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={hb.searchWrap}>
        <Ionicons
          name="search-outline"
          size={16}
          color={C.inkMuted}
          style={hb.searchIcon}
        />
        <TextInput
          style={[hb.searchInput, fontsLoaded && { fontFamily: SERIF.regular }]}
          placeholder="Search courses, gurus, topics..."
          placeholderTextColor={C.inkMuted}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={16} color={C.inkMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Featured course carousel */}
      <View style={hb.carouselWrap}>
        <Image
          source={{ uri: course.image }}
          style={hb.carouselImg}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", C.bg + "F0"]}
          style={hb.carouselGrad}
        />
        <LinearGradient
          colors={course.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          opacity={0.55}
        />

        {/* Tag */}
        <View
          style={[
            hb.carouselTag,
            {
              backgroundColor: course.tagColor + "30",
              borderColor: course.tagColor + "60",
            },
          ]}
        >
          <Text
            style={[
              hb.carouselTagTxt,
              { color: course.tagColor },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {course.tag}
          </Text>
        </View>

        {/* Content */}
        <View style={hb.carouselContent}>
          <Text
            style={[
              hb.carouselTitle,
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
            numberOfLines={2}
          >
            {course.title}
          </Text>
          <Text
            style={[
              hb.carouselSub,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {course.subtitle}
          </Text>
          <View style={hb.carouselMeta}>
            <Ionicons
              name="person-circle-outline"
              size={13}
              color={C.inkMuted}
            />
            <Text
              style={[
                hb.carouselMetaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {course.instructor}
            </Text>
            <View style={hb.metaDot} />
            <Ionicons name="star" size={11} color={C.goldMid} />
            <Text
              style={[
                hb.carouselMetaTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
                { color: C.goldMid },
              ]}
            >
              {course.rating}
            </Text>
            <View style={hb.metaDot} />
            <Text
              style={[
                hb.carouselMetaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {course.students} students
            </Text>
          </View>
          <View style={hb.carouselFooter}>
            <View style={hb.lessonChip}>
              <Ionicons name="play-circle-outline" size={12} color={C.inkMid} />
              <Text
                style={[
                  hb.lessonChipTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {course.lessons} lessons · {course.hours}
              </Text>
            </View>
            <TouchableOpacity style={hb.enrollBtn} activeOpacity={0.85}>
              <Text
                style={[
                  hb.enrollTxt,
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                Explore →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pagination dots */}
        <View style={hb.dots}>
          {FEATURED_COURSES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setFeaturedIdx(i)}>
              <View
                style={[
                  hb.dot,
                  i === featuredIdx
                    ? { width: 20, backgroundColor: C.goldMid }
                    : { width: 6, backgroundColor: C.inkMuted + "80" },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily wisdom chip */}
      <View style={hb.wisdomChip}>
        <Text style={hb.wisdomChipIcon}>✦</Text>
        <Text
          style={[
            hb.wisdomChipTxt,
            fontsLoaded && { fontFamily: SERIF.regular },
          ]}
          numberOfLines={1}
        >
          "The soul is eternal and beyond all birth and death." — Gita 2:20
        </Text>
        <Ionicons name="bookmark-outline" size={14} color={C.gold} />
      </View>
    </View>
  );
}
const hb = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  greeting: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  greetSub: {
    fontSize: 11.5,
    color: C.gold,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greetMain: { fontSize: 26, color: C.ink, lineHeight: 28 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.amberBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  streakFire: { fontSize: 20 },
  streakNum: { fontSize: 18, color: C.amber, lineHeight: 20 },
  streakLabel: { fontSize: 9.5, color: C.inkMuted },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 10,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink, padding: 0 },

  carouselWrap: {
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    marginBottom: 12,
    position: "relative",
  },
  carouselImg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  carouselGrad: { ...StyleSheet.absoluteFillObject },
  carouselTag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  carouselTagTxt: { fontSize: 9.5, letterSpacing: 1.5 },
  carouselContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  carouselTitle: {
    fontSize: 20,
    color: C.ink,
    lineHeight: 24,
    marginBottom: 4,
  },
  carouselSub: { fontSize: 12, color: C.inkMuted, marginBottom: 8 },
  carouselMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  carouselMetaTxt: { fontSize: 11.5, color: C.inkMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.inkMuted,
  },
  carouselFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lessonChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  lessonChipTxt: { fontSize: 11.5, color: C.inkMid },
  enrollBtn: {
    backgroundColor: C.goldMid,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  enrollTxt: { fontSize: 13, color: C.bgDeep },
  dots: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: { height: 6, borderRadius: 3 },

  wisdomChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  wisdomChipIcon: { fontSize: 14, color: C.gold },
  wisdomChipTxt: { flex: 1, fontSize: 12.5, color: C.inkMid },
});

// ─── 2. CATEGORY CARD ─────────────────────────────────────────────────────────
function CategoryCard({ cat, onPress, fontsLoaded }) {
  return (
    <TouchableOpacity
      onPress={() => onPress(cat)}
      activeOpacity={0.8}
      style={[cc.card, { backgroundColor: cat.bg, borderColor: cat.border }]}
    >
      <Text style={cc.icon}>{cat.icon}</Text>
      <Text
        style={[
          cc.label,
          { color: cat.color },
          fontsLoaded && { fontFamily: SERIF.semiBold },
        ]}
        numberOfLines={2}
      >
        {cat.label}
      </Text>
    </TouchableOpacity>
  );
}
const cc = StyleSheet.create({
  card: {
    width: 90,
    borderRadius: 16,
    padding: 12,
    borderWidth: 0.5,
    alignItems: "center",
    gap: 8,
    marginRight: 10,
  },
  icon: { fontSize: 26 },
  label: { fontSize: 11.5, textAlign: "center", lineHeight: 15 },
});

function LearningCategories({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="grid-outline"
        iconColor={C.moon}
        iconBg={C.moonPale}
        title="Categories"
        actionLabel="View all"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            onPress={() => {}}
            fontsLoaded={fontsLoaded}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── 3. CONTINUE LEARNING ─────────────────────────────────────────────────────
function ProgressCard({ course, fontsLoaded }) {
  return (
    <View style={pc.card}>
      <Image source={{ uri: course.image }} style={pc.img} resizeMode="cover" />
      <LinearGradient
        colors={["transparent", C.bgCard + "F5"]}
        style={pc.imgGrad}
      />
      <View style={[pc.colorBar, { backgroundColor: course.color }]} />

      <View style={pc.body}>
        <Text
          style={[pc.title, fontsLoaded && { fontFamily: SERIF.bold }]}
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <Text
          style={[pc.instructor, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {course.instructor}
        </Text>
        <Text
          style={[pc.lastLesson, fontsLoaded && { fontFamily: SERIF.regular }]}
          numberOfLines={1}
        >
          {course.lastLesson}
        </Text>

        <View style={pc.progressRow}>
          <ProgressBar
            progress={course.progress}
            color={course.color}
            height={5}
          />
          <View style={pc.progressMeta}>
            <Text
              style={[
                pc.progressPct,
                { color: course.color },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {course.progress}%
            </Text>
            <Text
              style={[
                pc.progressSub,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {Math.round((course.totalLessons * course.progress) / 100)}/
              {course.totalLessons} lessons
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            pc.continueBtn,
            {
              backgroundColor: course.color + "22",
              borderColor: course.color + "55",
            },
          ]}
          activeOpacity={0.82}
        >
          <Ionicons name="play-circle" size={15} color={course.color} />
          <Text
            style={[
              pc.continueTxt,
              { color: course.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const pc = StyleSheet.create({
  card: {
    width: 230,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    marginRight: 12,
    position: "relative",
  },
  img: { width: "100%", height: 110 },
  imgGrad: { position: "absolute", top: 70, left: 0, right: 0, height: 50 },
  colorBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  body: { padding: 12, gap: 5 },
  title: { fontSize: 14.5, color: C.ink, lineHeight: 19 },
  instructor: { fontSize: 11, color: C.inkMuted },
  lastLesson: { fontSize: 11, color: C.inkMid, marginBottom: 4 },
  progressRow: { gap: 6 },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressPct: { fontSize: 13 },
  progressSub: { fontSize: 10.5, color: C.inkMuted },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  continueTxt: { fontSize: 13 },
});

function ContinueLearning({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="play-circle-outline"
        iconColor={C.teal}
        iconBg={C.tealPale}
        title="Continue Learning"
        actionLabel="My courses"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}
      >
        {IN_PROGRESS.map((course) => (
          <ProgressCard
            key={course.id}
            course={course}
            fontsLoaded={fontsLoaded}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── 4. COURSE CARD ───────────────────────────────────────────────────────────
function CourseCard({ course, fontsLoaded }) {
  return (
    <TouchableOpacity style={crc.card} activeOpacity={0.84}>
      <View style={crc.imgWrap}>
        <Image
          source={{ uri: course.image }}
          style={crc.img}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", C.bgCard + "EE"]}
          style={crc.imgGrad}
        />
        <View
          style={[
            crc.levelPill,
            {
              backgroundColor: course.levelColor + "25",
              borderColor: course.levelColor + "55",
            },
          ]}
        >
          <Text
            style={[
              crc.levelTxt,
              { color: course.levelColor },
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            {course.level}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={[course.color + "12", "transparent"]}
        style={crc.body}
      >
        <View style={[crc.accentBar, { backgroundColor: course.color }]} />
        <Text
          style={[crc.title, fontsLoaded && { fontFamily: SERIF.bold }]}
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <View style={crc.instructorRow}>
          <Ionicons name="person-circle-outline" size={12} color={C.inkMuted} />
          <Text
            style={[
              crc.instructor,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {course.instructor}
          </Text>
        </View>
        <View style={crc.metaRow}>
          <View style={crc.metaItem}>
            <Ionicons name="time-outline" size={11} color={C.inkMuted} />
            <Text
              style={[
                crc.metaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {course.duration}
            </Text>
          </View>
          <View style={crc.metaDivider} />
          <View style={crc.metaItem}>
            <Ionicons name="play-outline" size={11} color={C.inkMuted} />
            <Text
              style={[
                crc.metaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {course.lessons} lessons
            </Text>
          </View>
          <View style={crc.metaDivider} />
          <View style={crc.metaItem}>
            <Ionicons name="people-outline" size={11} color={C.inkMuted} />
            <Text
              style={[
                crc.metaTxt,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {course.enrolled}
            </Text>
          </View>
        </View>
        <View style={crc.footer}>
          <View style={crc.ratingRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name={s <= Math.floor(course.rating) ? "star" : "star-outline"}
                size={11}
                color={C.goldMid}
              />
            ))}
            <Text
              style={[
                crc.ratingTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {course.rating}
            </Text>
          </View>
          <Text
            style={[
              crc.price,
              { color: course.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {course.price}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const crc = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    marginRight: 12,
    position: "relative",
  },
  imgWrap: { height: 130, position: "relative" },
  img: { width: "100%", height: "100%" },
  imgGrad: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60 },
  levelPill: {
    position: "absolute",
    top: 9,
    right: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 0.5,
  },
  levelTxt: { fontSize: 9.5 },
  body: { padding: 12, gap: 5, position: "relative", overflow: "hidden" },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  title: { fontSize: 14.5, color: C.ink, lineHeight: 19 },
  instructorRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  instructor: { fontSize: 11, color: C.inkMuted },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaTxt: { fontSize: 10.5, color: C.inkMuted },
  metaDivider: { width: 1, height: 10, backgroundColor: C.border },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingTxt: { fontSize: 11.5, color: C.goldMid, marginLeft: 3 },
  price: { fontSize: 15 },
});

function PopularCourses({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="flame-outline"
        iconColor={C.amber}
        iconBg={C.amberPale}
        title="Popular Courses"
        actionLabel="Browse all"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}
      >
        {POPULAR_COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            fontsLoaded={fontsLoaded}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── 5. GURU CARD ─────────────────────────────────────────────────────────────
function GuruCard({ guru, fontsLoaded }) {
  const [following, setFollowing] = useState(guru.following);
  return (
    <View style={gc.card}>
      <LinearGradient
        colors={[guru.color + "20", "transparent"]}
        style={StyleSheet.absoluteFill}
        borderRadius={18}
      />
      <View style={[gc.colorBar, { backgroundColor: guru.color }]} />
      <View style={gc.top}>
        <View style={[gc.avatarWrap, { borderColor: guru.color + "60" }]}>
          <Image source={{ uri: guru.image }} style={gc.avatar} />
        </View>
        <TouchableOpacity
          style={[
            gc.followBtn,
            following
              ? {
                  backgroundColor: guru.color + "25",
                  borderColor: guru.color + "55",
                }
              : { backgroundColor: guru.color, borderColor: guru.color },
          ]}
          onPress={() => setFollowing((f) => !f)}
          activeOpacity={0.82}
        >
          <Text
            style={[
              gc.followTxt,
              { color: following ? guru.color : C.bgDeep },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[gc.name, fontsLoaded && { fontFamily: SERIF.bold }]}
        numberOfLines={1}
      >
        {guru.name}
      </Text>
      <Text
        style={[gc.expertise, fontsLoaded && { fontFamily: SERIF.regular }]}
        numberOfLines={2}
      >
        {guru.expertise}
      </Text>
      <View style={gc.statsRow}>
        <View style={gc.stat}>
          <Text
            style={[
              gc.statNum,
              { color: guru.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {guru.years}y
          </Text>
          <Text
            style={[gc.statLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Exp.
          </Text>
        </View>
        <View style={gc.statDivider} />
        <View style={gc.stat}>
          <Text
            style={[
              gc.statNum,
              { color: guru.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {guru.students}
          </Text>
          <Text
            style={[gc.statLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Students
          </Text>
        </View>
        <View style={gc.statDivider} />
        <View style={gc.stat}>
          <Text
            style={[
              gc.statNum,
              { color: guru.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {guru.courses}
          </Text>
          <Text
            style={[gc.statLabel, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            Courses
          </Text>
        </View>
      </View>
    </View>
  );
}
const gc = StyleSheet.create({
  card: {
    width: 175,
    borderRadius: 18,
    padding: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
    gap: 6,
  },
  colorBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  followTxt: { fontSize: 12 },
  name: { fontSize: 14.5, color: C.ink },
  expertise: { fontSize: 11, color: C.inkMuted, lineHeight: 15 },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bgSurface,
    borderRadius: 10,
    padding: 8,
    gap: 0,
    marginTop: 4,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 14 },
  statLabel: { fontSize: 9.5, color: C.inkMuted },
  statDivider: { width: 1, height: 24, backgroundColor: C.border },
});

function FeaturedGurus({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="people-outline"
        iconColor={C.pink}
        iconBg={C.pinkPale}
        title="Featured Gurus"
        actionLabel="See all"
        fontsLoaded={fontsLoaded}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 4 }}
      >
        {GURUS.map((guru) => (
          <GuruCard key={guru.id} guru={guru} fontsLoaded={fontsLoaded} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── 6. LEARNING JOURNEY ─────────────────────────────────────────────────────
function JourneyLevel({ lvl, idx, isLast, fontsLoaded }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (lvl.unlocked && lvl.completed > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.12,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, []);

  return (
    <View style={jl.row}>
      {/* Connector line */}
      {!isLast && (
        <View style={jl.lineWrap}>
          <View
            style={[
              jl.line,
              {
                backgroundColor: lvl.unlocked ? lvl.color + "60" : C.bgSurface,
              },
            ]}
          />
        </View>
      )}

      {/* Node */}
      <Animated.View
        style={[jl.nodeWrap, lvl.unlocked && { transform: [{ scale: pulse }] }]}
      >
        <View
          style={[
            jl.node,
            {
              backgroundColor: lvl.unlocked ? lvl.color + "25" : C.bgSurface,
              borderColor: lvl.unlocked ? lvl.color : C.border,
            },
          ]}
        >
          <Text style={jl.nodeIcon}>{lvl.unlocked ? lvl.icon : "🔒"}</Text>
        </View>
      </Animated.View>

      {/* Content */}
      <View
        style={[
          jl.content,
          { borderColor: lvl.unlocked ? lvl.color + "35" : C.border },
          !lvl.unlocked && { opacity: 0.45 },
        ]}
      >
        <LinearGradient
          colors={
            lvl.unlocked
              ? [lvl.color + "14", "transparent"]
              : ["transparent", "transparent"]
          }
          style={StyleSheet.absoluteFill}
          borderRadius={14}
        />
        <View style={jl.contentTop}>
          <View>
            <Text
              style={[
                jl.levelLabel,
                { color: lvl.unlocked ? lvl.color : C.inkMuted },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {lvl.level}
            </Text>
            <Text
              style={[jl.levelTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {lvl.title}
            </Text>
          </View>
          {lvl.unlocked && (
            <View style={[jl.progressCircle, { borderColor: lvl.color }]}>
              <Text
                style={[
                  jl.progressCircleTxt,
                  { color: lvl.color },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {lvl.completed}/{lvl.courses}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[jl.levelSub, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {lvl.subtitle}
        </Text>
        {lvl.unlocked && lvl.completed > 0 && (
          <ProgressBar
            progress={(lvl.completed / lvl.courses) * 100}
            color={lvl.color}
            height={4}
          />
        )}
        {lvl.unlocked && (
          <TouchableOpacity
            style={[
              jl.btn,
              {
                backgroundColor: lvl.color + "20",
                borderColor: lvl.color + "50",
              },
            ]}
            activeOpacity={0.8}
          >
            <Text
              style={[
                jl.btnTxt,
                { color: lvl.color },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {lvl.completed > 0 ? "Continue Path" : "Begin Journey"}
            </Text>
            <Ionicons name="arrow-forward" size={13} color={lvl.color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const jl = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 18,
    marginBottom: 8,
    alignItems: "flex-start",
    gap: 12,
  },
  lineWrap: {
    position: "absolute",
    left: 35,
    top: 52,
    bottom: -16,
    width: 2,
    zIndex: 0,
  },
  line: { flex: 1 },
  nodeWrap: { width: 40, alignItems: "center", zIndex: 1, paddingTop: 4 },
  node: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeIcon: { fontSize: 18 },
  content: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    overflow: "hidden",
    gap: 8,
  },
  contentTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  levelLabel: { fontSize: 10.5, letterSpacing: 1.2, marginBottom: 2 },
  levelTitle: { fontSize: 18, color: C.ink },
  progressCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bgSurface,
  },
  progressCircleTxt: { fontSize: 10.5 },
  levelSub: { fontSize: 12, color: C.inkMuted, lineHeight: 17 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  btnTxt: { fontSize: 12.5 },
});

function LearningJourney({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="map-outline"
        iconColor={C.gold}
        iconBg={C.goldPale}
        title="Your Journey"
        fontsLoaded={fontsLoaded}
      />
      {JOURNEY_LEVELS.map((lvl, idx) => (
        <JourneyLevel
          key={lvl.id}
          lvl={lvl}
          idx={idx}
          isLast={idx === JOURNEY_LEVELS.length - 1}
          fontsLoaded={fontsLoaded}
        />
      ))}
    </View>
  );
}

// ─── 7. DAILY WISDOM ─────────────────────────────────────────────────────────
function WisdomCard({ wisdom, fontsLoaded }) {
  const [saved, setSaved] = useState(false);
  return (
    <View style={wc.card}>
      <LinearGradient
        colors={[wisdom.color + "20", C.bgCard]}
        style={StyleSheet.absoluteFill}
        borderRadius={20}
      />
      <View style={[wc.accentBar, { backgroundColor: wisdom.color }]} />

      <View style={wc.topRow}>
        <View
          style={[
            wc.iconWrap,
            {
              backgroundColor: wisdom.color + "25",
              borderColor: wisdom.color + "50",
            },
          ]}
        >
          <Text style={wc.iconTxt}>{wisdom.icon}</Text>
        </View>
        <View style={wc.sourceWrap}>
          <Text
            style={[
              wc.source,
              { color: wisdom.color },
              fontsLoaded && { fontFamily: SERIF.bold },
            ]}
          >
            {wisdom.source}
          </Text>
          <Text
            style={[wc.chapter, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {wisdom.chapter}
          </Text>
        </View>
        <View style={wc.actions}>
          <TouchableOpacity
            onPress={() => setSaved((s) => !s)}
            style={wc.actionBtn}
            activeOpacity={0.8}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={saved ? wisdom.color : C.inkMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={wc.actionBtn} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={18} color={C.inkMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[wc.quoteWrap, { borderLeftColor: wisdom.color + "60" }]}>
        <Text style={[wc.quote, fontsLoaded && { fontFamily: SERIF.regular }]}>
          "{wisdom.quote}"
        </Text>
      </View>
    </View>
  );
}
const wc = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 18,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    position: "relative",
    gap: 14,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconTxt: { fontSize: 22 },
  sourceWrap: { flex: 1 },
  source: { fontSize: 16 },
  chapter: { fontSize: 11.5, color: C.inkMuted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { padding: 4 },
  quoteWrap: { borderLeftWidth: 2, paddingLeft: 14 },
  quote: { fontSize: 15, color: C.inkMid, lineHeight: 24, fontStyle: "italic" },
});

function DailySpiritualWisdom({ fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        icon="sparkles-outline"
        iconColor={C.gold}
        iconBg={C.goldPale}
        title="Daily Wisdom"
        fontsLoaded={fontsLoaded}
      />
      {DAILY_WISDOMS.map((w) => (
        <View key={w.source + w.chapter} style={{ marginBottom: 12 }}>
          <WisdomCard wisdom={w} fontsLoaded={fontsLoaded} />
        </View>
      ))}
    </View>
  );
}

// ─── 8. ACHIEVEMENTS ─────────────────────────────────────────────────────────
function AchievementBadge({ ach, fontsLoaded }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 30,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={1}
        style={[
          ab.card,
          {
            borderColor: ach.earned ? ach.color + "55" : C.border,
            opacity: ach.earned ? 1 : 0.42,
          },
        ]}
      >
        <LinearGradient
          colors={
            ach.earned
              ? [ach.color + "20", "transparent"]
              : ["transparent", "transparent"]
          }
          style={StyleSheet.absoluteFill}
          borderRadius={16}
        />
        <View
          style={[
            ab.iconWrap,
            {
              backgroundColor: ach.earned ? ach.color + "25" : C.bgSurface,
              borderColor: ach.earned ? ach.color + "50" : C.border,
            },
          ]}
        >
          <Text style={ab.icon}>{ach.earned ? ach.icon : "🔒"}</Text>
        </View>
        <Text
          style={[
            ab.title,
            ach.earned && { color: ach.color },
            fontsLoaded && { fontFamily: SERIF.bold },
          ]}
          numberOfLines={1}
        >
          {ach.title}
        </Text>
        <Text
          style={[ab.desc, fontsLoaded && { fontFamily: SERIF.regular }]}
          numberOfLines={2}
        >
          {ach.desc}
        </Text>
        {ach.earned && (
          <View style={[ab.earnedDot, { backgroundColor: ach.color }]}>
            <Ionicons name="checkmark" size={9} color={C.bg} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
const ab = StyleSheet.create({
  card: {
    width: 110,
    borderRadius: 16,
    padding: 12,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    alignItems: "center",
    gap: 7,
    marginRight: 10,
    position: "relative",
    overflow: "hidden",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 24 },
  title: { fontSize: 12.5, color: C.inkMid, textAlign: "center" },
  desc: {
    fontSize: 10,
    color: C.inkMuted,
    textAlign: "center",
    lineHeight: 13,
  },
  earnedDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

function CertificatesAchievements({ fontsLoaded }) {
  const earned = ACHIEVEMENTS.filter((a) => a.earned).length;
  return (
    <View>
      <SectionHeader
        icon="trophy-outline"
        iconColor={C.goldMid}
        iconBg={C.goldPale}
        title="Achievements"
        fontsLoaded={fontsLoaded}
      />

      {/* Stats bar */}
      <View style={ca.statsBar}>
        {[
          {
            num: `${earned}`,
            label: "Badges Earned",
            icon: "medal-outline",
            color: C.gold,
          },
          {
            num: "2",
            label: "Certificates",
            icon: "ribbon-outline",
            color: C.teal,
          },
          {
            num: "3",
            label: "Courses Done",
            icon: "checkmark-circle-outline",
            color: C.green,
          },
        ].map((s, i) => (
          <View
            key={i}
            style={[
              ca.statItem,
              i < 2 && { borderRightWidth: 0.5, borderRightColor: C.border },
            ]}
          >
            <View
              style={[ca.statIconWrap, { backgroundColor: s.color + "18" }]}
            >
              <Ionicons name={s.icon} size={16} color={s.color} />
            </View>
            <Text
              style={[
                ca.statNum,
                { color: s.color },
                fontsLoaded && { fontFamily: SERIF.bold },
              ]}
            >
              {s.num}
            </Text>
            <Text
              style={[
                ca.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Badges scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 4,
        }}
      >
        {ACHIEVEMENTS.map((ach) => (
          <AchievementBadge key={ach.id} ach={ach} fontsLoaded={fontsLoaded} />
        ))}
      </ScrollView>

      {/* Certificate card */}
      <View style={ca.certCard}>
        <LinearGradient
          colors={[C.goldPale, C.moonPale]}
          style={StyleSheet.absoluteFill}
          borderRadius={16}
        />
        <View style={ca.certLeft}>
          <Text style={ca.certIcon}>🎓</Text>
          <View>
            <Text
              style={[ca.certTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Vedic Astrology — Level I
            </Text>
            <Text
              style={[ca.certSub, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              Certificate of Completion
            </Text>
            <View style={ca.certBadge}>
              <Ionicons name="ribbon" size={11} color={C.goldMid} />
              <Text
                style={[
                  ca.certBadgeTxt,
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Verified
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={ca.downloadBtn} activeOpacity={0.82}>
          <Ionicons name="download-outline" size={15} color={C.gold} />
          <Text
            style={[ca.downloadTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Download
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const ca = StyleSheet.create({
  statsBar: {
    flexDirection: "row",
    marginHorizontal: 18,
    borderRadius: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  statNum: { fontSize: 18 },
  statLabel: { fontSize: 10, color: C.inkMuted, textAlign: "center" },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  certLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  certIcon: { fontSize: 36 },
  certTitle: { fontSize: 14.5, color: C.ink, marginBottom: 2 },
  certSub: { fontSize: 11, color: C.inkMuted, marginBottom: 6 },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  certBadgeTxt: { fontSize: 10, color: C.goldMid },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  downloadTxt: { fontSize: 12.5, color: C.gold },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function SpiritualLearning({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* 1. Hero */}
        <HeroBanner fontsLoaded={fontsLoaded} />

        {/* 2. Categories */}
        <LearningCategories fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 3. Continue Learning */}
        <ContinueLearning fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 4. Popular Courses */}
        <PopularCourses fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 5. Featured Gurus */}
        <FeaturedGurus fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 6. Learning Journey */}
        <LearningJourney fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 7. Daily Wisdom */}
        <DailySpiritualWisdom fontsLoaded={fontsLoaded} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* 8. Certificates & Achievements */}
        <CertificatesAchievements fontsLoaded={fontsLoaded} />

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: C.divider,
    marginHorizontal: 18,
    marginTop: 8,
  },
});
