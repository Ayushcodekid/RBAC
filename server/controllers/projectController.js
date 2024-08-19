// const Project = require("../models/project");
// const jwt = require('jsonwebtoken');
// require("dotenv").config();


// const secretKey = process.env.JWT_SECRET

// async function createProject(req, res){

//     let{name} = req.body;
//     const token = req.headers.authorization.split('')[1];

//     try{
//         const decoded= jwt.verify(token, secretKey);
//         const project = new Project({
//             name,
//             userId: decoded.userId
//         });

//         const result = await project.save();
//         res.status(201).send({message:"Project Created Successfully", project: result})
//     }

//     catch(err){
//         console.log(err);
//         res.status(400).send(err)

//     }
// }




// async function getProjects(req, res){
//     const token = req.headers.authorization.split('')[1];

//     try{
//         const decoded = jwt.verify(token, secretKey);
//         const projects = await Project.find({userId: decoded.userId});
//         res.status(200).send(projects);

//     } catch (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
// }


// const ProjectController={
//     createProject,
//     getProjects
// };



// module.exports= ProjectController




















const mongoose = require('mongoose');

const Project = require("../models/project");
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require("../models/user");


const secretKey = process.env.JWT_SECRET;



async function createProject(req, res) {
    try {
        const { name, description } = req.body;
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

        if (!name || !userId) {
            return res.status(400).send({ message: "Name and userId are required" });
        }

        // Create a new project
        const newProject = new Project({ name, description, userId });
        // Save the project to the database
        await newProject.save();

        // Retrieve the unique ID from the saved project
        const projectId = newProject._id;

        // Send response with the project details including the unique ID
        res.status(201).send({ ...newProject.toObject(), projectId });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send({ message: 'Error creating project' });
    }
}


async function getProjects(req, res) {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        const username = decoded.username; // Assuming the JWT contains the username

        console.log('Fetching projects for user:', userId, 'and username:', username);

        // Fetch projects where the user is either the owner or listed in the users array
        const projects = await Project.find({
            $or: [
                { userId }, // Projects added by the user
                { 'users.username': username } // Projects where the user is added
            ]
        });

        if (!projects.length) {
            return res.status(404).send({ message: 'No projects found' });
        }

        res.status(200).send(projects);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Session expired. Please login again' });
        }
        console.error('Error fetching projects:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}



// async function getProjects(req, res) {
//     try {
//         const authorizationHeader = req.headers.authorization;

//         if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//             return res.status(401).send({ message: "Unauthorized" });
//         }

//         const token = authorizationHeader.split(' ')[1];
//         const decoded = jwt.verify(token, secretKey);
//         const userId = decoded.userId;
//         const username = decoded.username; // Assuming the JWT contains the username

//         console.log('Fetching projects for user:', userId, 'and username:', username);

//         // Fetch projects where the user is either the owner or listed in the users array
//         const projects = await Project.find({
//             $or: [
//                 { userId },
//                 { 'users.username': username }
//             ]
//         });

//         if (!projects.length) {
//             return res.status(404).send({ message: 'No projects found' });
//         }

//         res.status(200).send(projects);


//     } catch (err) {
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).send({ message: 'Session expired. Please login again' });
//         }
//         console.error('Error fetching projects:', err);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// }



const uploadFiles = async (req, res) => {
    try {
        const { projectId } = req.body;
        const files = req.files;


        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        const uploaderId = decoded.userId;
        // const uploaderUsername = decoded.username;

        if (!projectId || projectId === 'undefined') {
            return res.status(400).send({ message: "Project ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).send({ message: "Invalid Project ID" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        const fileEntries = files.map(file => {
            const destinationPath = path.join('uploads', file.originalname);
            fs.renameSync(path.join('uploads', file.filename), destinationPath);  // Rename file


            return {
                path: destinationPath, // Store the path as a string
                uploaderId,
            };
        });

        console.log('File Entries before saving:', fileEntries);


        project.files.push(...fileEntries);
        await project.save();

        res.status(200).send({ message: "Files uploaded successfully", project });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).send({ message: "Error uploading files" });
    }
};







async function getProjectFiles(req, res) {
    try {
        const projectId = req.params.projectId;
        const authorizationHeader = req.headers.authorization;

        // Check for authorization header
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        // Extract and verify the token
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        const username = decoded.username;

        // Validate projectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).send({ message: "Invalid Project ID" });
        }

        // Fetch project details
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).send({ message: "Project not found" });
        }

        // Check if the user is the project owner
        const isOwner = project.userId.toString() === userId.toString();
        // Find the user in the project's users list
        const userInProject = project.users.find(user => user.username === username);
        const role = userInProject ? userInProject.role : null;

        if (!userInProject && !isOwner) {
            return res.status(403).send({ message: "You don't have access to this project" });
        }

        let accessibleFiles = [];


        // Determine accessible files based on role
        if (isOwner) {
            accessibleFiles = project.files;
        }


        // Role is architect, filtering files uploaded by user
        else if (role === 'architect') {
            accessibleFiles = project.files.filter(file => file.uploaderId && file.uploaderId.toString() === userId.toString());
        }


        // Role is plumber, no files accessible
        else if (role === 'plumber') {
            accessibleFiles = [];

        }

        // Role is constructor, filtering files not uploaded by project owner
        else if (role === 'constructor') {
            accessibleFiles = project.files.filter(file => file.uploaderId && file.uploaderId.toString() !== project.userId.toString());
        }

        else {
            return res.status(403).send({ message: "Role not recognized" });
        }

        console.log('Accessible Files:', accessibleFiles);
        res.status(200).send({ files: accessibleFiles });
    } catch (err) {
        console.error('Error fetching project files:', err);
        res.status(500).send({ message: 'Error fetching project files' });
    }
}







// async function uploadFiles(req, res) {
//     try {
//         const { projectId } = req.body;
//         const files = req.files;
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, secretKey);
//         const userId = decoded.userId;

//         if (!projectId || projectId === 'undefined') {
//             return res.status(400).send({ message: "Project ID is required" });
//         }

//         if (!mongoose.Types.ObjectId.isValid(projectId)) {
//             return res.status(400).send({ message: "Invalid Project ID" });
//         }

//         // Check if user has permission to upload files
//         const hasPermission = await checkPermission(userId, projectId, 'editor');
//         if (!hasPermission) {
//             return res.status(403).send({ message: "Forbidden: Insufficient permissions" });
//         }

//         const project = await Project.findById(projectId);
//         if (!project) {
//             return res.status(404).send({ message: "Project not found" });
//         }

//         const filePaths = [];
//         files.forEach(file => {
//             const sourcePath = path.join('uploads', file.filename);
//             const destinationPath = path.join('uploads', file.filename);
//             fs.renameSync(sourcePath, destinationPath);
//             filePaths.push(destinationPath);
//         });

//         project.files.push(...filePaths);
//         await project.save();
//         res.status(200).send({ message: "Files uploaded successfully", project });
//     } catch (err) {
//         console.error('Error uploading files:', err);
//         res.status(500).send({ message: "Error uploading files" });
//     }
// }










const addUserToProject = async (req, res) => {
    const { username, role } = req.body;
    try {
        if (!username || !role) {
            return res.status(400).send({ message: 'Username and role are required' });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the project exists
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            console.log('Project not found:', req.params.projectId);

            return res.status(404).send({ message: 'Project not found' });
        }

        // Validate the role
        if (!['architect', 'constructor', 'plumber'].includes(role)) {
            return res.status(400).send({ message: 'Invalid role' });
        }

        // Add the user to the project's user list
        project.users.push({ userId: user._id, username, role });
        await project.save();
        console.log('User added to project:', { projectId: req.params.projectId, username, role });

        res.status(200).send(project);
    } catch (err) {
        console.error('Error adding user to project:', err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};







const ProjectController = {
    createProject,
    getProjects,
    uploadFiles,
    addUserToProject,
    getProjectFiles
};

module.exports = ProjectController;
