import { getSizing } from "../../../design/sizing";
import { Typography } from "@mui/material";
import {
  FormFourValues,
  FormOneValues,
  FormThreeValues,
  stepFourFormValidation,
  stepOneFormValidation,
  stepThreeFormValidation,
} from "./types";
import { useXNGFormWithValidation } from "../../../hooks/useForm";
import { XNGFormInput } from "../../../design/components-form/textfield";
import Box from "../../../design/components-dev/BoxExtended";
import XNGFormDatePicker from "../../../design/components-form/datepicker";
import { XNGFormSelect } from "../../../design/components-form/select";
import dayjs from "dayjs";
import { XNGFormCheckbox as XNGFormCheckbox } from "../../../design/components-form/check";
import { useState } from "react";
import { StepFourModal, StepFourModalDialog } from "./modal";
import { SchoolCampusRef, ServiceProviderType } from "../../../profile-sdk";
import { FloatingLayout, HEADER_SIZE, NextButtonJustifiedRight, SUBHEADER_SIZE } from "../layout";

export function ZerothView(props: { onNext: () => void }) {
  return (
    <FloatingLayout>
      <Typography variant={HEADER_SIZE}>Finish Setting Up Account</Typography>
      <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
        X Logs is personalized for you. Please ensure all steps are completed for the best
        documentation experience possible!
      </Typography>
      <NextButtonJustifiedRight onNext={props.onNext} />
    </FloatingLayout>
  );
}

export function FirstView(props: {
  onValidNext: (values: FormOneValues) => void;
  apiDependentValues: {
    campusDropdownOptions: SchoolCampusRef[];
  };
}) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useXNGFormWithValidation<FormOneValues>({ validationSchema: stepOneFormValidation });

  return (
    <FloatingLayout>
      <Typography variant="overline">Step 1 of 3</Typography>
      <Typography variant={HEADER_SIZE}>Fill out About You Information</Typography>
      <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
        Below is information that will inform your profile and permissions. Please ensure it is
        filled out and correct.
      </Typography>
      <Box sx={{ paddingTop: getSizing(3), paddingBottom: getSizing(2) }}>
        <Typography variant={SUBHEADER_SIZE}>About You</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
        <XNGFormInput
          name="firstName"
          label="First Name"
          control={control}
          register={register}
          useError={{ message: errors.firstName?.message }}
        />
        <XNGFormInput
          name="lastName"
          label="Last Name"
          control={control}
          register={register}
          useError={{ message: errors.lastName?.message }}
        />
        <XNGFormInput
          name="email"
          label="Email Address"
          control={control}
          register={register}
          useError={{ message: errors.email?.message }}
        />
        <XNGFormInput
          name="jobTitle"
          label="Job Title"
          control={control}
          register={register}
          useError={{ message: errors.jobTitle?.message }}
        />
        <XNGFormInput
          name="npi"
          label="NPI"
          placeholder="Optional..."
          control={control}
          register={register}
          useError={{ message: errors.npi?.message }}
        />
        <XNGFormInput
          name="stateMedicaidNumber"
          label="State Medicaid Number"
          placeholder="Optional..."
          control={control}
          register={register}
          useError={{ message: errors.stateMedicaidNumber?.message }}
        />
        <XNGFormSelect<FormOneValues, SchoolCampusRef>
          getOptionLabel={(campus: SchoolCampusRef) => campus.name!}
          setValue={setValue}
          watch={watch}
          control={control}
          label="Primary Campus"
          name="primaryCampus"
          items={props.apiDependentValues.campusDropdownOptions}
          useError={{ message: errors.primaryCampus?.message }}
        />
        <NextButtonJustifiedRight
          onNext={() => {
            handleSubmit(props.onValidNext)();
          }}
        />
      </Box>
    </FloatingLayout>
  );
}

// export function SecondView(props: { onValidNext: (values: FormTwoValues) => void }) {
//   const {
//     register,
//     control,
//     formState: { errors },
//     handleSubmit,
//   } = useXNGFormWithValidation<FormTwoValues>({ validationSchema: stepTwoFormValidation });

//   return (
//     <FloatingLayout>
//       <Typography variant="overline">Step 2 of 4</Typography>
//       <Typography variant={HEADER_SIZE}>Key in your Password Reset details</Typography>
//       <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
//         The information below will allow you to reset your password with ease!
//       </Typography>
//       <Box sx={{ paddingTop: getSizing(3), paddingBottom: getSizing(2) }}>
//         <Typography variant={SUBHEADER_SIZE}>Contact Information</Typography>
//       </Box>
//       <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
//         <XNGFormInput
//           name="email"
//           label="Email Address"
//           control={control}
//           register={register}
//           useError={{ message: errors.email?.message }}
//         />
//         <XNGFormInput
//           name="phoneNumber"
//           label="Phone Number"
//           control={control}
//           register={register}
//           useError={{ message: errors.phoneNumber?.message }}
//         />
//       </Box>
//       <NextButtonJustifiedRight
//         onNext={() => {
//           handleSubmit(props.onValidNext)();
//         }}
//       />
//     </FloatingLayout>
//   );
// }

export function ThirdView(props: {
  onValidNext: (values: FormThreeValues) => void;
  onSkip: () => void;
  apiDependentValues: {
    licenseTypeDropdownOptions: ServiceProviderType[];
  };
}) {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useXNGFormWithValidation<FormThreeValues>({ validationSchema: stepThreeFormValidation });

  return (
    <FloatingLayout>
      <Typography variant="overline">Step 2 of 3</Typography>
      <Typography variant={HEADER_SIZE}>Provide your Licensing Information</Typography>
      <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
        If you are a <b>therapist</b>, we need your license information in order to bill Medicaid.
        Please enter your licensing details below.
      </Typography>
      <Box sx={{ paddingTop: getSizing(3), paddingBottom: getSizing(2) }}>
        <Typography variant={SUBHEADER_SIZE}>Licensing Information</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
        <XNGFormInput
          name="nameOnLicense"
          label="Name on License"
          control={control}
          register={register}
          useError={{ message: errors.nameOnLicense?.message }}
        />
        <XNGFormSelect<FormThreeValues, ServiceProviderType>
          getOptionLabel={(i) => i.name!}
          control={control}
          items={props.apiDependentValues.licenseTypeDropdownOptions}
          watch={watch}
          setValue={setValue}
          name="licenseType"
          label="License Type"
          useError={{ message: errors.licenseType?.message }}
        />
        <XNGFormInput
          name="licenseNumber"
          label="License Number"
          control={control}
          register={register}
          useError={{ message: errors.licenseNumber?.message }}
        />
        <XNGFormDatePicker
          defaultValue={dayjs()}
          name="licenseExpirationDate"
          label="License Expiration Date"
          control={control}
          useError={{ message: errors.licenseExpirationDate?.message }}
        />
      </Box>
      <NextButtonJustifiedRight
        onSkip={() => props.onSkip()}
        onNext={() => {
          handleSubmit(props.onValidNext)();
        }}
      />
    </FloatingLayout>
  );
}

export function FourthView(props: {
  onValidNext: (values: FormFourValues) => void;
  apiDependentValues: {
    ferpaAuthorizationStatement: string;
    trueAndAccurateDataAuthorization: string;
    electronicSignatureConsent: string;
  };
}) {
  const {
    formState: { errors },
    watch,
    control,
    setValue,
    handleSubmit,
    trigger,
  } = useXNGFormWithValidation<FormFourValues>({ validationSchema: stepFourFormValidation });
  // ----- STATES -----
  // MODAL

  const [modal, setModal] = useState<StepFourModal>("");

  // CONFIRMATION STATEMENTS

  return (
    <>
      <StepFourModalDialog
        // Modal
        open={modal === "FERPAAuthorizationStatement"}
        onClose={() => setModal("")}
        // RHF
        name="FERPAAuthorizationStatement"
        trigger={trigger}
        setValue={setValue}
        // DOM
        title="FERPA Authorization Statement"
        text={props.apiDependentValues.ferpaAuthorizationStatement}
        buttonText="I Authorize"
      />
      <StepFourModalDialog
        // Modal
        open={modal === "trueAccurateDataAuthorization"}
        onClose={() => setModal("")}
        // RHF
        name="trueAccurateDataAuthorization"
        trigger={trigger}
        setValue={setValue}
        // DOM
        title="True & Accurate Data Authorization"
        text={props.apiDependentValues.trueAndAccurateDataAuthorization}
        buttonText="I Confirm"
      />
      <StepFourModalDialog
        // Modal
        open={modal === "electronicSignatureConsent"}
        onClose={() => setModal("")}
        // RHF
        name="electronicSignatureConsent"
        trigger={trigger}
        setValue={setValue}
        // DOM
        title="Electronic Signature Consent"
        text={props.apiDependentValues.electronicSignatureConsent}
        useSignatureValidation
        buttonText="I Agree"
      />
      <FloatingLayout>
        <Typography variant="overline">Step 3 of 3</Typography>
        <Typography variant={HEADER_SIZE}>Sign the Authorization Statements</Typography>
        <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
          You’re almost done! We just need to grab a few signatures before you can access your
          account.
        </Typography>
        <Box sx={{ paddingTop: getSizing(3), paddingBottom: getSizing(2) }}>
          <Typography variant={SUBHEADER_SIZE}>Signatures Required:</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: getSizing(2) }}>
          <Box
            onClick={() => {
              if (!watch("FERPAAuthorizationStatement")) {
                setModal("FERPAAuthorizationStatement");
              }
            }}
          >
            <XNGFormCheckbox
              readonly
              disabled={watch("FERPAAuthorizationStatement")}
              name="FERPAAuthorizationStatement"
              control={control}
              label="FERPA Authorization Statement"
              useError={{ message: errors.FERPAAuthorizationStatement?.message }}
            />
          </Box>
          <Box
            onClick={() => {
              if (!watch("trueAccurateDataAuthorization")) {
                setModal("trueAccurateDataAuthorization");
              }
            }}
          >
            <XNGFormCheckbox
              readonly
              disabled={watch("trueAccurateDataAuthorization")}
              name="trueAccurateDataAuthorization"
              control={control}
              label="True & Accurate Data Authorization"
              useError={{ message: errors.trueAccurateDataAuthorization?.message }}
            />
          </Box>
          <Box
            onClick={() => {
              if (!watch("electronicSignatureConsent")) {
                setModal("electronicSignatureConsent");
              }
            }}
          >
            <XNGFormCheckbox
              readonly
              disabled={watch("electronicSignatureConsent")}
              name="electronicSignatureConsent"
              control={control}
              label="Electronic Signature Consent"
              useError={{ message: errors.electronicSignatureConsent?.message }}
            />
          </Box>
        </Box>
        <NextButtonJustifiedRight
          onNext={async () => {
            const valid = await trigger();
            if (valid) {
              handleSubmit(props.onValidNext)();
            }
          }}
        />
      </FloatingLayout>
    </>
  );
}

export function FifthView(props: { onNext: () => void }) {
  return (
    <FloatingLayout>
      <Typography variant={HEADER_SIZE}>Congratulations!</Typography>
      <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
        Your account set up is now complete! Please hit continue to access X Logs.
      </Typography>
      <NextButtonJustifiedRight onNext={() => props.onNext()} />
    </FloatingLayout>
  );
}
