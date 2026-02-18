const Marks = require("../databasemodels/marksmodel");
const User=require("../databasemodels/usermodel")
const multer = require("multer");
const fs = require('fs');
const uploadDir = '/tmp/uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const getmarks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }

    const userId = req.user._id;

    const filter = {
      reserversId: userId
    };

    const marks = await Marks.find(filter);

    const filteredMarks = marks.map(mark => {
      const reserverId = mark.reserversId;

      if (reserverId.toString() === userId.toString()) {
        return {
          ...mark.toObject(),
          img: {
            data: mark.img.data,
            contentType: mark.img.contentType
          }
        };
      } else {
        return {
          ...mark.toObject(),
          img: {
            contentType: mark.img.contentType
          }
        };
      }
    });

    res.status(200).json({
      success: true,
      data: filteredMarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve marks"
    });
  }
};


const uploadmarks = async (req, res) => {
  upload.single('img')(req, res, async function (err) {
      if (err) {
          console.error(`Error: ${err}`);
          return res.status(500).json({
              success: false,
              error: err.message
          });
      }

      try {
          const { rollNumber, semester, reserversId } = req.body;

          if (!rollNumber || !semester || !reserversId) {
              return res.status(400).json({
                  success: false,
                  error: "Roll number, semester, and reserver ID are required"
              });
          }

          if (!req.file) {
              return res.status(400).json({
                  success: false,
                  error: "Marks image is required"
              });
          }

          const imgData = fs.readFileSync(req.file.path);
          const uploadmarksdata = {
              rollNumber,
              semester,
              img: {
                  data: imgData,
                  contentType: req.file.mimetype
              },
              user: req.user._id,
              reserversId
          };

          const marks = await Marks.create(uploadmarksdata);
          res.status(201).json({
              success: true,
              marks
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              error: error.message
          });
      }
  });
};
const getrollnumber = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          RollNumber: {
            $regex: new RegExp(req.query.keyword, 'i'),
          },
        }
      : {};

    const rollNumbers = await User.find(keyword, 'RollNumber');

    res.status(200).json(rollNumbers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch roll numbers' });
  }
}



module.exports = {
    uploadmarks,
    getmarks,
    getrollnumber,
};