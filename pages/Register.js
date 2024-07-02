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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [username, setUsername] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(true);

    const registerhandler = (e) => {
        e.preventDefault();
        if (password === passwordConfirm) {
            setIsConfirmed(true);
            register(username, email, password)
                .then(res => {
                    if (res && res.data) {
                        if (res.data.status === "success") {
                            setIsLoggedIn(true)
                            setToken(res.data.access_token);
                            alert("Registrasi Berhasil");
                            let profileDetailPath = '/profile-detail';
                            history(profileDetailPath);
                        } else if (res.data.status === "error" && res.data.message === "Email sudah terdaftar") {
                            alert("Email sudah terdaftar");
                        } else {
                            alert("Registrasi Gagal");
                        }
                    } else {
                        alert("Email Sudah Terdaftar!!");
                        setEmail('');
                        setUsername('');
                        setPassword('');
                        setPasswordConfirm('');
                    }
                })
                .catch(e => {
                    console.log(e);
                    alert("Terjadi kesalahan saat melakukan pendaftaran");
                });
        } else {
            setIsConfirmed(false);
            return;
        }
    }    

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const usernameHandler = (e) => {
        setUsername(e.target.value);
    }

    const isConfirmedHandler = (e) => {
        setPasswordConfirm(e.target.value);
    }

    return (
        <>
            <div className='container-fluid h-100'>
                <div className='row h-100'>
                    <div className="col-md-6 p-0">
                        <img src={require(`/assets/Login2.png`)} alt='' className='img-fluid w-100 h-100' />
                    </div>
                    <div className='col-md-6 p-3 base-color'>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12 p-3">
                                    <h1 className="h1">ANEKA STORE REGISTER</h1>
                                    <h4 className="h5 mb-5 text-muted">Beli Lebih, Hemat Lebih: Grosir Terbaik!</h4>
                                    <form onSubmit={registerhandler} className='d-flex flex-column mt-3 my-3'>
                                        <label>Email</label>
                                        <input type="email" name="email" id="email" className='form-control mb-2' placeholder="Enter Your Email" onChange={(e) => emailHandler(e)} autoComplete="off" value={email} />
                                        <label>Username</label>
                                        <input type="text" name="username" id="username" className='form-control mb-2' placeholder="Enter Your Username" onChange={(e) => usernameHandler(e)} value={username} />
                                        <label>Password</label>
                                        <input type="password" name="password" id="password" className='form-control mb-2' placeholder="Enter Your Passsword" onChange={(e) => passwordHandler(e)} value={password} />
                                        <label>Confirm Password</label>
                                        <input type="password" name="confirmpassword" id="confirmpassword" className='form-control' placeholder="Confirm Passsword" onChange={(e) => isConfirmedHandler(e)} value={passwordConfirm} />
                                        <span className={`text-danger ${isConfirmed ? 'd-none' : 'block'}`}>Password tidak sama</span>
                                        <input type="submit" value="Daftar" className='form-control btn btn-dark mt-5' />
                                    </form>
                                    <span className="text-muted">Sudah Punya Akun? Silahkan <Link to="/login" className='text-muted'>Masuk</Link></span>
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
