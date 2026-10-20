import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
    backgroundColor: "#101311",
    tabBackground: "#171C18",
    accent: "#B9F65B",
    muted: "#89938B",
    border: "#29302A",
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.muted,
                tabBarStyle: {
                    backgroundColor: COLORS.tabBackground,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    height: 82,
                    paddingTop: 10,
                    paddingBottom: 20,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                    marginTop: 3,
                },
                sceneStyle: {
                    backgroundColor: COLORS.backgroundColor,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Stopwatch",
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? "timer" : "timer-outline"}
                            size={size}
                            color={focused ? COLORS.accent : COLORS.muted}
                        />
                    ),
                    tabBarAccessibilityLabel: "Stopwatch tab",
                }}
            />
        
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? "time" : "time-outline"}
                            size={size}
                            color={focused ? COLORS.accent : COLORS.muted}
                        />
                    ),
                    tabBarAccessibilityLabel: "Session history tab",
                }}
            />
        
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Setting",
                    tabBarIcon: ({ size, focused }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            size={size}
                            color={focused ? COLORS.accent : COLORS.muted}
                        />
                    ),
                    tabBarAccessibilityLabel: "Settings tab",
                }}
            />
        </Tabs>
    );
}