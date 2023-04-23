import { Fragment, forwardRef, useMemo, useState } from "react";
import { Combobox as HCombobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { type FieldProps } from "./field";
import { Input } from "./input";

export type Item = {
  label: string;
  value: string;
};

type Props = {
  items: Item[];
  value: string;
  displayValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (item: Item) => void;
  disabled?: boolean;
  showWithItems?: boolean;
  placeholder?: string;
} & Pick<FieldProps<any>, "name">;

const Combobox = forwardRef<HTMLInputElement, Props>(
  ({ items, value, showWithItems, displayValue, onSelect, ...props }, ref) => {
    const [query, setQuery] = useState(displayValue ?? "");
    const [isFocussed, setIsFocussed] = useState(false);

    const filteredItems =
      query === ""
        ? items
        : items.filter((item) =>
            item.label
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          );

    const selected = useMemo(() => {
      const foundItem = items.find((item) => item.value === value);
      return foundItem?.value ?? "";
    }, [value, items]);

    return (
      <>
        <HCombobox
          value={selected}
          onChange={(chosenValue) => {
            const chosen = chosenValue as unknown as Item;
            onSelect(chosen);
            setQuery("");
          }}
        >
          <div className="relative mt-1">
            <div>
              <HCombobox.Input
                {...props}
                ref={ref}
                displayValue={(item) => {
                  if (typeof item === "string") {
                    const foundItem = items.find((i) => i.value === item);
                    return foundItem?.label ?? "";
                  }
                  return (item as Item).label;
                }}
                onFocus={() => setIsFocussed(true)}
                onBlurCapture={() => setIsFocussed(false)}
                onChange={(event) => {
                  props.onChange(event);
                  setQuery(event.target.value);
                }}
                as={Input}
              />
              {!query && items.length > 0 && (
                <HCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </HCombobox.Button>
              )}
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
              show={
                (items.length > 0 && showWithItems) ||
                (items.length > 0 && query !== "" && isFocussed)
              }
            >
              <HCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredItems.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <HCombobox.Option
                      key={item.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 px-4 ${
                          active ? "bg-teal-600 text-white" : "text-gray-900"
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {item.label}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-4 flex items-center pr-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </HCombobox.Option>
                  ))
                )}
              </HCombobox.Options>
            </Transition>
          </div>
        </HCombobox>
      </>
    );
  }
);

Combobox.displayName = "Combobox";

export default Combobox;
