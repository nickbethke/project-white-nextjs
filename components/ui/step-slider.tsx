import {cn} from "@/lib/utils";
import {uniqueId} from "lodash";
import React from "react";
import {Slider} from "@/components/ui/slider";

type StepSliderProps<T> = {
    steps: {
        label: string;
        value: T;
    }[],
    value: T;
    onChange: (value: T) => void;
}

export function StepSlider<T>({steps, onChange, value}: StepSliderProps<T>) {
    const index = steps.findIndex((step) => step.value === value);

    const count = steps.length;
    React.useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <div className="flex gap-2">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{steps[0].label}</span>
                <Slider className="w-16" value={[index]} min={0} max={count - 1} onValueChange={([index]) => {
                    onChange(steps[index].value);
                }}/>
                <span className="text-xs text-muted-foreground">{steps[count - 1].label}</span>
            </div>
        </div>
    );
}
