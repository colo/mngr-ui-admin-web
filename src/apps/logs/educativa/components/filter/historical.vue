<template>
<q-card flat>
  <q-card-section>
    <component :is="'tool-bar-'+type" :range="range" :timestamp="timestamp" :type="type" @selected_time="selected_time"/>
  </q-card-section>

  <!-- <q-card-section>
    <info-bar :values="infoBarValues" :type="type"/>
  </q-card-section> -->

  <q-card-section>
   <!-- <div :style="{height: (height + 100) + 'px', 'margin-top': '25px'}"> -->
   <div :style="{height: height  + 'px'}">
     <grid-view
       v-if="grid.layouts && Object.getLength(components) > 0"
       :swap_components="true"
       :id="id+'MinuteGrid'"
       :components="components"
       :grid="grid"
       v-on:height="setHeight"
     />
   </div>
 </q-card-section>

 </q-card>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:educativa:components:filter:historical')

import { date } from 'quasar'

// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'
// import chart from '@components/chart'

import JSPipeline from 'js-pipeline'

import MinutePipeline from '@apps/logs/educativa/pipelines/filter/minute'
import HourPipeline from '@apps/logs/educativa/pipelines/filter/hour'
import DayPipeline from '@apps/logs/educativa/pipelines/filter/day'

import * as HistoricalSources from '@apps/logs/educativa/sources/filter/historical/index'

import moment from 'moment'

import { mapState } from 'vuex'

import CgiCount from '@apps/logs/educativa/components/cgiCount'
import DomainCgiCount from '@apps/logs/educativa/components/domainCgiCount'
import DomainTotalDuration from '@apps/logs/educativa/components/domainTotalDuration'
import HostTotalDuration from '@apps/logs/educativa/components/hostTotalDuration'
import HostCgiCount from '@apps/logs/educativa/components/hostCgiCount'

// import InfoBar from '@apps/logs/educativa/components/infoBar'

import ToolBarMinute from '@apps/logs/educativa/components/filter/minute/toolbar'
import ToolBarHour from '@apps/logs/educativa/components/filter/hour/toolbar'
import ToolBarDay from '@apps/logs/educativa/components/filter/day/toolbar'

import GridView from '@components/gridView'

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

  components: {
    chartTabular,
    GridView,
    CgiCount,
    DomainCgiCount,
    DomainTotalDuration,
    HostTotalDuration,
    HostCgiCount,
    // Toolbar
    // InfoBar,
    ToolBarMinute,
    ToolBarHour,
    ToolBarDay,
  },

  name: 'LogsEducativaFilterMinute',

  _logsEducativaFilterHistorical_components: {
    range: {
      source: {
        requests: HistoricalSources.requests
        // store: store
      }
    }
  },

  props: {
    type: {
      type: String,
      default: 'minute'
    }
  },
  data () {
    return {
      id: 'logs.educativa.filter.' + this.type,
      path: 'all',
      height: 0,

      infoBarValues: {},
      current_time: undefined,
      top: 15,

      // selected_minute: date.formatDate(Date.now(), 'HH:mm'),

      showCalendar: false,

      // showMinute: false,
      range: { start: Date.now(), end: Date.now() },
      timestamp: Date.now(),

      historical: {
      },

      // minute: {
      //   top_per_domain: {},
      //   top_per_host: {},
      //   per_domain: {},
      //   per_host: {},
      //   range: { start: 0, end: 0},
      //   timestamp: 0,
      //   cgi_count: {},
      //   top_cgi_count: {},
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

      store: false,
      pipeline_id: [
        'input.logs.educativa.filter.' + this.type,
      ],

      grid: {
        layouts: {
          'lg': [
            // { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },
            { x: 0, y: 0, w: 12, h: 36, i: 'domainCgiCount', immobile: false },
            // { x: 12, y: 1, w: 12, h: 36, i: 'domainCgiCountSum', immobile: false },
            { x: 12, y: 0, w: 12, h: 36, i: 'hostCgiCount', immobile: false },
            // { x: 12, y: 2, w: 12, h: 36, i: 'hostCgiCountSum', immobile: false },
            { x: 0, y: 36, w: 12, h: 36, i: 'domainTotalDuration', immobile: false },
            { x: 12, y: 36, w: 12, h: 36, i: 'hostTotalDuration', immobile: false },
            // { x: 12, y: 3, w: 12, h: 36, i: 'domainTotalDurationSum', immobile: false },
            { x: 0, y: 72, w: 12, h: 36, i: 'cgiCount', immobile: false },
            // { x: 12, y: 4, w: 12, h: 36, i: 'cgiCountSum', immobile: false },
            // { x: 0, y: 5, w: 24, h: 50, i: 'logs', immobile: false },
            // { x: 15, y: 0, w: 6, h: 10, i: 'mounts', immobile: false },
            // { x: 21, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            // // { x: 0, y: 1, w: 12, h: 2, i: 'separator' }
          ],
          'md': [
            // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            // { x: 4, y: 0, w: 4, h: 10, i: 'netOut', immobile: false },
            // { x: 8, y: 0, w: 4, h: 10, i: 'netIn', immobile: false },
            // { x: 12, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
            //
            // { x: 0, y: 1, w: 8, h: 15, i: 'cpu', immobile: false },
            // { x: 8, y: 1, w: 8, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'sm': [
            // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            // { x: 3, y: 0, w: 3, h: 10, i: 'netOut', immobile: false },
            // { x: 6, y: 0, w: 3, h: 10, i: 'netIn', immobile: false },
            // { x: 9, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            //
            // { x: 0, y: 1, w: 6, h: 15, i: 'cpu', immobile: false },
            // { x: 6, y: 1, w: 6, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xs': [
            // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
            // { x: 4, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
            // { x: 0, y: 1, w: 4, h: 10, i: 'netOut', immobile: false },
            // { x: 4, y: 1, w: 4, h: 10, i: 'netIn', immobile: false },
            // { x: 0, y: 2, w: 8, h: 15, i: 'cpu', immobile: false },
            // { x: 0, y: 3, w: 8, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ],
          'xxs': [
            // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
            // { x: 3, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
            // { x: 0, y: 1, w: 3, h: 10, i: 'netOut', immobile: false },
            // { x: 3, y: 1, w: 3, h: 10, i: 'netIn', immobile: false },
            // { x: 0, y: 2, w: 6, h: 15, i: 'cpu', immobile: false },
            // { x: 0, y: 3, w: 6, h: 10, i: 'mounts', immobile: false },
            //
            // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        // cols: 12,
        // // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        // colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },

        cols: 22,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 24, md: 16, sm: 12, xs: 8, xxs: 6 },

        isDraggable: true,
        isResizable: false,
        preview: true
      },

      components: {
        // 'toolbar': [
        //   {
        //     component: Toolbar,
        //     events: {
        //       selected_minute: 'selected_minute'
        //     }
        //   }
        // ],
        'domainCgiCount': [
          {
            component: DomainCgiCount,
            props: {
              type: this.type,
              valueX: 'hits'
            }
          }

        ],
        // 'domainCgiCountSum': [
        //   {
        //     component: DomainCgiCount,
        //     props: {
        //       type: 'minute',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'hostCgiCount': [
          {
            component: HostCgiCount,
            props: {
              type: this.type,
              valueX: 'hits'
            }
          }

        ],
        // 'hostCgiCountSum': [
        //   {
        //     component: HostCgiCount,
        //     props: {
        //       type: 'minute',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'domainTotalDuration': [
          {
            component: DomainTotalDuration,
            props: {
              type: this.type,
              valueX: 'duration'
            }
          }

        ],
        'hostTotalDuration': [
          {
            component: HostTotalDuration,
            props: {
              type: this.type,
              valueX: 'duration'
            }
          }

        ],
        // 'domainTotalDurationSum': [
        //   {
        //     component: DomainTotalDuration,
        //     props: {
        //       type: 'minute',
        //       sum: true
        //     }
        //   }
        //
        // ],
        'cgiCount': [
          {
            component: CgiCount,
            props: {
              type: this.type,
            }
          }

        ],
        // 'cgiCountSum': [
        //   {
        //     component: CgiCount,
        //     props: {
        //       type: 'minute',
        //       sum: true
        //     }
        //   }
        //
        // ],

        // 'logs': [
        //   {
        //     component: LogsTable,
        //
        //   }
        //
        // ],

      },
    }
  },

  watch: {
    dark: function () {
      Object.each(this.components, function (gridItem, name) {
        Array.each(this.components[name], function (component, index) {
          this.$set(this.components[name], index, Object.merge(this.components[name][index], {
            props: {
              dark: this.dark,
            }

          }))
        }.bind(this))
      }.bind(this))
    },
    colorScheme: function () {
      Object.each(this.components, function (gridItem, name) {
        Array.each(this.components[name], function (component, index) {
          this.$set(this.components[name], index, Object.merge(this.components[name][index], {
            props: {
              colorScheme: this.colorScheme,
            }

          }))
        }.bind(this))
      }.bind(this))
    },

    historical: {
      handler: function (historical) {
        debug('watch historical', historical)
        this.set_data(historical)
      },
      deep: true
    },

    // minute: {
    //   handler: function (minute) {
    //     if (minute && Object.getLength(minute) > 0) {
    //       debug('watch minute', minute)
    //       this.$set(this.components.toolbar[0].props, 'range', minute.range)
    //       this.$set(this.components.toolbar[0].props, 'timestamp', minute.timestamp)
    //
    //       this.$set(this.components.domainCgiCount[0].props, 'top_per_domain', minute.top_per_domain)
    //       // this.$set(this.components.domainCgiCountSum[0].props, 'top_per_domain', minute.top_per_domain)
    //
    //       this.$set(this.components.hostCgiCount[0].props, 'top_per_host', minute.top_per_host)
    //       // this.$set(this.components.hostCgiCountSum[0].props, 'top_per_host', minute.top_per_host)
    //
    //       this.$set(this.components.domainTotalDuration[0].props, 'top_per_domain', minute.top_per_domain)
    //       this.$set(this.components.hostTotalDuration[0].props, 'top_per_host', minute.top_per_host)
    //       // this.$set(this.components.domainTotalDurationSum[0].props, 'top_per_domain', minute.top_per_domain)
    //
    //       this.$set(this.components.cgiCount[0].props, 'top_cgi_count', minute.top_cgi_count)
    //
    //
    //     }
    //   },
    //   deep: true
    // }
  },
  computed: {
    ...mapState({
      dark: state => state.layout.dark,
      colorScheme: state => state.layout.dashboardColorScheme
    }),
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      debug('computed filter QUERY', this.$route.query)
      const allowed_filters = ['domain', 'path', 'host', /^metadata/, /^data/]
      let filter = {}
      if (this.$route && this.$route.query) {
        Object.each(this.$route.query, function (value, prop) {
          // if (allowed_filters.indexOf(prop) > -1 && filter === undefined) filter = {}
          if (allowed_filters.indexOf(prop) > -1 || allowed_filters.some(function (item) { return (item instanceof RegExp) ? item.test(prop) : false })) filter[prop] = value
        })
      }
      debug('computed filter', filter)
      return filter
    },
    'filterType': function () {
      debug('computed type', Object.keys(this.filter))
      return (this.filter && Object.getLength(this.filter) > 0) ? Object.keys(this.filter)[0] : undefined
    },
    // 'type': function () {
    //   debug('computed type', Object.keys(this.filter))
    //   return (this.filter && Object.getLength(this.filter) > 0) ? Object.keys(this.filter)[0] : undefined
    // },
    // 'filter': function () {
    //   // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    //   return (this.$route && this.$route.query)
    //     ? this.$route.query
    //     : undefined
    // },
    // 'type': function () {
    //   return (this.filter) ? Object.keys(this.filter)[0] : undefined
    // },
    'web': function () {
      return (this.filter && this.filterType) ? this.filter[this.filterType] : undefined
    }
  },

  // created: function () {
  //   debug('created')
  //   // this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
  // },

  mounted: function () {
    debug('mounted', this.$refs)
    this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))

    // this.$on('grid.' + this.id + ':destroy_pipelines', function () {
    //   debug('event')
    // })

    Object.each(this.components, function (gridItem, name) {
      Array.each(this.components[name], function (component, index) {
        this.$set(this.components[name], index, Object.merge(this.components[name][index], {
          id: this.id + '.' + this.type + '.' + name + '.component',
          props: {
            dark: this.dark,
            colorScheme: this.colorScheme,
          }
        }))
      }.bind(this))
    }.bind(this))
  },

  methods: {
    set_data: function (historical) {
      debug('set_data', historical)
      if (historical && Object.getLength(historical) > 0) {
        debug('watch historical', historical)
        this.range = historical.range
        this.timestamp = historical.timestamp

        this.infoBarValues = historical

        // this.$set(this.components.toolbar[0].props, 'range', historical.range)
        // this.$set(this.components.toolbar[0].props, 'timestamp', historical.timestamp)

        this.$set(this.components.domainCgiCount[0].props, 'top_per_domain', historical.top_per_domain)
        // this.$set(this.components.domainCgiCountSum[0].props, 'top_per_domain', historical.top_per_domain)

        this.$set(this.components.hostCgiCount[0].props, 'top_per_host', historical.top_per_host)
        // this.$set(this.components.hostCgiCountSum[0].props, 'top_per_host', historical.top_per_host)

        this.$set(this.components.domainTotalDuration[0].props, 'top_per_domain', historical.top_per_domain)
        this.$set(this.components.hostTotalDuration[0].props, 'top_per_host', historical.top_per_host)
        // this.$set(this.components.domainTotalDurationSum[0].props, 'top_per_domain', historical.top_per_domain)

        this.$set(this.components.cgiCount[0].props, 'top_cgi_count', historical.top_cgi_count)
      }
    },
    selected_time: function (selected_time) {
      debug('selected_time %s', new Date(moment(selected_time, 'hh:mm').unix() * 1000))

      if (this.type === 'minute') {
        if (roundSeconds(moment(selected_time, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
          this.current_time = undefined
        } else {
          this.current_time = (moment(selected_time, 'hh:mm').unix() * 1000) + MINUTE
        }
      } else if (this.type === 'hour') {
        if (roundMinutes(moment(selected_time, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
          this.current_time = undefined
        } else {
          this.current_time = (moment(selected_time, 'hh:mm').unix() * 1000) + HOUR
        }
      } else {
        if (roundHours(moment(selected_time, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
          this.current_time = undefined
        } else {
          this.current_time = (moment(selected_time, 'YYYY/MM/DD').unix() * 1000) + DAY
        }
      }

      // this.$nextTick(function () {
      this.destroy_pipelines('input.logs.educativa.filter.' + this.type)
      this.create_pipelines('input.logs.educativa.filter.' + this.type)
      this.resume_pipelines('input.logs.educativa.filter.' + this.type)
    },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 200 + 'px'
      this.height = height
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
    // selected_minute: function (selected_minute) {
    //   debug('selected_minute %s', new Date(moment(selected_minute, 'hh:mm').unix() * 1000))
    //   if (roundSeconds(moment(selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
    //     this.current_minute = undefined
    //   } else {
    //     this.current_minute = (moment(selected_minute, 'hh:mm').unix() * 1000) + MINUTE
    //   }
    //   // this.$nextTick(function () {
    //   this.destroy_pipelines('input.logs.educativa.filter.minute')
    //   this.create_pipelines('input.logs.educativa.filter.minute')
    //   this.resume_pipelines('input.logs.educativa.filter.minute')
    // },
    // setHeight: function (height) {
    //   debug('setHeight', height)
    //   // this.height = height + 200 + 'px'
    //   this.height = height
    // },

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
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // const pipelines = [HistoricalPipeline]
      // Array.each(pipelines, function (Pipeline) {
      const Pipeline = (this.type === 'minute') ? MinutePipeline : (this.type === 'hour') ? HourPipeline : DayPipeline
      let template = Object.clone(Pipeline)

      debug('create_pipelines template %o', template)

      let pipeline_id = template.input[0].poll.id
      if (!create_id || create_id === undefined || create_id === pipeline_id) {
        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
        Array.each(template.input[0].poll.conn, function (conn, index) {
          template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsEducativaFilterHistorical_components, pipeline_id)
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
      // }.bind(this))

      debug('create_pipelines %o', this.$options.pipelines)

      if (next) { next() }
      // }
    },

    /**
    * @end pipelines
    **/
    end: function () {
      if (this.current_time === undefined) {
        return Date.now()
      } else {
        return this.current_time
      }
    },
    round: function (timestamp) {
      if (this.type === 'minute') {
        return roundSeconds(timestamp)
      } else if (this.type === 'hour') {
        return roundMinutes(timestamp)
      } else {
        return roundHours(timestamp)
      }
    }
    /** calendar **/
    // disabled_hours: function (date) {
    //   return date <= moment().format('HH')
    //   // && date <= '2019/02/15'
    // },
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

  }

}
</script>
