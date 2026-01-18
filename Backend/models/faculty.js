import mongoose from "mongoose"

const facultySchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    department: String,
    branch: String,
    designation: String,
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Faculty",facultySchema);