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
