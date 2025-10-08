
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary if environment variables are set. If not, we'll
// fall back to writing QR files to the local uploads/qr-codes folder.
let useCloudinary = false;
if (process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  useCloudinary = true;
} else {
  console.warn('⚠️ Cloudinary not configured - QR images will be written to backend/uploads/qr-codes');
}

// Đảm bảo cloudinary đã được cấu hình ở backend/multer.js hoặc .env

/**
 * Tạo QR code cho sản phẩm (giống FaceFarm)
 * @param {string} productId - ID của sản phẩm
 * @param {object} productData - Dữ liệu sản phẩm
 * @returns {object} Kết quả tạo QR code
 */
const generateProductQR = async (productId, productData) => {
  try {
    // Tạo traceability ID unique (mã hóa base64 giống FaceFarm)
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const traceabilityId = Buffer.from(`PROD_${productId}_${timestamp}_${randomStr}`).toString('base64');

    // Tạo URL truy xuất nguồn gốc (giống cấu trúc FaceFarm)
    const frontendUrl = process.env.FRONTEND_URL || 'https://agritechsolution.vercel.app';
    const encodedProductId = Buffer.from(productId.toString()).toString('base64');
    const traceabilityUrl = `${frontendUrl}/production/detail?pId=${encodedProductId}&tId=${traceabilityId}`;

    // Tạo QR code buffer
    const qrBuffer = await QRCode.toBuffer(traceabilityUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D5016',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    if (useCloudinary) {
      // Upload buffer lên Cloudinary
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "farmshop/qr-codes",
              resource_type: "image",
              format: "png",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(qrBuffer).pipe(stream);
        });

      const uploadResult = await uploadStream();

      return {
        success: true,
        qrCodePath: uploadResult.secure_url, // URL Cloudinary
        qrCodeUrl: traceabilityUrl,
        traceabilityId: traceabilityId,
        fileName: uploadResult.public_id,
        message: `QR code tạo thành công cho sản phẩm: ${productData.name || 'Unknown'}`,
      };
    }

    // Fallback: write QR buffer to local uploads/qr-codes folder
    const uploadsDir = path.join(__dirname, "../uploads/qr-codes");
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileName = `${traceabilityId}.png`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, qrBuffer);

      // Return a local path (frontend/backoffice can use backend static serving)
      const publicPath = `/qr-codes/${fileName}`; // note: backend serves uploads/ as static root
      return {
        success: true,
        qrCodePath: publicPath,
        qrCodeUrl: traceabilityUrl,
        traceabilityId: traceabilityId,
        fileName: fileName,
        message: `QR code written to local uploads for product: ${productData.name || 'Unknown'}`,
      };
    } catch (err) {
      throw err;
    }
  } catch (error) {
    console.error('❌ QR generation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Không thể tạo QR code'
    };
  }
};

/**
 * Tạo QR code dạng base64 (không lưu file)
 * @param {string} productId - ID của sản phẩm  
 * @param {object} productData - Dữ liệu sản phẩm
 * @returns {object} QR code base64
 */
const generateProductQRBase64 = async (productId, productData) => {
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const traceabilityId = Buffer.from(`PROD_${productId}_${timestamp}_${randomStr}`).toString('base64');
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://agritechsolution.vercel.app';
    const encodedProductId = Buffer.from(productId.toString()).toString('base64');
    const traceabilityUrl = `${frontendUrl}/production/detail?pId=${encodedProductId}&tId=${traceabilityId}`;
    
    // Tạo QR code base64
    const qrBase64 = await QRCode.toDataURL(traceabilityUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D5016',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
    
    return {
      success: true,
      qrCodeBase64: qrBase64,
      qrCodeUrl: traceabilityUrl,
      traceabilityId: traceabilityId,
      message: 'QR code base64 tạo thành công'
    };
    
  } catch (error) {
    console.error('❌ QR base64 generation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Không thể tạo QR code base64'
    };
  }
};

/**
 * Xóa QR code file cũ
 * @param {string} qrCodePath - Đường dẫn QR code cần xóa
 */
const deleteQRFile = (qrCodePath) => {
  try {
    if (qrCodePath) {
      const fullPath = path.join(__dirname, '../uploads', qrCodePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Deleted old QR file: ${qrCodePath}`);
      }
    }
  } catch (error) {
    console.error('❌ Error deleting QR file:', error);
  }
};

module.exports = {
  generateProductQR,
  generateProductQRBase64,
  deleteQRFile
};