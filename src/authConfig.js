import { LogLevel } from "@azure/msal-browser";
import { DEPLOYMENT } from "./constants/deployment";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

switch (DEPLOYMENT) {
  case "local":
    var postLogoutRedirectUri = "/";
    break;
  case "development":
    var postLogoutRedirectUri = "https://dev-solutions.msbconnect.com";
    break;
  case "staging":
    var postLogoutRedirectUri = "https://beta-solutions.msbconnect.com";
    break;
  default:
    var postLogoutRedirectUri = "https://xlogs.msbconnect.com/";
    break;
}

export const b2cPolicies = {
  names: {
    signUpSignIn: "B2C_1_xng_unified_signup_signin",
    forgotPassword: "B2C_xng_password_reset",
    editProfile: "b2c_1_xng_edit_profile",
  },
  authorities: {
    signUpSignIn: {
      authority:
        "https://msbsconnect.b2clogin.com/msbsconnect.onmicrosoft.com/B2C_1_xng_unified_signup_signin",
    },
    forgotPassword: {
      authority:
        "https://msbsconnect.b2clogin.com/msbsconnect.onmicrosoft.com/B2C_1_xng_password_reset",
    },
    editProfile: {
      authority:
        "https://msbsconnect.b2clogin.com/msbsconnect.onmicrosoft.com/b2c_1_xng_edit_profile",
    },
  },
  authorityDomain: "https://msbsconnect.onmicrosoft.com",
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: "8dd4ed0f-5ff7-4d6b-8e80-defe02e900c8", // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    // STEVEN: I added b2cPolicies.authorities.signUpSignIn.authority to fix a 400 response while attempting to login. It didn't trust our signUpSignIn endpoint.
    knownAuthorities: [b2cPolicies.authorityDomain, b2cPolicies.authorities.signUpSignIn.authority], // Mark your B2C tenant's domain as trusted.
    redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: postLogoutRedirectUri, // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: true, //If true, will navigate back to the original request location before processing the authorization code response.
  },
  cache: {
    cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE || isEdge || isFirefox,
    secureCoockies: "true",
  },
  system: {
    loggerOptions: {
      allowNativeBroker: false, // Disables WAM Broker
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            // console.error(message);
            return;
          case LogLevel.Info:
            // console.info(message);
            return;
          case LogLevel.Verbose:
            // console.debug(message);
            return;
          case LogLevel.Warning:
            // console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};
/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["https://msbsconnect.onmicrosoft.com/xng-apim/xng.read"],
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const apiConfig = {
  scopes: ["https://msbsconnect.onmicrosoft.com/xng-apim/xng.read"],
  uri: "https://msbsconnect.onmicrosoft.com/xng-apim",
};
