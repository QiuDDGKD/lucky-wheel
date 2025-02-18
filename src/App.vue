<template>
  <div class="main">
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
      <a-tab-pane v-for="wheel in wheels" :key="wheel.key">
        <template #tab>
          <div class="tab-title">
            <span v-if="!wheel.editing" @dblclick="editWheel(wheel)">{{ wheel.name }}</span>
            <a-input v-else v-model:value="wheel.name" @blur="saveWheel(wheel)" @keyup.enter="saveWheel(wheel)" />
            <a-icon @click="editWheel(wheel)" type="edit" />
          </div>
        </template>
        <MyWheel :wheel="wheel.key" :name="wheel.name"></MyWheel>
      </a-tab-pane>
    </a-tabs>
  </div> 
</template>

<script setup lang="ts">
import MyWheel from "@/components/MyWheel.vue"
import LocalStorageManager from "./common/local-storage-manager";
import type { IWheel } from "./common/types";
import { v4 as uuidv4 } from 'uuid'
import { ref, watch, type Ref } from "vue";

// 本地存储管理器
let mgr = new LocalStorageManager<IWheel[]>('wheels', [{
  key: uuidv4(),
  name: '默认转盘',
  editing: false
}])

// 转盘列表
const wheels: Ref<IWheel[]> = ref(mgr.load())
watch(wheels, () => mgr.save(wheels.value), { deep: true, immediate: true })
if (wheels.value.length === 0) {
  wheels.value.push({
    key: uuidv4(),
    name: '默认转盘',
    editing: false
  })
}

// 当前激活的转盘
const activeKey = ref(wheels.value[0].key)
const onEdit = (targetKey: string, action: string) => {
  if (action === 'add') {
    const key = uuidv4()
    wheels.value.push({
      key,
      name: '新转盘',
      editing: false
    })
    activeKey.value = key
  } else {
    const index = wheels.value.findIndex(wheel => wheel.key === targetKey)
    wheels.value.splice(index, 1)
    activeKey.value = wheels.value[0].key
  }
}

// 编辑转盘名称
const editWheel = (wheel: IWheel) => {
  console.log(wheel)
  wheel.editing = true
}

// 保存转盘名称
const saveWheel = (wheel: IWheel) => {
  wheel.editing = false
}

</script>

<style scoped>
/* 隐藏浏览器的滚动条 */
.main {
  height: 100vh;
  overflow-y: auto;
  -ms-overflow-style: none;  /* 适用于 IE 和 Edge */
  scrollbar-width: none;  /* 适用于 Firefox */
}
.main::-webkit-scrollbar {
  display: none;
}
</style>