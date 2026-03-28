import MongooseRepository from "./mongooseRepository";
import MongooseQueryUtils from "../utils/mongooseQueryUtils";
import AuditLogRepository from "./auditLogRepository";
import Error404 from "../../errors/Error404";
import { IRepositoryOptions } from "./IRepositoryOptions";
import FileRepository from "./fileRepository";
import Product from "../models/product";
import UserRepository from "./userRepository";
import RecordRepository from "./recordRepository";
import Error405 from "../../errors/Error405";
import Error400 from "../../errors/Error400";
import axios from "axios";
import Records from "../models/records";
import Dates from "../utils/Dates";
class ProductRepository {

  private static baseConfig = {
    "cookie": "_ga=GA1.1.1807754517.1763083251; ka_sessionid=5acf70c39073cdf7b663f7b375a2a692; CSRF-TOKEN=CfDJ8E2Nv-_xTuFMnx6IZ-XCV9ys_4oYgrTrS_L8vR36OB-kDQavyZvv3cJ7EiH2YvNgjfNGbRRa5E2xugFUcXRSDm3s_OURxgmz244AaODX2g; GCLB=CKbs1rGz6rLfngEQAw; build-hash=7b9eb83fb96933a086319a2af9654f2f0c6bc945; XSRF-TOKEN=CfDJ8E2Nv-_xTuFMnx6IZ-XCV9z93sTd2V_Hsm3muzlM2i71YvHlaQH6swWCYi2VY2ZuZGiSixZkSPTYZySpZiQGvP8T-OooMdK5utUcBdT68NR_kg; CLIENT-TOKEN=eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJrYWdnbGUiLCJhdWQiOiJjbGllbnQiLCJzdWIiOiIiLCJuYnQiOiIyMDI2LTAyLTE4VDE5OjA1OjU0LjQyNDY2MTJaIiwiaWF0IjoiMjAyNi0wMi0xOFQxOTowNTo1NC40MjQ2NjEyWiIsImp0aSI6IjI1YTJiMGNlLWMyNDEtNDRlMS04OGUzLTU3OWI2NTQyODZhMyIsImV4cCI6IjIwMjYtMDMtMThUMTk6MDU6NTQuNDI0NjYxMloiLCJhbm9uIjp0cnVlLCJmZmgiOiJmZjE1NmNlNjhjMDA3NDU1ZDIyZTlmNjBhYTEzMjhlZDU4NjA3MTQ3MjliZDc4MGNjYjZmZTdmNWI4ZmZmMWM1IiwicGlkIjoia2FnZ2xlLTE2MTYwNyIsInN2YyI6IndlYi1mZSIsInNkYWsiOiJBSXphU3lBNGVOcVVkUlJza0pzQ1pXVnotcUw2NTVYYTVKRU1yZUUiLCJibGQiOiI3YjllYjgzZmI5NjkzM2EwODYzMTlhMmFmOTY1NGYyZjBjNmJjOTQ1In0.; _ga_T7QHS60L4Q=GS2.1.s1771441515$o3$g1$t1771441554$j21$l0$h0",
    "origin": "https://www.kaggle.com",
    "referer": "https://www.kaggle.com/datasets/robintomar11/hoelsdatasets",
    "x-kaggle-build-version": "7b9eb83fb96933a086319a2af9654f2f0c6bc945",
    "Content-Type": "application/json",
    "x-xsrf-token": "CfDJ8E2Nv-_xTuFMnx6IZ-XCV9z93sTd2V_Hsm3muzlM2i71YvHlaQH6swWCYi2VY2ZuZGiSixZkSPTYZySpZiQGvP8T-OooMdK5utUcBdT68NR_kg"
  };
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);
    const currentUser = MongooseRepository.getCurrentUser(options);

    const [record] = await Product(options.database).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options
    );

    return this.findById(record.id, options);
  }


  private static async fetchKaggleData(dataConfig: any, value: any, titleIndex: number, imageIndex: number) {
    const url = "https://www.kaggle.com/api/i/datasets.DatasetService/GetDataViewExternal";

    try {
      const response = await axios.post(url, dataConfig, { headers: this.baseConfig });

      // The actual data is nested under dataView.dataRaw
      const dataRaw = response?.data?.dataView?.dataRaw;
      if (!dataRaw || !dataRaw.data) {
        console.warn("No dataRaw found in response");
        return [];
      }

      // Parse the JSON string
      let parsed;
      try {
        parsed = JSON.parse(dataRaw.data);
      } catch (e) {
        console.error("Failed to parse dataRaw.data as JSON", e);
        return [];
      }

      // Extract the array of hotels – adjust the key if needed
      const hotels = parsed.airbnbHotels;
      if (!Array.isArray(hotels)) {
        console.warn("parsed data does not contain airbnbHotels array");
        return [];
      }

      // Map each hotel to your desired output format
      const values = hotels.map((item) => ({
        // Use the first subtitle as the title, fallback to 'No Title'
        title: item.subtitles?.[0] || 'No Title',
        image: item.thumbnail || 'No Image',
        commission: value.comisionrate,
        vip: value.vipId,
        amount: this.generateRandomPrice(value.min, value.max)
      }));

      return values;
    } catch (error) {
      console.error('Error fetching data from Kaggle:', error);
      throw error;
    }
  }


  private static generateRandomPrice(minStr: string, maxStr: string): string {
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    if (isNaN(min) || isNaN(max)) {
      return '0.00';
    }

    const randomPrice = (Math.random() * (max - min) + min).toFixed(2);
    return randomPrice;
  }
  // VIP 1 - Amazon Canada Products
  static async Vip1(value: any) {
    const data = {
      verificationInfo: {
        datasetId: 3287722,
        databundleVersionId: 5794156
      },
      firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Berlin.json"
    };

    return await ProductRepository.fetchKaggleData(data, value, 1, 2);
  }

  // VIP 2 - Home and Kitchen
  static async Vip2(value: any) {
    const data = {
      verificationInfo: {
        datasetId: 3287722,
        databundleVersionId: 5794156
      },
      firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/London.json",

    };
    return await ProductRepository.fetchKaggleData(data, value, 1, 2);



  }

  // VIP 3 - Car Parts

  // {datasetId: 3287722, databundleVersionId: 5794156}
  static async Vip3(value: any) {
    const data = {
      verificationInfo: {
        datasetId: 3287722,
        databundleVersionId: 5794156
      },
      firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Madrid.json",

    };

    return await ProductRepository.fetchKaggleData(data, value, 1, 2);


  }

  // VIP 4 - Air Conditioners
  static async Vip4(value: any) {
    const data = {
      verificationInfo: {
        datasetId: 3287722,
        databundleVersionId: 5794156

      },
      firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Paris.json",

    };

    return await ProductRepository.fetchKaggleData(data, value, 1, 2);


  }

  // VIP 5 - Grocery and Gourmet Foods
  static async Vip5(value: any) {
    const data = {
      verificationInfo: {
        datasetId: 3287722,
        databundleVersionId: 5794156
      },
      firestorePath: "S49c4MVLTCbrmPJeSNUM/versions/F2HhMSTESrSSEqre4NQu/files/Rome.json",


    };

    return await ProductRepository.fetchKaggleData(data, value, 1, 2);


  }




  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Product(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(options).id,
      },
      options
    );

    await this._createAuditLog(AuditLogRepository.UPDATE, id, data, options);

    record = await this.findById(id, options);

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).findById(id),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    await Product(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(AuditLogRepository.DELETE, id, record, options);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).findById(id).populate("vip"),
      options
    );

    if (!record || String(record.tenant) !== String(currentTenant.id)) {
      throw new Error404();
    }

    return this._fillFileDownloadUrls(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = "" },
    options: IRepositoryOptions
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ["_id"]: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.title) {
        criteriaAnd.push({
          title: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.title),
            $options: "i",
          },
        });
      }

      if (filter.amount) {
        criteriaAnd.push({
          amount: {
            $regex: MongooseQueryUtils.escapeRegExp(filter.amount),
            $options: "i",
          },
        });
      }
      if (filter.vip) {
        criteriaAnd.push({
          vip: filter.vip,
        });
      }
    }

    const sort = MongooseQueryUtils.sort(orderBy || "createdAt_DESC");

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length ? { $and: criteriaAnd } : null;

    let rows = await Product(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .populate("vip")
      .sort(sort);

    const count = await Product(options.database).countDocuments(criteria);

    rows = await Promise.all(rows.map(this._fillFileDownloadUrls));

    return { rows, count };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            titre: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("titre_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Product(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }



  static async findAllAutocompleteProduct(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
      {
        // Filter by type: either "combo" OR "prizes"
        type: {
          $in: ["combo", "prizes"]
        }
      }
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            title: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: "i",
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort("title_ASC");
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Product(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Product(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options
    );
  }

  static async _fillFileDownloadUrls(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject ? record.toObject() : record;
    output.photo = await FileRepository.fillDownloadUrl(output.photo);

    return output;
  }

  static async grapOrders(options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(options);
    const currentVip = currentUser.vip.id;
    const mergeDataPosition = currentUser.itemNumber;
    const giftPosition = currentUser.prizesNumber;

    if (!currentUser?.vip) {
      throw new Error400(options.language, "validation.requiredSubscription");
    }

    // Check for pending orders
    const pendingRecords = await Records(options.database).find({
      user: currentUser.id,
      status: 'pending'
    });

    if (pendingRecords.length > 0) {
      throw new Error400(options.language, "validation.submitPendingProducts");
    }

    // Check daily order limit
    const dailyOrder = currentUser.vip.dailyorder;

    // BONUS CONDITION: Check if user has completed all daily tasks
    // Note: We do NOT update the user's bonus or welcomeBonus because no order is placed.
    if (currentUser.bonus === true && currentUser.tasksDone === dailyOrder) {
      // User is eligible to place an order using the bonus, but we don't modify the database.
      // Just proceed (the balance check below will allow it because welcomeBonus > minbalance).
      console.log("User would use welcome bonus for this order (no DB update)");
    } else if (currentUser.tasksDone >= dailyOrder) {
      throw new Error400(options.language, "validation.moretasks");
    }

    // Check balance with bonus condition
    // Check if user can use welcome bonus instead of real balance
    if (currentUser.welcomeBonus > currentUser.minbalance && currentUser.bonus === true) {
      // User can proceed using welcome bonus (no balance deduction)
    } else {
      // No welcome bonus available – check actual balance
      if (currentUser.balance <= 0) {
        throw new Error400(options.language, "validation.deposit");
      }
      if (currentUser.balance < currentUser.minbalance) {
        // Throw error with minbalance amount
        throw new Error400(options.language, "validation.insufficientBalanceMin",
          currentUser.minbalance,
        );

      }
    }

    // Special VIP products (milestone rewards)
    if (currentUser?.product?.length > 0 && currentUser.tasksDone === (mergeDataPosition - 1)) {
      let product = currentUser.product[0];
      product.photo = await FileRepository.fillDownloadUrl(product?.photo);
      return product;
    } else if (currentUser?.prizes && currentUser.tasksDone === (giftPosition - 1)) {
      let product = currentUser.prizes;
      product.photo = await FileRepository.fillDownloadUrl(product?.photo);
      return product;
    }

    // -------------------------
    // Normal product selection
    // -------------------------

    let finalPrice: number;

    if (currentUser.vip.isFixedAmount) {
      // Use min/max as fixed price
      const vipMinPrice = parseFloat(currentUser.vip.min) || 20;
      const vipMaxPrice = parseFloat(currentUser.vip.max) || 50;
      const minPrice = Math.min(vipMinPrice, vipMaxPrice);
      const maxPrice = Math.max(vipMinPrice, vipMaxPrice);
      finalPrice = Math.random() * (maxPrice - minPrice) + minPrice;
    } else {
      // Use min/max as percentage of balance
      const vipMinPercentage = parseFloat(currentUser.vip.min) || 20;
      const vipMaxPercentage = parseFloat(currentUser.vip.max) || 50;
      const minPercent = Math.min(vipMinPercentage, vipMaxPercentage);
      const maxPercent = Math.max(vipMaxPercentage, vipMaxPercentage);
      const randomPercentage = Math.random() * (maxPercent - minPercent) + minPercent;
      finalPrice = (currentUser.balance * randomPercentage) / 100;
      if (finalPrice > currentUser.balance) {
        throw new Error400(options.language, "validation.deposit");
      }
    }

    finalPrice = Math.round(finalPrice * 100) / 100;

    // Get random normal product
    let products = await Product(options.database)
      .find({ vip: currentVip, type: 'normal' })
      .populate("vip");

    if (products.length === 0) {
      throw new Error400(options.language, "validation.noProductsAvailable");
    }

    const randomIndex = Math.floor(Math.random() * products.length);
    const selectedProduct = products[randomIndex];

    // Prepare the product for return (no record created, no balance updated)
    selectedProduct.amount = finalPrice.toString();
    selectedProduct.photo = await FileRepository.fillDownloadUrl(selectedProduct?.photo);

    return selectedProduct;
  }




}

export default ProductRepository;
