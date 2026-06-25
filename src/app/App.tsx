import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { ShiftProvider } from "@/hooks/ShiftProvider";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { SimulateDelayButton } from "@/components/feedback/SimulateDelayButton";

export function App() {
  return (
    <ShiftProvider>
      <ToastProvider>
        <RouterProvider router={router} />
        <SimulateDelayButton />
      </ToastProvider>
    </ShiftProvider>
  );
}
