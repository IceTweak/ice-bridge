import {
  SoloBridgeInstance,
  TokenFactoryInstance,
} from "../types/truffle-contracts";
import {expect, use} from 'chai';
import { AddressZero } from "ethers/constants";

const SoloBridge = artifacts.require("SoloBridge");
const TokenFactory = artifacts.require("TokenFactory");

contract("SoloBridge", (accounts) => {
  let soloBridge: SoloBridgeInstance;
  let token: TokenFactoryInstance;

  beforeEach(async () => {
    soloBridge = await SoloBridge.deployed();
    token = await TokenFactory.deployed();
  });

  it("should get instance of contract", async () => {
    console.log(await soloBridge.bridgeWallet());
  });

  /** @test Need to add chai matchers */
  describe("Bridge creation", () => {
    xit("should revert with ErrorZeroAddress", async () => {
      await expect(soloBridge.createBridge(AddressZero)).to.be.reverted;
    });

    xit("should revert with ErrorBridgeExists", async () => {
      await soloBridge.createBridge(token.address);
      await expect(soloBridge.createBridge(token.address)).to.be.reverted;
    });

    xit("should create bridge from originToken", async () => {
      await expect(soloBridge.createBridge(token.address)).to.emit(
        soloBridge,
        "BridgeCreated"
      );
      expect(await soloBridge.allBridges(0)).to.eq(
        await soloBridge.getBridge(token.address)
      );
    });
  });
});
