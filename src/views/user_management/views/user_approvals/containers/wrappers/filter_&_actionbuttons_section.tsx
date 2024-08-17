import { Box, Stack } from "@mui/system";
import XNGButton from "../../../../../../design/low-level/button";
import UserApprovalFilter from "../../components/common/user_approval_filter";
import Typography from "@mui/material/Typography";
import useUserApprovalsContext from "../../hooks/context/useUserApprovalsContext";
import UserApprovalsTabsEnum from "../../types/user_approvals_tabs_enum";
import { RespondToManyRequestsForDistrictAccessRequest } from "../../../../../../profile-sdk";
import { Button } from "@mui/material";

const FilterAndActionButtonsSection = () => {
  const selectedTab = useUserApprovalsContext().approvalsTabIndex.selectedTabIndex;

  const userManagementApiData = useUserApprovalsContext().userManagementApiData.data;
  const usersFilterData = useUserApprovalsContext().userApprovalsFilterData.users;
  const userApprovalsActions = useUserApprovalsContext().userApprovalsActions;

  return (
    <Box mb={2}>
      <Typography
        variant="body1"
        fontWeight={700}
        display={selectedTab === UserApprovalsTabsEnum.approval_denial_history ? "block" : "none"}
      >
        To see approval/denial history, click on the user card to view dates.
      </Typography>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          flexDirection: {
            flexDirection: "column",
            sm: "row",
          },
          flexWrap: "wrap",
        }}
      >
        <UserApprovalFilter
          selectedTab={selectedTab}
          usersFilter={usersFilterData}
          userManagementData={userManagementApiData}
          disabled={userApprovalsActions.actionLoading}
        />
        <Stack
          gap={1}
          direction={"row"}
          sx={{
            display:
              selectedTab === UserApprovalsTabsEnum.approval_denial_history ? "none" : "flex",
          }}
        >
          <Button
            color="error"
            disabled={userApprovalsActions.actionLoading}
            sx={{ display: selectedTab !== UserApprovalsTabsEnum.user_approvals ? "none" : "flex" }}
            onClick={() => {
              const requestBodyArray = usersFilterData.approvals.userCards.flatMap(
                (card) => card.requestBodyArray,
              );

              // we get the body to avoid mutating the original requestBodyArray data thereby affecting our mutation the next time we click this button
              const requestBodyCopy = requestBodyArray.map((requestBody) => ({ ...requestBody }));
              requestBodyCopy.forEach((requestBody) => {
                const districtName = requestBody.message; //we stored district name in message field during the mapping process in the card component
                requestBody.message = `You have been denied access to ${districtName}.`;
                requestBody.responseType = 1;
              });
              const respondToManyRequestBody: RespondToManyRequestsForDistrictAccessRequest = {
                responsesToRequestsForDistrictAccess: requestBodyCopy,
              };
              if (requestBodyArray.length > 0)
                userApprovalsActions.onDenyUsers(respondToManyRequestBody);
            }}
          >
            Deny
          </Button>
          <XNGButton
            color="primary"
            disabled={userApprovalsActions.actionLoading}
            onClick={() => {
              const requestBodyArray =
                selectedTab === UserApprovalsTabsEnum.user_approvals
                  ? usersFilterData.approvals.userCards.flatMap((card) => card.requestBodyArray)
                  : usersFilterData.denials.userCards.flatMap((card) => card.requestBodyArray);
              const requestBodyCopy = requestBodyArray.map((requestBody) => ({ ...requestBody }));

              // we get the body to avoid mutating the original requestBodyArray data thereby affecting our mutation the next time we click this button
              requestBodyCopy.forEach((requestBody) => {
                const districtName = requestBody.message; //we stored district name in message field during the mapping process in the card component
                requestBody.message = `You have been granted access to ${districtName}.`;
                requestBody.responseType = 0;
              });
              const respondToManyRequestBody: RespondToManyRequestsForDistrictAccessRequest = {
                responsesToRequestsForDistrictAccess: requestBodyCopy,
              };
              if (requestBodyArray.length > 0)
                userApprovalsActions.onApproveUsers(respondToManyRequestBody);
            }}
          >
            Approve
          </XNGButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FilterAndActionButtonsSection;
