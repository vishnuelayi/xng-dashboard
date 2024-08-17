import { yupResolver } from "@hookform/resolvers/yup";
import { DeepPartial, FieldValues, useForm } from "react-hook-form";
import { AnyObject, ObjectSchema } from "yup";

export function useXNGFormWithValidation<T extends FieldValues>(props: {
  validationSchema: ObjectSchema<any, AnyObject, any, "">;
  defaultValues?: DeepPartial<T> | undefined;
}) {
  return useForm<T>({
    resolver: yupResolver(props.validationSchema),
    mode: "onChange",
    defaultValues: props.defaultValues,
  });
}

export function useXNGForm<T extends FieldValues>() {
  return useForm<T>();
}
