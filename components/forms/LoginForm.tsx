"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";

import CustomFormField from "./CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { LoginFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "input",
}

const LoginForm = ({ onLoginFailure }: { onLoginFailure: () => void }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit({ name, email }: z.infer<typeof LoginFormValidation>) {
    setIsLoading(true);
  
    try {
      const userData = { name, email };
      const user = await loginUser(userData);
  
      if (user) {
        if (user.isRegistered) {
          router.push(`/patients/${user.$id}/new-appointment`);
        } else {
          router.push(`/patients/${user.$id}/register`);
        }
      } else {
        // User does not exist
        onLoginFailure();
      }
    } catch (error) {
      console.error(error);
      onLoginFailure();
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="Johndoe@gmail.com"
        />
        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  );
};

export default LoginForm;
