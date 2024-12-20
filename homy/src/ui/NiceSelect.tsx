"use client";
import React, { useState, useCallback, useRef, useEffect, FC, ChangeEvent } from "react";
import { useClickAway } from "react-use";

interface Option {
    value: string;
    text: string;
}

interface NiceSelectProps {
    options: Option[];
    defaultCurrent?: number;
    placeholder: string;
    className?: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
}

const NiceSelect: FC<NiceSelectProps> = ({
                                             options,
                                             defaultCurrent,
                                             placeholder,
                                             className,
                                             onChange,
                                             name,
                                             required,
                                             disabled,
                                             value
                                         }) => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<Option | undefined>(
        defaultCurrent !== undefined ? options[defaultCurrent] : undefined
    );
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (value) {
            const selectedOption = options.find(option => option.value === value);
            if (selectedOption) {
                setCurrent(selectedOption);
            }
        } else {
            setCurrent(undefined);
        }
    }, [value]);

    const onClose = useCallback(() => {
        setOpen(false);
    }, []);

    useClickAway(ref, onClose);

    const currentHandler = (item: Option) => {
        setCurrent(item);
        onChange({ target: { name, value: item.value } } as ChangeEvent<HTMLSelectElement>);
        onClose();
    };

    return (
        <div
            className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""} ${
                disabled ? "disabled" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !disabled) {
                    setOpen((prev) => !prev);
                }
            }}
            ref={ref}
        >
            <span className="current">{current?.text || placeholder}</span>
            {open && (
                <ul
                    className="list"
                    role="menubar"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    {options?.map((item, i) => (
                        <li
                            key={i}
                            data-value={item.value}
                            className={`option ${item.value === current?.value ? "selected focus" : ""}`}
                            role="menuitem"
                            onClick={() => !disabled && currentHandler(item)}
                        >
                            {item.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NiceSelect;