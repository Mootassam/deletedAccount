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
        return database.model('mandat');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const MandatSchema = new Schema({
        titre: {
            type: String,
            required: true,
        },
        startdate: {
            type: String,
            required: true,
        },
        enddate: {
            type: Date,
            required: true,
        },
        pv: [fileSchema_1.default],
        members: [{
                type: Schema.Types.ObjectId,
                ref: 'user',
                required: true,
                min: 2,
            }],
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
    MandatSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    MandatSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    MandatSchema.set('toJSON', {
        getters: true,
    });
    MandatSchema.set('toObject', {
        getters: true,
    });
    return database.model('mandat', MandatSchema);
};
//# sourceMappingURL=mandat.js.map