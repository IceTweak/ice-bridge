type Network = "private";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {
    const TokenFactory = artifacts.require("TokenFactory");
    const SoloBridge = artifacts.require("SoloBridge");
    const DestToken = artifacts.require("DestToken");

    // deployer.deploy(TokenFactory, "OriginToken", "OT");
    // deployer.deploy(TokenFactory, "BridgingToken", "BT");
    deployer.deploy(SoloBridge);

    // const originToken = await TokenFactory.deployed();
    // console.log(
    //   `TokenFactory deployed at ${originToken.address} in network: ${network}.`
    // );
    // const bridgingToken = await TokenFactory.deployed();
    // console.log(
    //   `TokenFactory deployed at ${bridgingToken.address} in network: ${network}.`
    // );
    const soloBridge = await SoloBridge.deployed();
    console.log(
      `SoloBridge deployed at ${soloBridge.address} in network: ${network}.`
    );
  };
};