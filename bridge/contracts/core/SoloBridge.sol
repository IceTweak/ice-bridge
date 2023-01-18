// SPDX-License-Identifier: ISC

pragma solidity ^0.8.17;

import "../libraries/SafeERC20Namer.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DestToken.sol";

error ErrorZeroAddress();
error ErrorBridgeExists();

/// @title Basic bridge contract
contract SoloBridge {
    event BridgeCreated(address originToken, address destToken, uint256 bridgeCount);
    mapping(address => address) public getBridge;
    address[] public allBridges;
    address public bridgeWallet;

    constructor(address _bridgeWallet) {
        bridgeWallet = _bridgeWallet;
    }

    /// @dev creates new wrapped DestToken instance
    function createBridge(address _originToken)
        external
        returns (address destToken)
    {
        if (_originToken == address(0)) {
            revert ErrorZeroAddress();
        }
        if (getBridge[_originToken] != address(0)) {
            revert ErrorBridgeExists();
        }

        string memory tokenName = string(
            abi.encodePacked("w", SafeERC20Namer.tokenName(_originToken))
        );
        string memory tokenSymbol = string(
            abi.encodePacked("w", SafeERC20Namer.tokenSymbol(_originToken))
        );

        destToken = address(
            new DestToken(bridgeWallet, tokenName, tokenSymbol)
        );

        getBridge[_originToken] = destToken;
        allBridges.push(destToken);
        emit BridgeCreated(_originToken, destToken, allBridges.length);
    }
}
