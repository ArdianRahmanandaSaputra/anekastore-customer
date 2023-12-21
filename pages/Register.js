import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import { v4 } from "uuid";
import { useAuth } from "../context/AuthContext";
import { useUserToken } from "../context/UserTokenContext";

const Register = () => {
    const history = useNavigate();
    const { isLoggedIn, setIsLoggedIn, login, logout, register } = useAuth();
    const { token, setToken } = useUserToken();
    // const { account, setAccount } = useContext(AccountContext);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ passwordConfirm, setPasswordConfirm ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ isConfirmed, setIsConfirmed ] = useState(true);

    const registerhandler = (e) => {
        e.preventDefault();
        if(password === passwordConfirm){
            setIsConfirmed(true);
            register(username, email, password)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                if(data.status === "success"){
                    setIsLoggedIn(true)
                    setToken(data.access_token);
                    console.log("setting islogged in ", isLoggedIn);
                    console.log("Token ", token);
                    alert("Registrasi Berhasil");
                    let index = '/';
                    history(index);
                }else{
                    alert("Registrasi Gagal");
                }
            }).catch(e => {
                console.log(e)
            })
        }else{
            setIsConfirmed(false);
            return;
        }
    }

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
        console.log("pass", password);
    }

    const usernameHandler = (e) => {
        setUsername(e.target.value);
    }

    const isConfirmedHandler = (e) => {
        setPasswordConfirm(e.target.value);
        console.log("pass confirm", passwordConfirm);
    }

    return(
        <>
            <div className='container-fluid h-100'>
                <div className='row h-100'>
                    <div className="col-md-6 p-0">
                        <img  src={require(`/assets/Login2.png`)} alt='' className='img-fluid w-100 h-100'/>
                    </div>
                    <div className='col-md-6 p-3 base-color'>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 p-3">
                                    <h1 className="h1">ANEKA STORE REGISTER</h1>
                                    <h4 className="h5 mb-5 text-muted">Welcome to aneka store please input your details</h4>
                                    <form onSubmit={registerhandler} className='d-flex flex-column mt-3 my-3'>
                                        <label>Email</label>
                                        <input type="email" name="email" id="email" className='form-control mb-2' placeholder="Enter Your Email" onChange={(e)=>emailHandler(e)}/>
                                        <label>Username</label>
                                        <input type="text" name="username" id="username" className='form-control mb-2' placeholder="Enter Your Username" onChange={(e)=>usernameHandler(e)}/>
                                        <label>Password</label>
                                        <input type="password" name="password" id="password"  className='form-control mb-2' placeholder="Enter Your Passsword" onChange={(e)=>passwordHandler(e)}/>
                                        <label>Confirm Password</label>
                                        <input type="password" name="confirmpassword" id="confirmpassword"  className='form-control' placeholder="Confirm Passsword" onChange={(e) => isConfirmedHandler(e)}/>
                                        <span className={`text-danger ${isConfirmed ? 'd-none' : 'block'}`}>Password tidak sama</span>
                                        <input type="submit" value="Sign In"  className='form-control btn btn-dark mt-5'/>
                                    </form>
                                    <span className="text-muted">Do you have an account ? <Link to="/login" className='text-muted'>Login</Link></span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;