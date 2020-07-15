<template>
  <div>
    <q-toolbar class="text-primary">
    <!-- <q-btn flat round dense icon="menu" /> -->
    <q-toolbar-title>
      From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}
    </q-toolbar-title>
    <!-- <q-space class="text-primary"/> -->
    <template>
      <div class="q-pa-md">
        <!-- <q-btn name="calendar_roday" /> -->
          <!-- round -->
          <!-- <q-icon name="calendar_today" class="cursor-pointer q-ma-md"/> -->
          <!-- <q-input flat v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" :options="disabled_days" minimal/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input> -->
          <q-btn flat dense icon="calendar_today" />
          <q-popup-proxy v-model="showCalendar" ref="qDateProxy" transition-show="scale" transition-hide="scale">
              <q-date v-model="selected_day" :options="disabled_days" minimal/>
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

    <!-- <div class="text-h6">From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}</div> -->
    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'domain',
          valueX: 'hits',
          label: 'Day Per DOMAIN - CGI count',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'day_per_domain_sum'"
      :id="'day_per_domain_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_domain_sum'"
      :stat="{
        data: [
          day.top_per_domain
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
      :values="day.top_per_domain"
      :label="'Day Per DOMAIN - CGI count'"
      :id="'day_per_domain_sum'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_domain_sum'"
      /> -->
    <!-- :zoom="apply_zoom" -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'host',
          valueX: 'hits',
          label: 'Day Per HOST - CGI count',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'day_per_host_sum'"
      :id="'day_per_host_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_host_sum'"
      :stat="{
        data: [
          day.top_per_host
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
      :values="day.top_per_host"
      :label="'Day Per HOST - CGI count'"
      :id="'day_per_host_sum'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.day_per_host_sum'"
      /> -->
    <!-- :zoom="apply_zoom" -->
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:day')

import { date } from 'quasar'

// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'
// import chart from '@components/chart'

import JSPipeline from 'js-pipeline'

import DayPipeline from '@apps/logs/educativa/pipelines/filter/day'

import * as DaySources from '@apps/logs/educativa/sources/filter/day/index'

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

  name: 'LogsEducativaFilterDay',
  _logsEducativaFilterDay_components: {
    range: {
      source: {
        requests: DaySources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.educativa.filter.day',
      path: 'all',

      current_day: undefined,

      top: 15,

      /** calendar **/
      selected_day: date.formatDate(Date.now(), 'YYYY/MM/DD'),

      showCalendar: false,

      day: {
        top_per_domain: {},
        top_per_host: {},
        per_domain: {},
        per_host: {},
        range: { start: 0, end: 0},
        timestamp: 0,
      },

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.day'
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

    selected_day () {
      debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
      if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
        this.current_day = undefined
      } else {
        this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.day')
      this.create_pipelines('input.logs.educativa.filter.day')
      this.resume_pipelines('input.logs.educativa.filter.day')
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

    end_day: function () {
      if (this.current_day === undefined) {
        return Date.now()
      } else {
        return this.current_day
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

      const pipelines = [DayPipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsEducativaFilterDay_components, pipeline_id)
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

    disabled_days: function (date) {
      return date <= moment().format('YYYY/MM/DD')
      // && date <= '2019/02/15'
    },

  }

}
</script>
