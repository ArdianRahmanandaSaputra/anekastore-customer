import { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Endpoint from "../data/constant";
import { useUserToken } from "../context/UserTokenContext";
import axios from "axios";

const Profile = () => {
    // const { transaction, setTranscation } = useContext(TransactionContext);
    // const { login, setLogin } = useContext(LoginContext);
    const transaction = null;
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    const [ profile, setProfile ] = useState(null);
    const [ orders, setOrders ] = useState([]);
    const [ orderDetail, setOrderDetail ] = useState([]);
    const [ userDetail, setUserDetail ] = useState();
    const { token, setToken } = useUserToken();
    const history = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(Endpoint.BASE_URL + Endpoint.PROFILE, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                setProfile(response.data.user);  
                setUserDetail(response.data.detail);
            } catch (error) {
                console.error(error.message);
            }
        }

        const fetchDataOrder = async () => {
            try {
                const response = await axios.get(Endpoint.BASE_URL + Endpoint.GETORDERBYCUSTOMER, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setOrders(response.data.order);  
                const newOrderList = response.data.order.flatMap((o) => {
                    return o.orderdetails.map((d) => ({
                        status_pembayaran: o.status_pembayaran,
                        status_pesanan: o.status,
                        name: d.product_detail.name,
                        photo: d.product_detail.photo,
                        amount: d.amount,
                        id: d.id,
                        total: d.subtotal,
                    }));
                });
        
                console.log(newOrderList);
                setOrderDetail(newOrderList);
            } catch (error) {
                console.error(error.message);
            }
        }
    
        fetchData();
        fetchDataOrder();
    }, []);

    useEffect(()=>{
        isLoggedIn ? () => {} : history('/login');
    }, []);

    return(
        <>
        { userDetail && console.log(userDetail.photo) }
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
                                <div>{ profile && profile.name }</div>
                                <div>(+62) { userDetail && userDetail.phone }</div>
                            </div>
                            <div className="col-md-5">
                                <div>{ userDetail && `${userDetail.province}, ${userDetail.city}, ${userDetail.detail_address}` }</div>
                            </div>
                            <div className="col-md-2">
                                <div><Link to={`/profile-detail`}>Ubah</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 bg-light py-2 mt-2 base-color rounded">
                    <h2 className="h5 fw-bold">Status Pesanan</h2>
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Produk dipesan</h2>
                            </div>
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Total</h2>
                            </div>
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Kuantitas</h2>
                            </div>
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Status Pembayaran</h2>
                            </div>
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Status Pesanan</h2>
                            </div>
                            <div className="col">
                                <h2 className="h5 my-auto text-muted text-start">Photo</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        {
                            orderDetail && orderDetail.map((c) => {
                                return (<div key={c.id} className="row align-items-center">
                                            <div className="col text-start">                                        
                                                <span className="my-auto text-muted">{ c.name }</span>
                                            </div>
                                            <div className="col text-start">
                                                <span className="my-auto text-muted text-center">{ c.total }</span>
                                            </div>
                                            <div className="col text-start">
                                                <span className="my-auto text-muted text-center">{ c.amount }</span>
                                            </div>
                                            <div className="col text-start">
                                                <span className="my-auto text-muted text-center">{ c.status_pembayaran } </span>
                                            </div>
                                            <div className="col text-start">
                                                <span className="my-auto text-muted text-center">{ c.status_pesanan } </span>
                                            </div>
                                            <div className="col text-start">
                                                <img src={c && require(`/assets/product/${c.photo}`)} className='img-fluid w-50 py-4'alt=''/>
                                            </div>
                                        </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Profile;