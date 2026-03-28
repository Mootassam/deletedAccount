"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('produitCategorie');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ProduitCategorieSchema = new Schema({
        titre: {
            type: String,
            required: true,
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'tenant',
        },
        produit: [{
                type: Schema.Types.ObjectId,
                ref: 'produit',
                required: true,
            }],
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
    ProduitCategorieSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ProduitCategorieSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ProduitCategorieSchema.set('toJSON', {
        getters: true,
    });
    ProduitCategorieSchema.set('toObject', {
        getters: true,
    });
    return database.model('produitCategorie', ProduitCategorieSchema);
};
//# sourceMappingURL=produitCategorie.js.map