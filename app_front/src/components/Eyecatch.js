import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

const Eyecatch = (props) => {
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
        Version {props.version}
        <br></br>
        <br></br>
        <br></br>
        🔥🚀 Work to Earn {props.unit} 🔥🚀
        <br />
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Fuji Testnet</div>
          <Switch
            defaultChecked={props.checked}
            onChange={switchNetwork}
          ></Switch>
          <div>Rinkeby Testnet</div>
        </div>
        {/* <br />
        <div className="Button">
          <Link className="b_text" to={`/`}>
            Rinkeby
            <br /> Testnet
          </Link>
        </div>
        <div className="Button_passive">
          <Link className="b_text" to={`/Shibuya`}>Fuji<br /> Testnet</Link>
          <Link className="b_text" to={`/Shibuya`}>
            Fuji
            <br /> Testnet
          </Link>
        </div> */}
        {/* <Link to={`/team`}>チームの登録はこちら</Link> */}
        {/* <br /> */}
      </div>
    </div>
  );
};

export default Eyecatch;
