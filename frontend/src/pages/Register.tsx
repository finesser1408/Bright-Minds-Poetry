import { RegisterForm } from "@/components/community/RegisterForm";

const Register = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <RegisterForm 
      onAuthenticated={() => window.location.href = "/community"}
      onSwitchToLogin={() => window.location.href = "/login"}
    />
  </div>
);

export default Register;
