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
        return database.model('mouvements');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const MouvementsSchema = new Schema({
        typeMouv: {
            type: String,
            required: true,
            enum: [
                "entree",
                "sortie"
            ],
        },
        categorie: {
            type: Schema.Types.ObjectId,
            ref: 'categorieMouv',
            required: true,
        },
        titre: {
            type: String,
            required: true,
        },
        montant: {
            type: Number,
            required: true,
        },
        attachements: [fileSchema_1.default],
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
    MouvementsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    MouvementsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    MouvementsSchema.set('toJSON', {
        getters: true,
    });
    MouvementsSchema.set('toObject', {
        getters: true,
    });
    return database.model('mouvements', MouvementsSchema);
};
//# sourceMappingURL=mouvements.js.map