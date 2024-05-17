import { useEffect, useState } from 'react';
import category from '../data/category';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Endpoint from '../data/constant';

const CategoryView = () => {
    const categoryList = category;
    const [ categories, setCategories ] = useState([]);

    useEffect(()=>{
        axios.get(Endpoint.BASE_URL + Endpoint.CATEGORY)
        .then((response) => {
            console.log(response);
            setCategories(response.data.category);
        })
        .catch((error) => {
            console.error('Gagal melakukan permintaan:', error);
        });
    },[])

    return (
        <>
            <div className="container text-center my-3 p-0">
                <h2 className='my-4'>Product Category</h2>
                <div className='row'>
                {
                    categories && categories.map((c) => (
                        <Link to={`/category/${c.id}`} className="col-md-4 col-lg-2 shadow-sm link-underline link-underline-opacity-0 text-dark" key={c.id}>
                            <div className='container border rounded m-0 p-0'>
                                <div className='p-2'>
                                    <img src={`${Endpoint.CATEGORYIMAGE}${c.photo}`} alt='' className='img img-fluid h-100 w-100'/>
                                </div>
                                <div className='p-2 text-center primary-color rounded'>
                                    {c.name}
                                </div>
                            </div>
                        </Link>
                    ))
                }
                </div>
            </div>
        </>
    )
}

export default CategoryView;