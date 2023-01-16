type Network = "private" | "bsc_testnet";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {

    /**@dev - Deploy to network(-s) from Network type */
    const TokenFactory = artifacts.require("TokenFactory");
    const SoloBridge = artifacts.require("SoloBridge");
    const DestToken = artifacts.require("DestToken");

    deployer.deploy(TokenFactory, "OriginToken", "OT");
    deployer.deploy(SoloBridge);
  };
};