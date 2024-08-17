import { Paper, Divider, Box, Avatar, Typography, SelectChangeEvent } from "@mui/material";
import React from "react";
import XNGCheckbox from "../../../../../../../../design/low-level/checkbox";
import XNGDropDown from "../../../../../../../../design/low-level/dropdown2";
import usePalette from "../../../../../../../../hooks/usePalette";
import {
  UserManagementStatus,
  XLogsRole,
  HistoricalStatus,
} from "../../../../../../../../profile-sdk";
import MultiSelectDropdown, {
  MultiSelectValueType,
} from "../../../../../../../unposted_sessions/components/input/multi_select_dropdown";

type Props = {
  useCheckBoxSection?: {
    checked: boolean;
    onToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };
  useAvatarNameSection?: {
    firstName: string | undefined;
    lastName: string | undefined;
  };
  useClientDistrictStatusSection?: {
    clientName: string | undefined;
    selecteddistricts: {
      id: string;
      label: string;
    }[];
    districtOptions: MultiSelectValueType | undefined;
    onChange?: (e: SelectChangeEvent<MultiSelectValueType>) => void;
    status: UserManagementStatus | undefined;
  };
  useEmailSection?: {
    email: string | undefined;
  };
  useServiceProviderTypeSection?: {
    serviceProviderType: string | undefined;
  };
  useXlogsRoleDropDownSection?: {
    selectedxlogsRole: XLogsRole;
    onChange?: (e: SelectChangeEvent<string>) => void;
  };
  useHistory?: {
    historicalStatuses: HistoricalStatus[] | undefined;
    initialRegisterationDate: Date | undefined;
    viewHistory?: boolean;
  };
  onCardClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const UserManagementCardShape = (props: Props) => {
  const palette = usePalette();

  // Title for the card sections
  const CardSectionTitle = (props: { title: string; disableGutter?: boolean }) => {
    return (
      <Typography
        fontWeight={700}
        color={palette.primary[1]}
        mb={props.disableGutter ? "1px" : "5px"}
      >
        {props.title}
      </Typography>
    );
  };

  // takes stats as a number and returns the label and color for the status
  const statusRemap: Record<UserManagementStatus, { label: string; color: string }> = {
    0: {
      label: "Unapproved",
      color: palette.warning[2],
    },
    1: {
      label: "Approved",
      color: palette.success[4],
    },
    2: {
      label: "Denied",
      color: palette.danger[2],
    },
  };

  // remaps the service provider strings its enum value because we would be sending the values to the backend
  // Enum: ExecutiveAdmin = 0, DelegatedAdmin = 1, Approver = 2, ProxyDataEntry = 3, ServiceProviderAutonomous = 4, ServiceProviderAssistant = 5
  const xlogsRoleTypeRemap: Record<string, XLogsRole> = {
    "Executive Admin": 0,
    "Delegated Admin": 1,
    Approver: 2,
    "Proxy Data Entry": 3,
    "Service Provider - Autonomous": 4,
    "Service Provider - Assistant": 5,
  };

  // SECTIONS FOR THE CARD
  const checkboxSection = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        transform: "translateX(10px)",
      }}
    >
      <XNGCheckbox
        checked={props.useCheckBoxSection?.checked || false}
        onToggle={props.useCheckBoxSection?.onToggle || (() => {})}
      />
    </Box>
  );

  const avatarNameSection = (
    <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"} gap={2}>
      <Avatar sx={{ bgcolor: palette.primary[1], width: 75, height: 75 }}>
        {(props.useAvatarNameSection?.firstName?.[0] || "") +
          props.useAvatarNameSection?.lastName?.[0]}
      </Avatar>
      <Typography variant="h5" color={palette.primary[1]}>
        {props.useAvatarNameSection?.firstName} {props.useAvatarNameSection?.lastName}
      </Typography>
    </Box>
  );

  const ClientDistrictStatusSection = () => {
    const partitionProps = {
      width: "33.3%",
      maxWidth: "33.3%",
      overflow: "hidden",
    };

    return (
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <Box {...partitionProps}>
          <CardSectionTitle title={"Client"} />
          <Typography sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
            {props.useClientDistrictStatusSection?.clientName}
          </Typography>
        </Box>
        <Box {...partitionProps}>
          <CardSectionTitle title={"District"} />
          <MultiSelectDropdown
            id={"distric-id"}
            value={
              props.useClientDistrictStatusSection?.selecteddistricts?.map(
                (district) => district.id,
              ) || []
            }
            items={props.useClientDistrictStatusSection?.districtOptions || []}
            label={undefined}
            fullWidth
            renderList
            size="small"
            sx={{
              ".MuiSelect-select": {
                paddingY: "4px",
              },
            }}
            onChange={props.useClientDistrictStatusSection?.onChange || (() => {})}
          />
        </Box>
        <Box {...partitionProps}>
          <CardSectionTitle title={"Status"} />
          <Typography
            fontWeight={600}
            color={statusRemap[props.useClientDistrictStatusSection?.status || 0].color}
          >
            {statusRemap[props.useClientDistrictStatusSection?.status || 0].label}
          </Typography>
        </Box>
      </Box>
    );
  };

  const emailSection = (
    <Box>
      <CardSectionTitle title={"Email"} />
      <Typography sx={{ wordWrap: "break-word" }}>{props.useEmailSection?.email}</Typography>
    </Box>
  );

  const serviceProviderTypeSection = (
    <Box>
      <CardSectionTitle title={"Service Provider Type"} />
      <Typography>{props.useServiceProviderTypeSection?.serviceProviderType}</Typography>
    </Box>
  );

  const xlogsRoleDropDownSection = (
    <Box>
      <CardSectionTitle title={"X Logs Role Assigned"} />
      {props.useHistory === undefined ? (
        <XNGDropDown
          id={"service-provider-type"}
          sx={{
            ".MuiSelect-select": {
              paddingY: "4px",
            },
          }}
          // converts service provider remap keys to to an array of strings containing the labels and uses the index to get the value
          value={
            Object.keys(xlogsRoleTypeRemap)[
              props.useXlogsRoleDropDownSection?.selectedxlogsRole || 0
            ]
          }
          onChange={props.useXlogsRoleDropDownSection?.onChange || (() => {})}
          items={Object.keys(xlogsRoleTypeRemap)}
          label={undefined}
          size="small"
          fullWidth
        />
      ) : (
        <Typography>
          {
            Object.keys(xlogsRoleTypeRemap)[
              props.useXlogsRoleDropDownSection?.selectedxlogsRole || 0
            ]
          }
        </Typography>
      )}
    </Box>
  );

  const historicalStatusesSection = (
    <Box
      component={"ul"}
      sx={{ listStyle: "none", pl: 0, maxHeight: "220px", overflowY: "scroll" }}
    >
      {props.useHistory?.historicalStatuses?.map((status, i) => (
        <Box component={"li"} key={i} sx={{ display: "flex", mb: "5px" }}>
          <Box width={"50%"} maxWidth={"50%"} overflow={"hidden"}>
            <CardSectionTitle title={"Status"} disableGutter />
            <Typography fontWeight={600} color={statusRemap[status.status || 0].color}>
              {statusRemap[status?.status || 0].label}
            </Typography>
          </Box>
          <Box width={"50%"} maxWidth={"50%"} overflow={"hidden"}>
            <CardSectionTitle
              title={`Date ${status.status === 1 ? "Approved" : "Denied"}`}
              disableGutter
            />
            <Typography>{new Date(status?.date || Date.now()).toLocaleDateString()}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  // VIEWS FOR THE CARD
  const mainCardView = (
    <>
      <Box>
        {props.useCheckBoxSection && checkboxSection}
        {props.useAvatarNameSection && avatarNameSection}
      </Box>
      {props.useClientDistrictStatusSection && <ClientDistrictStatusSection />}
      {props.useEmailSection && emailSection}
      {serviceProviderTypeSection}
      <Divider sx={{ borderBottomWidth: 2 }} />
      {props.useXlogsRoleDropDownSection && xlogsRoleDropDownSection}
    </>
  );

  const historyCardView = (
    <>
      <Box>
        {props.useCheckBoxSection && checkboxSection}
        {props.useAvatarNameSection && avatarNameSection}
      </Box>
      {historicalStatusesSection}
      <Box>
        <CardSectionTitle title={"Initial Registration Date"} disableGutter />
        <Typography>
          {new Date(props.useHistory?.initialRegisterationDate || Date.now()).toLocaleDateString()}
        </Typography>
      </Box>
    </>
  );

  return (
    <Paper
      sx={{
        maxWidth: 320,
        minWidth: 320,
        minHeight: 395,
        pt: 1,
        pb: 4,
        px: 2.6,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        "&:hover": {
          cursor: "pointer",
          boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
          transform: "scale(1.02)",
        },
      }}
      variant="outlined"
      onClick={props.onCardClick}
    >
      {!props.useHistory?.viewHistory ? mainCardView : historyCardView}
    </Paper>
  );
};

export default UserManagementCardShape;
