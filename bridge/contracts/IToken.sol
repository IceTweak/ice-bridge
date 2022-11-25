// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.17;

interface IToken {
    function mint(address to, uint256 amount) external;

    function burn(address owner, uint256 amount) external;
}
