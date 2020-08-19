<template>
  <!-- :class="(show === false) ? 'bg-white hidden': 'bg-white uk-light'" -->
  <q-card>
    <q-card-section>
      <div class="text-h4">{{title}}</div>
    </q-card-section>

    <q-card-section>
      <p>{{info}}</p>
      <p v-if="show_minute">
        <q-checkbox v-model="view.minute" label="Minute" />
        <!-- :disable="!data.minute"  -->
        <!-- <span class="circle bg-warning text-white"><i class="fa fa-hashtag" /></span> &nbsp; -->
        <!-- {{count}} -->
      </p>

      <!--
      DON'T REMOVE -> :key="view.minute"
      needed so component is recreated on key change, so a new Dygraph chart is created with new labels / columns
      -->
      <div class="netdata-chartblock-container">
        <component
          v-if="chart"
          :is="tabular === false ? 'chart' : 'chart-tabular'"
          :wrapper="{
            type: 'dygraph',
            props: {
              /* smoothness: true, */
              colorScheme: $store.state.layout.dashboardColorScheme,
              dark: $store.state.layout.dark
            }
          }"
          :always_update="false"
          :ref="id"
          :id="id"
          :key="view.minute"
          :EventBus="eventbus"
          :stat="stat"
          :chart="chart"
          :reactive="false"
          :no_buffer="false"
        >
        <!-- data: [processed_data] -->
        <!-- stat -> length: 300, -->
        <!-- :key="view.minute" -->
        <!-- :always_update="true" re check this, what was used for?-->
        </component>
        <q-placeholder
          v-if="show === false"
          animated
          class="netdata-container-with-legend"
        />
      </div>
    </q-card-section>
    <!-- <q-separator dark /> -->
  </q-card>
</template>

<script>
// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:components:pluginDygraph')

import { EventBus } from '@libs/eventbus'

// import chart from '@components/chart'
import chartTabular from '@components/chart.tabular'

import dygraph_line_chart from 'mngr-ui-admin-charts/defaults/dygraph.line'
import dygraph_derived from 'mngr-ui-admin-charts/defaults/dygraph.derived.tabular'
import dygraph_uptime from 'mngr-ui-admin-charts/os/uptime'
import dygraph_loadavg from 'mngr-ui-admin-charts/os/loadavg'
import dygraph_memory from 'mngr-ui-admin-charts/os/memory.tabular'
import dygraph_cpus from 'mngr-ui-admin-charts/os/cpus.tabular'
import dygraph_mounts_used from 'mngr-ui-admin-charts/os/mounts.used'
import dygraph_mounts_blocks from 'mngr-ui-admin-charts/os/mounts.blocks.tabular'
import dygraph_networkInterfaces_bytes from 'mngr-ui-admin-charts/os/networkInterfaces.bytes'
import dygraph_networkInterfaces_packets from 'mngr-ui-admin-charts/os/networkInterfaces.packets'
import dygraph_blockdevices_time from 'mngr-ui-admin-charts/os/blockdevices.time'
import dygraph_blockdevices_sectors from 'mngr-ui-admin-charts/os/blockdevices.sectors'
import dygraph_blockdevices_requests from 'mngr-ui-admin-charts/os/blockdevices.requests'
import dygraph_rethinkdb from 'mngr-ui-admin-charts/os/rethinkdb'

import Dygraph from 'dygraphs'

// // import AdminLteMixin from '@mixins/adminlte'
// import DataSourcesMixin from '@mixins/dataSources'
//
// import GridView from '@components/gridView'
//
// // import Test from '@components/test/test.vue'
//
// import Pipeline from 'js-pipeline'
// import Pipeline from '../pipelines/index'
//

// let moment = require('moment')

// import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
// import StatsCard from '@apps/system/components/creativetim/argon/StatsCard'

import DataSourcesMixin from '@mixins/dataSources'

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/system/pipelines/index'

// const MAX_FEED_DATA = 10

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

export default {
  // mixins: [DataSourcesMixin],

  name: 'SystemPluginDygraph',
  // components: { GridView, Widget, StatsCard },
  components: { chartTabular },

  // pipelines: {},
  dygraph_chart: {},

  props: {
    id: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    },
    tabular: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: function () { return {} }
    },
    stat: {
      type: Object,
      default: function () {
        return {
          data: [],
          length: 360
        }
      }

    },
    interval: {
      type: Number,
      default: 0
    },
    dygraph: {
      type: Object,
      default: function () { return {} }
    }
    // config: {
    //   type: Object,
    //   default: function () { return undefined }
    // }
  },

  __config_set: false,
  __labels_set: false,

  plugin_data: {},

  data () {
    return {
      // id: 'all',
      path: 'all',

      no_buffer: false,

      view: {
        minute: false
      },
      processed_data: [],
      show: false,
      show_minute: false,

      eventbus: EventBus,
      chart: undefined,
      config: undefined,
      // stat: {
      //   data: [],
      //   length: 360
      // }
      // Object.merge(Object.clone(this.$options.dygraph_chart), {
      //   interval: 1,
      //   options: {
      //     digitsAfterDecimal: 16,
      //     strokeWidth: 1.5,
      //     pixelRatio: null,
      //     strokeBorderWidth: 0.0,
      //     gridLineWidth: 0.1
      //     // axes: {
      //     //   x: {
      //     //     ticker: Dygraph.dateTicker
      //     //   }
      //     // }
      //   }
      // })

    }
  },
  created: function () {
    if (!this.$options.plugin_data[this.id]) { this.$options.plugin_data[this.id] = {} }

    debug('lifecycle created', this.id)
    let id = this.id

    id = id.replace('.periodical', '')
    id = id.replace('.minute', '')
    id = id.replace('.hour', '')
    id = id.replace('.day', '')

    if (/cpus/.test(id)) {
      id = 'os.cpus'
    } else if (/os\.blockdevices\..*\.time/.test(id)) {
      id = 'os.blockdevices.time'
    } else if (/os\.blockdevices\..*\.sectors/.test(id)) {
      id = 'os.blockdevices.sectors'
    } else if (/os\.blockdevices\..*\.requests/.test(id)) {
      id = 'os.blockdevices.requests'
    } else if (/os\.mounts\..*\.blocks$/.test(id)) {
      id = 'os.mounts.blocks'
    } else if (/networkInterfaces.*\.bytes/.test(id)) {
      id = 'os.networkInterfaces.bytes'
    } else if (/networkInterfaces.*\.packets/.test(id)) {
      id = 'os.networkInterfaces.packets'
    } else if (/os\.rethinkdb\.server\.clients/.test(id)) {
      id = 'os.rethinkdb.server.clients'
    } else if (/os\.rethinkdb/.test(id)) {
      id = 'os.rethinkdb'
    }
    // else {
    //   id = this.id
    // }

    id = id.replace(/(.*\.)(os\..*)/, '$2') // remove anything pre 'os.'

    switch (id) {
      case 'os.loadavg':
        this.$options.dygraph_chart[this.id] = dygraph_loadavg
        break

      case 'os.uptime':
        this.$options.dygraph_chart[this.id] = dygraph_uptime
        break

      case 'os.memory':
        this.$options.dygraph_chart[this.id] = dygraph_memory
        break

      case 'os.cpus':
        this.$options.dygraph_chart[this.id] = dygraph_cpus
        break

      case 'os.blockdevices.time':
        this.$options.dygraph_chart[this.id] = dygraph_blockdevices_time
        break

      case 'os.blockdevices.sectors':
        this.$options.dygraph_chart[this.id] = dygraph_blockdevices_sectors
        break

      case 'os.blockdevices.requests':
        this.$options.dygraph_chart[this.id] = dygraph_blockdevices_requests
        break

      case 'os.networkInterfaces.bytes':
        this.$options.dygraph_chart[this.id] = dygraph_networkInterfaces_bytes
        break

      case 'os.networkInterfaces.packets':
        this.$options.dygraph_chart[this.id] = dygraph_networkInterfaces_packets
        break

      case 'os.mounts.used':
        this.$options.dygraph_chart[this.id] = dygraph_mounts_used
        break

      case 'os.mounts.blocks':
        this.$options.dygraph_chart[this.id] = dygraph_mounts_blocks
        break

      case 'os.rethinkdb.server.clients':
        this.$options.dygraph_chart[this.id] = dygraph_line_chart
        this.$options.dygraph_chart[this.id].options.logscale = 'y'
        this.$options.dygraph_chart[this.id].options.axes.y.logscale = true
        break

      case 'os.rethinkdb':
        this.$options.dygraph_chart[this.id] = dygraph_rethinkdb
        break

      default:
        this.$options.dygraph_chart[this.id] = dygraph_line_chart
    }

    // Object.each(this.dygraph, function (value, prop) {
    //   this.$options.dygraph_chart[this.id][prop] = value
    // }.bind(this))
    if (Object.getLength(this.dygraph) > 0) {
      this.$options.dygraph_chart[this.id] = Object.merge(this.$options.dygraph_chart[this.id], this.dygraph)
    }

    if (!this.$options.dygraph_chart[this.id].interval || isNaN(this.$options.dygraph_chart[this.id].interval)) { this.$options.dygraph_chart[this.id].interval = 1 }
    let interval = (this.interval === 0) ? this.$options.dygraph_chart[this.id].interval : this.interval
    // this.$options.dygraph_chart[this.id].interval = (interval > 0) ? interval : this.$options.dygraph_chart[this.id].interval

    // this.$options.dygraph_chart[this.id].interval = interval
    debug('ID %s', this.id, id, this.stat.length, interval, this.$options.dygraph_chart[this.id])

    this.$set(this.stat, 'length', this.stat.length / interval)

    if (this.$options.dygraph_chart[this.id].options && this.$options.dygraph_chart[this.id].options.labels && this.$options.dygraph_chart[this.id].options.labels.length > 1) {
      this.$options.__labels_set = true
    }

    this.chart = Object.clone(this.$options.dygraph_chart[this.id])
    this.config = this.chart.config

    // this.chart = Object.merge(Object.clone(this.$options.dygraph_chart[this.id]), {
    //   // interval: 1,
    //   options: {
    //     digitsAfterDecimal: 16,
    //     strokeWidth: 1.5,
    //     pixelRatio: null,
    //     strokeBorderWidth: 0.0,
    //     gridLineWidth: 0.1
    //     // axes: {
    //     //   x: {
    //     //     ticker: Dygraph.dateTicker
    //     //   }
    //     // }
    //   }
    // })
  },
  destroyed: function () {
    debug('life cyle destroyed', this.id)
    delete this.$options.dygraph_chart[this.id]
    delete this.$options.plugin_data[this.id]
    this.$options.__config_set = false
    this.$options.__labels_set = false
  },
  watch: {
    'view.minute': function (val) {
      debug('VIEW MINUTE %o', val, this.id)
      // let options = JSON.parse(JSON.stringify(this.chart.options))
      // let data = JSON.parse(JSON.stringify(this.data))

      // this.$refs[this.id].visibilityChanged(false)
      // this.no_buffer = true
      this.$options.__config_set = false

      this.chart = Object.merge(Object.clone(this.$options.dygraph_chart[this.id]), {
        interval: 1,
        options: {
          strokeWidth: 1.5,
          pixelRatio: null,
          strokeBorderWidth: 0.0,
          gridLineWidth: 0.1
          // axes: {
          //   x: {
          //     ticker: Dygraph.dateTicker
          //   }
          // }
        }
      })
      this.__process_data(this.$options.plugin_data[this.id])

      // this.$refs[this.id].visibilityChanged(true)
      // this.processed_data = data
      // this.chart.options = options
    }
    // 'data.periodical': {
    //   handler: function (val) {
    //     // this.__process_data(val)
    //     let data = JSON.parse(JSON.stringify(this.data))
    //     this.__process_data(data)
    //   }
    //   // deep: true
    // }
    // 'data': {
    //   handler: function (val) {
    //     this.__process_data(val)
    //   },
    //   deep: true
    // }
  },

  methods: {
    // update: function (val) {
    //   debug('update method', this.id)
    // },
    set_data: function (data) {
      // debug('set_data', this.id, data.periodical)
      // this.$options.plugin_data = Object.merge(data, this.$options.plugin_data)
      if (data.periodical) {
        this.$options.plugin_data[this.id].periodical = data.periodical
      }
      if (data.minute) {
        this.$options.plugin_data[this.id].minute = data.minute
      }

      // debug('set_data', this.id, this.$options.plugin_data[this.id].periodical)

      // if (this.$options.plugin_data[this.id].periodical) {
      //   // let splice = 120 // 12 points per min * 10 min
      //   // let length
      //
      //   Object.each(this.$options.plugin_data[this.id].periodical, function (periodical, key) {
      //     let interval = (this.interval === 0) ? this.$options.dygraph_chart[this.id].interval : this.interval
      //     debug('set_data slice', this.id, this.stat.length, interval)//, this.stat.length * interval
      //     this.$options.plugin_data[this.id].periodical[key] = this.$options.plugin_data[this.id].periodical[key].slice(0, this.stat.length)// * interval
      //
      //   }.bind(this))
      // }

      if (this.$options.plugin_data[this.id].minute) {
        // debug('this.$options.plugin_data[this.id].minute %o', this.$options.plugin_data[this.id].minute)
        // let splice = 10 // 1 points per min * 10 min
        // let length

        Object.each(this.$options.plugin_data[this.id].minute, function (minute, key) {
          // length = minute.length
          this.$options.plugin_data[this.id].minute[key] = this.$options.plugin_data[this.id].minute[key].slice(0, 7)
          // this.$options.plugin_data[this.id].minute[key].splice(
          //   (splice * -1) + 1,
          //   length - splice
          // )
          // // this.$options.plugin_data[this.id].minute[key].splice(0, this.$options.plugin_data[this.id].minute[key].length - splice)
        }.bind(this))
      }

      // debug('----set_data', this.id, this.$options.plugin_data[this.id].periodical)

      if (data.periodical) { // only update graph on periodical data
        this.__process_data(this.$options.plugin_data[this.id])
      }
    },
    __process_data: function (val) {
      // if (this.config && Object.getLength(this.config) > 0) {
      val = JSON.parse(JSON.stringify(val))

      if (val.periodical && Object.getLength(val.periodical) > 0) {
        // debug('data watch %s %o', this.id, JSON.parse(JSON.stringify(this.config)), JSON.parse(JSON.stringify(val.periodical)))

        let periodical = val.periodical
        let minute = val.minute

        if (minute && Object.getLength(minute) > 0) {
          this.show_minute = true
        }

        // debug('data watch show_minute %s %o', this.id, this.show_minute)

        if (this.$options.__config_set === false && this.$options.__labels_set === false) { this.$set(this.chart.options, 'labels', ['Time']) }
        // this.$set(this.chart.options, 'sigFigs', 6)

        // if (this.view.minute === false && this.config.graph && this.config.graph.args && this.$options.__config_set === false) {
        //   let args = this.config.graph.args.split(' ')
        //   Array.each(args, function (arg, index) {
        //     if (arg === '--logarithmic' || arg === '-o') {
        //       this.$set(this.chart.options, 'logscale', 'y')
        //       this.$set(this.chart.options.axes.y, 'logscale', true)
        //     } else if (arg === '--lower-limit' || arg === '-l') {
        //       if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
        //       this.$set(this.chart.options.valueRange, 0, args[index + 1] * 1)
        //     } else if (arg === '--upper-limit' || arg === '-u') {
        //       if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
        //       this.$set(this.chart.options.valueRange, 1, args[index + 1] * 1)
        //     }
        //   }.bind(this))
        // }

        // debug('valueRange %o', this.id, this.chart.options.valueRange)

        let processed_data = []
        let negative_key = []
        let cdefs = []

        /**
          * used to set valueRange for logscale
          **/
        let processed_data_min_value = 0.1
        let processed_data_max_value = 1

        let periodical_index = 0
        Object.each(periodical, function (arr, key) {
          let key_config = (this.config && this.config[key]) ? this.config[key] : undefined
          // if (!key_config) {
          //   Object.each(this.config, function (conf, conf_key) {
          //     if (conf_key.replace('_', '').replace('.', '') === key) {
          //       key_config = conf
          //     }
          //   })
          // }
          let label = (key_config && key_config.label) ? key_config.label : key
          label += '' // cast to string
          // debug('LABEL ', this.id, label)
          // label = label.replace('  ', '')
          // if (this.$options.__config_set === false && (!key_config.graph || key_config.graph !== 'no'))
          if (this.$options.__config_set === false && this.$options.__labels_set === false) { this.chart.options.labels.push(label) }

          // debug('KEY %s %o', key, this.config)

          // if (key_config && key_config.negative) { negative_key = key_config.negative.replace('_', '') }
          if (key_config && key_config.negative) { negative_key.push(key_config.negative) }

          // if (key_config.cdef) { cdefs.push(key_config.cdef) }

          /**
            * if at least one is STAKED, dygraph.options.stackedGraph === true
            **/
          // if (this.$options.__config_set === false) {
          if (this.view.minute === false) {
            this.$set(this.chart.options, 'stackedGraph', (this.chart.options.stackedGraph && this.chart.options.stackedGraph === true)
              ? this.chart.options.stackedGraph
              : !!((key_config && key_config.draw && key_config.draw === 'STACK'))
            )

            if (this.chart.options.stackedGraph === true) {
              this.$set(this.chart.options, 'fillGraph', true)
              this.$set(this.chart.options, 'fillAlpha', 0.5)
              this.$set(this.chart.options, 'strokeWidth', 1)
            }

            // if (key_config.min) {
            //   if (!this.chart.options.valueRange) {
            //     this.$set(this.chart.options, 'valueRange', [])
            //     this.$set(this.chart.options.valueRange, 0, key_config.min * 1)
            //   }
            //
            //   this.$set(this.chart.options.valueRange, 0,
            //     (this.chart.options.valueRange &&
            //            this.chart.options.valueRange[0] &&
            //            this.chart.options.valueRange[0] * 1 < key_config.min
            //     ) ? this.chart.options.valueRange[0] * 1 : key_config.min
            //   )
            // }

            // if (key_config.max) {
            //   if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
            //   this.$set(this.chart.options.valueRange, 1, (this.chart.options.valueRange && this.chart.options.valueRange[1] && this.chart.options.valueRange[1] > key_config.max) ? this.chart.options.valueRange[1] : key_config.max * 1)
            // }
          } else {
            this.$set(this.chart.options, 'stackedGraph', false)
            this.$set(this.chart.options, 'fillGraph', false)
            this.$set(this.chart.options, 'strokeWidth', 2)
            this.$delete(this.chart.options, 'valueRange')
          }
          // }

          // if (this.chart.options.logscale === true && this.chart.options.valueRange && this.chart.options.valueRange[0] === 0) {
          //   this.chart.options.valueRange[0] = 0.0000000000000001
          // }
          // debug('data watch STAKED %s %o', this.id, this.chart, key_config.draw)

          // if (periodical_index === 0 && (!key_config.graph || key_config.graph !== 'no')) {
          //   processed_data = Array.clone(arr)
          //   // processed_data = arr
          // } else
          // if (!key_config.graph || key_config.graph !== 'no') {
          if (processed_data.length === 0) {
            processed_data = Array.clone(arr)
          } else {
            Array.each(processed_data, function (row, i) {
              processed_data_min_value = ((processed_data_min_value === 0.1 || row[1] < processed_data_min_value) && row[1] !== 0) ? row[1] : processed_data_min_value
              processed_data_max_value = (row[1] > processed_data_max_value) ? row[1] : processed_data_max_value
              row[0] = roundMilliseconds(row[0])
              let timestamp = row[0]
              if (arr[i] && roundMilliseconds(arr[i][0]) === timestamp) {
                // arr[i][0] = undefined
                // arr[i] = arr[i].clean()
                // processed_data[i].combine(arr[i])
                // if (this.chart.options.logscale === true && arr[i][1] === 0) arr[i][1] = 0.0000000000000001

                processed_data[i].push(arr[i][1])

                processed_data_min_value = ((processed_data_min_value === 0.1 || arr[i][1] < processed_data_min_value) && arr[i][1] !== 0) ? arr[i][1] : processed_data_min_value
                processed_data_max_value = (arr[i][1] > processed_data_max_value) ? arr[i][1] : processed_data_max_value
              }
              // else {
              //   processed_data[i].combine([timestamp, 0])
              // }
            })
          }
          // }

          /**
            * 'munin_historical tabular' order
            * "timestamp": 0,
            * "max": 3966 ,
            * "mean": 3944 ,
            * "median": 3945 ,
            * "min": 3919 ,
            * "mode": 3919 ,
            * "range": 47 ,
            * "sum": 23664
            **/

          // debug('MINUTE %o', minute)

          if (this.view.minute === true && minute && minute[key] && Array.isArray(minute[key]) && minute[key].length > 0 && (!key_config || !key_config.graph || key_config.graph !== 'no')) {
            if (!this.chart.options.labels.contains(label + '(median)') && this.$options.__config_set === false) {
              this.chart.options.labels.push(label + '(median)')
            }

            let index = this.chart.options.labels.indexOf(label + '(median)')
            let last

            Array.each(processed_data, function (row, i) {
              let timestamp = row[0]
              let added_minute = false

              Array.each(minute[key], function (minute_row) {
                let minute_row_timestamp = minute_row[0]
                // debug('TIMESTAMPs %s %s', new Date(roundSeconds(minute_row_timestamp)), new Date(roundSeconds(timestamp)))

                if (roundSeconds(minute_row_timestamp) === roundSeconds(timestamp) - MINUTE) {
                  processed_data[i][index] = minute_row[3] // median
                  added_minute = true
                }

                last = minute_row[3]
              })

              if (added_minute === false) { processed_data[i][index] = last }
            })
          }

          periodical_index++
        }.bind(this))

        // if (this.view.minute === false) {
        //   Object.each(periodical, function (arr, key) {
        //     let key_config = this.config[key]
        //
        //     if (!key_config) {
        //       Object.each(this.config, function (conf, conf_key) {
        //         if (conf_key.replace('_', '').replace('.', '') === key) {
        //           key_config = conf
        //         }
        //       })
        //     }
        //
        //     if (key_config.type && (key_config.type === 'DERIVE')) {
        //       let label = (key_config && key_config.label) ? key_config.label : key
        //
        //       let index = this.chart.options.labels.indexOf(label)
        //
        //       if (index > -1) {
        //         let prev = 0
        //         // Array.each(processed_data, function (row, i) {
        //         for (let i = 0; i < processed_data.length; i++) {
        //           let row = processed_data[i]
        //
        //           if (i === processed_data.length - 1) {
        //             processed_data[i][index] = 0
        //           } else {
        //             /**
        //               * ( (row[0] - processed_data[i + 1][0]) / 1000 )
        //               * timestamp of row - timestamp of next row (decreasing timestamps) / 1000 = seconds between rows
        //               **/
        //             processed_data[i][index] = (row[index] - processed_data[i + 1][index]) / ((row[0] - processed_data[i + 1][0]) / 1000)
        //           }
        //
        //           // })
        //         }
        //       }
        //
        //       // let median_index = this.chart.options.labels.indexOf(label + '(median)')
        //       //
        //       // if (median_index > -1) {
        //       //   let prev = 0
        //       //   // Array.each(processed_data, function (row, i) {
        //       //   for (let i = 0; i < processed_data.length; i++) {
        //       //     let row = processed_data[i]
        //       //
        //       //     if (i === processed_data.length - 1) {
        //       //       processed_data[i][median_index] = 0
        //       //     } else {
        //       //       processed_data[i][median_index] = row[median_index] - processed_data[i + 1][median_index]
        //       //     }
        //       //
        //       //   // })
        //       //   }
        //       // }
        //     }
        //   }.bind(this))
        // }
        /**
          * now that we now if there is a negative key, find it and make values negative
          **/
        if (negative_key.length > 0) {
          Array.each(negative_key, function (negative_key) {
            // index = 0
            // Object.each(periodical, function (arr, key) {
            // if (negative_key === key) {

            let key_config = this.config[negative_key]

            if (!key_config) {
              Object.each(this.config, function (conf, conf_key) {
                if (conf_key.replace('_', '').replace('.', '') === negative_key) {
                  key_config = conf
                }
              })
            }

            if (key_config && key_config.max && this.chart.options.valueRange) { // && this.$options.__config_set === false
              this.$set(this.chart.options.valueRange, 0, (this.chart.options.valueRange && this.chart.options.valueRange[0] && this.chart.options.valueRange[0] < (key_config.max * -1)) ? this.chart.options.valueRange[0] : (key_config.max * -1))
            }

            let label = (key_config && key_config.label) ? key_config.label : negative_key

            let index = this.chart.options.labels.indexOf(label)

            if (index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][index] = row[index] * -1
              })
            }

            let median_index = this.chart.options.labels.indexOf(label + '(median)')

            if (median_index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][median_index] = row[median_index] * -1
              })
            }
            // }
            // }.bind(this))

            if (!this.chart.options.fillGraph || this.chart.options.fillGraph === false) {
              this.$set(this.chart.options, 'fillGraph', true)
              this.$set(this.chart.options, 'fillAlpha', 0.5)
              this.$set(this.chart.options, 'strokeWidth', 1)
            }
          }.bind(this))
        }

        /**
          * process cdefs
          **/
        // if (this.view.minute === false) {
        //   let cdef_data = function (cdef, value) {
        //     let num = cdef.split(',')[1]
        //     let op = cdef.split(',')[2]
        //     // debug('cdef VALUE OP NUM %s %s %s', value, op, num)
        //     switch (op) {
        //       case '/': return value / num
        //       case '*': return value * num
        //       default: return value
        //     }
        //   }
        //
        //   Array.each(cdefs, function (cdef) {
        //     if (cdef.split(',').length === 3) {
        //       let cdef_key = cdef.split(',')[0]
        //
        //       let key_config = this.config[cdef_key]
        //       let label = (key_config && key_config.label) ? key_config.label : negative_key
        //
        //       let index = this.chart.options.labels.indexOf(label)
        //
        //       if (index > -1) {
        //         Array.each(processed_data, function (row, i) {
        //           processed_data[i][index] = cdef_data(cdef, row[index])
        //           // debug('cdef data %d %d', processed_data[i][index], row[index])
        //         })
        //       }
        //
        //       // let median_index = this.chart.options.labels.indexOf(label + '(median)')
        //       //
        //       // if (median_index > -1) {
        //       //   Array.each(processed_data, function (row, i) {
        //       //     processed_data[i][median_index] = cdef_data(cdef, row[median_index])
        //       //   })
        //       // }
        //     }
        //   }.bind(this))
        // }

        if (this.chart.options.labels.length > 10 && this.$options.__config_set === false) {
          let extra_rows = this.chart.options.labels.length - 10
          let height = 154 + (25 * extra_rows)
          this.chart.style = 'width:100%; height:' + height + 'px;'
        }

        // debug('processed_data_min_value %s', this.id, processed_data_min_value, processed_data_max_value)

        if (this.chart.options.valueRange === null && this.chart.options.logscale === 'y' && this.$options.__config_set === false) {
          this.$set(this.chart.options, 'valueRange', [processed_data_min_value, processed_data_max_value])
        }

        if (this.chart.options.valueRange && !this.chart.options.valueRange[0] && this.$options.__config_set === false) {
          this.$set(this.chart.options.valueRange, 0, (this.chart.options.logscale === 'y') ? [processed_data_min_value] : 0)
        }

        // if (this.id === 'munin.diskstats.diskstats.latency.vol0_home') {
        //   debug('munin.diskstats.diskstats.latency.vol0_home %o %o %o %o', this.id, val, this.config, this.chart.options)
        // }

        // debug('processed_data REFS %s %o', this.id, this.$refs)

        // this.processed_data = processed_data

        // debug('__process_data %s %o', this.id, this.chart.options)
        // this.$nextTick(function () {
        debug('__process_data %s %o', this.id, processed_data)

        if (processed_data.length > 0) {
          this.$refs[this.id].update_stat_data([processed_data])
          this.show = true
          // this.$refs[this.id].visibilityChanged(true)
        }
        // }.bind(this))

        this.$options.__config_set = true

        // this.no_buffer = false
      } else {
        debug('No data for %s %o', this.id, val)
      }
      // }
    }
  //
  //   /**
  //   * @start pipelines
  //   **/
  //   create_pipelines: function (next) {
  //     debug('create_pipelines')
  //
  //     let template = Object.clone(Pipeline)
  //
  //     let pipeline_id = template.input[0].poll.id
  //
  //     template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
  //
  //     let pipe = new JSPipeline(template)
  //
  //     this.$options.__pipelines_cfg[pipeline_id] = {
  //       ids: [],
  //       connected: [],
  //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
  //     }
  //
  //     this.__after_connect_inputs(
  //       pipe,
  //       this.$options.__pipelines_cfg[pipeline_id],
  //       this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
  //         debug('__resume_pipeline CALLBACK')
  //         pipe.fireEvent('onOnce')
  //       }], this)
  //     )
  //
  //     this.$options.pipelines[pipeline_id] = pipe
  //
  //     if (next) { next() }
  //   }
  //
  //   /**
  //   * @end pipelines
  //   **/
  //
  },
  computed: {
    title: function () {
      // return (this.config.graph && this.config.graph.title) ? this.config.graph.title :
      return (this.name) ? this.name : this.id
    },
    info: function () {
      // return (this.config.graph && this.config.graph.info) ? this.config.graph.info :
      return ''
    }
  },
  // mounted: function () {
  //   debug('mounted', this.id)
  // },
  // destroyed () {
  //   debug('destroyed', this.id)
  // },

}
</script>
