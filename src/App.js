import React, { useState } from "react";
import TelaIntroducao from "./components/TelaIntroducao";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";

function App() {
  const [tela, setTela] = useState("intro");

  return (
    <>
      {tela === "intro" && (
        <TelaIntroducao onLogin={() => setTela("login")} onSignup={() => setTela("signup")} />
      )}
      {tela === "login" && <Login />}
      {tela === "signup" && <Cadastro />}
    </>
  );
}

export default App;
