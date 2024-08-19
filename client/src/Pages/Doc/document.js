// import React, { useState, useEffect } from 'react';
// import './document.css';
// import api from '../../api';

// const Document = () => {
//     const [files, setFiles] = useState([]);
//     const [projectId, setProjectId] = useState(''); // This should be set when a project is selected
//     const [selectedProject, setSelectedProject] = useState(null);


//     useEffect(() => {
//         const storedProject = localStorage.getItem('selectedProject')
//         if (storedProject) {
//             setSelectedProject(JSON.parse(storedProject))
//         }
//         else {
//             alert("No project selected")
//         }
//     }, []);

//     const handleFileChange = (event) => {
//         const selectedFiles = Array.from(event.target.files);
//         setFiles(selectedFiles);
//     };

//     const handleFileUpload = async (event) => {
//         event.preventDefault();
//         if (!selectedProject) {
//             alert('No project selected');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('projectId', selectedProject._id);
//         files.forEach(file => {
//             formData.append('files', file);
//         });

//         try {
//             const token = localStorage.getItem('token');
//             const response = await api.post('/projects/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             console.log('Files uploaded successfully:', response.data);
//             alert('Files uploaded successfully!');
//             setFiles([]); // Clear the file input after successful upload
//         } catch (error) {
//             console.error('Error uploading files:', error);
//             alert('Error uploading files. Please try again.');
//         }
//     };


//     return (
//         <div className="folder-box-container">
//             <h2>Upload Files</h2>
//             {selectedProject ? (
//                 <div className="folder-box">
//                     <input
//                         type="file"
//                         multiple
//                         onChange={handleFileChange}
//                         className="file-input"
//                     />
//                     <button onClick={handleFileUpload} className="upload-button">
//                         Upload Files
//                     </button>
//                     {files.length > 0 && (
//                         <div className="file-box">
//                             <h3>Uploaded Files:</h3>
//                             <ul>
//                                 {files.map((file, index) => (
//                                     <li key={index}>{file.name}</li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <p>No project selected</p>
//             )}
//         </div>
//     );
// };

// export default Document;


























import React, { useState, useEffect } from 'react';
import './document.css';
import api from '../../api';

const Document = () => {
  const [files, setFiles] = useState([]); // Files selected for upload
  const [uploadedFiles, setUploadedFiles] = useState([]); // Files fetched from the backend
  const [selectedProject, setSelectedProject] = useState(null);
  

  useEffect(() => {
    const storedProjectId = localStorage.getItem('selectedProject');
    if (storedProjectId) {
      setSelectedProject(storedProjectId);
      fetchProjectFiles(storedProjectId);
    } else {
      alert("No project selected");
    }
  }, []);

  
  const fetchProjectFiles = async (projectId) => {
    try {
        const token = localStorage.getItem('token');
        console.log("Fetching files for projectId:", projectId);
        const response = await api.get(`/projects/${projectId}/files`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("Response received:", response.data);
        // Adjust this line based on your actual response structure
        setUploadedFiles(response.data.files.map(file => file.path)); // Ensure file.path is used if files are objects
    } catch (error) {
        console.error('Error fetching project files:', error);
        alert("Error fetching project files");
    }
};


  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!selectedProject) {
      alert('No project selected');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('projectId', selectedProject);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Files uploaded successfully:', response.data);
      fetchProjectFiles(selectedProject);
      alert("Files uploaded successfully");
    } catch (error) {
      console.error('Error uploading files:', error);
      alert("Error uploading files");
    }
  };

  return (
    <div className="folder-box-container">
      <h2>Upload Files</h2>
      <div className="folder-box">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="file-input"
        />
        <button onClick={handleFileUpload} className="upload-button">
          Upload Files
        </button>
        {uploadedFiles && uploadedFiles.length > 0 && (
          <div className="file-box">
            <h3>Uploaded Files:</h3>
            <ul className='files-list'>
              {uploadedFiles.map((fileName, index) => (
                <li className='file-li' key={index}>{fileName}</li>
              ))}
            </ul>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default Document;
