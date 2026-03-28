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
        return database.model("transaction");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const TransactionSchema = new Schema({
        status: {
            type: String,
            enum: ["pending", "canceled", "success"],
            default: "pending",
        },
        amount: {
            type: String,
        },
        type: {
            type: String,
            enum: ["withdraw", "deposit"],
            default: "withdraw",
        },
        withdrawalMethod: {
            type: String,
        },
        photo: [fileSchema_1.default],
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        datetransaction: {
            type: Date,
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
    TransactionSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    TransactionSchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    TransactionSchema.set("toJSON", {
        getters: true,
    });
    TransactionSchema.set("toObject", {
        getters: true,
    });
    return database.model("transaction", TransactionSchema);
};
//# sourceMappingURL=transaction.js.map