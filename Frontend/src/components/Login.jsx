import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "../environment";
import { toast } from "react-toastify";
import "./Auth.css";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
  }, [success]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setSuccess("✅ Login successful!");
        setForm({ email: "", password: "" });

        if (onLogin) onLogin();

        // Redirect to home/dashboard after login
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(data.msg || data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authLayout">
      <div className="authCard">
        <div className="authCard__header">
          <div className="authBadge">Welcome back</div>
          <h1>Sign in to DeltaGPT</h1>
          <p>Access your saved chats and continue the conversation anywhere.</p>
        </div>

        {error && <div className="authBanner authBanner--error">{error}</div>}
        {success && <div className="authBanner authBanner--success">{success}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label className="authField">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="authField">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="authSubmit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="authFooter">
          New to DeltaGPT? <a href="/signup">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
