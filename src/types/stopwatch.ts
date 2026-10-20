export type StopwatchStatus = "idle" | "running" | "paused";

export type Lap = {
    id: number;
    lapNumber: number;
    splitTime: number;
    totalTime: number;
};

export type StopwatchState = {
    elapsedtime: number;
    status: StopwatchStatus;
    laps: Lap[];
};