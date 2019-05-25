<template>
  <div v-click-outside>
    <input
      type="text"
      :value="formatDate"
      @focus="focus"
    >
    <div
      class="panel"
      v-show="isVisible"
    >
      <div class="panel-nav">
        <span @click="prevYear">&lt;&lt;</span>
        <span @click="prevMonth">&lt;</span>
        <span>{{time.year}}年</span>
        <span>{{time.month + 1}}月</span>
        <span @click="nextMonth">&gt;</span>
        <span @click="nextYear">&gt;&gt;</span>
      </div>
      <div class="panel-content">
        <div>
          <span
            class="cell"
            v-for="i in 7"
            :key="i"
          >
            {{weeks[i - 1]}}
          </span>
        </div>
        <div
          v-for="i in 6"
          :key="i"
        >
          <span
            v-for="j in 7"
            :key="j"
            @click="chooseDate(visibeDays[(i - 1) * 7 + (j - 1)])"
            :class="['cell', 'cell-days', {
              notCurrentmonth: !isCurrentMonth(visibeDays[(i - 1) * 7 + (j - 1)]),
              today: isToday(visibeDays[(i - 1) * 7 + (j - 1)]),
              select: isSelect(visibeDays[(i - 1) * 7 + (j - 1)])
              },
            ]"
          >
            {{visibeDays[(i - 1) * 7 + (j - 1)] | getDate}}
          </span>
        </div>

      </div>
      <div class="panel-footer" @click="jumpToday">
        今天
      </div>
    </div>
  </div>
</template>

<script>
import * as utils from '../util'
export default {
  // model: {
  //   event: 'cc'
  // },
  props: {
    value: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    let { year, month } = utils.getYearMonthDay(this.value)
    return {
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      time: { year, month },
      isVisible: false
    }
  },
  filters: {
    getDate(val) {
      return val.getDate()
    }
  },
  methods: {
    jumpToday() {
      this.time = utils.getYearMonthDay(new Date())
      this.$emit('input', new Date())
      this.blur()
    },
    prevYear() {
      let d = utils.getDate(this.time.year, this.time.month, 1)
      d.setFullYear(d.getFullYear() - 1)
      this.time = utils.getYearMonthDay(d)
    },
    nextYear() {
      let d = utils.getDate(this.time.year, this.time.month, 1)
      d.setFullYear(d.getFullYear() + 1)
      this.time = utils.getYearMonthDay(d)
    },
    prevMonth() {
      let d = utils.getDate(this.time.year, this.time.month, 1)
      d.setMonth(d.getMonth() - 1)
      this.time = utils.getYearMonthDay(d)
    },
    nextMonth() {
      let d = utils.getDate(this.time.year, this.time.month, 1)
      d.setMonth(d.getMonth() + 1)
      this.time = utils.getYearMonthDay(d)
    },
    focus() {
      this.isVisible = true
    },
    blur() {
      this.isVisible = false
    },
    isCurrentMonth(date) {
      let { year: y1, month: m1 } = utils.getYearMonthDay(
        utils.getDate(this.time.year, this.time.month, 1)
      )
      let { year: y2, month: m2 } = utils.getYearMonthDay(date)
      return y1 === y2 && m1 === m2
    },
    isToday(date) {
      let { year: y1, month: m1, day: d1 } = utils.getYearMonthDay(date)
      let { year: y2, month: m2, day: d2 } = utils.getYearMonthDay(new Date())
      return y1 === y2 && m1 === m2 && d1 === d2
    },
    chooseDate(date) {
      // this.$emit('update:value', date)
      // this.$emit('cc', date)
      let { year, month } = utils.getYearMonthDay(date)
      this.time = { year, month }
      this.$emit('input', date)
      this.blur()
    },
    isSelect(date) {
      let { year: y1, month: m1, day: d1 } = utils.getYearMonthDay(this.value)
      let { year: y2, month: m2, day: d2 } = utils.getYearMonthDay(date)
      return y1 === y2 && m1 === m2 && d1 === d2
    }
  },
  mounted() {
    // console.log(this.visibeDays)
  },
  computed: {
    visibeDays() {
      let { year, month } = utils.getYearMonthDay(
        utils.getDate(this.time.year, this.time.month, 1)
      )
      // 当前月份的1号是周几 前面就空出多少天

      // 获取当前月份的1号的日期
      let currentFirstDate = utils.getDate(year, month, 1)
      // 当前1号的周几
      let week = currentFirstDate.getDay()

      // 1天换算成毫秒数
      let day = 24 * 3600 * 1000
      // 算出起始时间
      let startDay = currentFirstDate - week * day

      // 日历中每月份要展示42天
      let arr = []
      for (let i = 0; i < 42; i++) {
        // 从起始日期开始一次加天数
        arr.push(new Date(startDay + i * day))
      }

      return arr
    },
    formatDate() {
      let { year, month, day } = utils.getYearMonthDay(this.value)
      return `${year}-${month + 1}-${day}`
    }
  },
  directives: {
    'click-outside': {
      bind(el, bingbinds, vnode) {
        const handler = e => {
          if (vnode.context.isVisible && !el.contains(e.target)) {
            vnode.context.blur()
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.panel
  width 32 * 7px
  position absolute
  background #ffffff
  box-shadow 0px 0px 10px pink
  padding 5px 10px
  margin-top 10px

  .panel-nav
    display flex
    justify-content space-around
    height 30px

    span
      cursor pointer
      user-select none

  .panel-content
    .cell
      display inline-flex
      box-sizing border-box
      justify-content center
      align-items center
      width 32px
      height 32px

      &.cell-days:hover
        border 1px solid pink

      &.select
        border 2px solid pink

      &.notCurrentmonth
        color #999

      &.today
        background red
        color #ffffff
        border-radius 4px

  .panel-footer
    height 30px
</style>
