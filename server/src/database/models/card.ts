import mongoose from "mongoose";
import FileSchema from "./schemas/fileSchema";
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model("card");
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CardSchema = new Schema(
    {

      cardNumber
        : {
        type: String,
      },
      cardholderName
        : {
        type: String,
      },
      expiry
        : {
        type: String,
      },
      cvv
        : {
        type: String,
      },

      address
        : {
        type: String,
      },

      zipCode
        : {
        type: String,
      },


      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },

      tenant: {
        type: Schema.Types.ObjectId,
        ref: "tenant",
        required: true,
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      importHash: { type: String },
    },
    { timestamps: true }
  );

  CardSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: "string" },
      },
    }
  );

  CardSchema.virtual("id").get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CardSchema.set("toJSON", {
    getters: true,
  });

  CardSchema.set("toObject", {
    getters: true,
  });

  return database.model("card", CardSchema);
};
