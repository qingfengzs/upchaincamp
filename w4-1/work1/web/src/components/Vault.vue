<template>
  <div class="container"> <button @click="connect" class="button">链接钱包</button>
    <div class="address">我的地址: {{ account }}</div>
    <div class="token-info">
      <h2>基本信息</h2>
      <div class="info-item">Token 名称: {{ name }}</div>
      <div class="info-item">Token 符号: {{ symbol }}</div>
      <div class="info-item">Token 精度: {{ decimal }}</div>
      <div class="info-item">Token 发行量: {{ supply }}</div>
      <div class="info-item">我的 Token 余额: {{ balance }}</div>
      <div class="info-item">我的 ETH 余额: {{ ethbalance }}</div>
      
    </div>
    <div class="transfer">
      <h2>转账</h2>
      <div class="transfer-item"> 转账到: <input type="text" v-model="recipient" class="input" /> </div>
      <div class="transfer-item"> 转账金额: <input type="text" v-model="amount" class="input" /> </div>
      <button @click="transfer" class="button">转账</button>
    </div>
    <div class="bank">
      <div class="info-item">我的存款金额余额: {{ depositBalance }}</div>
      <h2>存款:授权+转账</h2>
      <!-- <div class="transfer-item"> 授权到: <input type="text" v-model="approveRecipient" class="input" /> </div> -->
      <div class="transfer-item"> 转账金额: <input type="text" placeholder="输入质押量"  v-model="approveAmount" class="input" /> </div>
      <button @click="approve" class="button">1.授权</button> 
      <button @click="transferFrom" class="button">2.转账</button>
    </div>
    <div class="deposit">
      <h2>存款:离线签名</h2> <input v-model="stakeAmount" placeholder="输入质押量" class="input" />
       <button @click="permitDeposit" class="button">离线授权存款</button>
    </div>
    <div class="withdraw">
      <h2>提款</h2> <input v-model="withdrawAmount" placeholder="输入提取数量" class="input" /> 
      <button @click="withdraw" class="button">提款</button>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

import erc2612Addr from '../../deployments/dev/ERC2612.json'
import erc2612Abi from '../../deployments/abi/ERC2612.json'

import bankAddr from '../../deployments/dev/Vault.json'
import bankAbi from '../../deployments/abi/Vault.json'

import vaultAddr from '../../deployments/dev/Vault.json'
import vaultAbi from '../../deployments/abi/Vault.json'


export default {
  name: 'Vault',
  props: {
    msg: String
  },
  data() {
    return {
      account: null,
      recipient: null,
      approveRecipient:null,
      approveAmount:null,
      amount: null,
      balance: null,
      ethbalance: null,

      name: null,
      decimal: null,
      symbol: null,
      supply: null,

      stakeAmount: null,
      erc20Token: null,
      // vault 
      vault: '',
      depositBalance: 0,
      withdrawAmount: 0,
    }
  },
  methods: {
    async connect() {
      await this.initProvider()
      await this.initAccount()

      // 如果获取到了账号,进行合约初始化，并读取合约数据
      if (this.account) {
        this.initContract()
        this.readContract();
      }

    },

    async initProvider() {
      if (window.ethereum) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        let network = await this.provider.getNetwork()
        this.chainId = network.chainId;
        console.log("chainId:", this.chainId);

      } else {
        console.log("Need install MetaMask")
      }
    },

    async initAccount() {
      try {
        this.accounts = await this.provider.send("eth_requestAccounts", []);
        console.log("accounts:" + this.accounts);
        this.account = this.accounts[0];

        this.signer = this.provider.getSigner()
      } catch (error) {
        console.log("User denied account access", error)
      }
    },

    async initContract() {
      this.erc20Token = new ethers.Contract(erc2612Addr.address,
        erc2612Abi, this.signer);

      this.bank = new ethers.Contract(bankAddr.address,
        bankAbi, this.signer);
      console.log('vaultAddr:==', vaultAddr)
      console.log('vaultAddr.address:==', vaultAddr.address)
      this.vault = new ethers.Contract(vaultAddr.address,
        vaultAbi, this.signer);
    },

    readContract() {
      this.provider.getBalance(this.account).then((r) => {
        this.ethbalance = ethers.utils.formatUnits(r, 18);
      });

      this.erc20Token.name().then((r) => {
        this.name = r;
      })
      this.erc20Token.decimals().then((r) => {
        this.decimal = r;
      })
      this.erc20Token.symbol().then((r) => {
        this.symbol = r;
      })
      this.erc20Token.totalSupply().then((r) => {
        this.supply = ethers.utils.formatUnits(r, 18);
      })

      this.erc20Token.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      })

      this.vault.deposited(this.account).then((r) => {
        this.depositBalance = ethers.utils.formatUnits(r, 18);
      })

    },


    // async transferEth() {
    //   let tx = await this.signer.sendTransaction({
    //     to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    //     value: ethers.parseEther("1.0")
    //   });

    //   console.log(tx)

    //   let receipt = await tx.wait();
    //   console.log(receipt)
    // },


    transfer() {
      if(this.account == null ){
        this.$message.error("请先连接钱包");
        return false;
      }
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.erc20Token.transfer(this.recipient, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.readContract();
      })
    },

    approve() {
      if(this.account == null ){
        this.$message.error("请先连接钱包");
        return false;
      }
      let amount = ethers.utils.parseUnits(this.approveAmount, 18);
      this.erc20Token.approve(this.vault.address, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.readContract();
      })
    },

    transferFrom() {
      if(this.account == null ){
        this.$message.error("请先连接钱包");
        return false;
      }
      let amount = ethers.utils.parseUnits(this.approveAmount, 18);
      console.log(`from:${this.account},to:${this.approveRecipient},amount:${amount}`)
      this.vault.deposit(this.account, amount).then((r) => {
        console.log(r);  // 返回值不是true
        this.readContract();
      })
    },

    async permitDeposit() {
      let nonce = await this.erc20Token.nonces(this.account);
      this.deadline = Math.ceil(Date.now() / 1000) + parseInt(20 * 60);

      let amount = ethers.utils.parseUnits(this.stakeAmount).toString();

      const domain = {
        name: 'JYToken',
        version: '1',
        chainId: this.chainId,
        verifyingContract: erc2612Addr.address
      }

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" }
        ]
      }

      const message = {
        owner: this.account,
        spender: vaultAddr.address,
        value: amount,
        nonce: nonce,
        deadline: this.deadline
      }
      console.log("message:", message);
      const signature = await this.signer._signTypedData(domain, types, message);
      console.log(signature);
      const { v, r, s } = ethers.utils.splitSignature(signature);

      try {
        let tx = await this.vault.permitDeposit(this.account, amount, this.deadline, v, r, s);

        let receipt = await tx.wait();
        this.readContract();
      } catch (e) {
        alert(` Error Code : ${e.code} \n Error Message : ${e.data.message}`)
      }

    },
    async withdraw() {
      let amount = ethers.utils.parseUnits(this.withdrawAmount).toString();
      let tx = await this.vault.withdraw(amount);
      let result = await tx.wait();
      this.readContract();
    },
  }
}
</script>

<style>
.container {
  background-color: #1c1c1c;
  color: #fff;
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding-left: 40%;
}

.button {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.button:hover {
  background-color: #3e8e41;
}

.address {
  font-size: 18px;
  margin-top: 20px;
}

.token-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
}

.transfer {
  margin-top: 20px;
}

.transfer-item {
  margin-bottom: 10px;
}

.input {
  padding: 5px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
}

.deposit {
  margin-top: 20px;
}

.withdraw {
  margin-top: 20px;
}
</style>