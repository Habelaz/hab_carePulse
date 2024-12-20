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
import { getAppointmentSchema, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

interface appoint {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?:Appointment;
  setOpen:(open:boolean) => void
}
const AppointmentForm = ({ userId, patientId, type,appointment ,setOpen}: appoint) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician:appointment && appointment.primaryPhysician,
      schedule:appointment ?  new Date(appointment.schedule): new Date(),
      reason:appointment ? appointment.reason: '',
      note:appointment ? appointment.note:"",
      cancellationReason:appointment?.cancellationReason || '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    // console.log('im submitting',{type})
    setIsLoading(true);

    let status;
    switch(type){
        case 'schedule':
            status='scheduled'
            break
        case 'cancel':
            status = 'cancelled'
            break
        default:
            status = 'pending'
            break
    }

    try {
        if (type === "create" && patientId){
            const appointmentData ={
                userId,
                patient: patientId,
                primaryPhysician:values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note:values.note,
                status:status as Status,
            }
            const appointment = await createAppointment(appointmentData)
            // console.log(appointment)
            if(appointment) {
                form.reset()
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        }else{
          const appointmentToUpdate ={
            userId,
            appointmentId:appointment!.$id,
            appointment:{
              primaryPhysician:values?.primaryPhysician,
              schedule:new Date(values?.schedule),
              cancellationReason:values?.cancellationReason,
              status:status as Status,

            },
            type
          }
          const updatedAppointment = await updateAppointment(appointmentToUpdate)
          if(updatedAppointment){
            setOpen && setOpen(false)
            form.reset()
          }
        }

    } catch (error) {
        console.log(error)
    }
}

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' && <div className="mb-7">
          <h1 className="header">New Appointment </h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </div>}

        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="select a Doctor"
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

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col lg:flex-row gap-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for Appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter Notes"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
