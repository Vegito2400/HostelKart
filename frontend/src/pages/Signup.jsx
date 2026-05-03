import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Layout } from "../components/Layout";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", hostel: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created. Welcome to hostelKart!");
      navigate("/", { replace: true });
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
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Join the campus marketplace — buy, sell, and meet up on-campus.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                data-testid="signup-name-input"
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Riya Sharma"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-email">Campus email</Label>
              <Input
                id="signup-email"
                data-testid="signup-email-input"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@thapar.edu"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-hostel">Hostel / Block (optional)</Label>
              <Input
                id="signup-hostel"
                data-testid="signup-hostel-input"
                value={form.hostel}
                onChange={update("hostel")}
                placeholder="Hostel 7"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                data-testid="signup-password-input"
                type="password"
                required
                value={form.password}
                onChange={update("password")}
                placeholder="At least 6 characters"
                className="focus-visible:ring-orange-500"
              />
            </div>
            <Button
              data-testid="signup-submit-btn"
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" data-testid="signup-goto-login" className="text-orange-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
