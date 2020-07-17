<template>
  <!-- <q-page :key="$route.path +'.'+ JSON.stringify($route.query)+'.page'"> -->
  <q-page>
    <div class="q-pa-md">
      <div class="bg-primary text-white">
        <q-toolbar >
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" to="/"/>
            <q-breadcrumbs-el label="Logs" :to="{name : 'logs'}"/>
            <q-breadcrumbs-el label="Web" :to="{name : 'logs_web'}"/>
            <q-breadcrumbs-el label="Filter" v-if="type"/>
            <q-breadcrumbs-el :label="type +':'+ web" v-if="type && web" />
          </q-breadcrumbs>
        </q-toolbar>
        <q-toolbar>
          <!-- <q-btn flat round dense icon="assignment_ind"/> -->
          <!-- <q-toolbar-title>Quasar</q-toolbar-title> -->

          <q-btn flat class="q-mr-xs" label="Web" :to="{name : 'logs_web'}"/>
          <q-btn flat class="q-mr-xs" label="Educativa" :to="{name : 'logs_educativa'}"/>
          <!-- <q-btn flat round dense icon="gamepad"/> -->
        </q-toolbar>
      </div>

      <q-tabs
        v-model="range_tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="periodical" label="Now" />
        <q-tab name="minute" label="Minute" />
        <q-tab name="hour" label="Hourly" />
        <q-tab name="day" label="Daily" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="range_tab">
        <!-- animated -->
        <q-tab-panel name="periodical" :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'">
          <logs-web-filter-periodical/>
        </q-tab-panel>

        <q-tab-panel name="minute" :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'">
          <logs-web-filter-minute/>
        </q-tab-panel>

        <q-tab-panel name="hour" :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'">
          <logs-web-filter-hour/>
        </q-tab-panel>

        <q-tab-panel name="day" :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'">
          <logs-web-filter-day/>
        </q-tab-panel>
      </q-tab-panels>

    </div>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]" :duration="50">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

  </q-page>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:pages:filter')

// import { date } from 'quasar'

// let moment = require('moment')

// import OsPluginDygraph from '@apps/logs/components/pluginDygraph'
// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'

import LogsWebFilterPeriodical from '@apps/logs/web/components/filter/periodical'
import LogsWebFilterMinute from '@apps/logs/web/components/filter/minute'
import LogsWebFilterHour from '@apps/logs/web/components/filter/hour'
import LogsWebFilterDay from '@apps/logs/web/components/filter/day'

// import JSPipeline from 'js-pipeline'
//
// import PeriodicalPipeline from '@apps/logs/web/pipelines/filter/periodical'
// import MinutePipeline from '@apps/logs/web/pipelines/filter/minute'
// import HourPipeline from '@apps/logs/web/pipelines/filter/hour'
// import DayPipeline from '@apps/logs/web/pipelines/filter/day'
//
// import * as PeriodicalSources from '@apps/logs/web/sources/filter/periodical/index'
// import * as MinuteSources from '@apps/logs/web/sources/filter/minute/index'
// import * as HourSources from '@apps/logs/web/sources/filter/hour/index'
// import * as DaySources from '@apps/logs/web/sources/filter/day/index'

// import { requests, store } from '@apps/logs/web/sources/filter/index'

// const MAX_FEED_DATA = 10
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
  // mixins: [DataSourcesMixin],

  components: { LogsWebFilterPeriodical, LogsWebFilterMinute, LogsWebFilterHour, LogsWebFilterDay },

  name: 'LogsWebFilter',

  data () {
    return {
      id: 'logs.web.filter',
      path: 'all',

      range_tab: 'day',

      // current_day: undefined,
      // current_hour: undefined,
      // current_minute: undefined,
      // top: 15,

      /** calendar **/
      // selected_day: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      // selected_hour: date.formatDate(Date.now(), 'HH') + ':00',
      // selected_minute: date.formatDate(Date.now(), 'HH:mm'),
      // // selectedDate: '',
      // // convertedDates: '',
      // showCalendar: false,
      // showHour: false,
      // showMinute: false,

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
      // hour: {
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
      // periodical: {
      //   range: { start: 0, end: 0},
      //
      //   top_city_counter: {},
      //   top_country_counter: {},
      //
      //   logs: [],
      //
      //   total_bytes_sent: 0,
      //   hits: 0,
      //
      //   current_bytes_sent: 0,
      //
      //   status_counter: {},
      //
      //   city_counter: {},
      //   country_counter: {},
      //   continent_counter: {},
      //   world_map_cities: [],
      //
      //   addr_counter: {},
      //   user_counter: {},
      //   referer_counter: {},
      //   type_counter: {},
      //
      //   user_agent_os_counter: {},
      //   user_agent_os_family_counter: {},
      //   user_agent_engine_counter: {},
      //   user_agent_browser_counter: {},
      //   user_agent_device_counter: {}
      //
      // },

      // store: false,
      // // pipeline_id: 'input.logs.web.filter',
      // pipeline_id: [
      //   'input.logs.web.filter.periodical',
      //   'input.logs.web.filter.minute',
      //   'input.logs.web.filter.hour',
      //   'input.logs.web.filter.day'
      // ],
      //
      // // logs: [],
      //
      // search_filter: '',
      // loading_logs: true,
      // allColumns: ['date', 'log', 'domain', 'host', 'path'],
      // visibleColumns: ['log'],
      // pagination: {
      //   rowsPerPage: 10
      // },
      //
      // columns: [
      //   // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
      //   {
      //     name: 'date',
      //     required: true,
      //     label: 'Date',
      //     align: 'left',
      //     field: 'timestamp',
      //     sortable: true
      //   },
      //   {
      //     name: 'log',
      //     required: true,
      //     label: 'Log',
      //     align: 'left',
      //     field: 'log',
      //     sortable: true
      //   },
      //   {
      //     name: 'domain',
      //     required: true,
      //     label: 'Domain',
      //     align: 'left',
      //     field: 'domain',
      //     sortable: true
      //   },
      //   { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
      //   // {
      //   //   name: 'timestamp',
      //   //   align: 'left',
      //   //   label: 'Last Update',
      //   //   field: 'timestamp',
      //   //   sortable: true
      //   // },
      //   { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      // ],

      // components: {
      //   'input.logs.web.filter.periodical': {
      //     range: {
      //       source: {
      //         requests: PeriodicalSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.web.filter.minute': {
      //     range: {
      //       source: {
      //         requests: MinuteSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.web.filter.hour': {
      //     range: {
      //       source: {
      //         requests: HourSources.requests
      //         // store: store
      //       }
      //     }
      //   },
      //   'input.logs.web.filter.day': {
      //     range: {
      //       source: {
      //         requests: DaySources.requests
      //         // store: store
      //       }
      //     }
      //   }
      //
      // }
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
    }
  },
  // computed: {
  //   'web': function () {
  //     return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
  //   },
  //   'type': function () {
  //     return (this.$route && this.$route.params && this.$route.params.type) ? this.$route.params.type : undefined
  //   }
  // },
  watch: {
    /** calendar **/
    // selected_day () {
    //   debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
    //   if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
    //     this.current_day = undefined
    //   } else {
    //     this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.educativa.filter.day')
    //   this.create_pipelines('input.logs.educativa.filter.day')
    //   this.resume_pipelines('input.logs.educativa.filter.day')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // },
    // selected_hour () {
    //   debug('selected_hour %s', new Date(moment(this.selected_hour, 'hh:mm').unix() * 1000))
    //   if (roundMinutes(moment(this.selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
    //     this.current_hour = undefined
    //   } else {
    //     this.current_hour = (moment(this.selected_hour, 'hh:mm').unix() * 1000) + HOUR
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.web.filter.hour')
    //   this.create_pipelines('input.logs.web.filter.hour')
    //   this.resume_pipelines('input.logs.web.filter.hour')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // },
    // selected_minute () {
    //   debug('selected_minute %s', new Date(moment(this.selected_minute, 'hh:mm').unix() * 1000))
    //   if (roundSeconds(moment(this.selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
    //     this.current_minute = undefined
    //   } else {
    //     this.current_minute = (moment(this.selected_minute, 'hh:mm').unix() * 1000) + MINUTE
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.web.filter.minute')
    //   this.create_pipelines('input.logs.web.filter.minute')
    //   this.resume_pipelines('input.logs.web.filter.minute')
    //   // }.bind(this))
    //
    //   // this.convertedDates = `${start} - ${end}`
    //   // debug('startEndDates', this.end)
    // }
    /** calendar **/

  },
  methods: {
    // end: function () {
    //   // if (this.current_day === undefined) {
    //   return Date.now()
    //   // } else {
    //   // return this.current_day
    //   // }
    // },
    // end_minute: function () {
    //   if (this.current_minute === undefined) {
    //     return Date.now()
    //   } else {
    //     return this.current_minute
    //   }
    // },
    // end_hour: function () {
    //   if (this.current_hour === undefined) {
    //     return Date.now()
    //   } else {
    //     return this.current_hour
    //   }
    // },
    // end_day: function () {
    //   if (this.current_day === undefined) {
    //     return Date.now()
    //   } else {
    //     return this.current_day
    //   }
    // },
    // apply_zoom: function (data, categoryY, valueX) {
    //   const min_zoom = 0.5
    //   const max_zoom = 1
    //   /* const min_length = 8 */
    //   const max_length = 15
    //   let length = data.length
    //   /* let zoom = 1 */
    //
    //   if (data.length <= max_length) {
    //     return max_zoom
    //   } else {
    //     // let itemsWithNonZero = 0
    //     // for (let i = 0; i < max_length; i++) {
    //     //   if (data[i][valueX] > 0) {
    //     //     itemsWithNonZero++
    //     //   }
    //     // }
    //
    //     // let zoom = max_length / data.length
    //     // return (zoom > min_zoom) ? zoom : min_zoom
    //     return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
    //   }
    // },

    // format_time: function (timestamp) {
    //   return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    // },
    // format_log: function (log) {
    //   return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    // },
    /**
    * @start pipelines
    **/
    // create_pipelines: function (create_id, next) {
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   // if (
    //   //   this.$options.pipelines['input.logs.web.filter.periodical'] &&
    //   //   this.$options.pipelines['input.logs.web.filter.periodical'].get_input_by_id('input.logs.web.filter.periodical')
    //   // ) {
    //   //   // let requests = this.__components_sources_to_requests(this.components)
    //   //   // if (requests.once) {
    //   //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.system').conn_pollers[0].options.requests.once.combine(requests.once)
    //   //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
    //   //   // }
    //   //   //
    //   //   // if (requests.periodical) {
    //   //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.system').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
    //   //   //   this.$options.pipelines['input.logs.web.filter'].get_input_by_id('input.system').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
    //   //   // }
    //   // } else {
    //   const pipelines = [PeriodicalPipeline, MinutePipeline, HourPipeline, DayPipeline]
    //   Array.each(pipelines, function (Pipeline) {
    //     let template = Object.clone(Pipeline)
    //
    //     debug('create_pipelines template %o', template)
    //
    //     let pipeline_id = template.input[0].poll.id
    //     if (!create_id || create_id === undefined || create_id === pipeline_id) {
    //       // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
    //       Array.each(template.input[0].poll.conn, function (conn, index) {
    //         template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
    //       }.bind(this))
    //
    //       let pipe = new JSPipeline(template)
    //
    //       this.$options.__pipelines_cfg[pipeline_id] = {
    //         ids: [],
    //         connected: [],
    //         suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
    //       }
    //
    //       // this.__after_connect_inputs(
    //       //   pipe,
    //       //   this.$options.__pipelines_cfg[pipeline_id],
    //       //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
    //       //     debug('__resume_pipeline CALLBACK')
    //       //     pipe.fireEvent('onOnce')
    //       //   }], this)
    //       // )
    //
    //       this.$options.pipelines[pipeline_id] = pipe
    //     }
    //   }.bind(this))
    //
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   if (next) { next() }
    //   // }
    // },

    /**
    * @end pipelines
    **/

    /** calendar **/
    // disabled_minutes (hr, min, sec) {
    //   debug('disabled_minutes ', hr, min, sec)
    //   if (hr) {
    //     if (min !== null) {
    //       return min <= moment().format('mm')
    //     }
    //     return false
    //   }
    //
    //   // if (sec !== null && sec % 10 !== 0) {
    //   //   return false
    //   // }
    //   return true
    // },
    // disabled_hours (hr, min, sec) {
    //   debug('disabled_hours ', hr, min, sec)
    //   if (hr) {
    //     if (min) {
    //       return false
    //     }
    //     return hr <= moment().format('HH')
    //   }
    //
    //   // if (sec !== null && sec % 10 !== 0) {
    //   //   return false
    //   // }
    //   return true
    // },
    // disabled_days: function (date) {
    //   return date <= moment().format('YYYY/MM/DD')
    //   // && date <= '2019/02/15'
    // },

  }

}
</script>
