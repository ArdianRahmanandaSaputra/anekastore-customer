import Banner from "../component/Banner";
import CategoryView from "../component/CategoryView";
import ProductView from "../component/ProductView";

const Home = () => {
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