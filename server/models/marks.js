const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema(
  {
    semester: {
      type: Number,
      required: true,
    },
    examType: {
      type: String,
      enum: ["mid1", "mid2", "external"],
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    results: {
      type: Map,
      of: {
        type: mongoose.Schema.Types.Mixed,
        validate: {
          validator: function (value) {
            if (this.examType === "external") {
              return Object.values(value).every((v) => typeof v === "string");
            } else {
              return Object.values(value).every((v) => typeof v === "number");
            }
          },
          message: (props) =>
            `Invalid type in results map for examType '${props.instance.examType}'.`,
        },
      },
    },
  },
  {
    timestamps: true,
    compressors: ["zlib"],
  }
);

MarksSchema.index({ semester: 1, examType: 1 });

const Marks = mongoose.model("Marks", MarksSchema);

module.exports = { Marks };
