import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";
import { AuthLayout, Layout, PageWrapper, ProtectedRoute } from "./components";
import { LoginPage, RegisterPage } from "./pages";
import { Notification } from "./components/ui/Notification";
import { AuthProvider, NotificationProvider } from "./context";
import TaskRenderPage, { Status } from "./pages/TaskPages/TaskRenderPage";
import ErrorHandlePage from "./pages/ErrorHandlePage";

function App() {
  const location = useLocation();

  return (
    <div className="w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <AuthProvider>
          <NotificationProvider>
            <Notification />
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <PageWrapper>
                      <TaskRenderPage status={Status.Pending} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="completed"
                  element={
                    <PageWrapper>
                      <TaskRenderPage status={Status.Completed} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="archived"
                  element={
                    <PageWrapper>
                      <TaskRenderPage status={Status.Archived} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="in-progress"
                  element={
                    <PageWrapper>
                      <TaskRenderPage status={Status.InProgress} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="all"
                  element={
                    <PageWrapper>
                      <TaskRenderPage status="all"/>
                    </PageWrapper>
                  }
                />
              </Route>
              <Route path="*" element={<ErrorHandlePage/>}/>
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </AnimatePresence>
    </div>
  );
}

export default App;
