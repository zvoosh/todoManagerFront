import { mutationOptions, useQueryClient } from "@tanstack/react-query";
export type CreateReturnType = {
  message: string;
  user: {
    email: string;
    id: string;
    username: string;
  };
};

type MutationOptionsParams<
  TParams extends object | undefined = undefined,
  TVariables = unknown,
> = {
  queryKey?: [...string[]] | [...string[], TParams];
  mutationFn: (variables: TVariables) => Promise<void>;
  successFn?: (data?: CreateReturnType) => void;
  errorFn?: () => void;
};

export const CreateMutationOptions = <
  TParams extends object | undefined = undefined,
  TVariables = unknown,
>({
  mutationFn,
  queryKey,
  successFn,
  errorFn,
}: MutationOptionsParams<TParams, TVariables>) => {
  const queryClient = useQueryClient();

  return mutationOptions({
    mutationFn,
    onSuccess(data) {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: queryKey });
      }
      if (successFn && data) {
        successFn(data);
        return;
      }
      if (successFn) successFn();
    },
    onError() {
      if (errorFn) errorFn();
    },
  });
};
