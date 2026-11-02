import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestPasswordReset, resetPassword, verifyEmail } from "@/lib/api";

const AuthEmailFlow = ({ mode }: { mode: "forgot" | "reset" | "verify" }) => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== "verify") return;
    const key = searchParams.get("key");
    if (!key) {
      setError("This verification link is invalid or expired.");
      return;
    }
    verifyEmail(key).then((response) => setMessage(response.data.detail)).catch(() => setError("This verification link is invalid or expired."));
  }, [mode, searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "forgot") {
        const response = await requestPasswordReset(email);
        setMessage(response.data.detail);
      } else if (mode === "reset") {
        const uid = searchParams.get("uid") || "";
        const token = searchParams.get("token") || "";
        const response = await resetPassword(uid, token, password, confirmation);
        setMessage(response.data.detail);
      }
    } catch (requestError: any) {
      const data = requestError.response?.data;
      const firstError = data && Object.values(data).flatMap((value: any) => Array.isArray(value) ? value : [value])[0];
      setError(typeof firstError === "string" ? firstError : "We couldn't complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const title = mode === "forgot" ? "Forgot password" : mode === "reset" ? "Choose a new password" : "Verify your email";
  const description = mode === "forgot" ? "Enter your account email and we'll send password recovery instructions." : mode === "reset" ? "Set a new password for your account." : "Confirming your email address.";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-playfair">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {mode !== "verify" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "forgot" ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input id="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
                  </div>
                </>
              )}
              <Button className="w-full" type="submit" disabled={busy}>{busy ? "Please wait..." : mode === "forgot" ? "Send recovery email" : "Update password"}</Button>
            </form>
          )}
          {message && <p className="mt-4 text-sm text-green-700" role="status">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          <p className="mt-6 text-sm text-center"><Link className="underline" to="/community">Return to the community</Link></p>
        </CardContent>
      </Card>
    </main>
  );
};

export default AuthEmailFlow;
