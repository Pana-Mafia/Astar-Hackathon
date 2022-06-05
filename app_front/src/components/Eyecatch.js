import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

const Eyecatch = () => {
  const navigate = useNavigate();
  function switchNetwork(e) {
    e.target.checked ? navigate("/") : navigate("/Shibuya");
  }
  return (
    <div>
      <div className="header">
        <h1 className="heading gradient-text">
          <span role="img" aria-label="hand-wave">
            🚀
          </span>{" "}
          Taskal 🚀
        </h1>
      </div>
      <div className="bio">
        Web3 Task-Manager<br></br>
        <br></br>
        (Alpha test for TRUST SMITH Team)
        <br></br>
        <br></br>
        <br></br>
        Version Rinkeby
        <br></br>
        <br></br>
        🔥🚀 Work to Earn $ETH 🔥🚀
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Shibuya Test Net</p>
          <Switch onChange={switchNetwork}></Switch>
          <p>Astar network</p>
        </div>
        <br />
        <div className="Button">
          <Link className="b_text" to={`/`}>
            Rinkeby
            <br /> Testnet
          </Link>
        </div>
        <div className="Button_passive">
          {/* <Link className="b_text" to={`/Shibuya`}>Fuji<br /> Testnet</Link> */}
          <Link className="b_text" to={`/Shibuya`}>
            Fuji
            <br /> Testnet
          </Link>
        </div>
        {/* <Link to={`/team`}>チームの登録はこちら</Link> */}
        <br />
      </div>
    </div>
  );
};

export default Eyecatch;
