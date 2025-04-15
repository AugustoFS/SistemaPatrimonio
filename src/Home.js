// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Em construção 🚧</h2>
            <p>Esta página ainda está sendo desenvolvida.</p>
            <button className="button" onClick={() => navigate('/')}>
                Voltar para Login
            </button>
        </div>
    );
};

export default Home;
