"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ProductCommandSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'produit',
    },
    quantity: {
        type: Number,
    },
    subTotal: {
        type: Number,
    },
    productTitle: {
        type: String,
    },
}, { timestamps: true });
ProductCommandSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
});
ProductCommandSchema.set('toJSON', {
    getters: true,
});
ProductCommandSchema.set('toObject', {
    getters: true,
});
exports.default = ProductCommandSchema;
//# sourceMappingURL=productCommandSchema.js.map