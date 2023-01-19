type Network = "private" | "bsc_testnet" | "mumbai";
/** @dev - Wallet address that's make possible to sign transactions */
const BRIDGE_WALLET_ADDRESS = "0x9F4A331c2B456B024B2dA4736abaF6529074393d";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {

    /** @dev - Deploy to network(-s) from Network type */
    const TokenFactory = artifacts.require("TokenFactory");
    const SoloBridge = artifacts.require("SoloBridge");

    deployer.deploy(TokenFactory, "OriginToken", "OT");
    deployer.deploy(SoloBridge, BRIDGE_WALLET_ADDRESS);
  };
};