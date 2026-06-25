import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { Home } from "@/pages/Home/Home";
import { CaregiverDashboard } from "@/pages/CaregiverDashboard/CaregiverDashboard";
import { TripTracking } from "@/pages/TripTracking/TripTracking";
import { OperationsDashboard } from "@/pages/OperationsDashboard/OperationsDashboard";
import { FamilyStatus } from "@/pages/FamilyStatus/FamilyStatus";
import { ReplacementFlow } from "@/pages/ReplacementFlow/ReplacementFlow";
import { CheckIn } from "@/pages/CheckIn/CheckIn";
import { HandoffForm } from "@/pages/HandoffForm/HandoffForm";

export const router = createBrowserRouter([
  { path: ROUTES.home, element: <Home /> },
  { path: ROUTES.caregiver, element: <CaregiverDashboard /> },
  { path: ROUTES.tracking, element: <TripTracking /> },
  { path: ROUTES.operations, element: <OperationsDashboard /> },
  { path: ROUTES.family, element: <FamilyStatus /> },
  { path: ROUTES.replacement, element: <ReplacementFlow /> },
  { path: ROUTES.checkIn, element: <CheckIn /> },
  { path: ROUTES.handoff, element: <HandoffForm /> },
]);
