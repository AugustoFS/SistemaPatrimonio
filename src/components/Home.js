import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Home = ({ usuarioId }) => {
    return (
        <div className="container">
            <h2>Bem-vindo!</h2>
            <p>Usuário ID: {usuarioId}</p>
        </div>
    );
};

export default Home;
