import { UseMutateFunction } from "@tanstack/react-query";
import { FieldValues, UseFormHandleSubmit, UseFormReturn } from "react-hook-form";

export type LoginProps = {
  loginResponse: { statusCode: number; body: string };
  isLoading: boolean;
  form: UseFormReturn<FieldValues, any, FieldValues>
  onCreateAccount: UseMutateFunction<any, { status: number }, void, unknown>;
};
