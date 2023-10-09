import React from 'react';
import heroImg from '../images/hero.jpg';
import { Link } from 'react-router-dom';
import '../styles/hero.css';


const Hero = () => {
    return (
        <div className='hero'>
            <div className='hero-content'>
                <div className='hero-heading'>MoneySync</div>
                <p className='hero-sub-heading'>The Ultimate Finance Tracking App</p>
                <div className='hero-buttons'>
                    <Link to='/signup'>
                        <button className='hero-button'>Sign Up</button>
                    </Link>

                    <Link to='/signin'>
                        <button className='hero-button'>Log In</button>
                    </Link>
                </div>
            </div>

            <div className='hero-wrapper'>
                <div className='hero-gradient'></div>
                <img src={heroImg} alt="" className='hero-img' />
            </div>

        </div>

    );
};

export default Hero;
