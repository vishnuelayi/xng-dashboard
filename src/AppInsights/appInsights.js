import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin, withAITracking } from "@microsoft/applicationinsights-react-js";
import { DEPLOYMENT } from "../constants/deployment";
// https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions?tabs=react

// This is the first pass at implimenting App Insights.  We may want to explore using context

var reactPlugin = new ReactPlugin();
// *** Add the Click Analytics plug-in. ***
/* var clickPluginInstance = new ClickAnalyticsPlugin();
   var clickPluginConfig = {
     autoCapture: true
}; */

switch (DEPLOYMENT) {
  /* 0 = off, 1 = critical errors only, 2 = Everything (errors & warnings) */
  case "local":
    var loggingLevelConsole = 2;
    var loggingLevelTelemetry = 0;
    break;
  case "development":
    var loggingLevelConsole = 1;
    var loggingLevelTelemetry = 0;
    break;
  case "staging":
    var loggingLevelConsole = 1;
    var loggingLevelTelemetry = 1;
    break;
  case "default":
    var loggingLevelConsole = 1;
    var loggingLevelTelemetry = 1;
    break;
}
var ai = new ApplicationInsights({
  config: {
    connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTIONSTRING,
    // *** If you're adding the Click Analytics plug-in, delete the next line. ***
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    addRequestContext: true,
    disableCorrelationHeaders: false,
    disableExceptionTracking: false,
    loggingLevelConsole: loggingLevelConsole,
    loggingLevelTelemetry: loggingLevelTelemetry,
    disableAjaxTracking: true,

    // *** Add the Click Analytics plug-in. ***
    // extensions: [reactPlugin, clickPluginInstance],
    // extensionConfig: {
    //   [reactPlugin.identifier]: { history: browserHistory }
    // *** Add the Click Analytics plug-in. ***
    // [clickPluginInstance.identifier]: clickPluginConfig
    // }
  },
});
ai.loadAppInsights();

export default (Component) => withAITracking(reactPlugin, Component);
const appInsights = ai.appInsights;
export { reactPlugin, appInsights };
