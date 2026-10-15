import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProject, getUsers } from "../api";

export default function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [projectLeadId, setProjectLeadId] = useState("");
  const [users, setUsers] = useState([]);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    getUsers()
      .then((users) => {
        setUsers(users);
        if (users.length === 0) {
          setResponse({
            message:
              "You must first create an account before creating a project.",
          });
        }
      })
      .catch((error) => setResponse({ message: error.message }));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setResponse(null);

    try {
      const data = await createProject(
        name,
        description,
        status,
        projectLeadId,
      );
      setResponse({ message: data.message });
      setName("");
      setDescription("");
    } catch (error) {
      setResponse({ message: error.message });
    }
  }

  return (
    <div className="page center-children">
      <p className="title"> Please Create a Project </p>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="field">
            Description
            <textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </label>

          <label className="field">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              required
            >
              <option>Planning</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </label>

          <label className="field">
            Project Lead
            <select
              value={projectLeadId}
              onChange={(event) => setProjectLeadId(event.target.value)}
              required
            >
              <option value="">Select a registered user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.f_name} {user.l_name} ({user.username})
                </option>
              ))}
            </select>
          </label>

          <button className="primary" disabled={users.length === 0}>
            Create Project
          </button>
        </form>
      </div>

      <Link className="link" to="/projects">
        View projects
      </Link>

      <Link className="link" to="/login">
        Log in
      </Link>

      <Link className="link" to="/signup">
        Create an account
      </Link>

      {response && <p className="text">{response.message}</p>}
    </div>
  );
}
