import React, { useState, useEffect } from "react";
import Banner1 from "../assets/banner/Banner1.png";
import Banner2 from "../assets/banner/Banner2.png";
import Banner3 from "../assets/banner/Banner3.png";

const Banner = () => {
    const [banner, setBanner] = useState(0);

    const bannerList = [
        { url: Banner1 },
        { url: Banner2 },
        { url: Banner3 }
    ];

    const prevSlide = () => {
        setBanner(banner === 0 ? 2 : banner - 1);
    };

    const nextSlide = () => {
        setBanner(banner === 2 ? 0 : banner + 1);
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(intervalId);
    }, [banner]);

    return (
        <>
            <div className="col-md-12 bg-success d-none d-md-block shadow-md slider">
                <div className="left" onClick={prevSlide}>
                    <i className="bi bi-arrow-left-short"></i>
                </div>
                <div className="right" onClick={nextSlide}>
                    <i className="bi bi-arrow-right-short"></i>
                </div>
                <img src={bannerList[banner].url} alt="" className="img-fluid" />
            </div>
        </>
    );
};

export default Banner;
