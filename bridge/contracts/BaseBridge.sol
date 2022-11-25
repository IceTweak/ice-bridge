// SPDX-License-Identifier: ISC

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IToken.sol";

///@title Basic bridge contract
contract BaseBridge is Ownable {
    IToken public token;

    /// @dev Allows avoid to process the same transfer twice
    mapping(address => mapping(uint256 => bool)) public processedNonces;

    /// @dev Keeps state of the contracts to execute methods
    enum Step {
        Burn,
        Mint
    }
    event Transfer(
        address from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 nonce,
        Step indexed step
    );

    constructor(address _token) {
        token = IToken(_token);
    }

    ///@dev Burns tokens that should transfered out
    ///@param to - address which tokens will burnt
    ///@param amount - amount of token to burn
    ///@param nonce - allow to check if transfer is alredy processed
    function burn(
        address to,
        uint256 amount,
        uint256 nonce
    ) external {
        require(
            processedNonces[msg.sender][nonce] == false,
            "transfer already processed"
        );
        processedNonces[msg.sender][nonce] = true;
        token.burn(msg.sender, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            Step.Burn
        );
    }

    ///@dev Mint tokens that should transfered in
    ///@param from - tokens spent address
    ///@param to - address which get the tokens in
    ///@param amount - amount of token to burn
    ///@param nonce - allow to check if transfer is alredy processed
    function mint(
        address from,
        address to,
        uint256 amount,
        uint256 nonce
    ) external onlyOwner {
        require(
            processedNonces[from][nonce] == false,
            "transfer already processed"
        );
        processedNonces[from][nonce] = true;
        token.mint(to, amount);
        emit Transfer(from, to, amount, block.timestamp, nonce, Step.Mint);
    }
}
