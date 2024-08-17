import {
  ClientsApi,
  Configuration,
  DistrictsApi,
  ServiceProvidersApi,
  StateSnapshotsApi,
  StudentsApi,
  UsersApi,
} from "../profile-sdk";
import { SessionsApi } from "../session-sdk";
import { DEPLOYMENT } from "../constants/deployment";
import {
  AccountStudentsApi,
  ClientSessionCountsApi,
  DuplicateStudentReportsApi,
  FinancialDashboardReportApi,
  HTTPHeaders,
  Configuration as ReportingConfig,
  SessionCountApi,
  SessionLogsApi,
} from "@xng/reporting";
import { APIM_SUBSCRIPTION_KEY } from "../constants/apimSubscriptionKey";
import {
  AccountInfo,
  EventMessage,
  EventType,
  PublicClientApplication,
  SilentRequest,
} from "@azure/msal-browser";
import { apiConfig, msalConfig } from "../authConfig";
import { placeholderForFutureLogErrorText } from "../temp/errorText";
import { eventEmitter } from "../event_emitter";

export const msalInstance = new PublicClientApplication(msalConfig);
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
msalInstance.enableAccountStorageEvents();

/**
 * This file is responsible for initializing our OpenAPI endpoints. Since it is a TS module, it occurs before the React lifecycle.
 */

//This value is set in the Azure Static webapps portal live deployments.
//Developers must set REACT_APP_BRANCH="local" in the .env file located in /frontend.

const LOCAL_SESSION = "https://localhost:7113";
const LOCAL_PROFILE = "https://localhost:7158";
const LOCAL_REPORTING = "https://localhost:7151";
const LOCAL_DEV_SESSION = "https://xngsessionapi-dev.azurewebsites.net";
const LOCAL_DEV_PROFILE = "https://xngprofileapi-dev.azurewebsites.net";
// const LOCAL_DEV_SESSION = "https://xngsessionapi-staging.azurewebsites.net"; // DISCLAIMER: Will test production data. Avoid using where possible.
// const LOCAL_DEV_PROFILE = "https://xngprofileapi-staging.azurewebsites.net"; // DISCLAIMER: Will test production data. Avoid using where possible.
const LOCAL_DEV_REPORTING = "https://xng-apim.azure-api.net/api/dev-reporting";
const DEV_SESSION = "/api/dev-session";
const DEV_PROFILE = "/api/dev-profile";
const DEV_REPORTING = "/api/dev-reporting";
const STAGING_SESSION = "/api/staging-session";
const STAGING_PROFILE = "/api/staging-profile";
const STAGING_REPORTING = "/api/staging-reporting";
const PROD_SESSION = "/api/session";
const PROD_PROFILE = "/api/profile";
const PROD_REPORTING = "/api/reporting";

// The frontend needs to be able to change the "State" header depending on which state the user is in.
// Not sure how best to expose that.
// NOTE: Once all of the other APIs are updated to be redirected to from APIM based on "State" header,
// we can update this to simply "apiHeaders" and use them for all API clients.
const reportingHeaders: HTTPHeaders = {};

// DISCLAIMER: This subscription key should come from an environment variable in the .env
// file that is only populated on developer machines and is never committed to source control.
if (APIM_SUBSCRIPTION_KEY) {
  reportingHeaders["Ocp-Apim-Subscription-Key"] = APIM_SUBSCRIPTION_KEY;
}

var PROFILE_BASE_URL: string;
var SESSION_BASE_URL: string;
var REPORTING_BASE_URL: string;
switch (DEPLOYMENT) {
  case "local":
    PROFILE_BASE_URL = LOCAL_DEV_PROFILE;
    SESSION_BASE_URL = LOCAL_DEV_SESSION;
    REPORTING_BASE_URL = LOCAL_DEV_REPORTING;
    break;
  case "local-frontend-only":
    PROFILE_BASE_URL = LOCAL_DEV_PROFILE;
    SESSION_BASE_URL = LOCAL_DEV_SESSION;
    REPORTING_BASE_URL = LOCAL_DEV_REPORTING;
    break;
  case "local-frontend-and-session-api":
    PROFILE_BASE_URL = LOCAL_DEV_PROFILE;
    SESSION_BASE_URL = LOCAL_SESSION;
    REPORTING_BASE_URL = LOCAL_DEV_REPORTING;
    break;
  case "local-frontend-and-profile-api":
    PROFILE_BASE_URL = LOCAL_PROFILE;
    SESSION_BASE_URL = LOCAL_DEV_SESSION;
    REPORTING_BASE_URL = LOCAL_DEV_REPORTING;
    break;
  case "local-frontend-and-reporting-api":
    PROFILE_BASE_URL = LOCAL_DEV_PROFILE;
    SESSION_BASE_URL = LOCAL_DEV_SESSION;
    REPORTING_BASE_URL = LOCAL_REPORTING;
    break;
  case "local-full-stack":
    PROFILE_BASE_URL = LOCAL_PROFILE;
    SESSION_BASE_URL = LOCAL_SESSION;
    REPORTING_BASE_URL = LOCAL_DEV_REPORTING;
    break;
  case "development":
    PROFILE_BASE_URL = DEV_PROFILE;
    SESSION_BASE_URL = DEV_SESSION;
    REPORTING_BASE_URL = DEV_REPORTING;
    break;
  case "staging":
    PROFILE_BASE_URL = STAGING_PROFILE;
    SESSION_BASE_URL = STAGING_SESSION;
    REPORTING_BASE_URL = PROD_REPORTING;
    // The reporting API is not expected to have a staging environment at this point.
    break;
  default:
    PROFILE_BASE_URL = PROD_PROFILE;
    SESSION_BASE_URL = PROD_SESSION;
    REPORTING_BASE_URL = PROD_REPORTING;
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    event.eventType === EventType.LOGIN_SUCCESS ||
    event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
    event.eventType === EventType.SSO_SILENT_SUCCESS
  ) {
    onLoginSuccessAsync(event).then(() => {
      const request: SilentRequest = {
        scopes: apiConfig.scopes,
        account: msalAccount!, // Assert because application should not call this before msalAccount is populated
      };

      msalInstance
        .acquireTokenSilent(request)
        .then((res) => {
          console.log({ res });

          const PROFILE_CONFIG = new Configuration({
            apiKey: `Bearer ${res.accessToken}`,
            basePath: PROFILE_BASE_URL,
          });

          const SESSIONS_CONFIG = new Configuration({
            apiKey: `Bearer ${res.accessToken}`,
            basePath: SESSION_BASE_URL,
          });

          const REPORTING_CONFIG = new ReportingConfig({
            accessToken: res.accessToken,
            // Base path should point to the APIM instance for all environments. This should still allow users to use the reporting API locally,
            // so long as they include the header "Ocp-Apim-Subscription-Key" with their personal subscription key.
            basePath: REPORTING_BASE_URL,
            headers: reportingHeaders,
          });

          API_SESSION_LOGS = new SessionLogsApi(REPORTING_CONFIG);
          API_DUPLICATE_STUDENT_REPORTS = new DuplicateStudentReportsApi(REPORTING_CONFIG);
          API_ACCOUNT_STUDENTS = new AccountStudentsApi(REPORTING_CONFIG);
          API_SESSIONS_COUNT = new SessionCountApi(REPORTING_CONFIG);
          API_CLIENT_SESSION_COUNTS = new ClientSessionCountsApi(REPORTING_CONFIG);

          API_STUDENTS = new StudentsApi(PROFILE_CONFIG);
          API_DISTRICTS = new DistrictsApi(PROFILE_CONFIG);
          API_USERS = new UsersApi(PROFILE_CONFIG);
          API_CLIENTS = new ClientsApi(PROFILE_CONFIG);
          API_STATESNAPSHOTS = new StateSnapshotsApi(PROFILE_CONFIG);
          API_SERVICEPROVIDERS = new ServiceProvidersApi(PROFILE_CONFIG);
          API_FINANCIAL_DASHBOARD_REPORT= new FinancialDashboardReportApi(REPORTING_CONFIG);
          API_SESSIONS = new SessionsApi(SESSIONS_CONFIG);

          const event = new CustomEvent("apiReady");
          eventEmitter.dispatchEvent(event);
          document.cookie = `forceUserLogoutAt=${res.expiresOn?.getTime()}`;
        })
        .catch((error) => {
          console.error("Failed to acquire bearer token", error);
        });
    });
  }
});

export let msalAccount: AccountInfo | null = null;
export let API_SESSION_LOGS: SessionLogsApi;
export let API_DUPLICATE_STUDENT_REPORTS: DuplicateStudentReportsApi;
export let API_ACCOUNT_STUDENTS: AccountStudentsApi;
export let API_SESSIONS_COUNT: SessionCountApi;
export let API_STUDENTS: StudentsApi;
export let API_DISTRICTS: DistrictsApi;
export let API_USERS: UsersApi;
export let API_CLIENTS: ClientsApi;
export let API_STATESNAPSHOTS: StateSnapshotsApi;
export let API_SERVICEPROVIDERS: ServiceProvidersApi;
export let API_SESSIONS: SessionsApi;
export let API_CLIENT_SESSION_COUNTS: ClientSessionCountsApi;
export const REPORTING_HEADERS = reportingHeaders;
export let API_FINANCIAL_DASHBOARD_REPORT: FinancialDashboardReportApi;

async function onLoginSuccessAsync(event: EventMessage) {
  const account = (event.payload as any).account as AccountInfo;
  msalInstance.setActiveAccount(account);
  if (!account.idTokenClaims) throw new Error(placeholderForFutureLogErrorText);
  if (account.idTokenClaims.oid === undefined) throw new Error(placeholderForFutureLogErrorText);

  msalAccount = account;
}
