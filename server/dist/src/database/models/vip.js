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
        return database.model("vip");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const VipSchema = new Schema({
        title: {
            type: String,
        },
        entrylimit: {
            type: String,
        },
        levellimit: {
            type: String,
        },
        photo: [fileSchema_1.default],
        dailyorder: {
            type: String,
        },
        comisionrate: {
            type: String,
        },
        setperday: {
            type: String,
        },
        withdrawperday: {
            type: String
        },
        commissionmergedata: {
            type: String,
        },
        isFixedAmount: { type: Boolean, default: true },
        min: { type: String },
        max: { type: String },
        handlingfee: { type: String },
        withdrawlimit: { type: String },
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
    VipSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    VipSchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    VipSchema.set("toJSON", {
        getters: true,
    });
    VipSchema.set("toObject", {
        getters: true,
    });
    return database.model("vip", VipSchema);
};
//# sourceMappingURL=vip.js.map