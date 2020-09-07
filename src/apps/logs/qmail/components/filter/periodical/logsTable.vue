<template>
  <q-table
    flat square
    class="my-sticky-header-table"
    title="Qmail Logs"
    :data="logs"
    :columns="columns"
    :row-key="row => row.domain +'.'+ row.host +'.'+ row.path"
    :pagination.sync="pagination"
    virtual-scroll
    :rows-per-page-options="[0]"
    :visible-columns="($q.screen.lt.sm) ? visibleColumns : allColumns"
    :loading="loading_logs"
    :filter="search_filter"
  >
  <!-- dark
  color="amber" -->
    <template v-slot:top="props">
      <q-select
        v-if="$q.screen.lt.sm"
        v-model="visibleColumns"
        multiple
        borderless
        dense
        options-dense
        :display-value="$q.lang.table.columns"
        emit-value
        map-options
        :options="columns"
        option-value="name"
        style="min-width: 150px"
      />
      <q-space />
      <!-- <div v-if="$q.screen.gt.xs" class="col">
        <q-toggle v-model="visibleColumns" val="schema" label="Schema" />
        <q-toggle v-model="visibleColumns" val="uri" label="URI" />
        <q-toggle v-model="visibleColumns" val="port" label="Port" />
        <q-toggle v-model="visibleColumns" val="host" label="Host" />
        <q-toggle v-model="visibleColumns" val="timestamp" label="Last Update" />
        <q-toggle v-model="visibleColumns" val="path" label="Type" />
      </div> -->

      <q-input borderless dense debounce="100" v-model="search_filter" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
      flat round dense
      :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
      @click="props.toggleFullscreen"
      class="q-ml-md"
    />
    </template>

    <template v-slot:body="props">
    <q-tr :props="props">

      <q-td key="View" :props="props">
        <!-- View -->
        <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
        <q-btn
          v-on:click="destroy_pipelines()"
          :to="'/logs/qmail/filter/?domain=' + props.row.domain+'&host=' + props.row.host+'&path=' + props.row.path"
          flat
          icon="open_in_browser"
        />
      </q-td>

      <q-td key="domain" :props="props">
        <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
        <q-btn
          v-on:click="destroy_pipelines()"
          :to="'/logs/qmail/filter/?domain=' + props.row.domain" flat icon="open_in_browser"
          :label="props.row.domain"
        />
      </q-td>

      <q-td key="host" :props="props">
        <q-btn
          v-on:click="destroy_pipelines()"
          :to="'/logs/qmail/filter/?host=' + props.row.host"
          flat
          icon="open_in_browser"
          :label="props.row.host"
        />
      </q-td>
      <q-td key="timestamp" :props="props">
        {{ format_time(props.row.timestamp) }}
      </q-td>
      <q-td key="path" :props="props">
        <q-btn
          v-on:click="destroy_pipelines()"
          :to="'/logs/qmail/filter/?path=' + props.row.path" flat icon="open_in_browser"
          :label="props.row.path"
        />
      </q-td>
    </q-tr>
    </template>
  </q-table>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:qmail:components:filter:periodical:logsTable')

// import { date } from 'quasar'
//
// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'
//
// import JSPipeline from 'js-pipeline'
//
// import PeriodicalPipeline from '@apps/logs/qmail/pipelines/filter/periodical'
//
// import * as PeriodicalSources from '@apps/logs/qmail/sources/filter/periodical/index'
//
import moment from 'moment'
//
// import { mapState } from 'vuex'
//
// import WorldCitiesMap from '@apps/logs/qmail/components/worldCitiesMap'
// import TopCountry from '@apps/logs/qmail/components/topCountry'
// import TopCity from '@apps/logs/qmail/components/topCity'
// import Toolbar from '@apps/logs/qmail/components/filter/periodical/toolbar'
//
// import GridView from '@components/gridView'

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

  // components: {
  //   chartTabular,
  //   GridView,
  //   WorldCitiesMap,
  //   TopCountry,
  //   TopCity,
  // },

  name: 'LogsWebFilterPeriodicalLogsTable',

  // _logsWebFilterPeriodical_components: {
  //   range: {
  //     source: {
  //       requests: PeriodicalSources.requests
  //       // store: store
  //     }
  //   }
  // },
  props: {
    timestamp: {
      type: Number,
      default: 0
    },
    logs: {
      type: Array,
      default: function () {
        return []
      }
    },
    loading_logs: {
      type: Boolean,
      default: true
    }

  },

  data () {
    return {
      id: 'logs.qmail.filter.periodical.logs.table',

      search_filter: '',
      // loading_logs: true,
      allColumns: ['View', 'domain', 'host', 'path', 'timestamp'],
      visibleColumns: ['domain'],
      pagination: {
        sortBy: 'timestamp', // string column name
        descending: true, // boolean
        rowsPerPage: 50
      },

      columns: [
        { name: 'View', label: 'View', field: 'View', sortable: true, align: 'left' },
        {
          name: 'domain',
          required: true,
          label: 'Domain',
          align: 'left',
          field: 'domain',
          sortable: true
        },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        {
          name: 'timestamp',
          align: 'left',
          label: 'Last Update',
          field: 'timestamp',
          sortable: true
        },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      ],

      // grid: {
      //   layouts: {
      //     'lg': [
      //       { x: 0, y: 0, w: 24, h: 5, i: 'toolbar', immobile: false },
      //       { x: 0, y: 1, w: 12, h: 36, i: 'topCountry', immobile: false },
      //       { x: 12, y: 1, w: 12, h: 36, i: 'worldMap', immobile: false },
      //       { x: 0, y: 2, w: 12, h: 36, i: 'worldCitiesMap', immobile: false },
      //       { x: 12, y: 2, w: 12, h: 36, i: 'topCity', immobile: false },
      //       // { x: 15, y: 0, w: 6, h: 10, i: 'mounts', immobile: false },
      //       // { x: 21, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
      //       // // { x: 0, y: 1, w: 12, h: 2, i: 'separator' }
      //     ],
      //     'md': [
      //       // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
      //       // { x: 4, y: 0, w: 4, h: 10, i: 'netOut', immobile: false },
      //       // { x: 8, y: 0, w: 4, h: 10, i: 'netIn', immobile: false },
      //       // { x: 12, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
      //       //
      //       // { x: 0, y: 1, w: 8, h: 15, i: 'cpu', immobile: false },
      //       // { x: 8, y: 1, w: 8, h: 10, i: 'mounts', immobile: false },
      //       //
      //       // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
      //     ],
      //     'sm': [
      //       // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
      //       // { x: 3, y: 0, w: 3, h: 10, i: 'netOut', immobile: false },
      //       // { x: 6, y: 0, w: 3, h: 10, i: 'netIn', immobile: false },
      //       // { x: 9, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
      //       //
      //       // { x: 0, y: 1, w: 6, h: 15, i: 'cpu', immobile: false },
      //       // { x: 6, y: 1, w: 6, h: 10, i: 'mounts', immobile: false },
      //       //
      //       // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
      //     ],
      //     'xs': [
      //       // { x: 0, y: 0, w: 4, h: 10, i: 'loadavg', immobile: false },
      //       // { x: 4, y: 0, w: 4, h: 10, i: 'memory', immobile: false },
      //       // { x: 0, y: 1, w: 4, h: 10, i: 'netOut', immobile: false },
      //       // { x: 4, y: 1, w: 4, h: 10, i: 'netIn', immobile: false },
      //       // { x: 0, y: 2, w: 8, h: 15, i: 'cpu', immobile: false },
      //       // { x: 0, y: 3, w: 8, h: 10, i: 'mounts', immobile: false },
      //       //
      //       // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
      //     ],
      //     'xxs': [
      //       // { x: 0, y: 0, w: 3, h: 10, i: 'loadavg', immobile: false },
      //       // { x: 3, y: 0, w: 3, h: 10, i: 'memory', immobile: false },
      //       // { x: 0, y: 1, w: 3, h: 10, i: 'netOut', immobile: false },
      //       // { x: 3, y: 1, w: 3, h: 10, i: 'netIn', immobile: false },
      //       // { x: 0, y: 2, w: 6, h: 15, i: 'cpu', immobile: false },
      //       // { x: 0, y: 3, w: 6, h: 10, i: 'mounts', immobile: false },
      //       //
      //       // // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
      //     ]
      //
      //   },
      //   breakpoint: 'lg',
      //   // slots: [
      //   //   '<q-btn round />'
      //   // ],
      //
      //   // cols: 12,
      //   // // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      //   // colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
      //
      //   cols: 22,
      //   // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
      //   colsAll: { lg: 24, md: 16, sm: 12, xs: 8, xxs: 6 },
      //
      //   isDraggable: true,
      //   isResizable: false,
      //   preview: true
      // },
      //
      // components: {
      //   'toolbar': [
      //     {
      //       component: Toolbar
      //     }
      //   ],
      //   'topCountry': [
      //     {
      //       component: TopCountry,
      //       props: {
      //         type: 'periodical',
      //         // top_country_counter: {},
      //         dark: this.dark,
      //         colorScheme: this.colorScheme
      //       }
      //     }
      //
      //   ],
      //   'worldMap': [
      //     {
      //       // component: WorldCitiesMap,
      //     }
      //
      //   ],
      //   'worldCitiesMap': [
      //     {
      //       component: WorldCitiesMap,
      //       props: {
      //         type: 'periodical',
      //         world_map_cities: [],
      //         dark: this.dark,
      //         colorScheme: this.colorScheme
      //       }
      //     }
      //
      //   ],
      //   'topCity': [
      //     {
      //       component: TopCity,
      //       props: {
      //         type: 'periodical',
      //         // top_city_counter: {},
      //         dark: this.dark,
      //         colorScheme: this.colorScheme
      //       }
      //     }
      //
      //   ],
      //   'table': [
      //     {
      //       // component: LogsTable,
      //     }
      //
      //   ],
      //
      // },

    }
  },

  // watch: {
  //   dark: function () {
  //     Object.each(this.components, function (gridItem, name) {
  //       Array.each(this.components[name], function (component, index) {
  //         this.$set(this.components[name], index, Object.merge(this.components[name][index], {
  //           props: {
  //             dark: this.dark,
  //           }
  //
  //         }))
  //       }.bind(this))
  //     }.bind(this))
  //   },
  //   colorScheme: function () {
  //     Object.each(this.components, function (gridItem, name) {
  //       Array.each(this.components[name], function (component, index) {
  //         this.$set(this.components[name], index, Object.merge(this.components[name][index], {
  //           props: {
  //             colorScheme: this.colorScheme,
  //           }
  //
  //         }))
  //       }.bind(this))
  //     }.bind(this))
  //   },
  //
  //   periodical: {
  //     handler: function (periodical) {
  //       if (periodical && Object.getLength(periodical) > 0) {
  //         this.$set(this.components.toolbar[0].props, 'range', periodical.range)
  //         this.$set(this.components.toolbar[0].props, 'timestamp', periodical.timestamp)
  //
  //         // this.$set(this.components.topCountry, 0, Object.merge(this.components.topCountry[0], {
  //         //   id: this.id + '.periodical.topCountry.component',
  //         //   props: {
  //         //     top_country_counter: periodical.top_country_counter
  //         //   }
  //         //
  //         // }))
  //         this.$set(this.components.topCountry[0].props, 'top_country_counter', periodical.top_country_counter)
  //
  //         // this.$set(this.components.worldCitiesMap, 0, Object.merge(this.components.worldCitiesMap[0], {
  //         //   id: this.id + '.periodical.worldCitiesMap.component',
  //         //   props: {
  //         //     world_map_cities: periodical.world_map_cities,
  //         //   }
  //         //
  //         // }))
  //         this.$set(this.components.worldCitiesMap[0].props, 'world_map_cities', periodical.world_map_cities)
  //
  //         // this.$set(this.components.topCity, 0, Object.merge(this.components.topCity[0], {
  //         //   id: this.id + '.periodical.topCity.component',
  //         //   props: {
  //         //     top_city_counter: periodical.top_city_counter
  //         //   }
  //         //
  //         // }))
  //
  //         this.$set(this.components.topCity[0].props, 'top_city_counter', periodical.top_city_counter)
  //
  //         debug('watch periodical', periodical, this.components)
  //
  //         // this.$set(this.components.netOut, 0, Object.merge(this.components.netOut[0], {
  //         //   id: this.host + '.netOut.component',
  //         //   props: {
  //         //     net: host_data['os.networkInterfaces.out'],
  //         //     net_max: host_data['os.networkInterfaces.max.out'],
  //         //     host: this.host
  //         //   }
  //         //
  //         // }))
  //         //
  //         // this.$set(this.components.netIn, 0, Object.merge(this.components.netIn[0], {
  //         //   id: this.host + '.netIn.component',
  //         //   props: {
  //         //     net: host_data['os.networkInterfaces.in'],
  //         //     net_max: host_data['os.networkInterfaces.max.in'],
  //         //     host: this.host
  //         //   }
  //         //
  //         // }))
  //         //
  //         // this.$set(this.components.cpu, 0, Object.merge(this.components.cpu[0], {
  //         //   id: this.host + '.cpu.component',
  //         //   props: {
  //         //     used: host_data['os.cpus.percentage'],
  //         //     host: this.host
  //         //   }
  //         // }))
  //         //
  //         // let index = 0
  //         // this.$set(this.components, 'mounts', [])
  //         //
  //         // Object.each(host_data['os.mounts.used'], function (used, mount) {
  //         //   if (index <= 1) {
  //         //     this.components.mounts.push({
  //         //       style: {
  //         //         'width': (Object.getLength(host_data['os.mounts.used']) === 1) ? '100%' : '50%',
  //         //         'float': (Object.getLength(host_data['os.mounts.used']) === 1) ? undefined : (index === 0) ? 'left' : 'right'
  //         //       },
  //         //       id: this.host + '.' + mount + '.used.component',
  //         //       props: {
  //         //         used: used,
  //         //         mount: mount,
  //         //         host: this.host
  //         //       }
  //         //
  //         //     })
  //         //     this.$set(this.components.mounts[index], 'component', Mount)
  //         //   }
  //         //
  //         //   index++
  //         // }.bind(this))
  //         //
  //         // this.$set(this.components.memory, 0, Object.merge(this.components.memory[0], {
  //         //   id: this.host + '.memory.component',
  //         //   props: {
  //         //     used: host_data['os.memory.percentage'],
  //         //     host: this.host
  //         //   }
  //         //
  //         // }))
  //       }
  //     },
  //     deep: true
  //   }
  // },
  // computed: {
  //   ...mapState({
  //     dark: state => state.layout.dark,
  //     colorScheme: state => state.layout.dashboardColorScheme
  //   }),
  //   'filter': function () {
  //     // return (this.$route && this.$route.params && this.$route.params.qmail) ? this.$route.params.qmail : undefined
  //     return (this.$route && this.$route.query)
  //       ? this.$route.query
  //       : undefined
  //   },
  //   'type': function () {
  //     return (this.filter) ? Object.keys(this.filter)[0] : undefined
  //   },
  //   'qmail': function () {
  //     return (this.filter && this.type) ? this.filter[this.type] : undefined
  //   }
  // },
  //
  // created: function () {
  //   this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
  // },

  // mounted: function () {
  //   debug('mounted', this.$refs)
  //   this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))
  //
  //   Object.each(this.components, function (gridItem, name) {
  //     Array.each(this.components[name], function (component, index) {
  //       this.$set(this.components[name], index, Object.merge(this.components[name][index], {
  //         id: this.id + '.periodical.' + name + '.component',
  //         props: {
  //           dark: this.dark,
  //           colorScheme: this.colorScheme,
  //         }
  //       }))
  //     }.bind(this))
  //   }.bind(this))
  // },

  methods: {
    // // onResizeActions: function (size) {
    // //   debug('onResizeActions', size)
    // //   this.actionsSize = size
    // // },
    // setHeight: function (height) {
    //   debug('setHeight', height)
    //   // this.height = height + 200 + 'px'
    //   this.height = height
    // },
    //
    // end: function () {
    //   // if (this.current_day === undefined) {
    //   return Date.now()
    //   // } else {
    //   // return this.current_day
    //   // }
    // },
    //
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

    format_time: function (timestamp) {
      return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    format_log: function (log) {
      return (log.length <= 100) ? log : log.substring(0, 96) + '...'
    },
    /**
    * @start pipelines
    **/
    // create_pipelines: function (create_id, next) {
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   const pipelines = [PeriodicalPipeline]
    //   Array.each(pipelines, function (Pipeline) {
    //     let template = Object.clone(Pipeline)
    //
    //     debug('create_pipelines template %o', template)
    //
    //     let pipeline_id = template.input[0].poll.id
    //     if (!create_id || create_id === undefined || create_id === pipeline_id) {
    //       // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
    //       Array.each(template.input[0].poll.conn, function (conn, index) {
    //         template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterPeriodical_components, pipeline_id)
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

  }

}
</script>

<style lang="sass">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height: 600px
    // min-height: 600px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    // background-color: #1d1d1d

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
