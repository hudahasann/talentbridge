const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const userId = localStorage.getItem('userId');
  return {
    'Content-Type': 'application/json',
    ...(userId ? { 'x-user-id': userId } : {})
  };
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
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
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  if (data._id) localStorage.setItem('userId', data._id);
  return data;
};

export const getJobs = async () => {
  const res = await fetch(`${API_URL}/jobs`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
};

export const getMyJobs = async () => {
  const res = await fetch(`${API_URL}/jobs/my-jobs`, {
    headers: getHeaders(), // <--- THIS IS THE CRUCIAL FIX
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch your jobs');
  return res.json();
};

export const createJob = async (jobData) => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(jobData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create job');
  return data;
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
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to apply');
  return data;
};

export const getJobApplications = async (jobId) => {
  const res = await fetch(`${API_URL}/applications/${jobId}`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
  return data;
};

export const updateApplicationStatus = async (id, status, feedback = null) => {
  const res = await fetch(`${API_URL}/applications/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status, feedback }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update status');
  return data;
};

export const getMyApplications = async () => {
  const res = await fetch(`${API_URL}/applications/my-applications`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
  return data;
};
