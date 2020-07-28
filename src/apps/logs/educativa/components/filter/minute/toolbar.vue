<template>
  <q-toolbar class="text-primary">
    <q-toolbar-title>
      From: {{ format_time(range.start) }} - To: {{ format_time(range.end) }} / Updated on: {{ format_time(timestamp) }}
    </q-toolbar-title>
    <template>
      <div class="q-pa-md">

        <q-btn flat dense icon="access_time" />
        <q-popup-proxy v-model="showMinute" ref="qMinuteProxy" transition-show="scale" transition-hide="scale">
            <q-time
              v-model="selected_minute"
              :options="disabled_minutes"
              now-btn
              />
        </q-popup-proxy>

      </div>
    </template>
  </q-toolbar>
</template>
<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:minute:toolbar')

import moment from 'moment'
import { date } from 'quasar'

export default {

  name: 'LogsEducativaFilterMinuteToolbar',

  data () {
    return {
      id: 'logs.educativa.filter.minute.toolbar',
      // path: 'all',
      //
      // current_minute: undefined,
      // top: 15,
      //
      // /** calendar **/
      //
      selected_minute: date.formatDate(Date.now(), 'HH:mm'),
      //
      // showCalendar: false,

      showMinute: false,

      // minute: {
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
      // // pipeline_id: 'input.logs.educativa.filter',
      // pipeline_id: [
      //   'input.logs.educativa.filter.minute',
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
    selected_minute () {
      debug('selected_minute %s', new Date(moment(this.selected_minute, 'hh:mm').unix() * 1000))
      this.$emit('selected_minute', this.selected_minute)
      // if (roundSeconds(moment(this.selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
      //   this.current_minute = undefined
      // } else {
      //   this.current_minute = (moment(this.selected_minute, 'hh:mm').unix() * 1000) + MINUTE
      // }
      // // this.$nextTick(function () {
      // this.destroy_pipelines('input.logs.educativa.filter.minute')
      // this.create_pipelines('input.logs.educativa.filter.minute')
      // this.resume_pipelines('input.logs.educativa.filter.minute')
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
    disabled_minutes (hr, min, sec) {
      debug('disabled_minutes ', hr, min, sec)
      if (hr) {
        if (min !== null) {
          return min <= moment().format('mm')
        }
        return false
      }

      // if (sec !== null && sec % 10 !== 0) {
      //   return false
      // }
      return true
    },
  }
}
</script>
