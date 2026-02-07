import { mutationOptions, useQueryClient } from "@tanstack/react-query";

type MutationOptionsParams<
  TParams extends object | undefined = undefined,
  TVariables = unknown,
> = {
  queryKey?: [...string[]] | [...string[], TParams];
  mutationFn: (variables: TVariables) => Promise<void>;
  successFn?: () => void;
};


export const CreateMutationOptions = <
  TParams extends object | undefined = undefined,
  TVariables = unknown,
>({
  mutationFn,
  queryKey,
  successFn,
}: MutationOptionsParams<TParams, TVariables>) => {
  const queryClient = useQueryClient();

  return mutationOptions({
    mutationFn,
    onSuccess() {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: queryKey });
      }
      if (successFn) successFn();
    },
    onError(error) {
      console.error("Mutation error:", error);
    },
  });
};