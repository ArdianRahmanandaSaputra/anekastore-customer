import { useEffect, useState } from "react";
import { useUserToken } from "../context/UserTokenContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Endpoint from "../data/constant";
import man from "../assets/man.png";

const ProfileDetail = () => {
    const { token, setToken } = useUserToken();
    const history = useNavigate();
    const [ profile, setProfile ] = useState(null);
    const [ userDetail, setUserDetail ] = useState();
    const [ cityList, setCityList ] = useState();
    const [ provinceList, setProvinceList ] = useState([]);
    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ provinceCode, setProvinceCode ] = useState('');
    const [ province, setProvince ] = useState('');
    const [ cityCode, setCityCode ] = useState('');
    const [ city, setCity ] = useState('');
    const [ photo, setPhoto ] = useState(null);
    const [ postalCode, setPostalCode ] = useState('');
    const [ detailAddress, setDetailAddress ] = useState('');
    const [ gender, setGender ] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(Endpoint.BASE_URL + Endpoint.PROFILE, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                setProfile(response.data.user);  
                setUserDetail(response.data.detail);
                setName(response.data.user.name);
                setEmail(response.data.user.email);
                setPhone(response.data.detail ? response.data.detail.phone : '');
                setProvince(response.data.detail ? response.data.detail.province : '');
                setCity(response.data.detail ? response.data.detail.city : '');
                setPostalCode(response.data.detail ? response.data.detail.postal_code : '');
                setDetailAddress(response.data.detail ? response.data.detail.detail_address : '');
                setGender(response.data.detail ? response.data.detail.gender : 'pria');
                setPhoto(response.data.detail ? response.data.detail.photo : '');
            } catch (error) {
                console.error(error.message);
            }
        }

        const fetchDataProvince = async () => {
            try {
                const response = await axios.get(Endpoint.BASE_URL + Endpoint.GETPROVINCE, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                setProvinceList(response.data.provinces);  
                // console.log(response.data);
            } catch (error) {
                console.error(error.message);
            }
        }
    
        fetchData();
        fetchDataProvince();
    }, []);

    const nameHamdler = (e) => {
        setName(e.target.value);
        // console.log(name)
    }

    const emailHandler = (e) => {
        setEmail(e.target.value);
        // console.log(name)
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
        // console.log(name)
    }

    const phoneHandler = (e) => {
        setPhone(e.target.value);
        // console.log(phone);
    }

    const photoHandler = (e) => {
        setPhoto(e.target.files[0]);
        // console.log(photo);
    }

    const provinceHandler = async (e) => {
        try {
            const res = await axios.get(Endpoint.BASE_URL + Endpoint.GETPROVINCEBYID + '/' + e.target.value, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProvince(() => res.data.province.province);
            setProvinceCode(() => res.data.province.province_id);
            // console.log(res.data.province.province_id)

            const resCity = await axios.get(Endpoint.BASE_URL + Endpoint.GETCITYBYPROVINCE + '/' + e.target.value, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCityList(()=> resCity.data.cities)
        } catch (error) {
            console.error(error.message);
        }
    }

    const cityHandler = async(e) => {
        try {
            const res = await axios.get(Endpoint.BASE_URL + Endpoint.GETCITYBYID + '/' + e.target.value, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCity(() => res.data.city.city_name);
            setCityCode(() => res.data.city.city_id);
            setPostalCode(() => res.data.city.postal_code);
            // console.log(res.data.city.city_id)
        } catch (error) {
            console.error(error.message);
        }
    }

    const genderHandler = (e) => {
        setGender(e.target.value);
        // console.log(e.target.value)
    }

    const detailAddressHandler = (e) => {
        setDetailAddress(e.target.value);
        // console.log(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', profile.id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('province', province);
        formData.append('province_code', provinceCode);
        formData.append('city', city);
        formData.append('city_code', cityCode);
        formData.append('phone', phone);
        formData.append('postal_code', postalCode);
        formData.append('gender', gender);
        formData.append('photo', photo);
        formData.append('detail_address', detailAddress);

        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
        }
        axios.post(Endpoint.BASE_URL + Endpoint.UPDATEPROFILE, formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then((response) => {
            // Tangani respons dari server di sini
            console.log('Response dari server:', response.data);
            history('/profile')
        })
        .catch((error) => {
            // Tangani error jika request gagal
            console.error('Error:', error);
        });
    }

    return(
        <>
            <div className="container">
                <div className="row mt-3">
                    <div className="col-12 bg-light py-2 base-color mt-2 rounded p-5">
                        <h2 className="h3 fw-bold text-center my-3">Profile Saya</h2>
                        <div className="container">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-4 my-2">
                                        <img className="img my-2 text-center rounded w-50" src={userDetail ? `${Endpoint.USERIMAGE}${userDetail.photo}` : man} />                                         
                                    </div>
                                    <div className="col-6 my-2">
                                        <div className="row">
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Photo
                                                </label>
                                                <input
                                                type="file"
                                                id="photo"
                                                required={true}
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                onChange={photoHandler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Nama
                                                </label>
                                                <input
                                                type="text"
                                                id="name"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                value={name}
                                                onChange={nameHamdler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Email
                                                </label>
                                                <input
                                                type="text"
                                                id="email"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                value={email}
                                                onChange={emailHandler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Password
                                                </label>
                                                <input
                                                type="password"
                                                id="password"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                value={password}
                                                onChange={passwordHandler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Phone
                                                </label>
                                                <input
                                                type="text"
                                                id="phone"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                value={phone}
                                                onChange={phoneHandler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">Pilih Gender</label>
                                                <select
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                onChange={genderHandler}
                                                >
                                                <option value="" disabled>
                                                    Pilih Gender
                                                </option>
                                                <option key={1} value={'pria'} selected={gender === 'pria'}>
                                                    Pria
                                                </option>
                                                <option key={2} value={'wanita'} selected={gender === 'wanita'}>
                                                    Wanita
                                                </option>
                                                </select>
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">Pilih Province</label>
                                                <select
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                onChange={provinceHandler}
                                                >
                                                <option value="" disabled>
                                                    Pilih Provinsi
                                                </option>
                                                {provinceList && provinceList.map((c) => (
                                                    <option key={c.province_id} value={c.province_id}>
                                                    {c.province}
                                                    </option>
                                                ))}
                                                </select>
                                            </div>
                                            {/* <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Province
                                                </label>
                                                <input
                                                type="text"
                                                readOnly={true}
                                                id="provinceCode"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                defaultValue={province}
                                                />
                                            </div> */}
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">Pilih City</label>
                                                <select
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                onChange={cityHandler}
                                                >
                                                <option value="" disabled>
                                                    Pilih City
                                                </option>
                                                {cityList && cityList.map((c) => (
                                                    <option key={c.city_id} value={c.city_id}>
                                                    {c.city_name}
                                                    </option>
                                                ))}
                                                </select>
                                            </div>
                                            {/* <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                City
                                                </label>
                                                <input
                                                type="text"
                                                id="city"
                                                readOnly={true}
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                defaultValue={city}
                                                />
                                            </div> */}
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Postal Code
                                                </label>
                                                <input
                                                type="text"
                                                readOnly={true}
                                                id="postalCode"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                defaultValue={postalCode}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <label className="d-block mb-2 me-3 text-gray-800">
                                                Detail Address
                                                </label>
                                                <input
                                                type="text"
                                                id="detailAddress"
                                                className="w-100 px-2 py-1 border rounded-lg"
                                                value={detailAddress ? detailAddress : ''}
                                                onChange={detailAddressHandler}
                                                />
                                            </div>
                                            <div className="col-md-12 my-2">
                                                <div>
                                                    <button className="btn btn-outline-success pe-3 ms-lg-0 ms-sm-0 mt-sm-1 mt-lg-0 shadow-sm" >
                                                        Simpan                     
                                                    </button>    
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                                </div>                                 
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}

export default ProfileDetail