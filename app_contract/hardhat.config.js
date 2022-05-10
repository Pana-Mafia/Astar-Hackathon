require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");
// これが必要
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  etherscan: {
    apiKey: "MDGXI21P4C4ZH4HPW5S7GGQBZZ5YCIQR2S",
  },
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    astar: {
      // Shibuyaノードのエンドポイント
      url: "https://rpc.astar.network:8545/",
      // ガス代を払うアカウントの秘密鍵（envファイルから読み込む）
      accounts:
        [process.env.PRIVATE_KEY],
    },
    shibuya: {
      // Shibuyaノードのエンドポイント
      url: "https://rpc.shibuya.astar.network:8545",
      // ガス代を払うアカウントの秘密鍵（envファイルから読み込む）
      accounts:
        [process.env.PRIVATE_KEY],
    },
  },
};