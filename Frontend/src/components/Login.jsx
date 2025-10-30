import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import serverUrl from "../environment";
import { toast } from "react-toastify";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="container py-5 d-flex justify-content-center bg-dark min-vh-100 align-items-center min-vw-100">
      <div className="col-md-5 p-4 shadow rounded bg-light">
        <h3 className="text-center mb-4 text-primary">Login to Your Account</h3>

        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && toast.error(error)}
        {success && toast.success("Login successful!")}
      </div>
    </div>
  );
};

export default Login;
