const clubs = require("../databasemodels/clubs-model")

const User = require("../databasemodels/usermodel")


exports.joinclub = async(req,resizeBy,next)=>{
    try {
        const {userId,clubId} = req.body;

        const club =  await clubs.findOne({clundId: clubId})


        if (!club) {
            return res.status(404).json({ success: false, message: "Club not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.clubs.includes(clubId)) {
            return res.status(400).json({ success: false, message: "User already in the club" });
        }

        user.clubs.push(clubId);
        await user.save();


        res.status(200).json({
            success: true,
            message: "Successfully joined the club",
            user,
        });
        
    } catch (error) {
        res.status(500).json({message:"error in joining club " +error.message})
    }
}


exports.joinclub = async (req,res)=>{
    try {
        const {clubId,userId} = req.body

        const club = await clubs.findById(clubId);

        if(!club){
            return res.status(404).json({
                success: false,
                message: "Club not found",
            });
        }
        else {
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
    
            }
            if (!user.clubs.includes(clubId)) {
                return res.status(400).json({ success: false, message: "user is not there in clubs" });
            }
        }

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}