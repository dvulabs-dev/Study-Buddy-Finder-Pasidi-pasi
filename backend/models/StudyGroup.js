const mongoose = require('mongoose');
const { type } = require('node:os');

const studyGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name for the study group'],
            trim: true,
            minlength: [3, "Group name must be at least 3 Characters"],
            maxlength: [50, "Group name can not exceed 50 Characters"],
        },
       
        subject: {
            type: String,
            required: [true, 'Please provide a subject'],
            trim: true,
            minlength: [2, "Subject must be at least 2 Characters"],
        },
         description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [500, "Description can not exceed 500 Characters"],
        },
        image: {
            type: String,
            default: "",
            trim: true,
        },
         maxMembers: {
            type: Number,
            default: 10,
            min: [2, "Group must have at least 2 members"],
            max: [50, "Group can not have more than 50 members"],
        },
        //Changed from simple check boxes to detailed time slots
        meetingTimes: [{
            startTime: {
                type : String, // "10:00" format
                required: [true, "Please provide a meeting start time"],
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time in HH:mm format"],
            },
            endTime: {
                type: String,  //"12.00"
                required: [true, "Please provide a meeting end time"],
                match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time in HH:mm format"],

            },
            day : {
                type: String,
                enum:  {
                    values: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    message: "Please select a valid day of the week"
                },
                required: [true, "Please provide a meeting day"],
            }

        }],
          members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Group must have a creator'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }

);

// Validation: Check if group is full before adding member (method for external use)
studyGroupSchema.methods.isFull = function () {
    return this.members.length >= this.maxMembers;
};

//Method: check if user is a member
studyGroupSchema.methods.isMember = function (userId){
    return this.members.some(memberId => memberId.toString() === userId.toString());
};

//Method: Get meeting tie as a readable format
studyGroupSchema.methods.getMeetingTimes = function () {
    if (!this.meetingTimes || this.meetingTimes.length === 0) {
        return "No meeting times set";
    }
    return this.meetingTimes
          .map(mt => `${mt.day} ${mt.startTime}-${mt.endTime}`)
          .join(", ");
};

// Adding creator to members array when group is created AND validate
studyGroupSchema.pre("save", async function () {
    // Only for new groups
    if (this.isNew) {
        // Add creator to members if not already there (compare as strings for ObjectId)
        const creatorId = this.creator.toString();
        const memberIds = this.members.map(m => m.toString());
        
        if (!memberIds.includes(creatorId)) {
            this.members.push(this.creator);
        }
        
        // Validate meeting times (for both new and updated documents)
        if (!this.meetingTimes || this.meetingTimes.length === 0) {
            throw new Error("At least one meeting time must be provided");
        }
        
        //Validate each meeting time slot
        for(const slot of this.meetingTimes) {
            if (!slot.startTime || !slot.endTime || !slot.day) {
                throw new Error("Each meeting time slot must have a start time, end time, and day");
            }
            //Convert time to minutes for comparison
            const [startHour, startMin] = slot.startTime.split(":").map(Number);
            const [endHour, endMinute] = slot.endTime.split(":").map(Number);

            const startTotalMin = startHour * 60 + startMin;
            const endTotalMin = endHour * 60 + endMinute;

            if(startTotalMin >= endTotalMin) {
                throw new Error("Start time must be before end time");
            }

            //Ensure meeting duration is at least 30 minutes
            if ((endTotalMin - startTotalMin) < 30) {
                throw new Error("Meeting time must be at least 30 minutes long");
            }
        }
        
        // Validate member count
        if (this.members.length > this.maxMembers) {
            throw new Error("Cannot add more members, group is full");
        }
        
        // Update timestamp (FIX: was updateAt, should be updatedAt)
        this.updatedAt = Date.now();
    }
});

//Index for fast queries
studyGroupSchema.index({ subject: 1});
studyGroupSchema.index({ creator: 1});
studyGroupSchema.index({ 'members': 1});



module.exports = mongoose.model("StudyGroup", studyGroupSchema);