<template>
  <q-toolbar class="text-primary">
    <q-toolbar-title>
      From: {{ format_time(range.start) }} - To: {{ format_time(range.end) }} / Updated on: {{ format_time(timestamp) }}
    </q-toolbar-title>
    <template>
      <div class="q-pa-md">
          <q-btn flat dense icon="calendar_today" />
          <q-popup-proxy v-model="showCalendar" ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="selected_day" :options="disabled_days" minimal/>
          </q-popup-proxy>

      </div>
    </template>
  </q-toolbar>

</template>
<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:filter:day:toolbar')

import moment from 'moment'
import { date } from 'quasar'

export default {

  name: 'LogsWebFilterDayToolbar',

  data () {
    return {
      id: 'logs.web.filter.day.toolbar',
      // path: 'all',
      //
      // current_day: undefined,
      // top: 15,
      //
      // /** calendar **/
      //
      selected_day: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      //
      // showCalendar: false,

      showCalendar: false,
      showDay: false,

      // day: {
      //   top_city_counter: {},
      //   top_country_counter: {},
      //
      //   per_domain: {},
      //   per_host: {},
      //   range: { start: 0, end: 0},
      //   timestamp: 0,
      //   city_counter: {},
      //   country_counter: {},
      //   continent_counter: {},
      //   // body_bytes_sent: {},
      //   // geoip: {},
      //   // qs: {},
      //   // referer: {},
      //   // pathname: {},
      //   // method: {},
      //   // remote_addr: {},
      //   // remote_user: {},
      //   // status: {},
      //   // unique_visitors: 0,
      //   // unique_visitors_by_ip: {},
      //   // user_agent: {},
      //   //
      //   // type_counter: {}
      // },
      //
      // store: false,
      // // pipeline_id: 'input.logs.web.filter',
      // pipeline_id: [
      //   'input.logs.web.filter.day',
      // ],

    }
  },

  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    range: {
      type: Object,
      default: function () {
        return {
          start: 0,
          end: 0
        }
      }
    }

  },
  watch: {
    selected_day () {
      debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
      this.$emit('selected_day', this.selected_day)
      // if (roundSeconds(moment(this.selected_day, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
      //   this.current_day = undefined
      // } else {
      //   this.current_day = (moment(this.selected_day, 'hh:mm').unix() * 1000) + MINUTE
      // }
      // // this.$nextTick(function () {
      // this.destroy_pipelines('input.logs.web.filter.day')
      // this.create_pipelines('input.logs.web.filter.day')
      // this.resume_pipelines('input.logs.web.filter.day')
      // // }.bind(this))
      //
      // // this.convertedDates = `${start} - ${end}`
      // // debug('startEndDates', this.end)
    }
    /** calendar **/
  },
  methods: {
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    /** calendar **/
    disabled_days: function (date) {
      return date <= moment().format('YYYY/MM/DD')
      // && date <= '2019/02/15'
    },
  }
}
</script>
