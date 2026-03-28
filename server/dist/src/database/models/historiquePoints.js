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
        return database.model('historiquePoints');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const HistoriquePointsSchema = new Schema({
        adherent: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        commentaire: {
            type: String,
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
    HistoriquePointsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    HistoriquePointsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    HistoriquePointsSchema.set('toJSON', {
        getters: true,
    });
    HistoriquePointsSchema.set('toObject', {
        getters: true,
    });
    return database.model('historiquePoints', HistoriquePointsSchema);
};
//# sourceMappingURL=historiquePoints.js.map