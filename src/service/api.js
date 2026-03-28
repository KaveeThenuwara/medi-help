export const apiClientWithOuttoken = async (endpoint, method = "GET", body) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: (method !== "GET" && method !== "DELETE" && body) ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  try {
    return text ? JSON.parse(text) : { code: response.status, message: response.statusText };
  } catch (e) {
    return { code: response.status, message: text || response.statusText };
  }
}


export const apiClient = async (endpoint, method = "GET", body) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";
  const url = `${baseUrl}${endpoint}`;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: (method !== "GET" && method !== "DELETE" && body) ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  try {
    return text ? JSON.parse(text) : { code: response.status, message: response.statusText };
  } catch (e) {
    return { code: response.status, message: text || response.statusText };
  }
}
