import Image from "next/image";
import { Button } from "@/components/ui/button";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Link from "next/link";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({params}: {params: { userId: string }}) {
  const { userId } = await params; // Await the params object
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <div className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between ">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <h1></h1>
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 CarePulse
          </p>
        </div>
      </div>

      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
