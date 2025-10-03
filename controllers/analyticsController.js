// const { default: Analytics } = require("../models/Analytics");

const Analytics = require("../models/Analytics");


// const track = async (req, res) => {
//     try {
//         const { eventType, page, productId, userId, extraData } = req.body;

//         const event = new Analytics({
//           eventType,
//           page,
//           productId,
//           userId,
//           extraData,
//         });

//         await event.save();

//         res.status(200).json({ message: "Event tracked successfully" });
//     } catch (error) {
//          res.status(500).json({ error: error.message });
//     }
// }



const CountBuyNowButtonClick = async (req, res) => {
     try {
    const { visitorId, productId, name, timestamp } = req.body;

    await Analytics.create({
      visitorId,
      eventType: "buy_now",
      productId,
      name,
      timestamp,
    });

    res.json({ message: "Buy Now tracked" });
  } catch (error) {
    res.status(500).json({ message: "Error tracking buy now", error });
  }
}

const pageView = async (req, res) => {
 try {
    const {visitorId, productId, name, timestamp} = req.body;

    await Analytics.create({
      visitorId,
      eventType: "page_view",
      productId,
      name,
      timestamp,
    });

    res.json({ success: true, message: "Page view recorded" });
  } catch (err) {
    console.error("Page View Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}




// ✅ Get all analytics events
const getAllAnalytics = async (req, res) => {
  try {
    const data = await Analytics.find().sort({ timestamp: -1 }); // latest first
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get summary (counts by eventType)
const getAnalyticsSummary = async (req, res) => {
  try {
    const summary = await Analytics.aggregate([
      { $group: { _id: "$eventType", total: { $sum: 1 } } },
    ]);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get analytics by productId
const getAnalyticsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const events = await Analytics.find({ productId }).sort({ timestamp: -1 });
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
   CountBuyNowButtonClick, pageView,
  getAllAnalytics,
  getAnalyticsSummary,
  getAnalyticsByProduct,
};




