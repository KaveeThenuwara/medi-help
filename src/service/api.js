export const apiClientWithOuttoken = async (endpoint, method = "GET", body) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const resposne = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body:JSON.stringify(body),
  });
  return resposne.json();
}


export const apiClient = async (endpoint, method = "GET", body) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";
  const url = `${baseUrl}${endpoint}`;
  const token = localStorage.getItem("token");


  const resposne = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body:JSON.stringify(body),
  });
  return resposne.json();
}
