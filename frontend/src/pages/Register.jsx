import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    farmSize: "",
    location: "",
    soil: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);

    if (res.success) {
      alert("Registered successfully");
      navigate("/login");
    } else {
      alert(res.message || "Error");
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Farm Size (in hectares)"
          value={form.farmSize}
          onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <select
          value={form.soil}
          onChange={(e) => setForm({ ...form, soil: e.target.value })}
          required
        >
          <option value="">Select Soil Type</option>
          <option>Loamy</option>
          <option>Sandy</option>
          <option>Clay</option>
        </select>

        <button type="submit">Register</button>
        <p>
          Already have an account? {" "}
          <span
            className="link"
            onClick={() => navigate("/login")}
          >
           Click here
          </span>
        </p>
      </form>
    </div>
  );
}