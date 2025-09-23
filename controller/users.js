
import validator from "validator";
import bcrypt from "bcrypt";
import User from "../model/user.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // If you're attaching user to req (e.g. from middleware), extend Request type
    const userId = req.user?._id;

    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing details: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (min 6 characters)",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const UserData = {
      username,
      email,
      password: hashedPassword,
      userId,
      _id: userId,
      createdAt: Date.now(),
    };

    // Save to database
    const user = new User(UserData);
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      // token: generateToken(user._id),
      message: "User created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error registering user:", error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.json({ success: false, message: "An unknown error occurred" });
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        // token: generateToken(user._id),
        message: "Logged in successfully",
      });
    }

    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging in user:", error.message);
      res.json({ success: false, message: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.json({ success: false, message: "An unknown error occurred" });
    }
  }
};
