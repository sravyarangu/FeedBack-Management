import mongoose from "mongoose"

const programSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true}, // BTech, MTech, MCA, MBA
    duration : {type: Number, required: true}, // in years

    isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Program",programSchema);