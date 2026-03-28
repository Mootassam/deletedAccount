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
        return database.model("company");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CompanySchema = new Schema({
        name: {
            type: String,
        },
        trc20: { type: String },
        eth: { type: String },
        companydetails: {
            type: String,
        },
        defaultBalance: {
            type: String,
            default: 50
        },
        defaulCommission: {
            type: String,
            default: 15
        },
        tc: {
            type: String,
        },
        faqs: {
            type: String,
        },
        photo: [fileSchema_1.default],
        tenant: {
            type: Schema.Types.ObjectId,
            ref: "tenant",
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
    CompanySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    CompanySchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CompanySchema.set("toJSON", {
        getters: true,
    });
    CompanySchema.set("toObject", {
        getters: true,
    });
    return database.model("company", CompanySchema);
};
//# sourceMappingURL=company.js.map