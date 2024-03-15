import { FC, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Div, NavIdProps, Panel, PanelHeader } from "@vkontakte/vkui";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

import { Fact } from "../types/app-types";

const fetchData = async (): Promise<Fact> => {
  const response = await fetch("https://catfact.ninja/fact");
  return await response.json();
};

export const FactCheckScreen: FC<NavIdProps> = ({ id }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const routeNavigator = useRouteNavigator();

  const { data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
    enabled: false,
  });

  const handleClick = async () => {
    await refetch();
  };

  useEffect(() => {
    if (data && ref.current && data.fact) {
      const textarea = ref.current;
      const firstWord = data.fact.indexOf(" ");
      textarea.setSelectionRange(firstWord, firstWord);
      textarea.focus();
    }
  }, [data]);

  return (
    <Panel id={id}>
      <PanelHeader>
        <Button
          size="m"
          appearance="positive"
          onClick={() => routeNavigator.push("second")}
        >
          Узнай свой возраст по имени
        </Button>
      </PanelHeader>

      <Div
        style={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          onClick={handleClick}
          appearance="positive"
          style={{ marginBlock: "20px" }}
        >
          Узнать случайный факт
        </Button>
        <textarea
          ref={ref}
          value={data?.fact}
          style={{
            display: "block",
            width: "400px",
            height: "200px",
            resize: "none",
          }}
        />
      </Div>
    </Panel>
  );
}