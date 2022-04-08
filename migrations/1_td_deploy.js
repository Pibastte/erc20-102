require('dotenv').config();

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var exerciceSolution = artifacts.require("ExerciceSolution.sol");
var depositERC20 = artifacts.require("ERC20Mintable.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        console.log("starting deployment");
        await deployTDToken(deployer, network, accounts);
        console.log("TDToken connected");
        await deployEvaluator(deployer, network, accounts);
        console.log("Evaluator connected", process.env.DEPLOY_PRODUCTION == "false");
        if (!process.env.TDERC20_ADDRESS) {
          console.log("Setting permissions");
          await setPermissionsAndRandomValues(deployer, network, accounts);
        }
        await deployRecap(deployer, network, accounts);
        console.log("about to deploy...")
        await deployDepositERC20(deployer, network, accounts);
        console.log("deployed DepositERC20");
        await deployExerciceSolution(deployer, network, accounts);
        console.log("Deployed ExerciceSolution");   
        await printBalance(accounts[0]);
        await exercice1();
        await printBalance(accounts[0]);
        await exercice2();
        await printBalance(accounts[0]);
        await exercice3();
        await printBalance(accounts[0]);
        await exercice4();
        await printBalance(accounts[0]);
        await exercice5(accounts);
        await printBalance(accounts[0]);
        await exercice6();
        await printBalance(accounts[0]);
        await exercice7();
        await printBalance(accounts[0]);
        await exercice8();
        await printBalance(accounts[0]);
        await exercice9();
        await printBalance(accounts[0]);
    });
};

async function deployTDToken(deployer, network, accounts) {
  if (process.env.TDERC20_ADDRESS) {
    TDToken = await TDErc20.at(process.env.TDERC20_ADDRESS);
    ClaimableToken = await ERC20Claimable.at(process.env.CLAIMABLE_TOKEN_ADDRESS);
  }
  else {
    TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"), {from: accounts[1]})
    ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"), {from: accounts[1]})  
  }
}

async function deployEvaluator(deployer, network, accounts) {
  if (process.env.TDERC20_ADDRESS) {
    Evaluator = await evaluator.at(process.env.EVALUATOR_ADDRESS);
  }
  else {
	  Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address, {from: accounts[1]})
  }
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true, {from: accounts[1]})
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deployDepositERC20(deployer, network, accounts) {
  if (process.env.DEPOSIT_ERC20) {
    ERC20Deposit = await depositERC20.at(process.env.DEPOSIT_ERC20)
  }
  else {
    ERC20Deposit = await depositERC20.new("DEPLOY-ERC20-102", "DEPLOY-ERC20-102", {from: accounts[1]})
  }
}

async function deployExerciceSolution(deployer, network, accounts) {
  console.log(accounts[0]);
  ExerciceSolution = await exerciceSolution.new(ClaimableToken.address, ERC20Deposit.address, {from: accounts[1]});
  console.log("hello");
  await Evaluator.submitExercice(ExerciceSolution.address);
  console.log("hello");
  await ERC20Deposit.setMinter(ExerciceSolution.address, true, {from: accounts[1]})
  console.log("Exercice submitted");
}

async function exercice1() {
  await ClaimableToken.claimTokens();
  await Evaluator.ex1_claimedPoints();
}

async function exercice2() {
  await Evaluator.ex2_claimedFromContract();
}

async function exercice3() {
  await Evaluator.ex3_withdrawFromContract();
}

async function exercice4() {
  await ClaimableToken.increaseAllowance(ExerciceSolution.address, await ClaimableToken.distributedAmount.call());
  await Evaluator.ex4_approvedExerciceSolution();
}

async function exercice5(accounts) {
  await ClaimableToken.decreaseAllowance(ExerciceSolution.address, await ClaimableToken.allowance(accounts[0], ExerciceSolution.address));
  await Evaluator.ex5_revokedExerciceSolution();
}

async function exercice6() {
  await Evaluator.ex6_depositTokens();
}

async function exercice7() {
  await Evaluator.ex7_createERC20();
}

async function exercice8() {
  await Evaluator.ex8_depositAndMint();
}

async function exercice9() {
  await Evaluator.ex9_withdrawAndBurn();
}

async function printBalance(account) {
  console.log("Balance:", (await TDToken.balanceOf(account)).toString());
}
