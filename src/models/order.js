import DataType from "sequelize";
import Model from "./sequelize";
import Book from "./book";
import { ORDER_STATUS, SHIPPING_METHOD, PAYMENT_METHOD, PAYMENT_STATUS, SHIPPING_STATUS } from "../constants/product";

const Order = Model.define(
  "Order",
  {
    id: {
      type: DataType.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    shipping_method: {
      type: DataType.ENUM,
      values: Object.values(SHIPPING_METHOD),
      defaultValue: SHIPPING_METHOD.DELIVERY
    },
    payment_method: {
      type: DataType.ENUM,
      values: Object.values(PAYMENT_METHOD),
      defaultValue: PAYMENT_METHOD.ONLINE
    },
    order_status: {
      type: DataType.ENUM,
      values: Object.values(ORDER_STATUS),
      defaultValue: ORDER_STATUS.DRAFT
    },
    payment_status: {
      type: DataType.ENUM,
      values: Object.values(PAYMENT_STATUS),
      defaultValue: PAYMENT_STATUS.UNPAID,
    },
    shipping_status: {
      type: DataType.ENUM,
      values: Object.values(SHIPPING_STATUS),
      defaultValue: SHIPPING_STATUS.UNFULFILLED,
    },
    comment: {
      type: DataType.TEXT,
      defaultValue: null
    },
    order_info: {
      type: DataType.JSON,
      defaultValue: null
    },
    delivery_info: {
      type: DataType.JSON,
      defaultValue: null,
    },
  },
  {
    updatedAt: "updated_at",
    createdAt: "created_at",
    deletedAt: false
  }
);

export const OrderDetail = Model.define(
  "OrderDetail",
  {
    book_id: {
      type: DataType.INTEGER,
      references: {
        model: Book,
        key: "id"
      }
    },
    order_id: {
      type: DataType.INTEGER,
      references: {
        model: Order,
        key: "id"
      }
    },
    quantity: {
      type: DataType.INTEGER,
      defaultValue: null
    },
    buy_price: {
      type: DataType.DOUBLE,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    tableName: "order_details"
  }
);

Book.belongsToMany(Order, {
  through: "OrderDetail",
  foreignKey: "book_id",
  as: "orders"
});

Book.hasMany(OrderDetail, {
  foreignKey: "book_id",
});

Order.hasMany(OrderDetail, {
  foreignKey: "order_id",
});

Order.belongsToMany(Book, {
  through: "OrderDetail",
  foreignKey: "order_id",
  as: "books"
});

export default Order;
