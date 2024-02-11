import CartImage from "../assets/cart.svg";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Endpoint from '../data/constant';

const ProductView = () => {
    const [ productList, setProductList ] = useState([]);
    const [ originalProductList, setOriginalProductList ] = useState([]);

    const searchProduct = (event) => {
        const searchTerm = event.target.value.toLowerCase(); 
        if (!searchTerm.trim()) { 
            setProductList(originalProductList); 
        } else {
            const filteredProducts = originalProductList.filter(p => p.name.toLowerCase().includes(searchTerm));
            setProductList(filteredProducts);
        }
    }
    
    useEffect(()=>{
        axios.get(Endpoint.BASE_URL + Endpoint.PRODUCT)
        .then((response) => {
            console.log(response);
            setProductList(response.data.product);
            setOriginalProductList(response.data.product);
        })
        .catch((error) => {
            console.error('Gagal melakukan permintaan:', error);
        });
    }, []);

    return (
        <>
            <div className="container-fluid text-center mt-5 p-0">
                <h2 className='mt-4'>Search Product</h2>
                <div className='row row-cols-lg-12 justify-content-center align-items-center'>                
                <form className="col-auto text-center">
                    <div className='container'>
                        <div className='input-group'>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={searchProduct}/>
                            <button className="btn btn-outline-success primary-color-hover" type="submit">Search</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
            <div className="container-fluid text-center mt-3 p-0">
                <div className='row'>
                {
                    productList.map((p) => (
                        <div className="col-md-6 col-lg-3 mb-2 shadow-sm" key={p.id}>
                            <div className='container-fluid border p-3 bg-light shadow-md'>
                                <Link to={`/product/product-detail/${p.id}`} >
                                    <div className={`${'rounded-3'}`}>
                                        <img src={require(`/assets/product/${p.photo}`)} alt='' className='img-fluid'/>
                                    </div>
                                </Link>
                                <div className='text-start'>
                                    <div className='fw-light'>{`Telah Terjual : 20`}</div>
                                    <div className='fw-bold'>{p.name}</div>
                                    <div className='fw-light'>
                                        <p>
                                            {p.desc}
                                        </p>
                                    </div>
                                    {/* Related Product */}
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
        </>
    );
}

export default ProductView;
