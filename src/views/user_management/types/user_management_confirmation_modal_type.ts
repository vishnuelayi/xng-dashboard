import { SxProps } from "@mui/material";
import React from "react";

type UserManagementConfirmationModalType = {
  isOpen: boolean;
  icon?: "warning" | "danger";
  title?: string;
  body: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  styleBtns?: {
    yesButton: SxProps;
    noButton: SxProps;
  };
};

export default UserManagementConfirmationModalType;
