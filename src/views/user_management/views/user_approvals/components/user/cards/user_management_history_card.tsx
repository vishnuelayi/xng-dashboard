import React from "react";
import { UserManagementHistoryCard as UserManagementHistoryCardType } from "../../../../../../../profile-sdk";
import UserManagementCardShape from "./building_block/user_management_card_shape";

type Props = {
  userHistoryCard: UserManagementHistoryCardType;
};

const UserManagementHistoryCard = (props: Props) => {
  const {
    user,
    client,
    districts,
    currentStatus,
    xLogsRole,
    historicalStatuses,
    initialRegistrationDate,
  } = props.userHistoryCard;

  const [viewHistory, setViewHistory] = React.useState(false);

  const districtOptions = React.useMemo(
    () =>
      districts?.map((district) => ({
        id: district?.id || "",
        label: district?.name || "",
      })) || [],
    [districts],
  );

  // console.log(props.userHistoryCard);

  return (
    <UserManagementCardShape
      useAvatarNameSection={{
        firstName: user?.firstName,
        lastName: user?.lastName,
      }}
      useClientDistrictStatusSection={{
        clientName: client?.name,
        districtOptions: districtOptions,
        selecteddistricts: districtOptions,
        status: currentStatus,
        // onChange: (e) => {
        //   const selected = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
        //   // console.log(selected);
        //   setSelectedDistricts(
        //     (selected as string[]).map((id) =>
        //       districtIdOptions.find((district) => district.id === id),
        //     ) as typeof districtIdOptions,
        //   );
        // },
      }}
      useEmailSection={{
        email: user?.email,
      }}
      useServiceProviderTypeSection={{
        serviceProviderType: user?.serviceProviderType?.name,
      }}
      useXlogsRoleDropDownSection={{
        selectedxlogsRole: xLogsRole || 0,
      }}
      useHistory={{
        historicalStatuses: historicalStatuses,
        initialRegisterationDate: initialRegistrationDate,
        viewHistory: viewHistory,
      }}
      onCardClick={() => {
        setViewHistory((prev) => !prev);
      }}
    />
  );
};

export default UserManagementHistoryCard;
