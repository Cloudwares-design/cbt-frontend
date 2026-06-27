import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

// STUDENT
import StudentDashboard from "./pages/student/StudentDashboard";
import Exam from "./pages/student/Exam";
import StudentResult from "./pages/student/StudentResult";
import Results from "./pages/student/Results";
import ExamInstructions from "./pages/student/ExamInstructions";



// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateExam from "./pages/admin/CreateExam";
import AddQuestion from "./pages/admin/AddQuestion";
import ManageStudents from "./pages/admin/ManageStudents";
import ViewResults from "./pages/admin/ViewResults";
import ManageExams from "./pages/admin/ManageExams";
import ExamResults from "./pages/admin/ExamResults";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />
<Route
  path="/student/exam/:examId/instructions"
  element={<ExamInstructions />}
/>
        <Route
          path="/student/exam/:examId/start"
          element={<Exam />}
        />
        <Route
  path="/student/results"
  element={<Results />}
/>
        <Route path="/student/result/:examId" element={<StudentResult />} />

        {/* ADMIN */}
        {/* ADMIN */}
<Route path="/admin" element={<AdminDashboard />} />

<Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="/admin/create-exam"
          element={<CreateExam />}
        />
<Route
  path="/admin/manage-exams"
  element={<ManageExams />}
/>
        <Route
          path="/admin/add-question"
          element={<AddQuestion />}
        />
        <Route
          path="/admin/manage-students"
          element={<ManageStudents />}
        />
        <Route path="/admin/results" element={<ViewResults />} />
           <Route
  path="/admin/results/:examId"
  element={<ExamResults />}
/>
      </Routes>
   
    </BrowserRouter>
  );
}

export default App;