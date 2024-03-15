import * as yup from "yup";
import { FC, useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button, NavIdProps, Panel, PanelHeader } from "@vkontakte/vkui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

const useYupValidationResolver = (
  validationSchema: yup.ObjectSchema<{ name: string }>
) =>
  useCallback(
    async (data: { name: string }) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        if (!(errors instanceof yup.ValidationError)) {
          throw errors;
        }
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path!]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );

const validationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[a-zA-Z]+$/)
    .required("Name is required"),
});

export const AgeCheckScreen: FC<NavIdProps> = ({ id }) => {
  const [name, setName] = useState<string>("");
  const { register, handleSubmit, watch } = useForm({
    resolver: useYupValidationResolver(validationSchema),
  });
  const nameValue = watch("name");
  const queryClient = useQueryClient();
  const routeNavigator = useRouteNavigator();

  const fetchAge = async (signal: AbortSignal): Promise<number> => {
    if (isPending) {
      queryClient.cancelQueries({ queryKey: ["data"] });
    }
    const response = await fetch(`https://api.agify.io/?name=${nameValue}`, {
      signal,
    });
    const responseObj = await response.json();
    return responseObj.age;
  };

  const { data, refetch, isPending } = useQuery({
    queryKey: ["data"],
    queryFn: ({ signal }) => fetchAge(signal),
    enabled: false,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (nameValue !== name && nameValue !== "") {
        setName(nameValue);
        refetch();
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [nameValue, name]);

  const onSubmit = async (data: FieldValues) => {
    if (data.name === name || data.name === "") {
      return;
    }

    setName(data.name);
    refetch();
  };

  return (
    <Panel id={id}>
      <PanelHeader>
        <Button
          size="m"
          appearance="positive"
          onClick={() => routeNavigator.back()}
        >
          Узнай случайный факт
        </Button>
      </PanelHeader>
      <form
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "15px",
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="text" placeholder="Введите свое имя..." {...register("name")} />
        {data && <p>{`Ваш возраст ${data}!`}</p>}
        <Button 
          type="submit" 
          appearance="positive"
        >
          Узнать возраст
        </Button>
      </form>
    </Panel>
  );
};
