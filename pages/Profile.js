import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Endpoint from "../data/constant";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserToken } from "../context/UserTokenContext";

const Profile = () => {
  const { isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const { token } = useUserToken();
  const history = useNavigate();
  const [refreshData, setRefreshData] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // State untuk menyimpan detail pesanan yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(Endpoint.BASE_URL + Endpoint.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProfile(response.data.user);
        setUserDetail(response.data.detail);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchDataOrder = async () => {
      try {
        const response = await axios.get(
          Endpoint.BASE_URL + Endpoint.GETORDERBYCUSTOMER,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Filter orders with payment status 'SUCCESS'
        const filteredOrders = response.data.order.filter(
          (order) => order.status_pembayaran === 'SUCCESS'
        );
  
        setOrders(filteredOrders);
  
        const newOrderList = filteredOrders.flatMap((o) => {
          return o.orderdetails.map((d) => ({
            status_pembayaran: o.status_pembayaran,
            status_pesanan: o.status,
            name: d.product_detail.name,
            photo: d.product_detail.photo,
            amount: d.amount, // <-- Periksa properti amount
            id: d.id,
            subtotal: d.subtotal,
            date: o.created_at,
            orderId: o.id,
            price: o.shipment ? o.shipment.price : 0,
          }));
        });
  
        // Group order details by orderId
        const groupedOrders = {};
        newOrderList.forEach((order) => {
          if (!groupedOrders[order.orderId]) {
            groupedOrders[order.orderId] = [];
          }
          groupedOrders[order.orderId].push(order);
        });

        const calculatedOrders = Object.values(groupedOrders).map((group) => {
          const subtotal = group.reduce((acc, curr) => acc + parseFloat(curr.subtotal), 0);
      
          const price = parseFloat(group[0].price);
        
          const total = subtotal + price;
        
          return { ...group[0], total, products: group };
        });        
        
        const sortedOrders = calculatedOrders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
  
        setOrderDetail(sortedOrders);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchDataOrder();
  }, [token, refreshData]);
  
  useEffect(() => {
    isLoggedIn ? () => {} : history("/login");
  }, []);
  
  // Fungsi untuk menampilkan popup dengan detail pesanan
  const handleShowOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
      {userDetail && console.log(userDetail.photo)}
      <div className="container">
        <div className="row mt-3">
          <div className="col-12 bg-light py-2 base-color rounded">
            <h2 className="h4 fw-bold">Aneka Store | Profile</h2>
          </div>
          <div className="col-12 bg-light py-2 base-color mt-2 rounded">
            <h2 className="h5 fw-bold">Alamat Pengiriman</h2>
            <div className="container">
              <div className="row">
                <div className="col-md-5">
                  <div>{profile && profile.name}</div>
                  <div> {userDetail && userDetail.phone}</div>
                </div>
                <div className="col-md-5">
                  <div>{ userDetail && `${userDetail.province}, ${userDetail.city}, ${userDetail.detail_address}` }</div>
                </div>
                <div className="col-md-2">
                  <div>
                    <Link to={`/profile-detail`}>Ubah</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 bg-light py-2 mt-2 base-color rounded">
            <h2 className="h5 fw-bold">Status Pesanan</h2>
            <div className="container-fluid">
              {orderDetail.map((order) => (
                <div key={order.orderId} className="row align-items-center mb-3">
                  <div className="col-md-8">
                    <div className="container">
                      <div className="row align-items-center mb-2">
                        <div className="col-md-2">
                          <img
                            src={`${Endpoint.PRODUCTIMAGE}${order.photo}`}
                            className="img-fluid"
                            style={{ maxWidth: "80px", maxHeight: "80px" }}
                            alt=""
                          />
                        </div>
                        <div className="col-md-10">
                          <div style={{ fontWeight: 'bold' }}>{order.name}</div>
                          <div>ID Order: {order.orderId}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end flex-column">
                    <div className="mb-2 text-end">
                      <div style={{ color: 'green', fontWeight: 'bold' }}>
                        Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.total)}
                      </div>
                      <div>
                        {/* Tambahkan event onClick untuk menampilkan detail pesanan */}
                        <button
                          className="btn btn-sm btn-outline-success px-2 ms-lg-1 ms-sm-0 mt-sm-1 mt-lg-0 shadow-sm custom-button"
                          onClick={() => handleShowOrderDetail(order)}
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk menampilkan detail pesanan */}
      {isModalOpen && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
              <div className="d-flex justify-content-between align-items-center">
              <h5 className="modal-title mb-0 text-sm">Detail Pesanan: {new Date(selectedOrder.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</h5>
              </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedOrder && (
                  <div>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Status:</span>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>{selectedOrder.status_pesanan}</span>
                    </p>
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <img
                              src={`${Endpoint.PRODUCTIMAGE}${product.photo}`}
                              className="img-fluid me-3"
                              style={{ maxWidth: "80px", maxHeight: "80px" }}
                              alt={product.name}
                            />
                            <div>
                              <p><span style={{ fontWeight: 'bold' }}>{product.name}</span></p>
                              <p><span style={{ color: 'green', fontWeight: 'bold'}}>X{product.amount}</span></p>
                            </div>
                          </div>
                          <p className="text-success" style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Pengiriman:</span>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedOrder.price)}</span>
                    </p>
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Pembayaran:</span>
                      <span style={{ color: 'green', fontWeight: 'bold' }}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedOrder.total)}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
