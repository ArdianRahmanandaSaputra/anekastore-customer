import { useNavigate, useParams } from "react-router-dom";
import dataProduct from "../data/product";
import { useContext, useEffect, useState } from "react";
// import { CartContext } from "../context/CartContext";
import { v4 } from "uuid";
import { useAuth } from "../context/AuthContext";
import RelatedProduct from "./RelatedProduct";
import Endpoint from "../data/constant";
import axios from "axios";
import { useUserToken } from "../context/UserTokenContext";
import { addCart } from "../api/Cart";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
    const params = useParams();
    // const { login, setLogin } = useContext(LoginContext);
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    const { token, setToken } = useUserToken();
    const history = useNavigate();

    const [ product, setProduct ] = useState(null);

    useEffect(()=>{
        axios.get(Endpoint.BASE_URL + Endpoint.VIEWPRODUCT + '/' + params.id, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            // console.log(response);
            setProduct(response.data.product);
        })
        .catch((error) => {
            console.error('Gagal melakukan permintaan:', error);
        });
    }, [])

    const [ qty, setQty ] = useState(0);

    const handleQty = (event)=>{
        setQty(event.target.value);
    }

    const addOne = ()=>{
        setQty(parseInt(qty) + 1);
    }

    const delOne = ()=>{
        parseInt(qty) <= 0 ? setQty(0) : setQty(parseInt(qty)-1);
    }

    const { cart, setCart, add } = useContext(CartContext);

    const addItem = ( id, name, qty, price, total, isChecked ) => {
        if(!isLoggedIn){
            history('/login');
            return;
        }
        // setCart( [...cart, { id,  name, qty, price, total, isChecked }] );
    }

    const addToCart = async() => {
        if(!isLoggedIn){
            history('/login');
            return;
        }
        try{
            await add(product.id, qty);
        }catch(error){
            console.log("Error when adding to cart " + error)
        }
    }

    return(
        <>
            <div className='container mt-3 text-center'>
                <div className='row'>
                    <div className='col-md-6 mb-2'>
                        <img src={product && require(`/assets/product/${product.photo}`)} className='img img-fluid w-50' alt=''/>
                    </div>
                    <div className='col-md-6 text-start mb-2'>
                        {/* <h2 className='h2'>{ product && product.name }</h2> */}
                        {/* <h2 className='h3 text-success'>{ product && `Rp. ${product.price}` }</h2> */}
                        
                        <table className="table table-borderless">
                            <tbody className="m-3">
                                <tr>
                                    <th scope="col" className='text-muted'>Nama Produk</th>
                                    <th scope="col">{ product && product.name }</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'>Harga</th>
                                    <th scope="col">{ product && `Rp. ${product.price}` }</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'>Pengiriman</th>
                                    <th scope="col">JNE - TIKI - POS</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'>Paket</th>
                                    <th scope="col">Satuan</th>
                                </tr>
                                {/* <tr>
                                    <th scope="col" className='text-muted'></th>
                                    <th scope="col">---</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'></th>
                                    <th scope="col">---</th>
                                </tr> */}
                                <tr>
                                    <th scope="col" className='text-muted'>Kuantitas</th>
                                    <th scope="col">
                                        <div className='col-md-6 d-flex'>
                                            <button className='btn btn-outline-success h-50' onClick={delOne}>-</button>
                                            <input type='number'  className='form-control w-25 mx-1' value={qty} onChange={handleQty}/>                                            
                                            <button className='btn btn-outline-success h-50' onClick={addOne}>+</button>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'></th>
                                    <th scope="col">
                                        <button className='btn btn-outline-success' onClick={addToCart}>Masukan Keranjang</button>
                                    </th>
                                </tr>
                            </tbody>
                            </table>
                    </div>
                    <div className='col-md-12 text-start bg-light p-3'>
                        <h2 className='h4'>
                            Spesifikasi Produk
                        </h2>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <th scope="col" className='text-muted'>No. Registrasi</th>
                                    <th scope="col">{ product && `PR00${product.id}` }</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'>Kategori</th>
                                    <th scope="col">{ product && product.category_name }</th>
                                </tr>
                                <tr>
                                    <th scope="col" className='text-muted'>Berat</th>
                                    <th scope="col">{ product && `${product.weight} gram` }</th>
                                </tr>
                            </tbody>
                        </table>
                        <hr className="bg-dark border-5 border-top border-dark" />
                        <h2 className='h4'>
                            Deskripsi Produk
                        </h2>
                        <p>{ product && product.description }</p>
                    </div>
                    <div className='col-md-12 p-0'>
                        <RelatedProduct />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail;