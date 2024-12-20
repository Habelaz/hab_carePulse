"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl } from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import CustomFormField from "./CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Doctors, IdentificationTypes, PatientFormDefaultValues,GenderOptions } from "@/constants";
import { SelectItem } from "../ui/select";
import FileUploader from "../ui/FileUploader";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    // Log validation errors whenever they change
    console.log("Form Errors:", form.formState.errors);
  }, [form.formState.errors]);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    console.log("sumbit buttin clicked")
    console.log(form.formState.errors);

    setIsLoading(true);
    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type
      })
      formData = new FormData()
      formData.append("blobFile",blobFile)
      formData.append('fileName',values.identificationDocument[0].name)
    }
    try {
      const patientData = {
        ...values,
        userId:user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument:formData,
      }

      // @ts-ignore
      const patient = await registerPatient(patientData)
      console.log(patient)
      if (patient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="mb-7 space-y-4">
          <h1 className="header">Welcome 🖐</h1>
          <p className="text-dark-700">Let us know about yourself </p>
        </div>

        <div className="mb-7 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          className="focus:outline-none"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
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
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone number"
            placeholder="(251) 915 5534 47"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="Asmara Rd,Addis Ababa"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="guardian's name"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency Contact number"
            placeholder="251 986754321"
          />
        </div>

        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information</h2>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  height={32}
                  width={32}
                  alt={doctor.name}
                  className="rounded-full border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Nyala Insurance"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC123456789"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts , penicillin"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="Ibuprofen, paracetamol"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family medical history"
            placeholder="mother has a ...."
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="Tonsillectomy"
          />
        </div>
        <div className="mb-7 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification </h2>
          </div>
        </div>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="identificationType"
          label="Identification Type "
          placeholder="select an Identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="identificationNumber"
          label="Identification number"
          placeholder="1234567"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.SKELETON}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <div className="mb-7 space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy </h2>
          </div>
        </div>
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to discloure information"
        />
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />
        <SubmitButton isLoading={isLoading}> Submit and continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
