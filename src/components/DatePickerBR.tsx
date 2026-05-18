/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { useValidation, validateDate } from "@mui/x-date-pickers/validation";
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from "@mui/x-date-pickers/hooks";
import useForkRef from "@mui/utils/useForkRef";

type Props = {
  value: Dayjs | null;
  variant: "dark" | "light";
  onChange: (newValue: Dayjs | null) => void;
};

function ButtonDateField(props: any) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, "date");
  const {
    slotProps: _slotProps,
    inputRef: _inputRef,
    ...safeForwarded
  } = forwardedProps;

  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const parsedFormat = useParsedFormat();

  const { hasValidationError } = useValidation({
    validator: validateDate,
    value: pickerContext.value,
    timezone: pickerContext.timezone,
    // @ts-expect-error MUI internal type not exported
    props: internalProps,
  });

  const valueStr =
    pickerContext.value == null
      ? parsedFormat
      : pickerContext.value.format(pickerContext.fieldFormat);

  return (
    <Button
      {...safeForwarded}
      variant="outlined"
      color={hasValidationError ? "error" : "primary"}
      ref={handleRef}
      className={pickerContext.rootClassName}
      sx={{
        width: "80%",
        height: "100%",
        fontSize: 16,
        backgroundColor:
          props.variant == "dark" ? "#fff" : "rgba(100,100,100,0.1)",
        border: "none",
        color: props.variant == "dark" ? "#4c4c4c" : "#fff",
        fontWeight: "bold",
        textTransform: "none",
        boxShadow: props.variant == "dark" ? "0px 0px 8px rgba(0, 0, 0, 0.25)": "inset 1px 1px 8px rgba(0, 0, 0, 0.2)", // ← sombra interna suave
        borderRadius: "10px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
    >
      {pickerContext.label ? `${pickerContext.label}: ${valueStr}` : valueStr}
    </Button>
  );
}

function ButtonFieldDatePicker(
  props: DatePickerProps<any> & { variant: "dark" | "light" },
) {
  return (
    <DatePicker
      {...props}
      format="DD/MM/YYYY"
      slots={{ field: ButtonDateField }}
      slotProps={{
        field: {
          // @ts-expect-error MUI internal prop not exported
          variant: props.variant,
        },
      }}
    />
  );
}

export default function DatePickerBR({ value, variant, onChange }: Props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={{
        cancelButtonLabel: "Cancelar",
        okButtonLabel: "OK",
      }}
    >
      <ButtonFieldDatePicker
        value={value}
        variant={variant}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}
