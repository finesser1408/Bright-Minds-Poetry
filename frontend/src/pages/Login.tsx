import { LoginForm } from "@/components/community/LoginForm";

const Login = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <LoginForm 
      onAuthenticated={() => window.location.href = "/community"}
      onSwitchToRegister={() => window.location.href = "/register"}
    />
  </div>
);

export default Login;
