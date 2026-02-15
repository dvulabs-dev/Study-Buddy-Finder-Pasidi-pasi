const User = require("../models/User");



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

    // Find users who have this subject (case-insensitive)
    const users = await User.find({
       subjects: { $regex: subject, $options: "i" },
       _id: { $ne: req.user.id }, // Exclude current user
    })
      .select("-password")
      .sort({ name: 1 });

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

            //Query
            
            const query = {
                subjects : { $regex: subject, $options: "i" },
                _id: { $ne: req.user.id }, 
            };

            //Add available time filter is provided
            if(availableTime){
                if(availableTime.weekdays !== undefined){
                    query["availableTime.weekdays"] = availableTime.weekdays;
                }
                if(availableTime.weekend !== undefined){
                    query["availableTime.weekend"] = availableTime.weekend;
                }
                if(availableTime.morning !== undefined){
                    query["availableTime.morning"] = availableTime.morning;
                }
                if(availableTime.evening !== undefined){
                    query["availableTime.evening"] = availableTime.evening;
                }

            }

            const users = await User.find(query)
            .select("-password")
            .sort({ name: 1 });

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
