"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('produitCommande');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ProduitCommandeSchema = new Schema({
        adherent: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        attachements: [fileSchema_1.default],
        delivered: {
            type: Boolean,
            default: false
        },
        commandLine: [{
                type: Schema.Types.ObjectId,
                ref: 'commandLine',
                required: true,
            }],
        product: [{
                type: Schema.Types.ObjectId,
                ref: 'produit',
            }],
        total: {
            type: Number,
            required: true,
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'tenant',
            required: true
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
    ProduitCommandeSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ProduitCommandeSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ProduitCommandeSchema.set('toJSON', {
        getters: true,
    });
    ProduitCommandeSchema.set('toObject', {
        getters: true,
    });
    return database.model('produitCommande', ProduitCommandeSchema);
};
//# sourceMappingURL=produitCommande.js.map