import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addProjectMember,
  getProjectMembers,
  getProjects,
  getUsers,
  removeProjectMember,
} from "../api";

export default function ProjectMembers() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [userId, setUserId] = useState("");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    Promise.all([getProjects(), getUsers(), getProjectMembers(projectId)])
      .then(([projects, users, memberships]) => {
        setProject(projects.find((project) => project._id === projectId));
        setUsers(users);
        setMemberships(memberships);
      })
      .catch((error) => setResponse({ message: error.message }));
  }, [projectId]);

  async function addMember(event) {
    event.preventDefault();
    setResponse(null);

    try {
      const data = await addProjectMember(projectId, userId);
      setMemberships([...memberships, data.membership]);
      setResponse({ message: data.message });
    } catch (error) {
      setResponse({ message: error.message });
    }
  }

  async function removeMember(userId) {
    setResponse(null);

    try {
      const data = await removeProjectMember(projectId, userId);
      setMemberships(memberships.filter((member) => member.user_id !== userId));
      setResponse({ message: data.message });
    } catch (error) {
      setResponse({ message: error.message });
    }
  }

  return (
    <div className="page center-children">
      <p className="title">
        {project ? `${project.name} Members` : "Project Members"}
      </p>

      <div className="card table-container">
        <table className="project-table text">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Membership</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((member) => {
              const user = users.find((user) => user._id === member.user_id);

              return (
                <tr key={member._id}>
                  <td>
                    {user ? `${user.f_name} ${user.l_name}` : "Unknown user"}
                  </td>
                  <td>{user?.username}</td>
                  <td>
                    {member.user_id === project?.project_lead_id ? (
                      "Project Lead"
                    ) : (
                      <button
                        className="primary"
                        onClick={() => removeMember(member.user_id)}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <form className="form" onSubmit={addMember}>
          <label className="field">
            Registered User
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
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

          <button className="primary" disabled={!project || users.length === 0}>
            Add Member
          </button>
        </form>
      </div>

      <Link className="link" to="/projects">
        View projects
      </Link>

      {response && <p className="text">{response.message}</p>}
    </div>
  );
}
