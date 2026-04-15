import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import Cookies from "js-cookie";

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ResetPwd from "./pages/auth/ResetPwd.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import Nav from "./components/layout/Nav.jsx";
import Footer from "./components/layout/Footer.jsx";
import Ct, { CtProvider } from "./context/Ct.jsx";

// New Imports
import ReceptionDashboard from "./pages/receptionist/ReceptionDashboard.jsx";
import RegisterPatient from "./pages/receptionist/Registerpatient.jsx";
import BookAppointment from "./pages/receptionist/BookAppointment.jsx";
import MyAppointments from "./pages/patient/MyAppointments.jsx";
import Prescriptions from "./pages/patient/Prescriptions.jsx";
import Appointments from "./pages/doctor/Appointments.jsx";
import WritePrescription from "./pages/doctor/Writeprescription.jsx";
import AllDoctors from "./pages/doctor/AllDoctors.jsx";
import ManageDoctors from "./pages/admin/ManageDoctors.jsx";
import MyPatients from "./pages/doctor/MyPatients.jsx";
import AllPatients from "./pages/receptionist/AllPatients.jsx";
import ReceptionistAppointments from "./pages/receptionist/ReceptionistAppointments.jsx";
import ReceptionistPrescriptions from "./pages/receptionist/ReceptionistPrescriptions.jsx";

import "./App.css";

const ProtectedRoute = ({ children, roles }) => {
    const obj = useContext(Ct);
    const loginInfo = Cookies.get("logininfo");

    if (!loginInfo && !obj.state.token) {
        return <Navigate to="/Login" />;
    }

    if (roles && !roles.includes(obj.state.role?.toLowerCase())) {
        return <Navigate to="/" />;
    }

    return children;
};

const AppContent = () => {
    const obj = useContext(Ct);

    useEffect(() => {
        const loginInfo = Cookies.get("logininfo");
        if (loginInfo) {
            try {
                const data = JSON.parse(loginInfo);
                obj.updstate({...data.user, token: data.token});
            } catch (e) {
                console.error("Failed to parse login info", e);
            }
        }
    }, []);

    return (
        <BrowserRouter>
            <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Nav />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/resetpwd" element={<ResetPwd />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/manage-doctors" element={<ProtectedRoute roles={['admin']}><ManageDoctors /></ProtectedRoute>} />

                        {/* Doctor Routes */}
                        <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
                        <Route path="/doctor/appointments" element={<ProtectedRoute roles={['doctor']}><Appointments /></ProtectedRoute>} />
                        <Route path="/doctor/write-prescription" element={<ProtectedRoute roles={['doctor']}><WritePrescription /></ProtectedRoute>} />
                        <Route path="/doctor/my-patients" element={<ProtectedRoute roles={['doctor']}><MyPatients /></ProtectedRoute>} />
                        <Route path="/doctor/all-doctors" element={<ProtectedRoute roles={['doctor']}><AllDoctors /></ProtectedRoute>} />

                        {/* Patient Routes */}
                        <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
                        <Route path="/patient/my-appointments" element={<ProtectedRoute roles={['patient']}><MyAppointments /></ProtectedRoute>} />
                        <Route path="/patient/prescriptions" element={<ProtectedRoute roles={['patient']}><Prescriptions /></ProtectedRoute>} />

                        {/* Receptionist Routes */}
                        <Route path="/receptionist" element={<ProtectedRoute roles={['receptionist']}><ReceptionDashboard /></ProtectedRoute>} />
                        <Route path="/receptionist/register-patient" element={<ProtectedRoute roles={['receptionist']}><RegisterPatient /></ProtectedRoute>} />
                        <Route path="/receptionist/book-appointment" element={<ProtectedRoute roles={['receptionist']}><BookAppointment /></ProtectedRoute>} />
                        <Route path="/receptionist/all-patients" element={<ProtectedRoute roles={['receptionist']}><AllPatients /></ProtectedRoute>} />
                        <Route path="/receptionist/appointments" element={<ProtectedRoute roles={['receptionist']}><ReceptionistAppointments /></ProtectedRoute>} />
                        <Route path="/receptionist/prescriptions" element={<ProtectedRoute roles={['receptionist']}><ReceptionistPrescriptions /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

function App() {
    return (
        <CtProvider>
            <AppContent />
        </CtProvider>
    );
}

export default App;