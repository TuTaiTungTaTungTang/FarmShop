import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from "../components/Products/ProductDetails";
import { useParams, useSearchParams } from 'react-router-dom';
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../server';



const ProductDetailsPage = () => {
    const productsState = useSelector((state) => state.product) || {};
    const { allProducts = [] } = productsState;
    const eventsState = useSelector((state) => state.event) || {};
    const { allEvents = [] } = eventsState;
    const { id } = useParams();
    const [data, setData] = useState(null)
    const [searchParams] = useSearchParams();
    const eventData = searchParams.get("isEvent");




    // const productName = name.replace(/-/g, " ");

    useEffect(() => {
        if (eventData !== null) {
            const data = allEvents && allEvents.find((i) => i._id === id);
            setData(data);
        } else {
            const data = allProducts && allProducts.find((i) => i._id === id);
            setData(data);
        }
        // If product not found in redux, fetch directly from backend to ensure we have shop/shopId
        const fetchProduct = async () => {
            if (!data) {
                try {
                    const res = await axios.get(`${server}/product/get-product/${id}`);
                    if (res?.data?.product) {
                        setData(res.data.product);
                        if (process.env.NODE_ENV !== 'production') console.debug('Fetched product from API:', res.data.product);
                    }
                } catch (err) {
                    console.debug('Could not fetch product by id:', err.message || err);
                }
            }
        }
        fetchProduct();
        /* `window.scrollTo(0, 0)` is a JavaScript method that scrolls the window to the top of the page.
        In this code, it is used inside the `useEffect` hook to scroll the window to the top whenever
        the component is rendered. This ensures that when the user navigates to the
        `ProductDetailsPage`, the page starts at the top rather than at the previous scroll position. */
        window.scrollTo(0, 0)
    }, [allProducts, allEvents, data, eventData, id]);



    return (
            <div>
                <Header />
                {data ? (
                    <>
                        <ProductDetails data={data} />
                        {!eventData && <SuggestedProduct data={data} />}
                    </>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Product not found</h2>
                        <p className="text-gray-600">The product you are looking for does not exist or has been removed.</p>
                    </div>
                )}
                <Footer />
            </div>
    )
}

export default ProductDetailsPage
