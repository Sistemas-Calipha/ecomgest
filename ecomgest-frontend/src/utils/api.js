const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";


async function apiRequest(method, url, data) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(API_BASE_URL + url, options);

  let responseBody = null;

  try {
    responseBody = await res.json();
  } catch (err) {
    responseBody = null;
  }

  if (!res.ok) {
    const msg =
      responseBody?.mensaje ||
      responseBody?.error ||
      `Error ${res.status}`;

    throw new Error(msg);
  }

  return responseBody;
}

export default {
  get: (url) => apiRequest("GET", url),
  post: (url, data) => apiRequest("POST", url, data),
  put: (url, data) => apiRequest("PUT", url, data),
  delete: (url) => apiRequest("DELETE", url),
};
