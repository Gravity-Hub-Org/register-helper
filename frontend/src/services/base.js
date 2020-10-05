import axios from "axios";

export const baseURL = process.env.ENDPOINT || "http://localhost:8091";

export async function fetchKeyGeneratorState() {
  const response = await axios.get("/state", {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}

export async function requestGeneratedKeys() {
  const response = await axios.get("/generate-keys", {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}

export async function requestKeyGeneration(pass) {
  const response = await axios.post(
    "/handle-pass",
    {
      password: pass,
    },
    {
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const contentType = response.headers["Content-Type"];
  const filename = response.headers["Filename"];

  return { contentType, filename, data: response.data };
}