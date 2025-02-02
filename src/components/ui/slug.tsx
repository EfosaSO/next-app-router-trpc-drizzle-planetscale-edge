import * as React from "react";
import { useController, useWatch } from "react-hook-form";
import { api } from "~/lib/api/client";
import { slugify } from "~/lib/utils";

import type { FieldProps } from "./field";
import { Input } from "./input";

type Props = Pick<FieldProps<any>, "control" | "name" | "onError"> & {
  className?: string;
};

const SlugInputField = React.forwardRef<HTMLInputElement, Props>(
  ({ className, control, onError, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const nameField = useWatch({ name: "name", control });
    const { field } = useController({
      name: props.name,
      control,
    });

    const initialValue = React.useRef(field.value);

    api.organisations.checkOrganisationSlug.useQuery(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        slug: field.value,
      },
      {
        enabled: !!field.value && field.value !== initialValue.current,
        onSuccess({ available }) {
          if (!available) {
            onError?.(field.name, {
              type: "manual",
              message: "Slug already taken",
            });
          }
        },
      }
    );

    React.useEffect(() => {
      if (nameField && !initialValue.current) {
        field.onChange?.({
          target: {
            name: field.name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            value: slugify(nameField),
          },
        });
      }
    }, [nameField]);

    return <Input {...props} {...field} ref={ref} />;
  }
);
SlugInputField.displayName = "SlugInputField";

export { SlugInputField };
