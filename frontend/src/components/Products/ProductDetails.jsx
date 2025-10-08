import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { HiQrCode } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

import getProductImage from "../../utils/getProductImage";
import currency from "../../utils/currency";

const ProductDetails = ({ data }) => {
  const productsState = useSelector((state) => state.product) || {};
  const { products = [] } = productsState;
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [showTraceabilityModal, setShowTraceabilityModal] = useState(false);
  // the setters are intentionally kept for future traceability calls
  /* eslint-disable-next-line no-unused-vars */
  const [traceabilityData, setTraceabilityData] = useState(null);
  /* eslint-disable-next-line no-unused-vars */
  const [loadingTrace, setLoadingTrace] = useState(false);
  const navigate = useNavigate();

  // If the product does not include an embedded `shop` object but has `shopId`,
  // fetch the shop info so we can render avatar/name correctly.
  const [remoteShop, setRemoteShop] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchShop = async () => {
      try {
        if (data && !data.shop && data.shopId) {
          const res = await axios.get(`${server}/shop/get-shop-info/${data.shopId}`);
          if (active && res?.data?.shop) setRemoteShop(res.data.shop);
        }
      } catch (err) {
        // ignore - keep remoteShop null
        if (process.env.NODE_ENV !== 'production') console.debug('Could not fetch shop info:', err?.message || err);
      }
    };
    fetchShop();
    return () => { active = false; };
  }, [data]);

  // displayShop prefers embedded shop, fallback to fetched remoteShop
  const displayShop = data ? (data.shop || remoteShop) : null;

  // Normalize displayShop shape so components can read `.avatar` and `.name` consistently
  const displayShopNormalized = displayShop
    ? {
        ...displayShop,
        avatar:
          displayShop.avatar ||
          displayShop.shop_avatar?.url ||
          displayShop.shop_avatar ||
          displayShop.avatarUrl ||
          null,
      }
    : null;

  // safe shop id: prefer the shop._id from the displayShop (embedded or fetched)
  const shopId = displayShopNormalized?._id || data?.shopId || null;

    // removed development debug logs

  useEffect(() => {
    dispatch(getAllProductsShop(shopId));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [shopId, data, wishlist, dispatch]);

  // Remove from wish list
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  // add to wish list
  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  // Add to cart
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);

    if (isItemExists) {
      toast.error("item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart Successfully!");
      }
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);
  // product-level rating (use product's own rating when available)
  const productRating = data?.ratings ?? 0;

  // Sand message
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = shopId;
      if (!sellerId) {
        toast.error("Seller information is not available");
        return;
      }
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || error.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  // Traceability-related network calls are handled inline where needed.

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={getProductImage(data && data.images[select])}
                  alt=""
                  className="w-[80%]"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${select === index ? "border" : ""} cursor-pointer`}
                        onClick={() => setSelect(index)}
                      >
                        <img
                          src={getProductImage(i)}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* Rtght */}
              <div className="w-full 800px:w-[50%] pt-5 ">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {currency.formatPriceFromUsd(data.discountPrice)}
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? currency.formatPriceFromUsd(data.originalPrice) : null}
                  </h3>
                </div>

                {/* inc dec option */}
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>

                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>

                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to Cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  {shopId ? (
                    <Link to={`/shop/preview/${shopId}`}>
                      <img
                        src={getProductImage(displayShopNormalized?.avatar)}
                        alt=""
                        className="w-[50px] h-[50px] rounded-full mr-2"
                      />
                    </Link>
                  ) : (
                    <div className="w-[50px] h-[50px] rounded-full mr-2 bg-gray-100" aria-hidden="true" />
                  )}

                  <div className="pr-8">
                    {shopId ? (
                      <Link to={`/shop/preview/${shopId}`}>
                        <h3 className={`${styles.shop_name} pb-1 pt-1 cursor-pointer`}>
                          {displayShopNormalized?.name || "Unknown Shop"}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>{displayShopNormalized?.name || "Unknown Shop"}</h3>
                    )}
                    <h5 className="pb-3 text-[15px]">
                      {" "}
                      ({productRating.toFixed(1)}/5) Ratings
                    </h5>
                  </div>

                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details  info */}
          <ProductDetailsInfo
            data={data}
            shopForInfo={displayShopNormalized}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
            showTraceabilityModal={showTraceabilityModal}
            setShowTraceabilityModal={setShowTraceabilityModal}
            traceabilityData={traceabilityData}
            loadingTrace={loadingTrace}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

// Move ProductDetailsInfo outside of ProductDetails
const ProductDetailsInfo = ({
  data,
  shopForInfo,
  products,
  totalReviewsLength,
  averageRating,
  showTraceabilityModal,
  setShowTraceabilityModal,
  traceabilityData,
  loadingTrace,
}) => {
  const [active, setActive] = useState(1);

  // local shop id for nested component
  const localShopId = shopForInfo?._id || data?.shopId || null;
  const shop = shopForInfo || data?.shop || null;
  const shopRating = shop?.ratings ?? data?.ratings ?? 0;

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        {/* Tab QR Code */}
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(4)}
          >
            QR Code
          </h5>
          {active === 4 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line  ">
            {data.description}
          </p>
        </>
      ) : null}
      {/* QR Code Section */}
      {active === 4 && data.qrCode && (
  <div className="flex flex-col items-center py-8">
    <HiQrCode className="text-green-600 text-3xl mb-2" />
    <img
      src={getProductImage(data.qrCode)}
      alt="QR Code truy xuất"
      className="w-32 h-32 cursor-pointer"
      onClick={() => {
        // Chuyển hướng sang trang truy xuất nguồn gốc
        const encodedProductId = btoa(data._id);
        window.location.href = `/production/detail?pId=${encodedProductId}&tId=${data.traceabilityId}`;
      }}
    />
    <p className="text-xs text-center mt-2 text-gray-500">
      Quét hoặc nhấp vào để truy xuất nguồn gốc sản phẩm
    </p>
  </div>
)
}
      {/* Product Rev */}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                <img
                  src={getProductImage(item.user.avatar)}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 ? (
        <>
          <div className="w-full block 800px:flex p-5 ">
            <div className="w-full 800px:w-[50%]">
              <div className="flex items-center">
                {localShopId ? (
                  <Link to={`/shop/preview/${localShopId}`}>
                    <div className="flex items-center">
                      <img
                        src={getProductImage(shop?.avatar)}
                        className="w-[50px] h-[50px] rounded-full"
                        alt=""
                      />
                      <div className="pl-3">
                        <h3 className={`${styles.shop_name}`}>
                          {shop?.name || "Unknown Shop"}
                        </h3>
                        <h5 className="pb-3 text-[15px]">({shopRating.toFixed(1)}/5) Ratings</h5>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center">
                    <img
                      src={getProductImage(shop?.avatar)}
                      className="w-[50px] h-[50px] rounded-full"
                      alt=""
                    />
                    <div className="pl-3">
                      <h3 className={`${styles.shop_name}`}>{shop?.name || "Unknown Shop"}</h3>
                      <h5 className="pb-3 text-[15px]">({averageRating}/5) Ratings</h5>
                    </div>
                  </div>
                )}
              </div>

              <p className="pt-2">{shop?.description}</p>
            </div>

            <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
              <div className="text-left">
                <h5 className="font-[600]">
                  Joined on:{" "}
                  <span className="font-[500]">
                    {data.shop?.createdAt?.slice(0, 10)}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Total Products:{" "}
                  <span className="font-[500]">
                    {products && products.length}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Total Reviews:{" "}
                  <span className="font-[500]">{totalReviewsLength}</span>
                </h5>
                    {localShopId ? (
                      <Link to={`/shop/preview/${localShopId}`}>
                        <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                          <h4 className="text-white">Visit Shop</h4>
                        </div>
                      </Link>
                    ) : (
                      <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3 opacity-60 cursor-not-allowed`}>
                        <h4 className="text-white">Visit Shop</h4>
                      </div>
                    )}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* 🌱 Traceability Modal */}
      {showTraceabilityModal && traceabilityData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">🌱 Thông Tin Truy Xuất Nguồn Gốc</h2>
                  <p className="mt-1 opacity-90">
                    Mã truy xuất: {traceabilityData.traceability?.traceabilityId?.slice(-12)}
                  </p>
                </div>
                <button
                  onClick={() => setShowTraceabilityModal(false)}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image & Basic Info */}
                <div>
                  <img
                    src={getProductImage(traceabilityData.product.images[0])}
                    alt={traceabilityData.product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <h3 className="text-xl font-bold mb-2">{traceabilityData.product.name}</h3>
                  <p className="text-gray-600 mb-4">{traceabilityData.product.description}</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 Thông Tin Cơ Bản</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Danh mục:</span> {traceabilityData.product.category}</p>
                      <p><span className="font-medium">Giá gốc:</span> {currency.formatPriceFromUsd(traceabilityData.product.originalPrice)}</p>
                      <p><span className="font-medium">Giá bán:</span> {currency.formatPriceFromUsd(traceabilityData.product.discountPrice)}</p>
                      <p><span className="font-medium">Tồn kho:</span> {traceabilityData.product.stock} sản phẩm</p>
                      <p><span className="font-medium">Đã bán:</span> {traceabilityData.product.sold_out} sản phẩm</p>
                    </div>
                  </div>
                </div>
                {/* Traceability Details */}
                <div className="space-y-4">
                  {/* Production Info */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 text-green-700">📋 Thông Tin Sản Xuất</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Ngày sản xuất:</span> {new Date(traceabilityData.product.createdAt).toLocaleDateString('vi-VN')}</p>
                      <p><span className="font-medium">Tuổi sản phẩm:</span> {traceabilityData.traceability.productAge} ngày</p>
                      <p><span className="font-medium">Tags:</span> {traceabilityData.product.tags || 'Không có'}</p>
                      {traceabilityData.product.ratings && (
                        <p><span className="font-medium">Đánh giá:</span> ⭐ {traceabilityData.product.ratings}/5</p>
                      )}
                    </div>
                  </div>
                  {/* Shop Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg mb-3 text-blue-700">🏪 Thông Tin Cửa Hàng</h4>
                    <div className="flex items-start space-x-3">
                      {traceabilityData.shop.avatar && (
                        <img
                          src={getProductImage(traceabilityData.shop.avatar)}
                          alt="Shop Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-lg">{traceabilityData.shop.name}</p>
                        <p className="text-sm text-gray-600">{traceabilityData.shop.email}</p>
                        <p className="text-sm text-gray-600">{traceabilityData.shop.phoneNumber}</p>
                        <p className="text-sm text-gray-600">{traceabilityData.shop.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tham gia: {new Date(traceabilityData.shop.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Verification */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-lg mb-3 text-green-700">✅ Xác Thực</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Thời gian quét:</span> {new Date(traceabilityData.traceability.scanTime).toLocaleString('vi-VN')}</p>
                      <div className="flex items-center text-green-600 mt-3">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Sản phẩm đã được xác thực nguồn gốc</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Close Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowTraceabilityModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Loading Overlay */}
      {loadingTrace && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-700">Đang tải thông tin truy xuất...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;