
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import type { Lap } from "../types/stopwatch";
import LapItem from "./LapItem";

type Props = {
  laps: Lap[];
};

export default function LapList({ laps }: Props) {
  const fastestLapId =
    laps.length > 0
      ? laps.reduce((best, current) =>
          current.splitTime < best.splitTime
            ? current
            : best
        ).id
      : null;

  const slowestLapId =
    laps.length > 0
      ? laps.reduce((worst, current) =>
          current.splitTime > worst.splitTime
            ? current
            : worst
        ).id
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lap times</Text>
        <Text style={styles.count}>
          {laps.length} {laps.length === 1 ? "LAP" : "LAPS"}
        </Text>
      </View>

      {laps.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No laps yet</Text>
          <Text style={styles.emptyDescription}>
            Start the timer and tap Lap to record a split.
          </Text>
        </View>
      ) : (
        <FlatList
          data={laps}
          keyExtractor={(item) => String(item.id)}
          style={styles.list}
          renderItem={({ item }) => (
            <LapItem
              lap={item}
              fastest={
                item.id === fastestLapId &&
                laps.length > 1
              }
              slowest={
                item.id === slowestLapId &&
                laps.length > 1
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#F4F7F4",
    fontSize: 18,
    fontWeight: "700",
  },
  count: {
    color: "#89938B",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: "#29302A",
  },
  emptyTitle: {
    color: "#F4F7F4",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyDescription: {
    color: "#89938B",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },
});
