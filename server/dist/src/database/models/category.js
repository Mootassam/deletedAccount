"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model("category");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CategorySchema = new Schema({
        name: {
            type: String,
        },
        number: {
            type: String,
        },
        slug: {
            type: String,
        },
        photo: [fileSchema_1.default],
        metaKeywords: {
            type: String,
        },
        metaDescriptions: {
            type: String,
        },
        status: {
            type: String,
            enum: ["enable", "disable"],
            default: "enable",
        },
        type: {
            type: String,
            required: true,
            enum: ["whatsApp", "telegram"],
        },
        isFeature: {
            type: Boolean,
            default: false,
        },
        serial: {
            type: Number,
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
    }, { timestamps: true });
    CategorySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    CategorySchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CategorySchema.set("toJSON", {
        getters: true,
    });
    CategorySchema.set("toObject", {
        getters: true,
    });
    return database.model("category", CategorySchema);
};
//# sourceMappingURL=category.js.map