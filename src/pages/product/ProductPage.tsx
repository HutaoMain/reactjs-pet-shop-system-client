import "./ProductPage.css";
import axios from "axios";
import Modal from "react-modal";
import AddProduct from "../../components/ProductComponents/addProduct/AddProduct";

import { useQuery } from "react-query";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add, Delete, ModeEdit, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  confirmationModalCustomStyle,
  productCustomStyle,
} from "../../ZCustomStyle/CustomStyle";
import { getProductInterface } from "../../types/Types";
import Confirmation from "../../components/ConfirmationModal/Confirmation";
import UpdateProduct from "../../components/ProductComponents/UpdateProduct/UpdateProduct";

import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";

Modal.setAppElement("#root");

const ProductPage = () => {
  const { data } = useQuery<getProductInterface[]>({
    queryKey: ["productPage"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_API_URL}/api/product/list`)
        .then((res) => res.data),
  });

  const [paramsId, setParamsId] = useState<string>("");
  const [list, setList] = useState<getProductInterface[]>();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const toggleModalUpdate = (id: any) => {
    setParamsId(id);
    setIsUpdateModalOpen(!isUpdateModalOpen);
  };

  const toggleConfimationModal = (id: any) => {
    console.log("logging id", id);
    setParamsId(id);
    setIsConfirmationOpen(!isConfirmationOpen);
  };

  useEffect(() => {
    setList(data || []);
  }, [data]);

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/product/delete/${id}`
      );

      setList(list?.filter((item) => item._id !== id));
      window.location.reload();
    } catch (err) {}
  };

  const orderColumn: GridColDef[] = [
    {
      field: "productName",
      headerName: "productName",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "description",
      headerName: "description",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "category",
      headerName: "category",
      headerAlign: "center",
      align: "center",
      width: 200,
      // Do dropdown here
    },
    {
      field: "quantity",
      headerName: "quantity",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "vendorPrice",
      headerName: "vendorPrice",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "retailPrice",
      headerName: "retailPrice",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "vendor",
      headerName: "vendor",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "status",
      headerName: "status",
      headerAlign: "center",
      align: "center",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action Button",
      headerAlign: "center",
      align: "center",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="action-btns">
            <button
              className="action-btn edit"
              onClick={() => toggleModalUpdate(params.row._id)}
            >
              <ModeEdit />
              Edit
            </button>

            <button
              className="action-btn delete"
              onClick={() => toggleConfimationModal(params.row._id)}
            >
              <Delete />
              Delete
            </button>
            <Modal
              isOpen={isConfirmationOpen}
              onRequestClose={toggleConfimationModal}
              style={confirmationModalCustomStyle}
              contentLabel="My dialog"
            >
              <Confirmation
                action="delete"
                whatItem="category"
                btnConfirm={() => handleDelete(paramsId)}
                closeModal={toggleConfimationModal}
              />
            </Modal>
          </div>
        );
      },
    },
  ];

  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);

  const toggleProductModal = () => {
    setIsProductModalOpen(!isProductModalOpen);
  };

  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filtered = data?.filter((item) => {
    return (
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="category-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "0",
          marginTop: "20px",
        }}
      >
        <InputBase
          placeholder="Search by Product Name or Description"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: "400px", border: "2px solid black", padding: "0 20px" }}
          endAdornment={
            <IconButton>
              <Search />
            </IconButton>
          }
        />
        <button className="add-category-btn" onClick={toggleProductModal}>
          Add Product <Add />
        </button>
      </div>

      <section className="category-page-datagrid">
        <DataGrid
          rows={filtered ?? []}
          columns={orderColumn}
          getRowId={(row) => row._id}
        />
      </section>
      <Modal
        isOpen={isProductModalOpen}
        onRequestClose={toggleProductModal}
        style={productCustomStyle}
      >
        <AddProduct toggleProductModal={toggleProductModal} />
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={toggleModalUpdate}
        style={productCustomStyle}
      >
        <UpdateProduct
          toggleModalUpdate={toggleModalUpdate}
          paramsId={paramsId}
        />
      </Modal>
    </div>
  );
};

export default ProductPage;
