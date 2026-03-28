"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('votes');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const VotesSchema = new Schema({
        adherent: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        votes: {
            type: Number,
            required: true,
            max: 5,
        },
        projet: {
            type: Schema.Types.ObjectId,
            ref: 'projet',
        },
        titre: {
            type: String,
            ref: 'projet',
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
    VotesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    VotesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    VotesSchema.set('toJSON', {
        getters: true,
    });
    VotesSchema.set('toObject', {
        getters: true,
    });
    return database.model('votes', VotesSchema);
};
//# sourceMappingURL=votes.js.map