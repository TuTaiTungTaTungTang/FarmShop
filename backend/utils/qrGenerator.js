const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

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
    // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = process.env.FRONTEND_URL || 'https://farm-shop-eight.vercel.app';
    const encodedProductId = Buffer.from(productId.toString()).toString('base64');
    const traceabilityUrl = `${frontendUrl}/production/detail?pId=${encodedProductId}&tId=${traceabilityId}`;
    
    // Tạo thư mục uploads/qr-codes nếu chưa có
    const qrDir = path.join(__dirname, '../uploads/qr-codes');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }
    
    // Tên file QR unique
    const qrFileName = `qr-${productId}-${timestamp}.png`;
    const qrFilePath = path.join(qrDir, qrFileName);
    
    // Tạo QR code với styling giống FaceFarm (màu xanh lá farm)
    await QRCode.toFile(qrFilePath, traceabilityUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D5016', // Màu xanh lá đậm farm-style
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' // Medium error correction
    });
    
    console.log(`✅ QR Code generated: ${qrFileName}`);
    
    return {
      success: true,
      qrCodePath: `/qr-codes/${qrFileName}`,
      qrCodeUrl: traceabilityUrl,
      traceabilityId: traceabilityId,
      fileName: qrFileName,
      message: `QR code tạo thành công cho sản phẩm: ${productData.name || 'Unknown'}`
    };
    
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
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
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