"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { Suspense } from "react";
import SignUpPage from "./page-container";
import { authService } from "@/infrastructure/auth-infra";
import useToast from "@/main/hooks/use-toast";
import useLocalStorage from "@/main/hooks/use-session-storage";
import { Request } from "@/main/constants/requests";
import { reactQueryClient } from "@/main/ReactQueryContext/ReactQueryContext";

const REQUEST_MESSAGES = {
  LOGIN_SUCCESS: "Login realizado com sucesso! Redirecionando para a tela inicial.",
  UNKNOWN_ERROR: "Ocorreu um erro desconhecido. Por favor, tente novamente.",
};

export type ErrorResponse = { status: number, code: string, response: { data: { body: string } } };

export default function Login() {
  const router = useRouter();
  
  const form = useForm();
  console.log('form: ', form);

  const { showError, showSuccess } = useToast();

  const [_, setToken] = useLocalStorage("@speechease.token", null)
  
  const { email, password } = form.watch();
  
  const { data, isPending, mutate } = useMutation({
    mutationFn: () => authService.login({ email, password }),
    onSuccess: (req) => {
      reactQueryClient.invalidateQueries({ queryKey: ["/me"] })
      const { body } = req;
      setToken(body.data)
      showSuccess(REQUEST_MESSAGES.LOGIN_SUCCESS);
      router.push('/');
    },
    onError: (err: ErrorResponse) => {
      console.error('err: ', err);
      if (err.code === Request.ERR_BAD_REQUEST) {
        showError(err.response.data.body);
        return;
      }
      showError(REQUEST_MESSAGES.UNKNOWN_ERROR);
    },
  });

  return (
    <Suspense>
      <SignUpPage
      form={form}
      onSignupAccount={mutate}
      isLoading={isPending}
      loginResponse={data}
    />
    </Suspense>
  );
}
