import { useContext, useEffect, useState } from "react";
import CartImage from "../assets/cart.svg";
import { StyleSheet } from "react-native-web";
import { Outlet, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserToken } from "../context/UserTokenContext";
import { getCart } from "../api/Cart";

const Layout = () => {
    const { cart, setCart } = useContext(CartContext);
    // const [ cart, setCart ] = useState([]);
    // const { login, setLogin } = useContext(LoginContext);
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    const [ count, setCount ] = useState(0);
    const { token, setToken } = useUserToken();
    const history = useNavigate();

    useEffect(()=>{
        setCount(cart?.length !== 0 ? cart?.length : 0);
    }, []);

    const handleLogout = () => {
        console.log(token)
        logout(token).then(
            () => {
                setToken('');
                history('/login');
            }
        );
    }

    return ( 
        <div className="position-relative" style={styles.container}>
            <nav className="navbar navbar-expand-lg navbar-light bg-white">
                <div className="container-fluid">
                    <Link className="navbar-brand ms-5" to={'/'}>Aneka Store</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 text-center ms-auto me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to={'/'} >
                                    Home    
                                </Link> 
                            </li>
                            <li className="nav-item">
                                <Link to="category" className="nav-link" >Kategori</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to='/product'>Produk</Link>
                            </li>
                            <li className="nav-item">
                            { isLoggedIn ? 
                                <Link to="/cart" className="nav-link">
                                    <div className='cartImage'>
                                        <img src={CartImage} width={25} alt="cart"/>
                                        <span>{ cart && cart?.length !== 0 ? cart?.length : 0 }</span>
                                    </div>
                                </Link>
                                :
                                <></>
                            }
                            </li>
                        </ul>
                        <div className="navbar-nav text-center">
                            { isLoggedIn ? 
                                <>
                                    <div className="nav-item">
                                        <Link to="/profile" className="btn btn-success px-4 shadow-sm primary-color-hover" >
                                            Profile                     
                                        </Link>
                                    </div>
                                    <div className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-outline-success px-3 ms-lg-1 ms-sm-0 mt-sm-1 mt-lg-0 shadow-sm" >
                                            Logout                     
                                        </button>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="nav-item">
                                        <Link to="/login" className="btn btn-outline-success px-4 shadow-sm primary-color-hover" >
                                        Login                     
                                        </Link>
                                    </div>
                                    <div className="nav-item">
                                        <Link to="/register" className="btn btn-success px-3 ms-lg-1 ms-sm-0 mt-sm-1 mt-lg-0 shadow-sm primary-color" >
                                        Register                     
                                        </Link>
                                    </div>
                                </>
                            }                            
                        </div>
                    </div>
                </div>
            </nav>

            <Outlet />

            <footer className="py-3 my-4">
                <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item">
                    <Link to="/" className="nav-link px-2 text-muted">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/product" className="nav-link px-2 text-muted">
                        Product
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/category" className="nav-link px-2 text-muted">
                        Category
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to='/cart' className="nav-link px-2 text-muted">
                        My Cart
                    </Link>
                </li>
                </ul>
                <p className="text-center text-muted">© 2023 Aneka Store</p>
            </footer>
        </div>
     );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(212, 212, 212, 0.333)',
    },
});


export default Layout;