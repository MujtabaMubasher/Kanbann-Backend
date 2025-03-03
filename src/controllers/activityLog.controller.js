import {ActivityLog} from '../models/activityLogs.model.js'

const logActivity = async (userId, taskId, taskName,  action, prevStatus, newStatus) => {
    try {
        const activityData = { user: userId, task: taskId, taskName: taskName, action, prevStatus, newStatus };

        // if (action === "Moved" && moved) {
        //     activityData.moved = moved;
        // }
       const activityLog  = await ActivityLog.create(activityData);
       console.log(activityLog)
       return activityLog
        
    } catch (error) {
        console.error("Error logging activity:", error.message);
    }
};

const getActivityLogs = async (req, res) => {
    try {
        const activityLogs = await ActivityLog.find({ user: req.user._id })
            .populate("task", "ticketName") 
            .sort({ createdAt: -1 }); 

        return res.json({ message: "ActivityLog Fetched Successfully", activityLogs });
    } catch (error) {
        console.error("Error fetching activity logs:", error.message);
        return res.status(500).json({ message: "Failed to fetch activity logs" });
    }
};


export { logActivity, getActivityLogs };
