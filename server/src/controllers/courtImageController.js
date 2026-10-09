const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sunday/courts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
};

const uploadCourtImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ít nhất một ảnh",
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file)),
    );

    const imageUrls = uploadedImages.map((image) => image.secure_url);

    return res.status(200).json({
      success: true,
      message: "Upload ảnh thành công",
      data: {
        images: imageUrls,
      },
    });
  } catch (error) {
    console.error("Upload court images error:", error);

    return res.status(500).json({
      success: false,
      message: "Không thể upload ảnh lên Cloudinary",
    });
  }
};

module.exports = {
  uploadCourtImages,
};
