import { UseFormSetValue, FieldValues, Path, PathValue, UseFormTrigger } from "react-hook-form";
import { Dialog, Typography } from "@mui/material";
import { XNGFormInput } from "../../../design/components-form/textfield";
import * as yup from "yup";
import { useXNGFormWithValidation } from "../../../hooks/useForm";
import { getSizing } from "../../../design/sizing";
import Box from "../../../design/components-dev/BoxExtended";
import XNGButton from "../../../design/low-level/button";

export const signatureFormValidation = yup.object().shape({
  signature: yup.string().required("Must sign consent form before continuing"),
});
interface SignatureForm {
  signature: string;
}

export type StepFourModal =
  | ""
  | "FERPAAuthorizationStatement"
  | "trueAccurateDataAuthorization"
  | "electronicSignatureConsent";
export function StepFourModalDialog<T extends FieldValues>(props: {
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  text: string;
  title: string;
  name: Path<T>;
  buttonText: string;
  useSignatureValidation?: boolean;
}) {
  const { register, control, trigger, formState } = useXNGFormWithValidation<SignatureForm>({
    validationSchema: signatureFormValidation,
  });

  return (
    <Dialog maxWidth="sm" open={props.open} onClose={() => props.onClose()}>
      <Box sx={{ width: "100%", padding: getSizing(2) }}>
        <Typography variant="h5">{props.title}</Typography>
        <Box sx={{ paddingY: getSizing(2) }}>{props.text}</Box>
        {props.useSignatureValidation && (
          <Box sx={{ marginBottom: getSizing(3), marginTop: getSizing(2) }}>
            <XNGFormInput
              register={register}
              name="signature"
              label="Signature"
              control={control}
              useError={{ message: formState.errors.signature?.message }}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
          <XNGButton
            onClick={async () => {
              if (props.useSignatureValidation) {
                const signed = await trigger();
                if (!signed) return;
              }
              props.onClose();
              props.setValue(props.name, true as PathValue<T, Path<T>>);
              props.trigger(props.name as PathValue<T, Path<T>>);
            }}
          >
            {props.buttonText}
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
