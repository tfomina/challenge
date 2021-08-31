import React, {useEffect, useState, useRef} from "react";

interface IStopwatchProps {}

interface IStopwatchState {
    status: boolean;
    runningTime: number;
    timestamps: string[];
}

const initialState: IStopwatchState = {
    status: false,
    runningTime: 0,
    timestamps: [],
};

const Stopwatch: React.FC<IStopwatchProps> = () => {
    const [watchData, setWatchData] = useState<IStopwatchState>(initialState);

    const timer: any = useRef();

    useEffect(() => {
        return () => {
            clearInterval(timer.current);
        };
    }, []);

    const getUnits = (time: number) => {
        const seconds = time / 1000;

        const min = Math.floor(seconds / 60).toString();
        const sec = Math.floor(seconds % 60).toString();
        const msec = (seconds % 1).toFixed(3).substring(2);

        return `${min}:${sec}:${msec}`;
    };

    const handleClick = () => {
        const {status} = watchData;

        if (!status) {
            const startTime = Date.now() - watchData.runningTime;
            timer.current = setInterval(() => {
                setWatchData((prevState) => ({
                    ...prevState,
                    status: true,
                    runningTime: Date.now() - startTime,
                }));
            });
        } else {
            clearInterval(timer.current);
            setWatchData((prevState) => ({...prevState, status: false}));
        }
    };

    const handleReset = () => {
        clearInterval(timer.current);
        setWatchData({...initialState});
    };

    const handleLap = () => {
        const timestamp = getUnits(watchData.runningTime);
        console.log(timestamp);
        setWatchData((prevState) => ({
            ...prevState,
            timestamps: [...watchData.timestamps, timestamp],
        }));
    };

    return (
        <>
            <p>{getUnits(watchData.runningTime)}</p>
            <button onClick={handleClick}>
                {watchData.status ? "Stop" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleLap}>Lap</button>
            {watchData.timestamps.length > 0 && (
                <ul>
                    {watchData.timestamps.map((t, index) => (
                        <li key={index}>{t}</li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default Stopwatch;
