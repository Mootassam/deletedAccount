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
const product_1 = __importDefault(require("../models/product"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
const axios_1 = __importDefault(require("axios"));
const records_1 = __importDefault(require("../models/records"));
const Dates_1 = __importDefault(require("../utils/Dates"));
class ProductRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield product_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id }),
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static fetchKaggleData(dataConfig, value, titleIndex, imageIndex) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://www.kaggle.com/api/i/datasets.DatasetService/GetDataViewExternal";
            try {
                const response = yield axios_1.default.post(url, dataConfig, { headers: this.baseConfig });
                // The actual data is nested under dataView.dataRaw
                const dataRaw = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.dataView) === null || _b === void 0 ? void 0 : _b.dataRaw;
                if (!dataRaw || !dataRaw.data) {
                    console.warn("No dataRaw found in response");
                    return [];
                }
                // Parse the JSON string
                let parsed;
                try {
                    parsed = JSON.parse(dataRaw.data);
                }
                catch (e) {
                    console.error("Failed to parse dataRaw.data as JSON", e);
                    return [];
                }
                // Extract the array of hotels – adjust the key if needed
                const hotels = parsed.airbnbHotels;
                if (!Array.isArray(hotels)) {
                    console.warn("parsed data does not contain airbnbHotels array");
                    return [];
                }
                // Map each hotel to your desired output format
                const values = hotels.map((item) => {
                    var _a;
                    return ({
                        // Use the first subtitle as the title, fallback to 'No Title'
                        title: ((_a = item.subtitles) === null || _a === void 0 ? void 0 : _a[0]) || 'No Title',
                        image: item.thumbnail || 'No Image',
                        commission: value.comisionrate,
                        vip: value.vipId,
                        amount: this.generateRandomPrice(value.min, value.max)
                    });
                });
                return values;
            }
            catch (error) {
                console.error('Error fetching data from Kaggle:', error);
                throw error;
            }
        });
    }
    static generateRandomPrice(minStr, maxStr) {
        const min = parseFloat(minStr);
        const max = parseFloat(maxStr);
        if (isNaN(min) || isNaN(max)) {
            return '0.00';
        }
        const randomPrice = (Math.random() * (max - min) + min).toFixed(2);
        return randomPrice;
    }
    // VIP 1 - Amazon Canada Products
    static Vip1(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                verificationInfo: {
                    datasetId: 3287722,
                    databundleVersionId: 5794156
                },
                firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Berlin.json"
            };
            return yield ProductRepository.fetchKaggleData(data, value, 1, 2);
        });
    }
    // VIP 2 - Home and Kitchen
    static Vip2(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                verificationInfo: {
                    datasetId: 3287722,
                    databundleVersionId: 5794156
                },
                firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/London.json",
            };
            return yield ProductRepository.fetchKaggleData(data, value, 1, 2);
        });
    }
    // VIP 3 - Car Parts
    // {datasetId: 3287722, databundleVersionId: 5794156}
    static Vip3(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                verificationInfo: {
                    datasetId: 3287722,
                    databundleVersionId: 5794156
                },
                firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Madrid.json",
            };
            return yield ProductRepository.fetchKaggleData(data, value, 1, 2);
        });
    }
    // VIP 4 - Air Conditioners
    static Vip4(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                verificationInfo: {
                    datasetId: 3287722,
                    databundleVersionId: 5794156
                },
                firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Paris.json",
            };
            return yield ProductRepository.fetchKaggleData(data, value, 1, 2);
        });
    }
    // VIP 5 - Grocery and Gourmet Foods
    static Vip5(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                verificationInfo: {
                    datasetId: 3287722,
                    databundleVersionId: 5794156
                },
                firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Rome.json",
            };
            return yield ProductRepository.fetchKaggleData(data, value, 1, 2);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(product_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield product_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(product_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield product_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(product_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(product_1.default(options.database).findById(id).populate("vip"), options);
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
                if (filter.amount) {
                    criteriaAnd.push({
                        amount: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.amount),
                            $options: "i",
                        },
                    });
                }
                if (filter.vip) {
                    criteriaAnd.push({
                        vip: filter.vip,
                    });
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || "createdAt_DESC");
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;
            let rows = yield product_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .populate("vip")
                .sort(sort);
            const count = yield product_1.default(options.database).countDocuments(criteria);
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
            const records = yield product_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.title,
            }));
        });
    }
    static findAllAutocompleteProduct(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [
                {
                    tenant: currentTenant.id,
                },
                {
                    // Filter by type: either "combo" OR "prizes"
                    type: {
                        $in: ["combo", "prizes"]
                    }
                }
            ];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                        {
                            title: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: "i",
                            },
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort("title_ASC");
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield product_1.default(options.database)
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
                entityName: product_1.default(options.database).modelName,
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
    static grapOrders(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const currentVip = currentUser.vip.id;
            const mergeDataPosition = currentUser.itemNumber;
            const giftPosition = currentUser.prizesNumber;
            if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.vip)) {
                throw new Error400_1.default(options.language, "validation.requiredSubscription");
            }
            // Check for pending orders
            const pendingRecords = yield records_1.default(options.database).find({
                user: currentUser.id,
                status: 'pending'
            });
            if (pendingRecords.length > 0) {
                throw new Error400_1.default(options.language, "validation.submitPendingProducts");
            }
            // Check daily order limit
            const dailyOrder = currentUser.vip.dailyorder;
            if (currentUser.tasksDone >= dailyOrder) {
                throw new Error400_1.default(options.language, "validation.moretasks");
            }
            // Check balance
            if (currentUser.balance <= 0 || currentUser.balance < currentUser.minbalance) {
                throw new Error400_1.default(options.language, "validation.deposit");
            }
            // Special VIP products
            if (((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser.product) === null || _a === void 0 ? void 0 : _a.length) > 0 && currentUser.tasksDone === (mergeDataPosition - 1)) {
                let product = currentUser.product[0];
                product.photo = yield fileRepository_1.default.fillDownloadUrl(product === null || product === void 0 ? void 0 : product.photo);
                return product;
            }
            else if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.prizes) && currentUser.tasksDone === (giftPosition - 1)) {
                let product = currentUser.prizes;
                product.photo = yield fileRepository_1.default.fillDownloadUrl(product === null || product === void 0 ? void 0 : product.photo);
                return product;
            }
            // -------------------------
            // Normal product selection
            // -------------------------
            let finalPrice;
            if (currentUser.vip.isFixedAmount) {
                // Use min/max as fixed price
                const vipMinPrice = parseFloat(currentUser.vip.min) || 20;
                const vipMaxPrice = parseFloat(currentUser.vip.max) || 50;
                const minPrice = Math.min(vipMinPrice, vipMaxPrice);
                const maxPrice = Math.max(vipMinPrice, vipMaxPrice);
                finalPrice = Math.random() * (maxPrice - minPrice) + minPrice;
            }
            else {
                // Use min/max as percentage of balance (existing logic)
                const vipMinPercentage = parseFloat(currentUser.vip.min) || 20;
                const vipMaxPercentage = parseFloat(currentUser.vip.max) || 50;
                const minPercent = Math.min(vipMinPercentage, vipMaxPercentage);
                const maxPercent = Math.max(vipMaxPercentage, vipMaxPercentage);
                const randomPercentage = Math.random() * (maxPercent - minPercent) + minPercent;
                finalPrice = (currentUser.balance * randomPercentage) / 100;
                if (finalPrice > currentUser.balance) {
                    throw new Error400_1.default(options.language, "validation.deposit");
                }
            }
            finalPrice = Math.round(finalPrice * 100) / 100;
            console.log("🚀 ~ ProductRepository ~ grapOrders ~ finalPrice:", finalPrice);
            // Get random normal product
            let products = yield product_1.default(options.database)
                .find({ vip: currentVip, type: 'normal' })
                .populate("vip");
            if (products.length === 0) {
                throw new Error400_1.default(options.language, "validation.noProductsAvailable");
            }
            const randomIndex = Math.floor(Math.random() * products.length);
            const selectedProduct = products[randomIndex];
            // Generate unique record number
            const today = new Date();
            const datePart = today.getFullYear().toString() +
                (today.getMonth() + 1).toString().padStart(2, '0') +
                today.getDate().toString().padStart(2, '0');
            const randomPart = Math.random().toString(36).substr(2, 8);
            const recordNumber = datePart + randomPart;
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const recordData = {
                number: recordNumber,
                product: selectedProduct.id,
                price: finalPrice.toString(),
                commission: selectedProduct === null || selectedProduct === void 0 ? void 0 : selectedProduct.commission,
                status: 'pending',
                user: currentUser.id,
                tenant: currentTenant.id,
                createdBy: currentUser.id,
                updatedBy: currentUser.id,
                date: Dates_1.default.getDate(),
                datecreation: Dates_1.default.getTimeZoneDate(),
            };
            // Save record
            let createdRecord;
            try {
                const [record] = yield records_1.default(options.database).create([recordData], options);
                createdRecord = record;
            }
            catch (error) {
                const RecordModel = options.database.model('records');
                createdRecord = yield RecordModel.create(recordData);
            }
            // Update user balance and freeze balance
            try {
                const UserModel = options.database.model('user');
                yield UserModel.findByIdAndUpdate(currentUser.id, {
                    $inc: {
                        balance: -finalPrice,
                        freezeblance: finalPrice,
                    },
                }, { new: true });
            }
            catch (balanceUpdateError) {
                throw new Error400_1.default(options.language, "validation.balanceUpdateFailed");
            }
            // Update product for return
            selectedProduct.amount = finalPrice.toString();
            selectedProduct.photo = yield fileRepository_1.default.fillDownloadUrl(selectedProduct === null || selectedProduct === void 0 ? void 0 : selectedProduct.photo);
            return selectedProduct;
        });
    }
}
ProductRepository.baseConfig = {
    "cookie": "_ga=GA1.1.1807754517.1763083251; ka_sessionid=5acf70c39073cdf7b663f7b375a2a692; CSRF-TOKEN=CfDJ8E2Nv-_xTuFMnx6IZ-XCV9ys_4oYgrTrS_L8vR36OB-kDQavyZvv3cJ7EiH2YvNgjfNGbRRa5E2xugFUcXRSDm3s_OURxgmz244AaODX2g; GCLB=CKbs1rGz6rLfngEQAw; build-hash=7b9eb83fb96933a086319a2af9654f2f0c6bc945; XSRF-TOKEN=CfDJ8E2Nv-_xTuFMnx6IZ-XCV9z93sTd2V_Hsm3muzlM2i71YvHlaQH6swWCYi2VY2ZuZGiSixZkSPTYZySpZiQGvP8T-OooMdK5utUcBdT68NR_kg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiIiLCJuYnQiOiIyMDI2LTAyLTE4VDE5OjA1OjU0LjQyNDY2MTJaIiwiaWF0IjoiMjAyNi0wMi0xOFQxOTowNTo1NC40MjQ2NjEyWiIsImp0aSI6IjI1YTJiMGNlLWMyNDEtNDRlMS04OGUzLTU3OWI2NTQyODZhMyIsImV4cCI6IjIwMjYtMDMtMThUMTk6MDU6NTQuNDI0NjYxMloiLCJhbm9uIjp0cnVlLCJmZmgiOiJmZjE1NmNlNjhjMDA3NDU1ZDIyZTlmNjBhYTEzMjhlZDU4NjA3MTQ3MjliZDc4MGNjYjZmZTdmNWI4ZmZmMWM1IiwicGlkIjoia2FnZ2xlLTE2MTYwNyIsInN2YyI6IndlYi1mZSIsInNkYWsiOiJBSXphU3lBNGVOcVVkUlJza0pzQ1pXVnotcUw2NTVYYTVKRU1yZUUiLCJibGQiOiI3YjllYjgzZmI5NjkzM2EwODYzMTlhMmFmOTY1NGYyZjBjNmJjOTQ1In0.; _ga_T7QHS60L4Q=GS2.1.s1771441515$o3$g1$t1771441554$j21$l0$h0",
    "origin": "https://www.kaggle.com",
    "referer": "https://www.kaggle.com/datasets/robintomar11/hoelsdatasets",
    "x-kaggle-build-version": "7b9eb83fb96933a086319a2af9654f2f0c6bc945",
    "Content-Type": "application/json",
    "x-xsrf-token": "CfDJ8E2Nv-_xTuFMnx6IZ-XCV9z93sTd2V_Hsm3muzlM2i71YvHlaQH6swWCYi2VY2ZuZGiSixZkSPTYZySpZiQGvP8T-OooMdK5utUcBdT68NR_kg"
};
exports.default = ProductRepository;
//# sourceMappingURL=productRepository.js.map