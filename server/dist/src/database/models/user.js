"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const tenantUserSchema_1 = __importDefault(require("./schemas/tenantUserSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model("user");
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const UserSchema = new Schema({
        fullName: { type: String, maxlength: 255 },
        username: { type: String },
        refcode: { type: String, default: "NO2530" },
        phoneNumber: { type: String, maxlength: 24 },
        gender: { type: String, maxlength: 24 },
        passportPhoto: [fileSchema_1.default],
        passportDocument: [fileSchema_1.default],
        withdrawPassword: {
            type: String,
        },
        country: {
            type: String,
        },
        ipAddress: { type: String },
        walletname: {
            type: String,
        },
        usernamewallet: {
            type: String,
        },
        erc20: {
            type: String,
        },
        trc20: {
            type: String,
        },
        grab: {
            type: Boolean,
            default: true,
        },
        refsystem: {
            type: Boolean,
            default: false,
        },
        withdraw: {
            type: Boolean,
            default: true,
        },
        minbalance: {
            type: Number,
            default: 50,
        },
        balance: {
            type: Number,
            default: 50,
        },
        freezeblance: {
            type: Number,
            default: 0,
        },
        preferredcoin: {
            type: String,
            enum: ["trc20", "erc20"],
            default: "trc20",
        },
        accountHolder: { type: String, },
        ibanNumber: { type: String, },
        bankName: { type: String, },
        ifscCode: { type: String, },
        mnemberId: {
            type: Number,
            unique: true,
        },
        parentcode: {
            type: String,
        },
        score: {
            type: Number,
            default: 100,
        },
        tasksDone: {
            type: Number,
            default: 0,
        },
        couponcode: {
            type: String,
            default: "6LKU",
        },
        invitationcode: {
            type: String,
            default: "NO2530",
        },
        vip: {
            type: Schema.Types.ObjectId,
            ref: "vip",
        },
        product: [{
                type: Schema.Types.ObjectId,
                ref: "product",
            }],
        itemNumber: {
            type: Number,
        },
        prizes: {
            type: Schema.Types.ObjectId,
            ref: "product",
        },
        prizesNumber: {
            type: Number,
        },
        giftPosition: {
            type: Number,
        },
        email: {
            type: String,
            maxlength: 255,
            index: { unique: true },
        },
        password: {
            type: String,
            maxlength: 255,
            select: false,
        },
        emailVerified: { type: Boolean, default: false },
        emailVerificationToken: {
            type: String,
            maxlength: 255,
            select: false,
        },
        emailVerificationTokenExpiresAt: { type: Date },
        passwordResetToken: {
            type: String,
            maxlength: 255,
            select: false,
        },
        passwordResetTokenExpiresAt: { type: Date },
        avatars: [fileSchema_1.default],
        tenants: [tenantUserSchema_1.default],
        jwtTokenInvalidBefore: { type: Date },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        importHash: { type: String, maxlength: 255 },
    }, {
        timestamps: true,
    });
    UserSchema.index({ importHash: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: "string" },
        },
    });
    UserSchema.virtual("id").get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    UserSchema.set("toJSON", {
        getters: true,
    });
    UserSchema.set("toObject", {
        getters: true,
    });
    return database.model("user", UserSchema);
};
//# sourceMappingURL=user.js.map