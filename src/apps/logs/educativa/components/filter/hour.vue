<template>
  <div>
    <q-toolbar class="text-primary">
      <!-- <q-btn flat round dense icon="menu" /> -->
      <q-toolbar-title>
        From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}
      </q-toolbar-title>
      <!-- <q-space class="text-primary"/> -->
      <template>
        <div class="q-pa-md">

          <q-btn flat dense icon="access_time" />
          <q-popup-proxy v-model="showHour" ref="qHourProxy" transition-show="scale" transition-hide="scale">
              <q-time
                v-model="selected_hour"
                :options="disabled_hours"
                now-btn
                />
                <!-- format24h -->
              <!-- @input="() => $refs.qDateProxy.hide()"  -->
            <!-- <q-calendar
              ref="calendar"
              v-model="selectedDate"
              view="month"
              locale="en-us"
              mini-mode
              :selected-start-end-dates="startEndDates"
              :day-class="classDay"
              @mousedown:day="onMouseDownDay"
              @mouseup:day="onMouseUpDay"
              @mousemove:day="onMouseMoveDay"
              :disabled-after="disabled_after()"
            /> -->
          </q-popup-proxy>

        </div>
      </template>
    </q-toolbar>
    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'domain',
          valueX: 'hits',
          label: 'Hour Per DOMAIN - CGI count',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'hour_per_domain_sum'"
      :id="'hour_per_domain_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_domain_sum'"
      :stat="{
        data: [
          hour.top_per_domain
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'domain'"
      :valueX="'hits'"
      :values="hour.top_per_domain"
      :label="'Hour Per DOMAIN - CGI count'"
      :id="'hour_per_domain_sum'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_domain_sum'"
      /> -->
    <!-- :zoom="apply_zoom" -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'host',
          valueX: 'hits',
          label: 'Hour Per HOST - CGI count',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'hour_per_host_sum'"
      :id="'hour_per_host_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_host_sum'"
      :stat="{
        data: [
          hour.top_per_host
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'host'"
      :valueX="'hits'"
      :values="hour.top_per_host"
      :label="'Hour Per HOST - CGI count'"
      :id="'hour_per_host_sum'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour_per_host_sum'"
      /> -->
    <!-- :zoom="apply_zoom" -->
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:hour')

import { date } from 'quasar'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'
// import chart from '@components/chart'

import JSPipeline from 'js-pipeline'

import HourPipeline from '@apps/logs/educativa/pipelines/filter/hour'

import * as HourSources from '@apps/logs/educativa/sources/filter/hour/index'

import moment from 'moment'

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const roundSeconds = function (timestamp) {
  timestamp = roundMilliseconds(timestamp)
  let d = new Date(timestamp)
  d.setSeconds(0)

  return d.getTime()
}

const roundMinutes = function (timestamp) {
  timestamp = roundSeconds(timestamp)
  let d = new Date(timestamp)
  d.setMinutes(0)

  return d.getTime()
}
const roundHours = function (timestamp) {
  timestamp = roundMinutes(timestamp)
  let d = new Date(timestamp)
  d.setHours(0)

  return d.getTime()
}
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = HOUR * 24
const WEEK = DAY * 7

export default {
  mixins: [DataSourcesMixin],

  components: { chartTabular },

  name: 'LogsEducativaFilterHour',

  _logsEducativaFilterHour_components: {
    range: {
      source: {
        requests: HourSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.educativa.filter.hour',
      path: 'all',

      current_hour: undefined,

      top: 15,

      selected_hour: date.formatDate(Date.now(), 'HH') + ':00',

      showCalendar: false,
      showHour: false,

      hour: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
        // body_bytes_sent: {},
        // geoip: {},
        // qs: {},
        // referer: {},
        // pathname: {},
        // method: {},
        // remote_addr: {},
        // remote_user: {},
        // status: {},
        // unique_visitors: 0,
        // unique_visitors_by_ip: {},
        // user_agent: {},
        //
        // type_counter: {}
      },

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.hour',
      ],

    }
  },

  computed: {
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      return (this.$route && this.$route.query)
        ? this.$route.query
        : undefined
    },
    'type': function () {
      return (this.filter) ? Object.keys(this.filter)[0] : undefined
    },
    'web': function () {
      return (this.filter && this.type) ? this.filter[this.type] : undefined
    },

  },
  watch: {

    selected_hour () {
      debug('selected_hour %s', new Date(moment(this.selected_hour, 'hh:mm').unix() * 1000))
      if (roundMinutes(moment(this.selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
        this.current_hour = undefined
      } else {
        this.current_hour = (moment(this.selected_hour, 'hh:mm').unix() * 1000) + HOUR
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.hour')
      this.create_pipelines('input.logs.educativa.filter.hour')
      this.resume_pipelines('input.logs.educativa.filter.hour')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },

  },
  methods: {
    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
    },

    end_hour: function () {
      if (this.current_hour === undefined) {
        return Date.now()
      } else {
        return this.current_hour
      }
    },

    apply_zoom: function (data, categoryY, valueX) {
      const min_zoom = 0.5
      const max_zoom = 1
      /* const min_length = 8 */
      const max_length = 15
      let length = data.length
      /* let zoom = 1 */

      if (data.length <= max_length) {
        return max_zoom
      } else {
        // let itemsWithNonZero = 0
        // for (let i = 0; i < max_length; i++) {
        //   if (data[i][valueX] > 0) {
        //     itemsWithNonZero++
        //   }
        // }

        // let zoom = max_length / data.length
        // return (zoom > min_zoom) ? zoom : min_zoom
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'] &&
      //   this.$options.pipelines['input.logs.educativa.filter.periodical'].get_input_by_id('input.logs.educativa.filter.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.logs.educativa.filter'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [HourPipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsEducativaFilterHour_components, pipeline_id)
          }.bind(this))

          let pipe = new JSPipeline(template)

          this.$options.__pipelines_cfg[pipeline_id] = {
            ids: [],
            connected: [],
            suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
          }

          // this.__after_connect_inputs(
          //   pipe,
          //   this.$options.__pipelines_cfg[pipeline_id],
          //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
          //     debug('__resume_pipeline CALLBACK')
          //     pipe.fireEvent('onOnce')
          //   }], this)
          // )

          this.$options.pipelines[pipeline_id] = pipe
        }
      }.bind(this))

      debug('create_pipelines %o', this.$options.pipelines)

      if (next) { next() }
      // }
    },

    disabled_hours (hr, min, sec) {
      debug('disabled_hours ', hr, min, sec)
      if (hr) {
        if (min) {
          return false
        }
        return hr <= moment().format('HH')
      }

      // if (sec !== null && sec % 10 !== 0) {
      //   return false
      // }
      return true
    },

  }

}
</script>
