"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import LoginForm from "../forms/LoginForm";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const [open, setOpen] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  useEffect(() => {
    if (showMessage) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(interval);
        closeModal();
      }

      return () => clearInterval(interval);
    }
  }, [showMessage, countdown]);

  return (
    <Dialog open={open} onOpenChange={closeModal} >
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader>
          {showMessage !== true && <DialogTitle className="text-center text-3xl mb-6">Welcome Back</DialogTitle>}
        </DialogHeader>
        {showMessage ? (
          <div className="text-center space-y-2">
            <p className="text-xl font-bold">Email not found. Please register first.</p>
            <p>Redirecting in <span className="text-red-800">{countdown}</span>  seconds...</p>
          </div>
        ) : (
          <DialogDescription asChild>
            <div>
              <LoginForm onLoginFailure={() => setShowMessage(true)} />
            </div>
          </DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
