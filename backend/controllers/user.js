const express = require("express");
const User = require("../databasemodels/usermodel");
const sendToken = require("../utilities/jwt");
const crypto = require("crypto");
const { sendEmail } = require("../utilities/mailer");
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { Username, RollNumber, password, conformpassword, Email, PhoneNumber, role } = req.body;

    const user = await User.create({ Username, RollNumber, password, conformpassword, Email, PhoneNumber, role });

    sendToken(user, 201, res);
  } catch (err) {
    console.error('Error creating the account:', err);
    res.status(400).json({ message: "Error creating the account"});
  }
};


exports.login = async (req, res) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
      return res.status(400).json({ message: 'Please enter valid email and password' });
  }

  try {
      const user = await User.findOne({ Email }).select("+password").select("+userId")

      if (!user) {
          return res.status(400).json({ message: 'Email or password are wrong.' });
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
          return res.status(400).json({ message: 'Email or password are wrong.' });
      }

      // Call sendToken to generate and send the response
      sendToken(user, 200, res);

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Your account has been logged out"
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { Email } = req.body;

  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: `User with email ${Email} not found`,
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset-password/${user._id}/${resetToken}`;

    const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you have not requested this email, please ignore it.`;

    
    console.log(message);

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.Email} successfully`,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      _id: id,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Password reset token is invalid or has expired",
      });
    }

    // Update user password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    
    sendToken(user, 200, res); 
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: "fail",
      message: "An error occurred while resetting the password",
    });
  }
};


exports.getmeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").select("-conformpassword");

    res.status(200).json({
      success: true,
      user: {
        Username: user.Username,
        RollNumber: user.RollNumber,
        Year: user.createdAt.getFullYear(),  // Assuming the year is based on the account creation date
        Attendance: user.Attendance // Assuming Attendance is a field in the database
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getallUser = async (req, res, next) => {
  const users = await User.find().select("-password").select("-conformpassword");

  res.status(200).json({
    success: true,
    users,
  });
};

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    // const { token } = req.cookies;
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      console.log("Token not found");
      return res.status(401).send("Unauthorized: Token not found");
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    
    next();
  } catch (error) {
    console.error("Error in isAuthenticatedUser middleware:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed" });
    }
    next();
  };
};

exports.updateusername = async (req,res,next) =>{
  try {
    const { Username } = req.body;
    if (!Username) {
        return res.status(400).send({ message: 'Username is required' });
    }
    req.user.Username = Username;
    await req.user.save();
    res.send({ message: 'Username updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating username:', error);
    res.status(500).send({ message: 'Server error' });
}
}

exports.updatepassword = async (req,res,next) =>{
  try {
    const { password } = req.body;
    if (!password) {
        return res.status(400).send({ message: 'Password is required' });
    }
    req.user.password = password;
    await req.user.save();
    res.send({ message: 'Password updated successfully', user: req.user });
} catch (error) {
    res.status(500).send({ message: 'Server error', error });
}
}

exports.updatePhoneNumber = async (req,res,next) =>{
  try {
    const { PhoneNumber } = req.body;
    if (!PhoneNumber) {
        return res.status(400).send({ message: 'Phone number is required' });
    }
    req.user.PhoneNumber = PhoneNumber;
    await req.user.save();
    
    res.send({ message: 'Phone number updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating phone number:', error.message);
    res.status(500).send({ message: 'Server error' });
}
}

exports.updatedescription = async (req,res,next) =>{
  try {
    const { description } = req.body;
    if (!description) {
        return res.status(400).send({ message: 'description is required' });
    }
    req.user.description = description;
    await req.user.save();
    
    res.send({ message: 'description updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating description link:', error.message);
    res.status(500).send({ message: 'Server error' });
}
}


exports.updateGithub = async (req,res,next) =>{
  try {
    const { Github } = req.body;
    if (!Github) {
        return res.status(400).send({ message: 'github is required' });
    }
    req.user.Github = Github;
    await req.user.save();
    console.log(await req.user.save())
    res.send({ message: 'github updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating github link:', error.message);
    res.status(500).send({ message: 'Server error' });
}
}


exports.updateinstagram = async (req,res,next) =>{
  try {
    const { instagram } = req.body;
    if (!instagram) {
        return res.status(400).send({ message: 'instagram is required' });
    }
    req.user.instagram = instagram;
    await req.user.save();
    
    res.send({ message: 'instagram updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating instagram link:', error.message);
    res.status(500).send({ message: 'Server error' });
}
}

exports.updatelinkedIn = async (req,res,next) =>{
  try {
    const { linkedIn } = req.body;
    if (!linkedIn) {
        return res.status(400).send({ message: 'linkedIn is required' });
    }
    req.user.linkedIn = linkedIn;
    await req.user.save();
    
    res.send({ message: 'linkedIn updated successfully', user: req.user });
} catch (error) {
    console.error('Error updating linkedIn link:', error.message);
    res.status(500).send({ message: 'Server error' });
}
}

exports.makeAdmin = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = 'ADMIN';
    await user.save();
    
    res.status(200).json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
}