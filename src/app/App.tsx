import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";

export function App() {
  return (
    <ShiftProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ShiftProvider>
  );
}
