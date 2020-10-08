import axios from "axios";

export const baseURL = `http://${window.location.hostname}:8111` // process.env.ENDPOINT || "http://localhost:8091";

export async function fetchKeyGeneratorState() {
  const response = await axios.get("/state", {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}

export async function requestGeneratedKeys(password) {
  const response = await axios.post("/generate-keys", {
    password: password
  }, {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}

export async function requestNodeDeployment() {
  const response = await axios.get("/run", {
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}


export async function downloadGeneratedKeys(password) {
  console.log({ password })
  const response = await axios.get("/download", {
    baseURL: baseURL,
    params: { password },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data; // Root
}

// export async function requestKeyGeneration(pass) {
//   const response = await axios.post(
//     "/handle-pass",
//     {
//       password: pass,
//     },
//     {
//       baseURL: baseURL,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const contentType = response.headers["Content-Type"];
//   const filename = response.headers["Filename"];

//   return { contentType, filename, data: response.data };
// }
