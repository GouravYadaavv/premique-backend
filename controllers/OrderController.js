const { ROLES } = require("../utils/constants");
const Order = require("../models/Order");
const User = require("../models/User");

const getOrdersByUserId = async (req, res) => {
  const userId = req.id;

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.id",
        select: "price images name quantity",
      });
    // const order = await Order.find({ userId }).sort({ createdAt: -1 }).populate("products.id");

    if (!orders)
      return res
        .status(404)
        .json({ success: false, message: "No orders to show" });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  const { page, limit } = req.query;

  try {
    const orders = await Order.find()
      .populate({
        path: "products.id",
        select: "name price category images",
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    if (!orders)
      return res
        .status(404)
        .json({ success: false, message: "No orders to show" });

    const count = await Order.countDocuments();

    return res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({ success: false, message: "Access denied" });
  }

  // const { paymentId } = req.params;
  const { status } = req.body;
   const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndUpdate(
      // { razorpayPaymentId: paymentId },
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res
      .status(200)
      .json({ success: true, data: order, message: "order status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMatrics = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(403).json({
      success: false,
      message: "you are not authorized to access this resources",
    });
  }

  const { startDate, endDate } = req.query;

  try {
    const start = new Date(
      startDate || new Date().setMonth(new Date().getMonth() - 1)
    );
    const end = new Date(endDate || new Date());

    // Calculate total sales
    const ordersInRange = await Order.find({
      createdAt: { $gte: start, $lt: end },
    });
    const totalSales = ordersInRange.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0
    );

    // Calculate this month's order
    const thisMonthOrders = ordersInRange;

    // Get the last month
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

    //Calculate last month's orders
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: lastMonth, $lt: start },
    });

    //Calculate total amount of this month's orders
    const totalThisMonth = thisMonthOrders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0
    );

    //Calculate total amount of last month's orders
    const totalLastMonth = lastMonthOrders.reduce(
      (acc, order) => acc + (order.totalPrice || 0),
      0
    );

    //Calculate growth
    const salesGrowth = totalLastMonth
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : 0;

    //Calculate Users
    const thisMonthUsers = await User.find({
      createdAt: { $gte: start, $lt: end },
    });

    const lastMonthUsers = await User.find({
      createdAt: { $gte: lastMonth, $lt: start },
    });

    const usersGrowth = lastMonthUsers.length
      ? ((thisMonthUsers.length - lastMonthUsers.length) /
          lastMonthUsers.length) *
        100
      : 0;

    //Calculate Users purchased in last hours
    const lastHour = new Date(new Date().setHours(new Date().getHours() - 1));

    const lastHourOrders = await Order.find({
      createdAt: { $gte: lastHour, $lte: new Date() },
    });

    const previousDayOrders = await Order.find({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    });

    const lastHourGrowth = previousDayOrders.length
      ? (lastHourOrders.length / previousDayOrders.length) * 100
      : 0;

    //Recent Sales
    const recentOrders = await Order.find()
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .limit(9);

    //products delivered in last 6 months  with their category and count according to month
    const sixMonthsAgo = new Date(
      new Date().setMonth(new Date().getMonth() - 6)
    );

    const sixMonthsOrders = await Order.find({
      createdAt: { $gte: sixMonthsAgo },
    }).populate({
      path: "products.id",
      select: "category",
    });

    //Get them month wise for eg: {jan: {keyboard:1, mouse:2, headset:0}}
    const monthWise = sixMonthsOrders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      order.products.forEach((product) => {
        if (!acc[month]) {
          acc[month] = {};
        }

        if (!acc[month][product.id.category]) {
          acc[month][product.id.category] = 1;
        } else {
          acc[month][product.id.category]++;
        }
      });
      return acc;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalSales: {
          count: totalSales,
          growth: salesGrowth,
        },
        users: {
          count: thisMonthUsers.length,
          growth: usersGrowth,
        },
        sales: {
          count: totalThisMonth,
          growth: salesGrowth,
        },
        activeNow: {
          count: lastHourOrders.length,
          growth: lastHourGrowth,
        },
        recentSales: {
          count: totalThisMonth,
          users: recentOrders,
        },
        sixMonthsBarChartData: monthWise,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
;}

const createOrder =async (req, res) => {
    
    try {

      const userId = req.id; // Auth middleware se aayega
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
        const user = await User.findById(userId).select("phone");
        if (user) {
          req.phone = user.phone;
        }
        

      const {
        products,phone,address,paymentMethod,status,} = req.body;
   

      // Simple validation
      // if (!products || !products.length) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Cart is empty" });
      // }

      // if (
      //   !address ||
      //   !address.state ||
      //   !address.city ||
      //   !address.street ||
      //   !address.pincode
      // ) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Address is incomplete" });
      // }

      // Create order

       const finalPhone = phone && phone.trim() !== "" ? phone : req.phone;

       if (!finalPhone) {
         return res
           .status(400)
           .json({ success: false, message: "Phone number is required" });
       }
      const order = await Order.create({
        userId,
      
       
        phone: finalPhone,
        address,
        paymentMethod,
        products,
       
        status: status || "pending",
      });

      return res.status(201).json({ success: true, data: order });
    } catch (error) {
   
      res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = {getOrdersByUserId, getAllOrders, updateOrderStatus, getMatrics, createOrder};