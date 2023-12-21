import { useEffect, useState } from "react";
import CartImage from "../assets/cart.svg";
import { Link } from 'react-router-dom';
import axios from "axios";
import Endpoint from "../data/constant";

const RelatedProduct = () => {
    const [ productList, setProductList ] = useState([]);

    useEffect(()=>{
        axios.get(Endpoint.BASE_URL + Endpoint.PRODUCT)
        .then((response) => {
            console.log(response);
            setProductList(response.data.product.slice(0, 4));
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
                                    <Link to={`/product/product-detail/${p.id}`} >
                                        <div className={`${'rounded-3'}`}>
                                            <img src={require(`/assets/product/${p.photo}`)} alt='' className='img-fluid'/>
                                        </div>
                                    </Link>
                                    <div className='text-start'>
                                        {/* <div className='fw-light'>{`Telah Terjual : ${p.terjual}`}</div> */}
                                        <div className='fw-light'>{`Telah Terjual : 20`}</div>
                                        <div className='fw-bold'>{p.name}</div>
                                        <div className='fw-light my-3'>
                                            <p>
                                                
                                            </p>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <span className='fw-bold'>{p.price}</span>
                                            <Link to={`/product/product-detail/${p.id}`} className="btn primary-color d-flex">
                                                <img src={CartImage} width={20} alt="cart"/>
                                                <span className='ms-1'>Beli</span>
                                            </Link>
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