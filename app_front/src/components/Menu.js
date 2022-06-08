import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

// import { Alpha, currentAccount } from '/Users/gtyuki/Desktop/web3/Astar_Hackathon/app_front/src/Alpha';

export default props => {
  return (
    <Menu {...props}>
      <Link to="/Sample" className="menu-item" >
        ホームページ
        {/* {currentAccount} */}
      </Link>

      <br />

      <Link to="/" className="menu-item" >
        ページ2
      </Link>

      <br />

      <Link to="/" className="menu-item" >
        ページ3
      </Link>

      <br />

      <Link to="/" className="menu-item" >
        ページ4
      </Link>
    </Menu>
  );
};