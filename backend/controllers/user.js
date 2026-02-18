const express = require("express");
const User = require("../databasemodels/usermodel");
const sendToken = require("../utilities/jwt");
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

// Password reset feature removed - use admin panel to reset user passwords
exports.forgotPassword = async (req, res, next) => {
  return res.status(501).json({
    success: false,
    message: "Password reset feature has been disabled. Please contact an administrator."
  });
};

// Password reset feature removed - use admin panel to reset user passwords
exports.resetPassword = async (req, res, next) => {
  return res.status(501).json({
    success: false,
    message: "Password reset feature has been disabled. Please contact an administrator."
  });
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
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    
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