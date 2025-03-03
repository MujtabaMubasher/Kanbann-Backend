import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo", 
      required: true,
    },
    taskName: {
      type: String, 
      required: false,
    },
    action: {
      type: String,
      enum: ["Created", "Updated", "Deleted", "Moved"], 
      required: true,
    },
    
    prevStatus: {
        type:String,
        required: false

    },

    newStatus: {
      type:String,
      required: false

    },
    // moved: {
    //   from: {
    //     type: String,
    //     enum: ["To Do", "In Progress", "Done"],
    //     required: function () {
    //       return this.action === "Moved";
    //     },
    //   },
    //   to: {
    //     type: String,
    //     enum: ["To Do", "In Progress", "Done"],
    //     required: function () {
    //       return this.action === "Moved";
    //     },
    //   },
    // },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const ActivityLog =  mongoose.model("ActivityLog", activityLogSchema);
