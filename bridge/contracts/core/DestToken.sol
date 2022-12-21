// SPDX-License-Identifier: ISC

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @title ERC20 implementation created by bridge for transfering
/// @notice Tokens that recipient recives via using bridge to
/// destination network
contract DestToken is ERC20, ERC20Burnable {
    address bridge;

    constructor(
        address _bridge,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        bridge = _bridge;
    }

    modifier onlyBridge() {
        require(bridge == msg.sender, "Only bridge has allowance");
        _;
    }

    /// @dev called from the bridge when tokens are locked on ETH side
    function mint(address _recipient, uint256 _amount)
        public
        virtual
        onlyBridge
    {
        _mint(_recipient, _amount);
        // console.log("Tokens minted for %s", _recipient);
    }

    /// @dev called from the bridge when tokens are received on destination side
    function burnFrom(address _account, uint256 _amount)
        public
        virtual
        override(ERC20Burnable)
        onlyBridge
    {
        super.burnFrom(_account, _amount);
        // console.log("Tokens burned from %s", _account);
    }
}
