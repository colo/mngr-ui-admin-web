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
            <q-breadcrumbs-el label="Filter" v-if="filterType"/>
            <q-breadcrumbs-el :label="filterType +':'+ web" v-if="filterType && web" />
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
        <q-tab-panel name="periodical">
          <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.periodical'" -->
          <logs-web-filter-periodical/>
        </q-tab-panel>

        <q-tab-panel name="minute">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'" -->
          <!-- <logs-web-filter-minute/> -->
          <logs-web-filter-historical :type="'minute'"/>
        </q-tab-panel>

        <q-tab-panel name="hour">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'" -->
          <!-- <logs-web-filter-hour/> -->
          <logs-web-filter-historical :type="'hour'"/>
        </q-tab-panel>

        <q-tab-panel name="day">
          <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'" -->
          <!-- <logs-web-filter-day/> -->
          <logs-web-filter-historical :type="'day'"/>
        </q-tab-panel>
      </q-tab-panels>

    </div>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]" :duration="50">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>

  </q-page>
</template>

<script>
/* eslint handle-callback-err: "off" */
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:pages:filter')

// import { date } from 'quasar'

// let moment = require('moment')

// import OsPluginDygraph from '@apps/logs/components/pluginDygraph'
// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'

import LogsWebFilterPeriodical from '@apps/logs/web/components/filter/periodical'
import LogsWebFilterHistorical from '@apps/logs/web/components/filter/historical'
// import LogsWebFilterMinute from '@apps/logs/web/components/filter/minute'
// import LogsWebFilterHour from '@apps/logs/web/components/filter/hour'
// import LogsWebFilterDay from '@apps/logs/web/components/filter/day'

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

  components: {
    LogsWebFilterPeriodical,
    LogsWebFilterHistorical,
    // LogsWebFilterMinute,
    // LogsWebFilterHour,
    // LogsWebFilterDay
  },

  name: 'LogsWebFilter',

  data () {
    return {
      id: 'logs.web.filter',
      path: 'all',

      range_tab: 'minute',

    }
  },

  created () {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.range_tab = tab
    }
  },
  watch: {

    range_tab: function (val) {
      this.$router.push({ path: this.$route.path, query: Object.merge(Object.clone(this.$route.query), { tab: val }) }).catch(err => {})// catch 'NavigationDuplicated' error
      // this.$router.push(`${this.$route.path}?tab=${val}`).catch(err => {})// catch 'NavigationDuplicated' error
    },

  },

  computed: {
    // 'filter': function () {
    //   // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
    //   return (this.$route && this.$route.query)
    //     ? this.$route.query
    //     : undefined
    // },
    // 'type': function () {
    //   return (this.filter) ? Object.keys(this.filter)[0] : undefined
    // },
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
      debug('computed filter QUERY', this.$route.query)
      const allowed_filters = ['domain', 'path', 'host']
      let filter = {}
      if (this.$route && this.$route.query) {
        Object.each(this.$route.query, function (value, prop) {
          // if (allowed_filters.indexOf(prop) > -1 && filter === undefined) filter = {}
          if (allowed_filters.indexOf(prop) > -1) filter[prop] = value
        })
      }
      debug('computed filter', filter)
      return filter
    },
    'filterType': function () {
      debug('computed type', Object.keys(this.filter))
      return (this.filter && Object.getLength(this.filter) > 0) ? Object.keys(this.filter)[0] : undefined
    },
    'web': function () {
      return (this.filter && this.filterType) ? this.filter[this.filterType] : undefined
    }
  },

}
</script>
