"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const permissionChecker_1 = __importDefault(require("../../services/user/permissionChecker"));
const permissions_1 = __importDefault(require("../../security/permissions"));
const apiResponseHandler_1 = __importDefault(require("../apiResponseHandler"));
const userRepository_1 = __importDefault(require("../../database/repositories/userRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new permissionChecker_1.default(req).validateHas(permissions_1.default.values.userCreate);
        const { userId } = req.body;
        const payload = yield userRepository_1.default.findById(userId, req);
        // 🔑 Generate a short-lived token for impersonation
        const token = jsonwebtoken_1.default.sign({ id: payload.id }, config_1.getConfig().AUTH_JWT_SECRET, { expiresIn: config_1.getConfig().AUTH_JWT_EXPIRES_IN });
        yield apiResponseHandler_1.default.success(req, res, { token });
    }
    catch (error) {
        yield apiResponseHandler_1.default.error(req, res, error);
    }
});
//# sourceMappingURL=OneClickLogin.js.map