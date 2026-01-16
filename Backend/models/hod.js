import mongoose from "mongoose";

const hodSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  branch: {type: String, default: ''},
  program: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  designation: {type: String, default: 'HOD'},
  resetPasswordToken: {type: String},
  resetPasswordExpire: {type: Date},
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("HOD", hodSchema);
