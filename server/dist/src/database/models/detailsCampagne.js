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
        return database.model('detailsCampagne');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const DetailsCampagneSchema = new Schema({
        adherent: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        palier: {
            type: Schema.Types.ObjectId,
            ref: 'palier',
            required: true,
        },
        campagne: [{
                type: Schema.Types.ObjectId,
                ref: 'campagne',
            }],
        titre: {
            type: String,
            ref: 'campagne',
        },
        statutPay: {
            type: String,
            enum: [
                "paye",
                "non_paye",
                null
            ],
        },
        montant: {
            type: Number,
        },
        facture: [fileSchema_1.default],
        typePay: {
            type: String,
            enum: [
                "paymee",
                "cb",
                "virement",
                "especes",
                null
            ],
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
    DetailsCampagneSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    // DetailsCampagneSchema.index(
    //   { adherent: 1, tenant: 1 },
    //   {
    //     unique: true,
    //     partialFilterExpression: {
    //       adherent: { $type: 'objectId' },
    //     },
    //   },
    // );
    DetailsCampagneSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    DetailsCampagneSchema.set('toJSON', {
        getters: true,
    });
    DetailsCampagneSchema.set('toObject', {
        getters: true,
    });
    return database.model('detailsCampagne', DetailsCampagneSchema);
};
//# sourceMappingURL=detailsCampagne.js.map