pragma solidity ^0.6.0;

import "./ERC20Claimable.sol";
import "./IExerciceSolution.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution is IExerciceSolution
{
  IERC20Claimable ClaimableERC20;
  IERC20Mintable DepositERC20;
  uint256 public test;

  constructor(ERC20Claimable _ERC20Claimable, ERC20Mintable _ERC20Mintable)
	public 
	{
    ClaimableERC20 = _ERC20Claimable;
    DepositERC20 = _ERC20Mintable;
	}  

	function claimTokensOnBehalf() external override {
    uint256 amountClaimed = ClaimableERC20.claimTokens();
    DepositERC20.mint(msg.sender, amountClaimed);
    // balances[msg.sender] += amountClaimed;
  }

	function tokensInCustody(address callerAddress) external override returns (uint256) {
    return DepositERC20.balanceOf(callerAddress);
    // return balances[callerAddress];
  }

	function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256) {
    ClaimableERC20.transfer(msg.sender, amountToWithdraw);
    DepositERC20.burn(msg.sender, amountToWithdraw);
    // balances[msg.sender] -= amountToWithdraw;
  }

	function depositTokens(uint256 amountToWithdraw) external override returns (uint256) {
    ClaimableERC20.transferFrom(msg.sender, address(this), amountToWithdraw);
    DepositERC20.mint(msg.sender, amountToWithdraw);
    // balances[msg.sender] += amountToWithdraw;
  }

	function getERC20DepositAddress() external override returns (address) {
    return address(DepositERC20);
  }
}
