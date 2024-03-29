import { useActiveVkuiLocation } from "@vkontakte/vk-mini-apps-router";
import { View, SplitLayout, SplitCol } from "@vkontakte/vkui";

import { DEFAULT_VIEW_PANELS } from "./routes";
import { FactCheckScreen } from "./pages/fact-check-screen";
import { AgeCheckScreen } from "./pages/age-check-screen";

export const Application = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.FIRST } =
    useActiveVkuiLocation();

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <FactCheckScreen id={DEFAULT_VIEW_PANELS.FIRST} />
          <AgeCheckScreen id={DEFAULT_VIEW_PANELS.SECOND} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
