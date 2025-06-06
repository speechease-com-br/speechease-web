"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MicrophoneIcon as Mic,
  ArrowRightIcon as ArrowRight,
  ChatBubbleLeftRightIcon as Quote,
} from "@heroicons/react/24/outline";
import { LoginProps } from "./types";

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  lastName: z.string().min(1, { message: "Sobrenome é obrigatório" }),
  email: z.string().email({ message: "Por favor, insira um email válido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

// Array of motivational quotes about language learning
const quotes = [
  {
    text: "Learning another language is not only learning different words for the same things, but learning another way to think about things.",
    author: "Flora Lewis",
  },
  {
    text: "One language sets you in a corridor for life. Two languages open every door along the way.",
    author: "Frank Smith",
  },
  {
    text: "The limits of my language mean the limits of my world.",
    author: "Ludwig Wittgenstein",
  },
  {
    text: "To have another language is to possess a second soul.",
    author: "Charlemagne",
  },
  {
    text: "Language is the road map of a culture. It tells you where its people come from and where they are going.",
    author: "Rita Mae Brown",
  },
];

export default function LoginPage({
  form,
  isLoading,
  loginResponse,
  onCreateAccount,
}: LoginProps) {
  const randomQuote = quotes[0];

  const onSubmit = (data: any) => {
    onCreateAccount(data)
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary rounded-full p-1">
                <Mic className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">speech.ease</h2>
            </div>
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar sua conta
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu nome</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu sobrenome</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="text-sm font-medium text-destructive">
                    {form.formState.errors.root.message}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button className="w-full" size="lg" type="submit">
                  Criar conta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="text-center text-sm">
                  Já tem uma conta?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Entre aqui
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      {/* Right side - Decorative with quotes */}
      <div
        className={`flex-1 flex items-center justify-center p-10 bg-primary/5"}`}
      >
        <div className="max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6">
                <Quote className="h-12 w-12 text-primary/30" />
              </div>
              <div className="bg-card border border-border rounded-lg p-8 shadow-xl relative z-10">
                <blockquote className="text-xl md:text-2xl font-medium italic mb-4">
                  "{randomQuote.text}"
                </blockquote>
                <footer className="text-right text-muted-foreground">
                  — <cite>{randomQuote.author}</cite>
                </footer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Pratique com GUGA</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu tutor pessoal de inglês disponível 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 shadow-md">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Acompanhamento diário
                </h3>
                <p className="text-sm text-muted-foreground">
                  Monitore seu progresso e mantenha sua sequência
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 shadow-md">
                <h3 className="font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                  Feedback em tempo real
                </h3>
                <p className="text-sm text-muted-foreground">
                  Melhore sua pronúncia com feedback instantâneo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
