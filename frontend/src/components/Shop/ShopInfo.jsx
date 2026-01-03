import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import getProductImage from "../../utils/getProductImage";

const ShopInfo = ({ isOwner }) => {
    const [data, setData] = useState({});
    const productsState = useSelector((state) => state.product) || {};
    const { products = [] } = productsState;
    const { seller } = useSelector((state) => state.seller);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();

    const fetchShopInfo = () => {
        setIsLoading(true);
        axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
            setData(res.data.shop);
            setIsLoading(false);
        }).catch((error) => {
            // error fetching shop info
            setIsLoading(false);
        })
    };

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        fetchShopInfo();
    }, [dispatch, id])

    // Refresh shop info when seller data changes (after update)
    useEffect(() => {
        if (seller && seller._id === id) {
            fetchShopInfo();
        }
    }, [seller])



    const logoutHandler = async () => {
        try {
            await axios.get(`${server}/shop/logout`, { withCredentials: true });
            window.location.href = "/shop-login";
        } catch (error) {
            alert("Logout failed!");
        }
    };


    const totalReviewsLength =
        products &&
        products.reduce((acc, product) => acc + product.reviews.length, 0);

    const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0);

    const averageRating = totalRatings / totalReviewsLength || 0;



    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    data && data._id ? (
                        <div>
                            <div className="w-full py-5">
                                <div className="w-full flex item-center justify-center">
                                    <img
                                        src={getProductImage(data.avatar)}
                                        alt=""
                                        className="w-[150px] h-[150px] object-cover rounded-full"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150?text=No+Logo"; }}
                                    />
                                </div>
                                <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
                                <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
                                    {data.description}
                                </p>
                            </div>
                            <div className="p-3">
                                <h5 className="font-[600]">Address</h5>
                                <div className="text-[#000000a6] whitespace-pre-line">{data.address}</div>
                            </div>
                            <div className="p-3">
                                <h5 className="font-[600]">Phone Number</h5>
                                <div className="text-[#000000a6]">
                                    {data.phoneNumber && Array.isArray(data.phoneNumber) ? (
                                        data.phoneNumber.map((contact, idx) => (
                                            <div key={idx}>
                                                {contact.phone} {contact.name && `(${contact.name})`}
                                            </div>
                                        ))
                                    ) : (
                                        data.phoneNumber
                                    )}
                                </div>
                            </div>
                            <div className="p-3">
                                <h5 className="font-[600]">Total Products</h5>
                                <h4 className="text-[#000000a6]">{products && products.length}</h4>
                            </div>
                            <div className="p-3">
                                <h5 className="font-[600]">Shop Ratings</h5>
                                <h4 className="text-[#000000b0]">{averageRating}/5</h4>
                            </div>
                            <div className="p-3">
                                <h5 className="font-[600]">Joined On</h5>
                                <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
                            </div>
                            {isOwner && (
                                <div className="py-3 px-4">
                                    <Link to="/settings">
                                        <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                                            <span className="text-white">Edit Shop</span>
                                        </div>
                                    </Link>

                                    <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                                        onClick={logoutHandler}
                                    >
                                        <span className="text-white">Log Out</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null
                )
            }
        </>
    );
};

export default ShopInfo;