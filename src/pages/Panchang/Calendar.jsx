/**
 * Nakshatra — CalendarScreen (Updated June 2026+)
 *
 * Design language: "Dark Celestial Luxury" — mirrors PanchangScreen
 * All events are from June 2026 onwards (current date: June 9, 2026)
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

  red: "#E84040",
  redPale: "rgba(232,64,64,0.14)",
  redBorder: "rgba(232,64,64,0.28)",

  amber: "#F59E0B",
  amberPale: "rgba(245,158,11,0.13)",
  amberBorder: "rgba(245,158,11,0.28)",

  teal: "#2DD4BF",
  tealPale: "rgba(45,212,191,0.12)",
  tealBorder: "rgba(45,212,191,0.25)",

  pink: "#E040A0",
  pinkPale: "rgba(224,64,160,0.14)",
  pinkBorder: "rgba(224,64,160,0.28)",

  border: "rgba(255,255,255,0.07)",
  divider: "rgba(255,255,255,0.06)",
  shadow: "rgba(0,0,0,0.55)",
  overlay: "rgba(0,0,0,0.72)",
};

const SERIF = {
  regular: "CormorantGaramond_400Regular",
  semiBold: "CormorantGaramond_600SemiBold",
  bold: "CormorantGaramond_700Bold",
};

// ─── Event Type Config ─────────────────────────────────────────────────────────
const EVENT_TYPE = {
  festival: { label: "Festival", color: C.teal },
  vrat: { label: "Vrat", color: C.moon },
  eclipse: { label: "Eclipse", color: C.pink },
  panchang: { label: "Panchang", color: C.gold },
  rahu: { label: "Rahu Kaal", color: C.red },
  choghadiya: { label: "Choghadiya", color: C.amber },
};

// ─── Event Database (June 2026 → April 2027) ──────────────────────────────────
const EVENTS = {
  // ══════════════════════════════════════════════════
  //  JUNE 2026
  // ══════════════════════════════════════════════════

  "2026-06-10": [
    {
      type: "panchang",
      label: "Panchami Tithi",
      sublabel: "5th Tithi · Jyeshtha Shukla Paksha",
      color: C.gold,
      glyph: "☽",
      detail:
        "Panchami tithi is auspicious for new beginnings and Naga worship. Wednesday (Budhvara) is governed by Mercury — ideal for communication, commerce, and learning.",
    },
    {
      type: "rahu",
      label: "Rahu Kaal",
      sublabel: "12:00 PM – 1:30 PM (Wednesday)",
      color: C.red,
      glyph: "⚠",
      detail:
        "Rahu Kaal for Wednesday falls between 12:00 PM and 1:30 PM. Avoid initiating contracts, travel, or puja during this window.",
    },
  ],

  "2026-06-15": [
    {
      type: "vrat",
      label: "Nirjala Ekadashi",
      sublabel: "Waterless fast — most sacred Ekadashi",
      color: C.moon,
      glyph: "🪔",
      detail:
        "The most significant of all Ekadashis. Nirjala means without water — devotees observe a complete fast without food or water from sunrise to the next day's sunrise. Worship Lord Vishnu with tulsi and yellow flowers. Recite Vishnu Sahasranama for maximum merit.",
    },
    {
      type: "panchang",
      label: "Ekadashi Tithi",
      sublabel: "Lord Vishnu · Jyeshtha Shukla",
      color: C.moon,
      glyph: "☽",
      detail:
        "Jyeshtha Shukla Ekadashi — one of the most powerful Ekadashis of the year. Ardra nakshatra brings deep transformation. Observe fast, night vigil, and Vishnu puja. Even partial fasting yields immense spiritual merit.",
    },
  ],

  "2026-06-17": [
    {
      type: "vrat",
      label: "Pradosh Vrat",
      sublabel: "Shiva worship at dusk · Trayodashi",
      color: C.gold,
      glyph: "🕉️",
      detail:
        "Pradosh Vrat on Trayodashi tithi. Perform Shiva puja during the twilight hour — approximately 90 minutes after sunset. Offer bilva leaves, milk, and white flowers. Chant Maha Mrityunjaya mantra 108 times for health and longevity.",
    },
    {
      type: "choghadiya",
      label: "Labh Choghadiya",
      sublabel: "10:51 AM – 12:27 PM — Business & learning",
      color: C.amber,
      glyph: "✦",
      detail:
        "Labh (profit) Choghadiya is highly auspicious for business dealings, signing agreements, and beginning new ventures. Start important tasks during this window for sustained prosperity.",
    },
  ],

  "2026-06-19": [
    {
      type: "festival",
      label: "Jyeshtha Purnima",
      sublabel: "Full Moon · Vata Savitri Vrat",
      color: C.green,
      glyph: "🌕",
      detail:
        "The sacred full moon of Jyeshtha month. Women observe Vata Savitri Vrat — worshipping the banyan tree and Savitri Devi for their husbands' longevity and well-being. Offer raw cotton, bangles, and sweets. Circle the banyan tree 108 times.",
    },
    {
      type: "panchang",
      label: "Purnima Tithi",
      sublabel: "Full Moon · Uttara Ashadha Nakshatra",
      color: C.green,
      glyph: "🌕",
      detail:
        "Jyeshtha Purnima with Uttara Ashadha nakshatra bestows universal acclaim and righteousness. An ideal day for Satyanarayan Vrat, charitable donations, and starting new spiritual practices.",
    },
    {
      type: "choghadiya",
      label: "Amrit Choghadiya",
      sublabel: "Sunrise slot — All activities favoured",
      color: C.teal,
      glyph: "✦",
      detail:
        "Amrit Choghadiya at sunrise on Purnima is exceptionally powerful. Begin the day with Vishnu puja, take a ritual bath at dawn, and light 108 diyas for maximum blessings.",
    },
  ],

  "2026-06-25": [
    {
      type: "vrat",
      label: "Sankashti Chaturthi",
      sublabel: "Ganesh fast · Moonrise puja",
      color: C.amber,
      glyph: "🐘",
      detail:
        "Monthly Sankashti Chaturthi fast dedicated to Lord Ganesha. Observe fast from sunrise. Perform elaborate puja after moonrise — sight the moon and offer modak, durva grass, and red flowers to Ganesha before breaking the fast.",
    },
  ],

  "2026-06-28": [
    {
      type: "vrat",
      label: "Yogini Ekadashi",
      sublabel: "Krishna Paksha · Remove all obstacles",
      color: C.moon,
      glyph: "🪔",
      detail:
        "Yogini Ekadashi of Jyeshtha Krishna Paksha is said to destroy past sins and grant liberation. Observe fast with complete devotion to Lord Vishnu. Reading the Yogini Ekadashi Katha is highly recommended for freeing ancestors from suffering.",
    },
    {
      type: "rahu",
      label: "Rahu Kaal",
      sublabel: "12:00 PM – 1:30 PM (Sunday)",
      color: C.red,
      glyph: "⚠",
      detail:
        "Rahu Kaal for Sunday: 4:30 PM – 6:00 PM. On Ekadashi, observe caution the entire afternoon and avoid all tamasic activities.",
    },
  ],

  "2026-06-30": [
    {
      type: "panchang",
      label: "Amavasya · Jyeshtha",
      sublabel: "New Moon · Ancestral offerings",
      color: C.inkMuted,
      glyph: "🌑",
      detail:
        "Jyeshtha Amavasya is significant for Pitru Tarpan — offering water and sesame seeds to ancestors. Visit a sacred river or tirtha for the ritual. Avoid auspicious ceremonies. Light sesame oil lamps in the evening for departed souls.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  JULY 2026
  // ══════════════════════════════════════════════════

  "2026-07-01": [
    {
      type: "panchang",
      label: "Ashadha Maas Begins",
      sublabel: "Sacred month · Pratipada Tithi",
      color: C.gold,
      glyph: "🕉️",
      detail:
        "Ashadha, the fourth month of the Hindu calendar, begins today. It is a spiritually charged month — home to Rath Yatra, Devshayani Ekadashi, and Guru Purnima. Begin daily Vishnu worship and Gita recitation throughout this month.",
    },
  ],

  "2026-07-07": [
    {
      type: "festival",
      label: "Jagannath Rath Yatra",
      sublabel: "Grand chariot procession",
      color: C.teal,
      glyph: "🎪",
      detail:
        "One of the grandest Hindu festivals — Lord Jagannath, Balabhadra, and Subhadra are taken out in massive wooden chariots. Pulling the chariot rope is considered immensely meritorious, equivalent to Ashvamedha Yagna. Observed grandly in Puri and across India.",
    },
    {
      type: "panchang",
      label: "Dwitiya · Ashadha Shukla",
      sublabel: "Punarvasu Nakshatra — auspicious travel",
      color: C.gold,
      glyph: "☽",
      detail:
        "Ashadha Shukla Dwitiya with Punarvasu nakshatra. Punarvasu, governed by Jupiter, is excellent for pilgrimage, spiritual travel, and seeking higher education. The energy of Rath Yatra amplifies all devotional activities today.",
    },
  ],

  "2026-07-10": [
    {
      type: "vrat",
      label: "Vinayaka Chaturthi",
      sublabel: "Monthly Ganesh Puja · Shukla Paksha",
      color: C.amber,
      glyph: "🐘",
      detail:
        "Shukla Chaturthi dedicated to Lord Ganesha. Worship with modak, durva grass, and red sandalwood paste. Recite Ganesh Atharvashirsha and Sankat Nashan Stotra for blessings, success, and removal of all obstacles in the coming month.",
    },
  ],

  "2026-07-12": [
    {
      type: "festival",
      label: "Devshayani Ekadashi",
      sublabel: "Vishnu's cosmic sleep begins · Chaturmas",
      color: C.green,
      glyph: "🌙",
      detail:
        "Lord Vishnu enters yogic slumber (yoga nidra) for four months — the Chaturmas period begins. No auspicious ceremonies like weddings, griha pravesh, or sacred thread ceremony are performed during Chaturmas. Observe fast, recite Vishnu Sahasranama, and keep night vigil.",
    },
    {
      type: "panchang",
      label: "Ekadashi · Ashadha Shukla",
      sublabel: "Vishnu Shayana · Uttara Phalguni",
      color: C.moon,
      glyph: "☽",
      detail:
        "The Ekadashi on which Vishnu reclines into cosmic sleep. Uttara Phalguni nakshatra brings grace and leadership. An exceptionally powerful Ekadashi — even partial fasting yields the merit of a full year's observance.",
    },
  ],

  "2026-07-17": [
    {
      type: "festival",
      label: "Ashadha Purnima",
      sublabel: "Full Moon of the sacred Ashadha month",
      color: C.green,
      glyph: "🌕",
      detail:
        "Ashadha Purnima is deeply auspicious. Perform Satyanarayan Vrat, offer milk to Vishnu, and light 108 ghee lamps. Bathing in sacred rivers today washes away accumulated karma. Also an ideal day for initiating Guru-disciple relationships.",
    },
  ],

  "2026-07-23": [
    {
      type: "festival",
      label: "Guru Purnima",
      sublabel: "Honour teachers & spiritual lineage",
      color: C.goldLight,
      glyph: "🌟",
      detail:
        "Guru Purnima honours Maharshi Veda Vyasa, who compiled the Vedas and Puranas. Express deep gratitude to your teachers and spiritual guides. Offer flowers, sandalwood paste, and perform pada puja. A guru's blessings on this day are multiplied thousandfold.",
    },
    {
      type: "panchang",
      label: "Purnima · Ashadha",
      sublabel: "Vyasa Puja · Shravana Nakshatra",
      color: C.goldLight,
      glyph: "🌕",
      detail:
        "Guru Purnima with Shravana nakshatra — the star of listening and learning. Shravana, the ear of the cosmos, amplifies the transmission of wisdom from teacher to student. Begin a new study, scripture reading, or meditation practice today.",
    },
  ],

  "2026-07-27": [
    {
      type: "vrat",
      label: "Sankashti Chaturthi",
      sublabel: "Angaraki Chaturthi — most powerful",
      color: C.amber,
      glyph: "🐘",
      detail:
        "When Sankashti falls on a Tuesday (Mangalvara), it becomes Angaraki Chaturthi — the most powerful of all monthly Chaturthi fasts. Observe strict fast, perform elaborate Ganesha puja after moonrise, and offer 21 modaks. Immense merit for overcoming life's obstacles.",
    },
  ],

  "2026-07-28": [
    {
      type: "vrat",
      label: "Kamika Ekadashi",
      sublabel: "Krishna Paksha · Liberation from sins",
      color: C.moon,
      glyph: "🪔",
      detail:
        "Kamika Ekadashi of Ashadha Krishna Paksha. Fasting on this day is said to equal bathing in all sacred rivers. Worship Vishnu with tulsi leaves — offering even a single tulsi leaf on Kamika Ekadashi is equivalent to donating gold. Observe night vigil with bhajans.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  AUGUST 2026
  // ══════════════════════════════════════════════════

  "2026-08-01": [
    {
      type: "panchang",
      label: "Shravan Maas Begins",
      sublabel: "Holiest month of Shiva",
      color: C.moon,
      glyph: "🕉️",
      detail:
        "Shravan (Sawan), the holiest month dedicated to Lord Shiva, begins today. Every Monday (Shravan Somvar) is especially sacred. Offer water, bilva leaves, and milk to Shivaling daily. Observe fast every Monday. Chant Om Namah Shivaya 108 times each morning throughout the month.",
    },
  ],

  "2026-08-07": [
    {
      type: "festival",
      label: "Nag Panchami",
      sublabel: "Serpent worship · Shravan Shukla Panchami",
      color: C.green,
      glyph: "🐍",
      detail:
        "Nag Panchami is dedicated to serpent deities — Ananta, Vasuki, Shesha, and others. Offer milk, flowers, and turmeric to snake images. Worship Nag Devata to remove Kaal Sarp Dosha and receive protection from snake-related fears and karmic debts.",
    },
  ],

  "2026-08-11": [
    {
      type: "vrat",
      label: "Putrada Ekadashi",
      sublabel: "Blesses couples seeking children",
      color: C.moon,
      glyph: "🪔",
      detail:
        "Putrada Ekadashi of Shravan Shukla Paksha bestows the boon of progeny. Couples longing for children observe this fast with utmost devotion. Worship Vishnu with yellow flowers and chant Santaan Gopala mantra 108 times. Observe strict fast from the previous night's sunset.",
    },
  ],

  "2026-08-14": [
    {
      type: "festival",
      label: "Raksha Bandhan",
      sublabel: "Sacred thread of protection · Shravan Purnima",
      color: C.pink,
      glyph: "🪢",
      detail:
        "Sisters tie the sacred rakhi on brothers' wrists as a bond of love and protection. Brothers offer gifts and vow to protect their sisters. Apply sandalwood tilak, perform the full rakhi ritual, and share sweets. In coastal Maharashtra, this is also Narali Purnima — fishermen offer coconuts to the sea.",
    },
    {
      type: "festival",
      label: "Shravan Purnima",
      sublabel: "Full Moon · Narali Purnima",
      color: C.green,
      glyph: "🌕",
      detail:
        "The full moon of the holy Shravan month. Bathe at dawn, offer arghya to the moon, and perform Satyanarayan Vrat. Coastal communities celebrate Narali Purnima — the end of the monsoon fishing ban — with coconut offerings to the sea god Varuna.",
    },
  ],

  "2026-08-19": [
    {
      type: "festival",
      label: "Janmashtami",
      sublabel: "Birth of Lord Krishna · Rohini Nakshatra",
      color: C.teal,
      glyph: "🦚",
      detail:
        "Janmashtami celebrates the divine birth of Lord Krishna at the stroke of midnight. Observe fast throughout the day. Decorate a cradle for baby Krishna with flowers and jewels. Perform abhishek with panchamrit at midnight. Sing bhajans and perform Raasleela. Break fast after the midnight puja.",
    },
    {
      type: "panchang",
      label: "Ashtami · Krishna Paksha",
      sublabel: "Rohini Nakshatra · Birth configuration",
      color: C.teal,
      glyph: "☽",
      detail:
        "The sacred conjunction of Ashtami tithi with Rohini nakshatra — the precise astronomical configuration at the moment of Krishna's birth. This alignment amplifies the potency of all devotional activities and prayers offered today.",
    },
  ],

  "2026-08-20": [
    {
      type: "festival",
      label: "Nandotsav",
      sublabel: "Dahi Handi — celebrate Krishna's birth",
      color: C.teal,
      glyph: "🎉",
      detail:
        "The day Nanda Maharaj celebrated Krishna's birth. Communities observe Dahi Handi — young men form human pyramids to break a pot of curd hung high, symbolising Krishna's mischievous love for butter. A day of joyous community celebration, music, and dancing.",
    },
  ],

  "2026-08-29": [
    {
      type: "festival",
      label: "Ganesh Chaturthi",
      sublabel: "10-day festival begins — Ganesha's arrival",
      color: C.amber,
      glyph: "🐘",
      detail:
        "The grand arrival of Lord Ganesha! Install Ganesha idol at home or community pandal. Perform Pranapratishtha puja at the auspicious muhurta. Offer 21 modaks, durva grass, red flowers, and sindoor. Chant Ganpati Atharvashirsha. The 10-day festival culminates with visarjan on Anant Chaturdashi.",
    },
    {
      type: "panchang",
      label: "Bhadrapada Shukla Chaturthi",
      sublabel: "Hasta Nakshatra · Most auspicious",
      color: C.amber,
      glyph: "☽",
      detail:
        "Bhadrapada Shukla Chaturthi with Hasta nakshatra is the most auspicious configuration for Ganesh installation. Hasta, meaning 'hand', symbolises skill, craft, and manifesting desires — perfectly embodying Ganesha as the granter of boons.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  SEPTEMBER 2026
  // ══════════════════════════════════════════════════

  "2026-09-07": [
    {
      type: "festival",
      label: "Anant Chaturdashi",
      sublabel: "Ganesh Visarjan — 10th day immersion",
      color: C.amber,
      glyph: "🌊",
      detail:
        "The 10th and final day of Ganesh Chaturthi. Lord Ganesha idols are carried in grand processions with music and dancing to water bodies for visarjan (immersion). Chant 'Ganpati Bappa Morya, Pudhchya Varshi Lavkar Ya!' — the immersion symbolises Ganesha's return to Mount Kailash.",
    },
  ],

  "2026-09-14": [
    {
      type: "festival",
      label: "Pitru Paksha Begins",
      sublabel: "16-day ancestral reverence period",
      color: C.inkMuted,
      glyph: "🌑",
      detail:
        "Pitru Paksha, the sacred 16-day period for honouring ancestors, begins today. Perform Shradh rituals daily — offer water, sesame seeds, and food (pinda) to departed ancestors. Visit sacred rivers for tarpan. This period is essential for clearing ancestral karmic debts.",
    },
  ],

  "2026-09-22": [
    {
      type: "festival",
      label: "Sharada Navratri Begins",
      sublabel: "Nine nights of Goddess Durga",
      color: C.pink,
      glyph: "🌺",
      detail:
        "The most important Navratri of the year begins. Nine forms of Goddess Durga are worshipped over nine nights. Day 1: Shailputri — offer red flowers and kumkum. Perform Ghatasthapana at the auspicious muhurta — sow seeds of barley as a symbol of new beginnings and abundance.",
    },
  ],

  "2026-09-26": [
    {
      type: "eclipse",
      label: "Chandra Grahan",
      sublabel: "Partial Lunar Eclipse · Visible in India",
      color: C.moon,
      glyph: "🌑",
      detail:
        "Partial lunar eclipse — magnitude 0.78. Visible across India from 10:45 PM to 2:30 AM. Begin fast 9 hours before the eclipse starts. Avoid eating cooked food during eclipse. After the eclipse ends, take a ritual bath, change clothes, and donate sesame seeds and black cloth to remove inauspicious effects.",
    },
    {
      type: "panchang",
      label: "Purnima · Bhadrapada",
      sublabel: "Eclipse on full moon — spiritually potent",
      color: C.moon,
      glyph: "🌕",
      detail:
        "A lunar eclipse on Purnima is a rare and intensely spiritually charged event. Mantra japa, meditation, and ancestral offerings performed during this period are multiplied manifold in potency. Avoid sleeping during the eclipse.",
    },
  ],

  "2026-09-29": [
    {
      type: "festival",
      label: "Maha Ashtami",
      sublabel: "Day 7 of Navratri · Mahagauri",
      color: C.pink,
      glyph: "⚔️",
      detail:
        "Maha Ashtami is one of the most powerful days of Navratri. Worship Mahagauri — the radiant white form of Durga symbolising purity and grace. Perform Kumari Puja — ritually worship young girls as embodiments of the goddess. Offer white flowers, coconut, and paneer sweets.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  OCTOBER 2026
  // ══════════════════════════════════════════════════

  "2026-10-01": [
    {
      type: "festival",
      label: "Maha Navami",
      sublabel: "Day 9 of Navratri · Siddhidatri",
      color: C.pink,
      glyph: "🏹",
      detail:
        "Maha Navami, the final day of Navratri worship. Honour Siddhidatri — the granter of all supernatural powers and siddhis. Perform Navami Havan (fire ritual) for world peace and personal fulfilment. Conclude with Kanya Puja — feeding nine young girls representing Navadurga.",
    },
  ],

  "2026-10-02": [
    {
      type: "festival",
      label: "Vijayadashami / Dussehra",
      sublabel: "Victory of Dharma · Burn Ravana",
      color: C.goldLight,
      glyph: "🏆",
      detail:
        "Vijayadashami celebrates the victory of Lord Rama over Ravana and Goddess Durga over Mahishasura — the eternal triumph of righteousness over evil. Burn Ravana effigies, perform Shastra Puja (weapon worship), and exchange Shami leaves as the herb of victory. The most auspicious day to start any new venture.",
    },
  ],

  "2026-10-10": [
    {
      type: "eclipse",
      label: "Surya Grahan",
      sublabel: "Annular Solar Eclipse · Partial in India",
      color: C.gold,
      glyph: "🌞",
      detail:
        "Annular solar eclipse — magnitude 0.93. Partially visible in southern India. The eclipse begins at 2:15 PM IST. Observe fast from sunrise. Avoid looking at the sun with the naked eye. Chant Aditya Hridayam during the eclipse. Perform Surya puja at sunrise the following morning.",
    },
  ],

  "2026-10-20": [
    {
      type: "festival",
      label: "Dhanteras",
      sublabel: "Prosperity day · Buy gold & silver",
      color: C.goldMid,
      glyph: "💰",
      detail:
        "Dhanteras marks the opening of the Diwali festival. Worship Lord Dhanvantari (divine physician) and Goddess Lakshmi. Purchasing gold, silver, utensils, or new electronics is considered deeply auspicious for attracting year-round prosperity. Light the first oil diya of the Diwali season at sunset.",
    },
    {
      type: "rahu",
      label: "Rahu Kaal",
      sublabel: "7:30 AM – 9:00 AM (Tuesday)",
      color: C.red,
      glyph: "⚠",
      detail:
        "Rahu Kaal for Tuesday: 3:00 PM – 4:30 PM. Avoid purchasing gold or making major investments during this window on Dhanteras.",
    },
  ],

  "2026-10-21": [
    {
      type: "festival",
      label: "Choti Diwali / Narak Chaturdashi",
      sublabel: "Evil vanquished · Oil bath before dawn",
      color: C.amber,
      glyph: "🪔",
      detail:
        "Lord Krishna destroyed the demon Narakasura on this day, liberating 16,000 captive souls. Take a ritual oil bath before sunrise (Abhyanga Snan) — applying sesame oil before bathing is considered auspicious. Light diyas at dusk. In some regions, this day is observed as Kali Puja.",
    },
  ],

  "2026-10-22": [
    {
      type: "festival",
      label: "Diwali",
      sublabel: "Festival of Lights · Lakshmi Puja",
      color: C.goldLight,
      glyph: "✨",
      detail:
        "The grandest Hindu festival! Illuminate your home with diyas, candles, and rangoli. Perform Lakshmi Puja at the auspicious evening muhurta — invite the goddess of wealth and prosperity. Offer lotus flowers, sweets, and dhatura. Celebrate with family, share mithai, and light fireworks to drive away darkness.",
    },
    {
      type: "panchang",
      label: "Amavasya · Ashwin",
      sublabel: "Lakshmi Puja Muhurta · Swati Nakshatra",
      color: C.goldLight,
      glyph: "🌑",
      detail:
        "Diwali Amavasya — the new moon ideal for Lakshmi worship. Swati nakshatra, ruled by Vayu (wind), spreads the light of Lakshmi to every corner of the home. Pradosh Kaal (sunset + 2 hrs) is the prime muhurta for the main puja.",
    },
  ],

  "2026-10-24": [
    {
      type: "festival",
      label: "Govardhan Puja / Annakut",
      sublabel: "Worship of Mount Govardhan",
      color: C.green,
      glyph: "🏔️",
      detail:
        "Govardhan Puja celebrates Krishna lifting Mount Govardhan on his little finger to protect Vrindavan from Indra's wrath. Create a symbolic Govardhan hill from cow dung and decorate with flowers. Prepare Annakut (mountain of 56 food items) as an offering to Krishna.",
    },
  ],

  "2026-10-25": [
    {
      type: "festival",
      label: "Bhai Dooj",
      sublabel: "Sisters bless brothers · Yama Dwitiya",
      color: C.moon,
      glyph: "👫",
      detail:
        "Bhai Dooj (also Bhai Tika) celebrates the sacred sibling bond. Sisters perform the tika ceremony — applying vermilion, rice, and flowers on brothers' foreheads and praying for their long life. Brothers offer gifts and vow lifelong protection. Associated with Yama and Yamuna's reunion.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  NOVEMBER 2026
  // ══════════════════════════════════════════════════

  "2026-11-03": [
    {
      type: "festival",
      label: "Chhath Puja",
      sublabel: "Sunset arghya — Sun worship begins",
      color: C.goldLight,
      glyph: "☀️",
      detail:
        "The main day of the 4-day Chhath Puja sun worship festival. Devotees (vrati) stand waist-deep in water bodies and offer arghya (sacred water offering) to the setting sun. This rigorous fast — without food or water for 36 hours — honours Chhathi Maiya and Surya Dev for health, prosperity, and children.",
    },
  ],

  "2026-11-08": [
    {
      type: "festival",
      label: "Kartik Purnima",
      sublabel: "Dev Diwali · Most sacred Purnima of year",
      color: C.goldLight,
      glyph: "🌕",
      detail:
        "Kartik Purnima is called Dev Diwali — the festival of lights of the Gods themselves. Light 108 diyas at the Tulsi plant or riverbank. Bathing in sacred rivers (especially Varanasi ghats) destroys all accumulated sins. Also marks the end of Chaturmas — auspicious ceremonies like weddings can resume from today.",
    },
  ],

  "2026-11-22": [
    {
      type: "vrat",
      label: "Utpanna Ekadashi",
      sublabel: "Origin of Ekadashi · Krishna Paksha",
      color: C.moon,
      glyph: "🪔",
      detail:
        "Utpanna Ekadashi commemorates the day the deity Ekadashi emerged from Vishnu's body to defeat the demon Mura. This Ekadashi is the most important among all as it represents the origin of the Ekadashi tradition. Observe strict fast and read the Utpanna Ekadashi Katha.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  DECEMBER 2026
  // ══════════════════════════════════════════════════

  "2026-12-05": [
    {
      type: "festival",
      label: "Vivah Panchami",
      sublabel: "Divine wedding of Rama and Sita",
      color: C.pink,
      glyph: "💍",
      detail:
        "Vivah Panchami commemorates the celestial wedding of Lord Rama and Goddess Sita in Mithila. This is considered the most auspicious day for weddings and engagements. Read Balakanda of Ramayana and celebrate with devotional music and Ram-Sita images adorned with flowers.",
    },
  ],

  "2026-12-17": [
    {
      type: "festival",
      label: "Gita Jayanti",
      sublabel: "Bhagavad Gita spoken by Krishna",
      color: C.teal,
      glyph: "📿",
      detail:
        "Gita Jayanti marks the day Lord Krishna imparted the eternal wisdom of the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. Read or recite all 18 chapters of the Gita, attend discourses, and meditate on its teachings of Dharma, Karma, and Moksha.",
    },
    {
      type: "vrat",
      label: "Mokshada Ekadashi",
      sublabel: "Liberation Ekadashi · Most powerful",
      color: C.moon,
      glyph: "🪔",
      detail:
        "Mokshada Ekadashi is the most potent among all Shukla Paksha Ekadashis. Fasting on this day grants liberation (moksha) to departed ancestors. Observe complete fast, recite Gita chapters, perform Vishnu puja, and donate food to brahmins for maximum ancestral benefit.",
    },
  ],

  "2026-12-21": [
    {
      type: "panchang",
      label: "Winter Solstice",
      sublabel: "Shortest day · Dakshinayana ends",
      color: C.moon,
      glyph: "❄️",
      detail:
        "The winter solstice marks the end of Dakshinayana (sun's southward journey) and the beginning of Uttarayana — the sun turns northward towards Mount Meru. Perform Surya worship at sunrise and light oil lamps in the evening to welcome the returning light.",
    },
  ],

  "2026-12-25": [
    {
      type: "festival",
      label: "Christmas",
      sublabel: "Festival of peace & joy",
      color: C.green,
      glyph: "⭐",
      detail:
        "Christmas is joyfully celebrated across India as a festival of giving, community, and peace. Many spiritual centres hold inter-faith prayer services embodying the principle of Vasudhaiva Kutumbakam — the world is one family. Exchange gifts and spread goodwill.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  JANUARY 2027
  // ══════════════════════════════════════════════════

  "2027-01-01": [
    {
      type: "panchang",
      label: "New Year 2027",
      sublabel: "Gregorian New Year · Fresh beginnings",
      color: C.goldLight,
      glyph: "🎆",
      detail:
        "Welcome the new Gregorian year with positive intentions. Perform Surya Namaskar at sunrise, recite your chosen deity's name 108 times, and set spiritual and personal intentions for the year. Light a ghee lamp and offer flowers to your ishta devata.",
    },
  ],

  "2027-01-14": [
    {
      type: "festival",
      label: "Makar Sankranti",
      sublabel: "Sun enters Capricorn · Uttarayana",
      color: C.goldLight,
      glyph: "🪁",
      detail:
        "Makar Sankranti marks the sun's entry into Capricorn — the auspicious start of Uttarayana. Fly kites to celebrate the returning sun, take holy dips in rivers, donate sesame-jaggery (til-gul), and eat til-gul laddoos. In Gujarat it's Uttarayan, in Punjab Lohri, in Tamil Nadu Pongal — one sun, many celebrations.",
    },
    {
      type: "festival",
      label: "Pongal",
      sublabel: "Tamil harvest festival",
      color: C.amber,
      glyph: "🌾",
      detail:
        "Pongal is the Tamil harvest festival celebrating abundance and gratitude to the sun, earth, and cattle. Cook the ceremonial Pongal rice dish in a new clay pot until it overflows — a symbol of overflowing prosperity. Draw kolam at the entrance and offer sugarcane, bananas, and coconut.",
    },
  ],

  "2027-01-26": [
    {
      type: "festival",
      label: "Republic Day",
      sublabel: "India's Constitution · 77th anniversary",
      color: C.teal,
      glyph: "🇮🇳",
      detail:
        "India's Republic Day marks the 77th anniversary of the Constitution's adoption on 26 January 1950. Grand parades at Kartavya Path in New Delhi. Perform Saraswati puja for knowledge and wisdom. A day to celebrate India's democratic values and constitutional spirit.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  FEBRUARY 2027
  // ══════════════════════════════════════════════════

  "2027-02-05": [
    {
      type: "festival",
      label: "Basant Panchami",
      sublabel: "Saraswati Puja · Spring begins",
      color: C.goldLight,
      glyph: "🌼",
      detail:
        "Basant Panchami marks the arrival of spring and is dedicated to Goddess Saraswati — patron of learning, arts, and wisdom. Students place their books before Saraswati for blessings. Wear yellow (the colour of mustard blossoms). Start new learning, music, or artistic pursuits today.",
    },
  ],

  "2027-02-17": [
    {
      type: "festival",
      label: "Maha Shivaratri",
      sublabel: "The great night of Shiva · Most sacred",
      color: C.moon,
      glyph: "🕉️",
      detail:
        "Maha Shivaratri is the most sacred night dedicated to Lord Shiva — the night when Shiva performed his cosmic Tandava dance. Observe fast throughout the day. Perform puja in four watches of the night with water, milk, curd, honey, ghee, and bhasmam. Stay awake chanting Om Namah Shivaya. Break fast at sunrise.",
    },
    {
      type: "panchang",
      label: "Chaturdashi · Krishna Paksha",
      sublabel: "Phalguna · Ardra Nakshatra",
      color: C.moon,
      glyph: "☽",
      detail:
        "The Chaturdashi of Krishna Paksha in Phalguna with Ardra nakshatra — the most spiritually potent configuration for Shiva worship. Ardra, the star of Shiva's third eye, connects directly to Rudra's transformative consciousness. Night puja during the four praharas is especially recommended.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  MARCH 2027
  // ══════════════════════════════════════════════════

  "2027-03-03": [
    {
      type: "festival",
      label: "Holi",
      sublabel: "Festival of colours · Spring celebration",
      color: C.pink,
      glyph: "🎨",
      detail:
        "Holi celebrates the victory of devotion over evil (Prahlad over Hiranyakashipu) and the joyous love of Radha-Krishna. The previous night, Holika Dahan purifies with sacred fire — circle it three times and offer coconut. Next morning, play with organic gulal colours, sing Holi songs, and celebrate with gujiya and thandai.",
    },
    {
      type: "panchang",
      label: "Purnima · Phalguna",
      sublabel: "Holi Purnima · Purva Phalguni Nakshatra",
      color: C.pink,
      glyph: "🌕",
      detail:
        "Phalguna Purnima with Purva Phalguni nakshatra — governed by Venus, radiating love, joy, and creative abundance. The perfect cosmic backdrop for Holi's explosion of colour and celebration.",
    },
  ],

  "2027-03-19": [
    {
      type: "festival",
      label: "Ugadi / Gudi Padwa",
      sublabel: "Hindu New Year · Chaitra Pratipada",
      color: C.green,
      glyph: "🌿",
      detail:
        "Ugadi (Telugu & Kannada) and Gudi Padwa (Maharashtra) usher in the Hindu New Year on Chaitra Shukla Pratipada. In Maharashtra, hoist the Gudi flag — bamboo with silk cloth, a pot, and neem. Eat Bevu-Bella (neem-jaggery) representing life's sweet-bitter balance. Begin new ventures, accounts, and projects today.",
    },
  ],

  "2027-03-30": [
    {
      type: "festival",
      label: "Ram Navami",
      sublabel: "Birth of Lord Rama · Chaitra Shukla Navami",
      color: C.gold,
      glyph: "🏹",
      detail:
        "Ram Navami celebrates the birth of Lord Rama — the seventh avatar of Vishnu — at noon on Chaitra Shukla Navami. Observe fast, perform Ram Puja with lotus flowers, and recite Ramcharitmanas. The time of Ram's birth (Abhijit Muhurta — midday) is the most auspicious moment for worship.",
    },
  ],

  // ══════════════════════════════════════════════════
  //  APRIL 2027
  // ══════════════════════════════════════════════════

  "2027-04-06": [
    {
      type: "festival",
      label: "Hanuman Jayanti",
      sublabel: "Birth of Lord Hanuman · Chaitra Purnima",
      color: C.amber,
      glyph: "🐒",
      detail:
        "Hanuman Jayanti celebrates the birth of the mighty Hanuman — the devotee par excellence. Recite Hanuman Chalisa 11 or 108 times. Offer sindoor, jasmine garland, and til-oil lamp. Performing Sundarkand recitation brings immense protection, courage, and removal of fear and obstacles.",
    },
  ],
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
          Sacred Calendar
        </Text>
        <Text style={[tn.sub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Festivals · Vrats · Eclipses
        </Text>
      </View>
      <TouchableOpacity style={tn.shareBtn} activeOpacity={0.8}>
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
  shareBtn: {
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

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend({ fontsLoaded }) {
  return (
    <View style={lg.wrap}>
      {Object.entries(EVENT_TYPE).map(([key, cfg]) => (
        <View key={key} style={lg.item}>
          <View style={[lg.dot, { backgroundColor: cfg.color }]} />
          <Text
            style={[lg.label, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            {cfg.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
const lg = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 11, color: C.inkMuted },
});

// ─── Month Navigator ──────────────────────────────────────────────────────────
function MonthNav({ year, month, onPrev, onNext, fontsLoaded }) {
  return (
    <View style={mn.wrap}>
      <TouchableOpacity style={mn.btn} onPress={onPrev} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={20} color={C.inkMid} />
      </TouchableOpacity>
      <View style={mn.center}>
        <Text style={[mn.month, fontsLoaded && { fontFamily: SERIF.bold }]}>
          {MONTHS[month]}
        </Text>
        <Text style={[mn.year, fontsLoaded && { fontFamily: SERIF.regular }]}>
          {year}
        </Text>
      </View>
      <TouchableOpacity style={mn.btn} onPress={onNext} activeOpacity={0.7}>
        <Ionicons name="chevron-forward" size={20} color={C.inkMid} />
      </TouchableOpacity>
    </View>
  );
}
const mn = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center" },
  month: { fontSize: 26, color: C.ink, lineHeight: 30 },
  year: { fontSize: 12, color: C.inkMuted, letterSpacing: 1.5, marginTop: 1 },
});

// ─── Calendar Grid ────────────────────────────────────────────────────────────
function CalendarGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  fontsLoaded,
}) {
  const today = new Date();
  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const CELL_SIZE = Math.floor((width - 32) / 7);

  return (
    <View style={cg.wrap}>
      <View style={cg.headerRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={i} style={[cg.headerCell, { width: CELL_SIZE }]}>
            <Text
              style={[
                cg.headerTxt,
                i === 0 && { color: C.red },
                i === 6 && { color: C.moon },
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, ri) => (
        <View key={ri} style={cg.row}>
          {cells.slice(ri * 7, ri * 7 + 7).map((day, ci) => {
            if (!day)
              return <View key={ci} style={[cg.cell, { width: CELL_SIZE }]} />;

            const key = dateKey(year, month, day);
            const events = EVENTS[key] || [];
            const isToday = key === todayKey;
            const isSelected = selectedDate === key;
            const isPast = key < todayKey;
            const isSunday = ci === 0;
            const isSaturday = ci === 6;
            const hasEclipse = events.some((e) => e.type === "eclipse");

            const dotColors = hasEclipse
              ? [
                  C.pink,
                  ...[
                    ...new Map(
                      events
                        .filter((e) => e.type !== "eclipse")
                        .map((e) => [e.type, e.color]),
                    ).values(),
                  ],
                ].slice(0, 3)
              : [
                  ...new Map(events.map((e) => [e.type, e.color])).values(),
                ].slice(0, 3);

            return (
              <TouchableOpacity
                key={ci}
                style={[cg.cell, { width: CELL_SIZE }]}
                onPress={() => onSelectDate(key, events)}
                activeOpacity={0.75}
              >
                {isToday && (
                  <LinearGradient
                    colors={[C.goldMid + "55", C.gold + "22"]}
                    style={[
                      cg.todayRing,
                      { width: CELL_SIZE - 4, height: CELL_SIZE - 4 },
                    ]}
                  />
                )}
                {isSelected && !isToday && (
                  <View
                    style={[
                      cg.selectedFill,
                      { width: CELL_SIZE - 4, height: CELL_SIZE - 4 },
                    ]}
                  />
                )}
                {hasEclipse && (
                  <View
                    style={[
                      cg.eclipseGlow,
                      { width: CELL_SIZE - 4, height: CELL_SIZE - 4 },
                    ]}
                  />
                )}

                <Text
                  style={[
                    cg.dayTxt,
                    isPast && { opacity: 0.35 },
                    isToday && { color: C.goldMid, opacity: 1 },
                    isSelected && !isToday && { color: C.ink, opacity: 1 },
                    isSunday &&
                      !isToday &&
                      !isSelected && { color: C.red + "CC" },
                    isSaturday &&
                      !isToday &&
                      !isSelected && { color: C.moon + "CC" },
                    hasEclipse && !isToday && { color: C.pink, opacity: 1 },
                    fontsLoaded && {
                      fontFamily:
                        isToday || isSelected ? SERIF.bold : SERIF.regular,
                    },
                  ]}
                >
                  {day}
                </Text>

                {dotColors.length > 0 && (
                  <View style={[cg.dots, isPast && { opacity: 0.3 }]}>
                    {dotColors.map((c, di) => (
                      <View key={di} style={[cg.dot, { backgroundColor: c }]} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
const cg = StyleSheet.create({
  wrap: { paddingHorizontal: 16 },
  headerRow: { flexDirection: "row", marginBottom: 4 },
  headerCell: { alignItems: "center", paddingVertical: 6 },
  headerTxt: { fontSize: 11, color: C.inkMuted, letterSpacing: 0.5 },
  row: { flexDirection: "row" },
  cell: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  todayRing: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.goldMid,
  },
  selectedFill: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: C.bgSurface,
    borderWidth: 1,
    borderColor: C.moonBorder,
  },
  eclipseGlow: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: C.pink + "18",
  },
  dayTxt: { fontSize: 15, color: C.inkMuted },
  dots: {
    position: "absolute",
    bottom: 4,
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
  dot: { width: 4, height: 4, borderRadius: 2 },
});

// ─── Upcoming Events Strip ─────────────────────────────────────────────────────
function UpcomingStrip({ fontsLoaded, onSelectDate }) {
  const today = new Date();
  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const upcoming = Object.entries(EVENTS)
    .filter(([k]) => k >= todayKey)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 12)
    .flatMap(([k, evs]) => evs.map((e) => ({ ...e, dateKey: k })));

  return (
    <View style={us.wrap}>
      <View style={us.header}>
        <View style={us.headerLeft}>
          <View style={us.iconDot}>
            <Ionicons name="calendar-outline" size={13} color={C.gold} />
          </View>
          <Text style={[us.title, fontsLoaded && { fontFamily: SERIF.bold }]}>
            Upcoming
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={us.scroll}
      >
        {upcoming.map((ev, i) => {
          const d = new Date(ev.dateKey + "T00:00:00");
          const dayNum = d.getDate();
          const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
            d.getDay()
          ];
          const mon = MONTHS[d.getMonth()].slice(0, 3);
          return (
            <TouchableOpacity
              key={i}
              style={us.card}
              activeOpacity={0.82}
              onPress={() => onSelectDate(ev.dateKey, EVENTS[ev.dateKey] || [])}
            >
              <LinearGradient
                colors={[ev.color + "22", "transparent"]}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
              <View style={[us.cardAccent, { backgroundColor: ev.color }]} />
              <View style={[us.dateChip, { borderColor: ev.color + "50" }]}>
                <Text
                  style={[
                    us.dateNum,
                    fontsLoaded && { fontFamily: SERIF.bold },
                    { color: ev.color },
                  ]}
                >
                  {dayNum}
                </Text>
                <Text
                  style={[
                    us.dateMon,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {mon}
                </Text>
                <Text
                  style={[
                    us.dateDay,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {dayName}
                </Text>
              </View>
              <View style={us.cardBody}>
                <Text style={us.glyph}>{ev.glyph}</Text>
                <Text
                  style={[
                    us.evLabel,
                    fontsLoaded && { fontFamily: SERIF.bold },
                  ]}
                  numberOfLines={1}
                >
                  {ev.label}
                </Text>
                <Text
                  style={[
                    us.evSub,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                  numberOfLines={2}
                >
                  {ev.sublabel}
                </Text>
                <View
                  style={[
                    us.typePill,
                    {
                      backgroundColor: ev.color + "20",
                      borderColor: ev.color + "40",
                    },
                  ]}
                >
                  <Text
                    style={[
                      us.typeTxt,
                      { color: ev.color },
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                    ]}
                  >
                    {EVENT_TYPE[ev.type]?.label}
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
const us = StyleSheet.create({
  wrap: { marginTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconDot: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: C.goldPale,
    borderWidth: 1,
    borderColor: C.goldBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, color: C.ink },
  scroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
  card: {
    width: 160,
    borderRadius: 16,
    padding: 14,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    gap: 8,
    overflow: "hidden",
    position: "relative",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  dateChip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    backgroundColor: C.bgSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
  },
  dateNum: { fontSize: 18, lineHeight: 20 },
  dateMon: { fontSize: 11, color: C.inkMuted },
  dateDay: { fontSize: 10, color: C.inkMuted },
  cardBody: { gap: 4 },
  glyph: { fontSize: 20 },
  evLabel: { fontSize: 14, color: C.ink },
  evSub: { fontSize: 11.5, color: C.inkMuted, lineHeight: 16 },
  typePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    marginTop: 2,
  },
  typeTxt: { fontSize: 10.5 },
});

// ─── Bottom Tray ───────────────────────────────────────────────────────────────
function BottomTray({ visible, dateKey: dk, events, onClose, fontsLoaded }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
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

  if (!dk) return null;

  const d = new Date(dk + "T00:00:00");
  const dayNum = d.getDate();
  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][d.getDay()];
  const monFull = MONTHS[d.getMonth()];
  const yr = d.getFullYear();

  const today = new Date();
  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const isToday = dk === todayKey;
  const hasEclipse = events.some((e) => e.type === "eclipse");

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[bt.backdrop, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        style={[
          bt.tray,
          { transform: [{ translateY: slideAnim }] },
          hasEclipse && { borderColor: C.pinkBorder },
        ]}
      >
        <View style={bt.handle} />

        <View style={bt.dateHeader}>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={[bt.dayNum, fontsLoaded && { fontFamily: SERIF.bold }]}
              >
                {dayNum}
              </Text>
              <View>
                <Text
                  style={[
                    bt.monthYear,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {monFull} {yr}
                </Text>
                <Text
                  style={[
                    bt.dayName,
                    fontsLoaded && { fontFamily: SERIF.regular },
                  ]}
                >
                  {dayName}
                </Text>
              </View>
              {isToday && (
                <View style={bt.todayBadge}>
                  <Text
                    style={[
                      bt.todayTxt,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    TODAY
                  </Text>
                </View>
              )}
              {hasEclipse && (
                <View style={bt.eclipseBadge}>
                  <Text
                    style={[
                      bt.eclipseTxt,
                      fontsLoaded && { fontFamily: SERIF.bold },
                    ]}
                  >
                    GRAHAN
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={bt.closeBtn}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={18} color={C.inkMid} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[
            "transparent",
            hasEclipse ? C.pinkBorder : C.goldBorder,
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={bt.shimmer}
        />

        <ScrollView
          style={bt.scroll}
          contentContainerStyle={bt.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {events.length === 0 ? (
            <View style={bt.emptyWrap}>
              <Text style={bt.emptyGlyph}>✧</Text>
              <Text
                style={[
                  bt.emptyTxt,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                No events on this date
              </Text>
              <Text
                style={[
                  bt.emptySub,
                  fontsLoaded && { fontFamily: SERIF.regular },
                ]}
              >
                An ordinary, peaceful day.
              </Text>
            </View>
          ) : (
            events.map((ev, i) => (
              <View
                key={i}
                style={[bt.evCard, { borderColor: ev.color + "35" }]}
              >
                <LinearGradient
                  colors={[ev.color + "18", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={18}
                />
                <View style={[bt.evAccent, { backgroundColor: ev.color }]} />
                <View style={bt.evHeader}>
                  <View
                    style={[
                      bt.evGlyphWrap,
                      {
                        backgroundColor: ev.color + "20",
                        borderColor: ev.color + "40",
                      },
                    ]}
                  >
                    <Text style={bt.evGlyph}>{ev.glyph}</Text>
                  </View>
                  <View style={bt.evMeta}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Text
                        style={[
                          bt.evLabel,
                          fontsLoaded && { fontFamily: SERIF.bold },
                        ]}
                      >
                        {ev.label}
                      </Text>
                      <View
                        style={[
                          bt.evTypePill,
                          {
                            backgroundColor: ev.color + "22",
                            borderColor: ev.color + "45",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            bt.evTypeStr,
                            { color: ev.color },
                            fontsLoaded && { fontFamily: SERIF.semiBold },
                          ]}
                        >
                          {EVENT_TYPE[ev.type]?.label}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        bt.evSublabel,
                        fontsLoaded && { fontFamily: SERIF.regular },
                      ]}
                    >
                      {ev.sublabel}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    bt.evDetailWrap,
                    { borderLeftColor: ev.color + "60" },
                  ]}
                >
                  <Text
                    style={[
                      bt.evDetail,
                      fontsLoaded && { fontFamily: SERIF.regular },
                    ]}
                  >
                    {ev.detail}
                  </Text>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
const bt = StyleSheet.create({
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
    borderColor: C.moonBorder,
    maxHeight: height * 0.78,
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
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  dayNum: { fontSize: 52, color: C.ink, lineHeight: 56 },
  monthYear: { fontSize: 16, color: C.inkMid },
  dayName: {
    fontSize: 12,
    color: C.inkMuted,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  todayBadge: {
    backgroundColor: C.goldPale,
    borderWidth: 0.5,
    borderColor: C.goldBorder,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "center",
  },
  todayTxt: { fontSize: 10, color: C.gold, letterSpacing: 1.2 },
  eclipseBadge: {
    backgroundColor: C.pinkPale,
    borderWidth: 0.5,
    borderColor: C.pinkBorder,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "center",
  },
  eclipseTxt: { fontSize: 10, color: C.pink, letterSpacing: 1.2 },
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
  shimmer: { height: 1, marginHorizontal: 20, marginBottom: 14 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 10 },
  emptyWrap: { alignItems: "center", paddingVertical: 40 },
  emptyGlyph: { fontSize: 36, color: C.inkMuted, marginBottom: 12 },
  emptyTxt: { fontSize: 18, color: C.inkMid },
  emptySub: { fontSize: 13, color: C.inkMuted, marginTop: 4 },
  evCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    overflow: "hidden",
    position: "relative",
  },
  evAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  evHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  evGlyphWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  evGlyph: { fontSize: 22 },
  evMeta: { flex: 1, gap: 4 },
  evLabel: { fontSize: 18, color: C.ink },
  evTypePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
    borderWidth: 0.5,
    flexShrink: 0,
  },
  evTypeStr: { fontSize: 10 },
  evSublabel: { fontSize: 12.5, color: C.inkMuted, lineHeight: 17 },
  evDetailWrap: { borderLeftWidth: 2, borderRadius: 1, paddingLeft: 12 },
  evDetail: { fontSize: 14, color: C.inkMid, lineHeight: 22 },
});

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CalendarScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [trayEvents, setTrayEvents] = useState([]);
  const [trayVisible, setTrayVisible] = useState(false);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleSelectDate = useCallback((key, events) => {
    setSelectedDate(key);
    setTrayEvents(events);
    setTrayVisible(true);
  }, []);

  const handleCloseTray = useCallback(() => {
    setTrayVisible(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Legend fontsLoaded={fontsLoaded} />
        <MonthNav
          year={viewYear}
          month={viewMonth}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          fontsLoaded={fontsLoaded}
        />
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          fontsLoaded={fontsLoaded}
        />
        <UpcomingStrip
          fontsLoaded={fontsLoaded}
          onSelectDate={handleSelectDate}
        />
        <View style={{ height: 48 }} />
      </ScrollView>
      <BottomTray
        visible={trayVisible}
        dateKey={selectedDate}
        events={trayEvents}
        onClose={handleCloseTray}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}
