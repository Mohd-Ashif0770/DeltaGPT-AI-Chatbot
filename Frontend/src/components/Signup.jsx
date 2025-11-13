import React, { useEffect, useState } from "react";
import serverUrl from "../environment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`${serverUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Registration successful! Please login.");
        setForm({ name: "", email: "", password: "" });
        // Redirect to login after registration
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.msg || data.message || "Registration failed");
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
          <div className="authBadge">Sign up</div>
          <h1>Create your DeltaGPT account</h1>
          <p>Save conversations, pick up where you left off, and explore more.</p>
        </div>

        {error && <div className="authBanner authBanner--error">{error}</div>}
        {success && <div className="authBanner authBanner--success">{success}</div>}

        <form onSubmit={handleSubmit} className="authForm">
          <label className="authField">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

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
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </label>

          <button type="submit" className="authSubmit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="authFooter">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
