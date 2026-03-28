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
const votes_1 = __importDefault(require("../models/votes"));
const projet_1 = __importDefault(require("../models/projet"));
const mongoose_1 = __importDefault(require("mongoose"));
class VotesRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const rows = yield this.extractIds(data.projet, options);
            if (rows.count > 0) {
                try {
                    for (const id of rows.record) {
                        yield VotesRepository.destroy(id, options);
                    }
                }
                catch (error) {
                    throw error;
                }
            }
            const [record] = yield votes_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id }),
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            yield mongooseRepository_1.default.refreshTwoWayRelationOneToMany(record, "projet", projet_1.default(options.database), "votes", options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(votes_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield votes_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            yield mongooseRepository_1.default.refreshTwoWayRelationOneToMany(record, "projet", projet_1.default(options.database), "votes", options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(votes_1.default(options.database).findById(id), options);
            if (!record || String(record.tenant) !== String(currentTenant.id)) {
                throw new Error404_1.default();
            }
            yield votes_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, projet_1.default(options.database), "votes", options);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(votes_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(votes_1.default(options.database).findById(id).populate("adherent"), options);
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
            let idprojet = new mongoose_1.default.Types.ObjectId(filter.projet);
            criteriaAnd.push({
                tenant: currentTenant.id,
                projet: idprojet,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ["_id"]: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.projet) {
                    criteriaAnd.push({
                        projet: idprojet,
                    });
                }
                if (filter.adherent) {
                    criteriaAnd.push({
                        adherent: mongooseQueryUtils_1.default.uuid(filter.adherent),
                    });
                }
                if (filter.votesRange) {
                    const [start, end] = filter.votesRange;
                    if (start !== undefined && start !== null && start !== "") {
                        criteriaAnd.push({
                            votes: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== "") {
                        criteriaAnd.push({
                            votes: {
                                $lte: end,
                            },
                        });
                    }
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
            let rows = yield votes_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate("adherent");
            const count = yield votes_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._fillFileDownloadUrls));
            return { rows, count };
        });
    }
    static findVotesAndCountAll({ filter, limit = 0, offset = 0, orderBy = "" }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            let iduser = new mongoose_1.default.Types.ObjectId(filter.iduser);
            criteriaAnd.push({
                tenant: currentTenant.id,
                adherent: iduser,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ["_id"]: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.votesRange) {
                    const [start, end] = filter.votesRange;
                    if (start !== undefined && start !== null && start !== "") {
                        criteriaAnd.push({
                            votes: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== "") {
                        criteriaAnd.push({
                            votes: {
                                $lte: end,
                            },
                        });
                    }
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
            let rows = yield votes_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort);
            const count = yield votes_1.default(options.database).countDocuments(criteria);
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
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort("id_ASC");
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield votes_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.id,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: votes_1.default(options.database).modelName,
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
            return output;
        });
    }
    // !api for mobile   //
    // !list Dons for the currentUser //
    static extractIds(Projectid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUSer = mongooseRepository_1.default.getCurrentUser(options);
            const record = yield votes_1.default(options.database).find({
                adherent: currentUSer.id,
                projet: Projectid,
            }, { id: 1 });
            const count = yield votes_1.default(options.database)
                .find({
                adherent: currentUSer.id,
                projet: Projectid,
            }, { id: 1 })
                .countDocuments();
            return { record, count };
        });
    }
    static findVotes(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUSer = mongooseRepository_1.default.getCurrentUser(options);
            const record = yield votes_1.default(options.database).find({
                adherent: currentUSer.id,
            }, { titre: 1, votes: 1 });
            const count = yield votes_1.default(options.database)
                .find({
                adherent: currentUSer.id,
            }, { titre: 1, votes: 1 })
                .countDocuments();
            return { record, count };
        });
    }
}
exports.default = VotesRepository;
//# sourceMappingURL=votesRepository.js.map