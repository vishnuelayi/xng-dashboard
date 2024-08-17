import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import XNGButton from "../common/xng-button";
import XNGClose from "../../../../../design/low-level/button_close";
import { getSizing } from "../../../../../design/sizing";

interface DlgSignatureProps {
  open: boolean;
  onClose: () => void;
  onPostBatch: (fullName: string, isApplyAll: boolean) => void;
  userRoleText: string;
}

export default function DlgSignature({
  open,
  onClose,
  onPostBatch,
  userRoleText,
}: DlgSignatureProps) {
  const [fullName, setFullName] = useState<string>("");
  const [isApplyAll, setApplyAll] = useState<boolean>(false);

  const handlePostBatch = () => {
    onPostBatch(fullName, isApplyAll);
    setFullName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth={"xs"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: getSizing(3),
          width: "100%",
          padding: getSizing(3),
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Electronic Signature</Typography>
          <XNGClose onClick={() => onClose()} size="modal" />
        </Box>
        <Typography sx={{ fontSize: "12px", lineHeight: "20px", fontWeight: 400 }}>
          Please type in your full name to post your electronic signature.
        </Typography>
        <TextField
          placeholder={"Full name"}
          size="small"
          fullWidth
          value={fullName}
          type="text"
          label={"Full name"}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFullName(e.target.value);
          }}
        />
        <Box sx={{ display: "flex" }}>
          <Checkbox
            checked={isApplyAll}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setApplyAll(e.target.checked);
            }}
            sx={{ paddingLeft: "0px", paddingTop: "0px" }}
          />
          <Typography sx={{ fontSize: "12px", lineHeight: "20px", fontWeight: 400 }}>
            Apply this electronic signature to all sessions I {userRoleText.toLocaleLowerCase()}{" "}
            until I log out.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "12px", lineHeight: "20px", fontWeight: 400 }}>
          Selecting <b>“{userRoleText}”</b> will {userRoleText.toLocaleLowerCase()} all eligible
          sessions within the selected date range.
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          <XNGButton onClick={() => handlePostBatch()} disabled={!fullName}>
            {userRoleText}
          </XNGButton>
        </Box>
      </Box>
    </Dialog>
  );
}
