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
const vip_1 = __importDefault(require("../models/vip"));
const productRepository_1 = __importDefault(require("./productRepository"));
const product_1 = __importDefault(require("../models/product"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
class VipRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            // Create VIP record
            const [record] = yield vip_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id }),
            ], options);
            const items = {
                vipId: record.id,
                comisionrate: record.comisionrate,
                min: record.min,
                max: record.max,
            };
            // Count total VIPs
            const totalVip = yield VipRepository.count({}, options);
            // Mapping between totalVip and corresponding function
            const vipMap = {
                1: productRepository_1.default.Vip1,
                2: productRepository_1.default.Vip2,
                3: productRepository_1.default.Vip3,
                4: productRepository_1.default.Vip4,
                5: productRepository_1.default.Vip5,
            };
            const vipHandler = vipMap[totalVip];
            if (vipHandler) {
                const values = (yield vipHandler(items)) || [];
                // Run product creations in parallel for better performance
                yield Promise.all(values.map((item) => productRepository_1.default.create(Object.assign(Object.assign({}, item), { tenant: currentTenant.id }), options)));
            }
            // Log creation
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            // Return created record with details
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(vip_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            // Check if min or max values are being updated
            const minChanged = data.min !== undefined && data.min !== record.min;
            const maxChanged = data.max !== undefined && data.max !== record.max;
            const priceRangeChanged = minChanged || maxChanged;
            // Update the VIP record
            yield vip_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            // If price range changed, update all products for this VIP
            if (priceRangeChanged) {
                // Use the new values if provided, otherwise use the existing ones
                const finalMin = data.min !== undefined ? data.min : record.min;
                const finalMax = data.max !== undefined ? data.max : record.max;
                yield this.updateProductPricesForVip(id, finalMin, finalMax, options);
            }
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    /**
     * Update all product prices for a specific VIP with new min/max range
     */
    static updateProductPricesForVip(vipId, newMin, newMax, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find all products for this VIP - await the query and wrap with session if exists
                const products = yield mongooseRepository_1.default.wrapWithSessionIfExists(product_1.default(options.database).find({ vip: vipId }), options);
                if (!products || products.length === 0) {
                    return;
                }
                // Update each product with new random price based on new range
                const updatePromises = products.map((product) => __awaiter(this, void 0, void 0, function* () {
                    const newPrice = yield this.generateRandomPriceForProduct(newMin, newMax);
                    return product_1.default(options.database).updateOne({ _id: product._id }, {
                        amount: newPrice,
                        updatedBy: mongooseRepository_1.default.getCurrentUser(options).id
                    }, options);
                }));
                yield Promise.all(updatePromises);
            }
            catch (error) {
                console.error(`Error updating product prices for VIP ${vipId}:`, error);
                throw error;
            }
        });
    }
    static generateRandomPriceForProduct(minStr, maxStr) {
        return __awaiter(this, void 0, void 0, function* () {
            const min = parseFloat(minStr);
            const max = parseFloat(maxStr);
            if (isNaN(min) || isNaN(max)) {
                throw new Error400_1.default(undefined, 'validation.invalidPriceRange');
            }
            // Ensure min is not greater than max
            const actualMin = Math.min(min, max);
            const actualMax = Math.max(min, max);
            const randomPrice = (Math.random() * (actualMax - actualMin) + actualMin).toFixed(2);
            return randomPrice;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(vip_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield vip_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(vip_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(vip_1.default(options.database).findById(id).populate("members"), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            return this._fillFileDownloadUrls(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
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
                if (filter.title) {
                    criteriaAnd.push({
                        title: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.title),
                            $options: "i",
                        },
                    });
                }
                if (filter.levellimit) {
                    criteriaAnd.push({
                        levellimit: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.levellimit),
                            $options: "i",
                        },
                    });
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_ASC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
            let rows = yield vip_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("members");
            const count = yield vip_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._fillFileDownloadUrls));
            return { rows, count };
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
            const records = yield vip_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.title,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: vip_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _fillFileDownloadUrls(record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject ? record.toObject() : record;
            output.photo = yield fileRepository_1.default.fillDownloadUrl(output.photo);
            return output;
        });
    }
}
exports.default = VipRepository;
//# sourceMappingURL=vipRepository.js.map