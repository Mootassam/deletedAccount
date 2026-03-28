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
const Error400_1 = __importDefault(require("../errors/Error400"));
const mongooseRepository_1 = __importDefault(require("../database/repositories/mongooseRepository"));
const TransactionRepository_1 = __importDefault(require("../database/repositories/TransactionRepository"));
const notification_1 = __importDefault(require("../database/models/notification"));
class TransactionService {
    constructor(options) {
        this.options = options;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                yield this.checkSolde(data, Object.assign({}, this.options));
                const values = {
                    status: data.status,
                    user: data.user,
                    type: data.type,
                    amount: data.amount,
                    withdrawalMethod: data.withdrawalMethod,
                };
                const record = yield TransactionRepository_1.default.create(values, Object.assign(Object.assign({}, this.options), { session }));
                // For deposit transactions, create deposit_success notification
                if (data.type === 'deposit') {
                    yield this.updateUserBalance(data.user, data.amount, session, 'inc');
                    yield this.createNotification(data.user, record._id, 'deposit_success', // Changed to deposit_success
                    data.amount, Object.assign(Object.assign({}, this.options), { session }));
                }
                // For withdrawal transactions, deduct balance but DON'T create notification
                if (data.type === 'withdraw') {
                    yield this.updateUserBalance(data.user, data.amount, session, 'dec');
                    // No notification created for withdrawal on creation
                }
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, "mandat");
                throw error;
            }
        });
    }
    updateUserBalance(userId, amount, session, operation = 'inc') {
        return __awaiter(this, void 0, void 0, function* () {
            const User = this.options.database.model('user');
            const update = operation === 'inc'
                ? { $inc: { balance: parseFloat(amount) } }
                : { $inc: { balance: -parseFloat(amount) } };
            yield User.findByIdAndUpdate(userId, update, { session });
        });
    }
    createNotification(userId, transactionId, type, amount, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            yield notification_1.default(options.database).create([{
                    type,
                    status: 'unread',
                    user: userId,
                    transaction: transactionId,
                    amount: amount.toString(),
                    tenant: currentTenant.id,
                    createdBy: currentUser.id,
                }], options);
        });
    }
    checkSolde(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            if (!data) {
                throw new Error400_1.default(options.language, "validation.requiredAmount");
            }
            const amount = data.amount;
            const type = data.type;
            if (type === "withdraw") {
                // Check if bank details are provided instead of TRC20
                if (!currentUser.accountHolder ||
                    !currentUser.IbanNumber ||
                    !currentUser.bankName ||
                    !currentUser.ifscCode) {
                    throw new Error400_1.default(options.language, "validation.missingBankDetails");
                }
                if (currentUser.withdrawPassword == data.withdrawPassword) {
                    if (currentUser.balance < amount) {
                        throw new Error400_1.default(options.language, "validation.exceedsBalance");
                    }
                }
                else {
                    throw new Error400_1.default(options.language, "validation.inValidWithdrawPassword");
                }
            }
        });
    }
    updateTransactionStatus(transactionId, newStatus, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                const Transaction = this.options.database.model('transaction');
                const User = this.options.database.model('user');
                // Find the transaction with user data
                const transaction = yield Transaction.findById(transactionId)
                    .populate('user')
                    .session(session);
                if (!transaction) {
                    throw new Error400_1.default(this.options.language, "Transaction.notFoundTransaction");
                }
                const oldStatus = transaction.status;
                const amount = parseFloat(transaction.amount);
                // Update transaction status
                const updatedTransaction = yield Transaction.findByIdAndUpdate(transactionId, {
                    status: newStatus,
                    updatedBy: mongooseRepository_1.default.getCurrentUser(options).id
                }, { new: true, session });
                // Create notification based on transaction type and new status
                if (transaction.type === 'withdraw' && newStatus === 'success') {
                    // Only create withdraw_success notification for successful withdrawals
                    yield this.createNotification(transaction.user._id, transactionId, 'withdraw_success', // Created only when withdrawal is successful
                    transaction.amount, Object.assign(Object.assign({}, this.options), { session }));
                }
                else if (transaction.type === 'withdraw' && newStatus === 'canceled') {
                    // Create withdraw_canceled notification for canceled withdrawals
                    yield this.createNotification(transaction.user._id, transactionId, 'withdraw_canceled', transaction.amount, Object.assign(Object.assign({}, this.options), { session }));
                }
                else if (transaction.type === 'deposit' && newStatus === 'canceled') {
                    // Create deposit_canceled notification for canceled deposits
                    yield this.createNotification(transaction.user._id, transactionId, 'deposit_canceled', transaction.amount, Object.assign(Object.assign({}, this.options), { session }));
                }
                // Note: deposit_success is already created in the create method
                // Handle withdrawal transactions - only return money if canceled
                if (transaction.type === 'withdraw') {
                    // Case: Status changed to 'canceled' - return the amount
                    if (newStatus === 'canceled') {
                        yield User.findByIdAndUpdate(transaction.user._id, { $inc: { balance: amount } }, { session });
                    }
                    // Case: Status changed from 'canceled' to 'success' - deduct again
                    else if (oldStatus === 'canceled' && newStatus === 'success') {
                        yield User.findByIdAndUpdate(transaction.user._id, { $inc: { balance: -amount } }, { session });
                    }
                }
                yield mongooseRepository_1.default.commitTransaction(session);
                return updatedTransaction;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                throw error;
            }
        });
    }
    checkpermission(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            if (currentUser.withdraw)
                return;
            throw new Error400_1.default(this.options.language, "validation.permissoin");
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                const record = yield TransactionRepository_1.default.update(id, data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, "mandat");
                throw error;
            }
        });
    }
    destroyAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                for (const id of ids) {
                    yield TransactionRepository_1.default.destroy(id, Object.assign(Object.assign({}, this.options), { session }));
                }
                yield mongooseRepository_1.default.commitTransaction(session);
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return TransactionRepository_1.default.findById(id, this.options);
        });
    }
    findAllAutocomplete(search, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return TransactionRepository_1.default.findAllAutocomplete(search, limit, this.options);
        });
    }
    findAndCountAll(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return TransactionRepository_1.default.findAndCountAll(args, this.options);
        });
    }
    findAndCountByUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return TransactionRepository_1.default.findAndCountByUser(args, this.options);
        });
    }
    import(data, importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!importHash) {
                throw new Error400_1.default(this.options.language, "importer.errors.importHashRequired");
            }
            if (yield this._isImportHashExistent(importHash)) {
                throw new Error400_1.default(this.options.language, "importer.errors.importHashExistent");
            }
            const dataToCreate = Object.assign(Object.assign({}, data), { importHash });
            return this.create(dataToCreate);
        });
    }
    _isImportHashExistent(importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield TransactionRepository_1.default.count({
                importHash,
            }, this.options);
            return count > 0;
        });
    }
}
exports.default = TransactionService;
//# sourceMappingURL=transactionService.js.map