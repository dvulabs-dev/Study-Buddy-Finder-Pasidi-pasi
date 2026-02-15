const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name for the study group'],
            trim: true,
            minlength: [3, "Group name must be at least 3 Characters"],
            maxlength: [50, "Group name can not exceed 50 Characters"],
        },
        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [500, "Description can not exceed 500 Characters"],
        },
        subject: {
            type: String,
            required: [true, 'Please provide a subject'],
            trim: true,
            minlength: [2, "Subject must be at least 2 Characters"],
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'Group must have a creator'],
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        maxMembers: {
            type: Number,
            default: 10,
            min: [2, "Group must have at least 2 members"],
            max: [50, "Group can not have more than 50 members"],
        },
        meetingTime: {
            weekdays: { type: Boolean, default: false },
            weekend: { type: Boolean, default: false },
            morning: { type: Boolean, default: false },
            evening: { type: Boolean, default: false },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validation: Check if group is full before adding member
studyGroupSchema.methods.isFull = function () {
    return this.members.length >= this.maxMembers;
};

// Adding creator to members array when group is created
studyGroupSchema.pre("save", function (next) {
    if (this.isNew && !this.members.includes(this.creator)) {
        this.members.push(this.creator);
    }
    next();
});

// Prevent adding more members than maxMembers
studyGroupSchema.pre("save", function (next) {
    if (this.members.length > this.maxMembers) {
        next(new Error("Cannot add more members, group is full"));
    } else {
        next();
    }
});

// Validate at least one meeting time is selected (custom validation)
studyGroupSchema.pre("save", function (next) {
    const mt = this.meetingTime;
    if (!mt.weekdays && !mt.weekend && !mt.morning && !mt.evening) {
        next(new Error("At least one meeting time must be selected"));
    } else {
        next();
    }
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);