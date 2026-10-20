import { useCallback, useEffect, useRef, useState } from "react";
import type { Lap, StopwatchStatus } from "../types/stopwatch";

export function useStopwatch() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [status, setStatus] = useState<StopwatchStatus>("idle");
    const [laps, setLaps] = useState<Lap[]>([]);

    const startTimeRef = useRef(0);
    const accumulatedRef = useRef(0);
    const previousLapTimeRef = useRef(0);
    const lapIdRef = useRef(0);

    useEffect(() => {
        if (status !== "running") return;

        const update = () => {
            setElapsedTime(
                accumulatedRef.current +
                Date.now() -
                startTimeRef.current
            );
        };

        update();
        const timer = setInterval(update, 30);

        return () => clearInterval(timer);
    }, [status]);

    const start = useCallback(() => {
        if (status === "running") return;

        startTimeRef.current = Date.now();
        setStatus("running");
    }, [status]);

    const pause = useCallback(() => {
        if (status !== "running") return;

        const elapsed =
            accumulatedRef.current +
            Date.now() -
            startTimeRef.current;
        
        accumulatedRef.current = elapsed;
        setElapsedTime(elapsed);
        setStatus("paused");
    }, [status]);

    const reset = useCallback(() => {
        accumulatedRef.current = 0;
        previousLapTimeRef.current = 0;
        lapIdRef.current = 0;

        setElapsedTime(0);
        setLaps([]);
        setStatus("idle");
    }, []);

    const recordLap = useCallback(() => {
        if (status !== "running") return;

        const totalTime =
            accumulatedRef.current +
            Date.now() -
            startTimeRef.current;
        
        const splitTime =
            totalTime - previousLapTimeRef.current;
        
        lapIdRef.current += 1;

        const lap: Lap = {
            id: lapIdRef.current,
            lapNumber: lapIdRef.current,
            splitTime,
            totalTime
        };

        previousLapTimeRef.current = totalTime;
        setElapsedTime(totalTime);
        setLaps((current) => [lap, ...current]);
    }, [status]);

    return {
        elapsedTime,
        status,
        laps,
        start,
        pause,
        reset,
        recordLap,
    };
}