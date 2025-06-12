const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User");

const router = express.Router()

JWT_SECRET = process.env.JWT_SECRET
// Roles 
const rolePrefixes = {
    staff: "STF",
    admin: "ADM",
    transport: "TRP",
};
  
// Branch Code Map
const branchCodes = {
mumbai: "MUM",
delhi: "DEL",
chennai: "CHN",
kolkata: "KOL",
};
  
// Generate Unique Staff ID
async function generateStaffId(role, branch) {
    const rolePrefix = rolePrefixes[role.toLowerCase()] || "STF";
    const branchCode = branchCodes[branch.toLowerCase()] || "GEN";
    let nextId = "00001";
  
    try {
      const latestUser = await User.findOne({ role})
        .sort({ createdAt: -1 })
        .select("_id");
  
      if (latestUser && latestUser._id) {
        const lastDigits = parseInt(latestUser._id.slice(-5), 10) + 1;
        nextId = String(lastDigits).padStart(5, "0");
      }
    } catch (error) {
      console.error("Error generating staff ID:", error);
      // Fallback logic still applies
    }
  
    return `${rolePrefix}${branchCode}${nextId}`;
}

router.get("/latest", async (req, res) => {
    const latestUser = await generateStaffId("staff", "mumbai");
    res.status(200).json({ "latestid": latestUser });
  });

// Register (Customers)
router.post("/register/customer", async (req, res) => {
    try{
        const {name, email, password, cpasswd} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser)
            return res.status(400).json({message: "User Already Exist"});

        const hashPassword = await bcrypt.hash(password, 11);

        const newUser = new User({name, email, password:hashPassword, role});
        await newUser.save()

        res.status(201).json({message:"User Registered Successfully"});
    }
    catch(error){
        res.status(500).json({message: "Server Error", error});
    }
});

// Register (Admin Only)
router.post("/signup/staff", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User Already Exists" });
  
      const staffID = await generateStaffId(role, "mumbai");
      const hashPassword = await bcrypt.hash(password, 11);
  
      const newUser = new User({
        _id: staffID, 
        name: name,
        email: email,
        password: hashPassword,
        role: role
      });
  
      const dbRes = await newUser.save();
      console.log("Output:", dbRes);
  
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  
      res.status(201).json({ token, message: "User Registered Successfully" });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  });
  

// Login
router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user)
            return res.status(400).json({message:"Invalid Credentials"});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            return res.status(400).json({message:"Invalid Credentials"});

        const token = jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn:"1d"});

        res.status(200).json({ token:token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });       
    }
});

// Add Tracking ID (Customer Only)
router.post("/add-tracking", async (req, res) => {
    try {
      const { trackingId } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (user.role !== "customer")
        return res.status(403).json({ message: "Access Denied" });
  
      if (!user.trackingIds.includes(trackingId)) {
        user.trackingIds.push(trackingId);
        await user.save();
      }
  
      res.status(200).json({ message: "Tracking ID added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding tracking ID", error });
    }
});

//Logout
router.post("/logout", (req, res) => {
    try {
      // In a stateless JWT setup, logout just clears the token on the client
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed", error });
    }
});

// User Count
router.get("/count", async (req, res) => {
    try {
      const userCount = await User.countDocuments({});
      res.status(200).json({ count: userCount });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user count", error });
    }
  });

module.exports = router;

//----------------------------------------------------------------------------------

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET;

// // Roles
// const rolePrefixes = {
//   staff: "STF",
//   admin: "ADM",
//   transport: "TRP",
// };

// // Branch Code Map
// const branchCodes = {
//   mumbai: "MUM",
//   delhi: "DEL",
//   chennai: "CHN",
//   kolkata: "KOL",
// };

// // Generate Unique Staff ID
// async function generateStaffId(role, branch) {
//   const rolePrefix = rolePrefixes[role.toLowerCase()] || "STF";
//   const branchCode = branchCodes[branch.toLowerCase()] || "GEN";
//   let nextId = "00001";

//   try {
//     const latestUser = await User.findOne({ role }).sort({ createdAt: -1 }).select("_id");
//     if (latestUser && latestUser._id) {
//       const lastDigits = parseInt(latestUser._id.slice(-5), 10) + 1;
//       nextId = String(lastDigits).padStart(5, "0");
//     }
//   } catch (error) {
//     console.error("Error generating staff ID:", error);
//   }

//   return `${rolePrefix}${branchCode}${nextId}`;
// }

// // Get latest generated staff ID (for testing)
// router.get("/latest", async (req, res) => {
//   const latestUser = await generateStaffId("staff", "mumbai");
//   res.status(200).json({ latestid: latestUser });
// });

// // // Register (Customer)
// // router.post("/register/customer", async (req, res) => {
// //   try {
// //     const { name, email, password, cpasswd } = req.body;

// //     if (password !== cpasswd) {
// //       return res.status(400).json({ message: "Passwords do not match" });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser)
// //       return res.status(400).json({ message: "User Already Exists" });

// //     const hashPassword = await bcrypt.hash(password, 11);

// //     const newUser = new User({
// //       name,
// //       email,
// //       password: hashPassword,
// //       role: "customer",
// //     });

// //     await newUser.save();
// //     res.status(201).json({ message: "Customer Registered Successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server Error", error });
// //   }
// // });

// router.post("/register/customer", async (req, res) => {
//   try {
//     const { name, email, password, cpasswd } = req.body;

//     if (!name || !email || !password || !cpasswd) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== cpasswd) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User Already Exists" });

//     const hashPassword = await bcrypt.hash(password, 11);
//     const role = "customer";

//     const newUser = new User({ name, email, password: hashPassword, role });
//     await newUser.save();

//     res.status(201).json({ message: "Customer Registered Successfully" });
//   } catch (error) {
//     console.error("Customer Signup Error:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });


// // Register (Admin adds Staff)
// router.post("/signup/staff", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User Already Exists" });

//     const staffID = await generateStaffId(role, "mumbai");
//     const hashPassword = await bcrypt.hash(password, 11);

//     const newUser = new User({
//       _id: staffID,
//       name,
//       email,
//       password: hashPassword,
//       role,
//     });

//     const dbRes = await newUser.save();
//     console.log("Output:", dbRes);

//     const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

//     res.status(201).json({ token, message: "Staff Registered Successfully" });
//   } catch (error) {
//     console.error("Signup Error:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: "Invalid Credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("User found:", user.email);
//     console.log("Password match:", isMatch);

//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid Credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // Add Tracking ID (Customer Only)
// router.post("/add-tracking", async (req, res) => {
//   try {
//     const { trackingId } = req.body;

//     const user = await User.findById(req.user.id);
//     if (user.role !== "customer")
//       return res.status(403).json({ message: "Access Denied" });

//     if (!user.trackingIds.includes(trackingId)) {
//       user.trackingIds.push(trackingId);
//       await user.save();
//     }

//     res.status(200).json({ message: "Tracking ID added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding tracking ID", error });
//   }
// });

// // Logout
// router.post("/logout", (req, res) => {
//   try {
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Logout failed", error });
//   }
// });

// // User Count
// router.get("/count", async (req, res) => {
//   try {
//     const userCount = await User.countDocuments({});
//     res.status(200).json({ count: userCount });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching user count", error });
//   }
// });

// module.exports = router;
