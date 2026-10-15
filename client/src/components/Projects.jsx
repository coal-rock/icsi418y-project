import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, getUsers } from "../api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getUsers()])
      .then(([projects, users]) => {
        setProjects(projects);
        setUsers(users);
      })
      .catch((error) => setResponse({ message: error.message }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page center-children">
      <p className="title">Projects</p>

      <div className="card table-container">
        <table className="project-table text">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Project Lead</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const lead = users.find(
                (user) => user._id === project.project_lead_id,
              );

              return (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.status}</td>
                  <td>
                    {lead
                      ? `${lead.f_name} ${lead.l_name} (${lead.username})`
                      : "Unknown user"}
                  </td>
                  <td>
                    <Link
                      className="link"
                      to={`/projects/${project._id}/members`}
                    >
                      Manage members
                    </Link>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5}>
                  {loading ? "Loading projects" : "No projects found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Link className="link" to="/projects/new">
        Create a project
      </Link>

      <Link className="link" to="/login">
        Log in
      </Link>

      {response && <p className="text">{response.message}</p>}
    </div>
  );
}
