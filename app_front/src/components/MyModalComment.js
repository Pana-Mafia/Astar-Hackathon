import { Link, useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";

const MyModalComment = (props) => {
  const navigate = useNavigate();
  function switchNetwork(e) {
    e.target.checked ? navigate("/") : navigate("/Fuji");
  }
  return (
    <div>
      <div className="header">
        <h1 className="heading gradient-text">
          <span role="img" aria-label="hand-wave">
            ๐
          </span>{" "}
          Taskal ๐
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
        ๐ฅ๐ Work to Earn {props.unit} ๐ฅ๐
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
        {/* <Link to={`/team`}>ใใผใ ใฎ็ป้ฒใฏใใกใ</Link> */}
      </div>
    </div>
  );
};

export default MyModalComment;
