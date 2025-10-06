import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsAdmin } from "../../redux/actions/product";
import { Button } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { adminProducts = [], adminProductsLoading } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAllProductsAdmin());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  adminProducts &&
    adminProducts.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "US$ " + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <div className="w-full mx-8 pt-1 mt-10 bg-white">
      {adminProductsLoading ? (
        <div>Loading...</div>
      ) : adminProducts.length === 0 ? (
  <div className="text-center text-gray-500 py-4">Không tìm thấy sản phẩm.</div>
      ) : (
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      )}
    </div>
  );
};

export default AllProducts;
