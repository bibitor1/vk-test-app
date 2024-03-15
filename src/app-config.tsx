import vkBridge, { parseURLSearchParamsForGetLaunchParams } from "@vkontakte/vk-bridge";
import { useAdaptivity, useAppearance, useInsets } from "@vkontakte/vk-bridge-react";
import { AdaptivityProvider, ConfigProvider, AppRoot } from "@vkontakte/vkui";
import { RouterProvider } from "@vkontakte/vk-mini-apps-router";
import "@vkontakte/vkui/dist/vkui.css";
  
import { transformVKBridgeAdaptivity } from "./utils/transformVKBridgeAdaptivity";
import { router } from "./routes";
import { Application } from "./application";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  
export const AppConfig = () => {
  const vkBridgeAppearance = useAppearance() || undefined;
  const vkBridgeInsets = useInsets() || undefined;
  const adaptivity = transformVKBridgeAdaptivity(useAdaptivity());
  const { vk_platform } = parseURLSearchParamsForGetLaunchParams(
    window.location.search
  );
  const queryClient = new QueryClient();
  
  return (
    <ConfigProvider
      appearance={vkBridgeAppearance}
      platform={vk_platform === "desktop_web" ? "vkcom" : undefined}
      isWebView={vkBridge.isWebView()}
      hasCustomPanelHeaderAfter={true}
    >
      <QueryClientProvider client={queryClient}>
        <AdaptivityProvider {...adaptivity}>
          <AppRoot mode="full" safeAreaInsets={vkBridgeInsets}>
            <RouterProvider router={router}>
              <Application />
            </RouterProvider>
          </AppRoot>
        </AdaptivityProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};
