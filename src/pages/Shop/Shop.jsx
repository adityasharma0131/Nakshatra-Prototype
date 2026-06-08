/**
 * Nakshatra — Shopping Home Screen
 * React Native Expo — Final Version
 *
 * Changes from original:
 *  - Removed TopNav (full header). Replaced with slim LogoBar (logo + bell only).
 *  - Cart moved to floating gold FAB (bottom-right, above content).
 *  - Removed BottomNav entirely.
 *  - Removed ProductModal. Tapping any product calls navigation.navigate("ProductPage", { product }).
 *
 * Install deps:
 *   npx expo install expo-linear-gradient
 *   npx expo install @expo-google-fonts/cormorant-garamond expo-font
 *   npx expo install react-native-safe-area-context
 *   @expo/vector-icons — bundled in Expo SDK
 */

import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  TextInput,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  bgSurface: "#1C1A3A",
  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.10)",
  goldBorder: "rgba(212,160,23,0.28)",
  moon: "#7B7FE8",
  moonLight: "#A5A8F8",
  moonPale: "rgba(123,127,232,0.12)",
  moonBorder: "rgba(123,127,232,0.28)",
  ink: "#F2EED8",
  inkMid: "#B8B0D8",
  inkMuted: "#6E6898",
  green: "#34D077",
  greenPale: "rgba(52,208,119,0.12)",
  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  shadow: "rgba(0,0,0,0.60)",
  shadowGold: "rgba(212,160,23,0.22)",
  shadowMoon: "rgba(123,127,232,0.28)",
};

const SERIF_BOLD = "CormorantGaramond_700Bold";
const SERIF_SEMI = "CormorantGaramond_600SemiBold";
const SERIF_REG = "CormorantGaramond_400Regular";

// ─── Data ─────────────────────────────────────────────────────────────────────
const AI_RECS = [
  {
    id: "1",
    name: "Blue Sapphire",
    sub: "Neelam Ratna",
    price: "₹8,999",
    original: "₹12,999",
    discount: "31% OFF",
    match: 96,
    reason: "Saturn rules your Lagna",
    rating: "4.9",
    reviews: "2.4k",
    planet: "♄ Saturn",
    emoji: "💎",
    grad: ["#0A1A3A", "#1A2F6A"],
    accent: "#4A8FE8",
    tags: ["Certified", "Energized", "Lab Tested"],
  },
  {
    id: "2",
    name: "Yellow Sapphire",
    sub: "Pukhraj Ratna",
    price: "₹6,499",
    original: "₹9,200",
    discount: "29% OFF",
    match: 91,
    reason: "Jupiter strong in D9",
    rating: "4.8",
    reviews: "1.8k",
    planet: "♃ Jupiter",
    emoji: "✨",
    grad: ["#2A1A00", "#5A3800"],
    accent: "#E8B430",
    tags: ["Certified", "Lab Tested"],
  },
  {
    id: "3",
    name: "Pearl",
    sub: "Moti Ratna",
    price: "₹2,499",
    original: "₹3,800",
    discount: "34% OFF",
    match: 88,
    reason: "Moon in Rohini Nakshatra",
    rating: "4.7",
    reviews: "3.1k",
    planet: "☽ Moon",
    emoji: "🌕",
    grad: ["#0A1A2A", "#1A2E40"],
    accent: "#A5C8E8",
    tags: ["Certified", "Energized"],
  },
  {
    id: "4",
    name: "Red Coral",
    sub: "Moonga Ratna",
    price: "₹3,299",
    original: "₹4,999",
    discount: "34% OFF",
    match: 85,
    reason: "Mars in 10th house",
    rating: "4.6",
    reviews: "1.2k",
    planet: "♂ Mars",
    emoji: "🔴",
    grad: ["#2A0A0A", "#5A1A1A"],
    accent: "#E85A4A",
    tags: ["Certified"],
  },
];

const GEMSTONES = [
  {
    id: "g1",
    name: "Blue Sapphire",
    sub: "Neelam",
    price: "₹8,999",
    rating: "4.9",
    emoji: "💎",
    accent: "#4A8FE8",
    grad: ["#0A1A3A", "#1A2F6A"],
  },
  {
    id: "g2",
    name: "Emerald",
    sub: "Panna",
    price: "₹5,499",
    rating: "4.8",
    emoji: "💚",
    accent: "#34D077",
    grad: ["#0A2A0A", "#1A4A1A"],
  },
  {
    id: "g3",
    name: "Ruby",
    sub: "Manik",
    price: "₹7,299",
    rating: "4.9",
    emoji: "❤️",
    accent: "#E85A4A",
    grad: ["#2A0A0A", "#5A1A1A"],
  },
  {
    id: "g4",
    name: "Yellow Sapphire",
    sub: "Pukhraj",
    price: "₹6,499",
    rating: "4.7",
    emoji: "✨",
    accent: "#E8B430",
    grad: ["#2A1A00", "#5A3800"],
  },
  {
    id: "g5",
    name: "Pearl",
    sub: "Moti",
    price: "₹2,499",
    rating: "4.7",
    emoji: "🌕",
    accent: "#A5C8E8",
    grad: ["#0A1A2A", "#1A2E40"],
  },
];

const RUDRAKSHA = [
  {
    id: "r1",
    name: "1 Mukhi",
    sub: "Shiva Roopam",
    price: "₹15,999",
    rating: "5.0",
    emoji: "🔮",
    accent: "#A5A8F8",
    grad: ["#0A0A2A", "#1A1A5A"],
  },
  {
    id: "r2",
    name: "5 Mukhi",
    sub: "Kalachakra",
    price: "₹899",
    rating: "4.9",
    emoji: "🙏",
    accent: "#D4A017",
    grad: ["#2A1A00", "#4A3000"],
  },
  {
    id: "r3",
    name: "7 Mukhi",
    sub: "Lakshmi Swaroop",
    price: "₹2,299",
    rating: "4.8",
    emoji: "🌟",
    accent: "#34D077",
    grad: ["#0A2A0A", "#1A4A1A"],
  },
  {
    id: "r4",
    name: "11 Mukhi",
    sub: "Hanuman Roopam",
    price: "₹4,999",
    rating: "4.9",
    emoji: "⭕",
    accent: "#E85A4A",
    grad: ["#2A0A0A", "#5A1A1A"],
  },
];

const YANTRAS = [
  {
    id: "y1",
    name: "Shree Yantra",
    sub: "Prosperity & Wealth",
    price: "₹1,299",
    rating: "4.9",
    emoji: "🔯",
    accent: "#D4A017",
    grad: ["#2A1A00", "#5A3800"],
  },
  {
    id: "y2",
    name: "Kuber Yantra",
    sub: "Financial Abundance",
    price: "₹999",
    rating: "4.8",
    emoji: "💰",
    accent: "#E8B430",
    grad: ["#2A1A00", "#4A3000"],
  },
  {
    id: "y3",
    name: "Maha Mrityunjaya",
    sub: "Health & Protection",
    price: "₹1,499",
    rating: "4.9",
    emoji: "🕉️",
    accent: "#A5A8F8",
    grad: ["#0A0A2A", "#1A1A5A"],
  },
];

const BANNERS = [
  {
    tag: "✦ Kundli Personalized",
    title: "Gemstones Tailored\nTo Your Kundli",
    sub: "AI-matched for your planetary chart",
    cta: "Discover Now",
    grad: ["#1A0A3A", "#2A1060", "#3A20A0"],
    accent: "#A5A8F8",
  },
  {
    tag: "🤖 AI Powered",
    title: "AI Recommended\nSpiritual Products",
    sub: "96% compatibility with your Moon Sign",
    cta: "View Picks",
    grad: ["#0A1A0A", "#1A3A1A", "#2A5A1A"],
    accent: "#34D077",
  },
  {
    tag: "🙏 Exclusive",
    title: "Rudraksha\nCollection",
    sub: "Authenticated from Nepal & Java",
    cta: "Explore",
    grad: ["#2A1400", "#5A3000", "#8A5000"],
    accent: "#E8B430",
  },
  {
    tag: "⚡ Limited Time",
    title: "Astrology\nEssentials Sale",
    sub: "Up to 40% off on all spiritual products",
    cta: "Shop Sale",
    grad: ["#2A0A0A", "#5A1A1A", "#8A2020"],
    accent: "#E85A4A",
  },
];

const FILTERS = [
  "All",
  "Gemstones",
  "Rudraksha",
  "Yantras",
  "Books",
  "Planet",
  "Zodiac",
  "Trending",
];

const ASTRO_ENDORSED = [
  {
    name: "Pandit Ramesh",
    item: "Blue Sapphire Ring",
    emoji: "💎",
    reason: "Best for Saturn Mahadasha",
    initials: "PR",
  },
  {
    name: "Jyoti Devi",
    item: "5 Mukhi Rudraksha",
    emoji: "🔮",
    reason: "Universal protection",
    initials: "JD",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function PressScale({ children, style, onPress, scale = 0.96 }) {
  const anim = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(anim, {
      toValue: scale,
      useNativeDriver: true,
      speed: 50,
    }).start();
  const pressOut = () =>
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  return (
    <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={{ flex: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

function SectionHeader({ title, sub, onAll, fontsLoaded }) {
  return (
    <View style={s.secHeader}>
      <View>
        <Text style={[s.secTitle, fontsLoaded && { fontFamily: SERIF_BOLD }]}>
          {title}
        </Text>
        {sub && (
          <Text style={[s.secSub, fontsLoaded && { fontFamily: SERIF_REG }]}>
            {sub}
          </Text>
        )}
      </View>
      {onAll && (
        <TouchableOpacity
          onPress={onAll}
          style={s.seeAllBtn}
          activeOpacity={0.8}
        >
          <Text
            style={[s.seeAllTxt, fontsLoaded && { fontFamily: SERIF_SEMI }]}
          >
            See all
          </Text>
          <Ionicons name="arrow-forward" size={11} color={C.moonLight} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Floating Cart FAB ────────────────────────────────────────────────────────
// Replaces the cart button that was inside TopNav.
function CartFAB({ cartCount, onPress, fontsLoaded }) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(1)).current;
  const bounce = () => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.2, useNativeDriver: true, speed: 50 }),
      Animated.spring(anim, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress?.();
  };
  return (
    <Animated.View
      style={[
        s.fabWrap,
        { bottom: insets.bottom + 24, transform: [{ scale: anim }] },
      ]}
    >
      <TouchableOpacity onPress={bounce} activeOpacity={0.88}>
        <LinearGradient colors={[C.goldLight, C.goldMid, C.gold]} style={s.fab}>
          <Ionicons name="cart-outline" size={20} color="#0D0B1A" />
          <View style={s.fabBadge}>
            <Text
              style={[s.fabBadgeTxt, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {cartCount}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ fontsLoaded }) {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const onFocus = () => {
    setFocused(true);
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 20,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.spring(anim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 20,
    }).start();
  };
  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.moonBorder],
  });
  return (
    <View style={s.searchWrap}>
      <Animated.View style={[s.searchBar, { borderColor }]}>
        <Ionicons name="search-outline" size={16} color={C.inkMuted} />
        <TextInput
          style={[s.searchInput, fontsLoaded && { fontFamily: SERIF_REG }]}
          placeholder="Search gemstones, rudraksha, yantras…"
          placeholderTextColor={C.inkMuted}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity style={s.searchIcon} activeOpacity={0.7}>
          <Ionicons name="mic-outline" size={16} color={C.moon} />
        </TouchableOpacity>
        <TouchableOpacity style={s.searchIcon} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="robot-outline"
            size={16}
            color={C.moon}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Filter Chips ─────────────────────────────────────────────────────────────
function FilterChips({ fontsLoaded }) {
  const [active, setActive] = useState("All");
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.filterScroll}
    >
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f}
          onPress={() => setActive(f)}
          activeOpacity={0.8}
          style={[s.filterChip, active === f && s.filterChipActive]}
        >
          {active === f && (
            <LinearGradient
              colors={[C.goldMid + "22", C.gold + "11"]}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
          )}
          <Text
            style={[
              s.filterChipTxt,
              fontsLoaded && {
                fontFamily: active === f ? SERIF_SEMI : SERIF_REG,
              },
              active === f && { color: C.goldMid },
            ]}
          >
            {f}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Banner Carousel ──────────────────────────────────────────────────────────
function BannerCarousel({ fontsLoaded }) {
  const [active, setActive] = useState(0);
  const CARD_W = width - 32;
  return (
    <View style={{ marginTop: 16 }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onMomentumScrollEnd={(e) =>
          setActive(Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 12)))
        }
      >
        {BANNERS.map((b, i) => (
          <TouchableOpacity key={i} activeOpacity={0.92}>
            <LinearGradient
              colors={b.grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[s.bannerCard, { width: CARD_W }]}
            >
              <View
                style={[
                  s.orb,
                  {
                    width: 160,
                    height: 160,
                    top: -60,
                    right: -50,
                    opacity: 0.1,
                  },
                ]}
              />
              <View
                style={[
                  s.orb,
                  { width: 70, height: 70, top: 20, right: 60, opacity: 0.06 },
                ]}
              />
              <LinearGradient
                colors={["transparent", "rgba(212,160,23,0.35)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.bannerShimmer}
              />
              <View style={s.bannerInner}>
                <View style={s.bannerTagWrap}>
                  <Text
                    style={[
                      s.bannerTag,
                      fontsLoaded && { fontFamily: SERIF_SEMI },
                      { color: b.accent },
                    ]}
                  >
                    {b.tag}
                  </Text>
                </View>
                <Text
                  style={[
                    s.bannerTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {b.title}
                </Text>
                <Text
                  style={[
                    s.bannerSub,
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  {b.sub}
                </Text>
                <TouchableOpacity
                  style={[
                    s.bannerCta,
                    {
                      borderColor: b.accent + "88",
                      backgroundColor: b.accent + "22",
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      s.bannerCtaTxt,
                      fontsLoaded && { fontFamily: SERIF_SEMI },
                      { color: b.accent },
                    ]}
                  >
                    {b.cta}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={12}
                    color={b.accent}
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.dotsRow}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[s.dot, active === i && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─── AI Badge (animated glow) ─────────────────────────────────────────────────
function AIBadge({ fontsLoaded }) {
  const glow = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);
  const shadow = glow.interpolate({ inputRange: [0, 1], outputRange: [4, 12] });
  return (
    <Animated.View
      style={[s.aiBadge, { shadowRadius: shadow, shadowOpacity: 0.8 }]}
    >
      <LinearGradient
        colors={[C.goldMid, C.goldLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={s.aiBadgeGrad}
      >
        <Text style={[s.aiBadgeTxt, fontsLoaded && { fontFamily: SERIF_BOLD }]}>
          ✨ AI
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ─── AI Rec Card ──────────────────────────────────────────────────────────────
function AIRecCard({ p, onTap, fontsLoaded }) {
  return (
    <PressScale style={s.aiRecCard} onPress={() => onTap(p)} scale={0.97}>
      <LinearGradient colors={p.grad} style={s.aiRecImg}>
        <Text style={{ fontSize: 52 }}>{p.emoji}</Text>
        <View style={[s.matchBadge, { borderColor: p.accent + "66" }]}>
          <Text
            style={[
              s.matchTxt,
              { color: p.accent },
              fontsLoaded && { fontFamily: SERIF_BOLD },
            ]}
          >
            {p.match}% ✓
          </Text>
        </View>
      </LinearGradient>
      <View style={s.aiRecBody}>
        <View style={s.aiRecRow}>
          <View>
            <Text
              style={[s.aiRecName, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {p.name}
            </Text>
            <Text
              style={[s.aiRecSub, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {p.sub}
            </Text>
          </View>
          <AIBadge fontsLoaded={fontsLoaded} />
        </View>
        <View
          style={[
            s.reasonPill,
            { backgroundColor: p.accent + "18", borderColor: p.accent + "44" },
          ]}
        >
          <Text
            style={[
              s.reasonTxt,
              { color: p.accent },
              fontsLoaded && { fontFamily: SERIF_REG },
            ]}
          >
            {p.reason}
          </Text>
        </View>
        <View style={s.ratingRow}>
          <Ionicons name="star" size={11} color={C.gold} />
          <Text
            style={[s.ratingTxt, fontsLoaded && { fontFamily: SERIF_SEMI }]}
          >
            {" "}
            {p.rating}
          </Text>
          <Text style={s.ratingCount}> ({p.reviews})</Text>
        </View>
        <View style={s.aiRecFooter}>
          <View>
            <Text
              style={[s.priceMain, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {p.price}
            </Text>
            <Text style={s.priceOrig}>{p.original}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              style={s.addCartBtn}
            >
              <Text
                style={[
                  s.addCartTxt,
                  fontsLoaded && { fontFamily: SERIF_BOLD },
                ]}
              >
                + Cart
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </PressScale>
  );
}

// ─── Small Product Card ───────────────────────────────────────────────────────
function ProductCard({ p, onTap, fontsLoaded }) {
  return (
    <PressScale style={s.prodCard} onPress={() => onTap(p)} scale={0.97}>
      <LinearGradient
        colors={p.grad || ["#13112A", "#1C1850"]}
        style={s.prodImg}
      >
        <Text style={{ fontSize: 40 }}>{p.emoji}</Text>
        <View
          style={[
            s.prodSubPill,
            {
              backgroundColor: (p.accent || C.moon) + "22",
              borderColor: (p.accent || C.moon) + "55",
            },
          ]}
        >
          <Text
            style={[
              s.prodSubTxt,
              { color: p.accent || C.moon },
              fontsLoaded && { fontFamily: SERIF_REG },
            ]}
          >
            {p.sub}
          </Text>
        </View>
      </LinearGradient>
      <View style={s.prodBody}>
        <Text
          style={[s.prodName, fontsLoaded && { fontFamily: SERIF_BOLD }]}
          numberOfLines={1}
        >
          {p.name}
        </Text>
        <View style={s.ratingRow}>
          <Ionicons name="star" size={10} color={C.gold} />
          <Text
            style={[s.ratingTxt, fontsLoaded && { fontFamily: SERIF_SEMI }]}
          >
            {" "}
            {p.rating}
          </Text>
        </View>
        <View style={s.prodFooter}>
          <Text
            style={[
              s.priceMain,
              { fontSize: 15 },
              fontsLoaded && { fontFamily: SERIF_BOLD },
            ]}
          >
            {p.price}
          </Text>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={[C.goldLight, C.gold]}
              style={s.smallAddBtn}
            >
              <Text
                style={[
                  s.smallAddTxt,
                  fontsLoaded && { fontFamily: SERIF_BOLD },
                ]}
              >
                +
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </PressScale>
  );
}

// ─── Section Row ──────────────────────────────────────────────────────────────
function SectionRow({ title, sub, items, onTap, fontsLoaded }) {
  return (
    <View>
      <SectionHeader
        title={title}
        sub={sub}
        onAll={() => {}}
        fontsLoaded={fontsLoaded}
      />
      <FlatList
        horizontal
        data={items}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={162}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
          paddingBottom: 4,
        }}
        renderItem={({ item }) => (
          <ProductCard p={item} onTap={onTap} fontsLoaded={fontsLoaded} />
        )}
      />
    </View>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────
function PromoBanner({ fontsLoaded }) {
  return (
    <View style={s.promoWrap}>
      <LinearGradient
        colors={["#100E2A", "#1E1A50", "#120E30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.promoBanner}
      >
        <View style={s.promoTopLine} />
        <View
          style={[
            s.orb,
            { width: 200, height: 200, top: -80, right: -60, opacity: 0.06 },
          ]}
        />
        <View style={{ flex: 1, zIndex: 1 }}>
          <View style={s.promoTagRow}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={10}
              color={C.goldMid}
            />
            <Text
              style={[s.promoTag, fontsLoaded && { fontFamily: SERIF_SEMI }]}
            >
              {" "}
              Limited Offer
            </Text>
          </View>
          <Text style={[s.promoH, fontsLoaded && { fontFamily: SERIF_BOLD }]}>
            First Kundli{"\n"}
            <Text style={{ color: C.goldLight }}>Free </Text>
            <Text style={{ color: "rgba(242,238,216,0.85)" }}>
              for new users
            </Text>
          </Text>
          <Text style={[s.promoSub, fontsLoaded && { fontFamily: SERIF_REG }]}>
            Unlock your complete birth chart powered by AI
          </Text>
          <TouchableOpacity style={s.promoCta} activeOpacity={0.88}>
            <LinearGradient
              colors={[C.goldLight, C.goldMid, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.promoCtaGrad}
            >
              <Text
                style={[
                  s.promoCtaTxt,
                  fontsLoaded && { fontFamily: SERIF_BOLD },
                ]}
              >
                Claim Now
              </Text>
              <Ionicons
                name="arrow-forward"
                size={13}
                color="#0D0B1A"
                style={{ marginLeft: 6 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={s.promoMoon}>☽</Text>
      </LinearGradient>
    </View>
  );
}

// ─── Quote ────────────────────────────────────────────────────────────────────
function Quote({ fontsLoaded }) {
  return (
    <View style={s.quoteWrap}>
      <View style={s.quoteLine} />
      <Text style={[s.quoteTxt, fontsLoaded && { fontFamily: SERIF_REG }]}>
        "The stars incline, they do not compel. Your karma is the compass of
        your destiny."
      </Text>
      <Text style={[s.quoteSrc, fontsLoaded && { fontFamily: SERIF_SEMI }]}>
        — Brihat Parashara Hora Shastra
      </Text>
      <View style={s.quoteLine} />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
// Expects `navigation` prop from React Navigation stack.
// All product taps → navigation.navigate("ProductPage", { product })
export default function ShopScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });
  const [cartCount, setCartCount] = useState(3);

  const handleTap = useCallback(
    (product) => {
      if (navigation) {
        navigation.navigate("ProductPage", { product });
      } else {
        // Dev fallback when running outside a navigator
        console.log("→ ProductPage", product.name);
      }
    },
    [navigation],
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View height={40} />

        <BannerCarousel fontsLoaded={fontsLoaded} />
        <SearchBar fontsLoaded={fontsLoaded} />
        <FilterChips fontsLoaded={fontsLoaded} />

        {/* AI Recommendations */}
        <SectionHeader
          title={"Recommended For\nYour Kundli"}
          sub="Moon: Rohini · Lagna: Capricorn"
          onAll={() => {}}
          fontsLoaded={fontsLoaded}
        />
        <FlatList
          horizontal
          data={AI_RECS}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={214}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
            paddingBottom: 4,
          }}
          renderItem={({ item }) => (
            <AIRecCard p={item} onTap={handleTap} fontsLoaded={fontsLoaded} />
          )}
        />

        <PromoBanner fontsLoaded={fontsLoaded} />

        <SectionRow
          title="Gemstones"
          sub="Certified & energized"
          items={GEMSTONES}
          onTap={handleTap}
          fontsLoaded={fontsLoaded}
        />
        <SectionRow
          title="Rudraksha"
          sub="Authenticated from sacred sources"
          items={RUDRAKSHA}
          onTap={handleTap}
          fontsLoaded={fontsLoaded}
        />
        <SectionRow
          title="Sacred Yantras"
          sub="Hand-crafted & energized"
          items={YANTRAS}
          onTap={handleTap}
          fontsLoaded={fontsLoaded}
        />

        <Quote fontsLoaded={fontsLoaded} />
      </ScrollView>

      {/* Floating cart FAB — replaces header cart button */}
      <CartFAB
        cartCount={cartCount}
        fontsLoaded={fontsLoaded}
        onPress={() => setCartCount((c) => c + 1)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  // ── Slim Logo Bar ──
  logoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  logoWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  logoName: { fontSize: 13, color: C.ink, letterSpacing: 3 },
  logoTagline: {
    fontSize: 9,
    color: C.inkMuted,
    letterSpacing: 1.5,
    marginTop: 1,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E84040",
    borderWidth: 1.5,
    borderColor: C.bgCard,
  },

  // ── Floating Cart FAB ──
  fabWrap: {
    position: "absolute",
    right: 20,
    zIndex: 100,
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 10,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  fabBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: C.goldDark,
  },
  fabBadgeTxt: { color: C.goldMid, fontSize: 10 },

  // ── Search ──
  searchWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: C.ink, fontSize: 13 },
  searchIcon: { padding: 2 },

  // ── Filters ──
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
    paddingTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  filterChipActive: { borderColor: C.goldBorder },
  filterChipTxt: { fontSize: 12, color: C.inkMid },

  // ── Banner ──
  bannerCard: { height: 210, borderRadius: 24, overflow: "hidden" },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: "#FFFFFF" },
  bannerShimmer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: "45%",
    opacity: 0.6,
  },
  bannerInner: { flex: 1, padding: 22, justifyContent: "flex-end" },
  bannerTagWrap: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.18)",
    marginBottom: 10,
  },
  bannerTag: { fontSize: 11, letterSpacing: 0.8 },
  bannerTitle: { fontSize: 34, color: "#FFF", lineHeight: 38, marginBottom: 6 },
  bannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.70)",
    lineHeight: 18,
    marginBottom: 16,
  },
  bannerCta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 0.5,
  },
  bannerCtaTxt: { fontSize: 13, letterSpacing: 0.4 },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: { width: 5, height: 4, borderRadius: 2, backgroundColor: C.border },
  dotActive: { width: 24, height: 4, borderRadius: 2, backgroundColor: C.gold },

  // ── Section Header ──
  secHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 26,
    paddingBottom: 12,
  },
  secTitle: { fontSize: 24, color: C.ink },
  secSub: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  seeAllTxt: { fontSize: 11, color: C.moonLight },

  // ── AI Rec Card ──
  aiRecCard: {
    width: 202,
    backgroundColor: C.bgCard,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    overflow: "hidden",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  aiRecImg: { height: 115, alignItems: "center", justifyContent: "center" },
  matchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  matchTxt: { fontSize: 11 },
  aiRecBody: { padding: 14 },
  aiRecRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  aiRecName: { fontSize: 16, color: C.ink },
  aiRecSub: { fontSize: 11, color: C.inkMuted, marginTop: 1 },
  reasonPill: {
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  reasonTxt: { fontSize: 10 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ratingTxt: { fontSize: 12, color: C.gold },
  ratingCount: { fontSize: 11, color: C.inkMuted },
  aiRecFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ── AI Badge ──
  aiBadge: {
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  aiBadgeGrad: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  aiBadgeTxt: { fontSize: 10, color: "#0D0B1A" },

  // ── Product Card ──
  prodCard: {
    width: 150,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  prodImg: { height: 118, alignItems: "center", justifyContent: "center" },
  prodSubPill: {
    position: "absolute",
    bottom: 6,
    right: 6,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  prodSubTxt: { fontSize: 9 },
  prodBody: { padding: 12 },
  prodName: { fontSize: 14, color: C.ink, marginBottom: 4 },
  prodFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  // ── Buttons / Prices ──
  addCartBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  addCartTxt: { color: "#0D0B1A", fontSize: 12 },
  smallAddBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  smallAddTxt: { color: "#0D0B1A", fontSize: 16 },
  priceMain: { fontSize: 18, color: C.ink },
  priceOrig: {
    fontSize: 11,
    color: C.inkMuted,
    textDecorationLine: "line-through",
  },

  // ── Promo ──
  promoWrap: { paddingHorizontal: 16, marginTop: 20 },
  promoBanner: {
    borderRadius: 26,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 7,
  },
  promoTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.35,
  },
  promoTagRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  promoTag: { fontSize: 11, color: C.goldMid, letterSpacing: 0.8 },
  promoH: { fontSize: 28, color: C.ink, lineHeight: 34 },
  promoSub: { fontSize: 12, color: C.inkMuted, marginTop: 6, lineHeight: 18 },
  promoCta: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderRadius: 22,
    overflow: "hidden",
  },
  promoCtaGrad: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
  },
  promoCtaTxt: { color: "#0D0B1A", fontSize: 13 },
  promoMoon: {
    fontSize: 82,
    color: "rgba(123,127,232,0.13)",
    marginLeft: 6,
    lineHeight: 90,
  },

  // ── Endorsed ──
  endorsedWrap: { paddingHorizontal: 16 },
  endorsedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 14,
    marginBottom: 10,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
  endorsedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  endorsedInitials: { color: "#FFF", fontSize: 17 },
  endorsedBy: { fontSize: 11, color: C.inkMuted, marginBottom: 2 },
  endorsedItem: { fontSize: 15, color: C.ink },
  endorsedReason: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  endorsedBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  endorsedBtnTxt: { color: "#0D0B1A", fontSize: 13 },

  // ── Quote ──
  quoteWrap: {
    paddingHorizontal: 28,
    paddingVertical: 28,
    alignItems: "center",
  },
  quoteLine: {
    width: 40,
    height: 1,
    backgroundColor: C.goldBorder,
    marginVertical: 16,
  },
  quoteTxt: {
    fontSize: 18,
    color: C.inkMid,
    textAlign: "center",
    lineHeight: 30,
    fontStyle: "italic",
  },
  quoteSrc: {
    fontSize: 12,
    color: C.gold,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
