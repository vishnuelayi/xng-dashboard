import React from "react";

import UserCardRequest from "../../../types/user_card_request";
// import SelectAllFilterType from "../../../types/SelectAllFilterType";
import UserManagementCardShape from "./building_block/user_management_card_shape";
import {
  UserResponse,
  XLogsRole,
  UserServiceProviderRef,
  DistrictAccessRequestRef,
  UserManagementCard as UserManagementCardType,
} from "../../../../../../../profile-sdk";

type Props = {
  userCard: UserManagementCardType;
  user: UserResponse | null;
  cardResponseType: 0 | 1; //0 = affirmative, 1 = negative
  // selectAll: SelectAllFilterType;
  districtOptions: { id: string; label: string }[];

  hasCard: (id: string) => boolean;
  onAddCardData: (data: UserCardRequest) => void;
  onRemoveCardData: (id: UserCardRequest["id"]) => void;
  onUpdatedCardData: (data: UserCardRequest) => void;
  cardRequestBodyMapper: (
    selectedDistricts: { id: string; label: string }[],
    selectedServiceProviderType: XLogsRole,
    requestingUser: UserServiceProviderRef | undefined,
    districtAccessRequests: DistrictAccessRequestRef[],
    clientId: string,
  ) => UserCardRequest;
};

const UserManagementCard = (props: Props) => {
  const { user, client, status, districtAccessRequests } = props.userCard;

  // remaps districtRef data to suit our multi select dropdown value type
  // const districtOptions = React.useMemo(
  //   () =>
  //     districtAccessRequests?.map((request) => ({
  //       id: request.district?.id || "",
  //       label: request.district?.name || "",
  //     })) || [],
  //   [districtAccessRequests],
  // );

  const [selectedDistricts, setSelectedDistricts] = React.useState<typeof props.districtOptions>(
    props.districtOptions,
  );

  // const [hasCard, setHasCard] = React.useState<boolean>(props.hasCard(user?.id || ""));

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

  // stores the service provider value as an xlogs role/number selected by the user
  const [selectedXlogsRole, setSelectedXlogsRole] = React.useState<XLogsRole>(XLogsRole.NUMBER_4);
  // console.log(user?.serviceProviderType?.serviceArea)
  /**
   * Maps the selected districts to an array of RespondToRequestForDistrictAccessRequest objects
   * @returns {RespondToRequestForDistrictAccessRequest[]} An array of RespondToRequestForDistrictAccessRequest objects
   */
  // const mapCardRequestBody = () => {
  //   // A user could request access to multiple disctrict therefore a single user may create multiple request for each district
  //   const reqBodyArray: RespondToRequestForDistrictAccessRequest[] = [];
  //   selectedDistricts.forEach((district) => {
  //     const districtRef = districtAccessRequests?.find(
  //       (request) => request.district?.id === district.id,
  //     );

  //     const body: RespondToRequestForDistrictAccessRequest = {
  //       clientId: client?.id || "",
  //       districtId: districtRef?.district?.id,
  //       message: districtRef?.district?.name, //Passing in district name for now here so we can store it as a varable and utilize it for the message to be passed in here
  //       notificationId: districtRef?.notificationId,
  //       respondingUser: props.user || {},
  //       responseType: props.cardResponseType,
  //       roleAssignments: { xLogsRole: selectedServiceProviderType },
  //     };
  //     reqBodyArray.push(body);
  //   });
  //   // props.onAddCardData(reqBodyArray);
  //   const userCardRequest: UserCardRequest = {
  //     id: user?.id || "",
  //     requestBodyArray: reqBodyArray,
  //   };
  //   return userCardRequest;
  // };

  // // strictly for updating the card data when the user changes the select all checkbox
  // React.useEffect(() => {
  //   if (props.selectAll.triggerUpdate) {
  //     if (props.selectAll.value && !props.cardSelected) {
  //       // console.log("update card data!");
  //       props.onAddCardData(mapCardRequestBody());
  //     }
  //     if (!props.selectAll.value && props.cardSelected) {
  //       props.onRemoveCardData(user?.id || "");
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.selectAll.value]);

  // strictly for updating the card data when the user changes the service provider type or the selected districts
  React.useEffect(() => {
    if (isSelected()) {
      props.onUpdatedCardData(
        props.cardRequestBodyMapper(
          selectedDistricts,
          selectedXlogsRole,
          user,
          districtAccessRequests || [],
          client?.id || "",
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedXlogsRole, selectedDistricts]);

  const isSelected = () => props.hasCard(user?.id || "");

  return (
    <UserManagementCardShape
      useCheckBoxSection={{
        checked: isSelected(),
        onToggle: (e) => {
          e.stopPropagation();
          if (isSelected()) {
            props.onRemoveCardData(user?.id || "");
          } else {
            props.onAddCardData(
              props.cardRequestBodyMapper(
                selectedDistricts,
                selectedXlogsRole,
                user,
                districtAccessRequests || [],
                client?.id || "",
              ),
            );
          }
          // console.log("select card");
        },
      }}
      useAvatarNameSection={{
        firstName: user?.firstName,
        lastName: user?.lastName,
      }}
      useClientDistrictStatusSection={{
        clientName: client?.name,
        districtOptions: props.districtOptions,
        selecteddistricts: selectedDistricts,
        status: status,
        onChange: (e) => {
          e.stopPropagation();
          const selected = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
          // console.log(selected);
          setSelectedDistricts(
            (selected as string[]).map((id) =>
              props.districtOptions.find((district) => district.id === id),
            ) as typeof props.districtOptions,
          );
        },
      }}
      useEmailSection={{
        email: user?.email,
      }}
      useServiceProviderTypeSection={{
        serviceProviderType: user?.serviceProviderType?.name,
      }}
      useXlogsRoleDropDownSection={{
        selectedxlogsRole: selectedXlogsRole,
        onChange: (e) => {
          e.stopPropagation();
          const selected = e.target.value;
          // console.log(selected);
          setSelectedXlogsRole(xlogsRoleTypeRemap[selected]);
        },
      }}
      onCardClick={() => {
        if (isSelected()) {
          props.onRemoveCardData(user?.id || "");
        } else {
          props.onAddCardData(
            props.cardRequestBodyMapper(
              selectedDistricts,
              selectedXlogsRole,
              user,
              districtAccessRequests || [],
              client?.id || "",
            ),
          );
        }
      }}
    />
    // <Paper
    //   sx={{
    //     maxWidth: 320,
    //     minWidth: 320,
    //     pt: 1,
    //     pb: 4,
    //     px: 2.6,
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: 2,
    //     "&:hover": {
    //       cursor: "pointer",
    //       boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
    //     },
    //   }}
    //   variant="outlined"
    // >
    //   <Box>
    //     {checkboxSection}
    //     {avatarNameSection}
    //   </Box>
    //   <ClientDistrictStatusSection />
    //   {emailSection}
    //   {serviceProviderTypeSection}
    //   <Divider sx={{ borderBottomWidth: 2 }} />
    //   {serviceProviderTypeDropDownSection}
    // </Paper>
  );
};

export default UserManagementCard;
