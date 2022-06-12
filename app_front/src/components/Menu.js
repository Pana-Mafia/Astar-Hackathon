import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

import { useEffect, useState } from "react";

import { ethers } from "ethers";

import CurrentAccount from './CurrentAccount'

export default props => {
  return (
    <Menu {...props}>
      <Link to="/Sample" className="menu-item" >
        ホームページ
      </Link>

      {/* <CurrentAccount /> */}

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