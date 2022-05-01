const main = async () => {
    // コントラクトがコンパイルします
    // コントラクトを扱うために必要なファイルが `artifacts` ディレクトリの直下に生成されます。
    const testContractFactory = await hre.ethers.getContractFactory("CreateTask");
    // Hardhat がローカルの Ethereum ネットワークを作成します。
    const testContract = await testContractFactory.deploy();
    // コントラクトが Mint され、ローカルのブロックチェーンにデプロイされるまで待ちます。
    await testContract.deployed();
    console.log("Contract deployed to:", testContract.address);
    // makeAnEpicNFT 関数を呼び出す。NFT が Mint される。
    // let txn = await nftContract.makeAnEpicNFT()
    // // Minting が仮想マイナーにより、承認されるのを待ちます。
    // await txn.wait()
    // console.log("Minted NFT #1")
};
// エラー処理を行っています。
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();