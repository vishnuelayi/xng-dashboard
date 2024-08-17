import { Dialog, SelectChangeEvent, Typography } from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import XNGClose from "../../../low-level/button_close";
import React, { useState } from "react";
import {
  DistrictAccessRequest,
  ServiceProviderCaseloadOption,
  ServiceProviderRef,
} from "../../../../profile-sdk";
import { XLogsRoleStrings } from "../../../../context/types/xlogsrole";
import XNGButton from "../../../low-level/button";
import { XNGNonformSelect } from "../../../low-level/form_select";
import { XNGSearch } from "../../../low-level/input_search";
import { CreateNewProvider } from "./CreateServiceProviderToCaseLoadModal";
import { useXNGDispatch } from "../../../../context/store";
import { thankYouModalActions } from "../../../../context/slices/thankYouModalSlice";

interface IAddServiceProviderToCaseloadModal {
  handleAdd: (serviceProvider: ServiceProviderRef | undefined) => void;
  setShowAddToCaseloadModal: (show: boolean) => void;
  showAddToCaseloadModal: boolean;
  addButtonText: string;
  serviceProviderOptions: ServiceProviderCaseloadOption[];
  setShowCreateNewProvider: (show: boolean) => void;
  showCreateNewProvider: boolean;
  setDataTrue: (val: boolean) => void;
}
export function AddServiceProviderToCaseloadModal(props: IAddServiceProviderToCaseloadModal) {
  const [selectedServiceProvider, setSelectedServiceProvider] = useState<ServiceProviderRef>();
  const dispach = useXNGDispatch();
  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowAddToCaseloadModal(false);
      }}
      open={props.showAddToCaseloadModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(2),
          width: getSizing(55),
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ marginTop: getSizing(1), paddingLeft: getSizing(1) }} variant="h6">
            Add Provider to Profile
          </Typography>
          <XNGClose onClick={() => props.setShowAddToCaseloadModal(false)} />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: getSizing(2),
            paddingTop: 0,
            gap: getSizing(2),
          }}
        >
          <Typography variant="body1">Type a provider's name to search: </Typography>
          <XNGSearch<ServiceProviderCaseloadOption | string>
            options={["Create New User", ...props.serviceProviderOptions]}
            label=""
            onSelect={(serviceProvider: ServiceProviderCaseloadOption | string) => {
              if (typeof serviceProvider === "string") {
                props.setShowCreateNewProvider(true);
                if (props.addButtonText === "Request Access") {
                  props.setDataTrue(true);
                } else {
                  props.setDataTrue(false);
                }
                props.setShowAddToCaseloadModal(false);
              } else setSelectedServiceProvider(serviceProvider);
            }}
            getOptionLabel={(serviceProvider: ServiceProviderCaseloadOption | string) => {
              if (typeof serviceProvider === "string") {
                return "Create New User";
              } else {
                return `${serviceProvider.firstName} ${serviceProvider.lastName} - ${
                  serviceProvider.campus === null ? "No Campus" : serviceProvider.campus
                }`;
              }
            }}
            setValues={true}
          />
          <XNGButton
            onClick={() => {
              props.setShowAddToCaseloadModal(false);
              props.handleAdd(selectedServiceProvider);
              // if(selectedServiceProvider){
              //   dispach(thankYouModalActions.ACTION_ShowThankyouModal({show:true,
              //     text:"You can now access " + selectedServiceProvider?.firstName + " " + selectedServiceProvider?.lastName + "'s account " +
              //     "\nby navigating to “My Profile” in the " +
              //     "\nnavigation bar." }));
              //     console.log("BRRRRRRRRRR")
              // }
            }}
          >
            {props.addButtonText}
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
