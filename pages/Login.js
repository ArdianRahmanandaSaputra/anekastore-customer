import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserToken } from "../context/UserTokenContext";


const Login = () => {
    const history = useNavigate();
    const { isLoggedIn, setIsLoggedIn, login, logout } = useAuth();
    // const { account, setAccount } = useContext(AccountContext);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const { token, setToken } = useUserToken();

    const handleLogin = async (e) => {
        e.preventDefault();   
        await login(email, password)
              .then(res => res.data)
              .then(data => {
                    console.log(data)
                    if(data.status === "success"){
                        setIsLoggedIn(true)
                        setToken(data.access_token);
                        console.log("setting islogged in ", isLoggedIn)
                        console.log("Token ", token)
                        let index = '/';
                        history(index);
                    }else{
                        alert("Password atau Email anda salah");
                    }
              }).catch(e => {
                  console.log(e)
              })
    };

    // const loginHandler = (e) => {
    //     e.preventDefault();
    //     let tempExist = false;
    //     let isVerif = account.map((a) => {
    //         let exist = a.email === email && a.password === password;
    //         if(exist){
    //             tempExist = exist;
    //         }
    //         return a.email === email && a.password === password;  
    //     });
    //     console.log(isVerif);
    //     if(tempExist){
    //         setLogin(true);
    //         let index = '/';
    //         history(index);
    //     }else{
    //         alert("Password atau Email anda salah");
    //     }        
    // }

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        console.log(e.target.value);
        setPassword(e.target.value);
    }
    return(
        <>
            <div className='container-fluid h-100'>
                <div className='row h-100'>
                    <div className="col-md-6 p-0">
                        <img  src={require(`/assets/Login2.png`)} alt='' className='img-fluid w-100 h-100'/>
                    </div>
                    <div className='col-md-6 p-5 base-color'>
                        <div className="container p-2">
                            <div className="row">
                                <div className="col-md-12 p-2">
                                    <h1 className="h1">ANEKA STORE LOGIN</h1>
                                    <h4 className="h5 mb-5 text-muted">Welcome to aneka store please input your details</h4>
                                    <form onSubmit={handleLogin} className='d-flex flex-column mt-3 my-3'>
                                        <label>Email</label>
                                        <input type="email" name="email" id="email" className='form-control mb-4' placeholder="Enter Your Email" onChange={(e)=>emailHandler(e)}/>
                                        <label>Password</label>
                                        <input type="password" name="password" id="password"  className='form-control mb-2' placeholder="Enter Your Passsword" onChange={(e)=>passwordHandler(e)}/>
                                        <span className="text-muted text-center mb-4">Forgot Password ?</span>
                                        <input type="submit" value="Sign In"  className='form-control btn btn-dark'/>
                                    </form>
                                    <span className="text-muted">Don't have an account ? <Link to="/register" className='text-muted'>Sign Up for free</Link></span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;