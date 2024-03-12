import { useState, useEffect } from "react";
import "./App.css";
import DefaultFees from "./DefaultFees";
import RunFees from "./RunFees";
import "bootstrap/dist/css/bootstrap.min.css";
import wpm from "./assets/img/wpm2.png";

const Header = () => {
  return (
    <div className="header">
      <div className="logo-title">
        <img src={wpm} alt="logo" className="logo"></img>
        <div className="title">
          <h2>FEE</h2>
          <h3>GENERATOR</h3>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [defaultFees, setDefaultFees] = useState([]);

  useEffect(() => {
    fetchDefaultFees();
  }, []);

  const fetchDefaultFees = async () => {
    const response = await fetch("http://127.0.0.1:5000/");
    const data = await response.json();
    setDefaultFees(data.defaultFees);
  };

  return (
    <>
      <Header />
      {/* <DefaultFees defaultFees={defaultFees} /> */}
      <RunFees defaultFees={defaultFees} />
    </>
  );
}

export default App;
