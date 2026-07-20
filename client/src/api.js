const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const apiFetch = async (path, options = {}) => {
  const requestOptions = {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  };

  if (
    requestOptions.body &&
    typeof requestOptions.body !== "string" &&
    !(requestOptions.body instanceof FormData)
  ) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  const response = await fetch(`${API_BASE}${path}`, requestOptions);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed.");
    error.status = response.status;
    error.details = data.errors || [];
    throw error;
  }

  return data;
};

export { API_BASE };
