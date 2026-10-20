
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
};

export default function ControlButton({
  title,
  onPress,
  variant = "secondary",
  icon,
  disabled = false,
  loading = false,
}: Props) {
  const primary = variant === "primary";
  const danger = variant === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primary,
        danger && styles.danger,
        variant === "secondary" && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={primary ? "#101311" : "#F4F7F4"}
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={primary ? "#101311" : danger ? "#FF9B8D" : "#F4F7F4"}
            />
          )}
          <Text
            style={[
              styles.text,
              primary && styles.primaryText,
              danger && styles.dangerText,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  primary: {
    backgroundColor: "#B9F65B",
  },
  secondary: {
    backgroundColor: "#202620",
    borderWidth: 1,
    borderColor: "#343C35",
  },
  danger: {
    backgroundColor: "#30201E",
    borderWidth: 1,
    borderColor: "#63403A",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  text: {
    color: "#F4F7F4",
    fontSize: 14,
    fontWeight: "700",
  },
  primaryText: {
    color: "#101311",
  },
  dangerText: {
    color: "#FF9B8D",
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});
