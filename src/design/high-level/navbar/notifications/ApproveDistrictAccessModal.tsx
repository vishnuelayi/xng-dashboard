import {
  Dialog,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import Box from "../../../components-dev/BoxExtended";
import { getSizing } from "../../../sizing";
import { useState } from "react";
import XNGButton from "../../../low-level/button";
import { DistrictAccessRequest } from "../../../../profile-sdk";
import { XLogsRoleStrings } from "../../../../context/types/xlogsrole";

interface IApproveDistrictAccessModal {
  handleDone: (role: XLogsRoleStrings) => void;
  districtAccessRequest: DistrictAccessRequest | undefined;
  setShowApproveDistrictAccessModal: (show: boolean) => void;
  showApproveDistrictAccessModal: boolean;
}
export function ApproveDistrictAccessModal(props: IApproveDistrictAccessModal) {
  const requestingUser = props.districtAccessRequest?.requestingUser;
  const roles = [
    "Service Provider - Autonomous",
    "Service Provider - Assistant",
    "Approver",
    "Proxy Data Entry",
    "Delegated Admin",
    "Executive Admin",
  ];

  const [selectedRole, setSelectedRole] = useState<XLogsRoleStrings>("Service Provider - Autonomous");

  function onSelectChange(event: SelectChangeEvent<XLogsRoleStrings>) {
    const role = event.target.value;
    setSelectedRole(role as XLogsRoleStrings);
  }
  return (
    <Dialog
      className="noselect"
      onClose={() => {
        props.setShowApproveDistrictAccessModal(false);
      }}
      open={props.showApproveDistrictAccessModal}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          paddingTop: getSizing(3),
          paddingBottom: getSizing(2),
          paddingX: getSizing(2),
        }}
      >
        <Typography variant="h6">Please Select Provider Role</Typography>
        <Typography variant="body1">
          Please select the appropriate role for the provider you would like to approve.
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {requestingUser?.firstName} {requestingUser?.lastName}:
        </Typography>
        <Box
          display="inline-flex"
          sx={{
            gap: getSizing(1),
          }}
        >
          <Typography variant="body1" sx={{ textDecoration: "underline" }}>
            Service Provider Type:
          </Typography>
          <Typography variant="body1">{requestingUser?.serviceProviderType?.name}</Typography>
        </Box>
        <Box
          display="inline-flex"
          sx={{
            gap: getSizing(1),
          }}
        >
          <Typography variant="body1" sx={{ textDecoration: "underline" }}>
            X Logs Role Assigned:
          </Typography>
          <Box sx={{ position: "relative", minWidth: getSizing(15) }}>
            <FormControl fullWidth>
              <Select
                sx={{ height: getSizing(3) }}
                name="dropdown"
                value={selectedRole}
                onChange={(e) => onSelectChange(e)}
              >
                {roles.map((d: any, index: number) => {
                  return (
                    <MenuItem key={index} value={d}>
                      {d}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "inline-flex",
            justifyContent: "center",
          }}
        >
          <XNGButton
            sx={{
              width: getSizing(6),
            }}
            onClick={() => {
              props.setShowApproveDistrictAccessModal(false);
              props.handleDone(selectedRole);
            }}
          >
            Done
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
