<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs v-model:active="active" @click-tab="onClickTab">
            <van-tab name="" title="全部"/>
            <van-tab name="1" title="待支付"/>
            <van-tab name="2" title="待服务"/>
            <van-tab name="3" title="已完成"/>
            <van-tab name="4" title="已取消"/>
        </van-tabs>
        <van-row @click="goDetail(item)" v-for="item in order" :key="item.out_trade_no">
            <van-col span="5">
                <van-image :src="item.serviceImg" width="50" height="50"/>
            </van-col>
            <van-col span="14">
                <div class="text1">{{ item.service_name }}</div>
                <div class="text2">
                    <div>{{ item.hospital_name }}</div>
                    <div>预约时间：{{ item.starttime }}</div>
                </div>
            </van-col>
            <van-col span="5" class="text2" :style="{color:colorStatus[item.trade_state]}">
                {{ item.trade_state}}
                <counter :second="item.timer" v-if="item.trade_state === '待支付'"/>
            </van-col>
        </van-row>
    </div>
</template>
<script setup>
import { get } from "vant/lib/utils";
import { ref, getCurrentInstance, onMounted } from "vue";
import counter from "@/components/counter.vue";


onMounted(() => {
    getOrderList("")
})

const colorStatus = {
    "待支付": "#ffa200",
    "待服务": "#1da6fd",
    "已完成": "#21c521",
}

const { proxy } = getCurrentInstance()
const order = ref([])

const getOrderList = async (state) => {
    const { data } = await proxy.$api.orderList({ state })
    data.data.forEach(item => {
        item.timer = item.order_start_time + 7200000 - Date.now()
    });
    order.value = data.data
}

const onClickTab = (item) => {
    getOrderList(item.name)
};

// 跳转详情
const goDetail = (item) => {
    
}
const active = ref("")
</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
  .header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
  }
  .van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
  }
  .bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
  }

</style>
