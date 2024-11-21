// import './Home.css';
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import api from '../../api';
// import { IoIosDocument } from 'react-icons/io'

// const Project = () => {
//   const [projects, setProjects] = useState([]);
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [showAddProject, setShowAddProject] = useState(false);
//   const [selectedProjectId, setSelectedProjectId] = useState(null);
//   const navigate = useNavigate();


//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleAddClick = () => {
//     setShowAddProject(true);
//   };

//   const fetchProjects = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const response = await api.get('/projects', { headers: { Authorization: `Bearer ${token}` } });
//         console.log('Fetched projects:', response); // Debug log
//         setProjects(response.data);
//       } catch (err) {
//         console.error('Error fetching projects:', err);
//         alert('Error fetching projects. Please try again later.');
//       }
//     } else {
//       alert('You must be logged in to view projects.');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };





//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (token) {
//         try {
//             const decodedToken = decodeToken(token);
//             const userId = decodedToken.userId;

//             const response = await api.post('/projects', { ...formData, userId }, { headers: { Authorization: `Bearer ${token}` } });
//             alert('Project added successfully!');
//             setFormData({ name: '', description: '' });
//             fetchProjects();

//             // Store the new project ID in localStorage
//             // const newProject = response.data;
//             // localStorage.setItem('selectedProject', JSON.stringify(newProject));
//         } catch (err) {
//             console.error('Error adding project:', err);
//             alert('Error adding project. Please check your input and try again.');
//         }
//     } else {
//         alert('You must be logged in to add a project.');
//     }
// };



//   // Function to decode the JWT token and extract userId
//   const decodeToken = (token) => {
//     // Ensure you handle token parsing securely
//     const payload = token.split('.')[1];
//     const decodedPayload = atob(payload);
//     return JSON.parse(decodedPayload);
//   };



//   const handleSelectProject = (projectId) => {
//     setSelectedProjectId(projectId);
//     localStorage.setItem('selectedProject', projectId); // Store as string
// };






//   return (

//     <div className='main'>

//       <Link to="/projects/document"><IoIosDocument className='doc-icon' /></Link>

//       <div className="projects-container">
//         <div className="projects-header">
//           <h1>Projects</h1>
//           <button className="add-project-button" onClick={handleAddClick}>
//             Add Project
//           </button>
//         </div>
//         {showAddProject && (
//           <div className="projects-form-container">
//             <form onSubmit={handleSubmit} className="project-form">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Project Name"
//                 onChange={handleChange}
//                 value={formData.name}
//                 required
//               />
//               <textarea
//                 name="description"
//                 placeholder="Project Description"
//                 onChange={handleChange}
//                 value={formData.description}
//               />
//               <div className="form-buttons">
//                 <button type="submit">Create</button>
//                 <button type="button" onClick={() => setShowAddProject(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         )}
//         <div className="project-list-container">
//           <h2>Project List</h2>
//           <ul>
//             {projects.length > 0 ? (
//               projects.map((project) => (
//                 <li key={project._id}
//                   className={`project-item ${selectedProjectId === project._id ? 'selected' : ''}`}
//                   onClick={() => handleSelectProject(project._id)}>
//                   <h3>{project.name}, {project._id}</h3>
//                   <p>{project.description}</p>

//                 </li>
//               ))
//             ) : (
//               <p>No projects found</p>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default Project;




















import './Home.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { IoIosDocument } from 'react-icons/io';
import Chat from "../Chat/Chat";


const Project = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [userData, setUserData] = useState({ username: '', role: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();

  }, []);








  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/projects', { headers: { Authorization: `Bearer ${token}` } });
        console.log('Projects fetched successfully:', response.data); // Add this log
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (err.response && err.response.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          // alert('Error fetching projects. Please try again later.');
        }
      }
    } else {
      alert('You must be logged in to view projects.');
    }
  };




  const handleAddClick = () => {
    setShowAddProject(true);
  };

  const handleUserAddClick = () => {
    setShowAddUser(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/projects', { ...formData }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Project added successfully!');
        fetchProjects();
        setFormData({ name: '', description: '' });
        setShowAddProject(false);
      } catch (err) {
        console.error('Error adding project:', err);
        alert('Error adding project. Please check your input and try again.');
      }
    } else {
      alert('You must be logged in to add a project.');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setShowAddUser(false)
    if (selectedProjectId) {
      try {
        const response = await api.post(`/projects/${selectedProjectId}/users`, {
          username: userData.username,
          role: userData.role
        });
        console.log('User added successfully:', response.data);
        // alert('User added successfully');
        fetchProjects(); // Refresh the project list to show the new user
      } catch (error) {
        console.error('Error adding user to project:', error.response?.data || error.message);
        alert('Error adding user. Please try again.');
      }
    } else {
      alert('Please select a project.');
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    console.log("selected project: ", projectId);
    localStorage.setItem('selectedProject', projectId)


  };

  


  return (
    <div className='main'>
      <Link to="/projects/document"><IoIosDocument className='doc-icon' /></Link>

      <div className="projects-container">
        <div className="projects-header">
          <h1>Projects</h1>
          <button className="add-project-button" onClick={handleAddClick}>
            Add Project
          </button>

            <button className="add-user-button" onClick={handleUserAddClick}>
              Add User to Project
            </button>
          



        </div>
        {showAddProject && (
          <div className="projects-form-container">
            <form onSubmit={handleSubmit} className="project-form">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                onChange={handleChange}
                value={formData.name}
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                onChange={handleChange}
                value={formData.description}
              />
              <div className="form-buttons">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowAddProject(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        {showAddUser && (
          <div className="add-user-form-container">
            <form onSubmit={handleUserSubmit} className="user-form">
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleUserChange}
                value={userData.username}
                required
              />
              <select
                name="role"
                onChange={handleUserChange}
                value={userData.role}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="architect">Architect</option>
                <option value="civil">Civil Engineer</option>
                <option value="structural">Structural Engineer</option>
              </select>
              <div className="form-buttons">
                <button type="submit">Add User</button>
                <button type="button" onClick={() => setShowAddUser(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <div className="project-list-container">
          <h2>Project List</h2>
          <ul>
            {projects.length > 0 ? (
              projects.map((project) => (
                <li key={project._id}
                  className={`project-item ${selectedProjectId === project._id ? 'selected' : ''}`}
                  onClick={() => handleSelectProject(project._id)}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p>Users: {project.users.map(user => `${user.username} (${user.role})`).join(', ')}</p>
                </li>
              ))
            ) : (
              <p>No projects found</p>
            )}
          </ul>
        </div>
      </div>
      <Chat/>
    </div>
  );
};

export default Project;
