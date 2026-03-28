"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('categorieMouv');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CategorieMouvSchema = new Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
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
    CategorieMouvSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    CategorieMouvSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CategorieMouvSchema.set('toJSON', {
        getters: true,
    });
    CategorieMouvSchema.set('toObject', {
        getters: true,
    });
    return database.model('categorieMouv', CategorieMouvSchema);
};
//# sourceMappingURL=categorieMouv.js.map