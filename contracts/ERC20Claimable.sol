pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC20Claimable.sol";

contract ERC20Claimable is IERC20Claimable, ERC20 {

	uint256 public distributedAmount = 100002500002300000;
	constructor(string memory name, string memory symbol,uint256 initialSupply) public ERC20(name, symbol) 
	{
	   _mint(msg.sender, initialSupply);
	}

	function claimTokens() public override returns (uint256)
	{
	  _mint(msg.sender, distributedAmount);
	  return distributedAmount;
	}

}
