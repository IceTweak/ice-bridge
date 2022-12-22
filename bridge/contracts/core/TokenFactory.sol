// SPDX-License-Identifier: ISC

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ERC20 contract for testing bridge functions
contract TokenFactory is ERC20 {
    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address _owner, uint256 amount) external {
        _burn(_owner, amount);
    }
}
