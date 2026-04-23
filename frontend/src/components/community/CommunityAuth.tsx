
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface CommunityAuthProps {
  onAuthenticated: (userData: { name: string; email: string }) => void;
}

export const CommunityAuth = ({ onAuthenticated }: CommunityAuthProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <LoginForm 
          onAuthenticated={onAuthenticated} 
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm 
          onAuthenticated={onAuthenticated} 
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  );
};
