import { useNavigate, useParams } from "react-router-dom";
import dataProduct from "../data/product";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import RelatedProduct from "./RelatedProduct";
import Endpoint from "../data/constant";
import axios from "axios";
import { useUserToken } from "../context/UserTokenContext";
import { addCart } from "../api/Cart";
import { CartContext } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const ProductDetail = () => {
  const params = useParams();
  const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
  const { token, setToken } = useUserToken();
  const history = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(0);

  // Fungsi untuk mengubah angka menjadi format Rupiah tanpa tanda koma di belakang
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    axios
      .get(Endpoint.BASE_URL + Endpoint.VIEWPRODUCT + "/" + params.id, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setProduct(response.data.product);
        console.log(response.data.product);
      })
      .catch((error) => {
        console.error("Gagal melakukan permintaan:", error);
      });
  }, []);

  const handleQty = (event) => {
    setQty(event.target.value);
  };

  const addOne = () => {
    setQty(parseInt(qty) + 1);
  };

  const delOne = () => {
    parseInt(qty) <= 0 ? setQty(0) : setQty(parseInt(qty) - 1);
  };

  const { add } = useContext(CartContext);

  const addToCart = async () => {
    if (!isLoggedIn) {
      history("/login");
      return;
    }

    // Cek apakah qty lebih dari 0 sebelum menambahkan ke keranjang
    if (parseInt(qty) > 0) {
      // Cek apakah jumlah pembelian melebihi stok
      if (parseInt(qty) > product.stock) {
        alert("Jumlah pembelian melebihi stok.");
        return;
      }

      try {
        await add(product.id, qty);
      } catch (error) {
        console.log("Error when adding to cart " + error);
      }
    } else {
      alert(
        "Jumlah pembelian harus lebih dari 0 untuk menambahkan ke keranjang."
      );
    }
  };
  
  return (
    <>
      <div className="container mt-3 text-center">
        <div className="row">
          <div className="col-md-6 mb-2">
            <img
              src={product && `${Endpoint.PRODUCTIMAGE}${product.photo}`}
              className="img img-fluid w-50"
              alt=""
            />
          </div>
          <div className="col-md-6 text-start mb-2">
            <table className="table table-borderless">
              <tbody className="m-3">
                <tr>
                  <th scope="col" className="text-muted">
                    Nama Produk
                  </th>
                  <th scope="col">{product && product.name}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Harga
                  </th>
                  <th scope="col">
                    {product && `${formatRupiah(product.price)}`}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Stock
                  </th>
                  <th scope="col">{product && `${product.stock}`}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Pengiriman
                  </th>
                  <th scope="col">JNE - TIKI - POS - Pengiriman Toko</th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Paket
                  </th>
                  <th scope="col">
                    {product &&
                      product.discounts.map((e, index) => (
                        <div key={index} className="mb-2">
                          Beli{" "}
                          {`${e.constraint} Dus, Dengan Harga ${formatRupiah(
                            parseInt(product.price) * parseInt(e.constraint) -
                              parseInt(e.discounts) * parseInt(e.constraint)
                          )}`}
                        </div>
                      ))}
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Kuantitas
                  </th>
                  <th scope="col">
                    <div className="col-md-6 d-flex">
                      <button
                        className="btn btn-outline-success h-50"
                        onClick={delOne}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="number"
                        className="form-control w-55 mx-2"
                        value={qty}
                        onChange={handleQty}
                      />
                      <button
                        className="btn btn-outline-success h-50"
                        onClick={addOne}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted"></th>
                  <th scope="col">
                    {/* Tambahkan kondisi untuk menonaktifkan tombol ketika qty === 0 */}
                    {parseInt(qty) > 0 ? (
                      <button
                        className="btn btn-outline-success"
                        onClick={addToCart}
                      >
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="me-1"
                        />
                        Masukkan Keranjang
                      </button>
                    ) : (
                      <button className="btn btn-outline-success" disabled>
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="me-1"
                        />
                        Masukkan Keranjang
                      </button>
                    )}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-12 text-start bg-light p-3">
            <h2 className="h4">Spesifikasi Produk</h2>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th scope="col" className="text-muted">
                    No. Registrasi
                  </th>
                  <th scope="col">{product && `PR00${product.id}`}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Kategori
                  </th>
                  <th scope="col">{product && product.category_name}</th>
                </tr>
                <tr>
                  <th scope="col" className="text-muted">
                    Berat
                  </th>
                  <th scope="col">{product && `${product.weight} gram`}</th>
                </tr>
              </tbody>
            </table>
            <hr className="bg-dark border-5 border-top border-dark" />
            <h2 className="h4">Deskripsi Produk</h2>
            <p>{product && product.description}</p>
          </div>
          <div className="col-md-12 p-0">
            {product && <RelatedProduct productId={product.id} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
