import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    rollNo :{type : String , required : true , unique : true  },
    name : {type: String, required: true},
    email : String ,
    dob : {type: String, required: true}, // Format: dd-mm-yyyy
    branch : {type: String, default: 'GENERAL'},
    program : {type: String, default: 'BTech'}, // BTech, MTech, MCA, MBA
    admittedYear : {type: Number, default: () => new Date().getFullYear()},
    currentYear : {type: Number, default: 1},
    semester: {type: Number, default: 1},
    regulation : {type: String, default: 'R22'},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

// Method to calculate current year based on admitted year
studentSchema.methods.calculateCurrentYear = async function() {
    const currentCalendarYear = new Date().getFullYear();
    const yearsSinceAdmission = currentCalendarYear - this.admittedYear;
    const maxYears = await this.getMaxYears();
    // If admitted in 2023 and current year is 2026: 2026 - 2023 = 3, student is in year 3
    return Math.max(1, Math.min(yearsSinceAdmission, maxYears));
};

// Method to get max years for the program
// This will be called asynchronously when needed
studentSchema.methods.getMaxYears = async function() {
    // Try to get duration from Program collection
    try {
        const Program = mongoose.model('Program');
        const program = await Program.findOne({ 
            $or: [
                { name: this.program },
                { name: { $regex: new RegExp(`^${this.program}$`, 'i') } },
                { code: this.program }
            ]
        });
        
        if (program && program.duration) {
            return program.duration;
        }
    } catch (error) {
        console.log('Could not fetch program duration, using fallback');
    }
    
    // Fallback to hardcoded values if program not found in database
    const programYears = {
        'BTECH': 4,
        'BTech': 4,
        'B.Tech': 4,
        'MTECH': 2,
        'MTech': 2,
        'M.Tech': 2,
        'MBA': 2,
        'MCA': 2
    };
    return programYears[this.program] || 4;
};

// Method to get active semesters (current year's 2 semesters)
studentSchema.methods.getActiveSemesters = async function() {
    const currentYear = await this.calculateCurrentYear();
    return [
        (currentYear * 2) - 1,  // Odd semester (e.g., Year 3 -> Sem 5)
        currentYear * 2          // Even semester (e.g., Year 3 -> Sem 6)
    ];
};

// Method to get completed semesters
studentSchema.methods.getCompletedSemesters = async function() {
    const currentYear = await this.calculateCurrentYear();
    const completed = [];
    for (let i = 1; i < (currentYear * 2) - 1; i++) {
        completed.push(i);
    }
    return completed;
};

// Pre-save hook to auto-calculate currentYear
studentSchema.pre('save', async function(next) {
    if (this.admittedYear) {
        this.currentYear = await this.calculateCurrentYear();
        // Set semester to the first semester of current year
        this.semester = (this.currentYear * 2) - 1;
    }
    next();
});

export default mongoose.model("Student",studentSchema);