// const express = require('express');
// const multer = require('multer');


// const upload = multer ({dest:'uploads/'})

// const ProjectController = require('../controllers/projectController');
// const router = express.Router();

// router.post('/projects', ProjectController.createProject);
// router.get('/projects', ProjectController.getProjects);

// router.post('/upload', upload.array('files'), ProjectController.uploadFiles);

// module.exports = router;









const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const ProjectController = require('../controllers/projectController');
const router = express.Router();

// Route for creating a new project
router.post('/projects', ProjectController.createProject);

// Route for getting all projects for the authenticated user
router.get('/projects', ProjectController.getProjects);

// Route for uploading files to a project
router.post('/upload', upload.array('files'), ProjectController.uploadFiles);

// Route for adding a user to a project
router.post('/projects/:projectId/users', ProjectController.addUserToProject);


router.get('/projects/:projectId/files', ProjectController.getProjectFiles);


// Optionally, add routes for updating user roles or other RBAC-related functionality
// router.put('/projects/:projectId/users/:username', ProjectController.updateUserRole);

module.exports = router;
