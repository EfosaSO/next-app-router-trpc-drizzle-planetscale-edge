import * as React from "react";
import { Location } from "@prisma/client";
import { useController } from "react-hook-form";
import { api } from "~/lib/api/client";

import Combobox from "./Combobox/Combobox";
import { FieldProps } from "./field";

type Props = Pick<FieldProps<any>, "control" | "name">;

const initialLocations: Location[] = [];

const LocationInputField = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const isInitialisedRef = React.useRef(false);
    const { field } = useController({
      name: props.name,
      control: props.control,
    });
    const [query, setQuery] = React.useState("");
    const { data: locations = initialLocations, isLoading } =
      api.organisations.getCurrentUserOrganisationLocations.useQuery({
        query,
      });

    const handleChange = (value: string) => {
      const selected = locations.find((location) => location.id === value);
      if (selected) {
        field.onChange?.({
          target: {
            name: field.name,
            value: selected.id,
          },
        });
        return setQuery(selected.address!);
      }
      return setQuery(value);
    };

    React.useEffect(() => {
      if (!isLoading) {
        const foundItem = locations.find(
          (location) => location.id === field.value
        );
        if (foundItem && !query && !isInitialisedRef.current) {
          setQuery(foundItem.address!);
          isInitialisedRef.current = true;
        }
      }
    }, [locations, isLoading, field.value, query]);

    return (
      <>
        <Combobox
          ref={ref}
          {...props}
          value={field.value}
          displayValue={query}
          loading={isLoading}
          onChange={handleChange}
          placeholder="Where are you going?"
          items={locations.map((location) => ({
            label: location.address!,
            value: location.id,
          }))}
        />
      </>
    );
  }
);
LocationInputField.displayName = "LocationInputField";

export { LocationInputField };
