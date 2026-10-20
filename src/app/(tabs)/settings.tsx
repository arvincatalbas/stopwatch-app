
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "stopwatch_settings";

type Preferences = {
  haptics: boolean;
  sound: boolean;
  keepAwake: boolean;
};

const DEFAULTS: Preferences = {
  haptics: true,
  sound: false,
  keepAwake: false,
};

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const [preferences, setPreferences] =
    useState<Preferences>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          setPreferences({
            ...DEFAULTS,
            ...JSON.parse(saved),
          });
        }
      } catch {
        Alert.alert(
          "Settings",
          "Unable to load saved preferences."
        );
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();
  }, []);

  async function updateSetting(
    key: keyof Preferences,
    value: boolean
  ) {
    const next = { ...preferences, [key]: value };

    setPreferences(next);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      Alert.alert(
        "Settings",
        "Unable to save this preference."
      );
    }
  }

  function resetSettings() {
    Alert.alert(
      "Reset settings",
      "Restore all preferences to their defaults?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setPreferences(DEFAULTS);
            try {
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(DEFAULTS)
              );
            } catch {
              Alert.alert(
                "Settings",
                "Unable to save the reset preferences."
              );
            }
          },
        },
      ]
    );
  }

  function renderToggle(
    title: string,
    description: string,
    setting: keyof Preferences
  ) {
    return (
      <View style={styles.settingRow} key={setting}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>

        <Switch
          value={preferences[setting]}
          onValueChange={(value) =>
            updateSetting(setting, value)
          }
          disabled={!loaded}
          trackColor={{
            false: "#343C35",
            true: "#648B36",
          }}
          thumbColor={
            preferences[setting] ? "#B9F65B" : "#D0D5D0"
          }
          accessibilityLabel={title}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: Math.max(22, (width - 720) / 2) },
      ]}
    >
      <Text style={styles.eyebrow}>PERSONALIZE</Text>
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subtitle}>
        Make your stopwatch work for you.
      </Text>

      <Text style={styles.sectionTitle}>PREFERENCES</Text>

      <View style={styles.card}>
        {renderToggle(
          "Haptic feedback",
          "Vibrate when interacting with the timer.",
          "haptics"
        )}
        <View style={styles.divider} />
        {renderToggle(
          "Sound effects",
          "Enable timer interaction sounds.",
          "sound"
        )}
        <View style={styles.divider} />
        {renderToggle(
          "Keep screen awake",
          "Prevent the screen from sleeping during timing.",
          "keepAwake"
        )}
      </View>

      <Text style={styles.sectionTitle}>APPEARANCE</Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              Dark theme
            </Text>
            <Text style={styles.description}>
              The default charcoal and neon-green style.
            </Text>
          </View>
          <View style={styles.themeBadge}>
            <Text style={styles.themeBadgeText}>ON</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>APP</Text>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              Stopwatch
            </Text>
            <Text style={styles.description}>
              Version 1.0.0
            </Text>
          </View>
          <Text style={styles.version}>v1.0</Text>
        </View>
      </View>

      <Pressable
        onPress={resetSettings}
        style={({ pressed }) => [
          styles.resetButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.resetText}>
          Restore default settings
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101311",
  },
  content: {
    padding: 22,
    paddingBottom: 36,
  },
  eyebrow: {
    color: "#B9F65B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 12,
  },
  heading: {
    color: "#F4F7F4",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 7,
  },
  subtitle: {
    color: "#89938B",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#89938B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#1A201C",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#29302A",
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  settingRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 13,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: "#F4F7F4",
    fontSize: 15,
    fontWeight: "600",
  },
  description: {
    color: "#89938B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#29302A",
  },
  themeBadge: {
    backgroundColor: "#2B3824",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  themeBadgeText: {
    color: "#B9F65B",
    fontSize: 11,
    fontWeight: "800",
  },
  version: {
    color: "#89938B",
    fontSize: 12,
  },
  resetButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#51403C",
  },
  resetText: {
    color: "#FF9B8D",
    fontSize: 14,
    fontWeight: "600",
  },
});
