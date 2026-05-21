import client from "./client";

export const getWeather = async (city) => {
  const res = await client.get(`/weather?city=${encodeURIComponent(city)}`);
  return res.data;
};

export const getCropRecommendation = async (user) => {
  const res = await client.post("/ai/crop", {
    soil_type: user.soil_type,
    location: user.location,
    land_size: user.land_size  
  });

  return res.data;
};
export const detectDisease = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const res = await client.post(
    "/disease/detect",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getFertilizerRecommendation = async (cropName, user) => {
  const res = await client.post("/fertilizer/recommend", {
    crop: cropName,
    soil_type: user?.soil_type,
    location: user?.location,
  });
  return res.data;
};

export const chatWithAI = async (message) => {
  const res = await client.post("/chat/chat", { message });
  return res.data;
};
export const addCropCycle = async (data) => {
  const res = await client.post("/crop/add", data);

  return res.data;
};