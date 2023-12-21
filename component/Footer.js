import { Link } from "react-router-dom";

const Footer = () => {
    return ( 
        <>
           <footer className="py-3 my-4">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item">
                    <Link href="/" className="nav-link px-2 text-muted">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="product" className="nav-link px-2 text-muted">
                        Product
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/category" className="nav-link px-2 text-muted">
                        Category
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href='/cart' className="nav-link px-2 text-muted">
                        My Cart
                    </Link>
                </li>
                </ul>
                <p className="text-center text-muted">© 2023 Aneka Store</p>
            </footer>
        </>
     );
}
 
export default Footer;