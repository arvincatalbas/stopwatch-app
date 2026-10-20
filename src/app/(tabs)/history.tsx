
import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatTime } from "../../utils/formatTime";
import {
  clearSessions,
  getSessions,
  type StopwatchSession,
} from "../../utils/storage";

export default function HistoryScreen() {
  const { width } = useWindowDimensions();
  const [sessions, setSessions] =
    useState<StopwatchSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);

    try {
      setSessions(await getSessions());
    } catch {
      setHistoryError("Unable to load saved sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory])
  );

  async function clearHistory() {
    if (sessions.length === 0 || clearing) return;

    setClearing(true);
    setHistoryError(null);

    try {
      await clearSessions();
      setSessions([]);
      setConfirmingClear(false);
    } catch {
      setHistoryError("Unable to clear saved history. Please try again.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <View
      style={[
        styles.screen,
        { paddingHorizontal: Math.max(22, (width - 720) / 2) },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>YOUR RECORDS</Text>
          <Text style={styles.heading}>History</Text>
          <Text style={styles.subtitle}>
            Review your previous sessions.
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {sessions.length}
          </Text>
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="time-outline"
            size={23}
            color="#B9F65B"
          />
        </View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>
            Saved sessions
          </Text>
          <Text style={styles.summaryDescription}>
            {sessions.length}{" "}
            {sessions.length === 1 ? "record" : "records"} saved
            on this device
          </Text>
        </View>
      </View>

      {historyError ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {historyError}
        </Text>
      ) : null}

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>

        <Pressable
          onPress={() => {
            setHistoryError(null);
            setConfirmingClear(true);
          }}
          disabled={sessions.length === 0 || loading || clearing}
          accessibilityRole="button"
          accessibilityLabel="Clear all session history"
          accessibilityState={{
            disabled: sessions.length === 0 || loading || clearing,
          }}
        >
          <Text
            style={[
              styles.clearText,
              (sessions.length === 0 || loading || clearing) && {
                opacity: 0.35,
              },
            ]}
          >
            Clear all
          </Text>
        </Pressable>
      </View>

      {confirmingClear ? (
        <View style={styles.confirmCard}>
          <View style={styles.confirmCopy}>
            <Text style={styles.confirmTitle}>Clear all sessions?</Text>
            <Text style={styles.confirmDescription}>
              This will permanently delete {sessions.length}{" "}
              {sessions.length === 1 ? "session" : "sessions"}.
            </Text>
          </View>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={() => setConfirmingClear(false)}
              disabled={clearing}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.confirmButton,
                styles.cancelButton,
                pressed && styles.pressed,
                clearing && styles.disabledButton,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => void clearHistory()}
              disabled={clearing}
              accessibilityRole="button"
              accessibilityLabel="Delete all saved sessions"
              accessibilityState={{ disabled: clearing, busy: clearing }}
              style={({ pressed }) => [
                styles.confirmButton,
                styles.deleteButton,
                pressed && styles.pressed,
                clearing && styles.disabledButton,
              ]}
            >
              <Text style={styles.deleteButtonText}>
                {clearing ? "Clearing..." : "Delete all"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.emptyText}>
            Loading history...
          </Text>
        ) : sessions.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="hourglass-outline"
                size={34}
                color="#B9F65B"
              />
            </View>
            <Text style={styles.emptyTitle}>
              No sessions yet
            </Text>
            <Text style={styles.emptyText}>
              Complete a stopwatch session and save it to
              see your records here.
            </Text>
          </View>
        ) : (
          sessions.map((session, index) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionTop}>
                <View style={styles.sessionIcon}>
                  <Ionicons
                    name="timer-outline"
                    size={21}
                    color="#B9F65B"
                  />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>
                    Session {sessions.length - index}
                  </Text>
                  <Text style={styles.date}>
                    {new Date(session.date).toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={styles.duration}>
                {formatTime(session.duration)}
              </Text>

              <View style={styles.sessionFooter}>
                <Text style={styles.laps}>
                  {session.lapCount}{" "}
                  {session.lapCount === 1 ? "lap" : "laps"}
                </Text>
                <Text style={styles.savedLabel}>
                  SAVED
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101311",
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  eyebrow: {
    color: "#B9F65B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  heading: {
    color: "#F4F7F4",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 7,
  },
  subtitle: {
    color: "#89938B",
    fontSize: 13,
    marginTop: 6,
  },
  countBadge: {
    minWidth: 46,
    height: 46,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "#202620",
    borderWidth: 1,
    borderColor: "#343C35",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#B9F65B",
    fontSize: 17,
    fontWeight: "800",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A201C",
    borderWidth: 1,
    borderColor: "#29302A",
    borderRadius: 20,
    padding: 17,
    marginBottom: 29,
    gap: 13,
  },
  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#2B3824",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    color: "#F4F7F4",
    fontSize: 15,
    fontWeight: "700",
  },
  summaryDescription: {
    color: "#89938B",
    fontSize: 12,
    marginTop: 5,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#89938B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  clearText: {
    color: "#FF9B8D",
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF9B8D",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  confirmCard: {
    backgroundColor: "#211A19",
    borderColor: "#63403A",
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
    marginBottom: 16,
  },
  confirmCopy: {
    marginBottom: 14,
  },
  confirmTitle: {
    color: "#F4F7F4",
    fontSize: 14,
    fontWeight: "700",
  },
  confirmDescription: {
    color: "#A1AAA3",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  confirmActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  confirmButton: {
    minHeight: 40,
    minWidth: 88,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: "#202620",
    borderColor: "#343C35",
    borderWidth: 1,
  },
  cancelButtonText: {
    color: "#F4F7F4",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#633A34",
  },
  deleteButtonText: {
    color: "#FFF2EF",
    fontSize: 12,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  listContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#171C18",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#29302A",
    marginTop: 10,
  },
  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#2B3824",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },
  emptyTitle: {
    color: "#F4F7F4",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    color: "#89938B",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },
  sessionCard: {
    backgroundColor: "#1A201C",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#29302A",
    padding: 17,
    marginBottom: 12,
  },
  sessionTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sessionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#2B3824",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    color: "#F4F7F4",
    fontSize: 14,
    fontWeight: "700",
  },
  date: {
    color: "#89938B",
    fontSize: 11,
    marginTop: 5,
  },
  duration: {
    color: "#B9F65B",
    fontSize: 30,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    marginTop: 20,
    marginBottom: 16,
  },
  sessionFooter: {
    borderTopWidth: 1,
    borderTopColor: "#29302A",
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  laps: {
    color: "#A1AAA3",
    fontSize: 12,
  },
  savedLabel: {
    color: "#B9F65B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
