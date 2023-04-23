"use client";

import { Fragment, forwardRef, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  Combobox as ACombobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import clsx from "clsx";

import Spinner from "../Spinner";
import styles from "./Combobox.module.css";

export type Item = {
  label: string;
  value: string;
};

interface Props {
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  items: Item[];
  value?: string;
  displayValue?: string;
  showWithItems?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Combobox = forwardRef<HTMLInputElement, Props>(
  (
    {
      items: initialItems,
      placeholder,
      displayValue,
      className,
      value,
      loading,
      disabled,
      showWithItems,
      onChange,
    },
    ref
  ) => {
    const items = initialItems.filter((item) => item.value !== value);
    const [isFocussed, setIsFocussed] = useState(false);
    const combobox = useComboboxState({
      gutter: 4,
      sameWidth: true,
      setValue: onChange,
      value,
      open: items.length > 0 && isFocussed,
    });

    return (
      <>
        <section className={clsx("flex flex-1", styles.loading && loading)}>
          {loading && (
            <section className={styles.spinner}>
              <Spinner />
            </section>
          )}
          <ACombobox
            ref={ref}
            state={combobox}
            placeholder={placeholder}
            className={clsx(styles.combobox, className)}
            value={displayValue}
            disabled={disabled}
            onFocus={() => setIsFocussed(true)}
            onBlur={() => {
              onChange(value ?? "");
              combobox.setOpen(false);
              setIsFocussed(false);
            }}
          />
        </section>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={(items.length > 0 && !!showWithItems) || items.length > 0}
          afterLeave={() => onChange(value ?? "")}
        >
          <ComboboxPopover
            state={combobox}
            className={styles.popover}
            disabled={disabled}
          >
            {items.length === 0 && displayValue !== "" && (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            )}
            {items.map(({ label, value }) => (
              <ComboboxItem
                key={value}
                className={styles["combobox-item"]}
                value={value}
              >
                {label}
              </ComboboxItem>
            ))}
          </ComboboxPopover>
        </Transition>
      </>
    );
  }
);

Combobox.displayName = "Combobox";

export default Combobox;
