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
const mongooseQueryUtils_1 = __importDefault(require("../utils/mongooseQueryUtils"));
const auditLogRepository_1 = __importDefault(require("./auditLogRepository"));
const Error404_1 = __importDefault(require("../../errors/Error404"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const records_1 = __importDefault(require("../models/records"));
const Dates_1 = __importDefault(require("../utils/Dates"));
const product_1 = __importDefault(require("../models/product"));
const userRepository_1 = __importDefault(require("./userRepository"));
const user_1 = __importDefault(require("../models/user"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
class RecordRepository {
    static create(data, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { database } = options;
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const mergeDataPosition = currentUser.itemNumber;
            const prizesPosition = currentUser.prizesNumber;
            const isPrizesMatch = currentUser.tasksDone === (prizesPosition - 1);
            // Execute parallel checks
            yield Promise.all([
                this.checkOrder(options),
                this.calculeGrap(data, options)
            ]);
            // Calculate position conditions
            const hasProduct = (_b = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.product) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id;
            const isPositionMatch = currentUser.tasksDone === (mergeDataPosition - 1);
            const hasPrizes = (_c = currentUser === null || currentUser === void 0 ? void 0 : currentUser.prizes) === null || _c === void 0 ? void 0 : _c.id;
            // COMBO MODE
            if (hasProduct && isPositionMatch) {
                // Create record for each product in user's product array
                const recordDataArray = currentUser.product.map((productId, index) => {
                    return {
                        number: `${data.number}-${index}`,
                        product: productId,
                        price: productId === null || productId === void 0 ? void 0 : productId.amount,
                        commission: productId === null || productId === void 0 ? void 0 : productId.commission,
                        user: data.user || currentUser.id,
                        status: index === 0 ? (data.status || "pending") : "frozen",
                        tenant: currentTenant.id,
                        createdBy: currentUser.id,
                        updatedBy: currentUser.id,
                        date: Dates_1.default.getDate(),
                        datecreation: Dates_1.default.getTimeZoneDate(),
                    };
                });
                const records = yield records_1.default(database).create(recordDataArray, options);
                // Update user tasksDone for combo products
                yield user_1.default(database).updateOne({ _id: currentUser.id }, {
                    $inc: { tasksDone: currentUser.product.length },
                    $set: { updatedAt: new Date(), updatedBy: currentUser.id }
                });
                // Audit logs
                records.forEach(record => {
                    this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options).catch(console.error);
                });
                return this.findById(records[0].id, options);
            }
            // PRIZES MODE
            else if (hasPrizes && isPrizesMatch) {
                const bulkOps = [
                    {
                        updateOne: {
                            filter: { _id: currentUser.id },
                            update: {
                                $inc: { tasksDone: 1 },
                                $set: { updatedAt: new Date() }
                            }
                        }
                    }
                ];
                const recordData = Object.assign(Object.assign({}, data), { price: hasPrizes === null || hasPrizes === void 0 ? void 0 : hasPrizes.amount, commission: hasPrizes === null || hasPrizes === void 0 ? void 0 : hasPrizes.commission, tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id, date: Dates_1.default.getDate(), datecreation: Dates_1.default.getTimeZoneDate() });
                const [record] = yield records_1.default(database).create([recordData], options);
                // Reset user's prizes and prizesNumber after creating the record
                yield user_1.default(database).updateOne({ _id: currentUser.id }, {
                    $set: {
                        prizes: null,
                        prizesNumber: 0,
                        tasksDone: currentUser.tasksDone + 1,
                        updatedAt: new Date(),
                        updatedBy: currentUser.id,
                    }
                });
                // Audit log for prize creation
                yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, recordData, options);
                return this.findById(record.id, options);
            }
            else {
                // NORMAL MODE - Don't create new record, update existing pending one
                // Find the pending record for this user
                const pendingRecord = yield records_1.default(database).findOne({
                    tenant: currentTenant.id,
                    user: currentUser.id,
                    status: 'pending'
                });
                if (!pendingRecord) {
                    throw new Error400_1.default(options.language, "validation.noPendingRecord");
                }
                // Populate product to get price
                yield pendingRecord.populate('product');
                // Get the price from the pending record
                const recordPrice = parseFloat(pendingRecord.price) || 0;
                // Calculate new balance: current balance + frozen balance
                const currentBalance = parseFloat(currentUser.balance) || 0;
                const frozenBalance = parseFloat(currentUser.freezeblance) || 0;
                const commissionPercent = parseFloat(pendingRecord.commission) || 0;
                // Calculate profit
                const profit = Number(((commissionPercent / 100) * recordPrice).toFixed(2));
                // Current balances
                // New balance = balance + frozen + profit
                const newBalance = currentBalance + frozenBalance + profit;
                // Update the pending record to completed
                pendingRecord.status = data.status || "completed";
                pendingRecord.updatedBy = currentUser.id;
                pendingRecord.updatedAt = new Date();
                yield pendingRecord.save();
                // Update user: add frozen balance to balance, reset frozen balance, increment tasksDone
                yield user_1.default(database).updateOne({ _id: currentUser.id }, {
                    $set: {
                        balance: newBalance,
                        freezeblance: 0
                    },
                    $inc: {
                        tasksDone: 1
                    },
                    updatedBy: currentUser.id,
                    updatedAt: new Date()
                });
                // Create audit log for the update
                yield this._createAuditLog(auditLogRepository_1.default.UPDATE, pendingRecord.id, { status: data.status || "completed" }, options);
                return this.findById(pendingRecord.id, options);
            }
        });
    }
    static calculeGrap(data, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { database } = options;
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // Parallel database calls
            const [currentProduct, orderCount] = yield Promise.all([
                product_1.default(database).findById(data.product).lean(),
                this.CountOrder(options)
            ]);
            if (!currentProduct) {
                throw new Error400_1.default(options.language, 'validation.productNotFound');
            }
            const currentUserBalance = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.balance) || 0;
            const productBalance = currentProduct.amount;
            const currentCommission = currentProduct.commission;
            const mergeDataPosition = currentUser.itemNumber;
            const prizesPosition = currentUser.prizesNumber;
            let total, frozen, status;
            // Cache user product check
            const hasProduct = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.product[0]) === null || _a === void 0 ? void 0 : _a.id;
            const isPositionMatch = currentUser.tasksDone === (mergeDataPosition - 1);
            const hasPrizes = (_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser.prizes) === null || _b === void 0 ? void 0 : _b.id;
            const isPrizesMatch = currentUser.tasksDone === (prizesPosition - 1);
            if (hasProduct && isPositionMatch) {
                let comboprice = 0;
                if (currentUser.product && Array.isArray(currentUser.product)) {
                    currentUser.product.forEach((item) => {
                        comboprice += parseFloat(item.amount) || 0;
                    });
                }
                total = Number(currentUserBalance) - Number(comboprice);
                frozen = Number(currentUserBalance);
                status = "pending";
            }
            else if (hasPrizes && isPrizesMatch) {
                total = Number(currentUserBalance) + Number(productBalance);
                status = "completed";
            }
            else {
                // Check if referral system is enabled for this user
                if (currentUser.refsystem === true) {
                    // Get company settings to fetch defaultCommission
                    const Company = database.model('company');
                    const companySettings = yield Company.findOne().lean();
                    // Use defaultCommission from company settings, fallback to 0.20 if not found
                    const defaultCommission = (companySettings === null || companySettings === void 0 ? void 0 : companySettings.defaultCommission) || 0.15;
                    // Find invited user (the person who referred current user)
                    const invitedUser = yield user_1.default(database).findOne({
                        refcode: currentUser.invitationcode
                    }).lean();
                    if (invitedUser) {
                        // Calculate commission for referrer based on company defaultCommission
                        const commissionAmount = Number(currentCommission) * defaultCommission;
                        yield user_1.default(database).updateOne({ _id: invitedUser._id }, {
                            $inc: { balance: commissionAmount },
                            $set: { updatedAt: new Date() }
                        });
                    }
                }
                // Calculate commission for current user (always apply this part)
                const commission = (parseFloat(currentCommission) / 100) * parseFloat(data.price);
                total = Number(currentUserBalance) + commission;
                frozen = 0;
            }
            const updatedValues = {
                balance: total,
                freezeblance: frozen,
                updatedAt: new Date()
            };
            yield userRepository_1.default.updateProfileGrap(currentUser.id, updatedValues, options);
        });
    }
    static checkOrderCombo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const currentDate = this.getTimeZoneDate(); // Get current date
            const record = yield records_1.default(options.database)
                .find({
                user: currentUser.id,
                // Compare dates in the same format
                datecreation: { $in: Dates_1.default.getTimeZoneDate() },
            })
                .countDocuments();
            const dailyOrder = currentUser.vip.dailyorder;
            const mergeDataPosition = currentUser.itemNumber;
            if (currentUser && currentUser.vip && currentUser.vip.id) {
                if (currentUser.tasksDone >= dailyOrder) {
                    throw new Error400_1.default(options.language, "validation.moretasks");
                }
                if (currentUser.balance <= 0) {
                    throw new Error400_1.default(options.language, "validation.InsufficientBalance");
                }
                // if (currentUser.balance <= 49) {
                //     throw new Error405("Your account must have a minimum balance of 50 USDT.");
                //   }
            }
            else {
                throw new Error400_1.default(options.language, "validation.requiredSubscription");
            }
        });
    }
    // Utility functions with validation
    static calculeTotal(price, commission) {
        const numPrice = Number(price);
        const numCommission = Number(commission);
        if (isNaN(numPrice) || isNaN(numCommission)) {
            throw new Error400_1.default(undefined, 'validation.invalidPriceOrCommission');
        }
        return (numPrice * numCommission) / 100;
    }
    static calculeTotalMerge(price, commission) {
        const numPrice = Number(price);
        const numCommission = Number(commission);
        if (isNaN(numPrice) || isNaN(numCommission)) {
            throw new Error400_1.default(undefined, 'validation.invalidPriceOrCommission');
        }
        return numPrice + (numPrice * numCommission) / 100;
    }
    static CountOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const currentDate = Dates_1.default.getTimeZoneDate();
            const record = yield records_1.default(options.database)
                .countDocuments({
                user: currentUser.id,
                datecreation: currentDate
            });
            return { record };
        });
    }
    static tasksDone(currentUser, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default(options.database)
                .findById(currentUser)
                .select('tasksDone')
                .lean();
            if (!user) {
                throw new Error400_1.default(options.language, 'validation.userNotFound');
            }
            return { record: user.tasksDone || 0 };
        });
    }
    static checkOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const currentDate = Dates_1.default.getTimeZoneDate();
            // Use Promise.all for parallel execution
            const [recordCount, userVip] = yield Promise.all([
                records_1.default(options.database).countDocuments({
                    user: currentUser.id,
                    datecreation: currentDate
                }),
                // Get fresh VIP data to ensure accuracy
                user_1.default(options.database)
                    .findById(currentUser.id)
                    .select('vip balance tasksDone')
                    .lean()
            ]);
            if (!(userVip === null || userVip === void 0 ? void 0 : userVip.vip)) {
                throw new Error400_1.default(options.language, "validation.requiredSubscription");
            }
            const dailyOrder = userVip.vip.dailyorder;
            if (userVip.tasksDone >= dailyOrder) {
                throw new Error400_1.default(options.language, "validation.moretasks");
            }
            if (userVip.balance <= 0) {
                throw new Error400_1.default(options.language, "validation.InsufficientBalance");
            }
        });
    }
    static getTimeZoneDate() {
        const dubaiTimezone = "Asia/Dubai";
        const options = {
            timeZone: dubaiTimezone,
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        };
        const currentDateTime = new Date().toLocaleDateString("en-US", options);
        return currentDateTime;
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(records_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield records_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static updateStatus(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const session = options === null || options === void 0 ? void 0 : options.session;
            // Start transaction if session is provided
            if (session) {
                session.startTransaction();
            }
            try {
                // Fetch the current user with product details
                const user = yield user_1.default(options.database)
                    .findById(currentUser.id)
                    .populate('product') // Populate product details to get commission
                    .session(session || null);
                if (!user) {
                    throw new Error404_1.default();
                }
                // Check if user has sufficient balance (not 0 or negative)
                const currentBalance = parseFloat(user.balance) || 0;
                if (currentBalance <= 0) {
                    throw new Error400_1.default(options.language, 'validation.deposit');
                }
                // Find ALL records that need to be completed (both pending AND frozen)
                const recordsToComplete = yield records_1.default(options.database)
                    .find({
                    tenant: currentTenant.id,
                    user: currentUser.id,
                    status: { $in: ['pending', 'frozen'] } // Include both statuses
                })
                    .populate('product') // Populate to get product details
                    .session(session || null);
                if (!recordsToComplete || recordsToComplete.length === 0) {
                    throw new Error400_1.default(options.language, 'validation.noRecordsToComplete');
                }
                // Update ALL pending and frozen records to completed
                yield records_1.default(options.database).updateMany({
                    tenant: currentTenant.id,
                    user: currentUser.id,
                    status: { $in: ['pending', 'frozen'] }
                }, {
                    status: 'completed',
                    updatedBy: currentUser.id,
                    updatedAt: new Date()
                }, Object.assign({ session }, options));
                // COMMON LOGIC: Add frozen balance to balance and reset frozen balance
                const frozenBalance = parseFloat(user.freezeblance) || 0;
                const newBalance = currentBalance + frozenBalance;
                // Now handle the specific logic based on whether user has products
                if (user.product && Array.isArray(user.product) && user.product.length > 0) {
                    // USER HAS PRODUCTS: Calculate commission from products
                    const productIds = user.product.map(product => product._id || product);
                    // Filter records that belong to user's products (both pending and frozen)
                    const productRecords = recordsToComplete.filter(record => { var _a, _b, _c; return productIds.includes(((_b = (_a = record.product) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || ((_c = record.product) === null || _c === void 0 ? void 0 : _c.toString())); });
                    let totalCommission = 0;
                    // Calculate commission from ALL product records (both pending and frozen)
                    for (const record of productRecords) {
                        if (record.product && record.product.amount && record.product.commission) {
                            const recordCommission = this.calculeTotal(record.product.amount, record.product.commission);
                            totalCommission += recordCommission;
                        }
                        else if (record.product && record.product.type === "prizes" && record.product.amount) {
                            totalCommission += parseFloat(record.product.amount) || 0;
                        }
                    }
                    // Add commission to the new balance
                    const finalBalance = newBalance + totalCommission;
                    // Update user: clear products, reset itemNumber, update balance with commission
                    yield user_1.default(options.database).updateOne({ _id: currentUser.id }, {
                        $set: {
                            product: [],
                            itemNumber: 0,
                            balance: finalBalance,
                            freezeblance: 0 // Reset frozen balance to 0
                        },
                        $inc: {
                            tasksDone: productRecords.length // Increment tasksDone by number of product records
                        },
                        updatedBy: currentUser.id,
                        updatedAt: new Date()
                    }, Object.assign({ session }, options));
                }
                else {
                    // USER HAS NO PRODUCTS: Just update balance without commission
                    // Filter only normal/pending records (not frozen ones from combo mode)
                    const normalRecords = recordsToComplete.filter(record => { var _a; return record.status === 'pending' || !((_a = record.product) === null || _a === void 0 ? void 0 : _a.type) || record.product.type === 'normal'; });
                    yield user_1.default(options.database).updateOne({ _id: currentUser.id }, {
                        $set: {
                            balance: newBalance,
                            freezeblance: 0 // Reset frozen balance to 0
                        },
                        $inc: {
                            tasksDone: normalRecords.length // Increment tasksDone by normal records count
                        },
                        updatedBy: currentUser.id,
                        updatedAt: new Date()
                    }, Object.assign({ session }, options));
                }
                // Commit transaction if started
                if (session) {
                    yield session.commitTransaction();
                }
                // Fire-and-forget audit logs for all completed records
                recordsToComplete.forEach(record => {
                    this._createAuditLog(auditLogRepository_1.default.UPDATE, record._id, {
                        status: 'completed',
                        previousStatus: record.status // Log what it was before
                    }, options).catch(console.error);
                });
                // Return first record
                return this.findById(recordsToComplete[0]._id, options);
            }
            catch (error) {
                // Abort transaction on error
                if (session) {
                    yield session.abortTransaction();
                }
                throw error;
            }
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(records_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield records_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(records_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(records_1.default(options.database)
                .findById(id)
                .populate("user")
                .populate("product"), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            return this._fillFileDownloadUrls(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: currentTenant.id,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ["_id"]: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.user) {
                    criteriaAnd.push({
                        user: filter.user,
                    });
                }
                if (filter.product) {
                    criteriaAnd.push({
                        product: filter.product,
                    });
                }
                if (filter.number) {
                    criteriaAnd.push({
                        number: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.number),
                            $options: "i",
                        },
                    });
                }
                if (filter.status) {
                    criteriaAnd.push({
                        status: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.status),
                            $options: "i",
                        },
                    });
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_DESC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
            let rows = yield records_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("user")
                .populate("product");
            const count = yield records_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._fillFileDownloadUrls));
            return { rows, count };
        });
    }
    static findAndCountAllMobile({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: currentTenant.id,
                user: currentUser.id,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ["_id"]: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.user) {
                    criteriaAnd.push({
                        user: filter.user,
                    });
                }
                if (filter.product) {
                    criteriaAnd.push({
                        product: filter.product,
                    });
                }
                if (filter.number) {
                    criteriaAnd.push({
                        number: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.number),
                            $options: "i",
                        },
                    });
                }
                if (filter.status) {
                    // ALWAYS: when status is "pending", return both "pending" and "frozen"
                    if (filter.status.toLowerCase() === "pending") {
                        criteriaAnd.push({
                            status: {
                                $in: ["pending", "frozen"] // Include both statuses
                            }
                        });
                    }
                    else {
                        // For other statuses ("completed", "frozen"), use exact match
                        criteriaAnd.push({
                            status: filter.status
                        });
                    }
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_DESC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
            let listitems = yield records_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .sort(sort)
                .populate("user")
                .populate("product");
            let rows = yield records_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort)
                .populate("user")
                .populate("product");
            const count = yield records_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._fillFileDownloadUrls));
            let total = 0;
            listitems.map((item) => {
                let data = item.product;
                let itemTotal = (parseFloat(data.commission) * parseFloat(data.amount)) / 100;
                total += itemTotal;
            });
            total = parseFloat(total.toFixed(3));
            return { rows, count, total };
        });
    }
    static findAndCountPerDay({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // Build criteria for the query
            const criteriaAnd = [
                { tenant: currentTenant.id },
                { user: currentUser.id },
                { status: "completed" } // only completed records
            ];
            // Set start and end of today
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            criteriaAnd.push({
                createdAt: { $gte: start, $lte: end },
            });
            const criteria = { $and: criteriaAnd };
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_DESC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            // Fetch the records
            const records = yield records_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("user")
                .populate("product");
            // Calculate daily profit
            let totalProfit = 0;
            for (const record of records) {
                const price = parseFloat(record.price || "0"); // convert price to number
                const commission = parseFloat(record.commission || "0"); // convert commission to number
                // Calculate profit = (price * commission%) / 100
                const profit = (price * commission) / 100;
                totalProfit += profit;
            }
            totalProfit = parseFloat(totalProfit.toFixed(3));
            return { total: totalProfit };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [
                {
                    tenant: currentTenant.id,
                },
            ];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                        {
                            titre: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort("titre_ASC");
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield records_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.titre,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: records_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _fillFileDownloadUrls(record) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject ? record.toObject() : record;
            output.product.photo = yield fileRepository_1.default.fillDownloadUrl((_a = output === null || output === void 0 ? void 0 : output.product) === null || _a === void 0 ? void 0 : _a.photo);
            return output;
        });
    }
}
exports.default = RecordRepository;
//# sourceMappingURL=recordRepository.js.map