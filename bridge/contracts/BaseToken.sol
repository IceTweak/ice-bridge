// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaseToken is ERC20 {
    address public owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "OnlyOwner: only the owner can trigger this method!"
        );
        _;
    }

    function updateOwner(address newowner) external onlyOwner {
        require(msg.sender == owner, "only owner");
        owner = newowner;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "only owner");
        _mint(to, amount);
    }

    function burn(address owner, uint256 amount) external {
        require(msg.sender == owner, "only owner");
        _burn(owner, amount);
    }
}
