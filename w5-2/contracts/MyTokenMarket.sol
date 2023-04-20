//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IUniswapV2Router01.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public router;
    address public weth;

    constructor(address _router, address _weth) {
        router = _router;
        weth = _weth;
    }

    // 添加流动性:token-token
    function AddLiquidity(address tokenA,uint tokenAmountA,address tokenB,uint tokenAmountB) public payable {
        IERC20(tokenA).safeTransferFrom(msg.sender, address(this),tokenAmountA);
        IERC20(tokenA).safeApprove(router, tokenAmountA);

        IERC20(tokenB).safeTransferFrom(msg.sender, address(this),tokenAmountB);
        IERC20(tokenB).safeApprove(router, tokenAmountB);

        // ingnore slippage
        // (uint amountToken, uint amountETH, uint liquidity) = 
        IUniswapV2Router01(router).addLiquidity(tokenA,tokenB, tokenAmountA,tokenAmountB, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
    }

    // 添加流动性:token-eth
    function AddLiquidityWithEth(address token,uint tokenAmount) public payable {
        IERC20(token).safeTransferFrom(msg.sender, address(this),tokenAmount);
        IERC20(token).safeApprove(router, tokenAmount);

        // ingnore slippage
        // (uint amountToken, uint amountETH, uint liquidity) = 
        IUniswapV2Router01(router).addLiquidityETH{ value: msg.value}(token, tokenAmount, 0, 0, msg.sender, block.timestamp);

        //TODO: handle left
    }

    // 用 Token 购买 Token
    function buyTokenWithToken(address tokenA,address tokenB,uint amountIn,uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;

        IUniswapV2Router01(router).swapTokensForExactTokens(minTokenAmount,amountIn, path, address(this), block.timestamp);

        // uint amount = IERC20(token).balanceOf(address(this));
        // IERC20(token).safeApprove(masterchef, amount);
        // IERC20(token).transfer(msg.sender, amount);
        // IMasterChef(masterchef).deposit(1, amount);

    }

    // 用 ETH 购买 Token
    function buyTokenWithEth(address token,uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = token;

        IUniswapV2Router01(router).swapExactETHForTokens{value : msg.value}(minTokenAmount, path, address(this), block.timestamp);

        // uint amount = IERC20(token).balanceOf(address(this));
        // IERC20(token).safeApprove(masterchef, amount);
        // IERC20(token).transfer(msg.sender, amount);
        // IMasterChef(masterchef).deposit(1, amount);

    }


}