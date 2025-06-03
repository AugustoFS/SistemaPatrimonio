import React from 'react';

const Home = ({ usuarioId }) => {
    return (
        <div className="container">
            <h2>Bem-vindo!</h2>
            <p>Usuário ID: {usuarioId}</p>
        </div>
    );
};

export default Home;
