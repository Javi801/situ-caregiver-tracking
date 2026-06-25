import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { Home } from "@/pages/Home/Home";
import { CaregiverDashboard } from "@/pages/CaregiverDashboard/CaregiverDashboard";
import { ShiftDetail } from "@/pages/ShiftDetail/ShiftDetail";
import { TripTracking } from "@/pages/TripTracking/TripTracking";
import { OperationsHome } from "@/pages/Operations/OperationsHome";
import { OperationsShiftProfile } from "@/pages/Operations/OperationsShiftProfile";
import { OperationsReplacement } from "@/pages/Operations/OperationsReplacement";
import { OperationsSwap } from "@/pages/Operations/OperationsSwap";
import { FamilyDashboard } from "@/pages/FamilyStatus/FamilyDashboard";
import { FamilyShiftDetail } from "@/pages/FamilyStatus/FamilyShiftDetail";
import { FamilyRecords } from "@/pages/FamilyStatus/FamilyRecords";
import { CheckIn } from "@/pages/CheckIn/CheckIn";
import { HandoffForm } from "@/pages/HandoffForm/HandoffForm";

export const router = createBrowserRouter([
  { path: ROUTES.home, element: <Home /> },
  { path: ROUTES.caregiver, element: <CaregiverDashboard /> },
  { path: ROUTES.shiftDetail, element: <ShiftDetail /> },
  { path: ROUTES.tracking, element: <TripTracking /> },
  { path: ROUTES.operations, element: <OperationsHome /> },
  { path: ROUTES.operationsShift, element: <OperationsShiftProfile /> },
  { path: ROUTES.operationsReplacement, element: <OperationsReplacement /> },
  { path: ROUTES.operationsSwap, element: <OperationsSwap /> },
  { path: ROUTES.family, element: <FamilyDashboard /> },
  { path: ROUTES.familyShift, element: <FamilyShiftDetail /> },
  { path: ROUTES.familyRecords, element: <FamilyRecords /> },
  { path: ROUTES.checkIn, element: <CheckIn /> },
  { path: ROUTES.handoff, element: <HandoffForm /> },
]);
