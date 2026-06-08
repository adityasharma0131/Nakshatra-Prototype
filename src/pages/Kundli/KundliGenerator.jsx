/**
 * Nakshatra — Kundli Generator Screen
 * React Native Expo — Final Version (Fixed)
 *
 * Fixes applied:
 *  1. DOB input: auto-formats to DD-MM-YYYY with live masking (digits only, auto inserts dashes)
 *  2. TOB input: auto-formats to HH:MM with live masking (digits only, auto inserts colon)
 *  3. DOB validation: day 01-31, month 01-12, year 1900-2025
 *  4. TOB validation: hour 00-23, minute 00-59
 *  5. KeyboardAvoidingView wraps entire screen so inputs scroll above keyboard
 *  6. ScrollView gets keyboardShouldPersistTaps + automaticallyAdjustKeyboardInsets
 *  7. computeKundli now correctly extracts year from DD-MM-YYYY format (parts[2])
 *  8. Inline error messages shown for invalid DOB/TOB
 *  9. Fixed loader animation invariant violation (inputRange monotonically non-decreasing)
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
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Easing,
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

// ─── Design Tokens ─────────────────────────────────────────────────────────────
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
  red: "#E85A4A",
  redPale: "rgba(232,90,74,0.12)",
  redBorder: "rgba(232,90,74,0.35)",
  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  shadow: "rgba(0,0,0,0.60)",
  shadowGold: "rgba(212,160,23,0.22)",
  shadowMoon: "rgba(123,127,232,0.28)",
};

const SERIF_BOLD = "CormorantGaramond_700Bold";
const SERIF_SEMI = "CormorantGaramond_600SemiBold";
const SERIF_REG = "CormorantGaramond_400Regular";

// ─── Static Kundli Computation ─────────────────────────────────────────────────
const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];
const SIGN_GLYPHS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
];
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];
const PLANETS = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];
const PLANET_GLYPHS = ["☉", "☽", "♂", "☿", "♃", "♀", "♄", "☊", "☋"];
const PLANET_COLORS = [
  C.goldLight,
  "#E8CFFF",
  C.red,
  C.green,
  C.goldMid,
  "#FF9ECC",
  C.moonLight,
  "#A0A8FF",
  "#FFB380",
];
const DASHA_LORDS = ["Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me", "Ke"];
const DASHA_YEARS = [20, 6, 10, 7, 18, 16, 19, 17, 7];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// DOB format is DD-MM-YYYY so parts[2] = YYYY, parts[1] = MM, parts[0] = DD
function computeKundli(dob, tob, pob) {
  const seed = hashCode(dob + tob + pob);
  const randN = (n, offset = 0) => (((seed * (offset + 7) * 1999) % n) + n) % n;

  const lagnaSign = randN(12, 1);
  const moonSign = randN(12, 2);
  const moonNak = randN(27, 3);
  const moonPada = randN(4, 4) + 1;
  const sunSign = randN(12, 5);

  const planetHouses = PLANETS.map((_, i) => randN(12, i + 10) + 1);
  const planetSigns = PLANETS.map((_, i) => randN(12, i + 20));
  const planetDegrees = PLANETS.map((_, i) =>
    (randN(2900, i + 30) / 100).toFixed(2),
  );
  const planetRetrograde = PLANETS.map((_, i) => randN(5, i + 40) === 0);
  const planetStrengths = PLANETS.map((_, i) => 30 + randN(70, i + 50));

  const houseSign = Array.from({ length: 12 }, (_, i) => (lagnaSign + i) % 12);

  // FIX: DOB is DD-MM-YYYY → parts[2] is the year
  const parts = dob.split("-");
  const birthYear =
    parts.length === 3 && parts[2].length === 4 ? parseInt(parts[2], 10) : 1990;
  const ageYears = 2026 - birthYear;
  let dashaIdx = 0,
    dashaAccum = 0;
  for (let i = 0; i < DASHA_LORDS.length; i++) {
    dashaAccum += DASHA_YEARS[i];
    if (ageYears < dashaAccum) {
      dashaIdx = i;
      break;
    }
  }

  return {
    lagnaSign,
    moonSign,
    moonNak,
    moonPada,
    sunSign,
    planetHouses,
    planetSigns,
    planetDegrees,
    planetRetrograde,
    planetStrengths,
    houseSign,
    currentDashaIdx: dashaIdx,
    dashaLords: DASHA_LORDS,
    dashaYears: DASHA_YEARS,
  };
}

// ─── Input Masking Helpers ─────────────────────────────────────────────────────

/**
 * Formats raw digit input into DD-MM-YYYY
 * Auto-inserts dashes at positions 2 and 5
 */
function formatDOB(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += "-";
    result += digits[i];
  }
  return result;
}

/**
 * Formats raw digit input into HH:MM
 * Auto-inserts colon at position 2
 */
function formatTOB(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2) result += ":";
    result += digits[i];
  }
  return result;
}

/** Returns null if valid, or an error string if invalid */
function validateDOB(dob) {
  if (dob.length < 10) return null; // still typing
  const parts = dob.split("-");
  if (parts.length !== 3) return "Use DD-MM-YYYY format";
  const [dd, mm, yyyy] = parts.map(Number);
  if (isNaN(dd) || dd < 1 || dd > 31) return "Day must be 01–31";
  if (isNaN(mm) || mm < 1 || mm > 12) return "Month must be 01–12";
  if (isNaN(yyyy) || yyyy < 1900 || yyyy > 2025)
    return "Year must be 1900–2025";
  return null;
}

function validateTOB(tob) {
  if (tob.length < 5) return null; // still typing
  const parts = tob.split(":");
  if (parts.length !== 2) return "Use HH:MM format";
  const [hh, mm] = parts.map(Number);
  if (isNaN(hh) || hh < 0 || hh > 23) return "Hour must be 00–23";
  if (isNaN(mm) || mm < 0 || mm > 59) return "Minute must be 00–59";
  return null;
}

// ─── City suggestions ──────────────────────────────────────────────────────────
const CITIES = [
  "Mumbai, Maharashtra",
  "Delhi, NCT",
  "Bengaluru, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Varanasi, Uttar Pradesh",
  "Indore, MP",
  "Bhopal, MP",
  "Nagpur, Maharashtra",
  "Patna, Bihar",
  "Kochi, Kerala",
  "Chandigarh",
  "Coimbatore, Tamil Nadu",
  "Visakhapatnam, AP",
  "Surat, Gujarat",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function PressScale({ children, style, onPress, scale = 0.97 }) {
  const anim = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(anim, {
            toValue: scale,
            useNativeDriver: true,
            speed: 50,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
          }).start()
        }
        style={{ flex: 1 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step, fontsLoaded }) {
  const STEPS = ["Details", "Generating", "Your Kundli"];
  return (
    <View style={st.stepRow}>
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <React.Fragment key={i}>
            <View style={st.stepItem}>
              <View
                style={[
                  st.stepBubble,
                  done && { backgroundColor: C.green, borderColor: C.green },
                  active && {
                    borderColor: C.gold,
                    backgroundColor: C.goldPale,
                  },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <Text
                    style={[
                      st.stepNum,
                      { color: active ? C.gold : C.inkMuted },
                      fontsLoaded && { fontFamily: SERIF_BOLD },
                    ]}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  st.stepLabel,
                  active && { color: C.gold },
                  done && { color: C.green },
                  fontsLoaded && {
                    fontFamily: active || done ? SERIF_SEMI : SERIF_REG,
                  },
                ]}
              >
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View
                style={[st.stepLine, done && { backgroundColor: C.green }]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Animated Input Field ──────────────────────────────────────────────────────
function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = "default",
  fontsLoaded,
  hint,
  error,
  maxLength,
  inputRef,
}) {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const hasError = !!error;

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
    outputRange: [
      hasError ? C.redBorder : C.border,
      hasError ? C.redBorder : C.goldBorder,
    ],
  });
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.bgCard, "#1A1735"],
  });
  const isComplete = value.length === maxLength;

  return (
    <View style={st.fieldWrap}>
      <Text style={[st.fieldLabel, fontsLoaded && { fontFamily: SERIF_SEMI }]}>
        {label}
      </Text>
      <Animated.View
        style={[st.fieldBox, { borderColor, backgroundColor: bgColor }]}
      >
        <View
          style={[
            st.fieldIcon,
            {
              backgroundColor: focused
                ? C.goldPale
                : hasError
                  ? C.redPale
                  : C.bgSurface,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={16}
            color={focused ? C.goldMid : hasError ? C.red : C.inkMuted}
          />
        </View>
        <TextInput
          ref={inputRef}
          style={[st.fieldInput, fontsLoaded && { fontFamily: SERIF_REG }]}
          placeholder={placeholder}
          placeholderTextColor={C.inkMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType="next"
        />
        {isComplete && !hasError && (
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={C.green}
            style={{ marginRight: 12 }}
          />
        )}
        {hasError && (
          <Ionicons
            name="alert-circle"
            size={16}
            color={C.red}
            style={{ marginRight: 12 }}
          />
        )}
      </Animated.View>
      {hasError ? (
        <Text style={[st.fieldError, fontsLoaded && { fontFamily: SERIF_REG }]}>
          ⚠ {error}
        </Text>
      ) : hint ? (
        <Text style={[st.fieldHint, fontsLoaded && { fontFamily: SERIF_REG }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Step 1: Input Form ────────────────────────────────────────────────────────
function InputForm({ onGenerate, fontsLoaded }) {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [name, setName] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [dobError, setDobError] = useState(null);
  const [tobError, setTobError] = useState(null);

  const slideIn = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Refs for focus chaining
  const tobRef = useRef(null);
  const pobRef = useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideIn, {
        toValue: 0,
        speed: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── DOB masking handler ──────────────────────────────────────────────────────
  const handleDobChange = (raw) => {
    const formatted = formatDOB(raw);
    setDob(formatted);
    if (formatted.length === 10) {
      const err = validateDOB(formatted);
      setDobError(err);
      if (!err) tobRef.current?.focus();
    } else {
      setDobError(null);
    }
  };

  // ── TOB masking handler ──────────────────────────────────────────────────────
  const handleTobChange = (raw) => {
    const formatted = formatTOB(raw);
    setTob(formatted);
    if (formatted.length === 5) {
      const err = validateTOB(formatted);
      setTobError(err);
      if (!err) pobRef.current?.focus();
    } else {
      setTobError(null);
    }
  };

  const handlePobChange = (text) => {
    setPob(text);
    if (text.length >= 2) {
      const filtered = CITIES.filter((c) =>
        c.toLowerCase().startsWith(text.toLowerCase()),
      );
      setFilteredCities(filtered.slice(0, 5));
      setShowCities(filtered.length > 0);
    } else {
      setShowCities(false);
    }
  };

  const canGenerate =
    dob.length === 10 &&
    !dobError &&
    tob.length === 5 &&
    !tobError &&
    pob.length >= 3;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slideIn }] }}>
      {/* Hero intro */}
      <View style={st.formHero}>
        <LinearGradient
          colors={["#1A1060", "#2A2080", "#0D0B1A"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={st.formHeroGrad}
        >
          <View
            style={[
              st.orb,
              { width: 200, height: 200, top: -80, right: -60, opacity: 0.1 },
            ]}
          />
          <View
            style={[
              st.orb,
              { width: 100, height: 100, bottom: 0, left: 20, opacity: 0.07 },
            ]}
          />
          <MaterialCommunityIcons
            name="chart-donut"
            size={44}
            color={C.goldMid}
            style={{ marginBottom: 14, opacity: 0.9 }}
          />
          <Text
            style={[
              st.formHeroTitle,
              fontsLoaded && { fontFamily: SERIF_BOLD },
            ]}
          >
            Your Vedic Birth Chart
          </Text>
          <Text
            style={[st.formHeroSub, fontsLoaded && { fontFamily: SERIF_REG }]}
          >
            Enter your birth details below for a precise Kundli analysis powered
            by Jyotish Shastra
          </Text>
          <View style={st.formHeroTags}>
            {[
              "Lagna Chart",
              "Planet Positions",
              "Dasha Timeline",
              "AI Insights",
            ].map((t) => (
              <View key={t} style={st.formHeroTag}>
                <Ionicons name="checkmark-circle" size={10} color={C.green} />
                <Text
                  style={[
                    st.formHeroTagTxt,
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  {" "}
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Form */}
      <View style={st.formCard}>
        <LinearGradient colors={[C.bgCard, "#110F28"]} style={st.formCardGrad}>
          <View style={st.formCardTopLine} />

          <InputField
            label="Full Name"
            placeholder="e.g. Arjun Sharma"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            fontsLoaded={fontsLoaded}
            hint="Used for your personalised chart header"
          />

          {/* ── Date of Birth with auto-mask DD-MM-YYYY ── */}
          <InputField
            label="Date of Birth"
            placeholder="DD-MM-YYYY"
            value={dob}
            onChangeText={handleDobChange}
            icon="calendar-outline"
            keyboardType="number-pad"
            fontsLoaded={fontsLoaded}
            hint={
              !dobError ? "Digits only — auto-formatted to DD-MM-YYYY" : null
            }
            error={dobError}
            maxLength={10}
          />

          {/* ── Time of Birth with auto-mask HH:MM ── */}
          <InputField
            label="Time of Birth"
            placeholder="HH:MM  (24-hr)"
            value={tob}
            onChangeText={handleTobChange}
            icon="time-outline"
            keyboardType="number-pad"
            fontsLoaded={fontsLoaded}
            hint={
              !tobError
                ? "Digits only — auto-formatted to HH:MM (00:00 – 23:59)"
                : null
            }
            error={tobError}
            maxLength={5}
            inputRef={tobRef}
          />

          {/* Place of Birth with autocomplete */}
          <View style={st.fieldWrap}>
            <Text
              style={[st.fieldLabel, fontsLoaded && { fontFamily: SERIF_SEMI }]}
            >
              Place of Birth
            </Text>
            <View
              style={[
                st.fieldBox,
                {
                  borderColor: pob.length > 0 ? C.goldBorder : C.border,
                  backgroundColor: C.bgCard,
                },
              ]}
            >
              <View style={[st.fieldIcon, { backgroundColor: C.bgSurface }]}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={C.inkMuted}
                />
              </View>
              <TextInput
                ref={pobRef}
                style={[
                  st.fieldInput,
                  fontsLoaded && { fontFamily: SERIF_REG },
                ]}
                placeholder="e.g. Mumbai"
                placeholderTextColor={C.inkMuted}
                value={pob}
                onChangeText={handlePobChange}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {pob.length > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={C.green}
                  style={{ marginRight: 12 }}
                />
              )}
            </View>
            {showCities && (
              <View style={st.cityDropdown}>
                {filteredCities.map((city, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      st.cityItem,
                      i < filteredCities.length - 1 && {
                        borderBottomWidth: 0.5,
                        borderBottomColor: C.divider,
                      },
                    ]}
                    onPress={() => {
                      setPob(city);
                      setShowCities(false);
                      Keyboard.dismiss();
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="location"
                      size={12}
                      color={C.gold}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        st.cityTxt,
                        fontsLoaded && { fontFamily: SERIF_REG },
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text
              style={[st.fieldHint, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              City and state, India
            </Text>
          </View>

          {/* Generate button */}
          <PressScale
            style={[st.generateBtnWrap, !canGenerate && { opacity: 0.5 }]}
            onPress={() => canGenerate && onGenerate({ name, dob, tob, pob })}
          >
            <LinearGradient
              colors={
                canGenerate
                  ? [C.goldLight, C.goldMid, C.gold]
                  : [C.bgSurface, C.bgSurface]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={st.generateBtn}
            >
              <MaterialCommunityIcons
                name="chart-donut"
                size={18}
                color={canGenerate ? "#0D0B1A" : C.inkMuted}
              />
              <Text
                style={[
                  st.generateBtnTxt,
                  { color: canGenerate ? "#0D0B1A" : C.inkMuted },
                  fontsLoaded && { fontFamily: SERIF_BOLD },
                ]}
              >
                {"  "}Generate My Kundli
              </Text>
            </LinearGradient>
          </PressScale>

          <Text
            style={[st.privacyNote, fontsLoaded && { fontFamily: SERIF_REG }]}
          >
            🔒 Your birth data is private and never shared
          </Text>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

// ─── Step 2: Loading Animation (Fixed) ─────────────────────────────────────────
function KundliLoader({ onComplete, fontsLoaded }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const orbit1 = useRef(new Animated.Value(0)).current;
  const orbit2 = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.8)).current;
  const [statusIdx, setStatusIdx] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  const STATUSES = [
    "Calculating planetary positions…",
    "Computing Lagna from birth time…",
    "Mapping Nakshatra & Pada…",
    "Analysing house lord strengths…",
    "Generating Vimshottari Dasha…",
    "Crafting your AI Jyotish reading…",
    "Your Kundli is ready ✦",
  ];

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
    Animated.loop(
      Animated.timing(orbit1, {
        toValue: 1,
        duration: 3200,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
    Animated.loop(
      Animated.timing(orbit2, {
        toValue: 1,
        duration: 5600,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.8,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStatusIdx(i);
      if (i >= STATUSES.length - 1) {
        clearInterval(interval);
        setTimeout(onComplete, 900);
      }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const rotDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const orb1Deg = orbit1.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const orb2Deg = orbit2.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const ORBIT_R1 = 72,
    ORBIT_R2 = 110;

  return (
    <Animated.View style={[st.loaderWrap, { opacity }]}>
      <View style={st.loaderOrbitalWrap}>
        <View
          style={[
            st.loaderRing,
            {
              width: ORBIT_R2 * 2 + 20,
              height: ORBIT_R2 * 2 + 20,
              borderRadius: ORBIT_R2 + 10,
              borderColor: C.moonBorder,
            },
          ]}
        />
        <View
          style={[
            st.loaderRing,
            {
              width: ORBIT_R1 * 2 + 14,
              height: ORBIT_R1 * 2 + 14,
              borderRadius: ORBIT_R1 + 7,
              borderColor: C.goldBorder,
            },
          ]}
        />
        <Animated.View
          style={[st.loaderChartWrap, { transform: [{ rotate: rotDeg }] }]}
        >
          <LinearGradient
            colors={[C.bgCard, C.bgSurface]}
            style={st.loaderChart}
          >
            <View style={st.loaderChartInner}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={28}
                color={C.gold}
              />
            </View>
          </LinearGradient>
        </Animated.View>
        {/* Planet 1 - orbits clockwise */}
        <Animated.View
          style={[
            st.orbitPlanet,
            {
              transform: [
                { rotate: orb1Deg },
                { translateX: ORBIT_R1 },
                { rotate: orb1Deg }, // keep glyph orientation same as parent (no counter-rotation)
              ],
            },
          ]}
        >
          <LinearGradient colors={[C.goldLight, C.gold]} style={st.orbitDot}>
            <Text style={{ fontSize: 10 }}>☉</Text>
          </LinearGradient>
        </Animated.View>
        {/* Planet 2 - orbits clockwise at different speed */}
        <Animated.View
          style={[
            st.orbitPlanet,
            {
              transform: [
                { rotate: orb2Deg },
                { translateX: ORBIT_R2 },
                { rotate: orb2Deg },
              ],
            },
          ]}
        >
          <LinearGradient colors={[C.moonLight, C.moon]} style={st.orbitDot}>
            <Text style={{ fontSize: 10 }}>☽</Text>
          </LinearGradient>
        </Animated.View>
      </View>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Text
          style={[st.loaderTitle, fontsLoaded && { fontFamily: SERIF_BOLD }]}
        >
          Casting Your Kundli
        </Text>
      </Animated.View>
      <Text style={[st.loaderStatus, fontsLoaded && { fontFamily: SERIF_REG }]}>
        {STATUSES[Math.min(statusIdx, STATUSES.length - 1)]}
      </Text>
      <View style={st.loaderDots}>
        {STATUSES.map((_, i) => (
          <View
            key={i}
            style={[
              st.loaderDot,
              i <= statusIdx && {
                backgroundColor: C.gold,
                width: i === statusIdx ? 22 : 8,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// ─── North Indian Kundli Chart ─────────────────────────────────────────────────// ─── North Indian Kundli Chart (Fixed duplicate keys) ─────────────────────────
function NorthKundliChart({ kundli, fontsLoaded }) {
  const CHART_W = width - 32;
  const CELL_H = (CHART_W / 4) * 0.85;
  const DIAMOND_SIZE = CHART_W / 2 - 4;

  const housePlanets = Array.from({ length: 12 }, () => []);
  kundli.planetHouses.forEach((house, pi) => {
    housePlanets[(house - 1) % 12].push(pi);
  });

  const rows = [
    [10, 11, 12, 1],
    [9, -1, -1, 2],
    [8, -1, -1, 3],
    [7, 6, 5, 4],
  ];

  const renderCell = (house, rowIdx, colIdx) => {
    const uniqueKey = `${rowIdx}-${colIdx}`;
    if (house < 0) {
      return (
        <View
          key={uniqueKey}
          style={[
            ncs.cell,
            { flex: 1, borderColor: "transparent", minHeight: CELL_H },
          ]}
        />
      );
    }
    const hIdx = house - 1;
    const hSign = kundli.houseSign[hIdx];
    const isLagna = house === 1;
    const pls = housePlanets[hIdx];
    return (
      <View
        key={uniqueKey}
        style={[
          ncs.cell,
          { flex: 1, minHeight: CELL_H },
          isLagna && {
            backgroundColor: C.goldPale,
            borderColor: C.goldBorder + "99",
          },
        ]}
      >
        <Text
          style={[
            ncs.houseNum,
            fontsLoaded && { fontFamily: SERIF_BOLD },
            isLagna && { color: C.gold },
          ]}
        >
          {house}
          {isLagna ? " ↑" : ""}
        </Text>
        <Text style={[ncs.signGlyph, { color: isLagna ? C.goldMid : C.moon }]}>
          {SIGN_GLYPHS[hSign]}
        </Text>
        <Text
          style={[ncs.signName, fontsLoaded && { fontFamily: SERIF_REG }]}
          numberOfLines={1}
        >
          {SIGNS[hSign].slice(0, 3)}
        </Text>
        {pls.length > 0 && (
          <View style={ncs.planetWrap}>
            {pls.slice(0, 3).map((p, i) => (
              <Text
                key={i}
                style={[ncs.planetGlyph, { color: PLANET_COLORS[p] }]}
              >
                {PLANET_GLYPHS[p]}
                {kundli.planetRetrograde[p] ? "ᴿ" : ""}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[chartSt.wrap, { width: CHART_W }]}>
      {rows.map((row, ri) => (
        <View key={ri} style={chartSt.row}>
          {row.map((h, ci) => renderCell(h, ri, ci))}
        </View>
      ))}
      <View style={chartSt.centreOverlay} pointerEvents="none">
        <View
          style={[
            chartSt.diamond,
            { width: DIAMOND_SIZE, height: DIAMOND_SIZE },
          ]}
        >
          <LinearGradient
            colors={["#1A1060", "#2A2090", "#1A1060"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={chartSt.diamondGrad}
          >
            <MaterialCommunityIcons
              name="star-four-points"
              size={18}
              color={C.goldMid}
            />
            <Text
              style={[
                chartSt.lagnaLabel,
                fontsLoaded && { fontFamily: SERIF_BOLD },
              ]}
            >
              LAGNA
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const ncs = StyleSheet.create({
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  houseNum: {
    fontSize: 10,
    color: C.inkMuted,
    position: "absolute",
    top: 4,
    left: 5,
  },
  signGlyph: { fontSize: 16 },
  signName: { fontSize: 8, color: C.inkMuted, marginTop: 1 },
  planetWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
  },
  planetGlyph: { fontSize: 11 },
});

const chartSt = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: C.goldBorder,
    borderRadius: 4,
    backgroundColor: C.bgCard,
    overflow: "hidden",
    position: "relative",
  },
  row: { flexDirection: "row" },
  centreOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: { transform: [{ rotate: "45deg" }], overflow: "hidden" },
  diamondGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-45deg" }],
  },
  lagnaLabel: {
    fontSize: 9,
    color: C.goldLight,
    letterSpacing: 2,
    marginTop: 3,
  },
});

// ─── Planet Table ──────────────────────────────────────────────────────────────
function PlanetTable({ kundli, fontsLoaded }) {
  return (
    <View style={pt.wrap}>
      <View style={[pt.row, pt.headerRow]}>
        {["Planet", "Sign", "House", "Degree", "Str"].map((h, i) => (
          <Text
            key={i}
            style={[pt.headerTxt, fontsLoaded && { fontFamily: SERIF_SEMI }]}
          >
            {h}
          </Text>
        ))}
      </View>
      {PLANET_NAMES.map((name, pi) => {
        const sign = kundli.planetSigns[pi];
        const house = kundli.planetHouses[pi];
        const deg = kundli.planetDegrees[pi];
        const retro = kundli.planetRetrograde[pi];
        const strength = kundli.planetStrengths[pi];
        return (
          <View key={pi} style={[pt.row, pi % 2 === 0 && pt.rowAlt]}>
            <View style={pt.planetCell}>
              <Text style={{ color: PLANET_COLORS[pi], fontSize: 14 }}>
                {PLANET_GLYPHS[pi]}
              </Text>
              <Text
                style={[
                  pt.planetName,
                  fontsLoaded && { fontFamily: SERIF_SEMI },
                ]}
              >
                {" "}
                {name}
              </Text>
              {retro && (
                <Text
                  style={[
                    pt.retroBadge,
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  {" "}
                  ®
                </Text>
              )}
            </View>
            <Text
              style={[pt.cellTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {SIGN_GLYPHS[sign]} {SIGNS[sign].slice(0, 3)}
            </Text>
            <Text
              style={[pt.cellTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              H{house}
            </Text>
            <Text
              style={[
                pt.cellTxt,
                { color: C.inkMuted },
                fontsLoaded && { fontFamily: SERIF_REG },
              ]}
            >
              {deg}°
            </Text>
            <View style={pt.barWrap}>
              <View
                style={[
                  pt.bar,
                  { width: `${strength}%`, backgroundColor: PLANET_COLORS[pi] },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const pt = StyleSheet.create({
  wrap: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 4,
  },
  headerRow: { backgroundColor: C.bgSurface },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rowAlt: { backgroundColor: "rgba(255,255,255,0.015)" },
  headerTxt: { flex: 1, fontSize: 11, color: C.inkMuted, letterSpacing: 0.5 },
  planetCell: { flex: 1.4, flexDirection: "row", alignItems: "center" },
  planetName: { fontSize: 13, color: C.ink },
  retroBadge: { fontSize: 10, color: C.red },
  cellTxt: { flex: 1, fontSize: 12, color: C.inkMid },
  barWrap: {
    flex: 1,
    height: 5,
    backgroundColor: C.bgSurface,
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: { height: "100%", borderRadius: 3 },
});

// ─── Dasha Timeline ────────────────────────────────────────────────────────────
function DashaTimeline({ kundli, fontsLoaded, dob }) {
  // DOB is DD-MM-YYYY → parts[2] is year
  const parts = dob.split("-");
  const birthYear = parts.length === 3 ? parseInt(parts[2], 10) : 1990;
  let yr = birthYear;

  return (
    <View style={dt.wrap}>
      {DASHA_LORDS.map((lord, i) => {
        const piIdx = PLANETS.indexOf(lord);
        const color = piIdx >= 0 ? PLANET_COLORS[piIdx] : C.gold;
        const isCurrent = i === kundli.currentDashaIdx;
        const start = yr;
        yr += DASHA_YEARS[i];
        return (
          <View key={i} style={[dt.row, isCurrent && dt.rowCurrent]}>
            {isCurrent && (
              <LinearGradient
                colors={[color + "22", "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View
              style={[
                dt.lordbubble,
                { borderColor: color + "88", backgroundColor: color + "18" },
              ]}
            >
              <Text style={[dt.lordGlyph, { color }]}>
                {piIdx >= 0 ? PLANET_GLYPHS[piIdx] : "✦"}
              </Text>
            </View>
            <View style={dt.mid}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text
                  style={[
                    dt.lordName,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {PLANET_NAMES[piIdx >= 0 ? piIdx : 0]} Dasha
                </Text>
                {isCurrent && (
                  <View
                    style={[
                      dt.currentBadge,
                      {
                        backgroundColor: color + "22",
                        borderColor: color + "55",
                      },
                    ]}
                  >
                    <View style={[dt.currentDot, { backgroundColor: color }]} />
                    <Text
                      style={[
                        dt.currentTxt,
                        { color },
                        fontsLoaded && { fontFamily: SERIF_SEMI },
                      ]}
                    >
                      Current
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[dt.lordYears, fontsLoaded && { fontFamily: SERIF_REG }]}
              >
                {start} – {start + DASHA_YEARS[i]} · {DASHA_YEARS[i]} years
              </Text>
            </View>
            <Text
              style={[
                dt.yrsNum,
                { color: isCurrent ? color : C.inkMuted },
                fontsLoaded && { fontFamily: SERIF_BOLD },
              ]}
            >
              {DASHA_YEARS[i]}y
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const dt = StyleSheet.create({
  wrap: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
    position: "relative",
    overflow: "hidden",
  },
  rowCurrent: { borderColor: "transparent" },
  lordbubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lordGlyph: { fontSize: 18 },
  mid: { flex: 1 },
  lordName: { fontSize: 15, color: C.ink },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  currentDot: { width: 5, height: 5, borderRadius: 2.5 },
  currentTxt: { fontSize: 10 },
  lordYears: { fontSize: 11, color: C.inkMuted, marginTop: 2 },
  yrsNum: { fontSize: 14 },
});

// ─── Summary Cards ─────────────────────────────────────────────────────────────
function SummaryCards({ kundli, fontsLoaded }) {
  const items = [
    {
      label: "Lagna",
      value: SIGNS[kundli.lagnaSign],
      glyph: SIGN_GLYPHS[kundli.lagnaSign],
      color: C.goldMid,
      sub: "Ascendant",
    },
    {
      label: "Rashi",
      value: SIGNS[kundli.moonSign],
      glyph: SIGN_GLYPHS[kundli.moonSign],
      color: C.moonLight,
      sub: "Moon Sign",
    },
    {
      label: "Nakshatra",
      value: NAKSHATRAS[kundli.moonNak],
      glyph: "✦",
      color: C.green,
      sub: `Pada ${kundli.moonPada}`,
    },
    {
      label: "Sun Sign",
      value: SIGNS[kundli.sunSign],
      glyph: SIGN_GLYPHS[kundli.sunSign],
      color: C.goldLight,
      sub: "Surya Rashi",
    },
  ];
  return (
    <View style={sc.grid}>
      {items.map((item, i) => (
        <View key={i} style={[sc.card, { borderColor: item.color + "44" }]}>
          <LinearGradient
            colors={[item.color + "18", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
          <Text style={[sc.glyph, { color: item.color }]}>{item.glyph}</Text>
          <Text style={[sc.label, fontsLoaded && { fontFamily: SERIF_REG }]}>
            {item.label}
          </Text>
          <Text
            style={[sc.value, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            numberOfLines={1}
          >
            {item.value}
          </Text>
          <Text style={[sc.sub, fontsLoaded && { fontFamily: SERIF_REG }]}>
            {item.sub}
          </Text>
        </View>
      ))}
    </View>
  );
}

const sc = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    flex: 1,
    minWidth: "46%",
    borderRadius: 18,
    borderWidth: 0.5,
    padding: 16,
    alignItems: "center",
    backgroundColor: C.bgCard,
    overflow: "hidden",
    position: "relative",
  },
  glyph: { fontSize: 26, marginBottom: 6 },
  label: {
    fontSize: 10,
    color: C.inkMuted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  value: { fontSize: 16, color: C.ink, textAlign: "center" },
  sub: { fontSize: 10, color: C.inkMuted, marginTop: 2 },
});

// ─── Strength Bars ─────────────────────────────────────────────────────────────
function StrengthBars({ kundli, fontsLoaded }) {
  return (
    <View style={sb.wrap}>
      {PLANET_NAMES.map((name, pi) => {
        const str = kundli.planetStrengths[pi];
        const color = PLANET_COLORS[pi];
        const label = str >= 70 ? "Strong" : str >= 45 ? "Moderate" : "Weak";
        const labelColor = str >= 70 ? C.green : str >= 45 ? C.goldMid : C.red;
        return (
          <View key={pi} style={sb.row}>
            <Text style={[sb.glyph, { color }]}>{PLANET_GLYPHS[pi]}</Text>
            <Text style={[sb.name, fontsLoaded && { fontFamily: SERIF_SEMI }]}>
              {name}
            </Text>
            <View style={sb.barBg}>
              <LinearGradient
                colors={[color + "CC", color + "55"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[sb.bar, { width: `${str}%` }]}
              />
            </View>
            <View
              style={[
                sb.badge,
                {
                  backgroundColor: labelColor + "22",
                  borderColor: labelColor + "55",
                },
              ]}
            >
              <Text
                style={[
                  sb.badgeTxt,
                  { color: labelColor },
                  fontsLoaded && { fontFamily: SERIF_SEMI },
                ]}
              >
                {label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 11,
  },
  glyph: { fontSize: 15, width: 20, textAlign: "center" },
  name: { fontSize: 12, color: C.inkMid, width: 62 },
  barBg: {
    flex: 1,
    height: 7,
    backgroundColor: C.bgSurface,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: { height: "100%", borderRadius: 4 },
  badge: {
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeTxt: { fontSize: 10 },
});

// ─── AI Insight Section ────────────────────────────────────────────────────────
function AIInsightSection({ kundli, name, fontsLoaded }) {
  const insights = [
    {
      icon: "💼",
      title: "Career",
      body: `With ${SIGNS[kundli.lagnaSign]} rising, you carry a natural aptitude for leadership and structured achievement. ${
        kundli.planetStrengths[4] > 60
          ? "Jupiter's strength amplifies wisdom and growth in your profession."
          : "Mercury's placement favours communication-led careers."
      }`,
      color: C.goldMid,
    },
    {
      icon: "❤️",
      title: "Relationships",
      body: `Your Moon in ${SIGNS[kundli.moonSign]} suggests ${
        [
          "depth of emotion",
          "grounded loyalty",
          "playful warmth",
          "nurturing care",
        ][kundli.moonSign % 4]
      } in relationships. ${
        kundli.planetStrengths[5] > 60
          ? "Venus is dignified — partnerships flourish."
          : "Venus calls for patience in matters of the heart."
      }`,
      color: "#FF9ECC",
    },
    {
      icon: "🌿",
      title: "Health",
      body: `The ${
        kundli.planetStrengths[6] > 60
          ? "well-placed Saturn"
          : "challenged Saturn"
      } in your chart points to ${
        kundli.planetStrengths[6] > 60
          ? "strong structural health and longevity"
          : "a need for discipline in sleep and routine"
      }. Prioritise ${
        ["yoga", "pranayama", "meditation", "sattvic diet"][
          kundli.lagnaSign % 4
        ]
      }.`,
      color: C.green,
    },
    {
      icon: "🔮",
      title: "Spiritual Path",
      body: `${NAKSHATRAS[kundli.moonNak]} Nakshatra carries the energy of ${
        ["divine curiosity", "sacred devotion", "cosmic creativity"][
          kundli.moonNak % 3
        ]
      }. Your ${SIGNS[kundli.lagnaSign]} Lagna is guided by the path of dharmic action and inner truth.`,
      color: C.moonLight,
    },
  ];

  return (
    <View style={ai.wrap}>
      {insights.map((ins, i) => (
        <View key={i} style={[ai.card, { borderColor: ins.color + "33" }]}>
          <LinearGradient
            colors={[ins.color + "18", "transparent"]}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
          <View style={[ai.iconWrap, { backgroundColor: ins.color + "20" }]}>
            <Text style={{ fontSize: 20 }}>{ins.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                ai.title,
                { color: ins.color },
                fontsLoaded && { fontFamily: SERIF_BOLD },
              ]}
            >
              {ins.title}
            </Text>
            <Text style={[ai.body, fontsLoaded && { fontFamily: SERIF_REG }]}>
              {ins.body}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const ai = StyleSheet.create({
  wrap: { gap: 12 },
  card: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 0.5,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: { fontSize: 15, marginBottom: 5 },
  body: { fontSize: 13, color: C.inkMid, lineHeight: 20 },
});

// ─── Kundli Result Screen ──────────────────────────────────────────────────────
function KundliResult({ data, fontsLoaded, onReset }) {
  const { name, dob, tob, pob, kundli } = data;
  const [activeTab, setActiveTab] = useState("Chart");
  const slideIn = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const TABS = ["Chart", "Planets", "Dasha", "Insights"];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideIn, {
        toValue: 0,
        speed: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.ScrollView
      style={{ opacity }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View style={{ transform: [{ translateY: slideIn }] }}>
        {/* Header */}
        <View style={res.header}>
          <LinearGradient
            colors={["#1A1060", "#2A2080", "#0D0B1A"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={res.headerGrad}
          >
            <View
              style={[
                st.orb,
                {
                  width: 200,
                  height: 200,
                  top: -80,
                  right: -60,
                  opacity: 0.08,
                },
              ]}
            />
            <View style={res.headerTop}>
              <View>
                <Text
                  style={[
                    res.chartTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {name || "Your"}'s Kundli
                </Text>
                <Text
                  style={[
                    res.chartSub,
                    fontsLoaded && { fontFamily: SERIF_REG },
                  ]}
                >
                  {dob} · {tob} · {pob}
                </Text>
              </View>
              <TouchableOpacity style={res.shareBtn} activeOpacity={0.8}>
                <LinearGradient
                  colors={[C.goldLight, C.gold]}
                  style={res.shareBtnGrad}
                >
                  <Ionicons name="share-outline" size={15} color="#0D0B1A" />
                  <Text
                    style={[
                      res.shareBtnTxt,
                      fontsLoaded && { fontFamily: SERIF_BOLD },
                    ]}
                  >
                    {" "}
                    Share
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={res.badges}>
              {[
                {
                  label: "Lagna",
                  val: SIGNS[kundli.lagnaSign],
                  color: C.goldMid,
                },
                {
                  label: "Rashi",
                  val: SIGNS[kundli.moonSign],
                  color: C.moonLight,
                },
                {
                  label: "Nakshatra",
                  val: NAKSHATRAS[kundli.moonNak].split(" ")[0],
                  color: C.green,
                },
              ].map((b, i) => (
                <View
                  key={i}
                  style={[
                    res.badge,
                    {
                      borderColor: b.color + "55",
                      backgroundColor: b.color + "18",
                    },
                  ]}
                >
                  <Text
                    style={[
                      res.badgeLabel,
                      { color: b.color + "AA" },
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    {b.label} ·{" "}
                  </Text>
                  <Text
                    style={[
                      res.badgeVal,
                      { color: b.color },
                      fontsLoaded && { fontFamily: SERIF_BOLD },
                    ]}
                  >
                    {b.val}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Tab bar */}
        <View style={res.tabBar}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setActiveTab(t)}
              style={res.tabBtn}
              activeOpacity={0.8}
            >
              {activeTab === t && (
                <LinearGradient
                  colors={[C.goldMid + "22", C.gold + "0A"]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={20}
                />
              )}
              <Text
                style={[
                  res.tabTxt,
                  activeTab === t && { color: C.goldMid },
                  fontsLoaded && {
                    fontFamily: activeTab === t ? SERIF_SEMI : SERIF_REG,
                  },
                ]}
              >
                {t}
              </Text>
              {activeTab === t && <View style={res.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <View style={{ paddingHorizontal: 16 }}>
          {activeTab === "Chart" && (
            <View>
              <View style={res.secHeader}>
                <MaterialCommunityIcons
                  name="chart-donut"
                  size={14}
                  color={C.gold}
                />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  North Indian Birth Chart
                </Text>
              </View>
              <NorthKundliChart kundli={kundli} fontsLoaded={fontsLoaded} />
              <View style={{ height: 20 }} />
              <View style={res.secHeader}>
                <MaterialCommunityIcons
                  name="cards-diamond-outline"
                  size={14}
                  color={C.gold}
                />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  Key Signatures
                </Text>
              </View>
              <SummaryCards kundli={kundli} fontsLoaded={fontsLoaded} />
            </View>
          )}
          {activeTab === "Planets" && (
            <View>
              <View style={res.secHeader}>
                <MaterialCommunityIcons name="orbit" size={14} color={C.gold} />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  Planetary Positions
                </Text>
              </View>
              <PlanetTable kundli={kundli} fontsLoaded={fontsLoaded} />
              <View style={{ height: 20 }} />
              <View style={res.secHeader}>
                <MaterialCommunityIcons
                  name="battery-charging"
                  size={14}
                  color={C.gold}
                />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  Planetary Strengths
                </Text>
              </View>
              <StrengthBars kundli={kundli} fontsLoaded={fontsLoaded} />
            </View>
          )}
          {activeTab === "Dasha" && (
            <View>
              <View style={res.secHeader}>
                <MaterialCommunityIcons
                  name="timeline-clock-outline"
                  size={14}
                  color={C.gold}
                />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  Vimshottari Dasha Timeline
                </Text>
              </View>
              <View
                style={[
                  res.dashaBanner,
                  {
                    borderColor:
                      PLANET_COLORS[
                        PLANETS.indexOf(DASHA_LORDS[kundli.currentDashaIdx])
                      ] + "44",
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    PLANET_COLORS[
                      PLANETS.indexOf(DASHA_LORDS[kundli.currentDashaIdx])
                    ] + "22",
                    "transparent",
                  ]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={{ fontSize: 22 }}>
                  {
                    PLANET_GLYPHS[
                      PLANETS.indexOf(DASHA_LORDS[kundli.currentDashaIdx])
                    ]
                  }
                </Text>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={[
                      res.dashaTitle,
                      fontsLoaded && { fontFamily: SERIF_BOLD },
                    ]}
                  >
                    {
                      PLANET_NAMES[
                        PLANETS.indexOf(DASHA_LORDS[kundli.currentDashaIdx])
                      ]
                    }{" "}
                    Mahadasha
                  </Text>
                  <Text
                    style={[
                      res.dashaSub,
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    You are currently in your{" "}
                    {
                      PLANET_NAMES[
                        PLANETS.indexOf(DASHA_LORDS[kundli.currentDashaIdx])
                      ]
                    }{" "}
                    major period.
                  </Text>
                </View>
              </View>
              <View style={{ height: 14 }} />
              <DashaTimeline
                kundli={kundli}
                fontsLoaded={fontsLoaded}
                dob={dob}
              />
            </View>
          )}
          {activeTab === "Insights" && (
            <View>
              <View style={res.secHeader}>
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={14}
                  color={C.gold}
                />
                <Text
                  style={[
                    res.secTitle,
                    fontsLoaded && { fontFamily: SERIF_BOLD },
                  ]}
                >
                  {" "}
                  AI Jyotish Reading
                </Text>
              </View>
              <View style={res.aiTagLine}>
                <LinearGradient
                  colors={["rgba(123,127,232,0.5)", C.bgCard]}
                  style={res.aiTagGrad}
                >
                  <MaterialCommunityIcons
                    name="crystal-ball"
                    size={13}
                    color={C.moonLight}
                  />
                  <Text
                    style={[
                      res.aiTagTxt,
                      fontsLoaded && { fontFamily: SERIF_REG },
                    ]}
                  >
                    {"  "}Personalised analysis based on your exact Lagna,
                    Nakshatra & current Dasha
                  </Text>
                </LinearGradient>
              </View>
              <AIInsightSection
                kundli={kundli}
                name={name}
                fontsLoaded={fontsLoaded}
              />
            </View>
          )}

          <TouchableOpacity
            style={res.resetBtn}
            onPress={onReset}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={14} color={C.inkMuted} />
            <Text
              style={[res.resetTxt, fontsLoaded && { fontFamily: SERIF_REG }]}
            >
              {" "}
              Generate New Kundli
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}

const res = StyleSheet.create({
  header: { marginBottom: 0 },
  headerGrad: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 20,
    overflow: "hidden",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  chartTitle: { fontSize: 28, color: C.ink },
  chartSub: { fontSize: 12, color: C.inkMuted, marginTop: 3 },
  shareBtn: { borderRadius: 14, overflow: "hidden" },
  shareBtnGrad: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  shareBtnTxt: { color: "#0D0B1A", fontSize: 13 },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  badgeLabel: { fontSize: 11 },
  badgeVal: { fontSize: 11 },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
    backgroundColor: C.bgCard,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  tabTxt: { fontSize: 13, color: C.inkMuted },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 2,
    backgroundColor: C.goldMid,
    borderRadius: 1,
  },
  secHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  secTitle: { fontSize: 16, color: C.gold },
  dashaBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 16,
    padding: 16,
    backgroundColor: C.bgCard,
    overflow: "hidden",
    position: "relative",
  },
  dashaTitle: { fontSize: 17, color: C.ink },
  dashaSub: { fontSize: 12, color: C.inkMuted, marginTop: 3 },
  aiTagLine: { marginBottom: 14, borderRadius: 14, overflow: "hidden" },
  aiTagGrad: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
  },
  aiTagTxt: { fontSize: 12, color: C.moonLight, flex: 1 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  resetTxt: { fontSize: 13, color: C.inkMuted },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function KundliScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [resultData, setResultData] = useState(null);

  const handleGenerate = useCallback((formData) => {
    Keyboard.dismiss();
    const kundli = computeKundli(formData.dob, formData.tob, formData.pob);
    setResultData({ ...formData, kundli });
    setStep(1);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setStep(2);
  }, []);
  const handleReset = useCallback(() => {
    setResultData(null);
    setStep(0);
  }, []);

  return (
    // ── KeyboardAvoidingView wraps everything so inputs lift above the keyboard ──
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={[s.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={C.bg} />

        {/* Top Nav */}
        <View style={s.nav}>
          <TouchableOpacity
            onPress={() =>
              step > 0
                ? step === 1
                  ? null
                  : handleReset()
                : navigation?.goBack()
            }
            style={s.navBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color={C.ink} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={[s.navTitle, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {step === 0
                ? "Kundli Generator"
                : step === 1
                  ? "Generating…"
                  : "Your Kundli"}
            </Text>
            <Text style={[s.navSub, fontsLoaded && { fontFamily: SERIF_REG }]}>
              Vedic Birth Chart Analysis
            </Text>
          </View>
          <LinearGradient colors={[C.goldMid, C.gold]} style={s.navBadge}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={10}
              color="#0D0B1A"
            />
            <Text
              style={[s.navBadgeTxt, fontsLoaded && { fontFamily: SERIF_BOLD }]}
            >
              {" "}
              AI
            </Text>
          </LinearGradient>
        </View>

        {/* Step indicator */}
        {step < 2 && (
          <View style={s.stepWrap}>
            <StepIndicator step={step} fontsLoaded={fontsLoaded} />
          </View>
        )}

        {/* ── Step 0: Form — ScrollView with keyboard-aware settings ── */}
        {step === 0 && (
          <ScrollView
            style={s.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
          >
            <InputForm onGenerate={handleGenerate} fontsLoaded={fontsLoaded} />
          </ScrollView>
        )}

        {/* ── Step 1: Loader ── */}
        {step === 1 && (
          <View style={s.loaderContainer}>
            <KundliLoader
              onComplete={handleLoaderComplete}
              fontsLoaded={fontsLoaded}
            />
          </View>
        )}

        {/* ── Step 2: Result ── */}
        {step === 2 && resultData && (
          <View style={s.scroll}>
            <KundliResult
              data={resultData}
              fontsLoaded={fontsLoaded}
              onReset={handleReset}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
    gap: 12,
  },
  navBack: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { fontSize: 20, color: C.ink },
  navSub: { fontSize: 10, color: C.inkMuted, marginTop: 1, letterSpacing: 0.5 },
  navBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  navBadgeTxt: { fontSize: 11, color: "#0D0B1A" },
  stepWrap: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  scroll: { flex: 1 },
  loaderContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});

const st = StyleSheet.create({
  // Step indicator
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  stepItem: { alignItems: "center", gap: 6 },
  stepBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 12 },
  stepLabel: { fontSize: 10, color: C.inkMuted, letterSpacing: 0.5 },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
    marginBottom: 14,
    marginHorizontal: 4,
  },

  // Input field
  fieldWrap: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 13,
    color: C.inkMid,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  fieldIcon: {
    width: 44,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: C.divider,
  },
  fieldInput: {
    flex: 1,
    color: C.ink,
    fontSize: 15,
    paddingHorizontal: 14,
    height: 50,
  },
  fieldHint: { fontSize: 10, color: C.inkMuted, marginTop: 5, marginLeft: 4 },
  fieldError: { fontSize: 11, color: C.red, marginTop: 5, marginLeft: 4 },

  // City dropdown
  cityDropdown: {
    backgroundColor: C.bgSurface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    marginTop: 4,
    overflow: "hidden",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cityTxt: { fontSize: 13, color: C.inkMid },

  // Form hero
  formHero: { marginBottom: 0 },
  formHeroGrad: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  formHeroTitle: {
    fontSize: 34,
    color: C.ink,
    textAlign: "center",
    lineHeight: 38,
  },
  formHeroSub: {
    fontSize: 13,
    color: C.inkMuted,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 280,
  },
  formHeroTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
    justifyContent: "center",
  },
  formHeroTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.greenPale,
    borderWidth: 0.5,
    borderColor: C.greenBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  formHeroTagTxt: { fontSize: 11, color: C.inkMid },

  // Form card
  formCard: { overflow: "hidden" },
  formCardGrad: { padding: 20, paddingTop: 24 },
  formCardTopLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.gold,
    opacity: 0.3,
  },

  // Generate button
  generateBtnWrap: { borderRadius: 18, overflow: "hidden", marginTop: 6 },
  generateBtn: {
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnTxt: { fontSize: 17 },
  privacyNote: {
    fontSize: 11,
    color: C.inkMuted,
    textAlign: "center",
    marginTop: 12,
  },

  // Loader
  loaderWrap: { alignItems: "center", paddingHorizontal: 24 },
  loaderOrbitalWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  loaderRing: { position: "absolute", borderWidth: 1, borderStyle: "dashed" },
  loaderChartWrap: { position: "absolute" },
  loaderChart: {
    width: 84,
    height: 84,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderChartInner: { alignItems: "center", justifyContent: "center" },
  orbitPlanet: { position: "absolute" },
  orbitDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderTitle: {
    fontSize: 32,
    color: C.ink,
    textAlign: "center",
    marginBottom: 12,
  },
  loaderStatus: {
    fontSize: 14,
    color: C.inkMuted,
    textAlign: "center",
    minHeight: 22,
  },
  loaderDots: { flexDirection: "row", gap: 5, marginTop: 22 },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.bgSurface,
  },

  // Shared
  orb: { position: "absolute", borderRadius: 999, backgroundColor: "#FFFFFF" },
});
