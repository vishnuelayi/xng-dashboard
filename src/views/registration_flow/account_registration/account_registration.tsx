import { AccountInfo } from "@azure/msal-browser";
import Box from "../../../design/components-dev/BoxExtended";
import {
  BLUE_BACKGROUND,
  FloatingLayout as FloatingLayout,
  HEADER_SIZE,
  NextButtonJustifiedRight,
  SUBHEADER_SIZE,
} from "../layout";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { getSizing } from "../../../design/sizing";
import { useXNGFormWithValidation } from "../../../hooks/useForm";
import {
  ClientAssignment,
  ClientRef,
  PatchUserRequest,
  RequestAccessToClientRequest,
  ServiceProviderType,
  UserServiceProviderRef,
} from "../../../profile-sdk";
import * as yup from "yup";
import { XNGFormInput } from "../../../design/components-form/textfield";
import { XNGFormSelect } from "../../../design/components-form/select";
import { useEffect, useState } from "react";
import { API_CLIENTS, API_STATESNAPSHOTS, API_USERS } from "../../../api/api";
import { placeholderForFutureLogErrorText } from "../../../temp/errorText";
import { UserRef } from "../../../profile-sdk";
import { useNavigate } from "react-router";
import { Controller } from "react-hook-form";
import { useXNGSelector } from "../../../context/store";
import { selectUser } from "../../../context/slices/userProfileSlice";

const requestDistrictAccessFormValidation = yup.object().shape({
  client: yup
    .object<ClientRef>()
    .typeError("Please select your client account")
    .required("Please select your client account"),
  serviceProviderType: yup
    .object<ServiceProviderType>()
    .typeError("Please select your service provider type"),
});

interface RequestDistrictAccessForm {
  client: ClientRef;
  serviceProviderType: ServiceProviderType;
}

function AccountRegistrationUserOnboardingFlow(props: { account: AccountInfo }) {
  // HOOKS
  const navigate = useNavigate();

  // SELECTORS
  const user = useXNGSelector(selectUser);

  // MSAL ACCOUNT ACCESSOR CONSTANTS
  if (props.account.idTokenClaims === undefined) throw new Error(placeholderForFutureLogErrorText);
  const _oid = props.account.idTokenClaims.oid;
  const _state = props.account.idTokenClaims.state as string;
  const _givenName = props.account.idTokenClaims.given_name as string;
  const _familyName = props.account.idTokenClaims.family_name as string;
  const _email = props.account.idTokenClaims.emails![0] as string;
  const _userIsNew = props.account.idTokenClaims.newUser as boolean;

  // ------------- API -------------
  // API-DEPENDENT STATE
  const [clientAccountsDropdown, setClientAccountsDropdown] = useState<ClientRef[]>([]);
  const [serviceProviderDropdown, setServiceProviderDropdown] = useState<ServiceProviderType[]>([]);
  // STATE SETTERS
  useEffect(() => {
    fetchAndSetStates();
  }, []);
  async function fetchAndSetStates() {
    // user is new
    if (_userIsNew) {
      // await API_USERS.v1UsersPost(state, newUser);
    }
    // get
    const _dropdownServiceProviderType = (
      await API_STATESNAPSHOTS.v1StateSnapshotsByDateServiceProviderTypesGet(_state, undefined)
    ).serviceProviderTypes;
    if (_dropdownServiceProviderType === undefined)
      throw new Error(placeholderForFutureLogErrorText);
    const _dropdownClient = await API_CLIENTS.v1ClientsDropdownOptionsGet(_state);
    if (_dropdownClient.clients === undefined) throw new Error(placeholderForFutureLogErrorText);
    // set
    setServiceProviderDropdown(_dropdownServiceProviderType);
    setClientAccountsDropdown(_dropdownClient.clients);
  }

  // ------------- XNG FORM -------------
  const {
    watch,
    setValue,
    control,
    trigger,
    handleSubmit,
    register,
    formState: { errors },
  } = useXNGFormWithValidation<RequestDistrictAccessForm>({
    validationSchema: requestDistrictAccessFormValidation,
    defaultValues: {
      client: undefined,
    },
  });

  // ------------- ON SUBMIT -------------
  async function onSubmit(data: RequestDistrictAccessForm) {
    // console.log(data);

    // return;

    // Step 1: Add service provider type to their profile, and add empty client assignment if it doesn't already exist.
    const patchUserRequest: PatchUserRequest = {
      serviceProviderType: data.serviceProviderType,
    };

    // If the user doesn't have a client assignment for this client, add one.
    const userDoesNotHaveClientAssignment =
      !user?.clientAssignments ||
      user.clientAssignments.findIndex((ca) => ca!.client!.id === data.client.id) === -1;
    if (userDoesNotHaveClientAssignment) {
      let clientAssignments: ClientAssignment[] = user?.clientAssignments ?? [];

      const clientAssignment: ClientAssignment = {
        client: data.client,
      };

      clientAssignments = [...clientAssignments, clientAssignment];
      patchUserRequest.clientAssignments = clientAssignments;
    }

    await API_USERS.v1UsersIdPatch(_oid!, _state, patchUserRequest);

    // Step 2: Finally, request access
    const requestingUser: UserServiceProviderRef = {
      email: _email,
      firstName: _givenName,
      lastName: _familyName,
      id: _oid,
      serviceProviderType: data.serviceProviderType,
    };
    const requestedClient: ClientRef = data.client;
    const requestAccessToClientRequest: RequestAccessToClientRequest = {
      requestingUser,
      requestedClient,
    };
    await API_USERS.v1UsersRequestAccessToClientPost(_state, requestAccessToClientRequest);

    // Step 3: Navigate to next screen
    // Todo..
    navigate(0);
  }

  // fix for issue Ryan experienced
  function getItemName(itemName: ClientRef | ServiceProviderType): string {
    if (!itemName.name) throw new Error(placeholderForFutureLogErrorText);
    return itemName.name;
  }
  // console.log(clientAccountsDropdown)
  return (
    <>
      {clientAccountsDropdown.length > 0 && (
        <Box sx={BLUE_BACKGROUND}>
          <FloatingLayout>
            <Typography variant={HEADER_SIZE}>Request District Access</Typography>
            <Typography sx={{ marginTop: getSizing(2), textAlign: "justify" }} variant="body1">
              It looks like your email address is not associated with a district account. Please
              select an Account below to request access from your district administrator.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: getSizing(3),
                paddingTop: getSizing(4),
                paddingBottom: getSizing(2),
              }}
            >
              {/* <XNGFormSelect
                name="client"
                label="Client Accounts"
                control={control}
                useError={{ message: errors.client?.message }}
                items={clientAccountsDropdown}
                watch={watch}
                setValue={setValue}
                defaultValue={undefined}
                getOptionLabel={(i) => getItemName(i)}
              /> */}
              <Controller
                name="client"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <InputLabel
                      id="cs-gender-select-label"
                      sx={{
                        height: "fit-content",
                        top: -9,
                        "&.Mui-focused, &.MuiFormLabel-filled": { top: 0 },
                      }}
                    >
                      Client Account
                    </InputLabel>
                    <Select
                      labelId="Client Accounts"
                      id="client-ac-id"
                      size="small"
                      label="Client Accounts"
                      required={true}
                      onChange={(e) => {
                        const newValue = clientAccountsDropdown.find(
                          (ca) => ca.name === e.target.value,
                        );
                        field.onChange(newValue);
                      }}
                    >
                      {clientAccountsDropdown.map((c, i) => (
                        <MenuItem key={i} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText error={!!errors?.client}>
                      {errors.client?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <XNGFormSelect
                name="serviceProviderType"
                label="Service Provider Type"
                control={control}
                useError={{ message: errors.serviceProviderType?.message }}
                items={serviceProviderDropdown}
                watch={watch}
                setValue={setValue}
                getOptionLabel={(i) => getItemName(i)}
              />
            </Box>
            <NextButtonJustifiedRight
              onNext={async () => {
                const valid = await trigger();
                if (valid) {
                  handleSubmit(onSubmit)();
                }
              }}
            />
          </FloatingLayout>
        </Box>
      )}
    </>
  );
}

export default AccountRegistrationUserOnboardingFlow;
