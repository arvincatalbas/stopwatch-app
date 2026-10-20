import { StyleSheet, Text, View } from "react-native";
import { formatTime } from "../utils/formatTime";

type Props = {
    elapsedTime: number;
    running: boolean;
    paused: boolean;
    diameter: number;
    compact: boolean;
};

export default function StopwatchDisplay({
    elapsedTime,
    running,
    paused,
    diameter,
    compact,
}: Props) {
    const markers = Array.from({ length: 60 }, (_, index) => {
        const angle = (index / 60) * Math.PI * 2;
        const major = index % 5 === 0;
        const markerWidth = major ? 2 : 1;
        const markerHeight = major ? 8 : 4;
        const radius = diameter / 2 - 7;

        return {
            index,
            major,
            markerWidth,
            markerHeight,
            left: diameter / 2 + Math.sin(angle) * radius - markerWidth / 2,
            top: diameter / 2 - Math.cos(angle) * radius - markerHeight / 2,
            rotation: `${index * 6}deg`,
        };
    });

    return (
        <View
            style={[
                styles.container,
                { paddingVertical: compact ? 8 : 16 },
            ]}
        >
            <View
                style={[
                    styles.ring,
                    { width: diameter, height: diameter },
                    running && styles.activeRing,
                ]}
            >
                {markers.map((marker) => (
                    <View
                        key={marker.index}
                        style={[
                            styles.marker,
                            marker.major && styles.majorMarker,
                            running && marker.index % 5 === 0 && styles.activeMarker,
                            {
                                width: marker.markerWidth,
                                height: marker.markerHeight,
                                left: marker.left,
                                top: marker.top,
                                transform: [{ rotate: marker.rotation }],
                            },
                        ]}
                    />
                ))}

                <View style={[styles.face, { width: diameter - 34 }]}>
                    <Text style={styles.label}>TIME ELAPSED</Text>

                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={[
                            styles.time,
                            {
                                fontSize: Math.min(
                                    compact ? 38 : 48,
                                    Math.max(32, (diameter - 34) * 0.17)
                                ),
                            },
                        ]}
                    >
                        {formatTime(elapsedTime)}
                    </Text>

                    <View style={styles.statusRow}>
                        <View
                            style={[
                                styles.dot,
                                running && styles.activeDot,
                                paused && styles.pausedDot,
                            ]}
                        />
                        <Text style={[styles.status, running && styles.activeStatus]}>
                            {running ? "RUNNING" : paused ? "PAUSED" : "READY"}
                        </Text>
                    </View>

                    <Text style={styles.hint}>
                        {running
                            ? "Stay in your rhythm."
                            : paused
                              ? "Pick up where you left off."
                              : "A fresh start is one tap away."}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    ring: {
        maxWidth: "100%",
        borderRadius: 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121712",
    },
    activeRing: {
        backgroundColor: "#151C13",
    },
    marker: {
        position: "absolute",
        borderRadius: 2,
        backgroundColor: "#29322B",
    },
    majorMarker: {
        backgroundColor: "#465247",
    },
    activeMarker: {
        backgroundColor: "#B9F65B",
    },
    face: {
        aspectRatio: 1,
        borderRadius: 200,
        borderWidth: 1,
        borderColor: "#303A31",
        backgroundColor: "#171C18",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
    },
    label: {
        color: "#9BA69D",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 2.3,
        marginBottom: 14,
    },
    time: {
        color: "#F4F7F4",
        fontSize: 50,
        fontWeight: "500",
        fontVariant: ["tabular-nums"],
        letterSpacing: -2,
        width: "100%",
        textAlign: "center",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginTop: 16,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#8A948C",
    },
    activeDot: {
        backgroundColor: "#B9F65B",
    },
    pausedDot: {
        backgroundColor: "#E9B966",
    },
    status: {
        color: "#A1AAA3",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1.8,
    },
    activeStatus: {
        color: "#B9F65B",
    },
    hint: {
        color: "#89938B",
        fontSize: 11,
        marginTop: 12,
    },
});