"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('association');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const AssociationSchema = new Schema({
        nom: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        adresse: {
            type: String,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
        },
        tva: {
            type: String,
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'tenant',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        importHash: { type: String },
    }, { timestamps: true });
    AssociationSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    AssociationSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    AssociationSchema.set('toJSON', {
        getters: true,
    });
    AssociationSchema.set('toObject', {
        getters: true,
    });
    return database.model('association', AssociationSchema);
};
//# sourceMappingURL=association.js.map