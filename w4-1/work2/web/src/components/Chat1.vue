<template>
  <div>
    <h1>NFT Transfer查询</h1>
    <form @submit.prevent="search">
      <label for="contractAddress">合约地址：</label>
      <input type="text" id="contractAddress" v-model="contractAddress" required>
      <br>
      <label for="tokenId">Token ID：</label>
      <input type="text" id="tokenId" v-model="tokenId" required>
      <br>
      <button type="submit">查询</button>
    </form>
    <div v-if="transferData">
      <h2>Transfer信息</h2>
      <el-table :data="[transferData]">
        <el-table-column prop="from" label="From"></el-table-column>
        <el-table-column prop="to" label="To"></el-table-column>
        <el-table-column prop="tokenId" label="Value"></el-table-column>
      </el-table>
    </div>
    <div v-else-if="searched">
      <p>没有找到相关的Transfer信息。</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getTransferData } from '../api'; // 假设有一个名为getTransferData的API函数，用于获取Transfer信息

export default {
  setup() {
    const contractAddress = ref('');
    const tokenId = ref('');
    const transferData = ref(null);
    const searched = ref(false);

    const search = async () => {
      transferData.value = null;
      searched.value = false;
      try {
        // const data = await getTransferData(contractAddress.value, tokenId.value);
        // transferData.value = data;
        transferData = [
          {
            from:'0x000',
            to:'',
            tokenId:'',
          }
        ]
      } catch (error) {
        console.error(error);
        searched.value = true;
      }
    };

    return {
      contractAddress,
      tokenId,
      transferData,
      searched,
      search,
    };
  },
};
</script>