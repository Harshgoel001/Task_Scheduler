
const API_BASE_URL = "http://127.0.0.1:8000";

export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`Backend returned status ${response.status}`);
  }

  return await response.json();
}
