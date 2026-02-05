import { Route, Routes } from "react-router";
import "./App.css";
import { AuthLayout } from "./components";
import { LoginPage, RegisterPage } from "./pages";
import { Notification } from "./components/ui/Notification";
import { NotificationProvider } from "./context";

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden overflow-y-auto">
      <NotificationProvider>
        <Notification />
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* <Route path="/tasks" element={<Layout />}>
          <Route index element={<TasksRenderPage />} />
          <Route path="completed" element={<TasksRenderPage />} />
          <Route path="archived" element={<TasksRenderPage />} />
          <Route path="in-progress" element={<TasksRenderPage />} />
          </Route>
          <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </NotificationProvider>
    </div>
  );
}

export default App;
