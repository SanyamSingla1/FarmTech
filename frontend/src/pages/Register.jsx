import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
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

        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <input placeholder="Farm Size" onChange={(e)=>setForm({...form,farmSize:e.target.value})}/>
        <input placeholder="Location" onChange={(e)=>setForm({...form,location:e.target.value})}/>

        <select onChange={(e)=>setForm({...form,soil:e.target.value})}>
          <option value="">Select Soil Type</option>
          <option>Loamy</option>
          <option>Sandy</option>
          <option>Clay</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}