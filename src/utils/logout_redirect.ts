import { PublicClientApplication } from "@azure/msal-browser";
import sessionStorageKeys from "../constants/sessionStorageKeys";
import { clearLoggedInUserCookie } from "./cookies";
import { msalConfig } from "../authConfig";

export default function logoutRedirect() {
  clearLoggedInUserCookie();

  if (sessionStorage.getItem(sessionStorageKeys.ALL_SESSIONS_ELECTRONIC_SIGNATURE_KEY)) {
    sessionStorage.removeItem(sessionStorageKeys.ALL_SESSIONS_ELECTRONIC_SIGNATURE_KEY);
  }
  const msalInstance = new PublicClientApplication(msalConfig);
  msalInstance.logoutRedirect();
}
