import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "stopwatch_sessions";
const LEGACY_STORAGE_KEY = "stopwatch_session";

export type StopwatchSession = {
    id: string;
    date: string;
    duration: number;
    lapCount: number;
};

export async function saveSession(
    session: StopwatchSession
): Promise<void> {
    const sessions = await getSessions();
    
    await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
            session,
            ...sessions.filter((savedSession) => savedSession.id !== session.id),
        ])
    );
}

export async function getSessions(): Promise<StopwatchSession[]> {
    const [saved, legacySaved] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(LEGACY_STORAGE_KEY),
    ]);
    const sessions: StopwatchSession[] = [];
    const seenIds = new Set<string>();

    for (const value of [saved, legacySaved]) {
        if (!value) continue;

        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            throw new Error("Saved stopwatch history is invalid.");
        }

        for (const session of parsed as StopwatchSession[]) {
            if (!seenIds.has(session.id)) {
                seenIds.add(session.id);
                sessions.push(session);
            }
        }
    }

    return sessions;
}

export async function clearSessions(): Promise<void> {
    await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY),
        AsyncStorage.removeItem(LEGACY_STORAGE_KEY),
    ]);
}