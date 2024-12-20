import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';
import Image from 'next/image';
import React from 'react';

const Register = async ({ params }: { params: { userId: string } }) => {
  const  {userId}  = await params;
  const user = await getUser(userId); // This might return undefined

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen">
      <div className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user} />
          <p className="copyright py-12">© 2024 CarePulse</p>
        </div>
      </div>
      <Image
        src="/assets/images/register-img.png"
        alt="doctor"
        height={1000}
        width={1000}
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
