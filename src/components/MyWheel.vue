<template lang="">
  <div class="my-wheel">
    <div class="wheel-container">
      <a-card title="转盘设置">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="转盘大小">
              <a-slider v-model:value="config.size" :min="300" :max="1000" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-input-number v-model:value="config.size" :min="300" :max="1000" />
          </a-col>
          <a-col :span="8">
            <a-form-item label="抽中后减少数量">
              <a-switch v-model:checked="config.reduce" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="指针只会停在正中间">
              <a-switch v-model:checked="config.onlyMiddle" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="转盘启停时长(毫秒)">
              <a-input-number v-model:value="config.rollDelay" :min="1000" :max="10000" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="自动停止">
              <a-switch v-model:checked="config.autoStop" />
            </a-form-item>
          </a-col>
          <a-col v-if="config.autoStop" :span="8">
            <a-form-item label="自动停止延迟(毫秒)">
              <a-input-number v-model:value="config.autoStopDelay" :min="1000" :max="10000" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="显示转盘名称">
              <a-switch v-model:checked="config.showWheelName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="显示奖品名称">
              <a-switch v-model:checked="config.showPrizeName" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="转盘">
        <div class="wheel-box">
          <a-tag v-if="config.showWheelName" color="geekblue" :style="{ fontSize: fontSize, lineHeight: 'normal' }">{{ name }}</a-tag>
          <span v-if="config.showPrizeName" :style="{ fontSize: fontSize }">{{ prizeName }}</span>
          <LuckyWheel
            v-if="showWheel"
            ref="myWheel"
            :default-config="defaultConfig"
            :width="size"
            :height="size"
            :prizes="prizes"
            :blocks="blocks"
            :buttons="buttons"
            @start="startCallback"
            @end="endCallback"
          />
          <div v-if="running" class="floating-element" @click="stopRoll"></div>
        </div>
      </a-card>
    </div>
    <a-card title="选项设置">
      <template #extra>
        <a-button type="primary" @click="addPrize">添加选项</a-button>
      </template>
      <div class="list-container">
        <a-list item-layout="horizontal" :data-source="config.prizes">
          <template #renderItem="{ item }">
            <a-list-item>
              <div class="list-item">
                <div><span>选项名称</span><a-input v-model:value="item.name"></a-input></div>
                <div><span>权重</span><a-input-number v-model:value="item.range"></a-input-number></div>
                <div><span>数量</span><a-input-number v-model:value="item.number"></a-input-number></div>
                <a-popconfirm
                  title="确定删除该选项吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="config.prizes.splice(config.prizes.indexOf(item), 1)"
                >
                  <a-button type="text" danger><CloseCircleOutlined /></a-button>
                </a-popconfirm>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { string } from 'vue-types'
import LocalStorageManager from '@/common/local-storage-manager'
import type { IWheelConfig } from '@/common/types'
import { computed, nextTick, ref, watch } from 'vue'
import { type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { CloseCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  wheel: string().isRequired, // 输入为转盘的 ID，用于存储转盘的配置
  name: string().isRequired, // 输入为转盘的名称
})

// 本地存储管理器
let mgr = new LocalStorageManager<IWheelConfig>(props.wheel, {
  size: 400,
  prizes: [
    {
      id: uuidv4(),
      name: '小垃圾1',
      range: 1,
      number: 1,
    },
  ],
  reduce: true,
  onlyMiddle: false,
  rollDelay: 3000,
  autoStop: true,
  autoStopDelay: 3000,
})

// 读取配置
const config: Ref<IWheelConfig> = ref(mgr.load())
// 监听配置变化并保存
watch(
  config,
  () => {
    for (let item of config.value.prizes) {
      if (item.number > 0) {
        item.hide = false
      }
    }
    mgr.save(config.value)
  },
  { deep: true, immediate: true }
)

// 转盘重载方法, 转盘组件有些属性不是动态绑定的，需要重载
const showWheel = ref(true)
const reloadWheel = () => {
  showWheel.value = false
  nextTick(() => {
    showWheel.value = true
  })
}

// 转盘大小
const size = computed(() => `${config.value.size}px`)
const fontSize = computed(() => `${config.value.size / 20}px`)
watch(size, reloadWheel)

// 转盘组件默认配置
const defaultConfig = computed(() => {
  return {
    stopRange: config.value.onlyMiddle ? 0 : 0.8,
    accelerationTime: config.value.rollDelay ? config.value.rollDelay : 3000,
    decelerationTime: config.value.rollDelay ? config.value.rollDelay : 3000,
  }
})
watch(defaultConfig, reloadWheel)

// 转盘组件的 blocks, prizes, buttons 属性
const blocks = computed(() => {
  return [{ padding: `${config.value.size / 60}`, background: '#858fff' }]
})
const prizes = computed(() => {
  const colors = ['#c1c2f9', '#a1a4f3', '#8c8de6']
  const colors2 = ['#c1c2f9', '#a1a4f3']
  let result: any[] = []
  let i = 0
  for (let item of config.value.prizes) {
    if (item.hide) {
      continue
    }

    result.push({
      id: item.id,
      range: item.range,
      fonts: [{ text: item.name, top: '10%' }],
      background: '',
    })

    i++
  }

  result.forEach((item, i) => {
    let step = i % 2
    let index = 0,
      color = ''
    if (result.length % 2 === 0) {
      index = step
      color = colors2[index]
    } else {
      index = i % 3
      if (i + 1 === result.length && index === 0) {
        index = 1
      }
      color = colors[index]
    }

    item.background = color
  })

  return result
})
const buttons = computed(() => {
  return [
    {
      radius: '27%',
      background: '#fff4b7',
      pointer: true,
      imgs: [
        {
          src: '/resources/roll.png',
          width: `${config.value.size / 5}px`,
          height: `${config.value.size / 5}px`,
          top: `-${config.value.size / 10 + 5}px`,
        },
      ],
    },
  ]
})

// 组件实例引用
const myWheel = ref()

// 添加选项
const addPrize = () => {
  config.value.prizes.unshift({
    id: uuidv4(),
    name: '小垃圾',
    range: 1,
    number: 1,
  })
}

// 转盘运行状态
let running = ref(false)
let stopped = ref(true)
let rollingPrizeIdx = ref(0)
setInterval(() => {
  if (!stopped.value) {
    rollingPrizeIdx.value++
    if (rollingPrizeIdx.value >= prizes.value.length) {
      rollingPrizeIdx.value = 0
    }
  }
}, 50)
let rolledPrizeName = ref('***')
const prizeName = computed(() => {
  let res = ''
  if (stopped.value) {
    res = rolledPrizeName.value
  } else {
    res = prizes.value[rollingPrizeIdx.value]?.fonts[0].text
  }
  return res
})

// 转盘启动函数
const startRoll = () => {
  // 检查是否已经数量低于 0 的选项, 如果有则隐藏
  for (let item of config.value.prizes) {
    if (item.number < 1) {
      item.hide = true
    }
  }

  // 调用抽奖组件的 play 方法开始游戏
  nextTick(() => {
    myWheel.value.play()
    running.value = true
    stopped.value = false
    if (config.value.autoStop) {
      setTimeout(
        () => {
          stopRoll()
        },
        config.value.autoStopDelay ? config.value.autoStopDelay : 3000
      )
    }
  })
}

// 转盘停止函数
const stopRoll = () => {
  if (!running.value) {
    return
  }

  myWheel.value.stop()
  running.value = false
}

// 点击抽奖按钮回调, 只有在转盘未运行时才能触发
function startCallback() {
  if (running.value) {
    stopRoll()
    return
  }

  startRoll()
}

// 抽奖结束回调, 传入中奖选项
let endCallback = function (prize: any) {
  let p = config.value.prizes.filter((item) => item.id === prize.id)[0]
  if (config.value.reduce) {
    p.number--
  }
  rolledPrizeName.value = p.name
  stopped.value = true
}
</script>

<style scoped>
.my-wheel {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 50px;
  height: 100%;
  width: 100%;
}

.wheel-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;
  width: 60%;
  height: 100%;
}

.wheel-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px;
}

.floating-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
}

.list-container {
  max-height: 80vh; /* 根据需要调整高度 */
  overflow-y: auto;
}

/* 自定义滚动条样式 */
.list-container::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.list-container::-webkit-scrollbar-track {
  background: #c1c2f9; /* 滚动条背景颜色 */
  border-radius: 10px; /* 圆角 */
}

.list-container::-webkit-scrollbar-thumb {
  background: #a1a4f3; /* 滚动条滑块颜色 */
  border-radius: 10px; /* 圆角 */
}

.list-container::-webkit-scrollbar-thumb:hover {
  background: #8c8de6; /* 滑块悬停颜色 */
}

.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
span {
  display: flex;
  white-space: nowrap;
}
</style>