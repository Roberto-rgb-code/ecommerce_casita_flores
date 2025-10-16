"use client";

import { useToast } from "@/contexts/ToastContext";
import Toast from "./Toast";

export default function ToastContainer() {
  const { state, dispatch } = useToast();

  return (
    <>
      {state.toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={true}
          onClose={() => dispatch({ type: "REMOVE_TOAST", payload: toast.id })}
        />
      ))}
    </>
  );
}
