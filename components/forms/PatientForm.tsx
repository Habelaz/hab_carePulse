"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import CustomFormField from "./CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneinput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datepicker",
  SELECT = "select",
  SKELETON = "skeleton",
}


const PatientForm = () => {
  const router = useRouter()
  const [isLoading,setIsLoading] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email:"",
      phone:""
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try{
      const userData = {name,email,phone}
      const user = await createUser(userData)
      if (user){
        router.push(`/patients/${user.$id}/register`)
      }
    } catch(error){
      console.log(error)
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <div className="mb-7">
          <h1 className="header">Hi there 🖐</h1>
          <p className="text-dark-700">Schedule your first Appointment ....</p>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          className = "focus:outline-none"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="Johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        
        <CustomFormField 
         control = {form.control}
         fieldType = {FormFieldType.PHONE_INPUT}
         name = "phone"
         label = "Phone number"
         placeholder = "(251) 915 5534 47"
         iconSrc ="/assets/icons/user.svg"
         iconAlt = "user"
        />

        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
