import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import CurrentAccount from "./CurrentAccount";

export const Wallet = async () => {

    var currentAccount = null

    console.log("あああ")
    // Create a connector
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
    });

    console.log("あああ")

    // Check if connection is already established
    if (!connector.connected) {
        // create new session
        connector.createSession();
    }
    console.log("あああ")

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
        if (error) {
            throw error;
        }

        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        console.log(accounts[0])
        currentAccount = accounts[0]
        return (currentAccount)
    });

    connector.on("session_update", (error, payload) => {
        if (error) {
            throw error;
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0];
        console.log(accounts[0])
        // return (accounts[0])
        currentAccount = accounts[0]
    });

    console.log("あああ")

    connector.on("disconnect", (error, payload) => {
        if (error) {
            throw error;
        }
        // Delete connector
    })
    console.log(currentAccount)
    return (currentAccount)
};

export default Wallet;