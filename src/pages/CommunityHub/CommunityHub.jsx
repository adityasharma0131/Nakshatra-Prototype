/**
 * Nakshatra — CommunityScreen (Social Hub)
 *
 * Design language mirrors HomeScreen v5 "Dark Celestial Luxury":
 *  - Deep midnight navy base (#0D0B1A) with warm gold & violet accents
 *  - Glassmorphism cards, frosted borders, rich gradients
 *  - Cormorant Garamond serif for headlines
 *  - Instagram-style feed: Stories bar → Posts (image/text/reel/poll) → Explore
 *
 * Features:
 *  - Stories ring (online glow, viewed state, add-story)
 *  - Post cards: image posts, text "insight" posts, poll posts, reel teasers
 *  - Like / Comment / Share / Save (bookmark) actions with animated heart
 *  - Trending topics chip bar
 *  - Live session banner
 *  - Floating Compose FAB
 *  - Follow / Unfollow per card
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
  Image,
  StatusBar,
  Platform,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";

const { width } = Dimensions.get("window");

// ─── Design Tokens (mirrors HomeScreen) ─────────────────────────────────────────
const C = {
  bg: "#0D0B1A",
  bgCard: "#13112A",
  bgCardAlt: "#181535",
  bgSurface: "#1C1A3A",

  goldLight: "#F7CE58",
  gold: "#D4A017",
  goldMid: "#E8B430",
  goldDark: "#9A6F00",
  goldPale: "rgba(212,160,23,0.12)",
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
  red: "#E84040",
  redPale: "rgba(232,64,64,0.12)",

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
const STORIES = [
  {
    id: 0,
    isMe: true,
    name: "Your Story",
    viewed: false,
    online: false,
    avatar: null,
  },
  {
    id: 1,
    name: "Pt. Ramesh",
    viewed: false,
    online: true,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    topic: "Saturn transit",
  },
  {
    id: 2,
    name: "Jyoti Devi",
    viewed: false,
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    topic: "Moon in Rohini",
  },
  {
    id: 3,
    name: "Acharya Dev",
    viewed: true,
    online: false,
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    topic: "Numerology",
  },
  {
    id: 4,
    name: "Priya Nair",
    viewed: false,
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    topic: "Tarot pull",
  },
  {
    id: 5,
    name: "Rishi Kumar",
    viewed: true,
    online: false,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    topic: "Yoga sutras",
  },
  {
    id: 6,
    name: "Devi Shakti",
    viewed: false,
    online: true,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    topic: "Rahu-Ketu",
  },
];

const TRENDING = [
  "# MoonInRohini",
  "# SaturnTransit",
  "# SolarReturn",
  "# RahuKetu",
  "# Purnima",
  "# DailyKundli",
];

const POSTS = [
  {
    id: 1,
    type: "image",
    author: {
      name: "Pandit Ramesh",
      title: "Vedic Astrologer · 18 yrs",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      verified: true,
      online: true,
    },
    time: "2h ago",
    content:
      "Saturn's transit through Aquarius brings a powerful restructuring of your 10th house matters. Those with Taurus rising — your career karma is being rewritten. Embrace the discipline, resist the shortcuts.",
    image:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",
    tags: ["SaturnTransit", "VedicAstrology", "KarmaPath"],
    likes: 1284,
    comments: 94,
    shares: 211,
    saved: false,
    liked: false,
  },
  {
    id: 2,
    type: "insight",
    author: {
      name: "Jyoti Devi",
      title: "KP System · Tarot",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      verified: true,
      online: true,
    },
    time: "4h ago",
    content:
      "✦ Daily Insight for Simha Rashi\n\nThe Moon graces Rohini today — your creative faculties are at their peak. Channel this energy into art, music, or meaningful conversation. Avoid financial decisions after 6 PM as Rahu aspects your 2nd house.",
    accent: C.moonLight,
    gradient: ["#1C1850", "#110F30"],
    tags: ["SimhaRashi", "DailyInsight", "MoonRohini"],
    likes: 873,
    comments: 61,
    shares: 147,
    saved: true,
    liked: true,
  },
  {
    id: 3,
    type: "poll",
    author: {
      name: "Acharya Dev",
      title: "Numerology · Vaastu",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      verified: false,
      online: false,
    },
    time: "6h ago",
    content: "Which planetary transit has impacted you the most this year?",
    pollOptions: [
      { label: "Saturn in Aquarius", votes: 1420, pct: 42 },
      { label: "Jupiter in Taurus", votes: 980, pct: 29 },
      { label: "Rahu-Ketu shift", votes: 610, pct: 18 },
      { label: "Mars retrograde", votes: 370, pct: 11 },
    ],
    totalVotes: 3380,
    userVoted: null,
    tags: ["AstroPolls", "PlanetaryTransit"],
    likes: 542,
    comments: 88,
    shares: 73,
    saved: false,
    liked: false,
  },
  {
    id: 4,
    type: "reel",
    author: {
      name: "Priya Nair",
      title: "Tarot Reader · Energy Healer",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
      verified: true,
      online: true,
    },
    time: "8h ago",
    content:
      "🌙 Your 3-card Tarot pull for the week — The Star, The Hermit & The Wheel of Fortune. What they reveal will surprise you.",
    reelThumb:
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80",
    duration: "2:34",
    views: "28.4k",
    tags: ["WeeklyTarot", "ThreeCardPull"],
    likes: 2341,
    comments: 187,
    shares: 445,
    saved: false,
    liked: false,
  },
  {
    id: 5,
    type: "image",
    author: {
      name: "Rishi Kumar",
      title: "Yoga & Vedanta Scholar",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      verified: false,
      online: false,
    },
    time: "12h ago",
    content:
      "The Bhagavad Gita teaches us: Act without attachment to results. This is the secret of Saturn — discipline without ego. As Shani transits, ask not what you will gain, but what you are willing to master.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tags: ["BhagavadGita", "SaturnLesson", "VedantaWisdom"],
    likes: 3100,
    comments: 212,
    shares: 529,
    saved: true,
    liked: false,
  },
  {
    id: 6,
    type: "insight",
    author: {
      name: "Devi Shakti",
      title: "Tantric Astrology",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      verified: true,
      online: true,
    },
    time: "1d ago",
    content:
      "☽ Purnima Ritual Reminder\n\nTonight's full moon in Sagittarius illuminates your dharma path. Light a ghee lamp facing north, chant the Gayatri Mantra 108 times, and set one intention rooted in truth — not desire.",
    accent: C.goldLight,
    gradient: ["#1A0A2E", "#2A1800"],
    tags: ["PurnimaRitual", "GayatriMantra", "FullMoon"],
    likes: 4512,
    comments: 334,
    shares: 891,
    saved: false,
    liked: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

// ─── Icon helper ─────────────────────────────────────────────────────────────────
function Icon({ lib, name, size, color }) {
  if (lib === "MaterialCommunityIcons")
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Animated Heart ──────────────────────────────────────────────────────────────
function LikeButton({ liked: initLiked, count: initCount, fontsLoaded }) {
  const [liked, setLiked] = useState(initLiked);
  const [count, setCount] = useState(initCount);
  const scale = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.45,
        useNativeDriver: true,
        speed: 80,
      }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();
    setLiked((v) => !v);
    setCount((v) => (liked ? v - 1 : v + 1));
  };

  return (
    <TouchableOpacity style={s.actionBtn} onPress={toggle} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={22}
          color={liked ? C.red : C.inkMid}
        />
      </Animated.View>
      <Text
        style={[
          s.actionTxt,
          liked && { color: C.red },
          fontsLoaded && { fontFamily: SERIF.regular },
        ]}
      >
        {fmtNum(count)}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Save Button ─────────────────────────────────────────────────────────────────
function SaveButton({ saved: initSaved, fontsLoaded }) {
  const [saved, setSaved] = useState(initSaved);
  return (
    <TouchableOpacity
      style={[s.actionBtn, { marginLeft: "auto" }]}
      onPress={() => setSaved((v) => !v)}
      activeOpacity={0.8}
    >
      <Ionicons
        name={saved ? "bookmark" : "bookmark-outline"}
        size={21}
        color={saved ? C.gold : C.inkMid}
      />
    </TouchableOpacity>
  );
}

// ─── Follow Button ───────────────────────────────────────────────────────────────
function FollowButton({ fontsLoaded }) {
  const [following, setFollowing] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setFollowing((v) => !v)}
      activeOpacity={0.85}
    >
      {following ? (
        <View style={s.followingBtn}>
          <Text
            style={[
              s.followingTxt,
              fontsLoaded && { fontFamily: SERIF.semiBold },
            ]}
          >
            Following
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={[C.moonLight, C.moon]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.followBtn}
        >
          <Text
            style={[s.followTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Follow
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

// ─── Post Header ─────────────────────────────────────────────────────────────────
function PostHeader({ author, time, fontsLoaded }) {
  return (
    <View style={s.postHead}>
      <View style={s.postAvatarWrap}>
        <Image source={{ uri: author.avatar }} style={s.postAvatar} />
        {author.online && <View style={s.postOnlineDot} />}
      </View>
      <View style={s.postHeadMid}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text
            style={[s.postAuthor, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            {author.name}
          </Text>
          {author.verified && (
            <MaterialCommunityIcons
              name="check-decagram"
              size={14}
              color={C.moonLight}
            />
          )}
        </View>
        <Text
          style={[s.postMeta, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {author.title} · {time}
        </Text>
      </View>
      <FollowButton fontsLoaded={fontsLoaded} />
      <TouchableOpacity style={{ marginLeft: 6, padding: 4 }}>
        <Ionicons name="ellipsis-horizontal" size={18} color={C.inkMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Tags Row ────────────────────────────────────────────────────────────────────
function TagsRow({ tags, fontsLoaded }) {
  if (!tags?.length) return null;
  return (
    <View style={s.tagsRow}>
      {tags.map((t, i) => (
        <TouchableOpacity key={i} style={s.tagChip} activeOpacity={0.8}>
          <Text
            style={[s.tagTxt, fontsLoaded && { fontFamily: SERIF.semiBold }]}
          >
            #{t}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Action Bar ──────────────────────────────────────────────────────────────────
function ActionBar({ post, fontsLoaded }) {
  return (
    <View style={s.actionBar}>
      <LikeButton
        liked={post.liked}
        count={post.likes}
        fontsLoaded={fontsLoaded}
      />
      <TouchableOpacity style={s.actionBtn} activeOpacity={0.8}>
        <Ionicons name="chatbubble-outline" size={20} color={C.inkMid} />
        <Text
          style={[s.actionTxt, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {fmtNum(post.comments)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.actionBtn} activeOpacity={0.8}>
        <Ionicons name="paper-plane-outline" size={20} color={C.inkMid} />
        <Text
          style={[s.actionTxt, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {fmtNum(post.shares)}
        </Text>
      </TouchableOpacity>
      <SaveButton saved={post.saved} fontsLoaded={fontsLoaded} />
    </View>
  );
}

// ─── IMAGE POST ──────────────────────────────────────────────────────────────────
function ImagePost({ post, fontsLoaded }) {
  const [expanded, setExpanded] = useState(false);
  const text = post.content;
  const short = text.length > 110 && !expanded;

  return (
    <View style={s.postCard}>
      <PostHeader
        author={post.author}
        time={post.time}
        fontsLoaded={fontsLoaded}
      />
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.95}
      >
        <Text
          style={[s.postText, fontsLoaded && { fontFamily: SERIF.regular }]}
        >
          {short ? text.slice(0, 110) + "… " : text + " "}
          {text.length > 110 && (
            <Text
              style={[
                s.readMore,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {expanded ? "less" : "more"}
            </Text>
          )}
        </Text>
      </TouchableOpacity>
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={s.postImg}
          resizeMode="cover"
        />
      )}
      <TagsRow tags={post.tags} fontsLoaded={fontsLoaded} />
      <ActionBar post={post} fontsLoaded={fontsLoaded} />
    </View>
  );
}

// ─── INSIGHT (text gradient) POST ────────────────────────────────────────────────
function InsightPost({ post, fontsLoaded }) {
  return (
    <View style={s.postCard}>
      <PostHeader
        author={post.author}
        time={post.time}
        fontsLoaded={fontsLoaded}
      />
      <LinearGradient
        colors={post.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.insightGrad}
      >
        <View style={[s.insightAccentBar, { backgroundColor: post.accent }]} />
        <Text
          style={[
            s.insightText,
            fontsLoaded && { fontFamily: SERIF.regular },
            { color: post.accent === C.goldLight ? C.ink : C.ink },
          ]}
        >
          {post.content}
        </Text>
      </LinearGradient>
      <TagsRow tags={post.tags} fontsLoaded={fontsLoaded} />
      <ActionBar post={post} fontsLoaded={fontsLoaded} />
    </View>
  );
}

// ─── POLL POST ───────────────────────────────────────────────────────────────────
function PollPost({ post, fontsLoaded }) {
  const [voted, setVoted] = useState(post.userVoted);

  return (
    <View style={s.postCard}>
      <PostHeader
        author={post.author}
        time={post.time}
        fontsLoaded={fontsLoaded}
      />
      <Text style={[s.postText, fontsLoaded && { fontFamily: SERIF.semiBold }]}>
        {post.content}
      </Text>

      <View style={s.pollWrap}>
        {post.pollOptions.map((opt, i) => {
          const isVoted = voted === i;
          const showResult = voted !== null;
          return (
            <TouchableOpacity
              key={i}
              style={s.pollOption}
              activeOpacity={0.82}
              onPress={() => setVoted(i)}
            >
              <View
                style={[
                  s.pollBar,
                  showResult && { width: `${opt.pct}%` },
                  isVoted && { backgroundColor: C.moonPale },
                ]}
              />
              <View style={s.pollInner}>
                <Text
                  style={[
                    s.pollLabel,
                    fontsLoaded && {
                      fontFamily: isVoted ? SERIF.semiBold : SERIF.regular,
                    },
                    isVoted && { color: C.moonLight },
                  ]}
                >
                  {opt.label}
                </Text>
                {showResult && (
                  <Text
                    style={[
                      s.pollPct,
                      fontsLoaded && { fontFamily: SERIF.semiBold },
                      isVoted && { color: C.moonLight },
                    ]}
                  >
                    {opt.pct}%
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[s.pollTotal, fontsLoaded && { fontFamily: SERIF.regular }]}>
        {fmtNum(post.totalVotes)} votes ·{" "}
        {voted === null ? "Tap to vote" : "Final results"}
      </Text>
      <TagsRow tags={post.tags} fontsLoaded={fontsLoaded} />
      <ActionBar post={post} fontsLoaded={fontsLoaded} />
    </View>
  );
}

// ─── REEL TEASER POST ────────────────────────────────────────────────────────────
function ReelPost({ post, fontsLoaded }) {
  const [playing, setPlaying] = useState(false);

  return (
    <View style={s.postCard}>
      <PostHeader
        author={post.author}
        time={post.time}
        fontsLoaded={fontsLoaded}
      />
      <Text style={[s.postText, fontsLoaded && { fontFamily: SERIF.regular }]}>
        {post.content}
      </Text>

      <TouchableOpacity
        style={s.reelWrap}
        activeOpacity={0.92}
        onPress={() => setPlaying((v) => !v)}
      >
        <Image
          source={{ uri: post.reelThumb }}
          style={s.reelThumb}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(13,11,26,0.75)"]}
          style={StyleSheet.absoluteFill}
        />
        {/* Play button */}
        <View style={s.reelPlayBtn}>
          <LinearGradient
            colors={[C.moonLight, C.moon, C.moonDark]}
            style={s.reelPlayGrad}
          >
            <Ionicons
              name={playing ? "pause" : "play"}
              size={22}
              color="#FFF"
              style={{ marginLeft: playing ? 0 : 3 }}
            />
          </LinearGradient>
        </View>
        {/* Meta overlay */}
        <View style={s.reelMeta}>
          <View style={s.reelMetaPill}>
            <Ionicons name="play-circle" size={12} color={C.ink} />
            <Text
              style={[
                s.reelMetaTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {" "}
              {post.views} views
            </Text>
          </View>
          <View style={s.reelMetaPill}>
            <Ionicons name="time-outline" size={12} color={C.ink} />
            <Text
              style={[
                s.reelMetaTxt,
                fontsLoaded && { fontFamily: SERIF.semiBold },
              ]}
            >
              {" "}
              {post.duration}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TagsRow tags={post.tags} fontsLoaded={fontsLoaded} />
      <ActionBar post={post} fontsLoaded={fontsLoaded} />
    </View>
  );
}

// ─── Post Router ─────────────────────────────────────────────────────────────────
function PostCard({ post, fontsLoaded }) {
  switch (post.type) {
    case "image":
      return <ImagePost post={post} fontsLoaded={fontsLoaded} />;
    case "insight":
      return <InsightPost post={post} fontsLoaded={fontsLoaded} />;
    case "poll":
      return <PollPost post={post} fontsLoaded={fontsLoaded} />;
    case "reel":
      return <ReelPost post={post} fontsLoaded={fontsLoaded} />;
    default:
      return null;
  }
}

// ─── Stories Bar ─────────────────────────────────────────────────────────────────
function StoriesBar({ fontsLoaded }) {
  const [viewed, setViewed] = useState({});

  return (
    <View style={s.storiesWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.storiesScroll}
      >
        {STORIES.map((st) => (
          <TouchableOpacity
            key={st.id}
            style={s.storyItem}
            activeOpacity={0.85}
            onPress={() => setViewed((v) => ({ ...v, [st.id]: true }))}
          >
            {st.isMe ? (
              // "Add Story" bubble
              <View style={s.storyAddWrap}>
                <LinearGradient
                  colors={[C.bgSurface, C.bgCard]}
                  style={s.storyAddBg}
                >
                  <Ionicons name="add" size={22} color={C.gold} />
                </LinearGradient>
              </View>
            ) : (
              <LinearGradient
                colors={
                  viewed[st.id] || st.viewed
                    ? [C.bgSurface, C.bgSurface]
                    : [C.goldMid, C.moon, C.moonDark]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.storyRing}
              >
                <View style={s.storyImgWrap}>
                  <Image source={{ uri: st.avatar }} style={s.storyImg} />
                  {st.online && <View style={s.storyOnlineDot} />}
                </View>
              </LinearGradient>
            )}
            <Text
              numberOfLines={1}
              style={[
                s.storyName,
                fontsLoaded && { fontFamily: SERIF.regular },
                (viewed[st.id] || st.viewed) && { color: C.inkMuted },
              ]}
            >
              {st.isMe ? "Add Story" : st.name.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={s.storiesDivider} />
    </View>
  );
}

// ─── Trending Chips ───────────────────────────────────────────────────────────────
function TrendingBar({ fontsLoaded }) {
  const [active, setActive] = useState(0);
  return (
    <View style={s.trendingWrap}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <MaterialCommunityIcons name="trending-up" size={14} color={C.gold} />
        <Text
          style={[s.trendLabel, fontsLoaded && { fontFamily: SERIF.semiBold }]}
        >
          Trending
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.trendingScroll}
      >
        <TouchableOpacity
          style={[s.trendChip, active === -1 && s.trendChipActive]}
          onPress={() => setActive(-1)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="grid-outline"
            size={12}
            color={active === -1 ? "#FFF" : C.inkMuted}
          />
          <Text
            style={[
              s.trendChipTxt,
              fontsLoaded && {
                fontFamily: active === -1 ? SERIF.semiBold : SERIF.regular,
              },
              active === -1 && { color: "#FFF" },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {TRENDING.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[s.trendChip, active === i && s.trendChipActive]}
            onPress={() => setActive(i)}
            activeOpacity={0.8}
          >
            {active === i && (
              <LinearGradient
                colors={[C.moonLight, C.moon]}
                style={StyleSheet.absoluteFill}
                borderRadius={20}
              />
            )}
            <Text
              style={[
                s.trendChipTxt,
                fontsLoaded && {
                  fontFamily: active === i ? SERIF.semiBold : SERIF.regular,
                },
                active === i && { color: "#FFF" },
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Live Session Banner ──────────────────────────────────────────────────────────
function LiveBanner({ fontsLoaded }) {
  return (
    <View style={s.liveWrap}>
      <LinearGradient
        colors={["#2A0A0A", "#5A1010", "#3A0808"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.liveBanner}
      >
        <View style={s.liveOrb} />
        {/* Live pill */}
        <View style={s.livePill}>
          <View style={s.liveDot} />
          <Text
            style={[s.livePillTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            LIVE
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[s.liveTitle, fontsLoaded && { fontFamily: SERIF.bold }]}
          >
            Jyoti Devi · Full Moon Reading
          </Text>
          <Text
            style={[s.liveSub, fontsLoaded && { fontFamily: SERIF.regular }]}
          >
            2,140 watching · Rohini Nakshatra Deep Dive
          </Text>
        </View>
        <TouchableOpacity style={s.liveJoinBtn} activeOpacity={0.88}>
          <LinearGradient
            colors={["#E84040", "#B02020"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.liveJoinGrad}
          >
            <Text
              style={[s.liveJoinTxt, fontsLoaded && { fontFamily: SERIF.bold }]}
            >
              Join
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

// ─── Compose Bar (inline at top of feed) ─────────────────────────────────────────
function ComposeBar({ fontsLoaded }) {
  return (
    <View style={s.composeWrap}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
        style={s.composeAvatar}
      />
      <TouchableOpacity style={s.composeInput} activeOpacity={0.7}>
        <Text
          style={[
            s.composePlaceholder,
            fontsLoaded && { fontFamily: SERIF.regular },
          ]}
        >
          Share an astrological insight…
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.composePhoto} activeOpacity={0.8}>
        <Ionicons name="image-outline" size={20} color={C.moon} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Top Nav ─────────────────────────────────────────────────────────────────────
function TopNav({ fontsLoaded }) {
  return (
    <View style={s.topNav}>
      <View style={{ flex: 1 }}>
        <Text style={[s.navTitle, fontsLoaded && { fontFamily: SERIF.bold }]}>
          Community
        </Text>
        <Text style={[s.navSub, fontsLoaded && { fontFamily: SERIF.regular }]}>
          Nakshatra · Social Hub
        </Text>
      </View>
      <View style={s.navRight}>
        <TouchableOpacity style={s.navIconBtn} activeOpacity={0.8}>
          <Ionicons name="search-outline" size={19} color={C.inkMid} />
        </TouchableOpacity>
        <TouchableOpacity style={s.navIconBtn} activeOpacity={0.8}>
          <Ionicons name="chatbubbles-outline" size={19} color={C.inkMid} />
          <View style={s.msgDot} />
        </TouchableOpacity>
        <TouchableOpacity style={s.navIconBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={19} color={C.inkMid} />
          <View style={s.notifDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Feed Filter Tabs ─────────────────────────────────────────────────────────────
function FeedTabs({ active, setActive, fontsLoaded }) {
  const tabs = ["For You", "Following", "Astrologers", "Reels"];
  return (
    <View style={s.tabsWrap}>
      {tabs.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={s.tab}
          onPress={() => setActive(i)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              s.tabTxt,
              active === i && s.tabTxtActive,
              fontsLoaded && {
                fontFamily: active === i ? SERIF.semiBold : SERIF.regular,
              },
            ]}
          >
            {t}
          </Text>
          {active === i && (
            <LinearGradient
              colors={[C.goldMid, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.tabUnderline}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Floating Compose FAB ─────────────────────────────────────────────────────────
function FAB({ fontsLoaded }) {
  return (
    <View style={s.fabWrap} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ borderRadius: 28, overflow: "hidden" }}
      >
        <LinearGradient
          colors={[C.goldLight, C.goldMid, C.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.fab}
        >
          <MaterialCommunityIcons
            name="pencil-plus"
            size={22}
            color="#0D0B1A"
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────────
export default function CommunityScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <TopNav fontsLoaded={fontsLoaded} />
      <FeedTabs
        active={activeTab}
        setActive={setActiveTab}
        fontsLoaded={fontsLoaded}
      />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Stories */}
        <StoriesBar fontsLoaded={fontsLoaded} />

        {/* Live Session */}
        <LiveBanner fontsLoaded={fontsLoaded} />

        {/* Compose */}
        <ComposeBar fontsLoaded={fontsLoaded} />

        {/* Trending Topics */}
        <TrendingBar fontsLoaded={fontsLoaded} />

        {/* Feed Divider */}
        <View style={s.feedDivider} />

        {/* Posts */}
        {POSTS.map((post) => (
          <PostCard key={post.id} post={post} fontsLoaded={fontsLoaded} />
        ))}

        {/* Bottom spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      {/* <FAB fontsLoaded={fontsLoaded} /> */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // ── Top Nav ──
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 42 : 58,
    paddingBottom: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  navTitle: { fontSize: 28, color: C.ink },
  navSub: { fontSize: 11, color: C.inkMuted, letterSpacing: 1, marginTop: 1 },
  navRight: { flexDirection: "row", gap: 6 },
  navIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.bgCard,
    borderWidth: 0.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.bgCard,
  },
  msgDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
    borderWidth: 1.5,
    borderColor: C.bgCard,
  },

  // ── Tabs ──
  tabsWrap: {
    flexDirection: "row",
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabTxt: { fontSize: 14, color: C.inkMuted },
  tabTxtActive: { color: C.gold },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 2,
    borderRadius: 2,
  },

  scroll: { flex: 1 },

  // ── Stories ──
  storiesWrap: { paddingTop: 14, paddingBottom: 2 },
  storiesScroll: { paddingHorizontal: 14, gap: 14, paddingBottom: 6 },
  storyItem: { alignItems: "center", gap: 5 },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  storyImgWrap: { position: "relative" },
  storyImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: C.bg,
  },
  storyOnlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bg,
  },
  storyAddWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: C.goldBorder,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.bgCard,
  },
  storyAddBg: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  storyName: {
    fontSize: 11,
    color: C.inkMid,
    maxWidth: 68,
    textAlign: "center",
  },
  storiesDivider: { height: 0.5, backgroundColor: C.divider, marginTop: 10 },

  // ── Live ──
  liveWrap: { paddingHorizontal: 16, paddingTop: 14 },
  liveBanner: {
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 0.5,
    borderColor: "rgba(232,64,64,0.30)",
    overflow: "hidden",
    shadowColor: "rgba(232,64,64,0.40)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 5,
  },
  liveOrb: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.red,
    opacity: 0.08,
    top: -40,
    right: -20,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.red,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FFF" },
  livePillTxt: { color: "#FFF", fontSize: 11, letterSpacing: 1 },
  liveTitle: { fontSize: 15, color: C.ink },
  liveSub: { fontSize: 11.5, color: C.inkMuted, marginTop: 3 },
  liveJoinBtn: { borderRadius: 14, overflow: "hidden" },
  liveJoinGrad: { paddingHorizontal: 16, paddingVertical: 9 },
  liveJoinTxt: { color: "#FFF", fontSize: 13 },

  // ── Compose ──
  composeWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  composeAvatar: { width: 38, height: 38, borderRadius: 19 },
  composeInput: {
    flex: 1,
    height: 40,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: C.border,
  },
  composePlaceholder: { fontSize: 14, color: C.inkMuted },
  composePhoto: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Trending ──
  trendingWrap: { paddingTop: 14 },
  trendLabel: { fontSize: 12, color: C.gold, letterSpacing: 0.5 },
  trendingScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCard,
    overflow: "hidden",
  },
  trendChipActive: { borderColor: C.moon },
  trendChipTxt: { fontSize: 12.5, color: C.inkMid },

  // ── Feed Divider ──
  feedDivider: {
    height: 0.5,
    backgroundColor: C.divider,
    marginVertical: 10,
    marginHorizontal: 16,
  },

  // ── Post Card (shared) ──
  postCard: {
    backgroundColor: C.bgCard,
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 4,
  },
  postHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  postAvatarWrap: { position: "relative" },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: C.goldBorder,
  },
  postOnlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.green,
    borderWidth: 2,
    borderColor: C.bgCard,
  },
  postHeadMid: { flex: 1 },
  postAuthor: { fontSize: 16, color: C.ink },
  postMeta: { fontSize: 11.5, color: C.inkMuted, marginTop: 1 },
  postText: { fontSize: 15, color: C.inkMid, lineHeight: 23, marginBottom: 12 },
  readMore: { fontSize: 14, color: C.moon },
  postImg: { width: "100%", height: 220, borderRadius: 16, marginBottom: 12 },

  // ── Insight post ──
  insightGrad: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    position: "relative",
  },
  insightAccentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    opacity: 0.85,
  },
  insightText: { fontSize: 16, color: C.ink, lineHeight: 26 },

  // ── Poll ──
  pollWrap: { gap: 8, marginBottom: 10 },
  pollOption: {
    height: 46,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    backgroundColor: C.bgCardAlt,
    overflow: "hidden",
    justifyContent: "center",
  },
  pollBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 0,
    backgroundColor: C.moonPale,
    borderRadius: 12,
  },
  pollInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  pollLabel: { fontSize: 14, color: C.inkMid },
  pollPct: { fontSize: 13, color: C.inkMid },
  pollTotal: { fontSize: 11.5, color: C.inkMuted, marginBottom: 12 },

  // ── Reel ──
  reelWrap: {
    height: 210,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  reelThumb: { ...StyleSheet.absoluteFillObject },
  reelPlayBtn: { alignItems: "center", justifyContent: "center" },
  reelPlayGrad: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowMoon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  reelMeta: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    gap: 8,
  },
  reelMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13,11,26,0.65)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  reelMetaTxt: { fontSize: 11, color: C.ink },

  // ── Tags ──
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: C.moonPale,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
  },
  tagTxt: { fontSize: 11.5, color: C.moonLight },

  // ── Action Bar ──
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: C.divider,
    gap: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionTxt: { fontSize: 13, color: C.inkMuted },

  // ── Follow ──
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  followTxt: { color: "#FFF", fontSize: 13 },
  followingBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: C.moonBorder,
    backgroundColor: C.moonPale,
  },
  followingTxt: { color: C.moonLight, fontSize: 13 },

  // ── FAB ──
  fabWrap: {
    position: "absolute",
    bottom: 90,
    right: 20,
    zIndex: 99,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.shadowGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
});
