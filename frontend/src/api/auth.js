import client from "./client";

export const registerUser = async (form) => {
  const payload = {
    username: form.username,
    email: form.email,
    password: form.password,
    land_size: form.farmSize,
    soil_type: form.soil,
    location: form.location,
  };

  const res = await client.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async (form) => {
  try {
    const res = await client.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    return res.data;
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Login failed. Please try again.",
    };
  }
};

export const getProfile = async () => {
  const res = await client.get("/user/profile");
  return res.data;
};

export const updateProfile = async (form) => {
  const payload = {
    username: form.username,
    email: form.email,
    land_size: form.land_size,
    soil_type: form.soil_type,
    location: form.location,
  };
  const res = await client.put("/user/profile", payload);
  return res.data;
};
