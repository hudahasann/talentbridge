const API_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const userId = localStorage.getItem('userId');
  return {
    'Content-Type': 'application/json',
    ...(userId ? { 'x-user-id': userId } : {})
  };
};

// Helper to catch backend crashes
const handleResponse = async (res) => {
  if (!res.ok) {
    // If Vercel crashes, it sends HTML instead of JSON
    const text = await res.text();
    let errorMessage = 'An unexpected error occurred.';
    try {
      const data = JSON.parse(text);
      if (data.message) errorMessage = data.message;
    } catch (e) {
      errorMessage = `Server error (${res.status}). Please try again later.`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  if (data._id) localStorage.setItem('userId', data._id);
  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(res);
  if (data._id) localStorage.setItem('userId', data._id);
  return data;
};

export const getJobs = async () => {
  const res = await fetch(`${API_URL}/jobs`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getMyJobs = async () => {
  const res = await fetch(`${API_URL}/jobs/my-jobs`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  return handleResponse(res);
};

export const createJob = async (jobData) => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(jobData),
  });
  return handleResponse(res);
};

export const applyToJob = async (jobId, file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const userId = localStorage.getItem('userId');
  const headers = userId ? { 'x-user-id': userId } : {};

  const res = await fetch(`${API_URL}/applications/${jobId}`, {
    method: 'POST',
    headers: headers,
    credentials: 'include',
    body: formData,
  });
  return handleResponse(res);
};

export const getJobApplications = async (jobId) => {
  const res = await fetch(`${API_URL}/applications/${jobId}`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  return handleResponse(res);
};

export const updateApplicationStatus = async (id, status, feedback = null) => {
  const res = await fetch(`${API_URL}/applications/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status, feedback }),
  });
  return handleResponse(res);
};

export const getMyApplications = async () => {
  const res = await fetch(`${API_URL}/applications/my-applications`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  return handleResponse(res);
};

// --- MISSING FUNCTION ADDED HERE ---
export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(profileData),
  });
  return handleResponse(res);
};