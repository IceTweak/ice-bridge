import { expect, use } from "chai";
import { Contract, ethers } from "ethers";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import { AddressZero } from "@ethersproject/constants";
import SoloBridge from "../build/SoloBridge.json";
import TokenFactory from "../build/TokenFactory.json";
import DestToken from "../build/DestToken.json";

use(solidity);

describe("SoloBridge", () => {
  const [sender, wallet, receiver1, receiver2] =
    new MockProvider().getWallets();
  let soloBridge: Contract;
  let token: Contract;

  beforeEach(async () => {
    soloBridge = await deployContract(sender, SoloBridge, [wallet.address]);
    token = await deployContract(sender, TokenFactory, ["OriginToken", "OT"]);
  });

  it("should init the contract", async () => {
    expect(await soloBridge.bridgeWallet()).to.eq(wallet.address);
  });

  describe("Bridge creation", () => {
    const TEST_VALUE = ethers.utils.parseEther("1");

    it("should revert with ErrorZeroAddress", async () => {
      await expect(soloBridge.createBridge(AddressZero)).to.be.reverted;
    });

    it("should revert with ErrorBridgeExists", async () => {
      await soloBridge.createBridge(token.address);
      await expect(soloBridge.createBridge(token.address)).to.be.reverted;
    });

    it("should create bridge from originToken", async () => {
      await expect(soloBridge.createBridge(token.address)).to.emit(
        soloBridge,
        "BridgeCreated"
      );
      expect(await soloBridge.allBridges(0)).to.eq(
        await soloBridge.getBridge(token.address)
      );
    });

    context(">> sending transactions", () => {
      let destToken: Contract;

      beforeEach(async () => {
        await soloBridge.createBridge(token.address);
        let destAddress = await soloBridge.allBridges(0);
        destToken = new ethers.Contract(destAddress, DestToken.abi, sender);

        // Send tx by wallet address (onlyBridge modifier)
        await destToken.connect(wallet).mint(receiver1.address, TEST_VALUE);
      });

      it("should mint from dest token", async () => {
        expect(await destToken.balanceOf(receiver1.address)).to.eq(TEST_VALUE);
      });

      it("should burnFrom address", async () => {
        // Approve spending funds from address for bridgeWallet
        await destToken.connect(receiver1).approve(wallet.address, TEST_VALUE);
        // Send tx after approving
        await destToken.connect(wallet).burnFrom(receiver1.address, TEST_VALUE);
        
        expect(await destToken.balanceOf(receiver1.address)).to.eq(0);
      });

      it("should revert on sending transaction by non bridgeWallet", async () => {
        await expect(
          destToken.connect(receiver1).mint(receiver1.address, TEST_VALUE)
        ).to.be.reverted;
        await expect(
          destToken.connect(receiver1).burnFrom(receiver1.address, TEST_VALUE)
        ).to.be.reverted;
      });
    });
  });
});
