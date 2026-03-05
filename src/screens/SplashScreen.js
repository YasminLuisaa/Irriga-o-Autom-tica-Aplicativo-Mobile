import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../styles/theme";

const SplashScreen = ({ onFinish }) => {

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),

      Animated.timing(progress, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(onFinish, 2600);
    return () => clearTimeout(timer);

  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "70%"],
  });

  return (

    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="water-percent"
            size={90}
            color="#00E0FF"
          />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fade }}>

        <Text style={styles.title}>
          IFSP Irrigação
        </Text>

        <Text style={styles.subtitle}>
          Campus Birigui
        </Text>

        <Text style={styles.tagline}>
          Sistema Inteligente de Irrigação Automática
        </Text>

      </Animated.View>

      <View style={styles.loadingArea}>

        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              { width: progressWidth }
            ]}
          />
        </View>

        <Text style={styles.loadingText}>
          Inicializando sensores...
        </Text>

      </View>

      <Text style={styles.footer}>
        Instituto Federal de São Paulo
      </Text>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
  },

  logoContainer: {
    marginBottom: 40,
  },

  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#00E0FF",
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00E0FF",
    marginTop: 6,
    textAlign: "center",
  },

  tagline: {
    fontSize: 14,
    color: "#D6E8EE",
    marginTop: 14,
    textAlign: "center",
    marginBottom: 60,
  },

  loadingArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 80,
  },

  loadingTrack: {
    width: "70%",
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },

  loadingBar: {
    height: "100%",
    backgroundColor: "#00E0FF",
    borderRadius: 10,
  },

  loadingText: {
    fontSize: 13,
    color: "#D6E8EE",
    fontWeight: "500",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    color: "#A7C7D1",
    fontSize: 12,
  },

});

export default SplashScreen;