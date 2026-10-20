
import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  rightElement?: ReactNode;
};

export default function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  rightElement,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {eyebrow ? (
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        ) : null}

        <Text style={styles.title}>{title}</Text>

        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {rightElement ? (
        <View style={styles.action}>{rightElement}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    color: "#B9F65B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 7,
  },
  title: {
    color: "#F4F7F4",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#89938B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  action: {
    alignItems: "center",
    justifyContent: "center",
  },
});
