"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { Suspense } from "react";
import LoginPage from "./page-container";
import { authService } from "@/infrastructure/auth-infra";
import useToast from "@/main/hooks/use-toast";
import useLocalStorage from "@/main/hooks/use-session-storage";

const REQUEST_MESSAGES = {
  LOGIN_SUCCESS: "Login realizado com sucesso! Redirecionando para a tela inicial.",
  UNKNOWN_ERROR: "Ocorreu um erro desconhecido. Por favor, tente novamente.",
};

export default function Login() {
  const router = useRouter();
  
  const form = useForm();
  console.log('form: ', form);

  const { showError, showSuccess } = useToast();

  const [_, setToken] = useLocalStorage("@speechease.token", null)
  
  const { email, password, lastName, name } = form.watch();
  
  const { data, isPending, mutate } = useMutation({
    mutationFn: () => authService.signup({ email, password, lastName, name }),
    onSuccess: (req) => {
      const { body } = req;
      setToken(body.body)
      showSuccess(REQUEST_MESSAGES.LOGIN_SUCCESS);
      router.push('/');
    },
    onError: (err: { status: number }) => {
      console.log('err: ', err);
      showError(REQUEST_MESSAGES.UNKNOWN_ERROR);
    },
  });

  return (
    <Suspense>
      <LoginPage
      form={form}
      onCreateAccount={mutate}
      isLoading={isPending}
      loginResponse={data}
    />
    </Suspense>
  );
}
