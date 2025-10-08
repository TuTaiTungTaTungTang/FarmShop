import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import axios from 'axios';
import { server, backend_url } from '../server';
import styles from '../styles/styles';
import getProductImage from "../utils/getProductImage";
import currency from "../utils/currency";

const ProductTraceabilityPage = () => {
  const [searchParams] = useSearchParams();
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tId = searchParams.get('tId'); // Traceability ID
    
    if (tId) {
      fetchTraceabilityData(tId);
    } else {
      setError('Không tìm thấy mã traceability trong URL');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchTraceabilityData = async (traceId) => {
    try {
  // fetching traceability data for: traceId
      const response = await axios.get(`${server}/product/traceability/${traceId}`);
      
      if (response.data.success) {
        setTraceData(response.data.data);
  // traceability data loaded
      } else {
        setError('Không thể tải thông tin traceability');
      }
    } catch (error) {
      // traceability fetch error
      if (error.response?.status === 404) {
        setError('Không tìm thấy sản phẩm với mã traceability này');
      } else {
        setError('Có lỗi xảy ra khi tải thông tin traceability');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin truy xuất...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Lỗi Truy Xuất</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!traceData) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
                        <p className="text-gray-600">Đang tải thông tin truy xuất...</p>
                      </div>
                    </div>
                    <Footer />
                  </div>
                );
              }

              if (error) {
                return (
                  <div>
                    <Header />
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-700 mb-2">Lỗi Truy Xuất</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                          Quay lại
                        </button>
                      </div>
                    </div>
                    <Footer />
                  </div>
                );
              }

              if (!traceData) {
                return (
                  <div>
                    <Header />
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600">Không có dữ liệu traceability</p>
                      </div>
                    </div>
                    <Footer />
                  </div>
                );
              }

              const { product, shop, traceability } = traceData;

              return (
                <div>
                  <Header />
                  <div className={`${styles.section} py-8 min-h-screen bg-[#f5f6fb]`}>
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h1 className="text-3xl font-bold mb-2">🌱 Báo Cáo Truy Xuất Nguồn Gốc Sản Phẩm</h1>
                            <p className="text-lg opacity-90 mb-1">Traceability Report - Farm to Table</p>
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 inline-block">
                              <p className="font-mono text-lg">Mã truy xuất: <span className="font-bold">{traceability.traceabilityId?.slice(-16)}</span></p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center mt-6 md:mt-0">
                            {traceability.qrCodePath && (
                              <img
                                src={
                                  traceability.qrCodePath.startsWith('http')
                                    ? traceability.qrCodePath
                                    : `${backend_url}${traceability.qrCodePath}`
                                }
                                alt="QR Code"
                                className="w-32 h-32 bg-white rounded-lg shadow-md border-4 border-green-200"
                              />
                            )}
                            <span className="text-xs mt-2">Quét để xác thực</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                          {/* Product Section */}
                          <div className="bg-gray-50 rounded-lg p-6 shadow">
                            <h2 className="text-2xl font-bold mb-4 text-green-700">📦 Thông Tin Sản Phẩm</h2>
                            <img
                              src={getProductImage(product.images[0])}
                              alt={product.name}
                              className="w-full h-56 object-cover rounded-lg mb-4 border"
                            />
                            <table className="w-full text-sm mb-4">
                              <tbody>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Tên sản phẩm:</td>
                                  <td className="font-semibold">{product.name}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Danh mục:</td>
                                  <td>{product.category}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Giá bán:</td>
                                  <td className="text-green-700 font-bold">{currency.formatPriceFromUsd(product.discountPrice)}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Giá gốc:</td>
                                  <td>{currency.formatPriceFromUsd(product.originalPrice)}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Tồn kho:</td>
                                  <td>{product.stock} sản phẩm</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Đã bán:</td>
                                  <td>{product.sold_out} sản phẩm</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Tags:</td>
                                  <td>{product.tags || 'Không có'}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Đánh giá:</td>
                                  <td>⭐ {product.ratings || 0}/5</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Mô tả:</td>
                                  <td>{product.description}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="text-xs text-gray-500">
                              Ngày sản xuất: {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                              <br />
                              Tuổi sản phẩm: {traceability.productAge} ngày
                            </div>
                          </div>

                          {/* Shop Section */}
                          <div className="bg-blue-50 rounded-lg p-6 shadow">
                            <h2 className="text-2xl font-bold mb-4 text-blue-700">🏪 Thông Tin Cửa Hàng / Nhà Sản Xuất</h2>
                            <div className="flex items-center mb-4">
                              <img
                                src={getProductImage(shop.avatar)}
                                alt="Shop Avatar"
                                className="w-16 h-16 rounded-full border-4 border-white shadow-md mr-4"
                              />
                              <div>
                                <h3 className="text-xl font-bold text-blue-800">{shop.name}</h3>
                                <p className="text-gray-600">{shop.email}</p>
                              </div>
                            </div>
                            <table className="w-full text-sm mb-4">
                              <tbody>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Điện thoại:</td>
                                  <td>{shop.phoneNumber || 'Chưa cập nhật'}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Địa chỉ:</td>
                                  <td>{shop.address || 'Chưa cập nhật'}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Tham gia:</td>
                                  <td>{shop.createdAt ? new Date(shop.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</td>
                                </tr>
                                <tr>
                                  <td className="font-medium text-gray-600 py-1">Mô tả:</td>
                                  <td>{shop.description || 'Chưa cập nhật'}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="text-xs text-gray-500">
                              Đánh giá cửa hàng: ⭐ {shop.ratings || 0}/5
                            </div>
                          </div>
                        </div>

                        {/* Timeline Traceability */}
                        <div className="bg-green-50 rounded-lg p-6 mb-8 shadow">
                          <h2 className="text-2xl font-bold mb-6 text-green-700">⏱️ Dòng Thời Gian Truy Xuất</h2>
                          <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-300"></div>
                            <div className="space-y-8">
                              {/* Production */}
                              <div className="flex items-start space-x-4">
                                <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg z-10">
                                  🌱
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                                  <h4 className="font-bold text-green-700 mb-2">Sản Xuất</h4>
                                  <p className="text-gray-600 text-sm">
                                    Sản phẩm được tạo vào {new Date(product.createdAt).toLocaleString('vi-VN')}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    Tuổi sản phẩm: {traceability.productAge} ngày
                                  </p>
                                </div>
                              </div>
                              {/* Quality Check */}
                              <div className="flex items-start space-x-4">
                                <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg z-10">
                                  ✅
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                                  <h4 className="font-bold text-blue-700 mb-2">Kiểm Tra Chất Lượng</h4>
                                  <p className="text-gray-600 text-sm">
                                    Sản phẩm đã qua kiểm tra chất lượng và được phê duyệt
                                  </p>
                                  {product.ratings && (
                                    <p className="text-gray-500 text-xs mt-1">
                                      Đánh giá trung bình: ⭐ {product.ratings}/5
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Scan Event */}
                              <div className="flex items-start space-x-4">
                                <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg z-10">
                                  📱
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                                  <h4 className="font-bold text-purple-700 mb-2">Quét Mã QR</h4>
                                  <p className="text-gray-600 text-sm">
                                    Được quét vào {new Date(traceability.scanTime).toLocaleString('vi-VN')}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    Truy xuất thành công từ hệ thống
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* QR Code Display */}
                        {traceability.qrCodePath && (
                          <div className="text-center bg-gray-50 rounded-lg p-6">
                            <h3 className="text-xl font-bold mb-4 text-gray-700">📲 Mã QR Truy Xuất</h3>
                            <div className="inline-block bg-white p-4 rounded-lg shadow-md">
                              <img 
                                src={
                                  traceability.qrCodePath.startsWith('http')
                                    ? traceability.qrCodePath
                                    : `${backend_url}${traceability.qrCodePath}`
                                }
                                alt="QR Code"
                                className="w-32 h-32 mx-auto"
                              />
                              <p className="text-sm text-gray-500 mt-2">Chia sẻ để truy xuất</p>
                            </div>
                          </div>
                        )}

                        {/* Back Button */}
                        <div className="text-center mt-8">
                          <button 
                            onClick={() => window.history.back()}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md"
                          >
                            ← Quay lại
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Footer />
                </div>
              );
            };

            export default ProductTraceabilityPage;