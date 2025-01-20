const clubs = require("../databasemodels/clubs-model");
const User = require("../databasemodels/usermodel");

// Join Club Function
exports.joinClub = async (req, res) => {
    try {
        const { userId, clubId } = req.body;

        // Find the club
        const club = await clubs.findById(clubId);
        if (!club) {
            return res.status(404).json({ success: false, message: "Club not found" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user is already a member of the club
        if (user.clubs.includes(clubId)) {
            return res.status(400).json({ success: false, message: "User is already in the club" });
        }

        // Add user to the club
        user.clubs.push(clubId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully joined the club",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in joining club: " + error.message,
        });
    }
};

// Leave Club Function
exports.leaveClub = async (req, res) => {
    try {
        const { userId, clubId } = req.body;

        // Find the club
        const club = await clubs.findById(clubId);
        if (!club) {
            return res.status(404).json({ success: false, message: "Club not found" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user is in the club
        if (!user.clubs.includes(clubId)) {
            return res.status(400).json({ success: false, message: "User is not a member of this club" });
        }

        // Remove the club from the user's list
        user.clubs = user.clubs.filter((id) => id.toString() !== clubId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully left the club",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in leaving club: " + error.message,
        });
    }
};
