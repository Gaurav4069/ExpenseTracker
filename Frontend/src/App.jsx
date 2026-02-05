import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Groups from "./pages/Groups";
import GroupDashboard from "./pages/GroupDashboard";
import Register from "./pages/Register";
import GroupParticipantsPage from "./components/groups/GroupParticipantsPage";
import GroupExpensesPage from "./components/groups/GroupExpensesPage";



const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        {/* Page content offset for fixed navbar */}
        <main className="pt-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />


            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              }
            />

            <Route
              path="/groups/:groupId"
              element={
                <ProtectedRoute>
                  <GroupDashboard />
                </ProtectedRoute>
              }
            />
            <Route
  path="/groups/:groupId/participants"
  element={<GroupParticipantsPage />}
/>
            <Route
  path="/groups/:groupId/expenses"
  element={<GroupExpensesPage />}
/>
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
