import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import PatientDetail from '../pages/PatientDetail';
import Exercises from '../pages/ExercisesLib';
import TreatmentManager from '../pages/TreatmentManager';
import Accounts from '../pages/AccountList';
import MusclePage from '../pages/MusclePage';
import ReportsList from '../pages/ReportsList';
import ReportDetail from '../pages/ReportDetail';
import PatientList from '../pages/PatientList';
import MedicalResources from '../pages/MedicalResources';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="plans" element={<TreatmentManager />} />
        <Route path="muscles" element={<MusclePage />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="reports" element={<ReportsList />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="assignments" element={<PatientList />} />
        <Route path="resources" element={<MedicalResources />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
