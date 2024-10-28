"use client";
import React, { useState, useCallback, useRef, FC, ChangeEvent } from "react";
import { useClickAway } from "react-use";

interface Option {
  value: string;
  text: string;
}

type NiceSelectProps = {
  options: Option[];
  defaultCurrent: number;
  placeholder: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  required?: boolean; // Đổi từ require thành required
  disabled?: boolean; // Thêm thuộc tính disabled
};

const NiceSelect: FC<NiceSelectProps> = ({
  options,
  defaultCurrent,
  placeholder,
  className,
  onChange,
  name,
  required,
  disabled, // Thêm thuộc tính này
}) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Option>(options[defaultCurrent]);
  const ref = useRef<HTMLDivElement | null>(null);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useClickAway(ref, onClose);

  const currentHandler = (item: Option) => {
    setCurrent(item);
    onChange({ target: { value: item.value } } as ChangeEvent<HTMLSelectElement>);
    onClose();
  };

  return (
    <div
      className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => !disabled && setOpen((prev) => !prev)} // Ngăn chặn mở khi disabled
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
              style={{ fontSize: '14px' }}
              role="menuitem"
              onClick={() => !disabled && currentHandler(item)} // Ngăn chặn chọn khi disabled
              onKeyDown={(e) => e.stopPropagation()}
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