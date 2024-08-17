export function cookieExists(name: string) {
  return document.cookie.split(";").some((item) => item.trim().startsWith(name + "="));
}

export function setLoggedInUserCookie(
  userID: string,
  originalUserID: string,
  providerID: string,
  clientID: string,
) {
  const date = new Date();
  const date2 = new Date();
  // set cookie expiration in 30 minutes
  date.setTime(date.getTime() + 1800000);
  date2.setTime(date2.getTime() + 2100000);

  document.cookie = `loggedInAsUserID=${userID}; expires=${date.toUTCString()}; path=/xlogs;`;
  document.cookie = `loggedInUserProviderID=${providerID}; expires=${date.toUTCString()}; path=/xlogs;`;
  document.cookie = `loggedInUserClientID=${clientID}; expires=${date.toUTCString()}; path=/xlogs;`;
  if (!cookieExists("originalUserID")) {
    document.cookie = `originalUserID=${originalUserID}; expires=${date2.toUTCString()}; path=/xlogs;`;
  }
  document.cookie = `requireUserRefresh=true; expires=${date.toUTCString()}; path=/xlogs;`;
}

export function isLoggedInUserCookieExpired() {
  if (!cookieExists("loggedInAsUserID") && cookieExists("originalUserID")) {
    return true;
  } else {
    return false;
  }
}

export function clearLoggedInUserCookie() {
  // the paths are different sometimes, not quite sure why
  // this should be fixed now but leaving both cookie paths just in case
  document.cookie = `loggedInAsUserID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
  document.cookie = `loggedInAsUserID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
  document.cookie = `originalUserID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
  document.cookie = `originalUserID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
  document.cookie = `loggedInUserProviderID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
  document.cookie = `loggedInUserProviderID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
  document.cookie = `loggedInUserClientID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
  document.cookie = `loggedInUserClientID=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
  document.cookie = `requireUserRefresh=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs;`;
  document.cookie = `requireUserRefresh=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/xlogs/admin;`;
}

export function extractCookieValue(name: string) {
  const value = document.cookie.split(";").filter((item) => item.trim().startsWith(name + "="))[0];
  return value.slice(value.indexOf("=") + 1);
}
