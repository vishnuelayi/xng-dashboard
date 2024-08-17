import { Box, Typography } from "@mui/material";
import GridSectionLayout from "../../../../../../../design/high-level/common/grid_section_layout";
import XNGRadioGroup from "../../../../../../../design/low-level/radio_group";
import { XNGICONS } from "../../../../../../../design";
import XNGButtonIconLink from "../../../../../../../design/low-level/button_icon_link";
import XNGInput2 from "../../../../../../../design/low-level/input_2";
import { XNGDateField } from "../../../../../../unposted_sessions/components/common/date_field";
import ProviderRecordsModal, {
  ProviderRecordsModalType,
} from "../interactive/provider_records_modal";
import {
  BlockBillingHistory,
  MedicaidCredential,
  ParticipationListStatusType,
  ProviderRate,
  ServiceProviderResponse,
} from "../../../../../../../profile-sdk";
import React from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import StaffDirectoryProfileTabToolbar from "../interactive/staff_directory_profile_tab_toolbar";
import { yupResolver } from "@hookform/resolvers/yup";
import XNGDropDown from "../../../../../../../design/low-level/dropdown2";
import dayjs from "dayjs";
import useFeedbackModal from "../../../../../../../hooks/use_feedback_modal";
import FullPageLoadingScreen from "../../../../../../../design/high-level/common/full_page_loading_screen";
import useApiMutatePatchServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_mutate_patch_service_provider_by_id";
import useUserManagementContext from "../../../../../hooks/context/use_user_management_context";
import UserManagementConfirmationModalType from "../../../../../types/user_management_confirmation_modal_type";
import GetParticipantListInfoOptions from "../../../../../../../data/get_participant_list_info_options";
import produce from "immer";
import {
  getGetParticipantListEnumFromString,
  getGetParticipantListStringFromEnum,
} from "../../../../../../../utils/xlogs_participant_list_mapper";
import useApiQueryServiceProviderById from "../../../../../../../api/hooks/service_provider/use_api_query_service_provider_by_id";

//checks if the array item is unique
// yup.addMethod(yup.array, 'unique', function(message: string, comparer:(item:any)=> keyof typeof item | (keyof typeof item)[]) {
//   return this.test('unique', message, function(list?: any[]) {
//     if (!list) {
//       return false;
//     }
//     return list.some((item, index, self)=>{

//       return index === self.findIndex((t) => {
//         const prop = comparer(t);
//         return typeof prop === "object" ? prop.some(p => t[p] === item[p]) : t[prop] === item[prop];
//       })
//     });
//   });
// });

// function uniqueYupArrayTestCallback<T>(
//   list?: T[] | null,
//   compareProp?: (item: T) => keyof typeof item | (keyof typeof item)[],
// ) {
//   if (!list) {
//     return true;
//   }
//   const uniqueArr = list.filter(
//     (item, index, self) =>
//       index ===
//       self.findIndex((t) => {
//         if (!compareProp) {
//           return false;
//         }
//         const prop = compareProp(t);
//         if (typeof prop === "object") {
//           return (prop as (keyof T)[]).every(
//             (p) => JSON.stringify(t[p]) === JSON.stringify(item[p]),
//           );
//         } else {
//           return JSON.stringify(t[prop as keyof T]) === JSON.stringify(item[prop as keyof T]);
//         }
//       }),
//   );

//   return uniqueArr.length === list.length;
// }

const medicated_credentials_schema = yup.object({
  profession: yup.string().trim().optional().notRequired(),
  nameOnLicense: yup.string().trim().optional().notRequired(),
  licenseNumber: yup.string().trim().optional().notRequired(),
  startDate: yup.date().optional().notRequired(),
  endDate: yup.date().optional().notRequired(),
  state: yup.string().trim().optional().notRequired(),
  county: yup.string().trim().optional().notRequired(),
});
// .transform((value:MedicaidCredential) => !value.profession || !value.nameOnLicense || !value.licenseNumber || !value.startDate || !value.endDate ? null : value)

const provider_rate_schema = yup.object({
  hourlyRate: yup
    .number()
    .transform((value) => (value ? Number(value) : 0))
    .optional()
    .notRequired()
    .min(0, "hourly rate must be a positive number"),
  startDate: yup.date().optional().notRequired(),
  endDate: yup.date().optional().notRequired(),
});

const block_billing_schema = yup.object({
  blockBillingForProvider: yup.boolean().optional().notRequired(),
  blockBillingStartDate: yup.date().optional().notRequired(),
  datePosted: yup.date().optional().notRequired(),
});

const schema = yup.object({
  medicaidCredentials: medicated_credentials_schema
    .optional()
    .notRequired()
    .test(
      "is-greater-than-start-date",
      "End date must be greater than start date",
      function (value) {
        const { startDate, endDate } = this.parent.medicaidCredentials;
        // console.log("value", this.parent);
        if (!startDate || !value) {
          // If either start date or end date is not provided, consider it as valid
          return true;
        }
        return new Date(endDate) > new Date(startDate);
      },
    )
    .test(
      "licensing-info-is-complete",
      "Please complete Licensing Information entry",
      function (credential) {
        if (!credential) {
          return true;
        }
        // console.log("medicaid validation", Object.values(value).every((prop) => !prop) || Object.values(value).every((prop) => !!prop));
        // console.log("valuds", Object.values(value));
        return (
          (!!credential.nameOnLicense &&
            !!credential.profession &&
            !!credential.licenseNumber &&
            !!credential.startDate &&
            !!credential.endDate) ||
          (!credential.nameOnLicense &&
            !credential.profession &&
            !credential.licenseNumber &&
            !credential.startDate &&
            !credential.endDate)
        );
      },
    ),
  medicaid_credentials_array: yup.array().of(medicated_credentials_schema).optional().notRequired(),
  // .test("licensing-info-is-unique", "We already have this licensing information in our records", function (list) {
  //   return uniqueYupArrayTestCallback(list, () => [
  //     "profession",
  //     "nameOnLicense",
  //     "licenseNumber",
  //     "startDate",
  //     "endDate",
  //   ]);
  // })
  // .transform(function(value:  (typeof medicated_credentials_schema)[]) {
  //   const { medicaidCredentials } = this.parent;

  //   return produce(value, (draft) => {
  //     if(draft && data.medicaidCredentials){

  //       // check if the credentials we are looking to add already exists
  //       // also ensure that the credentials we are checking against has no duplicates to avoid user being unable to save, we are validating for new credentials only
  //         const isUnique = uniqueYupArrayTestCallback([...removeArrrayDuplicates(draft.medicaidCredentials, ()=>["profession", "nameOnLicense", "licenseNumber", "startDate", "endDate"]),
  //           data.medicaidCredentials], () => ["profession", "nameOnLicense", "licenseNumber", "startDate", "endDate"]);
  //         if(!isUnique){
  //           onFailedSave("Please Ensure there are no duplicate licensing information");
  //           return;
  //         }
  //         draft.medicaidCredentials.push({...data.medicaidCredentials as MedicaidCredential, state: props.state_in_us});
  //     }
  //     else if(data.medicaidCredentials){
  //       draft.medicaidCredentials = [
  //         {...data.medicaidCredentials as MedicaidCredential, state: props.state_in_us}
  //       ];
  //     }
  //   })
  // }))
  providerRate: provider_rate_schema
    .optional()
    .notRequired()
    .test(
      "is-greater-than-start-date",
      "End date must be greater than start date",
      function (value) {
        const { startDate, endDate } = this.parent.providerRate;
        if (!startDate || !value) {
          // If either start date or end date is not provided, consider it as valid
          return true;
        }
        return new Date(endDate) > new Date(startDate);
      },
    )
    .test("rate-is-complete", "Please complete provider rates entry", function (rate) {
      if (!rate) {
        return true;
      }

      return (
        (!rate.hourlyRate && !rate.startDate && !rate.endDate) ||
        (!!rate.hourlyRate && !!rate.startDate && !!rate.endDate)
      );
    }),
  // .transform((value:ProviderRate) => !value.hourlyRate || !value.startDate || !value.endDate ? null : value),
  // .test("rate-is-unique", "Provider Rate must be unique", function (list) {
  //   return uniqueYupArrayTestCallback(list, () => ["hourlyRate", "startDate", "endDate"]);
  // }),
  // unique("Hourly rate must be unique", (item) => ["hourlyRate", "startDate", "endDate"]),
  provider_rate_array: yup.array().of(provider_rate_schema).optional().notRequired(),
  // .test("rate-is-unique", "We already have this rate in our records", function (list) {
  //      return uniqueYupArrayTestCallback(list, () => ["hourlyRate", "startDate", "endDate"]);
  //    }),
  npiNumber: yup.string().optional().notRequired().trim(),
  medicaidNumber: yup.string().optional().notRequired().trim(),
  isOnParticipationList: yup.boolean(),
  participationListStatus: yup
    .string()
    .test(
      "is-participation-list-status-valid",
      "Please select a valid participation list status",
      function (value) {
        const { isOnParticipationList } = this.parent;
        if (!isOnParticipationList) {
          return true;
        }
        return !!value;
      },
    ),
  block_billing: block_billing_schema
    .optional()
    .notRequired()
    .test("is-block-billing-valid", "Please select a valid block billing date", function (value) {
      const { blockBillingForProvider, blockBillingStartDate } = this.parent.block_billing;

      // console.log("blockBillingForProvider", blockBillingForProvider);
      // console.log("blockBillingStartDate", blockBillingStartDate);
      if (!blockBillingForProvider) {
        return true;
      }
      // console.log("blockBillingStartDate", blockBillingStartDate)
      return !!blockBillingStartDate;
    }),
  block_billing_history: yup.array().of(block_billing_schema).optional().notRequired(),
});

type MedicaidInfoFormData = yup.InferType<typeof schema>;

enum ProviderRecords {
  RATE = "RATE",
  LICENSING_INFO = "LICENSING_INFO",
  BLOCK_BILLING_HISTORY = "BLOCK_BILLING_HISTORY",
}

type Props = {
  service_provider: ServiceProviderResponse;
  state_in_us: string;
  client_id: string;
  refetchServiceProvider: ReturnType<typeof useApiQueryServiceProviderById>["refetch"];
};

const MedicaidInfoTabContent = (props: Props) => {

  const [providerRecordRateModalConfig, setProviderRecordRateModalConfig] = React.useState<{
    title?: string;
    subtitle?: string;
    canDeleteRecord: boolean;
    open: boolean;
    selected_record?: ProviderRecords;
    noRecordsText?: string;
    // record: providerRecordsModalType[];
  }>({
    title: "",
    open: false,
    canDeleteRecord: false,
    // record: [],
    noRecordsText: "No records found",
  });

  const set_user_management_confirmation_modal =
    useUserManagementContext().confirmation_modal.setState;


  const { onSuccessfulSave, onFailedSave } = useFeedbackModal();

  // mutate service provider
  const { mutateAsync: mutateServiceProvider, status: mutate_service_provider_status } =
    useApiMutatePatchServiceProviderById({
      queryParams: {
        id: props.service_provider.id || "",
        clientId: props.client_id,
        state: props.state_in_us,
      },
      options: {
        onSuccess: () => {
          props.refetchServiceProvider();
          onSaveSucess();
        },
      },
    });

  const tabLoading = mutate_service_provider_status === "pending";

  // used to populate the provider records modal based on the selected record
  const modalRecord: ProviderRecordsModalType[] = React.useMemo((): ProviderRecordsModalType[] => {
    switch (providerRecordRateModalConfig.selected_record) {
      case ProviderRecords.RATE:
        return (
          props.service_provider.rateRecords?.map((rate, i) => {
            return {
              name: `Rate: $${rate.hourlyRate}/hr`,

              dateRange: `${dayjs(rate.startDate).utc().format("MM/DD/YYYY")} - ${dayjs(
                rate.endDate,
              )
                .utc()
                .format("MM/DD/YYYY")}`,
              onDelete: () => {
                set_user_management_confirmation_modal({
                  isOpen: true,
                  icon: "danger",
                  body: (() => (
                    <Typography maxWidth={"320px"}>
                      Are you sure you would like to remove the rate of{" "}
                      <Box component={"span"} fontWeight={"700"}>
                        ${rate.hourlyRate}/hr
                      </Box>{" "}
                      for the date range of{" "}
                      <Box component={"span"} fontWeight={"700"}>
                        {`${dayjs(rate.startDate).utc().format("MM/DD/YYYY")} - ${dayjs(
                          rate.endDate,
                        )
                          .utc()
                          .format("MM/DD/YYYY")}`}
                      </Box>
                    </Typography>
                  ))(),
                  title: "Warning",
                  confirmText: "Yes, Remove",
                  styleBtns: {
                    yesButton: {
                      padding: "1.5rem",
                    },
                    noButton: {
                      display: "none",
                    },
                  },

                  onConfirm: () => {
                    set_user_management_confirmation_modal({
                      isOpen: false,
                    } as UserManagementConfirmationModalType);
                    onRemoveRateRecord(rate);
                  },
                  onCancel: () =>
                    set_user_management_confirmation_modal({
                      isOpen: false,
                    } as UserManagementConfirmationModalType),
                });
              },
            };
          }) || []
        );
      case ProviderRecords.LICENSING_INFO:
        return (
          props.service_provider.medicaidCredentials?.map((info, i) => {
            return {
              name: `${info.profession}`,

              dateRange: `${dayjs(info.startDate).utc().format("MM/DD/YYYY")} - ${dayjs(
                info.endDate,
              )
                .utc()
                .format("MM/DD/YYYY")}`,
              onDelete: () => {
                // console.log("show delete modal");
                set_user_management_confirmation_modal({
                  isOpen: true,
                  icon: "danger",
                  body: (() => (
                    <Typography maxWidth={"320px"}>
                      Are you sure you would like to remove the license of{" "}
                      <Box component={"span"} fontWeight={"700"}>
                        {info.profession}
                      </Box>{" "}
                      for the date range of{" "}
                      <Box component={"span"} fontWeight={"700"}>
                        {`${dayjs(info.startDate).utc().format("MM/DD/YYYY")} - ${dayjs(
                          info.endDate,
                        )
                          .utc()
                          .format("MM/DD/YYYY")}`}
                      </Box>
                    </Typography>
                  ))(),
                  title: "Warning",
                  confirmText: "Yes, Remove",
                  styleBtns: {
                    yesButton: {
                      padding: "1.5rem",
                    },
                    noButton: {
                      display: "none",
                    },
                  },

                  onConfirm: () => {
                    set_user_management_confirmation_modal({
                      isOpen: false,
                    } as UserManagementConfirmationModalType);
                    onRemoveLicensingInfo(info);
                  },
                  onCancel: () =>
                    set_user_management_confirmation_modal({
                      isOpen: false,
                    } as UserManagementConfirmationModalType),
                });
              },
            };
          }) || []
        );
      case ProviderRecords.BLOCK_BILLING_HISTORY:
        return (
          props.service_provider.blockBillingHistory
            ?.filter((b) => b.blockBillingForProvider)
            .map((billing, i) => {
              return {
                name: `Billing Start Date: ${dayjs(billing.blockBillingStartDate)
                  .utc()
                  .format("MM/DD/YYYY")}`,

                dateRange: `Date Posted: ${dayjs(billing.datePosted).utc().format("MM/DD/YYYY")}`,
                // onDelete: () => {
                //   set_user_management_confirmation_modal({
                //     isOpen: true,
                //     icon: "danger",
                //     body: (() => (
                //       <Typography maxWidth={"320px"}>
                //         Are you sure you would like to remove the Billing info started on {" "}
                //         <Box component={"span"} fontWeight={"700"}>
                //           {dayjs(billing.blockBillingStartDate).utc().format("MM/DD/YYYY")}
                //         </Box>{" "}
                //         and posted on{" "}
                //         <Box component={"span"} fontWeight={"700"}>
                //           {`${dayjs(billing.datePosted).utc().format("MM/DD/YYYY")} `}
                //         </Box>
                //       </Typography>
                //     ))(),
                //     title: "Warning",
                //     confirmText: "Yes, Remove",
                //     styleBtns: {
                //       yesButton: {
                //         padding: "1.5rem",
                //       },
                //       noButton: {
                //         display: "none",
                //       },
                //     },

                //     onConfirm: () => {
                //       set_user_management_confirmation_modal({
                //         isOpen: false,
                //       } as UserManagementConfirmationModalType);
                //       // onRemoveBlockBillingHistoryData(billing);
                //     },
                //     onCancel: () =>
                //       set_user_management_confirmation_modal({
                //         isOpen: false,
                //       } as UserManagementConfirmationModalType),
                //   });
                // },
              };
            }) || []
        );

      default:
        return [];
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.service_provider.medicaidCredentials,
    props.service_provider.rateRecords,
    providerRecordRateModalConfig.selected_record,
  ]);

  // console.log("modalRecord", modalRecord);

  //#region HOOKFORMS

  const {
    register,
    watch,
    resetField,
    setValue,
    // getValues,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MedicaidInfoFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      provider_rate_array: props.service_provider.rateRecords,
      medicaid_credentials_array: props.service_provider.medicaidCredentials,
      npiNumber: props.service_provider.npi,
      medicaidNumber: props.service_provider.stateMedicaidNumber,
      isOnParticipationList: props.service_provider.isOnParticipationList,
      participationListStatus: getGetParticipantListStringFromEnum(
        (props.service_provider?.participationListStatus as ParticipationListStatusType) ||
          ParticipationListStatusType.NUMBER_0,
      ),
      block_billing: {
        blockBillingForProvider: props.service_provider.blockBillingForProvider,
      },
      block_billing_history: props.service_provider.blockBillingHistory,
      medicaidCredentials: undefined,
      providerRate: undefined,
    },
  });

  //#endregion

  //#region METHODS
  const onSubmit: SubmitHandler<MedicaidInfoFormData> = (data) => {
    // console.log("Submit data: ", data);
    // console.log("provider: ", props.service_provider);

    let isValid = true;

    const arrayHasItem = function <T>(
      array: T[],
      arrayItem: T,
      comparer: (item: T) => (keyof typeof item)[],
    ) {
      return array.some((item) => {
        const props = comparer(item);
        return props.every((prop) => {
          return JSON.stringify(item[prop]) === JSON.stringify(arrayItem[prop]);
        });
      });
    };
    // performs transformation to disallow empty objects from being sent to the backend
    const transformedData = function <T>(data: T, dataKeys: (data: T) => (keyof typeof data)[]) {
      return (dataKeys(data).some((key) => !!data[key]) ? data : undefined) as T;
    };

    const transformed_medicaid_credential = transformedData(
      data.medicaidCredentials as MedicaidCredential,
      () => ["endDate", "licenseNumber", "nameOnLicense", "profession", "startDate"],
    );

    // console.log("Transformed medicaidCredential", transformed_medicaid_credential);

    const transformed_providerRate = transformedData(data.providerRate as ProviderRate, () => [
      "endDate",
      "hourlyRate",
      "startDate",
    ]);

    // const block_billing = transformedData(data.block_billing., (data) => ["blockBillingForProvider", "blockBillingStartDate"]);

    const medicaidCredentialsRecords = produce(watch("medicaid_credentials_array"), (draft) => {
      //perform transformation check

      if (draft && transformed_medicaid_credential) {
        // check if the credentials we are looking to add already exists
        // also ensure that the credentials we are checking against has no duplicates to avoid user being unable to save, we are validating for new credentials only
        // const nonDuplicateDraft = removeArrrayDuplicates([...draft], ()=>["profession", "nameOnLicense", "licenseNumber", "startDate", "endDate"]);
        const exists = arrayHasItem(
          data.medicaid_credentials_array as MedicaidCredential[],
          transformed_medicaid_credential,
          () => ["profession", "nameOnLicense", "licenseNumber", "startDate", "endDate"],
        );

        // const isUnique = uniqueYupArrayTestCallback(draft, () => ["profession", "nameOnLicense", "licenseNumber", "startDate", "endDate"]);
        if (exists) {
          onFailedSave("Licensing Information already exists in our records");
          isValid = false;
          return;
        }
        draft.push({
          ...(transformed_medicaid_credential as MedicaidCredential),
          state: props.state_in_us,
        });
      } else if (transformed_medicaid_credential) {
        return [
          { ...(transformed_medicaid_credential as MedicaidCredential), state: props.state_in_us },
        ];
      }
    });

    const providerRateRecords = produce(watch("provider_rate_array"), (draft) => {
      if (draft && transformed_providerRate) {
        // check if the rate we are looking to add already exists
        // also ensure that the rate we are checking against has no duplicates to avoid user being unable to save, we are validating for new rate only
        // const isUnique = uniqueYupArrayTestCallback(draft, () => ["hourlyRate", "startDate", "endDate"]);
        const exists = arrayHasItem(
          data.provider_rate_array as ProviderRate[],
          transformed_providerRate,
          () => ["hourlyRate", "startDate", "endDate"],
        );
        if (exists) {
          onFailedSave("Provider Rate already exists in our records");
          isValid = false;
          return;
        }
        draft.push(transformed_providerRate);
      } else if (transformed_providerRate) {
        // console.log("adding rate...")
        return [transformed_providerRate as ProviderRate];
      }
    });

    const blockBillingHistoryRecords = produce(watch("block_billing_history"), (draft) => {
      if (draft && data?.block_billing?.blockBillingForProvider) {
        // console.log("YERRRRRRRRRR")
        //  const isUnique = uniqueYupArrayTestCallback([...removeArrrayDuplicates(draft, ()=>["blockBillingForProvider", "blockBillingStartDate", "datePosted"]),
        //     data.block_billing], () => ["blockBillingForProvider", "blockBillingStartDate", "datePosted"]);

        const exists = arrayHasItem(
          data.block_billing_history as BlockBillingHistory[],
          data.block_billing,
          () => ["blockBillingForProvider", "blockBillingStartDate", "datePosted"],
        );

        if (exists) {
          onFailedSave("Block Billing Information already exists in our records");
          isValid = false;
          return;
        }
        draft.push({
          ...(data.block_billing as BlockBillingHistory),
          datePosted: new Date(new Date().toDateString()),
        });
      } else if (data.block_billing?.blockBillingForProvider) {
        console.log("adding block billing...");
        return [
          {
            ...data.block_billing,
            datePosted: new Date(new Date().toDateString()),
          } as BlockBillingHistory,
        ];
      }
    });

    // console.log("medicaidCredentials_added", medicaidCredentialsRecords);
    // console.log("providerRate_added", providerRateRecords);
    // console.log("blockBillingHistory_added", blockBillingHistoryRecords);
    // console.log("got here somehow");
    if (!isValid) return;
    onSaveMedicaidInfo({
      ...data,
      medicaid_credentials_array: medicaidCredentialsRecords,
      provider_rate_array: providerRateRecords,
      block_billing_history: blockBillingHistoryRecords,
    });
  };

  const onError: SubmitErrorHandler<MedicaidInfoFormData> = (errors) => {
    // console.log("errors", errors);
    if (errors.providerRate?.message) {
      onFailedSave("Provider Rate " + errors.providerRate?.message);
    } else if (errors.medicaidCredentials?.message) {
      onFailedSave("Licensing Info " + errors.medicaidCredentials?.message);
    } else if (errors.block_billing?.message) {
      onFailedSave("Block Billing " + errors.block_billing?.message);
    }
  };

  async function onRemoveRateRecord(record: ProviderRate) {
    const newProviderRate = produce(props.service_provider.rateRecords, (draft) => {
      const index = draft?.findIndex((item) => JSON.stringify(item) === JSON.stringify(record));
      if (index !== -1 && index !== undefined) {
        draft?.splice(index, 1);
      }
    });

    await onSaveMedicaidInfo({
      ...watch(),
      provider_rate_array: newProviderRate,
    });
  }

  async function onRemoveLicensingInfo(licensingInfo: MedicaidCredential) {
    const newMedicaidCredentials = produce(props.service_provider.medicaidCredentials, (draft) => {
      const index = draft?.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(licensingInfo),
      );
      if (index !== -1 && index !== undefined) {
        draft?.splice(index, 1);
      }
    });
    // console.log("newMedicaidCredentials", props.service_provider.medicaidCredentials);
    // console.log("filtered newMedicaidCredentials", newMedicaidCredentials);

    // console.log("mutate payload: ", {
    //   ...watch(),
    //   medicaidCredentials: newMedicaidCredentials,
    // });

    await onSaveMedicaidInfo({
      ...watch(),
      medicaid_credentials_array: newMedicaidCredentials,
    });
  }

  // async function onRemoveBlockBillingHistoryData(blockBilling: BlockBillingHistory) {
  //   const newBlockBillingHistory = produce(props.service_provider.blockBillingHistory, (draft) => {
  //     const index = draft?.findIndex(
  //       (item) => JSON.stringify(item) === JSON.stringify(blockBilling),
  //     );
  //     if (index !== -1 && index !== undefined) {
  //       draft?.splice(index, 1, {
  //         blockBillingForProvider: false,
  //         blockBillingStartDate: blockBilling.blockBillingStartDate,
  //         datePosted: blockBilling.datePosted,
  //       });
  //     }
  //     // draft[index]
  //   });
  //   // setValue("block_billing", {
  //   //   blockBillingForProvider: false,
  //   //   blockBillingStartDate: blockBilling.blockBillingStartDate,
  //   //   datePosted: blockBilling.datePosted,
  //   // });
  //   // console.log(getValues("block_billing"))
  // // console.log("newBlockBillingHistory", {
  // //     ...watch(),
  // //     block_billing_history: newBlockBillingHistory,
  // // });
  //   await onSaveMedicaidInfo({
  //     ...watch(),
  //     block_billing:{
  //       blockBillingForProvider: false,
  //       blockBillingStartDate: blockBilling.blockBillingStartDate,
  //       datePosted: blockBilling.datePosted,
  //     },
  //     block_billing_history: newBlockBillingHistory,
  //   });
  // }

  async function onSaveMedicaidInfo(data: MedicaidInfoFormData) {
    const service_provider_requestBody = produce(props.service_provider, (draft) => {
      draft.npi = data.npiNumber ?? undefined;
      draft.stateMedicaidNumber = data.medicaidNumber ?? undefined;

      draft.medicaidCredentials =
        (data.medicaid_credentials_array as MedicaidCredential[]) ?? undefined;
      draft.rateRecords = (data.provider_rate_array as ProviderRate[]) ?? undefined;

      draft.isOnParticipationList = data.isOnParticipationList;
      draft.participationListStatus = data.isOnParticipationList
        ? getGetParticipantListEnumFromString(data?.participationListStatus ?? "")
        : undefined; //add validation, if !isOnList then set to undefined
      draft.blockBillingStartDate = data.block_billing?.blockBillingStartDate ?? undefined;
      draft.blockBillingForProvider = data.block_billing?.blockBillingForProvider ?? undefined;
      draft.blockBillingHistory =
        (data.block_billing_history as BlockBillingHistory[]) ?? undefined;
    });

    // console.log("service_provider_requestBody", service_provider_requestBody);
    await mutateServiceProvider(service_provider_requestBody);
  }

  function onSaveSucess() {
    // console.log("reset fields");
    setValue("provider_rate_array", props.service_provider.rateRecords);
    setValue("medicaid_credentials_array", props.service_provider.medicaidCredentials);
    setValue("block_billing_history", props.service_provider.blockBillingHistory);
    resetField("medicaidCredentials.licenseNumber");
    resetField("medicaidCredentials.nameOnLicense");
    resetField("medicaidCredentials.profession");
    resetField("medicaidCredentials.startDate");
    resetField("medicaidCredentials.endDate");
    resetField("providerRate.hourlyRate");
    resetField("providerRate.startDate");
    resetField("providerRate.endDate");
    resetField("block_billing.blockBillingStartDate");
  }
  //#endregion

  //#region USE EFFECTS
  // onSuccessfulSave("Medicaid Information Saved successfully");
  React.useEffect(() => {
    if (mutate_service_provider_status === "success") {
      // console.log("Resetting");
      // resetField("providerRate");
      // resetField("block_billing.blockBillingStartDate");
      onSuccessfulSave("Medicaid Information Saved successfully");
    } else if (mutate_service_provider_status === "error") {
      onFailedSave("Failed to save Medicaid Information. Please refresh window and try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate_service_provider_status]);

  //#endregion

  //#region SECTIONS
  const participantListInfo =
    props.state_in_us.toUpperCase() === "NH" ? null : (
      <GridSectionLayout
        headerConfig={{
          title: "Participant List Info",
        }}
        divider
        rows={[
          {
            fullwidth: true,
            cells: [
              <Controller
                control={control}
                name="isOnParticipationList"
                render={({ field }) => (
                  <XNGRadioGroup
                    value={field.value ? "yes" : "no"}
                    onChange={(e) => {
                      field.onChange(e.target.value === "yes" ? true : false);
                    }}
                    options={["Yes", "No"]}
                    values={["yes", "no"]}
                    formLabel={
                      <Typography component={"span"}>
                        Is{" "}
                        <Box component={"span"} sx={{ color: "primary.main", fontWeight: 700 }}>
                          {props.service_provider.firstName} {props.service_provider.lastName}
                        </Box>{" "}
                        on the Participant List?
                      </Typography>
                    }
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pl: "5px",
                    }}
                    radioSx={{}}
                  />
                )}
              />,
            ],
          },
          {
            cells: [
              watch("isOnParticipationList") ? (
                <Controller
                  control={control}
                  name="participationListStatus"
                  render={({ field }) => (
                    <XNGDropDown
                      id={"participant-list-status"}
                      ref={field.ref}
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      items={GetParticipantListInfoOptions()}
                      label={"Participant List Status"}
                      fullWidth
                      maxwidth="100%"
                      useError={errors.participationListStatus?.message}
                    />
                  )}
                />
              ) : null,
            ],
          },
        ]}
      />
    );

  const providerRateRecords =
    props.state_in_us.toUpperCase() === "TX" ? null : (
      <GridSectionLayout
        headerConfig={{
          title: "Provider Rate",
          headerContent: (
            <XNGButtonIconLink
              label="History"
              startIcon={<XNGICONS.Folder />}
              onClick={() => {
                setProviderRecordRateModalConfig({
                  title: "Historical Provider Rate Records",
                  canDeleteRecord: true,
                  subtitle: "Below are this provider’s historical rate dates.",
                  open: true,
                  selected_record: ProviderRecords.RATE,
                });
              }}
            />
          ),
        }}
        divider
        useError={errors?.providerRate?.message}
        rows={[
          {
            cells: [
              <XNGInput2
                type={"number"}
                useAdornment={{ start: "$" }}
                label="Hourly Rate"
                id={"hourly-rate-id"}
                fullWidth
                useError={errors?.providerRate?.hourlyRate?.message}
                inputProps={{
                  step: "0.01",
                }}
                {...register(`providerRate.hourlyRate`)}
                disbaleBottomMargin
              />,
              <Typography
                variant="body1"
                sx={{ height: "100%", display: "flex", alignItems: "center" }}
              >
                Per hour
              </Typography>,
            ],
          },
          {
            cells: [
              <Controller
                control={control}
                name={`providerRate.startDate`}
                render={({ field }) => (
                  <XNGDateField
                    label="Start Date"
                    value={field.value ? dayjs(new Date(field.value).toDateString()).utc() : null}
                    onChange={field.onChange}
                    fullWidth
                  />
                )}
              />,
              <Controller
                control={control}
                name={`providerRate.endDate`}
                render={({ field }) => (
                  <XNGDateField
                    label="End Date"
                    value={field.value ? dayjs(new Date(field.value).toDateString()) : null}
                    onChange={field.onChange}
                    useError={errors?.providerRate?.endDate?.message}
                    fullWidth
                  />
                )}
              />,
            ],
          },
        ]}
      />
    );

  const licensingInfo = (
    <GridSectionLayout
      headerConfig={{
        title: "Licensing Info",
        headerContent: (
          <XNGButtonIconLink
            label="History"
            startIcon={<XNGICONS.Folder />}
            onClick={() => {
              setProviderRecordRateModalConfig({
                title: "Historical Provider Licensing Info",
                subtitle: "Below are this provider’s historical licenses on file.",
                canDeleteRecord: true,
                open: true,
                selected_record: ProviderRecords.LICENSING_INFO,
              });
            }}
          />
        ),
      }}
      useError={errors?.medicaidCredentials?.message}
      divider
      rows={[
        {
          cells: [
            <XNGInput2
              type={"text"}
              label="Name on License"
              id={"name-on-license-id"}
              fullWidth
              {...register(`medicaidCredentials.nameOnLicense`)}
              disbaleBottomMargin
            />,
            <XNGInput2
              type={"text"}
              label="Profession"
              id={"profession-id"}
              fullWidth
              {...register(`medicaidCredentials.profession`)}
              disbaleBottomMargin
            />,
            <XNGInput2
              type={"text"}
              label="License Number "
              id={"license-number-id"}
              {...register(`medicaidCredentials.licenseNumber`)}
              fullWidth
              disbaleBottomMargin
            />,
          ],
        },
        {
          useCellStyling: {
            indexes: 2,
            sx: {
              display: "flex",
              gap: 2,
              alignItems: "center",
            },
          },
          cells: [
            <Controller
              control={control}
              name={`medicaidCredentials.startDate`}
              render={({ field }) => (
                <XNGDateField
                  label="License Start Date"
                  value={field.value ? dayjs(new Date(field.value).toDateString()).utc() : null}
                  onChange={field.onChange}
                  fullWidth
                />
              )}
            />,
            <Controller
              control={control}
              name={`medicaidCredentials.endDate`}
              render={({ field }) => (
                <XNGDateField
                  label="License Expiration Date"
                  value={field.value ? dayjs(new Date(field.value).toDateString()).utc() : null}
                  onChange={field.onChange}
                  useError={errors?.medicaidCredentials?.endDate?.message}
                  fullWidth
                />
              )}
            />,
            // <Box>
            //   <XNGButtonIconLink
            //     label="License Photo 2023.PDF"
            //     color="black"
            //     start
            //     icon={<XNGICONS.PhotoPlaceholder />}
            //   />
            // </Box>,
          ],
        },
      ]}
    />
  );

  const identification = (
    <GridSectionLayout
      headerConfig={{
        title: "Identification",
      }}
      divider
      rows={[
        {
          cells: [
            <XNGInput2
              type={"text"}
              label="NPI Number"
              id={"npi-number-id"}
              {...register("npiNumber")}
              fullWidth
              disbaleBottomMargin
            />,

            <XNGInput2
              type={"text"}
              label="State Medicaid Number"
              id={"state-medicaid-number-id"}
              {...register("medicaidNumber")}
              fullWidth
              disbaleBottomMargin
            />,
          ],
        },
      ]}
    />
  );

  const blockBillingForProvider = (
    <GridSectionLayout
      headerConfig={{
        title: "Block Billing for Provider",
        headerContent: (
          <XNGButtonIconLink
            label="History"
            startIcon={<XNGICONS.Folder />}
            onClick={() => {
              setProviderRecordRateModalConfig({
                open: true,
                title: "Block Billing History",
                canDeleteRecord: false,
                subtitle: "Below are this provider’s Block Billing history on file.",
                selected_record: ProviderRecords.BLOCK_BILLING_HISTORY,
              });
            }}
          />
        ),
      }}
      bottomMargin={"10rem"}
      rows={[
        {
          fullwidth: true,
          cells: [
            <Controller
              control={control}
              name="block_billing.blockBillingForProvider"
              render={({ field }) => (
                <XNGRadioGroup
                  value={field.value ? "yes" : "no"}
                  onChange={(e) => {
                    field.onChange(e.target.value === "yes" ? true : false);
                  }}
                  options={["Yes", "No"]}
                  values={["yes", "no"]}
                  formLabel={
                    <Typography>
                      Block Billing for{" "}
                      <Box component={"span"} sx={{ color: "primary.main", fontWeight: 700 }}>
                        {props.service_provider.firstName} {props.service_provider.lastName}
                      </Box>
                      ?
                    </Typography>
                  }
                  sx={{
                    mb: 2,
                  }}
                  radioSx={{}}
                />
              )}
            />,
          ],
        },
        {
          cells: [
            watch("block_billing.blockBillingForProvider") ? (
              <Controller
                control={control}
                name={`block_billing.blockBillingStartDate`}
                render={({ field }) => (
                  <XNGDateField
                    label="Block Billing Start Date"
                    value={field.value ? dayjs(new Date(field.value).toDateString()).utc() : null}
                    onChange={field.onChange}
                    fullWidth
                    useError={errors?.block_billing?.blockBillingStartDate?.message}
                  />
                )}
              />
            ) : null,
          ],
        },
      ]}
    />
  );
  // #endregion

  // console.log("service provider", props.service_provider);
  return (
    <Box position={"relative"}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <StaffDirectoryProfileTabToolbar />
        {participantListInfo}
        {providerRateRecords}
        {licensingInfo}
        {identification}
        {blockBillingForProvider}
      </form>
      {tabLoading ? <FullPageLoadingScreen text={"Saving Medicaid Information"} /> : null}
      <ProviderRecordsModal
        // key={providerRateDefault.length.toString() + medicaidCredentialsDefault.length.toString()}
        title={providerRecordRateModalConfig?.title || ""}
        subTitle={providerRecordRateModalConfig?.subtitle}
        isOpen={providerRecordRateModalConfig.open}
        record={modalRecord}
        canDelete={providerRecordRateModalConfig.canDeleteRecord}
        onClose={() =>
          setProviderRecordRateModalConfig({
            open: false,
            canDeleteRecord: false,
          })
        }
      />
    </Box>
  );
};

export default MedicaidInfoTabContent;
