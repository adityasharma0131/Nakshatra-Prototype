/**
 * Nakshatra — YogaScreen
 *
 * Design language: "Dark Celestial Luxury" — mirrors CalendarScreen / PanchangScreen
 * Yoga asana library with step-by-step illustrated guidance modal
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  StatusBar,
  Platform,
  Image,
  FlatList,
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

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",
  bgTray: "#110F26",

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

  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  shadow: "rgba(0,0,0,0.55)",
  overlay: "rgba(0,0,0,0.80)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all", label: "All", icon: "apps-outline" },
  { key: "beginner", label: "Beginner", icon: "leaf-outline" },
  { key: "standing", label: "Standing", icon: "body-outline" },
  { key: "seated", label: "Seated", icon: "person-outline" },
  { key: "inversion", label: "Inversion", icon: "arrow-up-outline" },
  { key: "balance", label: "Balance", icon: "fitness-outline" },
  { key: "restorative", label: "Restorative", icon: "moon-outline" },
];

// ─── Yoga Data ────────────────────────────────────────────────────────────────
// Using placeholder images from a reliable public CDN.
// Replace image URIs with your own assets or local requires in production.
const YOGA_DATA = [
  {
    id: "tadasana",
    name: "Tadasana",
    sanskrit: "ताड़ासन",
    english: "Mountain Pose",
    category: "beginner",
    level: "Beginner",
    duration: "30–60 sec",
    chakra: "Muladhara",
    benefit: "Grounding, posture alignment, mental stillness",
    color: C.green,
    colorPale: C.greenPale,
    colorBorder: C.greenBorder,
    glyph: "🏔️",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    description:
      "The foundational standing posture of yoga. Tadasana establishes the template for all standing asanas and cultivates awareness of body alignment from feet to crown.",
    steps: [
      {
        title: "Ground Your Feet",
        instruction:
          "Stand with feet together or hip-width apart. Press all four corners of each foot firmly into the earth. Spread your toes wide and feel the ground beneath you.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Activate the Legs",
        instruction:
          "Engage your thigh muscles, drawing them upward. Slightly tuck the tailbone and lengthen the lower spine. Feel the legs become pillars of earth energy.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Open the Chest",
        instruction:
          "Roll the shoulders back and down. Broaden the collarbones and let the arms hang naturally at your sides, palms facing forward with fingers relaxed.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Crown to Sky",
        instruction:
          "Lengthen the neck and imagine the crown of the head gently lifting toward the sky. Soften the face and jaw. Hold for 30–60 seconds with steady breath.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "30–60 sec",
      },
    ],
  },
  {
    id: "vrksasana",
    name: "Vrksasana",
    sanskrit: "वृक्षासन",
    english: "Tree Pose",
    category: "balance",
    level: "Beginner",
    duration: "30–60 sec each side",
    chakra: "Anahata",
    benefit: "Balance, concentration, hip opening",
    color: C.teal,
    colorPale: C.tealPale,
    colorBorder: C.tealBorder,
    glyph: "🌳",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80",
    description:
      "Vrksasana teaches stability rooted in stillness. Like a tree, the body learns to find balance in one direction while expanding in another — grounded below, open above.",
    steps: [
      {
        title: "Begin in Tadasana",
        instruction:
          "Stand tall in Mountain Pose. Fix your gaze (drishti) on a still point in front of you. This focal point will anchor your balance throughout the pose.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Root One Leg",
        instruction:
          "Shift your weight onto the right foot. Press firmly through all four corners. Engage the right thigh muscle to create a stable standing pillar.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Place the Foot",
        instruction:
          "Bend the left knee and place the left sole on the inner right thigh (above the knee) or inner calf (below the knee). Never place on the knee joint itself.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Grow the Branches",
        instruction:
          "Bring palms together at the heart in Anjali mudra, or stretch the arms overhead like branches reaching for light. Hold for 30–60 seconds, then repeat on the left side.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "30–60 sec",
      },
    ],
  },
  {
    id: "adho_mukha",
    name: "Adho Mukha Svanasana",
    sanskrit: "अधोमुख श्वानासन",
    english: "Downward-Facing Dog",
    category: "standing",
    level: "Beginner",
    duration: "1–3 min",
    chakra: "Vishuddha",
    benefit: "Full body stretch, calm nervous system, energise",
    color: C.gold,
    colorPale: C.goldPale,
    colorBorder: C.goldBorder,
    glyph: "🐕",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80",
    description:
      "One of yoga's most recognised poses, the Downward Dog simultaneously stretches and strengthens the entire body, inverts the head to calm the mind, and builds foundational upper-body strength.",
    steps: [
      {
        title: "Start on All Fours",
        instruction:
          "Begin on hands and knees (tabletop). Wrists are directly under shoulders, knees under hips. Spread fingers wide and press the base of each finger firmly down.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Tuck and Lift",
        instruction:
          "Curl the toes under. On an exhale, press the hands down and lift the knees off the floor. Initially keep the knees bent and back flat — focus on lengthening the spine first.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Lengthen the Spine",
        instruction:
          "Gradually straighten the legs (without locking the knees). Press the hips high and back. The body forms an inverted V-shape. Let the head hang freely between the arms.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Walk the Dog",
        instruction:
          "Pedal the heels alternately — bending one knee, then the other — to warm up the hamstrings. Then settle both heels toward the floor and hold the full pose.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "1–3 min",
      },
    ],
  },
  {
    id: "virabhadrasana_1",
    name: "Virabhadrasana I",
    sanskrit: "वीरभद्रासन I",
    english: "Warrior I",
    category: "standing",
    level: "Intermediate",
    duration: "30–60 sec each side",
    chakra: "Manipura",
    benefit: "Strength, courage, hip flexor stretch",
    color: C.amber,
    colorPale: C.amberPale,
    colorBorder: C.amberBorder,
    glyph: "⚔️",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    description:
      "Named after the mythic warrior Virabhadra born of Shiva's matted locks. This pose embodies the fierce grace of a warrior — powerful, focused, and deeply rooted in the earth.",
    steps: [
      {
        title: "Step into a Lunge",
        instruction:
          "From Tadasana, step the left foot back 3–4 feet. Turn the back foot out 45°. Square the hips toward the front of the mat by drawing the left hip forward.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Bend the Front Knee",
        instruction:
          "Bend the right knee directly over the right ankle — shin perpendicular to the floor. The back leg remains straight and strong, pressing firmly through the outer edge of the back foot.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Rise the Arms",
        instruction:
          "On an inhale, sweep both arms overhead with palms facing each other (or touching). Lift the chest, draw the shoulder blades together and down, and gaze up toward the hands.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Hold and Breathe",
        instruction:
          "Ground through the back heel. Breathe into the chest and belly. Feel the warrior's courage in your legs and the warrior's vision in your raised gaze. Hold, then switch sides.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "30–60 sec",
      },
    ],
  },
  {
    id: "trikonasana",
    name: "Trikonasana",
    sanskrit: "त्रिकोणासन",
    english: "Triangle Pose",
    category: "standing",
    level: "Beginner",
    duration: "30–60 sec each side",
    chakra: "Svadhisthana",
    benefit: "Side stretch, hip opening, spine elongation",
    color: C.pink,
    colorPale: C.pinkPale,
    colorBorder: C.pinkBorder,
    glyph: "△",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
    description:
      "Trikonasana creates three triangles in the body — a geometry of opening. It stretches the sides of the torso, strengthens the legs, and opens the chest toward the sky.",
    steps: [
      {
        title: "Wide-Leg Stance",
        instruction:
          "Stand with feet 3–4 feet apart. Turn the right foot out 90° and the left foot in slightly. Align the right heel with the arch of the left foot. Arms extend out to the sides at shoulder height.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Extend and Hinge",
        instruction:
          "On an exhale, extend the torso to the right — lengthening the right side of the waist. Do not collapse into the hip; reach long before going down.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Reach Down and Up",
        instruction:
          "Lower the right hand to the shin, ankle, or a block. Extend the left arm straight up, stacking the left shoulder over the right. Turn the gaze up to the left thumb.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Open and Hold",
        instruction:
          "Both sides of the torso remain long — do not crunch the lower side. Breathe into the chest and feel the heart rotating open toward the sky. Hold, then repeat on the left.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "30–60 sec",
      },
    ],
  },
  {
    id: "paschimottanasana",
    name: "Paschimottanasana",
    sanskrit: "पश्चिमोत्तानासन",
    english: "Seated Forward Bend",
    category: "seated",
    level: "Beginner",
    duration: "1–3 min",
    chakra: "Svadhisthana",
    benefit: "Calming, hamstring release, introspection",
    color: C.moon,
    colorPale: C.moonPale,
    colorBorder: C.moonBorder,
    glyph: "🌙",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    description:
      "Paschimottanasana folds the entire back of the body — paschima means 'west', the back of the body that faces the setting sun. This introspective pose cultivates surrender and deep release.",
    steps: [
      {
        title: "Sit in Dandasana",
        instruction:
          "Sit upright with legs extended straight in front. Flex the feet, pressing out through the heels. Press the hands into the floor beside the hips and lengthen the spine tall.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Inhale and Lengthen",
        instruction:
          "On an inhale, raise both arms overhead. Reach up through the fingertips and lengthen the entire torso from the pelvis to the crown. This creates the space needed to fold forward.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Inhale",
      },
      {
        title: "Exhale and Fold",
        instruction:
          "On an exhale, hinge at the hips (not the waist) and extend the chest forward and down toward the feet. Hold the feet, ankles, or shins — wherever you comfortably reach.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Soften and Surrender",
        instruction:
          "With each exhale, allow the belly to soften toward the thighs without forcing. Release the forehead toward the legs. Do not pull — invite. Stay for 1–3 minutes of deep, even breathing.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "1–3 min",
      },
    ],
  },
  {
    id: "sarvangasana",
    name: "Sarvangasana",
    sanskrit: "सर्वाङ्गासन",
    english: "Shoulder Stand",
    category: "inversion",
    level: "Intermediate",
    duration: "1–5 min",
    chakra: "Vishuddha",
    benefit: "Thyroid stimulation, calm mind, circulation",
    color: C.teal,
    colorPale: C.tealPale,
    colorBorder: C.tealBorder,
    glyph: "🕯️",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80",
    description:
      "Called the 'Queen of Asanas', Sarvangasana brings the entire body into inversion. It nourishes the thyroid, calms the nervous system, and reverses the downward pull of gravity on the organs.",
    steps: [
      {
        title: "Lie Down",
        instruction:
          "Lie flat on the back with legs extended and arms alongside the body, palms down. Take a few breaths to settle and relax the entire body before beginning.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Lift the Legs",
        instruction:
          "On an exhale, press the hands into the floor and swing both legs up toward the ceiling, lifting the hips. Use momentum gently — keep the movement controlled.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Support the Back",
        instruction:
          "Bend the elbows and place the hands on the upper back/lower back for support. Walk the elbows in toward each other. The body weight rests on the shoulders and upper arms — never the neck.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Extend to Full Pose",
        instruction:
          "Straighten the legs fully toward the ceiling. Point the toes to the sky. The body should form a straight line from shoulders to feet. Breathe slowly and hold for 1–5 minutes.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "1–5 min",
      },
    ],
  },
  {
    id: "savasana",
    name: "Savasana",
    sanskrit: "शवासन",
    english: "Corpse Pose",
    category: "restorative",
    level: "All Levels",
    duration: "5–15 min",
    chakra: "Sahasrara",
    benefit: "Deep rest, integration, stress release",
    color: C.moon,
    colorPale: C.moonPale,
    colorBorder: C.moonBorder,
    glyph: "✦",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    description:
      "Though it appears to be simply lying down, Savasana is considered among the most difficult of all asanas. It requires the complete release of effort and the surrender of the thinking mind into pure awareness.",
    steps: [
      {
        title: "Lie on Your Back",
        instruction:
          "Lie flat with legs slightly apart and arms 6–8 inches from the body, palms facing up. Gently close the eyes. Let the feet fall open naturally — do not hold any tension.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "Settle in",
      },
      {
        title: "Release the Body",
        instruction:
          "Systematically relax each part: feet, calves, thighs, abdomen, chest, hands, arms, shoulders, neck, face. With each exhale, consciously let go of any held tension.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "2–3 min",
      },
      {
        title: "Steady the Breath",
        instruction:
          "Allow the breath to become natural and effortless. Do not control it. Simply observe the rise and fall of the belly like gentle ocean waves. The mind becomes the witness.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "3–5 min",
      },
      {
        title: "Rest in Stillness",
        instruction:
          "Remain in complete stillness for 5–15 minutes. When thoughts arise, gently return attention to the breath without judgment. To exit, deepen the breath, wiggle fingers and toes, and roll to one side before rising.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "5–15 min",
      },
    ],
  },
  {
    id: "bakasana",
    name: "Bakasana",
    sanskrit: "बकासन",
    english: "Crow Pose",
    category: "balance",
    level: "Intermediate",
    duration: "10–30 sec",
    chakra: "Manipura",
    benefit: "Arm strength, focus, core activation",
    color: C.amber,
    colorPale: C.amberPale,
    colorBorder: C.amberBorder,
    glyph: "🦅",
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80",
    description:
      "Bakasana is the gateway to all arm balances. Named after the crane or crow, this pose demands concentration, core strength, and the willingness to lean into the unknown — the moment of surrender before flight.",
    steps: [
      {
        title: "Squat and Prepare",
        instruction:
          "Begin in a deep squat (Malasana). Place the hands flat on the floor, shoulder-width apart, fingers spread wide. Bend the elbows slightly — they will act as a shelf for your knees.",
        image:
          "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Rise on Tiptoe",
        instruction:
          "Rise onto the tiptoes and bring the knees to the backs of the upper arms (as high as possible toward the armpits). Gaze forward — a few inches in front of the hands.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Lean Forward",
        instruction:
          "Slowly shift the body weight forward into the hands. The feet will naturally lift. Engage the core strongly and hug the knees into the arms. Do not rush — find the tipping point.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Find the Float",
        instruction:
          "Once both feet lift, straighten the arms toward full extension (or keep slightly bent). Hold for 10–30 seconds, breathing steadily. To exit, lower the feet back to the floor with control.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "10–30 sec",
      },
    ],
  },
  {
    id: "balasana",
    name: "Balasana",
    sanskrit: "बालासन",
    english: "Child's Pose",
    category: "restorative",
    level: "Beginner",
    duration: "1–5 min",
    chakra: "Ajna",
    benefit: "Deep rest, back release, nervous system calm",
    color: C.green,
    colorPale: C.greenPale,
    colorBorder: C.greenBorder,
    glyph: "🌿",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=80",
    description:
      "Balasana is the pose of return — to the safety and simplicity of childhood. It is a resting pose, a reset between more demanding asanas, and a symbol of humility and self-compassion.",
    steps: [
      {
        title: "Begin on the Knees",
        instruction:
          "Kneel on the mat with the big toes touching and the knees either together or spread hip-width apart. Sit the hips back toward the heels and feel the weight release downward.",
        image:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
        duration: "Breathe 2×",
      },
      {
        title: "Fold Forward",
        instruction:
          "On an exhale, lower the torso forward between (or on top of) the thighs. Extend the arms long in front of you with palms facing down, or rest them alongside the body.",
        image:
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&q=80",
        duration: "Breathe 3×",
      },
      {
        title: "Rest the Forehead",
        instruction:
          "Allow the forehead to rest on the mat. If it does not reach, use a block or folded blanket. Let the weight of the skull drop fully — this activates the parasympathetic nervous system.",
        image:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=80",
        duration: "Breathe 5×",
      },
      {
        title: "Breathe into the Back",
        instruction:
          "With each inhale, feel the back body expand and rise. With each exhale, feel it soften. Stay for 1–5 minutes. This pose can be returned to at any time during practice when rest is needed.",
        image:
          "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=500&q=80",
        duration: "1–5 min",
      },
    ],
  },
];

// ─── Level Badge Color ──────────────────────────────────────────────────────────
function levelColor(level) {
  if (level === "Beginner") return C.green;
  if (level === "Intermediate") return C.amber;
  if (level === "Advanced") return C.pink;
  return C.moon;
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────
function TopNav({ fontsLoaded, navigation }) {
  return (
    <View style={tn.wrap}>
      <TouchableOpacity
        style={tn.backBtn}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={20} color={C.inkMid} />
      </TouchableOpacity>
      <View style={tn.center}>
        <Text style={[tn.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Yoga Sadhana
        </Text>
        <Text style={[tn.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Sacred Asana Practice
        </Text>
      </View>
      <TouchableOpacity style={tn.actionBtn} activeOpacity={0.8}>
        <Ionicons name="search-outline" size={18} color={C.inkMid} />
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center" },
  title: { fontSize: 20, color: C.ink },
  sub: { fontSize: 10.5, color: C.inkMuted, letterSpacing: 1, marginTop: 1 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner({ fontsLoaded }) {
  return (
    <LinearGradient colors={["#1C1A3A", C.bg]} style={hb.wrap}>
      <View style={hb.inner}>
        <View style={hb.badge}>
          <Text
            style={[hb.badgeTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            ॐ ASANA LIBRARY
          </Text>
        </View>
        <Text style={[hb.headline, fontsLoaded && { fontFamily: SERIF.bold }]}>
          The Body as{"\n"}Sacred Instrument
        </Text>
        <Text style={[hb.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          {YOGA_DATA.length} asanas · Step-by-step guidance
        </Text>
      </View>
      <View style={hb.statsRow}>
        {[
          { num: "10", label: "Asanas" },
          { num: "5", label: "Categories" },
          { num: "40+", label: "Steps" },
        ].map((s, i) => (
          <View key={i} style={hb.stat}>
            <Text
              style={[hb.statNum, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              {s.num}
            </Text>
            <Text
              style={[
                hb.statLabel,
                fontsLoaded && { fontFamily: SERIF.regular },
              ]}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}
const hb = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  inner: { marginBottom: 16 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeTxt: { fontSize: 10, color: C.gold, letterSpacing: 2 },
  headline: { fontSize: 30, color: C.ink, lineHeight: 34, marginBottom: 6 },
  sub: { fontSize: 13, color: C.inkMuted },
  statsRow: {
    flexDirection: "row",
    gap: 0,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: "hidden",
  },
  stat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRightWidth: 0.5,
    borderRightColor: C.border,
  },
  statNum: { fontSize: 20, color: C.goldMid },
  statLabel: {
    fontSize: 10.5,
    color: C.inkMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});

// ─── Category Filter ───────────────────────────────────────────────────────────
function CategoryFilter({ selected, onSelect, fontsLoaded }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={cf.scroll}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.key;
        return (
          <TouchableOpacity
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            style={[
              cf.pill,
              isActive && {
                backgroundColor: C.bgSurface,
                borderColor: C.moonBorder,
              },
            ]}
            activeOpacity={0.75}
          >
            <Ionicons
              name={cat.icon}
              size={13}
              color={isActive ? C.moonLight : C.inkMuted}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                cf.pillTxt,
                isActive && { color: C.inkMid },
                fontsLoaded && {
                  fontFamily: isActive ? SERIF.semiBold : SERIF.regular,
                },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
const cf = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
  },
  pillTxt: { fontSize: 12.5, color: C.inkMuted },
});

// ─── Yoga Card ────────────────────────────────────────────────────────────────
const CARD_WIDTH = (width - 48) / 2;

function YogaCard({ yoga, onPress, fontsLoaded }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const lvlColor = levelColor(yoga.level);

  return (
    <Animated.View style={[yc.outer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={() => onPress(yoga)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={yc.card}
      >
        {/* Image */}
        <View style={yc.imgWrap}>
          <Image
            source={{ uri: yoga.image }}
            style={yc.img}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", C.bgCard + "EE"]}
            style={yc.imgOverlay}
          />
          {/* Glyph badge */}
          <View
            style={[
              yc.glyphBadge,
              {
                backgroundColor: yoga.color + "30",
                borderColor: yoga.color + "60",
              },
            ]}
          >
            <Text style={yc.glyph}>{yoga.glyph}</Text>
          </View>
          {/* Level pill */}
          <View
            style={[
              yc.levelPill,
              {
                backgroundColor: lvlColor + "22",
                borderColor: lvlColor + "50",
              },
            ]}
          >
            <Text
              style={[
                yc.levelTxt,
                { color: lvlColor },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {yoga.level}
            </Text>
          </View>
        </View>

        {/* Body */}
        <LinearGradient
          colors={[yoga.color + "12", "transparent"]}
          style={yc.body}
        >
          <View style={[yc.accentBar, { backgroundColor: yoga.color }]} />
          <Text
            style={[yc.name, fontsLoaded && { fontFamily: SERIF.bold }]}
            numberOfLines={1}
          >
            {yoga.name}
          </Text>
          <Text
            style={[yc.english, fontsLoaded && { fontFamily: SERIF.regular }]}
            numberOfLines={1}
          >
            {yoga.english}
          </Text>
          <View style={yc.meta}>
            <Ionicons name="time-outline" size={10} color={C.inkMuted} />
            <Text
              style={[yc.metaTxt, fontsLoaded && { fontFamily: SERIF.regular }]}
            >
              {yoga.duration}
            </Text>
          </View>
          <View style={yc.stepsIndicator}>
            {yoga.steps.map((_, i) => (
              <View
                key={i}
                style={[yc.stepDot, { backgroundColor: yoga.color + "60" }]}
              />
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
const yc = StyleSheet.create({
  outer: { width: CARD_WIDTH },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  imgWrap: { width: "100%", height: CARD_WIDTH * 0.85, position: "relative" },
  img: { width: "100%", height: "100%" },
  imgOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  glyphBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: { fontSize: 16 },
  levelPill: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  levelTxt: { fontSize: 9.5 },
  body: {
    padding: 12,
    paddingTop: 10,
    position: "relative",
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  name: { fontSize: 15, color: C.ink, marginBottom: 2 },
  english: { fontSize: 11, color: C.inkMuted, marginBottom: 6 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 10, color: C.inkMuted },
  stepsIndicator: {
    flexDirection: "row",
    gap: 3,
    marginTop: 8,
  },
  stepDot: { width: 16, height: 3, borderRadius: 2 },
});

// ─── Step Modal ────────────────────────────────────────────────────────────────
function StepModal({ visible, yoga, onClose, fontsLoaded }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [activeStep, setActiveStep] = useState(0);
  const imgFadeAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (visible) {
      setActiveStep(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleStepChange = (idx) => {
    Animated.sequence([
      Animated.timing(imgFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(imgFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setActiveStep(idx);
  };

  if (!yoga) return null;

  const step = yoga.steps[activeStep];
  const lvlColor = levelColor(yoga.level);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
      animationType="none"
    >
      {/* Backdrop */}
      <Animated.View style={[sm.backdrop, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Tray */}
      <Animated.View
        style={[
          sm.tray,
          {
            transform: [{ translateY: slideAnim }],
            borderColor: yoga.color + "50",
          },
        ]}
      >
        <View style={sm.handle} />

        {/* Header */}
        <View style={sm.header}>
          <View style={sm.headerLeft}>
            <View
              style={[
                sm.glyphWrap,
                {
                  backgroundColor: yoga.color + "20",
                  borderColor: yoga.color + "40",
                },
              ]}
            >
              <Text style={sm.headerGlyph}>{yoga.glyph}</Text>
            </View>
            <View>
              <Text
                style={[sm.yogaName, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {yoga.name}
              </Text>
              <Text
                style={[
                  sm.yogaSanskrit,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                {yoga.sanskrit} · {yoga.english}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={sm.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={18} color={C.inkMid} />
          </TouchableOpacity>
        </View>

        {/* Gold shimmer line */}
        <LinearGradient
          colors={["transparent", yoga.color + "60", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={sm.shimmer}
        />

        {/* Info chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sm.chipsRow}
        >
          {[
            { icon: "body-outline", text: yoga.level, color: lvlColor },
            { icon: "time-outline", text: yoga.duration, color: C.gold },
            { icon: "flash-outline", text: yoga.chakra, color: yoga.color },
          ].map((chip, i) => (
            <View
              key={i}
              style={[
                sm.chip,
                {
                  backgroundColor: chip.color + "18",
                  borderColor: chip.color + "40",
                },
              ]}
            >
              <Ionicons name={chip.icon} size={12} color={chip.color} />
              <Text
                style={[
                  sm.chipTxt,
                  { color: chip.color },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                {chip.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Description */}
        <View style={sm.descWrap}>
          <Text style={[sm.desc, fontsLoaded && { fontFamily: SERIF.regular }]}>
            {yoga.description}
          </Text>
        </View>

        {/* Step heading */}
        <View style={sm.stepHeadRow}>
          <View
            style={[sm.stepHeadIcon, { backgroundColor: yoga.color + "20" }]}
          >
            <Ionicons name="footsteps-outline" size={14} color={yoga.color} />
          </View>
          <Text
            style={[sm.stepHeading, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            How to Practise
          </Text>
          <Text
            style={[
              sm.stepCounter,
              fontsLoaded && { fontFamily: SERIF.regular },
            ]}
          >
            {activeStep + 1} / {yoga.steps.length}
          </Text>
        </View>

        {/* Step tracker dots */}
        <View style={sm.trackerRow}>
          {yoga.steps.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleStepChange(i)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  sm.trackerDot,
                  {
                    backgroundColor: i <= activeStep ? yoga.color : C.bgSurface,
                    borderColor: yoga.color + "60",
                    width: i === activeStep ? 28 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Step card */}
        <ScrollView
          style={sm.scroll}
          contentContainerStyle={sm.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              sm.stepCard,
              { borderColor: yoga.color + "35", opacity: imgFadeAnim },
            ]}
          >
            <LinearGradient
              colors={[yoga.color + "15", "transparent"]}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <View style={[sm.stepAccent, { backgroundColor: yoga.color }]} />

            {/* Step image */}
            <View style={sm.stepImgWrap}>
              <Image
                source={{ uri: step.image }}
                style={sm.stepImg}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", C.bgTray + "CC"]}
                style={sm.stepImgGrad}
              />
              <View style={[sm.stepNumBadge, { backgroundColor: yoga.color }]}>
                <Text
                  style={[
                    sm.stepNumTxt,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  {activeStep + 1}
                </Text>
              </View>
              <View style={sm.stepDurationBadge}>
                <Ionicons name="time-outline" size={11} color={C.inkMid} />
                <Text
                  style={[
                    sm.stepDurationTxt,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {step.duration}
                </Text>
              </View>
            </View>

            {/* Step content */}
            <View style={sm.stepContent}>
              <Text
                style={[
                  sm.stepTitle,
                  { color: yoga.color },
                  fontsLoaded && { fontFamily: SERIF.bold },
                ]}
              >
                {step.title}
              </Text>
              <View
                style={[
                  sm.stepInstWrap,
                  { borderLeftColor: yoga.color + "60" },
                ]}
              >
                <Text
                  style={[
                    sm.stepInst,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {step.instruction}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Prev / Next navigation */}
          <View style={sm.navRow}>
            <TouchableOpacity
              style={[sm.navBtn, activeStep === 0 && sm.navBtnDisabled]}
              onPress={() => activeStep > 0 && handleStepChange(activeStep - 1)}
              activeOpacity={activeStep === 0 ? 1 : 0.8}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={activeStep === 0 ? C.inkMuted : C.inkMid}
              />
              <Text
                style={[
                  sm.navTxt,
                  activeStep === 0 && { color: C.inkMuted },
                  fontsLoaded && { fontFamily: SERIF.semiBold },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            {activeStep < yoga.steps.length - 1 ? (
              <TouchableOpacity
                style={[
                  sm.navBtnPrimary,
                  {
                    backgroundColor: yoga.color + "22",
                    borderColor: yoga.color + "60",
                  },
                ]}
                onPress={() => handleStepChange(activeStep + 1)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    sm.navTxtPrimary,
                    { color: yoga.color },
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  Next Step
                </Text>
                <Ionicons name="chevron-forward" size={18} color={yoga.color} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[sm.navBtnComplete, { backgroundColor: yoga.color }]}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark" size={16} color={C.bg} />
                <Text
                  style={[
                    sm.navTxtComplete,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                >
                  Complete
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
const sm = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: C.overlay },
  tray: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bgTray,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    maxHeight: height * 0.92,
    shadowColor: "rgba(123,127,232,0.30)",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 20,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.inkMuted,
    marginTop: 12,
    marginBottom: 4,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  glyphWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerGlyph: { fontSize: 22 },
  yogaName: { fontSize: 20, color: C.ink },
  yogaSanskrit: { fontSize: 11.5, color: C.inkMuted, marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.bgSurface,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  shimmer: { height: 1, marginHorizontal: 20, marginBottom: 12 },
  chipsRow: { paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  chipTxt: { fontSize: 11 },
  descWrap: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: C.bgCard,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 12,
  },
  desc: { fontSize: 13.5, color: C.inkMid, lineHeight: 21 },
  stepHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  stepHeadIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  stepHeading: { fontSize: 18, color: C.ink, flex: 1 },
  stepCounter: { fontSize: 12, color: C.inkMuted },
  trackerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  trackerDot: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 12 },
  stepCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    position: "relative",
  },
  stepAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    zIndex: 1,
  },
  stepImgWrap: { width: "100%", height: 210, position: "relative" },
  stepImg: { width: "100%", height: "100%" },
  stepImgGrad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  stepNumBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumTxt: { fontSize: 14, color: "#0D0B1A" },
  stepDurationBadge: {
    position: "absolute",
    bottom: 10,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(13,11,26,0.75)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepDurationTxt: { fontSize: 11, color: C.inkMid },
  stepContent: { padding: 16 },
  stepTitle: { fontSize: 18, marginBottom: 10 },
  stepInstWrap: {
    borderLeftWidth: 2,
    borderRadius: 1,
    paddingLeft: 12,
  },
  stepInst: { fontSize: 14.5, color: C.inkMid, lineHeight: 23 },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  navBtnDisabled: { opacity: 0.35 },
  navTxt: { fontSize: 14, color: C.inkMid },
  navBtnPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  navTxtPrimary: { fontSize: 15 },
  navBtnComplete: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  navTxtComplete: { fontSize: 15, color: "#0D0B1A" },
});

// ─── Grid Header ────────────────────────────────────────────────────────────────
function GridHeader({ count, fontsLoaded }) {
  return (
    <View style={gh.wrap}>
      <View style={gh.left}>
        <View style={gh.iconDot}>
          <Ionicons name="body-outline" size={13} color={C.moon} />
        </View>
        <Text style={[gh.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Asana Library
        </Text>
      </View>
      <View style={gh.countPill}>
        <Text style={[gh.count, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
          {count} poses
        </Text>
      </View>
    </View>
  );
}
const gh = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconDot: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: C.moonPale,
    borderWidth: 1,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, color: C.ink },
  countPill: {
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  count: { fontSize: 11.5, color: C.inkMuted },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function YogaScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filtered =
    selectedCategory === "all"
      ? YOGA_DATA
      : YOGA_DATA.filter((y) => y.category === selectedCategory);

  const handleOpenYoga = useCallback((yoga) => {
    setSelectedYoga(yoga);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} navigation={navigation} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={grid.row}
        contentContainerStyle={grid.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <HeroBanner fontsLoaded={fontsLoaded} />
            <CategoryFilter
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              fontsLoaded={fontsLoaded}
            />
            <GridHeader count={filtered.length} fontsLoaded={fontsLoaded} />
          </>
        }
        ListFooterComponent={<View style={{ height: 48 }} />}
        renderItem={({ item }) => (
          <YogaCard
            yoga={item}
            onPress={handleOpenYoga}
            fontsLoaded={fontsLoaded}
          />
        )}
      />

      <StepModal
        visible={modalVisible}
        yoga={selectedYoga}
        onClose={handleCloseModal}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}

const grid = StyleSheet.create({
  container: { paddingBottom: 16 },
  row: { paddingHorizontal: 16, gap: 16, marginBottom: 16 },
});
