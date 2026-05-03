import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Layout } from "../components/Layout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Log in to browse listings and send offers to campus sellers.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                data-testid="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@thapar.edu"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                data-testid="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <Button
              data-testid="login-submit-btn"
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            New to hostelKart?{" "}
            <Link to="/signup" data-testid="login-goto-signup" className="text-orange-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
            Use an account created through the backend.
          </div>
        </div>
      </div>
    </Layout>
  );
}
