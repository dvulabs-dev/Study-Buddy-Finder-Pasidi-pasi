const User = require("../models/User");
const StudyGroup = require("../models/StudyGroup");



// @desc    Search users by subject
// @route   GET /api/users/search?subject=Math
// @access  Private

exports.searchUsersBySubject = async(req, res ) => {
   try {
    const { subject } = req.query;

    if (!subject) {
      return res.status(400)
      .json({
         message: "Please provide a subject to search" 
        });
    }

    // 1. Find users who have this subject in their profile
    const profileUsers = await User.find({
       subjects: { $regex: subject, $options: "i" },
       _id: { $ne: req.user.id },
    })
      .select("-password")
      .sort({ name: 1 });

    // 2. Find users who are members of study groups with this subject
    const matchingGroups = await StudyGroup.find({
       subject: { $regex: subject, $options: "i" },
       isActive: true,
    }).select("members");

    // Collect all member IDs from matching groups
    const groupMemberIds = new Set();
    matchingGroups.forEach(group => {
      group.members.forEach(memberId => {
        const id = memberId.toString();
        if (id !== req.user.id) {
          groupMemberIds.add(id);
        }
      });
    });

    // 3. Get user details for group members not already in profile results
    const profileUserIds = new Set(profileUsers.map(u => u._id.toString()));
    const additionalIds = [...groupMemberIds].filter(id => !profileUserIds.has(id));

    let groupUsers = [];
    if (additionalIds.length > 0) {
      groupUsers = await User.find({
        _id: { $in: additionalIds },
      })
        .select("-password")
        .sort({ name: 1 });
    }

    // 4. Combine both results (profile matches + group members)
    const users = [...profileUsers, ...groupUsers];

    res.status(200)
     .json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500)
    .json ({
         message: error.message 
    });
  }

};


// @desc Search users by subject and available time


exports.searchUsersByAvailability= async (req, res) => {

    try {
        const { subject , availableTime } = req.body;
        
        if (!subject){
            return res.status(400)
            .json({
                message: "Please provide a subject"
            });
        }

            //Query for users with subject in their profile
            const query = {
                subjects : { $regex: subject, $options: "i" },
                _id: { $ne: req.user.id }, 
            };

            //Add available time filter - only filter by checked (true) values
            if(availableTime){
                if(availableTime.weekdays === true){
                    query["availableTime.weekdays"] = true;
                }
                if(availableTime.weekend === true){
                    query["availableTime.weekend"] = true;
                }
                if(availableTime.morning === true){
                    query["availableTime.morning"] = true;
                }
                if(availableTime.evening === true){
                    query["availableTime.evening"] = true;
                }

            }

            const profileUsers = await User.find(query)
            .select("-password")
            .sort({ name: 1 });

            // Also find users who are members of study groups with this subject
            const matchingGroups = await StudyGroup.find({
              subject: { $regex: subject, $options: "i" },
              isActive: true,
            }).select("members");

            const groupMemberIds = new Set();
            matchingGroups.forEach(group => {
              group.members.forEach(memberId => {
                const id = memberId.toString();
                if (id !== req.user.id) {
                  groupMemberIds.add(id);
                }
              });
            });

            // Get group members not already in profile results
            const profileUserIds = new Set(profileUsers.map(u => u._id.toString()));
            const additionalIds = [...groupMemberIds].filter(id => !profileUserIds.has(id));

            let groupUsers = [];
            if (additionalIds.length > 0) {
              // Don't apply availability filters to group members -
              // they are already relevant by being in a matching study group
              groupUsers = await User.find({
                _id: { $in: additionalIds },
              })
                .select("-password")
                .sort({ name: 1 });
            }

            const users = [...profileUsers, ...groupUsers];

            res.status(200)
            .json({
                count : users.length,
                users,
            });

        } catch (error){
            res.status(500)
            .json({
                message: error.message
            });
        }

};
