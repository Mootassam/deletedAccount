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
        return database.model("product");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ProductSchema = new Schema({
        title: {
            type: String,
        },
        amount: {
            type: String,
        },
        commission: {
            type: String,
        },
        photo: [fileSchema_1.default],
        image: { type: String },
        type: {
            type: String,
            enum: ["prizes", "combo", "normal"],
            default: "normal",
        },
        vip: {
            type: Schema.Types.ObjectId,
            ref: "vip",
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
    }, { timestamps: true });
    ProductSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    ProductSchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ProductSchema.set("toJSON", {
        getters: true,
    });
    ProductSchema.set("toObject", {
        getters: true,
    });
    return database.model("product", ProductSchema);
};
//# sourceMappingURL=product.js.map