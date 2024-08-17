import { NavigationClient } from "@azure/msal-browser";

/**
 * This is an example for overriding the default function MSAL uses to navigate to other urls in your webpage
 */
export class CustomNavigationClient extends NavigationClient {
  navigate: (url: string, options?: any) => Promise<boolean>;

  constructor(navigate: (url: string, options?: any) => Promise<boolean>) {
    super();
    this.navigate = navigate;
  }

  /**
   * Navigates to other pages within the same web application
   * You can use the useNavigate hook provided by react-router-dom to take advantage of client-side routing
   * @param url
   * @param options
   */
  async navigateInternal(url: string, options?: { noHistory?: boolean }): Promise<boolean> {
    const relativePath = url.replace(window.location.origin, "");
    if (options?.noHistory) {
      await this.navigate(relativePath, { replace: true });
    } else {
      await this.navigate(relativePath);
    }

    return false;
  }

  // CODE FROM CHAT GPT
  navigateToUrl(url: string): Promise<boolean> {
    // This should never be called because the `popupWindow` option is set to false
    // and `redirectUri` is set to `window.location.href`
    return Promise.resolve(false);
  }

  //   navigateInternal(url: string, options: { [key: string]: string }): void {
  //     const navigate = options.noHistory
  //       ? () => window.location.replace(url)
  //       : () => {
  //           window.location.assign(url);
  //         };

  //     navigate();
  //   }

  async navigateBack(): Promise<boolean> {
    window.history.back();
    return Promise.resolve(true);
  }

  async navigateForward(): Promise<boolean> {
    window.history.forward();
    return Promise.resolve(true);
  }
}
