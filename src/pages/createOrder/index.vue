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
        </van-cell-group>

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
    </div>
    
</template>
<script setup>
import statusBar from '@/components/statusBar.vue'
import {onMounted,getCurrentInstance,reactive,ref,computed} from 'vue'
import { useRouter } from 'vue-router'

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

</script>

<style lang="less" scoped>
.container {
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
  </style>
