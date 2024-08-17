// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "@testing-library/jest-dom";
import { store } from "./context/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

jest.mock("@azure/msal-browser", () => {
  const { msalMock } = require("../tests/mocks");
  return msalMock;
});

const queryClient = new QueryClient();

function TestProviders({ children }: { children: React.ReactNode }): JSX.Element {
  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/*" element={children} />),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={router} />
        </LocalizationProvider>{" "}
      </Provider>{" "}
    </QueryClientProvider>
  );
}

export { TestProviders };
