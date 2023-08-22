"use client";

import React, {useEffect, useState} from "react";
import {X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

import _ from "lodash";

type MultiInputValue = {
  value: string;
  formattedValue: string | React.ReactNode;
};

type MultiInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  itemIcon?: React.ReactNode | ((Value: string) => React.ReactNode);
  isValueValid?: (value: string) => boolean;
  formatItem?: (value: string) => string | React.ReactNode;
};

export function MultiInput(props: MultiInputProps) {
  const [value, setValue] = useState<MultiInputValue[]>([]);

  useEffect(() => {
    const newValue = props.value.map((v) => ({
      value: v,
      formattedValue: undefined,
    }));
    setValue(newValue);
  }, [props.value]);

  const formatItems = async (values: MultiInputValue[]) => {
    const newValue = [...values];
    if (props.formatItem !== undefined) {
      for (let i = 0; i < newValue.length; i++) {
        newValue[i].formattedValue = props.formatItem(newValue[i].value);
      }
      setValue(newValue);
      console.log(newValue);
    }
  };

  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") return;

    if (e.key === "Enter") {
      e.preventDefault();
      if (props.isValueValid && !props.isValueValid(e.currentTarget.value)) {
        e.currentTarget.value = "";
        return;
      }
      const newValue = [...value];
      newValue.push({
        value: e.currentTarget.value,
        formattedValue: undefined,
      });
      setValue(newValue);
      props.onChange(newValue.map((v) => v.value));
      e.currentTarget.value = "";
      formatItems(newValue);
    }
  };

  const removeItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
    props.onChange(newValue.map((v) => v.value));
    formatItems(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder={props.placeholder ?? "Add item"}
        disabled={props.disabled}
        onKeyDown={onEnter}
      />
      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
        {value.map((v, i) => (
          <div
            key={_.uniqueId()}
            className="flex gap-2 items-center hover:bg-accent transition px-2 rounded-md"
          >
            {typeof props.itemIcon === "function"
              ? props.itemIcon(v.value)
              : props.itemIcon ?? null}
            {/* await props.formatItem(v) */}
            <div className="flex-1 text-sm">{v.formattedValue ?? v.value}</div>
            <Button variant="ghost" size="icon" onClick={() => removeItem(i)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
