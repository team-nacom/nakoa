import React from "react";

export default function useSmoothValue(defaultValue = 0, maxValue = 1, minValue = 0) {
    let [value, setValue] = React.useState<number>(defaultValue);
    let [deltaValue, setDeltaValue] = React.useState<number>(0);

    React.useEffect(() => {
        if (deltaValue !== 0) {
            let nextValue = value + deltaValue;
            if (nextValue >= maxValue) {
                setDeltaValue(0);
                nextValue = maxValue;
            }
            if (nextValue <= minValue) {
                setDeltaValue(0);
                nextValue = minValue;
            }
            setTimeout(() => setValue(nextValue), 25);
        }
    }, [value, deltaValue]);

    return [value, setDeltaValue] as [number, React.Dispatch<React.SetStateAction<number>>];
}
