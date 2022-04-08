pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IERC20Claimable is IERC20 {

	function claimTokens() external returns (uint256);

}
