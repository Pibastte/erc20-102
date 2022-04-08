pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC20Mintable.sol";

contract ERC20Mintable is IERC20Mintable, ERC20 
{
  mapping(address => bool) public minters;

  constructor(string memory name, string memory symbol) public ERC20(name, symbol){
    minters[msg.sender] = true;
  }

	function setMinter(address minterAddress, bool isMinter) override external {
    require(minters[msg.sender], "No permission");
    minters[minterAddress] = isMinter;
  }

	function mint(address toAddress, uint256 amount) override external {
    require(minters[msg.sender], "No permission");
	   _mint(toAddress, amount);
  }

	function isMinter(address minterAddress) override external returns (bool) {
    return minters[minterAddress];
  }

  function burn(address burnerAddress, uint256 amount) override external {
    require(minters[msg.sender], "No permission");
    _burn(burnerAddress, amount);
  }
}
