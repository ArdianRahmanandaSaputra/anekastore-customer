import { useNavigate, useParams } from "react-router-dom";
import ProductList from "./ProductList";

const CategoryProduct = () => {
    const params = useParams();

    return(
        <>
            <div className="p-5">
                <ProductList id={params.id} />
            </div>
        </>
    )
}

export default CategoryProduct