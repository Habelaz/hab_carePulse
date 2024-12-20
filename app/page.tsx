import Image from "next/image";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/ui/PasskeyModal";
import LoginModal from "@/components/ui/LoginModal";

export default async function Home({searchParams}:SearchParamProps) {
  const search = await searchParams
  const isAdmin = search.admin === 'true'
  const isLogin = search.login === 'true'
  // console.log(isLogin)
  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}
      {isLogin && <LoginModal />}
      <div className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
          <div className="flex justify-between">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              height={1000}
              width={1000}
              className="mb-12 h-10 w-fit"
            />
            <Link href="/?login=true">       
             <Button className="shad-primary-btn">Login</Button>
            </Link>
          </div>
          <PatientForm />

          <div className="text-14-regular flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">© 2024 CarePulse</p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </div>

      <Image 
        src="/assets/images/onboarding-img.png"
        alt="doctor"
        height = {1000}
        width = {1000}
        className="side-img max-w-[50%]"

      />
    </div>
  );
}

