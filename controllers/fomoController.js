const Product = require("../models/Product");

// ------------------- Utility ------------------- //
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------------------- Live Visitors (Global) ------------------- //
// Range by Time
function getRangeForHour(hour) {
  if (hour >= 10 && hour <= 22) {
    return { min: 200, max: 1000 }; // din
  } else {
    return { min: 80, max: 500 }; // raat
  }
}

// Drift Logic (for live visitors)
function driftVisitors(current, min, max) {
  let direction;

  if (current < min + 200) {
    direction = Math.random() < 0.8 ? 1 : -1; // mostly up
  } else if (current > max - 200) {
    direction = Math.random() < 0.8 ? -1 : 1; // mostly down
  } else {
    direction = Math.random() < 0.5 ? 1 : -1;
  }

  const step = randomBetween(1, 20);
  let next = current + direction * step;

  return Math.max(min, Math.min(max, next));
}

// Initial random once
let { min, max } = getRangeForHour(new Date().getHours());
let liveVisitors = randomBetween(min, max);

setInterval(() => {
  const hour = new Date().getHours();
  const { min, max } = getRangeForHour(hour);

  liveVisitors = driftVisitors(liveVisitors, min, max);
}, 10000);

const getLiveVisitors = (req, res) => {
  res.json({ count: liveVisitors });
};

// ------------------- Product Viewers ------------------- //
let productViewers = {}; // { productId: count }

// Initialize products with random viewers
const initializeViewers = async () => {
  try {
    const products = await Product.find({}, "_id");
    products.forEach((p) => {
      if (!productViewers[p._id]) {
        productViewers[p._id] = randomBetween(5, 15); // start small
      }
    });
  } catch (err) {
    console.error("Error initializing product viewers:", err);
  }
};
initializeViewers();

// Drift logic for products (1–40 loop style)
function driftProduct(current) {
  const min = 1;
  const max = 40;

  let change = 0;

  if (current >= max) {
    change = -randomBetween(0, 2);
  } else if (current <= min) {
    change = randomBetween(0, 2);
  } else {
    change = randomBetween(-1, 1); // -1, 0, +1
  }

  let updated = current + change;
  return Math.max(min, Math.min(max, updated));
}

const updateViewers = () => {
  for (let productId in productViewers) {
    productViewers[productId] = driftProduct(productViewers[productId]);
  }
};
setInterval(updateViewers, 15000);

const getViewers = (req, res) => {
  const productId = req.params.productId;

  if (!(productId in productViewers)) {
    productViewers[productId] = randomBetween(5, 15);
  }

  res.json({ count: productViewers[productId] });
};

// ------------------- Popup ------------------- //
let currentPopup = null;
const names = ["Rohit", "Anjali", "Karan", "Sneha", "Amit", "Priya"]; // shorten here for demo
const cities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Pune", "Jaipur"];
const offers = ["just ordered", "grabbed 50% OFF", "claimed special offer"];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const generatePopup = async () => {
  try {
    const products = await Product.find({}, "_id name");
    if (products.length === 0) return;

    const randomProduct = pickRandom(products);

    currentPopup = {
      name: pickRandom(names),
      city: pickRandom(cities),
      product: {
        title: randomProduct.name,
        link: `/product/${encodeURIComponent(randomProduct._id)}`,
      },
      offer: pickRandom(offers),
    };
  } catch (err) {
    console.error("Error generating popup:", err);
  }
};

generatePopup();
setInterval(generatePopup, 10000 + Math.random() * 15000);

const getPopup = (req, res) => {
  res.json({ popup: currentPopup || null });
};

// ------------------- Exports ------------------- //
module.exports = { getViewers, getLiveVisitors, getPopup };

// // const Product = require("./models/Product");

// const Product = require("../models/Product");

// // Har waqt ke liye range decide karna
// // ------------------- Range by Time ------------------- //
// function getRangeForHour(hour) {
//   if (hour >= 10 && hour <= 22) {
//     return { min: 200, max: 1000 }; // din mein zyada
//   } else {
//     return { min: 80, max: 500 }; // raat mein kam
//   }
// }

// // ------------------- Drift Logic ------------------- //
// function drift(current, min, max) {
//   let direction;

//   if (current < 300) {
//     // 80% chance upar jaane ka
//     direction = Math.random() < 0.8 ? 1 : -1;
//   } else if (current > 700) {
//     // 80% chance neeche jaane ka
//     direction = Math.random() < 0.8 ? -1 : 1;
//   } else {
//     // beech mein 50-50 chance
//     direction = Math.random() < 0.5 ? 1 : -1;
//   }

//   // Random step size (1–20)
//   const step = Math.floor(Math.random() * 20) + 1;

//   let next = current + direction * step;

//   // Clamp within min and max
//   return Math.max(min, Math.min(max, next));
// }

// // ------------------- Live Visitors (Global) ------------------- //
// let liveVisitors = 372; // initial

// setInterval(() => {
//   const hour = new Date().getHours();
//   const { min, max } = getRangeForHour(hour);
//   // Initial count hamesha [min, max] ke beech se
//   // let next = Math.floor(Math.random() * (max - min + 1)) + min;

//   liveVisitors = drift(liveVisitors, min, max);
// }, 10000); // 10 sec mein ek update

// const getLiveVisitors = (req, res) => {
//   res.json({ count: liveVisitors });
// };

// // ------------------- Product Viewers ------------------- //
// let productViewers = {}; // { productId: count }

// // Initialize products with random viewers
// const initializeViewers = async () => {
//   try {
//     const products = await Product.find({}, "_id");
//     products.forEach((p) => {
//       if (!productViewers[p._id]) {
//         productViewers[p._id] = Math.floor(Math.random() * 11) + 5; // start 5–15
//       }
//     });
//   } catch (err) {
//     console.error("Error initializing product viewers:", err);
//   }
// };

// initializeViewers();

// // Drift logic (1–40 loop style)
// function drift(current) {
//   const min = 1;
//   const max = 40;
//   let change = 0;

//   // Agar max ke paas hai toh neeche girne ka chance zyada
//   if (current >= max) {
//     change = -Math.floor(Math.random() * 3); // -0, -1, -2
//   }
//   // Agar min ke paas hai toh badhne ka chance zyada
//   else if (current <= min) {
//     change = Math.floor(Math.random() * 3); // 0, +1, +2
//   }
//   // Beech mein random upar/neeche
//   else {
//     change = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
//   }

//   let updated = current + change;

//   // Range ke andar hi rakho
//   if (updated < min) updated = min;
//   if (updated > max) updated = max;

//   return updated;
// }

// // Update all product viewers
// const updateViewers = () => {
//   for (let productId in productViewers) {
//     productViewers[productId] = drift(productViewers[productId]);
//   }
// };

// setInterval(updateViewers, 15000); // 15 sec mein update

// // API: Get viewers of a single product
// const getViewers = (req, res) => {
//   const productId = req.params.productId;

//   if (!(productId in productViewers)) {
//     productViewers[productId] = Math.floor(Math.random() * 11) + 5; // 5-15 init
//   }

//   res.json({ count: productViewers[productId] });
// };

// // popupController.js

// let currentPopup = null;

// // names array (100 names)
// const names = [
//   "Rohit","Anjali","Karan","Sneha","Amit","Priya","Arjun","Neha","Vikas","Pooja",
//   "Rahul","Sanya","Varun","Rhea","Siddharth","Nikita","Kunal","Simran","Aakash","Tanvi",
//   "Raj","Isha","Sameer","Megha","Tarun","Shreya","Ankit","Ritika","Harsh","Aarti",
//   "Nikhil","Divya","Kiran","Sonal","Aditya","Swati","Manish","Rupal","Vineet","Shilpa",
//   "Pranav","Naina","Raghav","Anushka","Ramesh","Payal","Suraj","Neelam","Jay","Tanisha",
//   "Saurabh","Kanika","Mohit","Sneha","Yash","Pallavi","Dev","Shweta","Abhishek","Komal",
//   "Anirudh","Vaishnavi","Rajesh","Priyanka","Vijay","Riya","Parth","Karishma","Anuj","Shivani",
//   "Rajat","Ayesha","Mayank","Sakshi","Kartik","Pooja","Rohan","Divya","Aman","Nidhi",
//   "Siddhi","Tanya","Naveen","Isha","Akash","Neha","Raghav","Richa","Aniket","Seema",
//   "Dhruv","Aparna","Jayant","Muskan","Vikram","Bhavya","Adarsh","Prerna","Ritesh","Tanvi"
// ];
// // cities array (100 cities)
// const cities = [
//   "Delhi","Mumbai","Bangalore","Kolkata","Pune","Jaipur","Hyderabad","Chennai","Lucknow","Ahmedabad",
//   "Gurgaon","Noida","Indore","Bhopal","Surat","Nagpur","Patna","Varanasi","Mysore","Coimbatore",
//   "Thane","Rajkot","Solapur","Jodhpur","Amritsar","Vadodara","Ludhiana","Agra","Nashik","Allahabad",
//   "Gwalior","Vijayawada","Tirupati","Durgapur","Mangalore","Ranchi","Dehradun","Kolhapur","Udaipur","Shimla",
//   "Bhubaneswar","Jabalpur","Jamnagar","Hubli","Belgaum","Gorakhpur","Ajmer","Cuttack","Salem","Aligarh",
//   "Meerut","Kozhikode","Gaya","Tiruchirappalli","Bhavnagar","Kakinada","Kota","Warangal","Guntur","Firozabad",
//   "Bharuch","Mathura","Ujjain","Muzaffarpur","Shimoga","Hosur","Panaji","Nellore","Ambala","Sikar",
//   "Kolhapur","Sambalpur","Satara","Palakkad","Tirunelveli","Mysuru","Vellore","Kanchipuram","Tirupati","Hisar",
//   "Puri","Ajmer","Guwahati","Shillong","Itanagar","Aizawl","Imphal","Gangtok","Kohima","Bikaner",
//   "Jammu","Srinagar","Leh","Kargil","Pondicherry","Daman","Diu","Silvassa","Port Blair","Kavaratti"
// ];
// const offers = ["just ordered", "grabbed 50% OFF", "claimed special offer"];

// // Function to pick random element
// function pickRandom(arr) {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// // Generate popup every 10–25 seconds
// const generatePopup = async () => {
//   try {
//     const products = await Product.find({}, "_id name"); // fetch all products
//     if (products.length === 0) return;

//     const randomProduct = pickRandom(products);

//     currentPopup = {
//       name: pickRandom(names),
//       city: pickRandom(cities),
//       product: {
//         title: randomProduct.name,
//         link: `/product/${encodeURIComponent(randomProduct._id)}`,
//       },
//       offer: pickRandom(offers),
//     };
//   } catch (err) {
//     console.error("Error generating popup:", err);
//   }
// };

// // Call once immediately
// generatePopup();

// // Update interval every 10–25 sec
// setInterval(generatePopup, 10000 + Math.random() * 15000);

// const getPopup = (req, res) => {
//   if (!currentPopup) return res.json({ popup: null });
//   res.json({ popup: currentPopup });
// };

// module.exports = { getViewers, getLiveVisitors, getPopup };

// let productViewers = {}; // { productId: count }

// // Initialize products with random viewers
// const initializeViewers = async () => {
//   try {
//     const products = await Product.find({}, "_id");
//     products.forEach((p) => {
//       if (!productViewers[p._id]) {
//         productViewers[p._id] = Math.floor(Math.random() * 11) + 5; // 5-15 start
//       }
//     });
//   } catch (err) {
//     console.error("Error initializing product viewers:", err);
//   }
// };

// initializeViewers();

// // Product range din/raat ke hisaab se
// function getProductRange(hour) {
//   if (hour >= 10 && hour <= 22) {
//     return { min: 10, max: 40 };
//   } else {
//     return { min: 3, max: 15 };
//   }
// }

// // Update all product viewers
// const updateViewers = () => {
//   const hour = new Date().getHours();
//   const { min, max } = getProductRange(hour);

//   for (let productId in productViewers) {
//     productViewers[productId] = drift(productViewers[productId], min, max);
//   }
// };

// setInterval(updateViewers, 15000); // 15 sec mein update

// // API: Get viewers of a single product
// const getViewers = (req, res) => {
//   const productId = req.params.productId;

//   if (!(productId in productViewers)) {
//     productViewers[productId] = Math.floor(Math.random() * 11) + 5; // 5-15 init
//   }

//   res.json({ count: productViewers[productId] });
// };

// liveVisitorsController.js
// let liveVisitors = 250; // module-level, server-wide

// setInterval(() => {
//   const hour = new Date().getHours();
//   const increaseChance = hour >= 4 && hour < 24 ? 0.5 : 0.5;
//   let change =
//     Math.random() < increaseChance
//       ? Math.floor(Math.random() * 3) + 1
//       : -(Math.floor(Math.random() * 3) + 1);
//   liveVisitors += change;
//   if (liveVisitors < 100) liveVisitors = 100;
//   if (liveVisitors > 1000) liveVisitors = 1000;
// }, 5000);

// const getLiveVisitors = (req, res) => {
//   res.json({ count: liveVisitors });
// };

// // productViewersController.js
// // Mongoose Product model

// // Object to hold live viewers for all products
// let productViewers = {}; // { productId: count }

// // Initialize viewers from database
// const initializeViewers = async () => {
//   try {
//     const products = await Product.find({}, "_id"); // fetch all product IDs
//     products.forEach((p) => {
//       if (!productViewers[p._id]) {
//         // Random initial viewers between 5-15
//         productViewers[p._id] = Math.floor(Math.random() * 11) + 5;
//       }
//     });

//   } catch (err) {
//     console.error("Error initializing product viewers:", err);
//   }
// };

//   initializeViewers();

// // Update viewers every 5 seconds
// const updateViewers = () => {
//   for (let productId in productViewers) {
//     const change = Math.random() > 0.5 ? 1 : -1;
//     productViewers[productId] += change;

//     if (productViewers[productId] < 1) productViewers[productId] = 1;
//     if (productViewers[productId] > 26) productViewers[productId] = 26;
//   }
// };

// // Start interval
// setInterval(updateViewers, 5000);

// // Route handler to get viewers of a product
// const getViewers = (req, res) => {
//   const productId = req.params.productId;
//   if (!(productId in productViewers)) {
//     // initialize if new product
//     productViewers[productId] = Math.floor(Math.random() * 11) + 5;
//   }
//   res.json({ count: productViewers[productId] });
// };
