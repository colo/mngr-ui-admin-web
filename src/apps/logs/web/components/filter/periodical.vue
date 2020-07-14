<template>
  <div>
    <q-toolbar class="text-primary">
      <!-- <q-btn flat round dense icon="menu" /> -->
      <q-toolbar-title>
        From: {{ format_time(periodical.range.start) }} - To: {{ format_time(periodical.range.end) }} / Updated on: {{ format_time(periodical.timestamp) }}
      </q-toolbar-title>
      <!-- <q-space class="text-primary"/> -->

    </q-toolbar>

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsWorldCityMap',
      }"
      :always_update="false"
      :ref="'periodical.world_map_cities'"
      :id="'periodical.world_map_cities'"
      :stat="{
        data: [
          periodical.world_map_cities
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-world-city-map :id="'periodical.world_map_cities'" :cities="periodical.world_map_cities"/> -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'country',
          label: 'Per COUNTRY count (last 5 secs)',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'periodical.top_country_counter'"
      :id="'periodical.top_country_counter'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.top_country_counter'"
      :stat="{
        data: [
          periodical.top_country_counter
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'country'"
      :values="periodical.top_country_counter"
      :label="'Per COUNTRY count (last 5 secs)'"
      :id="'top_country_counter'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_country_counter'"
    /> -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'country',
          label: 'Per COUNTRY count (sum)',
          zoom: apply_zoom,
          sum: true
        }
      }"
      :always_update="false"
      :ref="'periodical.top_country_counter_sum'"
      :id="'periodical.top_country_counter_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.top_country_counter_sum'"
      :stat="{
        data: [
          periodical.top_country_counter
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'country'"
      :values="periodical.top_country_counter"
      :label="'Per COUNTRY count (sum)'"
      :id="'top_country_counter_sum'"
      :zoom="apply_zoom"
      :sum="true"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_country_counter_sum'"
    /> -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'city',
          label: 'Per CITY count (last 5 secs)',
          zoom: apply_zoom
        }
      }"
      :always_update="false"
      :ref="'periodical.top_city_counter'"
      :id="'periodical.top_city_counter'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.top_city_counter'"
      :stat="{
        data: [
          periodical.top_city_counter
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'city'"
      :values="periodical.top_city_counter"
      :label="'Per CITY count (last 5 secs)'"
      :id="'top_city_counter'"
      :zoom="apply_zoom"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_city_counter'"
    /> -->

    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'amchartsBarRace',
        props:{
          categoryY: 'city',
          label: 'Per CITY count (sum)',
          zoom: apply_zoom,
          sum: true
        }
      }"
      :always_update="false"
      :ref="'periodical.top_city_counter_sum'"
      :id="'periodical.top_city_counter_sum'"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical.top_city_counter_sum'"
      :stat="{
        data: [
          periodical.top_city_counter
        ],
        length: 1,
        numeric: false
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>

    <!-- <amcharts-bar-race
      :categoryY="'city'"
      :values="periodical.top_city_counter"
      :label="'Per CITY count (sum)'"
      :id="'top_city_counter_sum'"
      :zoom="apply_zoom"
      :sum="true"
      :key="$route.path +'.'+ JSON.stringify($route.query)+'.top_city_counter_sum'"
    /> -->

    <!-- <div v-for="(val, prop) in minute" :key="'minute.'+prop">
      minute: {{prop}} - {{val}} <br/>
    </div>
    <hr>

    <div v-for="(val, prop) in hour" :key="'hour.'+prop">
      hour: {{prop}} - {{val}} <br/>
    </div>
    <hr>

    <div v-for="(val, prop) in day" :key="'day.'+prop">
      day: {{prop}} - {{val}} <br/>
    </div>
    <hr> -->

    periodical.total_bytes_sent: {{ periodical.total_bytes_sent }} <br/>
    periodical.hits: {{ periodical.hits }} <br/>

    <hr>

    periodical.current_bytes_sent: {{ periodical.current_bytes_sent }}

    <hr>

    <div v-for="(val, status) in periodical.status_counter" :key="'status.'+status">
      periodical.status_counter: {{status}} - {{val}} <br/>
    </div>

    <hr>

    <!-- <div v-for="(val, city) in periodical.city_counter" :key="'city.'+city">
      periodical.city_counter: {{city}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, country) in periodical.country_counter" :key="'country.'+country">
      periodical.country_counter: {{country}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, continent) in periodical.continent_counter" :key="'continent.'+continent">
      periodical.continent_counter: {{continent}} - {{val}} <br/>
    </div>

    <hr> -->

    <!-- <div v-for="(val, addr) in periodical.addr_counter" :key="'addr.'+addr">
      periodical.addr_counter: {{addr}} - {{val}} <br/>
    </div> -->

    <hr>

    <div v-for="(val, user) in periodical.user_counter" :key="'user.'+user">
      periodical.user_counter: {{user}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, referer) in periodical.referer_counter" :key="'referer.'+referer">
      periodical.referer_counter: {{referer}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, type) in periodical.type_counter" :key="'type.'+type">
      periodical.type_counter: {{type}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, os) in periodical.user_agent_os_counter" :key="'os.'+os">
      periodical.user_agent_os_counter: {{os}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, os) in periodical.user_agent_os_family_counter" :key="'os_family.'+os+'-'+val">
      periodical.user_agent_os_family_counter: {{os}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, engine) in periodical.user_agent_engine_counter" :key="'engine.'+engine+'-'+val">
      periodical.user_agent_engine_counter: {{engine}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, browser) in periodical.user_agent_browser_counter" :key="'browser.'+browser+'-'+val">
      periodical.user_agent_browser_counter: {{browser}} - {{val}} <br/>
    </div>

    <hr>

    <div v-for="(val, device) in periodical.user_agent_device_counter" :key="'device.'+device+'-'+val">
      periodical.user_agent_device_counter: {{device}} - {{val}} <br/>
    </div>

    <q-table
      class="my-sticky-header-table"
      title="Web Logs"
      :data="periodical.logs"
      :columns="columns"
      :row-key="(row, index) => row.timestamp + row.domain +'.'+ row.host +'.'+ row.path + '.' + index"
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

        <q-td key="date" :props="props">
          {{ format_time(props.row.timestamp) }}
        </q-td>

        <q-td key="log" :props="props">
          {{ format_log(props.row.log) }}
        </q-td>

        <q-td key="domain" :props="props">
          {{ props.row.domain }}
          <!-- <q-btn type="a" :href="props.row.schema+'://'+props.row.uri+':'+props.row.port" target="_blank" flat icon="open_in_new" /> -->
          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?domain=' + props.row.domain" flat icon="open_in_new" />
        </q-td>

        <q-td key="host" :props="props">
          {{ props.row.host }}

          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?host=' + props.row.host" flat icon="open_in_new" />
        </q-td>

        <q-td key="path" :props="props">
          {{ props.row.path }}

          <q-btn v-on:click="destroy_pipelines()" :to="'/logs/web/filter/?path=' + props.row.path" flat icon="open_in_new" />
        </q-td>
      </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:filter:periodical')

import { date } from 'quasar'

import DataSourcesMixin from '@mixins/dataSources'
import chartTabular from '@components/chart.tabular'

import JSPipeline from 'js-pipeline'

import PeriodicalPipeline from '@apps/logs/web/pipelines/filter/periodical'

import * as PeriodicalSources from '@apps/logs/web/sources/filter/periodical/index'

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

  name: 'LogsWebFilterPeriodical',

  _logsWebFilterPeriodical_components: {
    range: {
      source: {
        requests: PeriodicalSources.requests
        // store: store
      }
    }
  },

  data () {
    return {
      id: 'logs.web.filter.periodical',
      path: 'all',

      top: 15,

      periodical: {
        range: { start: 0, end: 0},

        top_city_counter: {},
        top_country_counter: {},

        logs: [],

        total_bytes_sent: 0,
        hits: 0,

        current_bytes_sent: 0,

        status_counter: {},

        city_counter: {},
        country_counter: {},
        continent_counter: {},
        world_map_cities: [],

        addr_counter: {},
        user_counter: {},
        referer_counter: {},
        type_counter: {},

        user_agent_os_counter: {},
        user_agent_os_family_counter: {},
        user_agent_engine_counter: {},
        user_agent_browser_counter: {},
        user_agent_device_counter: {}

      },

      store: false,
      // pipeline_id: 'input.logs.web.filter',
      pipeline_id: [
        'input.logs.web.filter.periodical',
      ],

      // logs: [],

      search_filter: '',
      loading_logs: true,
      allColumns: ['date', 'log', 'domain', 'host', 'path'],
      visibleColumns: ['log'],
      pagination: {
        rowsPerPage: 10
      },

      columns: [
        // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: 'timestamp',
          sortable: true
        },
        {
          name: 'log',
          required: true,
          label: 'Log',
          align: 'left',
          field: 'log',
          sortable: true
        },
        {
          name: 'domain',
          required: true,
          label: 'Domain',
          align: 'left',
          field: 'domain',
          sortable: true
        },
        { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
        // {
        //   name: 'timestamp',
        //   align: 'left',
        //   label: 'Last Update',
        //   field: 'timestamp',
        //   sortable: true
        // },
        { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
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
    }
  },

  methods: {
    end: function () {
      // if (this.current_day === undefined) {
      return Date.now()
      // } else {
      // return this.current_day
      // }
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

      const pipelines = [PeriodicalPipeline]
      Array.each(pipelines, function (Pipeline) {
        let template = Object.clone(Pipeline)

        debug('create_pipelines template %o', template)

        let pipeline_id = template.input[0].poll.id
        if (!create_id || create_id === undefined || create_id === pipeline_id) {
          // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
          Array.each(template.input[0].poll.conn, function (conn, index) {
            template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterPeriodical_components, pipeline_id)
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

  }

}
</script>
