import Banner from "../component/Banner";
import CategoryView from "../component/CategoryView";
import ProductView from "../component/ProductView";
import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { syncCart } = useContext(CartContext);
    const { login } = useAuth();

    useEffect(()=>{
        // console.log(cart);
        if(login){
            syncCart();
        }
    }, []);

    return(
        <>
            <main className="container">
                <Banner />
                <CategoryView />
                <ProductView />
            </main>
        </>
    )
}

export default Home;