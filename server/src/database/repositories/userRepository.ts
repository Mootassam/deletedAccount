import MongooseRepository from "./mongooseRepository";
import User from "../models/user";
import AuditLogRepository from "./auditLogRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import FileRepository from "./fileRepository";
import crypto from "crypto";
import Error404 from "../../errors/Error404";
import SettingsRepository from "./settingsRepository";
import { isUserInTenant } from "../utils/userTenantUtils";
import { IRepositoryOptions } from "./IRepositoryOptions";
import lodash from "lodash";
import product from "../models/product";
import VipRepository from "./vipRepository";
import Vip from "../models/vip";
import Error400 from "../../errors/Error400";
import axios from 'axios'
import company from "../models/company";


interface ReferralUserData {
  memberId: number;
  recharge: number;
  withdraw: number;
  totalProfit: number; // Their total profit from records
}

interface ReferralSummary {
  totalDailyInvitations: number;
  totalMonthlyInvitations: number;
  totalMonthlyIncome: number; // This will be calculated based on defaultCommission
  referrals: ReferralUserData[];
}


export default class UserRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    data = this._preSave(data);

    const [user] = await User(options.database).create(
      [
        {
          email: data.email,
          fullName: data.fullName || null,
          phoneNumber: data.phoneNumber || null,
          country: data.country || null,
          nationality: data.nationality || null,
          passportPhoto: data.passportPhoto || null,
          passportDocument: data.passportDocument || null,
          avatars: data.avatars || [],
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }


static async userChangeWithdrawalPassword(data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const { oldPassword, newPassword } = data;

    // Validate input
    if (!oldPassword || oldPassword.trim() === '') {
      throw new Error400(options.language, "validation.oldPasswordRequired");
    }

    if (!newPassword || newPassword.trim() === '') {
      throw new Error400(options.language, "validation.newPasswordRequired");
    }

    if (newPassword.length < 4) {
      throw new Error400(options.language, "validation.newPasswordTooShort");
    }

    if (newPassword.length > 50) {
      throw new Error400(options.language, "validation.newPasswordTooLong");
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      throw new Error400(options.language, "validation.newPasswordDifferentFromOld");
    }

    // First, get the user to check if withdrawPassword exists
    const user = await User(options.database)
      .findById(currentUser.id)
      .select('+withdrawPassword');

    if (!user) {
      throw new Error400(options.language, "validation.userNotFound");
    }

    // Check if user has a withdraw password set
    if (!user.withdrawPassword) {
      // Allow setting password for the first time without old password
      await User(options.database).updateOne(
        { _id: currentUser.id },
        { $set: { withdrawPassword: newPassword } }
      );
      return { message: "Withdrawal password created successfully" };
    }

    // Verify old password matches
    if (user.withdrawPassword !== oldPassword) {
      throw new Error400(options.language, "validation.invalidOldWithdrawalPassword");
    }

    // Update the password
    const result = await User(options.database).updateOne(
      { _id: currentUser.id },
      { $set: { withdrawPassword: newPassword } }
    );

    if (result.modifiedCount === 0) {
      throw new Error400(options.language, "validation.updatePasswordFailed");
    }


    return user;
}
static async updateMyBankInfo(data, options: IRepositoryOptions) {
  const currentUser = MongooseRepository.getCurrentUser(options);
  
  // Access the nested data
  const bankData = data.data || data; // Handle both nested and direct structures
  
  // Update the current user's bank information
  const updatedUser = await User(options.database).findByIdAndUpdate(
    currentUser.id,
    {
      $set: {
        accountHolder: bankData.accountHolder,
        ibanNumber: bankData.ibanNumber, // Note: schema uses "IbanNumber" (capital I)
        bankName: bankData.bankName,
        ifscCode: bankData.ifscCode
      },
      updatedBy: currentUser.id
    },
    { new: true } // Return the updated document
  );
  
  // Optional: Add audit log
  await AuditLogRepository.log(
    {
      entityName: "user",
      entityId: currentUser.id,
      action: AuditLogRepository.UPDATE,
      values: { updatedFields: ['accountHolder', 'IbanNumber', 'bankName', 'ifscCode'] }
    },
    options
  );
  
  return updatedUser;
}

  static async createUniqueRefCode(options: IRepositoryOptions) {
    let code;
    let exists = true;

    while (exists) {
      code = this.generateRefCode();
      exists = await User(options.database).exists({ refCode: code });
    }

    return code;
  }



  static async getReferralData( options: IRepositoryOptions): Promise<ReferralSummary> {
  try {
    const UserModel = User(options.database);
    const TransactionModel = options.database.model("transaction");
    const RecordModel = options.database.model("records");
    const CompanyModel = options.database.model("company");
    const currentUser = MongooseRepository.getCurrentUser(options);

    // Get current user's refcode
    if (!currentUser) {
      throw new Error400(options.language, "validation.userNotFound");
    }

    const userRefCode = currentUser.refcode;
    
    if (!userRefCode) {
      return {
        totalDailyInvitations: 0,
        totalMonthlyInvitations: 0,
        totalMonthlyIncome: 0,
        referrals: []
      };
    }

    // Get company settings for defaultCommission
    const companySettings = await CompanyModel.findOne({});
    const defaultCommission = parseFloat(companySettings?.defaulCommission || "15"); // Default to 15 if not set

    // Get current date boundaries
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Find all users who used this refcode
    const referredUsers = await UserModel.find({
      invitationcode: userRefCode,
      createdAt: { $exists: true }
    }).select('mnemberId createdAt fullName email');

    // Calculate daily and monthly invitations
    const dailyInvitations = referredUsers.filter(user => 
      user.createdAt >= startOfDay
    ).length;

    const monthlyInvitations = referredUsers.filter(user => 
      user.createdAt >= startOfMonth && user.createdAt <= endOfMonth
    ).length;

    // If no referred users, return empty data
    if (referredUsers.length === 0) {
      return {
        totalDailyInvitations: dailyInvitations,
        totalMonthlyInvitations: monthlyInvitations,
        totalMonthlyIncome: 0,
        referrals: []
      };
    }

    // Get all user IDs for transaction and record lookup
    const referredUserIds = referredUsers.map(user => user._id);

    // Get transaction data (recharge and withdraw)
    const transactionData = await TransactionModel.aggregate([
      {
        $match: {
          user: { $in: referredUserIds },
          status: "success",
          type: { $in: ["deposit", "withdraw"] }
        }
      },
      {
        $group: {
          _id: {
            userId: "$user",
            type: "$type"
          },
          totalAmount: {
            $sum: { $toDouble: "$amount" }
          }
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          transactions: {
            $push: {
              type: "$_id.type",
              amount: "$totalAmount"
            }
          }
        }
      }
    ]);

    // Get records data to calculate profit for each referred user
    // Profit formula: commission = (parseFloat(commission) / 100) * parseFloat(price)
    const recordsData = await RecordModel.aggregate([
      {
        $match: {
          user: { $in: referredUserIds },
          status: "completed" // Only count completed records
        }
      },
      {
        $addFields: {
          // Convert price and commission to numbers
          priceNum: { $toDouble: "$price" },
          commissionNum: { $toDouble: "$commission" }
        }
      },
      {
        $addFields: {
          // Calculate profit for each record: (commission / 100) * price
          recordProfit: {
            $multiply: [
              { $divide: ["$commissionNum", 100] },
              "$priceNum"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$user",
          totalProfit: { $sum: "$recordProfit" }
        }
      }
    ]);

    // Create maps for quick lookup
    const transactionMap = new Map();
    transactionData.forEach(item => {
      const userId = item._id.toString();
      const deposits = item.transactions.find(t => t.type === "deposit")?.amount || 0;
      const withdraws = item.transactions.find(t => t.type === "withdraw")?.amount || 0;
      
      transactionMap.set(userId, {
        recharge: deposits,
        withdraw: withdraws
      });
    });

    const profitMap = new Map();
    recordsData.forEach(item => {
      profitMap.set(item._id.toString(), item.totalProfit);
    });

    // Calculate total profit from all referred users
    let totalReferralProfit = 0;

    // Build the referral list with transaction and profit data
    const referrals: ReferralUserData[] = referredUsers.map(user => {
      const userId = user._id.toString();
      const userTransactions = transactionMap.get(userId) || {
        recharge: 0,
        withdraw: 0
      };
      
      const userProfit = profitMap.get(userId) || 0;
      
      // Add to total referral profit
      totalReferralProfit += userProfit;

      return {
        memberId: user.mnemberId || 0,
        recharge: userTransactions.recharge,
        withdraw: userTransactions.withdraw,
        totalProfit: userProfit
      };
    });

    // Calculate total monthly income based on defaultCommission percentage
    // From total profit earned by all invited users, take only the percentage defined by defaultCommission
    const totalMonthlyIncome = (defaultCommission / 100) * totalReferralProfit;

    return {
      totalDailyInvitations: dailyInvitations,
      totalMonthlyInvitations: monthlyInvitations,
      totalMonthlyIncome: parseFloat(totalMonthlyIncome.toFixed(2)), // Round to 2 decimal places
      referrals: referrals.sort((a, b) => b.recharge - a.recharge)
    };

  } catch (error) {
    console.error("Error in getReferralData:", error);
    throw error;
  }
}

/**
 * Detailed version with more information
 */
static async getReferralDataDetailed(currentUserId: string, options: IRepositoryOptions): Promise<any> {
  try {
    const UserModel = User(options.database);
    const TransactionModel = options.database.model("transaction");
    const RecordModel = options.database.model("records");
    const CompanyModel = options.database.model("company");

    // Get current user's refcode
    const currentUser = await UserModel.findById(currentUserId);
    if (!currentUser) {
      throw new Error400(options.language, "validation.userNotFound");
    }

    const userRefCode = currentUser.refcode;
    
    if (!userRefCode) {
      return {
        totalDailyInvitations: 0,
        totalMonthlyInvitations: 0,
        totalMonthlyIncome: 0,
        totalReferralProfit: 0,
        defaultCommission: 0,
        referrals: []
      };
    }

    // Get company settings for defaultCommission
    const companySettings = await CompanyModel.findOne({});
    const defaultCommission = parseFloat(companySettings?.defaulCommission || "15");

    // Get current date boundaries
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Use aggregation for better performance
    const referralData = await UserModel.aggregate([
      {
        $match: {
          invitationcode: userRefCode
        }
      },
      {
        $lookup: {
          from: "transactions",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$userId"] },
                status: "success"
              }
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: { $toDouble: "$amount" } }
              }
            }
          ],
          as: "transactions"
        }
      },
      {
        $lookup: {
          from: "records",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user", "$$userId"] },
                status: "completed"
              }
            },
            {
              $addFields: {
                priceNum: { $toDouble: "$price" },
                commissionNum: { $toDouble: "$commission" }
              }
            },
            {
              $addFields: {
                profit: {
                  $multiply: [
                    { $divide: ["$commissionNum", 100] },
                    "$priceNum"
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalProfit: { $sum: "$profit" }
              }
            }
          ],
          as: "records"
        }
      },
      {
        $project: {
          memberId: "$mnemberId",
          fullName: 1,
          email: 1,
          createdAt: 1,
          transactions: {
            $arrayToObject: {
              $map: {
                input: "$transactions",
                as: "t",
                in: { k: "$$t._id", v: "$$t.total" }
              }
            }
          },
          totalProfit: {
            $ifNull: [
              { $arrayElemAt: ["$records.totalProfit", 0] },
              0
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Calculate daily and monthly counts
    const dailyInvitations = referralData.filter(user => 
      user.createdAt >= startOfDay
    ).length;

    const monthlyInvitations = referralData.filter(user => 
      user.createdAt >= startOfMonth && user.createdAt <= endOfMonth
    ).length;

    // Calculate total profit from all referred users
    const totalReferralProfit = referralData.reduce((sum, user) => sum + (user.totalProfit || 0), 0);

    // Calculate total monthly income based on defaultCommission percentage
    const totalMonthlyIncome = (defaultCommission / 100) * totalReferralProfit;

    // Format the referrals data
    const referrals = referralData.map(user => ({
      memberId: user.memberId || 0,
      recharge: user.transactions?.deposit || 0,
      withdraw: user.transactions?.withdraw || 0,
      totalProfit: parseFloat((user.totalProfit || 0).toFixed(2)),
      // Optional: include additional fields
      fullName: user.fullName,
      email: user.email,
      joinedDate: user.createdAt
    }));

    return {
      totalDailyInvitations: dailyInvitations,
      totalMonthlyInvitations: monthlyInvitations,
      totalMonthlyIncome: parseFloat(totalMonthlyIncome.toFixed(2)),
      totalReferralProfit: parseFloat(totalReferralProfit.toFixed(2)),
      defaultCommission: defaultCommission,
      referrals: referrals.sort((a, b) => b.recharge - a.recharge),
      summary: {
        totalReferred: referrals.length,
        totalRechargeAmount: referrals.reduce((sum, r) => sum + r.recharge, 0),
        totalWithdrawAmount: referrals.reduce((sum, r) => sum + r.withdraw, 0),
        averageProfit: referrals.length > 0 
          ? parseFloat((referrals.reduce((sum, r) => sum + r.totalProfit, 0) / referrals.length).toFixed(2))
          : 0
      }
    };

  } catch (error) {
    console.error("Error in getReferralDataDetailed:", error);
    throw error;
  }
}
  

  static async generateRefCode() {
    const prefix = "NO";
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 6 digits
    return `${prefix}${randomPart}`;
  }
  static async updateUser(
    tenantId,
    id,
    fullName,
    phoneNumber,
    passportNumber,
    nationality,
    country,
    passportPhoto,
    balance,
    minbalance,
    vip,
    options,
    status,
    product,
    itemNumber,
    prizes,
    prizesNumber,
    withdrawPassword,
    score,
    grab,
    withdraw,
    refsystem,
    freezeblance,
    tasksDone,
    preferredcoin,
    welcomeBonus
  ) {
    const user = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findById(id),
      options
    );


    await User(options.database).updateOne(
      { _id: id },
      {
        $set: {
          fullName: fullName,
          phoneNumber: phoneNumber,
          passportNumber: passportNumber,
          nationality: nationality,
          country: country,
          passportPhoto: passportPhoto,
          options: options,
          balance: balance,
          minbalance: minbalance,
          vip: vip,
          product: product,
          itemNumber: itemNumber,
          prizes: prizes,
          prizesNumber: prizesNumber,
          withdrawPassword: withdrawPassword,
          score: score,
          grab: grab,
          refsystem: refsystem,
          withdraw: withdraw,
          freezeblance: freezeblance,
          preferredcoin: preferredcoin,
          tasksDone: tasksDone,
          welcomeBonus:welcomeBonus,
          $tenant: { status }
        },
      },
      options
    );
  }



  static async generateCouponCode() {
    const randomNumber = Math.floor(Math.random() * 10000000);
    const randomNumberPadded = randomNumber.toString().padStart(7, "0");
    const randomCode = await `6L${randomNumberPadded}`;
    return randomCode;
  }

  static async getCountry(ip: string) {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;
    return data.country; // e.g., "United States"
  }


  static async createFromAuth(data, options: IRepositoryOptions) {
    data = this._preSave(data);
    const req = data.req;
    const normalizeIP = (ip: string) => ip.replace(/^::ffff:/, "");

    const rawIP =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress;

    const clientIP = normalizeIP(rawIP);
    const country = await this.getCountry(clientIP);

    let [user] = await User(options.database).create(
      [
        {
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          country: country,
          ipAddress: clientIP,
          firstName: data.firstName,
          fullName: data.fullName,
          withdrawPassword: data.withdrawPassword,
          invitationcode: data.invitationcode,
          refcode: await this.createUniqueRefCode(options),
          couponcode: await this.createUniqueRefCode(options),
        },
      ],
      options
    );

    delete user.password;
    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async VipLevel(options) {
    const sort = MongooseQueryUtils.sort("createdAt_ASC");
    const skip = Number(0) || undefined;
    const limitEscaped = Number(0) || undefined;
    let rows = await Vip(options.database)
      .find()
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate("members");

    const count = await Vip(options.database).countDocuments();

    return { rows, count };
  }
 static async createFromAuthMobile(data, options: IRepositoryOptions) {
    const vip = await this.VipLevel(options);

    const id = vip?.rows[0]?.id;
    data = this._preSave(data);

    const req = data.req;

    const normalizeIP = (ip: string) => ip.replace(/^::ffff:/, "");

    const rawIP =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any).socket?.remoteAddress;

    const clientIP = normalizeIP(rawIP);

    const country = await this.getCountry(clientIP);
    const defaultBalance = await company(options.database).find({});

    let settingsBalance;
    if (defaultBalance.length > 0) {
      settingsBalance = defaultBalance[0].defaultBalance;
    }

    // Generate unique memberId with format 138XXX
    const memberId = await this.generateUniqueMemberId(options);

    let [user] = await User(options.database).create(
      [
        {
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          ipAddress: clientIP, // Save the IP address
          country: country, // Save both form country and detected country,
          firstName: data.firstName,
          fullName: data.fullName,
          gender: data.gender,
          withdrawPassword: data.withdrawPassword,
          invitationcode: data.invitationcode,
          refcode: await this.createUniqueRefCode(options),
          balance: settingsBalance,
          vip: id ? id : "",
          mnemberId: memberId, // Add the generated memberId
        },
      ],
      options
    );

    delete user.password;
    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findByIdMobile(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  /**
   * Generate a unique 6-digit memberId starting with 138
   * Uses counter collection approach for optimal performance and uniqueness
   */
  static async generateUniqueMemberId(options: IRepositoryOptions): Promise<number> {
    try {
      // Get or create the counter model
      const CounterModel = this.getCounterModel(options.database);
      
      // Find and update the counter atomically
      const counter = await CounterModel.findOneAndUpdate(
        { name: 'memberId' },
        { $inc: { value: 1 } },
        { 
          new: true, 
          upsert: true,
          setDefaultsOnInsert: true,
          returnOriginal: false
        }
      );

      // Ensure the value starts from 138001
      if (counter.value < 138001) {
        counter.value = 138001;
        await counter.save();
      }

      return counter.value;
    } catch (error) {
      console.error('Error generating memberId with counter:', error);
      
      // Fallback to random generation if counter fails
      return await this.generateUniqueMemberIdFallback(options);
    }
  }

  /**
   * Counter model definition
   */
  static getCounterModel(database) {
    try {
      return database.model('counter');
    } catch (error) {
      // Model doesn't exist, create it
      const CounterSchema = new database.Schema({
        name: { 
          type: String, 
          required: true, 
          unique: true 
        },
        value: { 
          type: Number, 
          default: 138000 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        },
        updatedAt: { 
          type: Date, 
          default: Date.now 
        }
      });

      CounterSchema.pre('save', function(this: any, next) {
        this.updatedAt = new Date();
        next();
      });

      return database.model('counter', CounterSchema);
    }
  }

  /**
   * Fallback method to generate unique memberId
   * Uses random generation with uniqueness check
   */
  static async generateUniqueMemberIdFallback(options: IRepositoryOptions): Promise<number> {
    const UserModel = User(options.database);
    let isUnique = false;
    let memberId: number = 138001;
    let attempts = 0;
    const maxAttempts = 50;

    while (!isUnique && attempts < maxAttempts) {
      // Generate random 3-digit number (100-999)
      const randomSuffix = Math.floor(Math.random() * 900) + 100; // 100 to 999
      
      // Combine with prefix 138 to create 6-digit number
      memberId = parseInt(`138${randomSuffix}`);

      // Check if this memberId already exists
      const existingUser = await UserModel.findOne({ mnemberId: memberId });
      
      if (!existingUser) {
        isUnique = true;
      }
      
      attempts++;
    }

    if (!isUnique) {
      // If we couldn't generate a unique ID after max attempts,
      // use timestamp-based approach as final fallback
      const timestamp = Date.now().toString().slice(-3);
      memberId = parseInt(`138${timestamp}`);
      
      // One final check with timestamp
      let existingUser = await UserModel.findOne({ mnemberId: memberId });
      if (existingUser) {
        // If still not unique, add a small random offset until unique
        let offset = 1;
        while (existingUser && offset < 100) {
          const newSuffix = (parseInt(timestamp) + offset).toString().padStart(3, '0');
          memberId = parseInt(`138${newSuffix}`);
          existingUser = await UserModel.findOne({ mnemberId: memberId });
          offset++;
        }
      }
    }

    return memberId;
  }

  /**
   * Alternative method using sequence approach (if you prefer sequential IDs)
   */
  static async generateSequentialMemberId(options: IRepositoryOptions): Promise<number> {
    const UserModel = User(options.database);
    
    // Find the highest existing memberId with prefix 138
    const lastUser = await UserModel.findOne({ 
      mnemberId: { $exists: true, $regex: /^138/ } 
    }).sort({ mnemberId: -1 });
    
    if (lastUser && lastUser.mnemerId) {
      // Extract the last 3 digits and increment
      const lastId = lastUser.mnemerId.toString();
      const lastSuffix = parseInt(lastId.slice(-3));
      
      // Generate next suffix (wrap around if needed)
      let nextSuffix = (lastSuffix + 1) % 1000;
      
      // Ensure it's always 3 digits (pad with zeros)
      // Start from 001, not 000
      if (nextSuffix === 0) {
        nextSuffix = 1;
      }
      
      const paddedSuffix = nextSuffix.toString().padStart(3, '0');
      return parseInt(`138${paddedSuffix}`);
    } else {
      // First user - start with 138001
      return 138001;
    }
  }

  /**
   * Utility method to check if a memberId exists
   */
  static async checkMemberIdExists(memberId: number, options: IRepositoryOptions): Promise<boolean> {
    const UserModel = User(options.database);
    const existingUser = await UserModel.findOne({ mnemberId: memberId });
    return !!existingUser;
  }

  /**
   * Utility method to get all memberIds (for debugging)
   */
  static async getAllMemberIds(options: IRepositoryOptions): Promise<number[]> {
    const UserModel = User(options.database);
    const users = await UserModel.find({ mnemberId: { $exists: true } })
      .select('mnemberId')
      .sort({ mnemberId: 1 });
    
    return users.map(user => user.mnemerId);
  }

  static async updatePassword(
    id,
    password,
    invalidateOldTokens: boolean,
    options: IRepositoryOptions
  ) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const data: any = {
      password,
      updatedBy: id,
    };

    if (invalidateOldTokens) {
      data.jwtTokenInvalidBefore = new Date();
    }

    await User(options.database).updateOne({ _id: id }, data, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          password: "secret",
        },
      },
      options
    );

    return this.findById(id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async updateProfile(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    await this.checkSolde(data, options);
    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        withdraw: data.withdraw || currentUser.withdraw,
        balance: data.balance || currentUser.balance,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product,
        itemNumber: data?.itemNumber,
        preferredcoin: data?.preferredcoin
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateProfileGrap(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    // await this.checkSolde(data, options);

    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        balance: data.balance,
        freezeblance: data.freezeblance,
        erc20: data.erc20 || currentUser.erc20,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product || currentUser?.product,
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateSolde(id, data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    // await this.checkSolde(data, options);

    data = this._preSave(data);
    await User(options.database).updateOne(
      { _id: id },
      {
        firstName: data.firstName || currentUser.firstName,
        lastName: data.lastName || currentUser.lastName,
        fullName: data.fullName || currentUser.fullName,
        phoneNumber: data.phoneNumber || currentUser.phoneNumber,
        updatedBy: currentUser.id,
        avatars: data.avatars || [],
        vip: data.vip || currentUser.vip,
        balance: data.balances,
        erc20: data.erc20 || currentUser.erc20,
        trc20: data.trc20 || currentUser.trc20,
        walletname: data.walletname || currentUser.walletname,
        usernamewallet: data.usernamewallet || currentUser.usernamewallet,
        product: data?.product,
      },
      options
    );

    const user = await this.findById(id, options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: user,
      },
      options
    );

    return user;
  }

  static async updateBalance(data, options) {
    const currentUser = await MongooseRepository.getCurrentUser(options);

    const currentBalance = currentUser.balance;
    const currentVip = currentUser.vip.id;

    if (!data) return;
  }

  static async checkSolde(data, options) {
    const currentUser = await MongooseRepository.getCurrentUser(options);

    const currentBalance = currentUser.balance;
    const currentVip = currentUser.vip.id;

    if (!data?.vip?.id) return;

    if (currentVip === data?.vip?.id) {



      throw new Error400(
        options.language,
        "validation.duplicateSubsctription"
      );

    }
    if (currentBalance < data?.vip?.levellimit) {
      throw new Error400(
        options.language,
        "validation.InsufficientBalance"
      );
    }
  }

  static async generateEmailVerificationToken(
    email,
    options: IRepositoryOptions
  ) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const { id } = await this.findByEmailWithoutAvatar(email, options);

    const emailVerificationToken = crypto.randomBytes(20).toString("hex");
    const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await User(options.database).updateOne(
      { _id: id },
      {
        emailVerificationToken,
        emailVerificationTokenExpiresAt,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          emailVerificationToken,
          emailVerificationTokenExpiresAt,
        },
      },
      options
    );

    return emailVerificationToken;
  }

  static async generatePasswordResetToken(email, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    const { id } = await this.findByEmailWithoutAvatar(email, options);

    const passwordResetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await User(options.database).updateOne(
      { _id: id },
      {
        passwordResetToken,
        passwordResetTokenExpiresAt,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          id,
          passwordResetToken,
          passwordResetTokenExpiresAt,
        },
      },
      options
    );

    return passwordResetToken;
  }

  static async findByEmail(email, options: IRepositoryOptions) {
    const record = await this.findByEmailWithoutAvatar(email, options);
    return await this._fillRelationsAndFileDownloadUrls(record, options);
  }

  static async findByEmailWithoutAvatar(email, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findOne({
          email: {
            $regex: new RegExp(`^${MongooseQueryUtils.escapeRegExp(email)}$`),
            $options: "i",
          },
        })
        .populate("tenants.tenant"),
      options
    );
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenants: { $elemMatch: { tenant: currentTenant.id } },
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.fullName) {
        criteriaAnd.push({
          ["fullName"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.fullName),
            $options: "i",
          },
        });
      }

      if (filter.email) {
        criteriaAnd.push({
          ["email"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.email),
            $options: "i",
          },
        });
      }

      if (filter.role) {
        criteriaAnd.push({
          tenants: { $elemMatch: { roles: filter.role } },
        });
      }

      if (filter.invitationcode) {
        criteriaAnd.push({
          ["invitationcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.invitationcode),
            $options: "i",
          },
        });
      }

      if (filter.couponcode) {
        criteriaAnd.push({
          ["couponcode"]: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.couponcode),
            $options: "i",
          },
        });
      }


      if (filter.status) {
        criteriaAnd.push({
          tenants: {
            $elemMatch: { status: filter.status },
          },
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== "") {
          criteriaAnd.push({
            ["createdAt"]: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .find(criteria)
        .skip(skip)
        .limit(limitEscaped)
        .sort(sort)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    const count = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(criteria),
      options
    );

    rows = this._mapUserForTenantForRows(rows, currentTenant);
    rows = await Promise.all(
      rows.map((row) => this._fillRelationsAndFileDownloadUrls(row, options))
    );

    return { rows, count };
  }

  static async filterIdInTenant(id, options: IRepositoryOptions) {
    return lodash.get(await this.filterIdsInTenant([id], options), "[0]", null);
  }

  static async filterIdsInTenant(ids, options: IRepositoryOptions) {
    if (!ids || !ids.length) {
      return ids;
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let users = await User(options.database)
      .find({
        _id: {
          $in: ids,
        },
        tenants: {
          $elemMatch: { tenant: currentTenant.id },
        },
      })
      .select(["_id"]);

    return users.map((user) => user._id);
  }

  static cleanupForRelationships(userOrUsers) {
    if (!userOrUsers) {
      return userOrUsers;
    }

    if (Array.isArray(userOrUsers)) {
      return userOrUsers.map((user) =>
        lodash.pick(user, ["_id", "id", "firstName", "lastName", "email"])
      );
    }

    return lodash.pick(userOrUsers, [
      "_id",
      "id",
      "firstName",
      "lastName",
      "email",
    ]);
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenants: {
          $elemMatch: { tenant: currentTenant.id },
        },
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            fullName: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("fullName_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    let users = await User(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    users = this._mapUserForTenantForRows(users, currentTenant);

    const buildText = (user) => {
      if (!user.fullName) {
        return user.email;
      }

      return `${user.fullName} <${user.email}>`;
    };

    return users.map((user) => ({
      id: user.id,
      label: buildText(user),
    }));
  }

  static async findByIdWithPassword(id, options: IRepositoryOptions) {
    return await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findById(id).populate("tenants.tenant"),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findById(id)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    if (!record) {
      throw new Error404();
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);
    if (!options || !options.bypassPermissionValidation) {
      if (!isUserInTenant(record, currentTenant.id)) {
        throw new Error404();
      }
      record = this._mapUserForTenant(record, currentTenant);
    }

    record = await this._fillRelationsAndFileDownloadUrls(record, options);

    return record;
  }

  static async findByIdMobile(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database)
        .findById(id)
        .populate("tenants.tenant")
        .populate("vip")
        .populate("product")
        .populate("prizes"),
      options
    );

    if (!record) {
      throw new Error404();
    }

    const currentTenant = MongooseRepository.getCurrentTenant(options);
    if (!options || !options.bypassPermissionValidation) {
      if (!isUserInTenant(record, currentTenant.id)) {
        throw new Error404();
      }
      record = this._mapUserForTenantMobile(record, currentTenant);
    }

    record = await this._fillRelationsAndFileDownloadUrls(record, options);

    return record;
  }

  static async checkRefcode(refcode, options: IRepositoryOptions) {
    const checkref = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        refcode: refcode,
      }),
      options
    );

    if (!checkref) {
      return null;
    }
    return true;
  }

  static async findPassword(id, options: IRepositoryOptions) {
    let record = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findById(id).select("+password"),
      options
    );

    if (!record) {
      return null;
    }

    return record.password;
  }

  static async findByIdWithoutAvatar(id, options: IRepositoryOptions) {
    return this.findById(id, options);
  }

  static async Destroy(id, options) {
    return User(options.database).deleteOne({ _id: id });
  }

  /**
   * Finds the user by the password token if not expired.
   */
  static async findByPasswordResetToken(token, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        passwordResetToken: token,
        passwordResetTokenExpiresAt: { $gt: Date.now() },
      }),
      options
    );
  }

  /**
   * Finds the user by the email verification token if not expired.
   */
  static async findByEmailVerificationToken(
    token,
    options: IRepositoryOptions
  ) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpiresAt: {
          $gt: Date.now(),
        },
      }),
      options
    );
  }

  static async markEmailVerified(id, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);

    await User(options.database).updateOne(
      { _id: id },
      {
        emailVerified: true,
        updatedBy: currentUser.id,
      },
      options
    );

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: id,
        action: AuditLogRepository.UPDATE,
        values: {
          emailVerified: true,
        },
      },
      options
    );

    return true;
  }

  static async count(filter, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(filter),
      options
    );
  }

  /**
   * Normalize the user fields.
   */
  static _preSave(data) {
    if (data.firstName || data.lastName) {
      data.fullName = `${(data.firstName || "").trim()} ${(
        data.lastName || ""
      ).trim()}`.trim();
    }

    data.email = data.email ? data.email.trim() : null;

    data.firstName = data.firstName ? data.firstName.trim() : null;

    data.lastName = data.lastName ? data.lastName.trim() : null;

    return data;
  }

  /**
   * Maps the users data to show only the current tenant related info
   */
  static _mapUserForTenantForRows(rows, tenant) {
    if (!rows) {
      return rows;
    }

    return rows.map((record) => this._mapUserForTenant(record, tenant));
  }

  /**
   * Maps the user data to show only the current tenant related info
   */
  static _mapUserForTenant(user, tenant) {
    if (!user || !user.tenants) {
      return user;
    }

    const tenantUser = user.tenants.find(
      (tenantUser) =>
        tenantUser &&
        tenantUser.tenant &&
        String(tenantUser.tenant.id) === String(tenant.id)
    );

    delete user.tenants;

    const status = tenantUser ? tenantUser.status : "active";
    const roles = tenantUser ? tenantUser.roles : ["member"];

    // If the user is only invited,
    // tenant members can only see its email
    const otherData = status === "active" ? user.toObject() : {};

    return {
      ...otherData,
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      passportNumber: user.passportNumber,
      country: user.country,
      withdrawPassword: user.withdrawPassword,
      balance: user.balance,
      invitationcode: user.invitationcode,
      nationality: user.nationality,
      refcode: user.refcode,
      roles,
      status,
    };
  }

  static _mapUserForTenantMobile(user, tenant) {
    if (!user || !user.tenants) {
      return user;
    }

    const tenantUser = user.tenants.find(
      (tenantUser) =>
        tenantUser &&
        tenantUser.tenant &&
        String(tenantUser.tenant.id) === String(tenant.id)
    );

    // delete user.tenants;

    const status = "active";
    const roles = ["member"];

    // If the user is only invited,
    // tenant members can only see its email
    const otherData = status === "active" ? user.toObject() : {};

    return {
      ...otherData,
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      passportNumber: user.passportNumber,
      country: user.country,
      withdrawPassword: user.withdrawPassword,
      balance: user.balance,
      invitationcode: user.invitationcode,
      nationality: user.nationality,
      refcode: user.refcode,
      roles,
      status,
    };
  }
  static async findByRoleAutocomplete(
    search,
    limit,
    options: IRepositoryOptions
  ) {
    const currentTenant1 = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenants: {
          $elemMatch: { tenant: currentTenant1.id },
        },
      },
    ];
    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            fullName: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
          {
            email: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("fullName_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    let users = await User(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    users = this._mapUserForTenantForRows(users, currentTenant1);

    const buildText = (user) => {
      if (!user.fullName) {
        return user.email;
      }

      return `${user.fullName} <${user.email}>`;
    };

    return users.map((user) => ({
      id: user.id,
      label: buildText(user),
    }));
  }

  static async _fillRelationsAndFileDownloadUrls(
    record,
    options: IRepositoryOptions
  ) {
    if (!record) {
      return null;
    }

    const output = record.toObject ? record.toObject() : record;

    if (output.tenants && output.tenants.length) {
      await Promise.all(
        output.tenants.map(async (userTenant) => {
          userTenant.tenant.settings = await SettingsRepository.find({
            currentTenant: userTenant.tenant,
            ...options,
          });
        })
      );
    }

    output.avatars = await FileRepository.fillDownloadUrl(output.avatars);
    output.passportPhoto = await FileRepository.fillDownloadUrl(
      output.passportPhoto
    );
    output.passportDocument = await FileRepository.fillDownloadUrl(
      output.passportDocument
    );
    return output;
  }

  static async createFromSocial(
    provider,
    providerId,
    email,
    emailVerified,
    firstName,
    lastName,
    options
  ) {
    let data = {
      email,
      emailVerified,
      providerId,
      provider,
      firstName,
      lastName,
    };

    data = this._preSave(data);

    let [user] = await User(options.database).create([data], options);

    await AuditLogRepository.log(
      {
        entityName: "user",
        entityId: user.id,
        action: AuditLogRepository.CREATE,
        values: user,
      },
      options
    );

    return this.findById(user.id, {
      ...options,
      bypassPermissionValidation: true,
    });
  }

  static async CountUser(options: IRepositoryOptions) {
    let rows = await User(options.database).aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    return rows;
  }

  static async CountUsers(options: IRepositoryOptions) {
    const count = await MongooseRepository.wrapWithSessionIfExists(
      User(options.database).countDocuments(),
      options
    );

    return count;
  }
}
