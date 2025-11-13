<template>
    <div class="container">
        <div class="header">
            <van-icon name="arrow-left" @click="goBack" class="header-left" size="30" />
            填写服务订单
        </div>
        <statusBar item="0" />
        <van-cell class="cell">
          <template #title>
            <van-image
              width="25"
              height="25"
              :src="createData.service.serviceImg"
            ></van-image>
            <span class="server-name">
              {{  createData.service.serviceName }}
            </span>
          </template>
          <template #default>
            <div>
              <van-icon name="warning-o" />
              服务内容
            </div>
          </template>
        </van-cell>
        <van-cell-group class="cell">
          <van-cell>
            <template #title>就诊医院</template>
            <template #default>
              <div @click="showHosptial = true">
                {{form.hospital_name || "请选择就诊医院"}}
                <van-icon name="arrow" />
              </div>
            </template>
          </van-cell>
          <van-cell>
            <template #title>就诊时间</template>
            <template #default>
              <div @click="showStartTime = true">
                {{ currentDate || "请选择就诊时间"}}
                <van-icon name="arrow" />
              </div>
            </template>
          </van-cell>
          <van-cell>
            <template #title>陪诊师</template>
            <template #default>
              <div @click="showCompanion = true">
                {{ compainionName || "请选择陪护师"}}
                <van-icon name="arrow" />
              </div>
            </template>
          </van-cell>
          <van-cell>
            <template #title>接送地址</template>
            <template #default>
              <van-field
                v-model="form.receiveAddress"
                class="text"
                input-align="right"
                placeholder="请输入接送地址"
              />  
            </template>
          </van-cell>
          <van-cell>
            <template #title>联系电话</template>
            <template #default>
              <van-field
                v-model="form.tel"
                class="text"
                input-align="right"
                placeholder="请输入联系电话"
              />  
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group title="服务需求" class="cell">
              <van-field
                v-model="form.demand"
                style="height:100px"
                class="text"
                placeholder="请简单描述您要就诊的科室"
              />  
        </van-cell-group>
        <van-button @click="submit" class="submit" type="primary" style="width: 100%;">提交订单</van-button>

        <van-popup
          v-model:show="showHosptial"
          position="bottom"
          :style="{ height: '30%' }"
        >
          <van-picker
            :columns="showHosptialColumns"
            @confirm="showHosptialConfirm"
            @cancel="showHosptial = false"
          />
      </van-popup>

      <van-popup
          v-model:show="showStartTime"
          position="bottom"
          :style="{ height: '30%' }"
        >
          <van-date-picker
            @confirm="showTimeConfirm"
            @cancel="showStartTime = false"
            title="选择日期"
            :min-date="minDate"
          />
      </van-popup>
      
      <van-popup
          v-model:show="showCompanion"
          position="bottom"
          :style="{ height: '30%' }"
        >
          <van-picker
            :columns="showCompanionColumns"
            @confirm="showCompanionConfirm"
            @cancel="showCompanion = false"
          />
      </van-popup>
      <!-- 支付二维码弹窗 -->
      <!-- <van-dialog :show-confirm-button="false" v-model:show="showCode">
        <van-icon name="cross" @click="closeCode" class="close"/>
        <div>微信支付</div>
        <van-image width="150" height="150" :src="codeImg"></van-image>
        <div>请使用本人账户进行支付</div>
      </van-dialog> -->

      <van-popup
        v-model:show="showCode"
        round
        closeable
        position="center"
        @click-close-icon="closeCode"
        :style="{ width: '80%', maxWidth: '300px' }"
      >
        <div class="custom-qr-popup">
          <div class="custom-qr-title" style="color: green;">微信支付</div>
          <van-image width="150" height="150" :src="codeImg" class="qr-image" />
          <div class="custom-qr-footer">请使用本人账户进行支付</div>
        </div>
      </van-popup>

    </div>

    
</template>
<script setup>
import statusBar from '@/components/statusBar.vue'
import {onMounted,getCurrentInstance,reactive,ref,computed} from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'
import Qrcode from 'qrcode'

const router = useRouter()
const { proxy } = getCurrentInstance()

const createData = reactive({
  companion:[],
  hospitals: [],
  service:{}
})

onMounted(async () => {
  const { data } = await proxy.$api.h5Companion()
  Object.assign(createData, data.data)
    // console.log(data)
})

const goBack = () => {
    router.go(-1)
}

const showHosptial = ref(false)
const showHosptialColumns = computed(() => {
  return createData.hospitals.map(item => {
    return {text:item.name,value:item.id}
  })
})

const form = reactive({})

const showHosptialConfirm = (item) => {
  form.hospital_id = item.selectedOptions[0].value
  form.hospital_name = item.selectedOptions[0].text
  showHosptial.value = false
}

const showStartTime = ref(false)
const currentDate = ref()
const minDate = ref(new Date())

const showTimeConfirm = (item) => {
  const dateStr = item.selectedValues.join('-')
  currentDate.value = dateStr
  form.starttime = new Date(dateStr).getTime()
  showStartTime.value = false
}

const showCompanion = ref(false)
const showCompanionColumns = computed(() => {
  return createData.companion.map(item => {
    return {text:item.name,value:item.id}
  })
})

const compainionName = ref()
const showCompanionConfirm = (item) => {
  form.companion_id = item.selectedOptions[0].value
  compainionName.value = item.selectedOptions[0].text
  showCompanion.value = false
}

const showCode = ref(false)
const codeImg = ref('')

const submit = async () => {
  const params = [
    'hospital_id',
    'hospital_name',
    'demand',
    'companion_id',
    'receiveAddress',
    'tel',
    'starttime'
  ]
  for (const i of params) {
    if (!form[i]) {
      showNotify({ type: 'warning', message: '请将信息填写完整' });
      return 
    }
  }
  const { data: resData } = await proxy.$api.createOrder(form)
  Qrcode.toDataURL(resData.data.wx_code).then((url) => {
    showCode.value = true
    codeImg.value = url
  })
    
}

const closeCode = () => {
  showCode.value = false
  router.push('/order')
}

</script>

<style lang="less" scoped>
.container {
  position: relative;
  background-color: #f0f0f0;
  height: 100vh;
}
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}

.cell {
  width: 95%;
  margin: 5px auto;
  background-color: #fff;
  ::v-deep(.van-field__control) {
    color: var(--van-cell-value-color);
  }
  ::v-deep(.van-cell__title) {
	display: flex;
	align-items: center;
  }
  .server-name {
	  margin-left: 10px;
  }
}
.submit{
  position:absolute ;
  bottom: 0;
}

/* 把这些样式添加到你的 <style lang="less" scoped> 块中
*/

.custom-qr-popup {
  padding: 15px;
  padding-top: 50px; /* 为顶部的关闭按钮留出空间 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}

.custom-qr-title {
  font-size: 20px;
  font-weight: bold; /* 使用 500 替代 600，更接近 Vant 风格 */
  color: #333;
}

.qr-image {
  margin: 16px 0; /* 上下留出间距 */
}

.custom-qr-footer {
  font-size: 18px;
  font-weight: bold;
  color: #666;
}

/* 使用 ::v-deep 调整 van-popup 默认的关闭按钮位置
  (从右上角移到左上角，以匹配你的目标图片)
*/
:deep(.van-popup__close-icon) {
  top: 16px;
  left: 16px;
  right: auto; /* 取消右侧定位 */
}

  </style>
