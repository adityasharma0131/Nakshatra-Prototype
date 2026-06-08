/**
 * Nakshatra — Product Page
 * React Native Expo — Final Version
 *
 * Receives `route.params.product` from ShopScreen navigation.
 * Falls back to a default product if rendered standalone.
 *
 * Features:
 *  - Hero gradient image with parallax-feel animated entry
 *  - Match score ring (animated SVG-style via React Native)
 *  - Planetary origin badge + certification tags
 *  - Size / carat selector
 *  - Tabbed details: Description · Benefits · How to Wear · Reviews
 *  - "You May Also Like" row
 *  - Sticky bottom bar: Wishlist + Add to Cart
 *  - Full design token parity with ShopScreen
 *
 * Install deps (same as ShopScreen — no new deps):
 *   expo-linear-gradient, @expo-google-fonts/cormorant-garamond,
 *   react-native-safe-area-context, @expo/vector-icons
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
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

const { width, height } = Dimensions.get("window");
const HERO_H = height * 0.44;

// ─── Design Tokens (identical to ShopScreen) ──────────────────────────────────
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
  greenBorder: "rgba(52,208,119,0.30)",
  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  shadow: "rgba(0,0,0,0.60)",
  shadowGold: "rgba(212,160,23,0.22)",
  shadowMoon: "rgba(123,127,232,0.28)",
};

const SERIF_BOLD = "CormorantGaramond_700Bold";
const SERIF_SEMI = "CormorantGaramond_600SemiBold";
const SERIF_REG = "CormorantGaramond_400Regular";

// ─── Default / Fallback Product ───────────────────────────────────────────────
const DEFAULT_PRODUCT = {
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
  grad: ["#0A1A3A", "#1A2F6A", "#0D2255"],
  accent: "#4A8FE8",
  tags: ["Certified", "Energized", "Lab Tested"],
  weight: "5.25",
  origin: "Ceylon (Sri Lanka)",
  metal: "Silver / Panchdhatu",
  finger: "Middle finger, right hand",
  day: "Saturday, during Shani hora",
  mantra: "Om Sham Shanicharaya Namah",
  description:
    "This exquisite Ceylon Blue Sapphire (Neelam) is handpicked and authenticated for astrological efficacy. Known as the most powerful gemstone in Jyotish, it channels Saturn's disciplined energy to bestow focus, career advancement, and spiritual depth. Each stone is individually tested for inclusions, clarity, and vedic resonance.",
  benefits: [
    { icon: "💼", text: "Accelerates career & financial growth" },
    { icon: "🧘", text: "Deepens focus and mental clarity" },
    { icon: "🛡️", text: "Protection from negative energies" },
    { icon: "⚖️", text: "Balances Saturn's karmic influence" },
    { icon: "🌙", text: "Enhances intuition & spiritual insight" },
  ],
  howToWear: [
    { step: "01", text: "Get the stone energized on a Saturday morning" },
    { step: "02", text: "Dip in raw milk + Ganga jal for 10 minutes" },
    { step: "03", text: "Chant Shani mantra 108 times before wearing" },
    { step: "04", text: "Set in silver or panchdhatu ring" },
    { step: "05", text: "Wear on middle finger of right hand" },
  ],
  sizes: ["2–3 ct", "3–4 ct", "4–5 ct", "5–6 ct"],
  reviews_list: [
    {
      name: "Priya S.",
      initials: "PS",
      rating: 5,
      date: "2 weeks ago",
      text: "Incredible quality. I've been wearing it for 3 weeks and the difference in my career clarity is tangible. Highly recommend getting a consultation too.",
    },
    {
      name: "Arjun M.",
      initials: "AM",
      rating: 5,
      date: "1 month ago",
      text: "Authenticated, beautifully packaged, and the energization certificate adds real confidence. Fast delivery to Mumbai.",
    },
    {
      name: "Kavita R.",
      initials: "KR",
      rating: 4,
      date: "6 weeks ago",
      text: "Very happy with the stone. Would've liked a slightly deeper color but the astrologer confirmed it's excellent for my chart.",
    },
  ],
};

const RELATED = [
  {
    id: "r1",
    name: "Yellow Sapphire",
    sub: "Pukhraj",
    price: "₹6,499",
    rating: "4.8",
    emoji: "✨",
    accent: "#E8B430",
    grad: ["#2A1A00", "#5A3800"],
  },
  {
    id: "r2",
    name: "Pearl",
    sub: "Moti",
    price: "₹2,499",
    rating: "4.7",
    emoji: "🌕",
    accent: "#A5C8E8",
    grad: ["#0A1A2A", "#1A2E40"],
  },
  {
    id: "r3",
    name: "Emerald",
    sub: "Panna",
    price: "₹5,499",
    rating: "4.8",
    emoji: "💚",
    accent: "#34D077",
    grad: ["#0A2A0A", "#1A4A1A"],
  },
  {
    id: "r4",
    name: "Ruby",
    sub: "Manik",
    price: "₹7,299",
    rating: "4.9",
    emoji: "❤️",
    accent: "#E85A4A",
    grad: ["#2A0A0A", "#5A1A1A"],
  },
];

const TABS = ["Description", "Benefits", "How to Wear", "Reviews"];

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

// ─── Animated Match Ring ──────────────────────────────────────────────────────
function MatchRing({ match, accent, fontsLoaded }) {
  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: match / 100,
      duration: 1200,
      useNativeDriver: false,
      delay: 400,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
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
  }, []);

  const SIZE = 88;
  const STROKE = 6;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;

  return (
    <Animated.View style={[s.matchRingWrap, { transform: [{ scale: pulse }] }]}>
      <View
        style={{
          width: SIZE,
          height: SIZE,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: SIZE / 2,
          backgroundColor: C.bgCard,
          borderWidth: STROKE,
          borderColor: accent + "33",
          shadowColor: accent,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 14,
          elevation: 8,
        }}
      >
        {/* Inner glow ring overlay */}
        <View
          style={{
            position: "absolute",
            width: SIZE - STROKE * 2 - 4,
            height: SIZE - STROKE * 2 - 4,
            borderRadius: (SIZE - STROKE * 2 - 4) / 2,
            borderWidth: 1.5,
            borderColor: accent + "55",
          }}
        />
        <Text
          style={[
            s.matchRingPct,
            { color: accent },
            fontsLoaded && { fontFamily: SERIF_BOLD },
          ]}
        >
          {match}%
        </Text>
        <Text
          style={[s.matchRingLbl, fontsLoaded && { fontFamily: SERIF_REG }]}
        >
          Match
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  const full = Math.floor(parseFloat(rating));
  const half = parseFloat(rating) % 1 >= 0.5;
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={
            i < full
              ? "star"
              : half && i === full
                ? "star-half"
                : "star-outline"
          }
          size={size}
          color={i <= full || (half && i === full) ? C.gold : C.inkMuted}
        />
      ))}
    </View>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────────────────
function TabContent({ tab, product, fontsLoaded }) {
  if (tab === "Description") {
    return (
      <View style={s.tabBody}>
        <Text style={[s.descTxt, fontsLoaded && { fontFamily: SERIF_REG }]}>
          {product.description}
        </Text>
        <View style={s.specGrid}>
          {[
            { label: "Weight", value: product.weight + " carats" },
            { label: "Origin", value: product.origin },
            { label: "Setting", value: product.metal },
            { label: "Finger", value: product.finger },
          ].map((spec) => (
            <View key={spec.label} style={s.specItem}>
              <Text
                style={[s.specLabel, fontsLoaded && { fontFamily: SERIF_REG }]}
              >
                {spec.label}
              </Text>
              <Text
                style={[s.specValue, fontsLoaded && { fontFamily: SERIF_SEMI }]}
              >
                {spec.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (tab === "Benefits") {
    return (
      <View style={s.tabBody}>
        {product.benefits.map((b, i) => (
          <Animated.View
            key={i}
            style={[s.benefitRow, { borderColor: product.accent + "28" }]}
          >
            <View
              style={[
                s.benefitIcon,
                { backgroundColor: product.accent + "18" },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{b.icon}</Text>
            </View>
            <Text
              style={[s.benefitTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {b.text}
            </Text>
          </Animated.View>
        ))}
      </View>
    );
  }

  if (tab === "How to Wear") {
    return (
      <View style={s.tabBody}>
        <View
          style={[
            s.wearInfoCard,
            {
              borderColor: product.accent + "33",
              backgroundColor: product.accent + "0A",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="calendar-star"
            size={14}
            color={product.accent}
          />
          <Text
            style={[
              s.wearInfoTxt,
              { color: product.accent },
              fontsLoaded && { fontFamily: SERIF_SEMI },
            ]}
          >
            {"  "}Auspicious Day: {product.day}
          </Text>
        </View>
        <View
          style={[
            s.wearInfoCard,
            {
              borderColor: C.moonBorder,
              backgroundColor: C.moonPale,
              marginTop: 8,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="meditation"
            size={14}
            color={C.moonLight}
          />
          <Text
            style={[
              s.wearInfoTxt,
              { color: C.moonLight },
              fontsLoaded && { fontFamily: SERIF_REG },
            ]}
          >
            {"  "}
            {product.mantra}
          </Text>
        </View>
        <View style={s.stepsWrap}>
          {product.howToWear.map((hw, i) => (
            <View key={i} style={s.stepRow}>
              <View
                style={[
                  s.stepBubble,
                  {
                    backgroundColor: product.accent + "22",
                    borderColor: product.accent + "55",
                  },
                ]}
              >
                <Text
                  style={[
                    s.stepNum,
                    { color: product.accent },
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {hw.step}
                </Text>
              </View>
              {i < product.howToWear.length - 1 && (
                <View
                  style={[
                    s.stepLine,
                    { backgroundColor: product.accent + "33" },
                  ]}
                />
              )}
              <Text
                style={[s.stepTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
              >
                {hw.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (tab === "Reviews") {
    return (
      <View style={s.tabBody}>
        {/* Aggregate */}
        <View style={s.reviewAggregate}>
          <View style={s.ratingBig}>
            <Text
              style={[
                s.ratingBigNum,
                fontsLoaded && { fontFamily: SERIF_BOLD },
              ]}
            >
              {product.rating}
            </Text>
            <Stars rating={product.rating} size={15} />
            <Text
              style={[
                s.ratingBigCount,
                fontsLoaded && { fontFamily: SERIF_REG },
              ]}
            >
              {product.reviews} reviews
            </Text>
          </View>
          <View style={s.ratingBars}>
            {[5, 4, 3, 2, 1].map((n) => {
              const pct =
                n === 5
                  ? 0.72
                  : n === 4
                    ? 0.18
                    : n === 3
                      ? 0.06
                      : n === 2
                        ? 0.02
                        : 0.02;
              return (
                <View key={n} style={s.ratingBarRow}>
                  <Text
                    style={[
                      s.ratingBarLbl,
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    {n}
                  </Text>
                  <View style={s.ratingBarBg}>
                    <View
                      style={[
                        s.ratingBarFill,
                        {
                          width: `${pct * 100}%`,
                          backgroundColor:
                            n >= 4 ? C.green : n === 3 ? C.goldMid : "#E85A4A",
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        {/* Reviews */}
        {product.reviews_list.map((rev, i) => (
          <View key={i} style={s.reviewCard}>
            <View style={s.reviewTop}>
              <LinearGradient
                colors={[C.moonPale.replace("0.12", "0.6"), C.bgSurface]}
                style={s.reviewAvatar}
              >
                <Text
                  style={[
                    s.reviewInitials,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {rev.initials}
                </Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    s.reviewName,
                    fontsLoaded && { fontFamily: SERIF_SEMI },
                  ]}
                >
                  {rev.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 2,
                  }}
                >
                  <Stars rating={rev.rating} size={11} />
                  <Text
                    style={[
                      s.reviewDate,
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    {rev.date}
                  </Text>
                </View>
              </View>
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={11} color={C.green} />
                <Text
                  style={[
                    s.verifiedTxt,
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  Verified
                </Text>
              </View>
            </View>
            <Text
              style={[s.reviewTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {rev.text}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return null;
}

// ─── Related Card ─────────────────────────────────────────────────────────────
function RelatedCard({ p, onTap, fontsLoaded }) {
  return (
    <PressScale style={s.relCard} onPress={() => onTap(p)} scale={0.97}>
      <LinearGradient
        colors={p.grad || ["#13112A", "#1C1850"]}
        style={s.relImg}
      >
        <Text style={{ fontSize: 34 }}>{p.emoji}</Text>
      </LinearGradient>
      <View style={s.relBody}>
        <Text
          style={[s.relName, fontsLoaded && { fontFamily: SERIF_BOLD }]}
          numberOfLines={1}
        >
          {p.name}
        </Text>
        <Text style={[s.relSub, fontsLoaded && { fontFamily: SERIF_REG }]}>
          {p.sub}
        </Text>
        <Text style={[s.relPrice, fontsLoaded && { fontFamily: SERIF_BOLD }]}>
          {p.price}
        </Text>
      </View>
    </PressScale>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductPage({ route, navigation }) {
  const product = route?.params?.product
    ? { ...DEFAULT_PRODUCT, ...route.params.product }
    : DEFAULT_PRODUCT;

  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Description");
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] ?? "3–4 ct",
  );
  const [wishlisted, setWishlisted] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const wishAnim = useRef(new Animated.Value(1)).current;
  const cartAnim = useRef(new Animated.Value(1)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(contentSlide, {
        toValue: 0,
        speed: 12,
        useNativeDriver: true,
        delay: 200,
      }),
    ]).start();
  }, []);

  const heroScale = scrollY.interpolate({
    inputRange: [-60, 0, HERO_H],
    outputRange: [1.15, 1, 0.92],
    extrapolate: "clamp",
  });
  const heroTrans = scrollY.interpolate({
    inputRange: [0, HERO_H],
    outputRange: [0, -HERO_H * 0.25],
    extrapolate: "clamp",
  });
  const navBg = scrollY.interpolate({
    inputRange: [HERO_H - 80, HERO_H - 40],
    outputRange: ["rgba(13,11,26,0)", "rgba(13,11,26,0.98)"],
    extrapolate: "clamp",
  });

  const handleWishlist = () => {
    setWishlisted((w) => !w);
    Animated.sequence([
      Animated.spring(wishAnim, {
        toValue: 1.35,
        useNativeDriver: true,
        speed: 60,
      }),
      Animated.spring(wishAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
      }),
    ]).start();
  };

  const handleCart = () => {
    setCartAdded(true);
    Animated.sequence([
      Animated.spring(cartAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 60,
      }),
      Animated.spring(cartAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
      }),
    ]).start();
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleRelTap = useCallback(
    (p) => {
      if (navigation) navigation.replace("ProductPage", { product: p });
    },
    [navigation],
  );

  return (
    <View style={s.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ── Sticky Nav Overlay ── */}
      <Animated.View
        style={[
          s.navBar,
          { backgroundColor: navBg, paddingTop: insets.top + 6 },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={s.navBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={C.ink} />
        </TouchableOpacity>
        <Animated.View
          style={{
            opacity: scrollY.interpolate({
              inputRange: [HERO_H - 80, HERO_H - 20],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          }}
        >
          <Text
            style={[s.navTitle, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            numberOfLines={1}
          >
            {product.name}
          </Text>
        </Animated.View>
        <TouchableOpacity style={s.navBtn} activeOpacity={0.8}>
          <Ionicons name="share-outline" size={18} color={C.ink} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* ── Hero ── */}
        <Animated.View style={{ opacity: heroOpacity }}>
          <Animated.View
            style={{
              height: HERO_H,
              transform: [{ scale: heroScale }, { translateY: heroTrans }],
            }}
          >
            <LinearGradient
              colors={
                product.grad?.length >= 2
                  ? product.grad
                  : ["#0A1A3A", "#1A2F6A"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.hero}
            >
              {/* Decorative orbs */}
              <View
                style={[
                  s.orb,
                  {
                    width: 280,
                    height: 280,
                    top: -100,
                    right: -80,
                    opacity: 0.07,
                  },
                ]}
              />
              <View
                style={[
                  s.orb,
                  {
                    width: 120,
                    height: 120,
                    bottom: 20,
                    left: 20,
                    opacity: 0.05,
                  },
                ]}
              />
              <LinearGradient
                colors={["transparent", "rgba(212,160,23,0.25)", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.shimmerH}
              />
              {/* Main gem emoji */}
              <Text style={s.heroEmoji}>{product.emoji}</Text>
              {/* Planet badge */}
              <View
                style={[
                  s.planetBadge,
                  {
                    borderColor: product.accent + "66",
                    backgroundColor: product.accent + "18",
                  },
                ]}
              >
                <Text
                  style={[
                    s.planetTxt,
                    { color: product.accent },
                    fontsLoaded && { fontFamily: SERIF_SEMI },
                  ]}
                >
                  {product.planet}
                </Text>
              </View>
              {/* Tags */}
              <View style={s.heroTags}>
                {(product.tags || []).map((t) => (
                  <View key={t} style={s.heroTag}>
                    <Ionicons
                      name="checkmark-circle"
                      size={10}
                      color={C.green}
                    />
                    <Text
                      style={[
                        s.heroTagTxt,
                        fontsLoaded && { fontFamily: SERIF_REG },
                      ]}
                    >
                      {" "}
                      {t}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Fade into bg at bottom */}
              <LinearGradient
                colors={["transparent", C.bg]}
                style={s.heroFade}
              />
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View
          style={[s.content, { transform: [{ translateY: contentSlide }] }]}
        >
          {/* ── Title Row ── */}
          <View style={s.titleRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  s.productName,
                  fontsLoaded && { fontFamily: SERIF_BOLD },
                ]}
              >
                {product.name}
              </Text>
              <Text
                style={[s.productSub, fontsLoaded && { fontFamily: SERIF_REG }]}
              >
                {product.sub}
              </Text>
            </View>
            <MatchRing
              match={product.match}
              accent={product.accent}
              fontsLoaded={fontsLoaded}
            />
          </View>

          {/* ── Rating + Origin ── */}
          <View style={s.metaRow}>
            <Stars rating={product.rating} size={14} />
            <Text
              style={[s.metaRating, fontsLoaded && { fontFamily: SERIF_SEMI }]}
            >
              {" "}
              {product.rating}
            </Text>
            <Text
              style={[s.metaCount, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              ({product.reviews})
            </Text>
            <View style={s.metaDot} />
            <Ionicons name="location-outline" size={11} color={C.inkMuted} />
            <Text
              style={[s.metaOrigin, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {" "}
              {product.origin}
            </Text>
          </View>

          {/* ── AI Reason Pill ── */}
          <View
            style={[
              s.reasonBanner,
              {
                borderColor: product.accent + "44",
                backgroundColor: product.accent + "12",
              },
            ]}
          >
            <LinearGradient
              colors={[product.accent + "22", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <MaterialCommunityIcons
              name="robot-outline"
              size={14}
              color={product.accent}
            />
            <Text
              style={[
                s.reasonBannerTxt,
                { color: product.accent },
                fontsLoaded && { fontFamily: SERIF_SEMI },
              ]}
            >
              {"  "}AI Matched: {product.reason}
            </Text>
          </View>

          {/* ── Price Row ── */}
          <View style={s.priceRow}>
            <Text
              style={[s.priceMain, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {product.price}
            </Text>
            {product.original && (
              <Text
                style={[s.priceOrig, fontsLoaded && { fontFamily: SERIF_REG }]}
              >
                {product.original}
              </Text>
            )}
            {product.discount && (
              <View style={s.discountBadge}>
                <Text
                  style={[
                    s.discountTxt,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {product.discount}
                </Text>
              </View>
            )}
          </View>

          {/* ── Divider ── */}
          <View style={s.divider} />

          {/* ── Size Selector ── */}
          {product.sizes && (
            <View style={s.sizeSection}>
              <Text
                style={[s.sizeLabel, fontsLoaded && { fontFamily: SERIF_SEMI }]}
              >
                Select Carat Weight
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
              >
                {product.sizes.map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    onPress={() => setSelectedSize(sz)}
                    activeOpacity={0.8}
                    style={[
                      s.sizeChip,
                      selectedSize === sz && {
                        borderColor: product.accent + "99",
                        backgroundColor: product.accent + "18",
                      },
                    ]}
                  >
                    {selectedSize === sz && (
                      <LinearGradient
                        colors={[product.accent + "22", product.accent + "0A"]}
                        style={StyleSheet.absoluteFill}
                        borderRadius={14}
                      />
                    )}
                    <Text
                      style={[
                        s.sizeChipTxt,
                        selectedSize === sz && { color: product.accent },
                        fontsLoaded && {
                          fontFamily:
                            selectedSize === sz ? SERIF_SEMI : SERIF_REG,
                        },
                      ]}
                    >
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Delivery + Certifications ── */}
          <View style={s.infoCards}>
            {[
              {
                icon: "shield-checkmark-outline",
                label: "Govt. Certified",
                color: C.green,
              },
              { icon: "flash-outline", label: "Energized", color: C.goldMid },
              {
                icon: "cube-outline",
                label: "Free Delivery",
                color: C.moonLight,
              },
              {
                icon: "refresh-outline",
                label: "Easy Returns",
                color: C.inkMid,
              },
            ].map((ic) => (
              <View key={ic.label} style={s.infoCard}>
                <Ionicons name={ic.icon} size={18} color={ic.color} />
                <Text
                  style={[
                    s.infoCardTxt,
                    { color: ic.color },
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  {ic.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Divider ── */}
          <View style={s.divider} />

          {/* ── Tabs ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.tabsScroll}
          >
            {TABS.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(t)}
                activeOpacity={0.8}
                style={s.tabBtn}
              >
                <Text
                  style={[
                    s.tabTxt,
                    activeTab === t && { color: product.accent },
                    fontsLoaded && {
                      fontFamily: activeTab === t ? SERIF_SEMI : SERIF_REG,
                    },
                  ]}
                >
                  {t}
                </Text>
                {activeTab === t && (
                  <LinearGradient
                    colors={[product.accent, product.accent + "55"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={s.tabUnderline}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TabContent
            tab={activeTab}
            product={product}
            fontsLoaded={fontsLoaded}
          />

          {/* ── Divider ── */}
          <View style={[s.divider, { marginTop: 24 }]} />

          {/* ── Astrologer Note ── */}
          <View style={s.astroNote}>
            <LinearGradient
              colors={["#100E2A", "#1E1A50"]}
              style={s.astroNoteGrad}
            >
              <View style={s.astroNoteLeft}>
                <LinearGradient
                  colors={[C.moonPale.replace("0.12", "0.5"), C.bgSurface]}
                  style={s.astroAvatar}
                >
                  <Text style={{ fontSize: 20 }}>🔮</Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      s.astroName,
                      fontsLoaded && { fontFamily: SERIF_SEMI },
                    ]}
                  >
                    Expert Astrologer Consultation
                  </Text>
                  <Text
                    style={[
                      s.astroSub,
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    Not sure if this stone suits your chart? Talk to a Jyotish
                    expert.
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={s.astroCta} activeOpacity={0.85}>
                <LinearGradient
                  colors={[C.moonLight, C.moon]}
                  style={s.astroCtaGrad}
                >
                  <Text
                    style={[
                      s.astroCtaTxt,
                      fontsLoaded && { fontFamily: SERIF_BOLD },
                    ]}
                  >
                    Free Consult
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* ── You May Also Like ── */}
          <View style={s.relSection}>
            <Text
              style={[s.relTitle, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              You May Also Like
            </Text>
            <FlatList
              horizontal
              data={RELATED}
              keyExtractor={(i) => i.id}
              showsHorizontalScrollIndicator={false}
              snapToInterval={132}
              decelerationRate="fast"
              contentContainerStyle={{ gap: 12, paddingRight: 16 }}
              renderItem={({ item }) => (
                <RelatedCard
                  p={item}
                  onTap={handleRelTap}
                  fontsLoaded={fontsLoaded}
                />
              )}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* ── Sticky Bottom Bar ── */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <LinearGradient
          colors={[C.bg + "00", C.bg]}
          style={s.bottomFade}
          pointerEvents="none"
        />
        <View style={s.bottomInner}>
          <Animated.View style={{ transform: [{ scale: wishAnim }] }}>
            <TouchableOpacity
              onPress={handleWishlist}
              style={s.wishBtn}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[C.bgSurface, C.bgCard]}
                style={s.wishGrad}
              >
                <Ionicons
                  name={wishlisted ? "heart" : "heart-outline"}
                  size={22}
                  color={wishlisted ? "#E85A4A" : C.inkMid}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[{ flex: 1 }, { transform: [{ scale: cartAnim }] }]}
          >
            <TouchableOpacity
              onPress={handleCart}
              activeOpacity={0.88}
              style={{ borderRadius: 18, overflow: "hidden" }}
            >
              <LinearGradient
                colors={
                  cartAdded
                    ? [C.green, "#28AA60"]
                    : [C.goldLight, C.goldMid, C.gold]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.cartBtn}
              >
                <Ionicons
                  name={cartAdded ? "checkmark-circle" : "cart-outline"}
                  size={18}
                  color="#0D0B1A"
                />
                <Text
                  style={[
                    s.cartBtnTxt,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {"  "}
                  {cartAdded
                    ? "Added to Cart!"
                    : `Add to Cart · ${product.price}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  // ── Nav ──
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(13,11,26,0.60)",
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },
  navTitle: { fontSize: 17, color: C.ink, maxWidth: width * 0.5 },

  // ── Hero ──
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orb: { position: "absolute", borderRadius: 999, backgroundColor: "#FFFFFF" },
  shimmerH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    top: "50%",
    opacity: 0.5,
  },
  heroEmoji: {
    fontSize: 96,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 20,
  },
  planetBadge: {
    position: "absolute",
    top: 70,
    right: 16,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  planetTxt: { fontSize: 13 },
  heroTags: {
    position: "absolute",
    bottom: 44,
    left: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroTagTxt: { fontSize: 11, color: C.ink },
  heroFade: { position: "absolute", bottom: 0, left: 0, right: 0, height: 80 },

  // ── Content ──
  content: { paddingHorizontal: 16, paddingTop: 4 },

  // ── Title ──
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productName: {
    fontSize: 34,
    color: C.ink,
    lineHeight: 38,
    flex: 1,
    paddingRight: 10,
  },
  productSub: { fontSize: 14, color: C.inkMuted, marginTop: 3 },
  matchRingWrap: { marginTop: 4 },
  matchRingPct: { fontSize: 20, lineHeight: 22 },
  matchRingLbl: { fontSize: 9, color: C.inkMuted, marginTop: 1 },

  // ── Meta ──
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  metaRating: { fontSize: 13, color: C.gold },
  metaCount: { fontSize: 12, color: C.inkMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.inkMuted,
    marginHorizontal: 8,
  },
  metaOrigin: { fontSize: 12, color: C.inkMuted },

  // ── Reason Banner ──
  reasonBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  reasonBannerTxt: { fontSize: 13 },

  // ── Price ──
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  priceMain: { fontSize: 32, color: C.ink },
  priceOrig: {
    fontSize: 15,
    color: C.inkMuted,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountTxt: { fontSize: 12, color: C.green },

  // ── Divider ──
  divider: { height: 0.5, backgroundColor: C.divider, marginVertical: 16 },

  // ── Size ──
  sizeSection: { marginBottom: 16 },
  sizeLabel: { fontSize: 14, color: C.inkMid, marginBottom: 10 },
  sizeChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  sizeChipTxt: { fontSize: 13, color: C.inkMid },

  // ── Info Cards ──
  infoCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  infoCard: {
    flex: 1,
    minWidth: "44%",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoCardTxt: { fontSize: 12 },

  // ── Tabs ──
  tabsScroll: { gap: 0, paddingBottom: 0 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: "relative",
    alignItems: "center",
  },
  tabTxt: { fontSize: 14, color: C.inkMuted },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    borderRadius: 1,
  },

  // ── Tab Bodies ──
  tabBody: { paddingTop: 16 },
  descTxt: { fontSize: 15, color: C.inkMid, lineHeight: 25, marginBottom: 20 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  specItem: {
    flex: 1,
    minWidth: "44%",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 14,
    padding: 12,
  },
  specLabel: { fontSize: 11, color: C.inkMuted, marginBottom: 4 },
  specValue: { fontSize: 14, color: C.ink },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 0.5,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: C.bgCard,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTxt: { flex: 1, fontSize: 14, color: C.inkMid, lineHeight: 20 },
  wearInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  wearInfoTxt: { fontSize: 13 },
  stepsWrap: { marginTop: 20 },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 20,
    position: "relative",
  },
  stepBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNum: { fontSize: 13 },
  stepLine: { position: "absolute", left: 20, top: 40, width: 1, height: 20 },
  stepTxt: {
    flex: 1,
    fontSize: 14,
    color: C.inkMid,
    lineHeight: 22,
    paddingTop: 9,
  },
  reviewAggregate: { flexDirection: "row", gap: 16, marginBottom: 20 },
  ratingBig: { alignItems: "center", justifyContent: "center", gap: 6 },
  ratingBigNum: { fontSize: 44, color: C.ink, lineHeight: 46 },
  ratingBigCount: { fontSize: 11, color: C.inkMuted },
  ratingBars: { flex: 1, gap: 5, justifyContent: "center" },
  ratingBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingBarLbl: { fontSize: 11, color: C.inkMuted, width: 10 },
  ratingBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: C.bgCard,
    borderRadius: 3,
    overflow: "hidden",
  },
  ratingBarFill: { height: "100%", borderRadius: 3 },
  reviewCard: {
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reviewInitials: { fontSize: 15, color: C.moonLight },
  reviewName: { fontSize: 14, color: C.ink },
  reviewDate: { fontSize: 11, color: C.inkMuted },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.greenPale,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  verifiedTxt: { fontSize: 10, color: C.green },
  reviewTxt: { fontSize: 13, color: C.inkMid, lineHeight: 20 },

  // ── Astrologer Note ──
  astroNote: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  astroNoteGrad: { padding: 18 },
  astroNoteLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
  },
  astroAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  astroName: { fontSize: 15, color: C.ink, marginBottom: 4 },
  astroSub: { fontSize: 12, color: C.inkMuted, lineHeight: 18 },
  astroCta: { borderRadius: 16, overflow: "hidden", alignSelf: "flex-start" },
  astroCtaGrad: { paddingHorizontal: 20, paddingVertical: 11 },
  astroCtaTxt: { color: "#0D0B1A", fontSize: 13 },

  // ── Related ──
  relSection: { marginBottom: 8 },
  relTitle: { fontSize: 24, color: C.ink, marginBottom: 14 },
  relCard: {
    width: 120,
    backgroundColor: C.bgCard,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  relImg: { height: 90, alignItems: "center", justifyContent: "center" },
  relBody: { padding: 10 },
  relName: { fontSize: 13, color: C.ink, marginBottom: 2 },
  relSub: { fontSize: 10, color: C.inkMuted, marginBottom: 4 },
  relPrice: { fontSize: 14, color: C.goldMid },

  // ── Bottom Bar ──
  bottomBar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#0D0B1A",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bottomFade: { position: "absolute", top: 0, left: 0, right: 0 },
  bottomInner: { flexDirection: "row", gap: 12 },
  wishBtn: { borderRadius: 18, overflow: "hidden" },
  wishGrad: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  cartBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  cartBtnTxt: { color: "#0D0B1A", fontSize: 15 },
});
