import * as React from "react";
import { FieldPath, useController } from "react-hook-form";
import usePlacesAutocomplete, { getGeocode } from "use-places-autocomplete";
import { CreateOrganisationWithLocationResponse } from "~/lib/interfaces";

import Combobox, { Item } from "./combo-box";
import { FieldProps } from "./field";

type Props = Pick<FieldProps<any>, "control" | "name">;

type GeocoderResult = Awaited<ReturnType<typeof getGeocode>>[number];

const PlacesInputField = React.forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const isInitialisedRef = React.useRef(false);
    const [name] = props.name?.split(".placeId") ?? [];

    const addressName = name?.includes("placeId") ? "address" : name;
    const postcodeName = name?.includes("placeId") ? "postcode" : name;

    const { field: placeIdField } = useController({
      name: props.name as FieldPath<CreateOrganisationWithLocationResponse>,
      control: props.control,
    });
    const { field: addressField } = useController({
      name: addressName as FieldPath<CreateOrganisationWithLocationResponse>,
      control: props.control,
    });
    const { field: postcodeField } = useController({
      name: postcodeName as FieldPath<CreateOrganisationWithLocationResponse>,
      control: props.control,
    });

    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({ callbackName: "initMap", debounce: 300 });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      clearSuggestions();
      // Update the keyword of the input element
      setValue(e.target.value);
    };

    const handleSelect = ({ label, value }: Item) => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(label, false);
      placeIdField.onChange?.({
        target: {
          name: placeIdField.name,
          value: value,
        },
      });
      addressField.onChange({
        target: {
          name: addressField.name,
          value: label,
        },
      });

      // Get latitude and longitude via utility functions
      getGeocode({ address: label }).then((results) => {
        const result: GeocoderResult = results[0];
        const postCode = result.address_components.find(
          (component: { types: string[] }) =>
            component.types[0] === "postal_code"
        );
        postcodeField.onChange({
          target: {
            name: postcodeField.name,
            value: postCode?.long_name,
          },
        });
      });
    };

    const places =
      status === "OK"
        ? data.map((suggestion) => {
            const { place_id, description } = suggestion;

            return {
              label: description,
              value: place_id,
            };
          })
        : [
            ...(placeIdField.value &&
              addressField.value && [
                {
                  label: addressField.value,
                  value: placeIdField.value,
                },
              ]),
          ];

    React.useEffect(() => {
      if (ready) {
        const foundItem = places.find(
          (place) => place.value === placeIdField.value
        );
        if (foundItem && !value && !isInitialisedRef.current) {
          setValue(foundItem.label, false);
          isInitialisedRef.current = true;
        }
      }
    }, [places, ready, placeIdField.value, value]);

    return (
      <>
        <Combobox
          ref={ref}
          name={props.name}
          value={placeIdField.value as string}
          displayValue={value || addressField.value}
          onChange={handleInput}
          onSelect={handleSelect}
          disabled={!ready}
          placeholder="Search by postcode or address"
          items={places}
        />
      </>
    );
  }
);
PlacesInputField.displayName = "PlacesInputField";

export { PlacesInputField };
