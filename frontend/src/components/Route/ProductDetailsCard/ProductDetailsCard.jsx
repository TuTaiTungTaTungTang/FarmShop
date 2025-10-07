import React, { useEffect, useState } from 'react'
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"
import { addTocart } from "../../../redux/actions/cart"
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import getProductImage from "../../../utils/getProductImage";
import currency from "../../../utils/currency";
const ProductDetailsCard = ({ setOpen, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const [count, setCount] = useState(1)
    const [click, setClick] = useState(false)
    // safe shop id for products that may only contain shopId or an embedded shop object
    const shopId = data ? (data.shop?._id || data.shopId) : null;
    // normalize shop avatar/name for seed shapes (e.g., shop.shop_avatar.url)
    const shop = data?.shop || null;
    const shopAvatar = shop?.avatar || shop?.shop_avatar?.url || shop?.shop_avatar || shop?.avatarUrl || null;
    const shopName = shop?.name || shop?.shop_name || data?.shop?.shop_name || "Unknown Shop";
    // select state not used in this small card; keep minimal state

    const handleMessageSubmit = () => {

    }

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }
    const incrementCount = () => {
        setCount(count + 1)
    }

    // Add to cart
    const addToCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);

        if (isItemExists) {
            toast.error("item already in cart!")
        } else {
            if (data.stock < count) {
                toast.error("Product stock limited!");
            } else {
                const cartData = { ...data, qty: count };
                dispatch(addTocart(cartData));
                toast.success("Item added to cart Successfully!")
            }
        }
    }


    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist, data._id]);

    // Remove from wish list 
    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
    }

    // add to wish list
    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data))
    }


    return (
        <>
            <div className='bg-[#fff]'>
                {
                    data ? (
                        <div className='fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center'>
                            <div className='w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4'>
                                <RxCross1
                                    size={30}
                                    className="absolute right-3 top-3 z-50"
                                    onClick={() => setOpen(false)}
                                />

                                <div className="block w-full 800px:flex">
                                    <div className='w-full 800px:w-[50%]'>
                                        <img
                                            src={getProductImage(data.images && data.images[0])}
                                            alt="img"
                                            onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
                                        />
                                        <div className='flex' >
                                            {data.shop && (
                                                (shopId) ? (
                                                    <Link to={`/shop/preview/${shopId}`} className="flex">
                                                        <img
                                                            src={getProductImage(shopAvatar)}
                                                            alt=""
                                                            className='w-[50px] h-[50px] rounded-full mr-2'
                                                            onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100?text=No+Logo"; }}
                                                        />
                                                        <div>
                                                            <h3 className={`${styles.shop_name}`}>
                                                                {shopName}
                                                            </h3>
                                                            <h5 className="pb-3 text-[15px]">
                                                                (4.5) Ratings
                                                            </h5>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <img
                                                            src={getProductImage(shopAvatar)}
                                                            alt=""
                                                            className='w-[50px] h-[50px] rounded-full mr-2'
                                                            onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100?text=No+Logo"; }}
                                                        />
                                                        <div>
                                                            <h3 className={`${styles.shop_name}`}>
                                                                {shopName}
                                                            </h3>
                                                            <h5 className="pb-3 text-[15px]">
                                                                (4.5) Ratings
                                                            </h5>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        <div
                                            className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
                                            onClick={handleMessageSubmit}
                                        >
                                            <span className="text-[#fff] flex items-center">
                                                Send Message <AiOutlineMessage className="ml-1" />
                                            </span>
                                        </div>
                                        <h5 className="text-[16px] text-[red] mt-5">({data.total_sell}) Sold out</h5>


                                    </div>
                                    {/* right */}
                                    <div
                                        className='w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]'
                                    >
                                        <h1 className={`${styles.productTitle} text-[20px]`} >
                                            {data.name}
                                        </h1>
                                        <p>{data.description}</p>

                                        <div className='flex  pt-3 '>
                                            <h4 className={`${styles.productDiscountPrice}`}>
                                                {currency.formatPriceFromUsd(data.discountPrice)}
                                            </h4>
                                            <h3 className={`${styles.price}`}>
                                                {data.originalPrice ? currency.formatPriceFromUsd(data.originalPrice) : null}
                                            </h3>
                                        </div>


                                        <div className="flex items-center mt-12 justify-between pr-3">
                                            <div>
                                                <button
                                                    className='bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out'
                                                    onClick={decrementCount}
                                                >
                                                    -
                                                </button>

                                                <span className='bg-gray-200 text-gray-800 font-medium px-4 py-[11px]' >
                                                    {count}
                                                </span>

                                                <button
                                                    className='bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out'
                                                    onClick={incrementCount}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div>
                                                {
                                                    click ? (
                                                        <AiFillHeart
                                                            size={30}
                                                            className='cursor-pointer'
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
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div
                                            className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                                            onClick={() => addToCartHandler(data._id)}
                                        >
                                            <span className="text-[#fff] flex items-center">
                                                Add to cart <AiOutlineShoppingCart className="ml-1" />
                                            </span>
                                        </div>

                                    </div>




                                </div>

                            </div>

                        </div>

                    ) : null
                }

            </div>

        </>
    )
}

export default ProductDetailsCard