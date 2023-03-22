# w3-1 作业

## 发行一个 ERC20Token (用自己的名字)，发行100000 token
token地址：0xE13b88DFadB8ce969CBB088583A41a88d1F3c335
token名称：JinYu
token符号：JY
![](images/token.png)
![](images/token-balance.png)
![](images/token-detail.png)

### 单元测试
![](images/test.png)
### 验证
![](images/verify1.png)


转账
交易Hash：0xdc6715a0762ab9c487094988f1629301a033ccd33fcb3cda5fcbd1968f2f5a6d
浏览器链接：https://mumbai.polygonscan.com/tx/0xdc6715a0762ab9c487094988f1629301a033ccd33fcb3cda5fcbd1968f2f5a6d
![](images/transfer.png)

![](images/token-balance2.png)




## 编写一个金库Vault 合约:
合约地址：0x5F91108a891AC700064F9145fA8cf714035457b3
浏览器链接：https://mumbai.polygonscan.com/address/0x5F91108a891AC700064F9145fA8cf714035457b3#code


### 验证
![](images/verify2.png)

### 编写 deposite 方法，实现 ERC20 存入Vaut，并记录每个用户存款金额 (approve/transferFrom)
```
    function deposit(uint256 amount) external {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        token.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

```
![](images/approve.png)

![](images/deposit.png)

![](images/token-balance3.png)


### 编写withdraw 方法，提取用户自己的存款

```
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        token.transfer(msg.sender, amount);
        balances[msg.sender] -= amount;
        emit Withdrawal(msg.sender, amount);
    }
```
![](images/withdraw.png)
![](images/token-balance4.png)
![](images/vault-balance.png)