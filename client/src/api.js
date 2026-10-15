export async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("Request failed.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `${response.status} Unable to complete request.`,
    );
  }

  return data;
}

export async function login(username, password) {
  return await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function signup(firstName, lastName, username, password) {
  return await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, username, password }),
  });
}

export async function getUsers() {
  return await request("/api/auth/users");
}

export async function createProject(name, description, status, projectLeadId) {
  return await request("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name, description, status, projectLeadId }),
  });
}

export async function getProjects() {
  return await request("/api/projects");
}

export async function getProjectMembers(projectId) {
  return await request(`/api/projects/${projectId}/members`);
}

export async function addProjectMember(projectId, userId) {
  return await request(`/api/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function removeProjectMember(projectId, userId) {
  return await request(`/api/projects/${projectId}/members/${userId}`, {
    method: "DELETE",
  });
}
