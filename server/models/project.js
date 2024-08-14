
// const mongoose = require('mongoose');

// const projectSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: false,
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },

//     files: [String],
// });

// module.exports = mongoose.model('Project', projectSchema);








const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    files: [{ type: String }],
    users: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ensure this field is populated correctly
        username: { type: String, required: true },
        role: { type: String, enum: ['architect', 'constructor', 'plumber'], required: true }
    }]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

