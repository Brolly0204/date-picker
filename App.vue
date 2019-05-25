<template>
  <div id="app">
    <!-- <DatePicker :value.sync="now"></DatePicker> -->
    <DatePicker v-model="now"></DatePicker>
  </div>
</template>

<script>
import DatePicker from './components/date-picker'
export default {
  components: {
    DatePicker
  },
  data() {
    return {
      now: new Date()
    }
  }
}
</script>
