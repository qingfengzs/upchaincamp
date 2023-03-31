<template>
  <div class="container">
    <div class="header-wrapper">
      <div class="header-line-one">{{ account }}</div>
      <div class="header-line-two">
        <span>NFT 名称: {{ name }}</span>
        <span>NFT 符号: {{ symbol }}</span>
      </div>
      <img class="avatar"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU5hkxhjaJDS0f88SnvndqLDJsKqXI8NIi24tDY5Pn&s"
        alt="Avatar" />
      <el-button @click="connect" class="my-button">链接钱包</el-button>

    </div>

    <div class="address-div" style="padding-left:30%;text-align:left;">
      <el-label class="address-label">NFT地址：</el-label>
      <el-input v-model="nftAddress" placeholder="请输入NFT地址" class="nft-address" />
      <div style="margin-bottom:20px;">
        <el-label class="address-label">监听起始区块号：</el-label>
        <el-input v-model="startBlockNumber" placeholder="请输入起始BlockNumber" style="width:300px;" />
      </div>
      <!-- <el-button @click="connectNFT" class="my-button">重新链接NFT</el-button> -->
    </div>
    <div class="button-group">
      <el-button type="primary" @click="queryTransferEvent" class="my-button">开始监听新事件</el-button>
      <!-- <el-button type="primary" @click="addTransfer" class="my-button">开始监听新事件</el-button> -->
    </div>
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" class="my-table">
        <el-table-column prop="from" label="来自" width="400" />
        <el-table-column prop="to" label="去向" width="400" />
        <el-table-column prop="tokenId" label="tokenId" width="400" />
      </el-table>
    </div>
  </div>
</template>

<script >
import { ethers } from 'ethers'

import erc2612Addr from '../../deployments/dev/ERC2612.json'
import erc2612Abi from '../../deployments/abi/ERC2612.json'

import nftAddr from '../../deployments/dev/JYNFT.json'
import nftAbi from '../../deployments/abi/JYNFT.json'

export default {
  name: 'JYNFT',
  data() {
    return {
      account: null,
      recipient: null,
      amount: null,
      balance: null,
      ethbalance: null,

      name: null,
      decimal: null,
      symbol: null,
      supply: null,

      // vault 
      nftAddress:'0xb72056E262DD0E155aB76714d5165f63bF09bA68',
      tableData: [],
      startBlockNumber:33490097,
      form: {
        name: '',
      },
    }
  },
  methods: {
    connectNFT(){
      this.initContract();
      this.readContract();
    },
    addTransfer() {
      console.log('手动添加事件');
      this.tableData.push({
        from: '1',
        to: '2',
        tokenId: '3'
      });
      this.$forceUpdate()
    },
    async connect() {
      await this.initProvider()
      await this.initAccount()

      // 如果获取到了账号,进行合约初始化，并读取合约数据
      if (this.account) {
        this.initContract();
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
      if(this.provider == null){
        this.$message.error('请先链接钱包');
        return false;
      }
      
      if(this.nftAddress == ''){
        this.$message.error("请先输入NFT地址");
        return false;
      }
      // this.erc20Token = new ethers.Contract(erc2612Addr.address, erc2612Abi, this.signer);
      this.nft = new ethers.Contract(this.nftAddress, nftAbi, this.signer);
      this.readonlyNft = new ethers.Contract(this.nftAddress, nftAbi, this.provider);
    },


    readContract() {
      this.provider.getBalance(this.account).then((r) => {
        this.ethbalance = ethers.utils.formatUnits(r, 18);
      });

      this.nft.name().then((r) => {
        this.name = r;
      })
      // this.erc20Token.decimals().then((r) => {
      //   this.decimal = r;
      // })
      this.nft.symbol().then((r) => {
        this.symbol = r;
      })
      // this.nft.totalSupply().then((r) => {
      //   this.supply = ethers.utils.formatUnits(r, 18);
      // })

      this.nft.balanceOf(this.account).then((r) => {
        this.balance = ethers.utils.formatUnits(r, 18);
      })

    },

    // transfer() {
    //   let amount = ethers.utils.parseUnits(this.amount, 18);
    //   this.erc20Token.transfer(this.recipient, amount).then((r) => {
    //     console.log(r);  // 返回值不是true
    //     this.readContract();
    //   })
    // },

    async queryTransferEvent() {
      if(this.readonlyNft == null){
        this.$message.error("请先绑定NFT");
        return false;
      }
      if(this.startBlockNumber == '' || this.startBlockNumber == null ){
        this.$message.error("请输入起始区块号");
        return false;
      }

      const block = await this.provider.getBlockNumber()

      // 首先查询历史事件33490097
      const historyEvent = await this.readonlyNft.queryFilter('Transfer',parseInt(this.startBlockNumber),block);
      historyEvent.forEach((item)=>{
        console.log(JSON.stringify(item.args))
        this.tableData.push({
          from: item.args[0],
          to: item.args[1],
          tokenId:ethers.BigNumber.from(item.args[2])
        })
      });

      // 监听新产生的事件
      const eventTransfer = this.readonlyNft.filters.Transfer(null, null, null);
      this.nft.on(eventTransfer, (from, to, tokenId) => {
        console.log(from, to, tokenId);
        this.tableData.push({
          from: from,
          to: to,
          tokenId: tokenId
        });
        this.$forceUpdate()
      })
      
      this.$message({
        message: '开始监听新事件',
        type: 'success'
      });
    }

  }
}
</script>

<style scoped>
 .address-div {
   text-align: center;
 }

 .address-label {
   font-size: 20px;
   color: rgb(255, 255, 255);
 }

 .nft-address {
   margin-top: 20px;
   margin-bottom: 20px;
   font-size: 20px;
   color: #000;
   width: 800px;
 }

 .container {
   display: flex;
   flex-direction: column;
   height: 100%;
   background-color: #1a1a1a;
   color: #fff;
   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
 }

 .header-wrapper {
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   padding: 20px 120px;
   border-bottom: 1px solid #333;
 }

 .header-line-one {
   font-size: 2rem;
   margin-bottom: 10px;
 }

 .header-line-two {
   display: flex;
   gap: 20px;
   font-size: 1.2rem;
   margin-top: 10px;
 }

 .table-wrapper {
   flex-grow: 1;
   padding: 20px 50px;
 }

 .button-group {
   display: flex;
   justify-content: center;
   gap: 10px;
   padding: 20px 0;
 }

 .my-button {
   border: none;
   background-color: #56c1ff;
   color: #fff;
   font-weight: bold;
   padding: 15px 40px;
   border-radius: 5px;
   transition: all 0.2s ease-in-out;
   font-size: 1.2rem;
 }

 .my-button:hover {
   background-color: #3399ff;
   cursor: pointer;
 }

 .avatar {
   border-radius: 50%;
   width: 70px;
   height: 70px;
   position: fixed;
   top: 40px;
   right: 40px;
   border: 2px solid #56c1ff;
 }

 .el-table__header {
   background-color: #333;
   color: #fff;
   font-size: 1.2rem;
 }

 .el-table__body {
   background-color: #1a1a1a;
 }

 .el-table__row {
   transition: all 0.2s ease-in-out;
 }

 .el-table__row:hover {
   background-color: #333;
 }

 .el-table__column {
   font-size: 1.2rem;
 }

 .el-input__inner {
   background-color: #333;
   color: #fff;
   border: none;
   border-radius: 5px;
   font-size: 1.2rem;
 }

 .el-input__inner:focus {
   box-shadow: none;
 }

 .el-button--primary {
   background-color: #56c1ff;
   color: #fff;
   font-weight: bold;
   border: none;
   border-radius: 5px;
   transition: all 0.2s ease-in-out;
   font-size: 1.2rem;
 }

 .el-button--primary:hover {
   background-color: #3399ff;
   cursor: pointer;
 }

 .el-button--text {
   color: #56c1ff;
   font-weight: bold;
   font-size: 1.2rem;
 }

 .el-button--text:hover {
   color: #3399ff;
   cursor: pointer;
 }

 .el-form-item__label {
   color: #fff;
   font-size: 1.2rem;
 }

 .el-form-item__content {
   font-size: 1.2rem;
 }

 .el-form-item__error {
   color: #ff4d4f;
   font-size: 1.2rem;
 }

 .el-form-item__error:focus {
   box-shadow: none;
 }

 .el-form-item__error:hover {
   color: #ff7875;
   cursor: pointer;
 }

 .el-form-item__error:before {
   content: "⚠ ";
 }

 .el-form-item__error:after {
   content: attr(data-content);
   position: absolute;
   top: 100%;
   left: 50%;
   transform: translateX(-50%);
   padding: 5px;
   background-color: #ff4d4f;
   color: #fff;
   font-size: 1rem;
   border-radius: 5px;
   opacity: 0;
   transition: all 0.2s ease-in-out;
   pointer-events: none;
 }

 .el-form-item__error:hover:after {
   opacity: 1;
   pointer-events: auto;
 }

 @media screen and (max-width: 768px) {
   .header-wrapper {
     padding: 20px;
   }

   .avatar {
     top: 20px;
     right: 20px;
   }

   .button-group {
     flex-direction: column;
     align-items: center;
     gap: 10px;
   }

   .my-button {
     padding: 10px 20px;
     font-size: 1rem;
   }

   .el-table__header {
     font-size: 1rem;
   }

   .el-table__column {
     font-size: 1rem;
   }

   .el-input__inner {
     font-size: 1rem;
   }

   .el-button--primary {
     font-size: 1rem;
   }

   .el-form-item__label {
     font-size: 1rem;
   }

   .el-form-item__content {
     font-size: 1rem;
   }

   .el-form-item__error {
     font-size: 1rem;
   }
 }
</style>