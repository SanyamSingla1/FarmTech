import React, { useState } from "react";

import { addCropCycle } from "../api/api";

import "./CropCycle.css";

export default function CropCycle() {

  const [formData, setFormData] = useState({
    crop_name: "",
    sowing_date: "",
    harvest_date: "",
    //location: "",
    //soil_type: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await addCropCycle(formData);

      setMessage(res.message);

    } catch (error) {

      setMessage("Failed to add crop cycle");
    }
  };

  return (
    <div className="crop-cycle-container">

      <h2>🌾 Add Crop Cycle</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="crop_name"
          placeholder="Crop Name"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="sowing_date"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="harvest_date"
          onChange={handleChange}
          required
        />

        {/* <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="soil_type"
          placeholder="Soil Type"
          onChange={handleChange}
          required
        /> */}

        <button type="submit">
          Start Monitoring
        </button>

      </form>

      {message && <p>{message}</p>}

    </div>
  );
}