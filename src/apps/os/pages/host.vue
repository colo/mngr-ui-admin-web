<template>
  <div class="q-pa-md">
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
        <!-- <div class="text-h6">From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}</div> -->
        <q-toolbar class="text-primary">
          <!-- <q-btn flat round dense icon="menu" /> -->
          <q-toolbar-title>
            From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
          </q-toolbar-title>
          <!-- <q-space class="text-primary"/> -->

        </q-toolbar>
        <template v-for="(category) in periodical.plugins_categories">
          <!-- {{category}} -->
          <q-card :key="category">
            <a :id="category" :key="category+'.anchor'"/>
            <q-card-section>
              <div class="text-h3">{{category}}</div>
            </q-card-section>

            <q-card-section>
              <template v-for="(name) in periodical.plugins">
                <!-- {{name}} -->
                <os-plugin-dygraph
                  v-if="name.indexOf(category) > -1"
                  :ref="name+'.periodical'"
                  :id="'os.'+name"
                  :name="name"
                  :key="name+'.periodical.plugin'"
                />
              </template>
            </q-card-section>

            <!-- <q-separator dark /> -->
          </q-card>
        </template>
      </q-tab-panel>

      <q-tab-panel name="minute" :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'">
        <!-- <div class="text-h6">From: {{ format_time(minute.range.start) }} - To: {{ format_time(minute.range.end) }} / Updated on: {{ format_time(minute.timestamp) }}</div> -->
        <q-toolbar class="text-primary">
          <!-- <q-btn flat round dense icon="menu" /> -->
          <q-toolbar-title>
            From: {{ format_time(minute.range.start) }} - To: {{ format_time(minute.range.end) }} / Updated on: {{ format_time(minute.timestamp) }}
          </q-toolbar-title>
          <!-- <q-space class="text-primary"/> -->
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
        <template v-for="(category) in minute.plugins_categories">
          <!-- {{category}} -->
          <q-card :key="category">
            <a :id="category" :key="category+'.anchor'"/>
            <q-card-section>
              <div class="text-h3">{{category}}</div>
            </q-card-section>

            <q-card-section>
              <template v-for="(name) in minute.plugins">
                <!-- {{name}} -->
                <os-plugin-dygraph
                  v-if="name.indexOf(category) > -1"
                  :ref="name+'.minute'"
                  :id="'os.'+name+'.minute'"
                  :name="name"
                  :key="name+'.minute.plugin'"
                  :stat="{
                    data: [],
                    length: 3600,
                    range: undefined,
                  }"
                  :dygraph="{
                    skip: 1,
                    interval: 1,
                  }"
                  :interval="60"
                />
              </template>
            </q-card-section>

            <!-- <q-separator dark /> -->
          </q-card>
        </template>
      </q-tab-panel>

      <q-tab-panel name="hour" :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'">
        <!-- <div class="text-h6">From: {{ format_time(hour.range.start) }} - To: {{ format_time(hour.range.end) }} / Updated on: {{ format_time(hour.timestamp) }}</div> -->
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
              </q-popup-proxy>

            </div>
          </template>
        </q-toolbar>
        <!-- contennt -->
      </q-tab-panel>

      <q-tab-panel name="day" :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'">
        <q-toolbar class="text-primary">
        <!-- <q-btn flat round dense icon="menu" /> -->
        <q-toolbar-title>
          From: {{ format_time(day.range.start) }} - To: {{ format_time(day.range.end) }} / Updated on: {{ format_time(day.timestamp) }}
        </q-toolbar-title>
        <!-- <q-space class="text-primary"/> -->
        <template>
          <div class="q-pa-md">
            <q-btn flat dense icon="calendar_today" />
            <q-popup-proxy v-model="showCalendar" ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="selected_day" :options="disabled_days" minimal/>
            </q-popup-proxy>

          </div>
        </template>
      </q-toolbar>
      <!-- contennt -->
      </q-tab-panel>
    </q-tab-panels>

  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:os:pages:host')

import { date } from 'quasar'

import OsPluginDygraph from '@apps/os/components/pluginDygraph'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/os/pipelines/host'

// import { requests, store } from '../sources/host/periodical/index'
import PeriodicalPipeline from '@apps/os/pipelines/host/periodical'
import MinutePipeline from '@apps/os/pipelines/host/minute'
// import HourPipeline from '@apps/os/pipelines/host/hour'
// import DayPipeline from '@apps/os/pipelines/host/day'

import * as PeriodicalSources from '@apps/os/sources/host/periodical/index'
import * as MinuteSources from '@apps/os/sources/host/minute/index'
// import * as HourSources from '@apps/os/sources/host/hour/index'
// import * as DaySources from '@apps/os/sources/host/day/index'

import moment from 'moment'

// import QCalendar from '@quasar/quasar-ui-qcalendar'

// function leftClick (e) {
//   return e.button === 0
// }

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

  components: { OsPluginDygraph },

  name: 'OSHost',

  periodical: {
    plugins_data: {},
    length: 360
  },

  minute: {
    plugins_data: {},
    length: 3600
  },

  data () {
    return {
      id: 'os.host',
      path: 'all',

      day: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },
      hour: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },
      minute: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },

      periodical: {
        plugins_data: {},
        plugins: [],
        // plugins_config: {},
        plugins_categories: [],
        range: { start: 0, end: 0},
        timestamp: 0,
      },

      store: false,
      // pipeline_id: 'input.os.host',
      pipeline_id: [
        'input.os.host.periodical',
        'input.os.host.minute',
        // 'input.os.host.hour',
        // 'input.os.host.day'
      ],

      range_tab: 'periodical',

      current_day: undefined,
      current_hour: undefined,
      current_minute: undefined,
      top: 15,

      /** calendar **/
      selected_day: date.formatDate(Date.now(), 'YYYY/MM/DD'),
      selected_hour: date.formatDate(Date.now(), 'HH') + ':00',
      selected_minute: date.formatDate(Date.now(), 'HH:mm'),
      // selectedDate: '',
      // convertedDates: '',
      showCalendar: false,
      showHour: false,
      showMinute: false,
      // anchorTimestamp: '',
      // otherTimestamp: '',
      // mouseDown: false,
      // mobile: false,
      /** calendar **/

      // components: {
      //   range: {
      //     // source: {
      //     //   requests: {
      //     //     once: [],
      //     //     periodical: []
      //     //   }
      //     // }
      //     source: {
      //       requests: requests
      //
      //       // store: store
      //     }
      //   }
      //
      // }
      components: {
        'input.os.host.periodical': {
          range: {
            source: {
              requests: PeriodicalSources.requests
              // store: store
            }
          }
        },
        'input.os.host.minute': {
          range: {
            source: {
              requests: MinuteSources.requests
              // store: store
            }
          }
        },
        // 'input.os.host.hour': {
        //   range: {
        //     source: {
        //       requests: HourSources.requests
        //       // store: store
        //     }
        //   }
        // },
        // 'input.os.host.day': {
        //   range: {
        //     source: {
        //       requests: DaySources.requests
        //       // store: store
        //     }
        //   }
        // }

      }
    }
  },

  watch: {
    // 'periodical.plugins_data': {
    //   deep: true,
    //   inmediate: true,
    //   handler: function (data) {
    //     debug('periodical.plugins_data %o', data)
    //     Object.each(data, function (value, plugin) {
    //       if (this.$refs[plugin + '.periodical'] && this.$refs[plugin + '.periodical'][0] && !this.$refs[plugin + '.periodical'][0].$options.plugin_data) {
    //         this.$refs[plugin + '.periodical'][0].$options.plugin_data = { periodical: undefined, minute: undefined }
    //       }
    //       if (!this.$options.periodical.plugins_data[plugin]) {
    //         this.$options.periodical.plugins_data[plugin] = Object.clone(value)
    //       } else {
    //       // this.$options.periodical.plugins_data[plugin].push(Object.clone(value))
    //         Object.each(value.periodical, function (val, prop) {
    //           // this.$options.periodical.plugins_data[plugin].periodical[prop].append(val)
    //           let val_not_found = []
    //           Array.each(this.$options.periodical.plugins_data[plugin].periodical[prop], function (row) {
    //             // debug('periodical.plugins_data %d', row[0], val[0][0])
    //
    //             Array.each(val, function (val_row, val_row_index) {
    //               if (row[0] !== val_row[0] && !val_not_found.contains(val_row_index)) { // timestamp exist
    //                 val_not_found.push(val_row_index)
    //               } else if (row[0] === val_row[0] && val_not_found.contains(val_row_index)) {
    //                 val_not_found = val_not_found.erase(val_row_index)
    //               }
    //             })
    //           })
    //
    //           // debug('periodical.plugins_data to add %o', val_not_found)
    //           Array.each(val_not_found, function (index) {
    //             this.$options.periodical.plugins_data[plugin].periodical[prop].push(val[index])
    //           }.bind(this))
    //           // if (found === false) {
    //           //   this.$options.periodical.plugins_data[plugin].periodical[prop].push(val)
    //           // }
    //           this.$options.periodical.plugins_data[plugin].periodical[prop].sort(function (b, a) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
    //           // this.$options.periodical.plugins_data[plugin].periodical[prop] = this.$options.periodical.plugins_data[plugin].periodical[prop].slice(0, 360)
    //         }.bind(this))
    //       }
    //       if (this.$refs[plugin + '.periodical'] && this.$refs[plugin + '.periodical'][0]) {
    //         // debug('periodical.plugins_data %o', this.$options.periodical.plugins_data[plugin].periodical)
    //         // this.$options.periodical.plugins_data[plugin] = this.$options.periodical.plugins_data[plugin].slice(0, 360)
    //         //
    //         // if (this.$options.periodical.plugins_data[plugin] && this.$options.periodical.plugins_data[plugin].length > 0) {
    //         //   debug('periodical.plugins_data from BUFFER %o', this.$options.periodical.plugins_data[plugin])
    //         //   Array.each(this.$options.periodical.plugins_data[plugin], function (value) {
    //         //     this.$refs[plugin + '.periodical'][0].set_data(Object.clone(value))
    //         //   }.bind(this))
    //         //
    //         //   // this.$options.periodical.plugins_data[plugin] = []
    //         // }
    //         // this.$refs[plugin + '.periodical'][0].set_data(this.$options.periodical.plugins_data[plugin])
    //         this.$refs[plugin + '.periodical'][0].set_data(Object.clone(this.$options.periodical.plugins_data[plugin]))
    //       } else { // buffer data until plugin available
    //       //   debug('periodical.plugins_data BUFFER %o', data)
    //
    //       }
    //     }.bind(this))
    //   }
    //
    // },
    selected_day () {
      debug('selected_day %s', new Date(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000))
      if (roundHours(moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) === roundHours(Date.now())) {
        this.current_day = undefined
      } else {
        this.current_day = (moment(this.selected_day, 'YYYY/MM/DD').unix() * 1000) + DAY
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.os.host.day')
      this.create_pipelines('input.os.host.day')
      this.resume_pipelines('input.os.host.day')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },
    selected_hour () {
      debug('selected_hour %s', new Date(moment(this.selected_hour, 'hh:mm').unix() * 1000))
      if (roundMinutes(moment(this.selected_hour, 'hh:mm').unix() * 1000) === roundMinutes(Date.now())) {
        this.current_hour = undefined
      } else {
        this.current_hour = (moment(this.selected_hour, 'hh:mm').unix() * 1000) + HOUR
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.os.host.hour')
      this.create_pipelines('input.os.host.hour')
      this.resume_pipelines('input.os.host.hour')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    },
    selected_minute () {
      debug('selected_minute %s', new Date(moment(this.selected_minute, 'hh:mm').unix() * 1000))
      if (roundSeconds(moment(this.selected_minute, 'hh:mm').unix() * 1000) === roundSeconds(Date.now())) {
        this.current_minute = undefined
      } else {
        this.current_minute = (moment(this.selected_minute, 'hh:mm').unix() * 1000) + MINUTE
      }
      // this.$nextTick(function () {
      this.destroy_pipelines('input.os.host.minute')
      this.create_pipelines('input.os.host.minute')
      this.resume_pipelines('input.os.host.minute')
      // }.bind(this))

      // this.convertedDates = `${start} - ${end}`
      // debug('startEndDates', this.end)
    }
    /** calendar **/
  },
  methods: {
    set_plugin_data: function (plugin, data, type, refresh) {
      if (type === 'minute') { debug('set_plugin_data %s %o %s', plugin, data, type) }

      // Object.each(data, function (value, plugin) {
      if (this.$refs[plugin + '.' + type] && this.$refs[plugin + '.' + type][0] && !this.$refs[plugin + '.' + type][0].$options.plugin_data) {
        this.$refs[plugin + '.' + type][0].$options.plugin_data = { periodical: undefined, minute: undefined }
      }
      if (!this.$options[type].plugins_data[plugin]) {
        this.$options[type].plugins_data[plugin] = { periodical: Object.clone(data) }
      } else if (refresh !== true) {
        // this.$options[type].plugins_data[plugin].push(Object.clone(value))
        Object.each(data, function (val, prop) {
          // this.$options[type].plugins_data[plugin].periodical[prop].append(val)
          let val_not_found = []
          Array.each(this.$options[type].plugins_data[plugin].periodical[prop], function (row) {
            // debug('periodical.plugins_data %d', row[0], val[0][0])

            Array.each(val, function (val_row, val_row_index) {
              if (row[0] !== val_row[0] && !val_not_found.contains(val_row_index)) { // timestamp exist
                val_not_found.push(val_row_index)
              } else if (row[0] === val_row[0] && val_not_found.contains(val_row_index)) {
                val_not_found = val_not_found.erase(val_row_index)
              }
            })
          })

          // debug('periodical.plugins_data to add %o', val_not_found)
          Array.each(val_not_found, function (index) {
            this.$options[type].plugins_data[plugin].periodical[prop].push(val[index])
          }.bind(this))
          // if (found === false) {
          //   this.$options[type].plugins_data[plugin].periodical[prop].push(val)
          // }
          this.$options[type].plugins_data[plugin].periodical[prop].sort(function (b, a) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
          this.$options[type].plugins_data[plugin].periodical[prop] = this.$options[type].plugins_data[plugin].periodical[prop].slice(0, this.$options[type].length)
          this.$options[type].plugins_data[plugin].periodical[prop].sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0) })
        }.bind(this))
      }

      if (this.$refs[plugin + '.' + type] && this.$refs[plugin + '.' + type][0]) {
        if (type === 'minute') {
          debug('set_plugin_data TO PLUGIN %s %o %s', plugin, this.$options[type].plugins_data[plugin].periodical, type)
        }
        // this.$options[type].plugins_data[plugin] = this.$options[type].plugins_data[plugin].slice(0, 360)
        //
        // if (this.$options[type].plugins_data[plugin] && this.$options[type].plugins_data[plugin].length > 0) {
        //   debug('periodical.plugins_data from BUFFER %o', this.$options[type].plugins_data[plugin])
        //   Array.each(this.$options[type].plugins_data[plugin], function (value) {
        //     this.$refs[plugin + '.' + type][0].set_data(Object.clone(value))
        //   }.bind(this))
        //
        //   // this.$options[type].plugins_data[plugin] = []
        // }
        // this.$refs[plugin + '.' + type][0].set_data(this.$options[type].plugins_data[plugin])
        this.$refs[plugin + '.' + type][0].set_data(Object.clone(this.$options[type].plugins_data[plugin]))
      } else { // buffer data until plugin available
        //   debug('periodical.plugins_data BUFFER %o', data)
        setTimeout(function () {
          this.set_plugin_data(plugin, Object.clone(this.$options[type].plugins_data[plugin].periodical), type, true)
        }.bind(this), 5000)
      }
      // }.bind(this))
    },
    /**
    * @start pipelines
    **/
    create_pipelines: function (create_id, next) {
      debug('create_pipelines %o', this.$options.pipelines)

      // if (
      //   this.$options.pipelines['input.o.periodicals.host.periodical'] data&
      //   this.$options.pipelines['input.os.host.periodical'].get_input_by_id('input.os.host.periodical')
      // ) {
      //   // let requests = this.__components_sources_to_requests(this.components)
      //   // if (requests.once) {
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].options.requests.once.combine(requests.once)
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
      //   // }
      //   //
      //   // if (requests.periodical) {
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
      //   //   this.$options.pipelines['input.os.host'].get_input_by_id('input.os').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //   // }
      // } else {
      const pipelines = [PeriodicalPipeline, MinutePipeline] //, HourPipeline, DayPipeline
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
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

    /**
    * @end pipelines
    **/
    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
    },
    end_minute: function () {
      if (this.current_minute === undefined) {
        return Date.now()
      } else {
        return this.current_minute
      }
    },
    end_hour: function () {
      if (this.current_hour === undefined) {
        return Date.now()
      } else {
        return this.current_hour
      }
    },
    end_day: function () {
      if (this.current_day === undefined) {
        return Date.now()
      } else {
        return this.current_day
      }
    },
    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    /** calendar **/
    // disabled_hours: function (date) {
    //   return date <= moment().format('HH')
    //   // && date <= '2019/02/15'
    // },
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
    disabled_days: function (date) {
      return date <= moment().format('YYYY/MM/DD')
      // && date <= '2019/02/15'
    },
  },
  computed: {
    'periodical_plugins_data': function () {
      return this.periodical.plugins_data
    },
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  }
  // computed: {
  //
  // //   count: function () {
  // //     let result = 0
  // //     Array.each(this.groups, function (group) {
  // //       result += group.count
  // //     })
  // //
  // //     return result
  // //   }
  // },
  // mounted: function () {
  //   this.pipeline_id = 'input.os.host'
  // },
  // create: function () {
  //   debug('created HOST %s %o %o', this.host, this.$options.range_component, this.$options.__pipelines_cfg)
  //   // EventBus.$on(this.pipeline_id, this.__process_input_data)
  //
  //   // if (this.store) this.__register_store_module(this.id, sourceStore)
  //   // this.__bind_components_to_sources(this.components)
  //   // this.create_pipelines()
  //
  //   // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.host = this.host
  //   // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.host = this.host
  //   // this.$set(this.components, 'range', this.$options.range_component)
  //   // this.$set(this.components, 'feed', this.$options.feed_component)
  //   // this.components.range.source.requests.once.push(this.$options.range_component)
  //
  //   this.components.range.source.requests.periodical.push(this.$options.range_component)
  // }

}
</script>
