import ReactDOM from "react-dom/client";
import "./global.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { THEME } from "./design/muiTheme";
import { store } from "./context/store";
import { MSALProvider } from "./msalprovider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NavLayout } from "./layouts/NavLayout";
import FullScreenError from "./design/templates/fullscreen_error_boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import inactivityTracker from "./utils/inactivity_tracker";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
window.onload = function () {
  inactivityTracker();
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      errorElement={
        <NavLayout>
          <FullScreenError />
        </NavLayout>
      }
      path="/*"
      element={<MSALProvider />}
    />,
  ),
);

const queryClient = new QueryClient();

root.render(
  <ThemeProvider theme={THEME}>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </LocalizationProvider>
    </Provider>
  </ThemeProvider>,
);

export const DEVONLY_FORCE_ONBOARDING_FLOW = false;
export const DEVONLY_FORCE_ACCOUNT_REGISTRATION = false;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
