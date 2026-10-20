
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Lap } from "../types/stopwatch";
import { formatTime } from "../utils/formatTime";

type Props = {
  lap: Lap;
  fastest?: boolean;
  slowest?: boolean;
};

export default function LapItem({
  lap,
  fastest = false,
  slowest = false,
}: Props) {
  const status = fastest
    ? "Fastest"
    : slowest
      ? "Slowest"
      : null;

  return (
    <View style={styles.row}>
      <View style={styles.lapInfo}>
        <Text style={styles.lapName}>
          Lap {lap.lapNumber}
        </Text>

        {status && (
          <View style={styles.badge}>
            <Ionicons
              name={fastest ? "trending-down" : "trending-up"}
              size={12}
              color={fastest ? "#B9F65B" : "#FF9B8D"}
            />
            <Text
              style={[
                styles.badgeText,
                fastest ? styles.fastest : styles.slowest,
              ]}
            >
              {status}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.splitTime,
          fastest && styles.fastest,
          slowest && styles.slowest,
        ]}
      >
        +{formatTime(lap.splitTime)}
      </Text>

      <Text style={styles.totalTime}>
        {formatTime(lap.totalTime)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#29302A",
  },
  lapInfo: {
    flex: 1,
    gap: 5,
  },
  lapName: {
    color: "#F4F7F4",
    fontSize: 14,
    fontWeight: "600",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  fastest: {
    color: "#B9F65B",
  },
  slowest: {
    color: "#FF9B8D",
  },
  splitTime: {
    color: "#DDE3DD",
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  totalTime: {
    color: "#F4F7F4",
    fontSize: 13,
    minWidth: 84,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
});
