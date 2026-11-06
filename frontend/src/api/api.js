const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
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
  return data;
};

export const getJobs = async () => {
  const res = await fetch(`${API_URL}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
};

export const getMyJobs = async () => {
  const res = await fetch(`${API_URL}/jobs/my-jobs`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch your jobs');
  return res.json();
};

export const createJob = async (jobData) => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${API_URL}/applications/${jobId}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to apply');
  return data;
};

export const getJobApplications = async (jobId) => {
  const res = await fetch(`${API_URL}/applications/${jobId}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
  return data;
};

export const updateApplicationStatus = async (id, status, feedback = null) => {
  const res = await fetch(`${API_URL}/applications/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status, feedback }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update status');
  return data;
};

export const getMyApplications = async () => {
  const res = await fetch(`${API_URL}/applications/my-applications`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
  return data;
};
