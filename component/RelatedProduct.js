import { useEffect, useState } from "react";
import CartImage from "../assets/cart.svg";
import { Link } from 'react-router-dom';
import axios from "axios";
import Endpoint from "../data/constant";

const RelatedProduct = ({ productId }) => {
    const [ productList, setProductList ] = useState([]);

    // Fungsi untuk mengubah angka menjadi format Rupiah tanpa tanda koma di belakang
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(number);
    };

    useEffect(()=>{
        console.log(productId)
        axios.get(Endpoint.BASE_URL + Endpoint.GETRELATEDPRODUCT + '/' + productId)
        .then((response) => {
            console.log(response);
            const filteredProducts = response.data.relatedProduct.filter(product => product.id !== productId);
            // Ambil 4 relatedProduct pertama setelah melakukan filter
            const slicedProducts = filteredProducts.slice(0, 4);
            setProductList(slicedProducts);
        })
        .catch((error) => {
            console.error('Gagal melakukan permintaan:', error);
        });
    },[]);

    return(
        <>            
            <div className='col-md-12 p-0'>
                <div className="container-fluid text-center mt-3 p-0">
                    <div className='row'>
                    {
                        productList && productList.map((p) => (
                            <div className="col-md-3 col-lg-3 mb-2 shadow-sm" key={p.id}>
                                <div className='container-fluid border p-3 bg-light shadow-md'>
                                    <a href={`/product/product-detail/${p.id}`} onClick={() => window.location.reload()} >
                                        <div className={`${'rounded-3'}`}>
                                            <img src={`${Endpoint.PRODUCTIMAGE}${p.photo}`} alt='' className='img-fluid'/>
                                        </div>
                                    </a>
                                    <div className='text-start'>
                                        {/* <div className='fw-light'>{`Telah Terjual : ${p.terjual}`}</div>
                                        <div className='fw-light'>{`Telah Terjual : 20`}</div> */}
                                        <div className='fw-bold'>{p.name}</div>
                                        <div className='fw-light my-3'>
                                            <p>
                                                
                                            </p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <span className='fw-bold'>{formatRupiah(p.price)}</span>
                                            <a href={`/product/product-detail/${p.id}`} onClick={() => window.location.reload()} className="btn primary-color d-flex">
                                                <img src={CartImage} width={20} alt="cart"/>
                                                <span className='ms-1'>Beli</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            </div>        
        </>
    )
}

export default RelatedProduct;