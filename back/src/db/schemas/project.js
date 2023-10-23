import { Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    projectId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectDetail: {
      type: String,
      required: true,
    },
    projectUrl: {
      type: String, // URL을 저장하는 필드는 일반적으로 String으로 정의
      required: false,
    },
    projectStartDate: {
      type: Date,
      required: false,
    },
    projectEndDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = model("Project", ProjectSchema);

export { ProjectModel };
