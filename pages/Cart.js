import { useContext, useEffect, useMemo, useState } from "react";
//import { CartContext } from "../context/CartContext";
import { TransactionContext } from "../context/TransactionContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { CheckoutCartContext } from "../context/CheckoutCart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Endpoint from "../data/constant";

const Cart = () => {
    const { cart, setCart, removeByOne, addByOne, deleteCartById } = useContext(CartContext);
    // const [ checkoutCart, setCheckoutCart ] = useState([]);
    const { checkoutCart, setCheckoutCart } = useContext(CheckoutCartContext);
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    const [ total, setTotal ] = useState(0);
    const { transaction, setTransaction } = useContext(TransactionContext);

    const history = useNavigate();

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    };
    
    const removeCart = async(id) => {
        try{
            await deleteCartById(id);
        }catch(error){
            console.log("Error when delete cart " + error)
        }      
    }
    
    useEffect(()=>{
        // console.log(cart);
        login ? () => {} : history('/login');
    }, []);

    useEffect(()=>{
        let tempTotal = 0;
        let validate = cart?.length !== undefined ? cart.length : 0;
        if(validate !== 0){
            for(let i =0; i<cart.length; i++){
                if(cart[i].isChecked){
                    tempTotal += parseInt(cart[i].total);
                }
            }
        }
        
        setTotal(tempTotal);
    }, [cart]);
    
    const updateTotal = () => {
        // Hitung ulang total belanja berdasarkan item yang telah dicentang
        const selectedItemsTotal = cart.reduce((total, item) => {
            if (checkoutCart.includes(item.id)) {
                total += item.amount * item.item.price;
            }
            return total;
        }, 0);
        setTotal(selectedItemsTotal);
    }
    
    const addOne = async (id) => {
        try {
            await addByOne(id);
            // Perbarui total hanya jika item sudah dicentang
            updateTotal();
        } catch (error) {
            console.log("Error when adding to cart " + error);
        }
    }
    
    const removeOne = async (id) => {
        try {
            await removeByOne(id);
            // Perbarui total hanya jika item sudah dicentang
            updateTotal();
        } catch (error) {
            console.log("Error when remove from cart " + error);
        }
    }
    
    const checkout = (e) => {
        const itemId = parseInt(e.target.value);
        if (e.target.checked === true) {
            if (!checkoutCart.includes(itemId)) {
                setCheckoutCart(prevCheckoutCart => [...prevCheckoutCart, itemId]);
                // Perbarui total setelah item dicentang
                updateTotal();
            }
        } else {
            setCheckoutCart(prevCheckoutCart => prevCheckoutCart.filter(item => item !== itemId));
            // Perbarui total setelah item dicentang dibatalkan
            updateTotal();
        }
    }
    
    useEffect(() => {
        // Hitung ulang total belanja saat keranjang berubah
        updateTotal();
    }, [cart, checkoutCart]);
    
    return(
        <>
        <div className="container">
            <div className="row mt-3">
                <div className="col-12 bg-light py-2 base-color rounded">
                    <h2 className="h4">Aneka Store | Keranjang Belanja</h2>
                </div>
                <div className="col-12 bg-light mt-4 base-color rounded">
                    <div className="container-fluid">
                        <div className="row align-items-center py-2 px-3">
                            <div className="col-md-3 ps-5">
                                <h2 className="h4 my-auto">Produk</h2>
                            </div>
                            <div className="col-md-2">
                                <h2 className="h4 my-auto">Harga Satuan</h2>
                            </div>
                            <div className="col-md-2 ps-5">
                                <h2 className="h4 my-auto ps-4">Kuantitas</h2>
                            </div>
                            <div className="col-md-2 ps-4">
                                <h2 className="h4 my-auto ps-2">Total Harga</h2>
                            </div>
                            <div className="col-md-3 ps-5">
                                <h2 className="h4 my-auto ps-4">Aksi</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 bg-light mt-2 base-color rounded">
                    <div className="container-fluid">
                        <ul>
                        {
                            cart.length !== 0 ? 
                            cart.map((c) => {
                                return (
                                <div className="row align-items-center" key={c.id}>
                                    <div className="col-md-auto">
                                        <input type='checkbox' value={c.id} onChange={checkout} />
                                    </div>
                                    <div className="col-md-3 align-items-center d-flex">
                                        <img src={c && `${Endpoint.PRODUCTIMAGE}${c.item.photo}`} className='img-fluid w-50 p-4' alt='' />
                                        <span className="text-muted">{ c.item.name }</span>
                                    </div>
                                    <div className="col-md-2">
                                        <span className="text-muted text-center">{ formatRupiah(c.item.price) }</span>
                                    </div>
                                    <div className="col-md-2 d-flex">
                                        <button className='btn btn-outline-success h-50' onClick={() => removeOne(c.id)} disabled={c.amount <= 1}>
                                         <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <input type='text' readOnly={true} className='w-25 mx-1 form-control' value={ c.amount }/>
                                        <button className='btn btn-outline-success h-50' onClick={() => addOne(c.id)}> <FontAwesomeIcon icon={faPlus} /></button>
                                    </div>
                                    <div className="col-md-2">
                                        {/* <span className="text-muted">{ parseInt(c.amount) * parseInt(c.item.price) }</span> */}
                                        <span className="text-muted">{formatRupiah(parseInt(c.amount) * parseInt(c.item.price))}</span>
                                    </div>
                                    <div className="col-md-2">
                                        <button className='btn btn-danger' onClick={() => {removeCart(c.id)}}>Hapus</button>
                                    </div>
                                </div>
                                )
                            }) : 
                            <div className="row align-items-center" key={1}>
                                <div className="col-md-auto py-5">
                                        <span className="h3 fw-bold mx-5">Keranjang Kosong</span>
                                </div>
                            </div>
                        }
                        </ul>
                    </div>
                </div>
                <div className="col-12 bg-light mt-2 base-color rounded">
                    <div className="container-fluid py-5">
                        <div className="d-flex flex-column text-end align-items-end">
                            <span className="fw-bold mb-3">Total {formatRupiah(total)}</span>
                            <Link to={`/checkout`} className="btn btn-success">Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Cart;