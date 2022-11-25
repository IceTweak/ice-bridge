const NativeToken = artifacts.require('NativeToken');

module.exports = function(deployer) {
    deployer.deploy(NativeToken, 'NativeToken', 'NTK', 10);
}