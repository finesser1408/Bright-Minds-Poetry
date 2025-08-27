
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  onAuthenticated: (userData: { name: string; email: string }) => void;
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onAuthenticated, onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!formData.identifier || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Real authentication
    import("@/lib/api").then(({ login }) => {
      login(formData.identifier, formData.password)
        .then(response => {
          setIsLoading(false);
          localStorage.setItem("accessToken", response.data.access || response.data.key);
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in.",
          });
          onAuthenticated({ name: formData.identifier, email: formData.identifier });
        })
        .catch(() => {
          setIsLoading(false);
          toast({
            title: "Login failed",
            description: "Invalid credentials. Please try again.",
            variant: "destructive",
          });
        });
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-playfair">Sign In</CardTitle>
        <CardDescription>
          Sign in to access the Bright Minds community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input 
              id="identifier" 
              name="identifier" 
              type="text" 
              placeholder="Enter your username or email" 
              value={formData.identifier}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground">
          Don't have an account?
          <Button 
            variant="link" 
            className="text-crimson p-0 h-auto ml-1"
            onClick={onSwitchToRegister}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};
