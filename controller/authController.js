const crypto = require("crypto");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");

// Utils
const signToken = (id) => {
  console.log(id);
  const secret = process.env.JWT_SECRET;
  const expiresIn = `${process.env.JWT_EXPIRES_IN}d`;

  return jwt.sign({ id: id }, secret, {
    expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  try {
    const token = signToken(user._id);

    const expiresIn = process.env.JWT_EXPIRES_IN;
    const cookieExpires = new Date(
      Date.now() + expiresIn * 24 * 60 * 60 * 1000
    );

    const cookieOptions = {
      expires: cookieExpires,
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res
      .status(statusCode)
      .set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      })
      .json({
        status: "success",
        token,
        data: {
          user,
        },
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Middleware
exports.protect = async (req, res, next) => {
  let token;
  // 1. Getting token and check of its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new Error("Invalid Access...PLz login to Continue"));

  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new Error("The user Belonging to this token, no longing exist")
    );

  // 4. check if user changed password after the token issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(new Error("User recently changed password! plz log in again."));
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;

  next();
};

// EndPoints
exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // passwordChangedAt: req.body.passwordChangedAt,
    }); // creating an object from data sent in req.body

    res
      .status(201)
      .set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      })
      .json({
        status: "success",
        data: {
          user: {
            username: user.username,
            email: user.email,
          },
        },
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1. check if email and password exist
    if (!email || !password)
      return next(new Error("Please Provide email & password!"));

    // 2. check if user exist && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new Error("Incorrect email or password"));
    }

    // 3. If everything's ok send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "logged Out", {
      expires: new Date(Date.now() + 10 * 1),
      httpOnly: true,
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
