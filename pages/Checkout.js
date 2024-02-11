import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, Navigate } from "react-router-dom";
import { TransactionContext } from "../context/TransactionContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserToken } from "../context/UserTokenContext";
import axios from "axios";
import Endpoint from "../data/constant";
import { getCost } from "../api/Cost";
import { CheckoutCartContext } from "../context/CheckoutCart";
import { Snap } from "midtrans-client";
import Midtrans from "midtrans-client";

const Checkout = () => {
    const { cart, setCart } = useContext(CartContext);
    // const { login, setLogin } = useContext(LoginContext);
    const [ newChart, setNewChart ] = useState([]);
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    const [ total, setTotal ] = useState(0);
    // const { transaction, setTransaction } = useContext(TransactionContext);
    const { checkoutCart, setCheckoutCart } = useContext(CheckoutCartContext);
    const [ profile, setProfile ] = useState(null);
    const [ userDetail, setUserDetail ] = useState();
    const { token, setToken } = useUserToken();
    const [ courier, setCourier ] = useState('jne');
    const [ service, setService ] = useState();
    const [ serviceList, setServiceList ] = useState([]);
    const [ dest, setDest ] = useState();
    const [ weight, setWeight ] = useState();
    const [ isOrdered, setIsOrdered ] = useState(false);
    const history = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(Endpoint.BASE_URL + Endpoint.PROFILE, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                // console.log(response);
                setProfile(response.data.user);  
                setUserDetail(response.data.detail);
                setDest(response.data.detail.city_code)
            } catch (error) {
                console.error(error.message);
            }
        }
    
        fetchData();
    }, []);

    useEffect(()=>{
        isLoggedIn ? () => {} : history('/login');
        for(const i of cart){
            console.log(i);
            for(const j of checkoutCart){
                console.log(j);
                if(parseInt(i.id) === parseInt(j)){
                    console.log("find")
                    setNewChart(prevCheckoutCart => [...prevCheckoutCart, i]);
                    console.log(newChart);
                }
            }
        }
    }, []);

    useEffect(()=>{
        let tempTotal = 0;
        let weightTotal = 0;
        for(const c of cart){
            tempTotal = parseInt(tempTotal) + (parseInt(c.amount) * parseInt(c.item.price))
            weightTotal = parseInt(weightTotal) + (parseInt(c.amount) * parseInt(c.item.weight))
        }
        setTotal(tempTotal);
        setWeight(weightTotal);
    }, [cart]);

    useEffect(() => {
        const snapSrcUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        const myMidtransClientKey = 'your-client-key-goes-here'; //change this according to your client-key
      
        const script = document.createElement('script');
        script.src = snapSrcUrl;
        script.setAttribute('data-client-key', myMidtransClientKey);
        script.async = true;
      
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        }
    }, []);

    const makeTransaction = () => {
        let cartsToCheckout = newChart.map(item => item.id);
        const formData = new FormData();
        formData.append('user_id', profile.id);
        cartsToCheckout.forEach(id => {
            formData.append('order[]', id);
        });
        formData.append('courier', courier);
        formData.append('service', service);
        

        axios.post(Endpoint.BASE_URL + Endpoint.MAKEORDER, formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then(async (response) => {
            // Tangani respons dari server di sini
            console.log('Response dari server:', response.data);
            window.snap.pay(response.data.snapToken, {
                onSuccess: function(result){
                  /* You may add your own implementation here */                  
                  let index = '/';
                  history(index);
                },
                onPending: function(result){
                  /* You may add your own implementation here */
                  
                },
                onError: function(result){
                  /* You may add your own implementation here */
                  
                },
                onClose: function(){
                  /* You may add your own implementation here */
                  
                }
            })
        })
        .catch((error) => {
            // Tangani error jika request gagal
            console.error('Error:', error);
        });
        // let path = '/profile';
        // let tempTransaction = [];
        // cart.forEach(c => {
        //     if(c.isChecked){
        //         tempTransaction.push(c);
        //     }
        // });
        // setCart(()=>{
        //     cart.filter((c)=>{
        //         c.isChecked === false;
        //     })
        // })
        // setTransaction(tempTransaction);
        // history(path);
    }

    const kurirHanlder = async(e) => {
        const fetchCost = async () => {
            try {
                const response = await getCost(e.target.value, dest, weight, token)
                return response.data.cost[0];
                
            } catch (error) {
                console.error(error.message);
            }
        }
        const res = await fetchCost();
        setServiceList(() => res.costs)
        console.log(res.costs);
        setCourier(e.target.value);
    }

    const serviceHandler = (e) => {
        setService(e.target.value);
    }

    return(
        <>
        <div className="container">
            <div className="row mt-3">
                <div className="col-12 bg-light py-2 base-color rounded">
                    <h2 className="h4">Aneka Store | Checkout</h2>
                </div>
                <div className="col-12 bg-light py-2 base-color mt-2 rounded">
                    <h2 className="h5 fw-bold">Alamat Pengiriman</h2>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5">
                                <div>{ profile && profile.name }</div>
                                <div>{ userDetail && userDetail.phone }</div>
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
                <div className="col-12 bg-light mt-2 base-color rounded">
                    <div className="container-fluid">
                        <div className="row align-items-center py-2 px-3">
                            <div className="col ps-5">
                                <h2 className="h4 my-auto text-muted">Produk dipesan</h2>
                            </div>
                            <div className="col">
                                <h2 className="h4 my-auto text-muted">Harga Satuan</h2>
                            </div>
                            <div className="col text-muted">
                                <h2 className="h4 my-auto">Kuantitas</h2>
                            </div>
                            <div className="col text-muted">
                                <h2 className="h4 my-auto">Berat Total</h2>
                            </div>
                            <div className="col text-muted">
                                <h2 className="h4 my-auto">Total Harga</h2>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid">
                        <ul>
                        {
                            newChart && newChart.map((c) => {
                                return (<div className="row align-items-center" key={c.id}>
                                    <div className="col align-items-center d-flex">
                                        <img src={c && require(`/assets/product/${c.item.photo}`)} className='img-fluid w-50 p-4'alt=''/>
                                        <span className="text-muted">{ c.item.name }</span>
                                    </div>
                                    <div className="col">
                                        <span className="text-muted text-center">{ c.item.price }</span>
                                    </div>
                                    <div className="col">
                                        <span>{ c.amount }</span>
                                    </div>
                                    <div className="col">
                                        <span>{ parseInt(c.amount) * parseInt(c.item.weight) } gram</span>
                                    </div>
                                    <div className="col">
                                        <span className="text-muted">{ parseInt(c.amount) * parseInt(c.item.price) }</span>
                                    </div>
                                </div>)
                            })
                        }
                        </ul>
                    </div>
                </div>
                <div className="col-12 bg-light mt-2 base-color rounded">
                    <h2 className="h5 fw-bold mt-3">Metode Pengiriman</h2>
                    <div className="container-fluid py-3">
                        <label className="d-block me-3 text-gray-800">Pilih Kurir</label>
                        <select className="w-100 px-2 py-1 border rounded-lg"
                        onChange={kurirHanlder}
                        >
                            <option value="">
                                Pilih Kurir
                            </option>
                            <option key={1} value={'jne'}>
                                JNE
                            </option>
                            <option key={2} value={'tiki'}>
                                TIKI
                            </option>
                            <option key={3} value={'pos'}>
                                POS
                            </option>
                        </select>
                    </div>
                    <div className="container-fluid py-3">
                        <label className="d-block me-3 text-gray-800">Pilih Service</label>
                        <select className="w-100 px-2 py-1 border rounded-lg"
                        onChange={serviceHandler}
                        >
                            <option value="">
                                Pilih Service
                            </option>
                            {serviceList && serviceList.map((c) => (
                                <option key={c.service} value={`${c.service} | ${c.cost[0].etd} | ${c.cost[0].value}`}>
                                {`${c.service} | ${c.cost[0].etd} | ${c.cost[0].value}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-12 bg-light mt-2 base-color rounded">
                    <div className="container-fluid py-5">
                        <div className="d-flex flex-column text-end align-items-end">
                            <span className="fw-bold mb-3">Total {total}</span>
                            <button className={`btn btn-success ${isOrdered ? 'd-hidden' : 'd-block'}`} onClick={() => makeTransaction()}>Lanjut Pembayaran</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Checkout;