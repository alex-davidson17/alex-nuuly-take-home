<script setup lang="ts">
import type { PropType } from 'vue'
import UIButton from './UIButton.vue'

const props = defineProps({
  data: {
    type: Array as PropType<Record<string, any>[]>,
    required: true,
  },
  keyMap: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  page: Number,
  tableSize: Number,
})
const emits = defineEmits(['updatePage', 'sortData', 'updateTableSize'])
</script>

<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="heading in Object.keys(keyMap)" :key="heading" @click="$emit('sortData', keyMap[heading])">
            {{ heading }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.name">
          <td v-for="field in Object.values(keyMap)" :key="field">
            {{ row[`${field}`] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="btn-container">
      <div>
        <span>Rows per page: </span>
        <select :value="tableSize" @input="(e) => $emit('updateTableSize', Number(e.target?.value))">
          <option :value="10">
            10
          </option>
          <option :value="25">
            25
          </option>
          <option :value="50">
            50
          </option>
        </select>
      </div>
      <span> Page: {{ page }}</span>
      <div v-if="page" class="dir-container">
        <UIButton :disabled="page <= 1" @click="$emit('updatePage', -1)">
          Previous
        </UIButton>
        <UIButton @click="$emit('updatePage', 1)">
          Next
        </UIButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  padding: 10px 0;
  border-collapse: separate;
  border-collapse: collapse;
  backdrop-filter: blur(16px) saturate(100%);
  -webkit-backdrop-filter: blur(16px) saturate(100%);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(209, 213, 219, 0.3);
}
:is(td, th) {
  border: 1px solid rgba(209, 213, 219, 0.3);
  padding: 0.5ch 1ch;
}
thead tr th {
  cursor: pointer;
}
.table-container {
  width: 1000px;
}
.table-container table {
  width: 100%;
}
.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dir-container button {
  margin: 0 20px;
}
@media only screen and (max-width: 992px) {
  .table-container {
  width: 600px;
}
}
@media only screen and (max-width: 600px) {
  .table-container {
  width: 400px;
}
}
</style>
