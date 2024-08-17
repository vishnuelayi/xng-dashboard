import { Box, Stack } from "@mui/material";

import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import UsersHistoryCardsFilterType from "../../types/users_history_cards_filter_type";
import UserApprovalsContextType from "../../types/user_approvals_context_type";
import { XNGIconRenderer, XNGICONS } from "../../../../../../design/icons";
import XNGCheckboxLabel from "../../../../../../design/low-level/checkbox_label";
import XNGDropDown from "../../../../../../design/low-level/dropdown2";
import XNGSimpleSearchBar from "../../../../../../design/low-level/simple_searchbar";

type Props = {
  selectedTab: UserApprovalsTabsEnum;
  userManagementData: UserApprovalsContextType["userManagementApiData"]["data"];
  usersFilter: UserApprovalsContextType["userApprovalsFilterData"]["users"];
  disabled: boolean;
};

const UserApprovalFilter = (props: Props) => {
  const { usersFilter, selectedTab, userManagementData } = props;

  // const userManagementData = useUserApprovalsContext().userManagementApiData.data;

  const denialsFilterData = usersFilter.denials;
  const approvalsFilterdata = usersFilter.approvals;
  const historyFilterData = usersFilter.history;

  const historyStatusRemap: Record<string, UsersHistoryCardsFilterType["statusValue"]> = {
    All: 0,
    Approved: 1,
    Denied: 2,
  };

  const searchOptions =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? userManagementData?.deniedUsers?.map(
          (card) => card.user?.firstName + " " + card.user?.lastName,
        )
      : selectedTab === UserApprovalsTabsEnum.user_approvals
      ? userManagementData?.unapprovedUsers?.map(
          (card) => card.user?.firstName + " " + card.user?.lastName,
        )
      : selectedTab === UserApprovalsTabsEnum.approval_denial_history
      ? userManagementData?.approvalAndDenialHistory?.map(
          (card) => card.user?.firstName + " " + card.user?.lastName,
        )
      : [];

  const searchValue =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? denialsFilterData.searchValue
      : selectedTab === UserApprovalsTabsEnum.user_approvals
      ? approvalsFilterdata.searchValue
      : selectedTab === UserApprovalsTabsEnum.approval_denial_history
      ? historyFilterData.searchValue
      : "";
  // console.log(searchValue, "searchValue");
  const setSearchValue =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? denialsFilterData.setSearchValue
      : selectedTab === UserApprovalsTabsEnum.user_approvals
      ? approvalsFilterdata.setSearchValue
      : selectedTab === UserApprovalsTabsEnum.approval_denial_history
      ? historyFilterData.setSearchValue
      : () => {};

  const allCardsSelected =
    selectedTab === UserApprovalsTabsEnum.user_denials
      ? denialsFilterData.selectedAllCards.value
      : selectedTab === UserApprovalsTabsEnum.user_approvals
      ? approvalsFilterdata.selectedAllCards.value
      : false;

  const selectAllCards = () => {
    switch (selectedTab) {
      case UserApprovalsTabsEnum.user_denials:
        denialsFilterData.setSelectAllCards(true);
        break;
      case UserApprovalsTabsEnum.user_approvals:
        approvalsFilterdata.setSelectAllCards(true);
        break;
      default:
        break;
    }
  };

  return (
    <Stack py={3}>
      <Stack
        gap={3}
        alignItems={"center"}
        sx={{
          flexDirection: {
            flexDirection: "column",
            sm: "row",
          },

          justifyContent: {
            justifyContent: "center",
            // sm: "flex-start"
          },
        }}
      >
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <XNGIconRenderer size="md" i={<XNGICONS.Filter />} />
        </Box>
        <Box hidden={selectedTab !== UserApprovalsTabsEnum.approval_denial_history}>
          <XNGDropDown
            id={"status"}
            disabled={props.disabled}
            value={Object.keys(historyStatusRemap)[historyFilterData.statusValue] || "All"}
            items={["All", "Approved", "Denied"]}
            label={"Status"}
            size="small"
            fullWidth
            onChange={(e) => historyFilterData.setStatusValue(historyStatusRemap[e.target.value])}
          />
        </Box>
        <Box
          width={250}
          display={"flex"}
          gap={3}
          alignItems={"center"}
          sx={{
            flexDirection: {
              flexDirection: "column",
              sm: "row",
            },
            justifyContent: {
              justifyContent: "center",
              // sm: "flex-start"
            },
          }}
        >
          <Box flexGrow={1} width={"100%"}>
            <XNGSimpleSearchBar
              id={"search-id"}
              options={(searchOptions as string[]) || []}
              useFilterOptions={{ limit: 20 }}
              value={searchValue}
              onInputChange={(_, v) => setSearchValue(v as string)}
              size={"small"}
              disabled={props.disabled}
              useInputField={{
                label: "",
                placeholder: " Search User",
              }}
              useStartAdornment
              disableDropdown
            />
          </Box>
        </Box>
        <Box hidden={selectedTab === UserApprovalsTabsEnum.approval_denial_history}>
          <XNGCheckboxLabel
            label={"Select All"}
            disabled={props.disabled}
            size="small"
            checked={allCardsSelected}
            onChange={selectAllCards}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default UserApprovalFilter;
