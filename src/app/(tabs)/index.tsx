import {
  Modal,
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import StopwatchDisplay from "../../components/StopwatchDisplay";
import ControlButton from "../../components/ControlButton";
import { useStopwatch } from "../../hooks/useStopwatch";
import { saveSession } from "../../utils/storage";
import ScreenHeader from "../../components/ScreenHeader";
import LapList from "../../components/LapList";

const INTRO_STORAGE_KEY = "stopwatch_intro_seen";

export default function StopwatchScreen() {
  const { width, height } = useWindowDimensions();
  const {
    elapsedTime,
    status,
    laps,
    start,
    pause,
    reset,
    recordLap,
  } = useStopwatch();

  const running = status === "running";
  const paused = status === "paused";
  const canReset = status !== "idle";
  const compact = height < 700;
  const diameter = Math.min(
    width - 44,
    height * (compact ? 0.3 : 0.37),
    360
  );
  const horizontalPadding = Math.max(20, (width - 720) / 2);
  const [saving, setSaving] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [introError, setIntroError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadIntroductionState() {
      try {
        const seen = await AsyncStorage.getItem(INTRO_STORAGE_KEY);
        if (mounted) setIntroVisible(seen !== "true");
      } catch {
        if (mounted) {
          setIntroVisible(true);
          setIntroError("The introduction may appear again next time.");
        }
      } finally {
        if (mounted) setIntroReady(true);
      }
    }

    void loadIntroductionState();

    return () => {
      mounted = false;
    };
  }, []);

  async function finishIntroduction(startTiming: boolean) {
    setIntroVisible(false);
    setIntroError(null);

    try {
      await AsyncStorage.setItem(INTRO_STORAGE_KEY, "true");
    } catch {
      setIntroError("The introduction may appear again next time.");
    }

    if (startTiming) start();
  }

  async function handleSaveSession() {
    if (elapsedTime <= 0) {
      Alert.alert(
        "Nothing to save",
        "Start the stopwatch and pause it before saving a session."
      );
      return;
    }

    if (status === "running") {
      Alert.alert(
        "Cannot save session",
        "Pause the stopwatch before saving."
      );
      return;
    }

    setSaving(true);
    try {
      await saveSession({
        id: `${Date.now()}`,
        date: new Date().toISOString(),
        duration: elapsedTime,
        lapCount: laps.length,
      });
      router.navigate("/history");
    } catch {
      Alert.alert(
        "Error",
        "Unable to save the session."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          paddingHorizontal: horizontalPadding,
          paddingTop: compact ? 8 : 16,
        },
      ]}
    >
      <ScreenHeader
        eyebrow="A MOMENT FOR YOU"
        title="Find your flow."
        subtitle="A little space to focus, one second at a time."
      />

      {introError ? (
        <Text style={styles.introError} accessibilityRole="alert">
          {introError}
        </Text>
      ) : null}

      <StopwatchDisplay
        elapsedTime={elapsedTime}
        running={running}
        paused={paused}
        diameter={diameter}
        compact={compact}
      />

      <View
        style={[
          styles.controls,
          { marginVertical: compact ? 10 : 18 },
        ]}
      >
        <ControlButton
          title="Reset"
          icon="refresh-outline"
          onPress={reset}
          disabled={!canReset}
        />
        <ControlButton
          title={running ? "Pause" : status === "paused" ? "Resume" : "Start"}
          icon={running ? "pause" : "play"}
          variant="primary"
          onPress={running ? pause : start}
        />
        <ControlButton
          title="Lap"
          icon="flag-outline"
          onPress={recordLap}
          disabled={!running}
        />
      </View>

      <Pressable
        onPress={handleSaveSession}
        disabled={saving}
        style={({ pressed }) => [
          styles.saveButton,
          saving && styles.saveButtonDisabled,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Save session to history"
        accessibilityState={{
          disabled: saving,
          busy: saving,
        }}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save to History"}
        </Text>
      </Pressable>

      <LapList laps={laps} />

      <Modal
        visible={introReady && introVisible}
        animationType="fade"
        onRequestClose={() => void finishIntroduction(false)}
      >
        <SafeAreaView style={styles.introScreen}>
          <ScrollView
            contentContainerStyle={styles.introContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.introHeroIcon}>
              <Ionicons name="timer-outline" size={42} color="#B9F65B" />
            </View>
            <Text style={styles.introEyebrow}>WELCOME TO YOUR STOPWATCH</Text>
            <Text style={styles.introTitle}>Make every second count.</Text>
            <Text style={styles.introSubtitle}>
              A calm, focused timer for workouts, study sessions, and everything
              in between.
            </Text>

            <View style={styles.introFeatures}>
              <View style={styles.introFeature}>
                <View style={styles.introFeatureIcon}>
                  <Ionicons name="play" size={17} color="#B9F65B" />
                </View>
                <View style={styles.introFeatureCopy}>
                  <Text style={styles.introFeatureTitle}>Start and pause</Text>
                  <Text style={styles.introFeatureText}>
                    Begin when you’re ready. Pick up where you left off.
                  </Text>
                </View>
              </View>
              <View style={styles.introDivider} />
              <View style={styles.introFeature}>
                <View style={styles.introFeatureIcon}>
                  <Ionicons name="flag-outline" size={18} color="#B9F65B" />
                </View>
                <View style={styles.introFeatureCopy}>
                  <Text style={styles.introFeatureTitle}>Track your laps</Text>
                  <Text style={styles.introFeatureText}>
                    Capture splits as you go and find your best pace.
                  </Text>
                </View>
              </View>
              <View style={styles.introDivider} />
              <View style={styles.introFeature}>
                <View style={styles.introFeatureIcon}>
                  <Ionicons name="bookmark-outline" size={18} color="#B9F65B" />
                </View>
                <View style={styles.introFeatureCopy}>
                  <Text style={styles.introFeatureTitle}>Keep your sessions</Text>
                  <Text style={styles.introFeatureText}>
                    Save a session to revisit it in your history.
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => void finishIntroduction(true)}
              style={({ pressed }) => [
                styles.introPrimaryButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Ionicons name="play" size={17} color="#101311" />
              <Text style={styles.introPrimaryText}>Start timing</Text>
            </Pressable>
            <Pressable
              onPress={() => void finishIntroduction(false)}
              style={({ pressed }) => [
                styles.introSecondaryButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.introSecondaryText}>I’ll explore first</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101311",
  },
  introError: {
    color: "#FF9B8D",
    fontSize: 12,
    marginBottom: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },
  saveButton: {
    backgroundColor: "#202620",
    borderWidth: 1,
    borderColor: "#B9F65B",
    borderRadius: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    color: "#B9F65B",
    fontSize: 14,
    fontWeight: "700",
  },
  introScreen: {
    flex: 1,
    backgroundColor: "#101311",
  },
  introContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  introHeroIcon: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: "#202A1B",
    borderWidth: 1,
    borderColor: "#455B33",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  introEyebrow: {
    color: "#B9F65B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    textAlign: "center",
  },
  introTitle: {
    color: "#F4F7F4",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.6,
    textAlign: "center",
    marginTop: 10,
  },
  introSubtitle: {
    color: "#A1AAA3",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  introFeatures: {
    backgroundColor: "#1A201C",
    borderColor: "#29302A",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  introFeature: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 12,
  },
  introFeatureIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#2B3824",
    alignItems: "center",
    justifyContent: "center",
  },
  introFeatureCopy: {
    flex: 1,
  },
  introFeatureTitle: {
    color: "#F4F7F4",
    fontSize: 13,
    fontWeight: "700",
  },
  introFeatureText: {
    color: "#89938B",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  introDivider: {
    height: 1,
    backgroundColor: "#29302A",
    marginLeft: 51,
  },
  introPrimaryButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#B9F65B",
    borderRadius: 17,
  },
  introPrimaryText: {
    color: "#101311",
    fontSize: 15,
    fontWeight: "800",
  },
  introSecondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  introSecondaryText: {
    color: "#A1AAA3",
    fontSize: 13,
    fontWeight: "600",
  },
});