import React, { useState } from "react";
import serverUrl from "../environment";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
    <div className="container py-5 d-flex justify-content-center bg-dark min-vh-100 align-items-center min-vw-100">
      <div className="col-md-5 p-4 shadow-lg rounded bg-light ">
        <h3 className="text-center mb-4 text-primary">Create Your Account</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column justify-content-center align-items-center">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-control mb-3 "
            value={form.name}
            onChange={handleChange}
            required
          />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="text-danger mt-3">{error}</p>}
        {success && <p className="text-success mt-3">{success}</p>}
      </div>
    </div>
  );
};

export default Signup;
