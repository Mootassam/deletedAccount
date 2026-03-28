"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongooseRepository_1 = __importDefault(require("./mongooseRepository"));
const user_1 = __importDefault(require("../models/user"));
const auditLogRepository_1 = __importDefault(require("./auditLogRepository"));
const mongooseQueryUtils_1 = __importDefault(require("../utils/mongooseQueryUtils"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const crypto_1 = __importDefault(require("crypto"));
const Error404_1 = __importDefault(require("../../errors/Error404"));
const settingsRepository_1 = __importDefault(require("./settingsRepository"));
const userTenantUtils_1 = require("../utils/userTenantUtils");
const lodash_1 = __importDefault(require("lodash"));
const vip_1 = __importDefault(require("../models/vip"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
const axios_1 = __importDefault(require("axios"));
const company_1 = __importDefault(require("../models/company"));
class UserRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            data = this._preSave(data);
            const [user] = yield user_1.default(options.database).create([
                {
                    email: data.email,
                    fullName: data.fullName || null,
                    phoneNumber: data.phoneNumber || null,
                    country: data.country || null,
                    nationality: data.nationality || null,
                    passportPhoto: data.passportPhoto || null,
                    passportDocument: data.passportDocument || null,
                    avatars: data.avatars || [],
                    createdBy: currentUser.id,
                    updatedBy: currentUser.id,
                },
            ], options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: user.id,
                action: auditLogRepository_1.default.CREATE,
                values: user,
            }, options);
            return this.findById(user.id, Object.assign(Object.assign({}, options), { bypassPermissionValidation: true }));
        });
    }
    static userChangeWithdrawalPassword(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const { oldPassword, newPassword } = data;
            // Validate input
            if (!oldPassword || oldPassword.trim() === '') {
                throw new Error400_1.default(options.language, "validation.oldPasswordRequired");
            }
            if (!newPassword || newPassword.trim() === '') {
                throw new Error400_1.default(options.language, "validation.newPasswordRequired");
            }
            if (newPassword.length < 4) {
                throw new Error400_1.default(options.language, "validation.newPasswordTooShort");
            }
            if (newPassword.length > 50) {
                throw new Error400_1.default(options.language, "validation.newPasswordTooLong");
            }
            // Check if new password is same as old password
            if (oldPassword === newPassword) {
                throw new Error400_1.default(options.language, "validation.newPasswordDifferentFromOld");
            }
            // First, get the user to check if withdrawPassword exists
            const user = yield user_1.default(options.database)
                .findById(currentUser.id)
                .select('+withdrawPassword');
            if (!user) {
                throw new Error400_1.default(options.language, "validation.userNotFound");
            }
            // Check if user has a withdraw password set
            if (!user.withdrawPassword) {
                // Allow setting password for the first time without old password
                yield user_1.default(options.database).updateOne({ _id: currentUser.id }, { $set: { withdrawPassword: newPassword } });
                return { message: "Withdrawal password created successfully" };
            }
            // Verify old password matches
            if (user.withdrawPassword !== oldPassword) {
                throw new Error400_1.default(options.language, "validation.invalidOldWithdrawalPassword");
            }
            // Update the password
            const result = yield user_1.default(options.database).updateOne({ _id: currentUser.id }, { $set: { withdrawPassword: newPassword } });
            if (result.modifiedCount === 0) {
                throw new Error400_1.default(options.language, "validation.updatePasswordFailed");
            }
            return user;
        });
    }
    static updateMyBankInfo(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("🚀 ~ UserRepository ~ updateMyBankInfo ~ data:", data);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // Access the nested data
            const bankData = data.data || data; // Handle both nested and direct structures
            // Update the current user's bank information
            const updatedUser = yield user_1.default(options.database).findByIdAndUpdate(currentUser.id, {
                $set: {
                    accountHolder: bankData.accountHolder,
                    ibanNumber: bankData.ibanNumber,
                    bankName: bankData.bankName,
                    ifscCode: bankData.ifscCode
                },
                updatedBy: currentUser.id
            }, { new: true } // Return the updated document
            );
            // Optional: Add audit log
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: currentUser.id,
                action: auditLogRepository_1.default.UPDATE,
                values: { updatedFields: ['accountHolder', 'IbanNumber', 'bankName', 'ifscCode'] }
            }, options);
            return updatedUser;
        });
    }
    static createUniqueRefCode(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let code;
            let exists = true;
            while (exists) {
                code = this.generateRefCode();
                exists = yield user_1.default(options.database).exists({ refCode: code });
            }
            return code;
        });
    }
    static getReferralData(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const UserModel = user_1.default(options.database);
                const TransactionModel = options.database.model("transaction");
                const RecordModel = options.database.model("records");
                const CompanyModel = options.database.model("company");
                const currentUser = mongooseRepository_1.default.getCurrentUser(options);
                // Get current user's refcode
                if (!currentUser) {
                    throw new Error400_1.default(options.language, "validation.userNotFound");
                }
                const userRefCode = currentUser.refcode;
                if (!userRefCode) {
                    return {
                        totalDailyInvitations: 0,
                        totalMonthlyInvitations: 0,
                        totalMonthlyIncome: 0,
                        referrals: []
                    };
                }
                // Get company settings for defaultCommission
                const companySettings = yield CompanyModel.findOne({});
                const defaultCommission = parseFloat((companySettings === null || companySettings === void 0 ? void 0 : companySettings.defaulCommission) || "15"); // Default to 15 if not set
                // Get current date boundaries
                const now = new Date();
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                // Find all users who used this refcode
                const referredUsers = yield UserModel.find({
                    invitationcode: userRefCode,
                    createdAt: { $exists: true }
                }).select('mnemberId createdAt fullName email');
                // Calculate daily and monthly invitations
                const dailyInvitations = referredUsers.filter(user => user.createdAt >= startOfDay).length;
                const monthlyInvitations = referredUsers.filter(user => user.createdAt >= startOfMonth && user.createdAt <= endOfMonth).length;
                // If no referred users, return empty data
                if (referredUsers.length === 0) {
                    return {
                        totalDailyInvitations: dailyInvitations,
                        totalMonthlyInvitations: monthlyInvitations,
                        totalMonthlyIncome: 0,
                        referrals: []
                    };
                }
                // Get all user IDs for transaction and record lookup
                const referredUserIds = referredUsers.map(user => user._id);
                // Get transaction data (recharge and withdraw)
                const transactionData = yield TransactionModel.aggregate([
                    {
                        $match: {
                            user: { $in: referredUserIds },
                            status: "success",
                            type: { $in: ["deposit", "withdraw"] }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                userId: "$user",
                                type: "$type"
                            },
                            totalAmount: {
                                $sum: { $toDouble: "$amount" }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.userId",
                            transactions: {
                                $push: {
                                    type: "$_id.type",
                                    amount: "$totalAmount"
                                }
                            }
                        }
                    }
                ]);
                // Get records data to calculate profit for each referred user
                // Profit formula: commission = (parseFloat(commission) / 100) * parseFloat(price)
                const recordsData = yield RecordModel.aggregate([
                    {
                        $match: {
                            user: { $in: referredUserIds },
                            status: "completed" // Only count completed records
                        }
                    },
                    {
                        $addFields: {
                            // Convert price and commission to numbers
                            priceNum: { $toDouble: "$price" },
                            commissionNum: { $toDouble: "$commission" }
                        }
                    },
                    {
                        $addFields: {
                            // Calculate profit for each record: (commission / 100) * price
                            recordProfit: {
                                $multiply: [
                                    { $divide: ["$commissionNum", 100] },
                                    "$priceNum"
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$user",
                            totalProfit: { $sum: "$recordProfit" }
                        }
                    }
                ]);
                // Create maps for quick lookup
                const transactionMap = new Map();
                transactionData.forEach(item => {
                    var _a, _b;
                    const userId = item._id.toString();
                    const deposits = ((_a = item.transactions.find(t => t.type === "deposit")) === null || _a === void 0 ? void 0 : _a.amount) || 0;
                    const withdraws = ((_b = item.transactions.find(t => t.type === "withdraw")) === null || _b === void 0 ? void 0 : _b.amount) || 0;
                    transactionMap.set(userId, {
                        recharge: deposits,
                        withdraw: withdraws
                    });
                });
                const profitMap = new Map();
                recordsData.forEach(item => {
                    profitMap.set(item._id.toString(), item.totalProfit);
                });
                // Calculate total profit from all referred users
                let totalReferralProfit = 0;
                // Build the referral list with transaction and profit data
                const referrals = referredUsers.map(user => {
                    const userId = user._id.toString();
                    const userTransactions = transactionMap.get(userId) || {
                        recharge: 0,
                        withdraw: 0
                    };
                    const userProfit = profitMap.get(userId) || 0;
                    // Add to total referral profit
                    totalReferralProfit += userProfit;
                    return {
                        memberId: user.mnemberId || 0,
                        recharge: userTransactions.recharge,
                        withdraw: userTransactions.withdraw,
                        totalProfit: userProfit
                    };
                });
                // Calculate total monthly income based on defaultCommission percentage
                // From total profit earned by all invited users, take only the percentage defined by defaultCommission
                const totalMonthlyIncome = (defaultCommission / 100) * totalReferralProfit;
                return {
                    totalDailyInvitations: dailyInvitations,
                    totalMonthlyInvitations: monthlyInvitations,
                    totalMonthlyIncome: parseFloat(totalMonthlyIncome.toFixed(2)),
                    referrals: referrals.sort((a, b) => b.recharge - a.recharge)
                };
            }
            catch (error) {
                console.error("Error in getReferralData:", error);
                throw error;
            }
        });
    }
    /**
     * Detailed version with more information
     */
    static getReferralDataDetailed(currentUserId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const UserModel = user_1.default(options.database);
                const TransactionModel = options.database.model("transaction");
                const RecordModel = options.database.model("records");
                const CompanyModel = options.database.model("company");
                // Get current user's refcode
                const currentUser = yield UserModel.findById(currentUserId);
                if (!currentUser) {
                    throw new Error400_1.default(options.language, "validation.userNotFound");
                }
                const userRefCode = currentUser.refcode;
                if (!userRefCode) {
                    return {
                        totalDailyInvitations: 0,
                        totalMonthlyInvitations: 0,
                        totalMonthlyIncome: 0,
                        totalReferralProfit: 0,
                        defaultCommission: 0,
                        referrals: []
                    };
                }
                // Get company settings for defaultCommission
                const companySettings = yield CompanyModel.findOne({});
                const defaultCommission = parseFloat((companySettings === null || companySettings === void 0 ? void 0 : companySettings.defaulCommission) || "15");
                // Get current date boundaries
                const now = new Date();
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                // Use aggregation for better performance
                const referralData = yield UserModel.aggregate([
                    {
                        $match: {
                            invitationcode: userRefCode
                        }
                    },
                    {
                        $lookup: {
                            from: "transactions",
                            let: { userId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$user", "$$userId"] },
                                        status: "success"
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$type",
                                        total: { $sum: { $toDouble: "$amount" } }
                                    }
                                }
                            ],
                            as: "transactions"
                        }
                    },
                    {
                        $lookup: {
                            from: "records",
                            let: { userId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$user", "$$userId"] },
                                        status: "completed"
                                    }
                                },
                                {
                                    $addFields: {
                                        priceNum: { $toDouble: "$price" },
                                        commissionNum: { $toDouble: "$commission" }
                                    }
                                },
                                {
                                    $addFields: {
                                        profit: {
                                            $multiply: [
                                                { $divide: ["$commissionNum", 100] },
                                                "$priceNum"
                                            ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalProfit: { $sum: "$profit" }
                                    }
                                }
                            ],
                            as: "records"
                        }
                    },
                    {
                        $project: {
                            memberId: "$mnemberId",
                            fullName: 1,
                            email: 1,
                            createdAt: 1,
                            transactions: {
                                $arrayToObject: {
                                    $map: {
                                        input: "$transactions",
                                        as: "t",
                                        in: { k: "$$t._id", v: "$$t.total" }
                                    }
                                }
                            },
                            totalProfit: {
                                $ifNull: [
                                    { $arrayElemAt: ["$records.totalProfit", 0] },
                                    0
                                ]
                            }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    }
                ]);
                // Calculate daily and monthly counts
                const dailyInvitations = referralData.filter(user => user.createdAt >= startOfDay).length;
                const monthlyInvitations = referralData.filter(user => user.createdAt >= startOfMonth && user.createdAt <= endOfMonth).length;
                // Calculate total profit from all referred users
                const totalReferralProfit = referralData.reduce((sum, user) => sum + (user.totalProfit || 0), 0);
                // Calculate total monthly income based on defaultCommission percentage
                const totalMonthlyIncome = (defaultCommission / 100) * totalReferralProfit;
                // Format the referrals data
                const referrals = referralData.map(user => {
                    var _a, _b;
                    return ({
                        memberId: user.memberId || 0,
                        recharge: ((_a = user.transactions) === null || _a === void 0 ? void 0 : _a.deposit) || 0,
                        withdraw: ((_b = user.transactions) === null || _b === void 0 ? void 0 : _b.withdraw) || 0,
                        totalProfit: parseFloat((user.totalProfit || 0).toFixed(2)),
                        // Optional: include additional fields
                        fullName: user.fullName,
                        email: user.email,
                        joinedDate: user.createdAt
                    });
                });
                return {
                    totalDailyInvitations: dailyInvitations,
                    totalMonthlyInvitations: monthlyInvitations,
                    totalMonthlyIncome: parseFloat(totalMonthlyIncome.toFixed(2)),
                    totalReferralProfit: parseFloat(totalReferralProfit.toFixed(2)),
                    defaultCommission: defaultCommission,
                    referrals: referrals.sort((a, b) => b.recharge - a.recharge),
                    summary: {
                        totalReferred: referrals.length,
                        totalRechargeAmount: referrals.reduce((sum, r) => sum + r.recharge, 0),
                        totalWithdrawAmount: referrals.reduce((sum, r) => sum + r.withdraw, 0),
                        averageProfit: referrals.length > 0
                            ? parseFloat((referrals.reduce((sum, r) => sum + r.totalProfit, 0) / referrals.length).toFixed(2))
                            : 0
                    }
                };
            }
            catch (error) {
                console.error("Error in getReferralDataDetailed:", error);
                throw error;
            }
        });
    }
    static generateRefCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = "NO";
            const randomPart = Math.floor(1000 + Math.random() * 9000); // 6 digits
            return `${prefix}${randomPart}`;
        });
    }
    static updateUser(tenantId, id, fullName, phoneNumber, passportNumber, nationality, country, passportPhoto, balance, minbalance, vip, options, status, product, itemNumber, prizes, prizesNumber, withdrawPassword, score, grab, withdraw, refsystem, freezeblance, tasksDone, preferredcoin) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findById(id), options);
            yield user_1.default(options.database).updateOne({ _id: id }, {
                $set: {
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    passportNumber: passportNumber,
                    nationality: nationality,
                    country: country,
                    passportPhoto: passportPhoto,
                    options: options,
                    balance: balance,
                    minbalance: minbalance,
                    vip: vip,
                    product: product,
                    itemNumber: itemNumber,
                    prizes: prizes,
                    prizesNumber: prizesNumber,
                    withdrawPassword: withdrawPassword,
                    score: score,
                    grab: grab,
                    refsystem: refsystem,
                    withdraw: withdraw,
                    freezeblance: freezeblance,
                    preferredcoin: preferredcoin,
                    tasksDone: tasksDone,
                    $tenant: { status }
                },
            }, options);
        });
    }
    static generateCouponCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const randomNumber = Math.floor(Math.random() * 10000000);
            const randomNumberPadded = randomNumber.toString().padStart(7, "0");
            const randomCode = yield `6L${randomNumberPadded}`;
            return randomCode;
        });
    }
    static getCountry(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`http://ip-api.com/json/${ip}`);
            const data = response.data;
            return data.country; // e.g., "United States"
        });
    }
    static createFromAuth(data, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            data = this._preSave(data);
            const req = data.req;
            const normalizeIP = (ip) => ip.replace(/^::ffff:/, "");
            const rawIP = ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.toString().split(",")[0]) ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress || ((_b = req.connection.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress);
            const clientIP = normalizeIP(rawIP);
            const country = yield this.getCountry(clientIP);
            let [user] = yield user_1.default(options.database).create([
                {
                    email: data.email,
                    password: data.password,
                    phoneNumber: data.phoneNumber,
                    country: country,
                    ipAddress: clientIP,
                    firstName: data.firstName,
                    fullName: data.fullName,
                    withdrawPassword: data.withdrawPassword,
                    invitationcode: data.invitationcode,
                    refcode: yield this.createUniqueRefCode(options),
                    couponcode: yield this.createUniqueRefCode(options),
                },
            ], options);
            delete user.password;
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: user.id,
                action: auditLogRepository_1.default.CREATE,
                values: user,
            }, options);
            return this.findById(user.id, Object.assign(Object.assign({}, options), { bypassPermissionValidation: true }));
        });
    }
    static VipLevel(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const sort = mongooseQueryUtils_1.default.sort("createdAt_ASC");
            const skip = Number(0) || undefined;
            const limitEscaped = Number(0) || undefined;
            let rows = yield vip_1.default(options.database)
                .find()
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("members");
            const count = yield vip_1.default(options.database).countDocuments();
            return { rows, count };
        });
    }
    static createFromAuthMobile(data, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const vip = yield this.VipLevel(options);
            const id = (_a = vip === null || vip === void 0 ? void 0 : vip.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
            data = this._preSave(data);
            const req = data.req;
            const normalizeIP = (ip) => ip.replace(/^::ffff:/, "");
            const rawIP = ((_b = req.headers["x-forwarded-for"]) === null || _b === void 0 ? void 0 : _b.toString().split(",")[0]) ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress || ((_c = req.connection.socket) === null || _c === void 0 ? void 0 : _c.remoteAddress);
            const clientIP = normalizeIP(rawIP);
            const country = yield this.getCountry(clientIP);
            const defaultBalance = yield company_1.default(options.database).find({});
            let settingsBalance;
            if (defaultBalance.length > 0) {
                settingsBalance = defaultBalance[0].defaultBalance;
            }
            // Generate unique memberId with format 138XXX
            const memberId = yield this.generateUniqueMemberId(options);
            let [user] = yield user_1.default(options.database).create([
                {
                    email: data.email,
                    password: data.password,
                    phoneNumber: data.phoneNumber,
                    ipAddress: clientIP,
                    country: country,
                    firstName: data.firstName,
                    fullName: data.fullName,
                    gender: data.gender,
                    withdrawPassword: data.withdrawPassword,
                    invitationcode: data.invitationcode,
                    refcode: yield this.createUniqueRefCode(options),
                    balance: settingsBalance,
                    vip: id ? id : "",
                    mnemberId: memberId,
                },
            ], options);
            delete user.password;
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: user.id,
                action: auditLogRepository_1.default.CREATE,
                values: user,
            }, options);
            return this.findByIdMobile(user.id, Object.assign(Object.assign({}, options), { bypassPermissionValidation: true }));
        });
    }
    /**
     * Generate a unique 6-digit memberId starting with 138
     * Uses counter collection approach for optimal performance and uniqueness
     */
    static generateUniqueMemberId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get or create the counter model
                const CounterModel = this.getCounterModel(options.database);
                // Find and update the counter atomically
                const counter = yield CounterModel.findOneAndUpdate({ name: 'memberId' }, { $inc: { value: 1 } }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                    returnOriginal: false
                });
                // Ensure the value starts from 138001
                if (counter.value < 138001) {
                    counter.value = 138001;
                    yield counter.save();
                }
                return counter.value;
            }
            catch (error) {
                console.error('Error generating memberId with counter:', error);
                // Fallback to random generation if counter fails
                return yield this.generateUniqueMemberIdFallback(options);
            }
        });
    }
    /**
     * Counter model definition
     */
    static getCounterModel(database) {
        try {
            return database.model('counter');
        }
        catch (error) {
            // Model doesn't exist, create it
            const CounterSchema = new database.Schema({
                name: {
                    type: String,
                    required: true,
                    unique: true
                },
                value: {
                    type: Number,
                    default: 138000
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                updatedAt: {
                    type: Date,
                    default: Date.now
                }
            });
            CounterSchema.pre('save', function (next) {
                this.updatedAt = new Date();
                next();
            });
            return database.model('counter', CounterSchema);
        }
    }
    /**
     * Fallback method to generate unique memberId
     * Uses random generation with uniqueness check
     */
    static generateUniqueMemberIdFallback(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserModel = user_1.default(options.database);
            let isUnique = false;
            let memberId = 138001;
            let attempts = 0;
            const maxAttempts = 50;
            while (!isUnique && attempts < maxAttempts) {
                // Generate random 3-digit number (100-999)
                const randomSuffix = Math.floor(Math.random() * 900) + 100; // 100 to 999
                // Combine with prefix 138 to create 6-digit number
                memberId = parseInt(`138${randomSuffix}`);
                // Check if this memberId already exists
                const existingUser = yield UserModel.findOne({ mnemberId: memberId });
                if (!existingUser) {
                    isUnique = true;
                }
                attempts++;
            }
            if (!isUnique) {
                // If we couldn't generate a unique ID after max attempts,
                // use timestamp-based approach as final fallback
                const timestamp = Date.now().toString().slice(-3);
                memberId = parseInt(`138${timestamp}`);
                // One final check with timestamp
                let existingUser = yield UserModel.findOne({ mnemberId: memberId });
                if (existingUser) {
                    // If still not unique, add a small random offset until unique
                    let offset = 1;
                    while (existingUser && offset < 100) {
                        const newSuffix = (parseInt(timestamp) + offset).toString().padStart(3, '0');
                        memberId = parseInt(`138${newSuffix}`);
                        existingUser = yield UserModel.findOne({ mnemberId: memberId });
                        offset++;
                    }
                }
            }
            return memberId;
        });
    }
    /**
     * Alternative method using sequence approach (if you prefer sequential IDs)
     */
    static generateSequentialMemberId(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserModel = user_1.default(options.database);
            // Find the highest existing memberId with prefix 138
            const lastUser = yield UserModel.findOne({
                mnemberId: { $exists: true, $regex: /^138/ }
            }).sort({ mnemberId: -1 });
            if (lastUser && lastUser.mnemerId) {
                // Extract the last 3 digits and increment
                const lastId = lastUser.mnemerId.toString();
                const lastSuffix = parseInt(lastId.slice(-3));
                // Generate next suffix (wrap around if needed)
                let nextSuffix = (lastSuffix + 1) % 1000;
                // Ensure it's always 3 digits (pad with zeros)
                // Start from 001, not 000
                if (nextSuffix === 0) {
                    nextSuffix = 1;
                }
                const paddedSuffix = nextSuffix.toString().padStart(3, '0');
                return parseInt(`138${paddedSuffix}`);
            }
            else {
                // First user - start with 138001
                return 138001;
            }
        });
    }
    /**
     * Utility method to check if a memberId exists
     */
    static checkMemberIdExists(memberId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserModel = user_1.default(options.database);
            const existingUser = yield UserModel.findOne({ mnemberId: memberId });
            return !!existingUser;
        });
    }
    /**
     * Utility method to get all memberIds (for debugging)
     */
    static getAllMemberIds(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserModel = user_1.default(options.database);
            const users = yield UserModel.find({ mnemberId: { $exists: true } })
                .select('mnemberId')
                .sort({ mnemberId: 1 });
            return users.map(user => user.mnemerId);
        });
    }
    static updatePassword(id, password, invalidateOldTokens, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const data = {
                password,
                updatedBy: id,
            };
            if (invalidateOldTokens) {
                data.jwtTokenInvalidBefore = new Date();
            }
            yield user_1.default(options.database).updateOne({ _id: id }, data, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: {
                    id,
                    password: "secret",
                },
            }, options);
            return this.findById(id, Object.assign(Object.assign({}, options), { bypassPermissionValidation: true }));
        });
    }
    static updateProfile(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            yield this.checkSolde(data, options);
            data = this._preSave(data);
            yield user_1.default(options.database).updateOne({ _id: id }, {
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                fullName: data.fullName || currentUser.fullName,
                phoneNumber: data.phoneNumber || currentUser.phoneNumber,
                updatedBy: currentUser.id,
                avatars: data.avatars || [],
                vip: data.vip || currentUser.vip,
                withdraw: data.withdraw || currentUser.withdraw,
                balance: data.balance || currentUser.balance,
                trc20: data.trc20 || currentUser.trc20,
                walletname: data.walletname || currentUser.walletname,
                usernamewallet: data.usernamewallet || currentUser.usernamewallet,
                product: data === null || data === void 0 ? void 0 : data.product,
                itemNumber: data === null || data === void 0 ? void 0 : data.itemNumber,
                preferredcoin: data === null || data === void 0 ? void 0 : data.preferredcoin
            }, options);
            const user = yield this.findById(id, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: user,
            }, options);
            return user;
        });
    }
    static updateProfileGrap(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // await this.checkSolde(data, options);
            data = this._preSave(data);
            yield user_1.default(options.database).updateOne({ _id: id }, {
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                fullName: data.fullName || currentUser.fullName,
                phoneNumber: data.phoneNumber || currentUser.phoneNumber,
                updatedBy: currentUser.id,
                avatars: data.avatars || [],
                vip: data.vip || currentUser.vip,
                balance: data.balance,
                freezeblance: data.freezeblance,
                erc20: data.erc20 || currentUser.erc20,
                trc20: data.trc20 || currentUser.trc20,
                walletname: data.walletname || currentUser.walletname,
                usernamewallet: data.usernamewallet || currentUser.usernamewallet,
                product: (data === null || data === void 0 ? void 0 : data.product) || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.product),
            }, options);
            const user = yield this.findById(id, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: user,
            }, options);
            return user;
        });
    }
    static updateSolde(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // await this.checkSolde(data, options);
            data = this._preSave(data);
            yield user_1.default(options.database).updateOne({ _id: id }, {
                firstName: data.firstName || currentUser.firstName,
                lastName: data.lastName || currentUser.lastName,
                fullName: data.fullName || currentUser.fullName,
                phoneNumber: data.phoneNumber || currentUser.phoneNumber,
                updatedBy: currentUser.id,
                avatars: data.avatars || [],
                vip: data.vip || currentUser.vip,
                balance: data.balances,
                erc20: data.erc20 || currentUser.erc20,
                trc20: data.trc20 || currentUser.trc20,
                walletname: data.walletname || currentUser.walletname,
                usernamewallet: data.usernamewallet || currentUser.usernamewallet,
                product: data === null || data === void 0 ? void 0 : data.product,
            }, options);
            const user = yield this.findById(id, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: user,
            }, options);
            return user;
        });
    }
    static updateBalance(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield mongooseRepository_1.default.getCurrentUser(options);
            const currentBalance = currentUser.balance;
            const currentVip = currentUser.vip.id;
            if (!data)
                return;
        });
    }
    static checkSolde(data, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield mongooseRepository_1.default.getCurrentUser(options);
            const currentBalance = currentUser.balance;
            const currentVip = currentUser.vip.id;
            if (!((_a = data === null || data === void 0 ? void 0 : data.vip) === null || _a === void 0 ? void 0 : _a.id))
                return;
            if (currentVip === ((_b = data === null || data === void 0 ? void 0 : data.vip) === null || _b === void 0 ? void 0 : _b.id)) {
                throw new Error400_1.default(options.language, "validation.duplicateSubsctription");
            }
            if (currentBalance < ((_c = data === null || data === void 0 ? void 0 : data.vip) === null || _c === void 0 ? void 0 : _c.levellimit)) {
                throw new Error400_1.default(options.language, "validation.InsufficientBalance");
            }
        });
    }
    static generateEmailVerificationToken(email, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const { id } = yield this.findByEmailWithoutAvatar(email, options);
            const emailVerificationToken = crypto_1.default.randomBytes(20).toString("hex");
            const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
            yield user_1.default(options.database).updateOne({ _id: id }, {
                emailVerificationToken,
                emailVerificationTokenExpiresAt,
                updatedBy: currentUser.id,
            }, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: {
                    id,
                    emailVerificationToken,
                    emailVerificationTokenExpiresAt,
                },
            }, options);
            return emailVerificationToken;
        });
    }
    static generatePasswordResetToken(email, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const { id } = yield this.findByEmailWithoutAvatar(email, options);
            const passwordResetToken = crypto_1.default.randomBytes(20).toString("hex");
            const passwordResetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
            yield user_1.default(options.database).updateOne({ _id: id }, {
                passwordResetToken,
                passwordResetTokenExpiresAt,
                updatedBy: currentUser.id,
            }, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: {
                    id,
                    passwordResetToken,
                    passwordResetTokenExpiresAt,
                },
            }, options);
            return passwordResetToken;
        });
    }
    static findByEmail(email, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.findByEmailWithoutAvatar(email, options);
            return yield this._fillRelationsAndFileDownloadUrls(record, options);
        });
    }
    static findByEmailWithoutAvatar(email, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database)
                .findOne({
                email: {
                    $regex: new RegExp(`^${mongooseQueryUtils_1.default.escapeRegExp(email)}$`),
                    $options: "i",
                },
            })
                .populate("tenants.tenant"), options);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenants: { $elemMatch: { tenant: currentTenant.id } },
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ["_id"]: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.fullName) {
                    criteriaAnd.push({
                        ["fullName"]: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.fullName),
                            $options: "i",
                        },
                    });
                }
                if (filter.email) {
                    criteriaAnd.push({
                        ["email"]: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.email),
                            $options: "i",
                        },
                    });
                }
                if (filter.role) {
                    criteriaAnd.push({
                        tenants: { $elemMatch: { roles: filter.role } },
                    });
                }
                if (filter.invitationcode) {
                    criteriaAnd.push({
                        ["invitationcode"]: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.invitationcode),
                            $options: "i",
                        },
                    });
                }
                if (filter.couponcode) {
                    criteriaAnd.push({
                        ["couponcode"]: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.couponcode),
                            $options: "i",
                        },
                    });
                }
                if (filter.status) {
                    criteriaAnd.push({
                        tenants: {
                            $elemMatch: { status: filter.status },
                        },
                    });
                }
                if (filter.createdAtRange) {
                    const [start, end] = filter.createdAtRange;
                    if (start !== undefined && start !== null && start !== "") {
                        criteriaAnd.push({
                            ["createdAt"]: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== "") {
                        criteriaAnd.push({
                            ["createdAt"]: {
                                $lte: end,
                            },
                        });
                    }
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_DESC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
            let rows = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("tenants.tenant")
                .populate("vip")
                .populate("product")
                .populate("prizes"), options);
            const count = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).countDocuments(criteria), options);
            rows = this._mapUserForTenantForRows(rows, currentTenant);
            rows = yield Promise.all(rows.map((row) => this._fillRelationsAndFileDownloadUrls(row, options)));
            return { rows, count };
        });
    }
    static filterIdInTenant(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.get(yield this.filterIdsInTenant([id], options), "[0]", null);
        });
    }
    static filterIdsInTenant(ids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || !ids.length) {
                return ids;
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let users = yield user_1.default(options.database)
                .find({
                _id: {
                    $in: ids,
                },
                tenants: {
                    $elemMatch: { tenant: currentTenant.id },
                },
            })
                .select(["_id"]);
            return users.map((user) => user._id);
        });
    }
    static cleanupForRelationships(userOrUsers) {
        if (!userOrUsers) {
            return userOrUsers;
        }
        if (Array.isArray(userOrUsers)) {
            return userOrUsers.map((user) => lodash_1.default.pick(user, ["_id", "id", "firstName", "lastName", "email"]));
        }
        return lodash_1.default.pick(userOrUsers, [
            "_id",
            "id",
            "firstName",
            "lastName",
            "email",
        ]);
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [
                {
                    tenants: {
                        $elemMatch: { tenant: currentTenant.id },
                    },
                },
            ];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                        {
                            fullName: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                        {
                            email: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort("fullName_ASC");
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            let users = yield user_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            users = this._mapUserForTenantForRows(users, currentTenant);
            const buildText = (user) => {
                if (!user.fullName) {
                    return user.email;
                }
                return `${user.fullName} <${user.email}>`;
            };
            return users.map((user) => ({
                id: user.id,
                label: buildText(user),
            }));
        });
    }
    static findByIdWithPassword(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findById(id).populate("tenants.tenant"), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database)
                .findById(id)
                .populate("tenants.tenant")
                .populate("vip")
                .populate("product")
                .populate("prizes"), options);
            if (!record) {
                throw new Error404_1.default();
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            if (!options || !options.bypassPermissionValidation) {
                if (!userTenantUtils_1.isUserInTenant(record, currentTenant.id)) {
                    throw new Error404_1.default();
                }
                record = this._mapUserForTenant(record, currentTenant);
            }
            record = yield this._fillRelationsAndFileDownloadUrls(record, options);
            return record;
        });
    }
    static findByIdMobile(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database)
                .findById(id)
                .populate("tenants.tenant")
                .populate("vip")
                .populate("product")
                .populate("prizes"), options);
            if (!record) {
                throw new Error404_1.default();
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            if (!options || !options.bypassPermissionValidation) {
                if (!userTenantUtils_1.isUserInTenant(record, currentTenant.id)) {
                    throw new Error404_1.default();
                }
                record = this._mapUserForTenantMobile(record, currentTenant);
            }
            record = yield this._fillRelationsAndFileDownloadUrls(record, options);
            return record;
        });
    }
    static checkRefcode(refcode, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkref = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findOne({
                refcode: refcode,
            }), options);
            if (!checkref) {
                return null;
            }
            return true;
        });
    }
    static findPassword(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findById(id).select("+password"), options);
            if (!record) {
                return null;
            }
            return record.password;
        });
    }
    static findByIdWithoutAvatar(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findById(id, options);
        });
    }
    static Destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default(options.database).deleteOne({ _id: id });
        });
    }
    /**
     * Finds the user by the password token if not expired.
     */
    static findByPasswordResetToken(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findOne({
                passwordResetToken: token,
                passwordResetTokenExpiresAt: { $gt: Date.now() },
            }), options);
        });
    }
    /**
     * Finds the user by the email verification token if not expired.
     */
    static findByEmailVerificationToken(token, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).findOne({
                emailVerificationToken: token,
                emailVerificationTokenExpiresAt: {
                    $gt: Date.now(),
                },
            }), options);
        });
    }
    static markEmailVerified(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            yield user_1.default(options.database).updateOne({ _id: id }, {
                emailVerified: true,
                updatedBy: currentUser.id,
            }, options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: id,
                action: auditLogRepository_1.default.UPDATE,
                values: {
                    emailVerified: true,
                },
            }, options);
            return true;
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).countDocuments(filter), options);
        });
    }
    /**
     * Normalize the user fields.
     */
    static _preSave(data) {
        if (data.firstName || data.lastName) {
            data.fullName = `${(data.firstName || "").trim()} ${(data.lastName || "").trim()}`.trim();
        }
        data.email = data.email ? data.email.trim() : null;
        data.firstName = data.firstName ? data.firstName.trim() : null;
        data.lastName = data.lastName ? data.lastName.trim() : null;
        return data;
    }
    /**
     * Maps the users data to show only the current tenant related info
     */
    static _mapUserForTenantForRows(rows, tenant) {
        if (!rows) {
            return rows;
        }
        return rows.map((record) => this._mapUserForTenant(record, tenant));
    }
    /**
     * Maps the user data to show only the current tenant related info
     */
    static _mapUserForTenant(user, tenant) {
        if (!user || !user.tenants) {
            return user;
        }
        const tenantUser = user.tenants.find((tenantUser) => tenantUser &&
            tenantUser.tenant &&
            String(tenantUser.tenant.id) === String(tenant.id));
        delete user.tenants;
        const status = tenantUser ? tenantUser.status : "active";
        const roles = tenantUser ? tenantUser.roles : ["member"];
        // If the user is only invited,
        // tenant members can only see its email
        const otherData = status === "active" ? user.toObject() : {};
        return Object.assign(Object.assign({}, otherData), { id: user.id, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, fullName: user.fullName, passportNumber: user.passportNumber, country: user.country, withdrawPassword: user.withdrawPassword, balance: user.balance, invitationcode: user.invitationcode, nationality: user.nationality, refcode: user.refcode, roles,
            status });
    }
    static _mapUserForTenantMobile(user, tenant) {
        if (!user || !user.tenants) {
            return user;
        }
        const tenantUser = user.tenants.find((tenantUser) => tenantUser &&
            tenantUser.tenant &&
            String(tenantUser.tenant.id) === String(tenant.id));
        // delete user.tenants;
        const status = "active";
        const roles = ["member"];
        // If the user is only invited,
        // tenant members can only see its email
        const otherData = status === "active" ? user.toObject() : {};
        return Object.assign(Object.assign({}, otherData), { id: user.id, email: user.email, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName, fullName: user.fullName, passportNumber: user.passportNumber, country: user.country, withdrawPassword: user.withdrawPassword, balance: user.balance, invitationcode: user.invitationcode, nationality: user.nationality, refcode: user.refcode, roles,
            status });
    }
    static findByRoleAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant1 = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [
                {
                    tenants: {
                        $elemMatch: { tenant: currentTenant1.id },
                    },
                },
            ];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                        {
                            fullName: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                        {
                            email: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort("fullName_ASC");
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            let users = yield user_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            users = this._mapUserForTenantForRows(users, currentTenant1);
            const buildText = (user) => {
                if (!user.fullName) {
                    return user.email;
                }
                return `${user.fullName} <${user.email}>`;
            };
            return users.map((user) => ({
                id: user.id,
                label: buildText(user),
            }));
        });
    }
    static _fillRelationsAndFileDownloadUrls(record, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject ? record.toObject() : record;
            if (output.tenants && output.tenants.length) {
                yield Promise.all(output.tenants.map((userTenant) => __awaiter(this, void 0, void 0, function* () {
                    userTenant.tenant.settings = yield settingsRepository_1.default.find(Object.assign({ currentTenant: userTenant.tenant }, options));
                })));
            }
            output.avatars = yield fileRepository_1.default.fillDownloadUrl(output.avatars);
            output.passportPhoto = yield fileRepository_1.default.fillDownloadUrl(output.passportPhoto);
            output.passportDocument = yield fileRepository_1.default.fillDownloadUrl(output.passportDocument);
            return output;
        });
    }
    static createFromSocial(provider, providerId, email, emailVerified, firstName, lastName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                email,
                emailVerified,
                providerId,
                provider,
                firstName,
                lastName,
            };
            data = this._preSave(data);
            let [user] = yield user_1.default(options.database).create([data], options);
            yield auditLogRepository_1.default.log({
                entityName: "user",
                entityId: user.id,
                action: auditLogRepository_1.default.CREATE,
                values: user,
            }, options);
            return this.findById(user.id, Object.assign(Object.assign({}, options), { bypassPermissionValidation: true }));
        });
    }
    static CountUser(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows = yield user_1.default(options.database).aggregate([
                { $group: { _id: null, count: { $sum: 1 } } },
            ]);
            return rows;
        });
    }
    static CountUsers(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield mongooseRepository_1.default.wrapWithSessionIfExists(user_1.default(options.database).countDocuments(), options);
            return count;
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=userRepository.js.map