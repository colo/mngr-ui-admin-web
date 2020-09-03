<template>
  <!-- <q-page :key="$route.path +'.'+ JSON.stringify($route.query)+'.page'"> -->
  <q-page>
    <div class="q-pa-md">
      <div class="bg-primary text-white">
        <q-toolbar >
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" to="/"/>
            <q-breadcrumbs-el label="Logs" :to="{name : 'logs'}"/>
            <q-breadcrumbs-el label="Qmail" :to="{name : 'logs_qmail'}"/>
            <q-breadcrumbs-el label="Filter" v-if="filterType"/>
            <q-breadcrumbs-el :label="filterType +':'+ qmail" v-if="filterType && qmail" />
          </q-breadcrumbs>
        </q-toolbar>
        <logs-toolbar/>
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
          <logs-qmail-filter-periodical/>
        </q-tab-panel>

        <q-tab-panel name="minute">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.minute'" -->
          <!-- <logs-qmail-filter-minute/> -->
          <logs-qmail-filter-historical :type="'minute'"/>
        </q-tab-panel>

        <q-tab-panel name="hour">
           <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.hour'" -->
          <!-- <logs-qmail-filter-hour/> -->
          <logs-qmail-filter-historical :type="'hour'"/>
        </q-tab-panel>

        <q-tab-panel name="day">
          <!-- :key="$route.path +'.'+ JSON.stringify($route.query)+'.day'" -->
          <!-- <logs-qmail-filter-day/> -->
          <logs-qmail-filter-historical :type="'day'"/>
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
const debug = Debug('apps:logs:qmail:pages:filter')

import LogsToolbar from '@apps/logs/components/toolbar.vue'

// import { date } from 'quasar'

// let moment = require('moment')

// import OsPluginDygraph from '@apps/logs/components/pluginDygraph'
// import amchartsBarRace from '@components/wrappers/amchartsBarRace'

// import DataSourcesMixin from '@mixins/dataSources'
// import chartTabular from '@components/chart.tabular'

import LogsQmailFilterPeriodical from '@apps/logs/qmail/components/filter/periodical'
import LogsQmailFilterHistorical from '@apps/logs/qmail/components/filter/historical'
// import LogsQmailFilterMinute from '@apps/logs/qmail/components/filter/minute'
// import LogsQmailFilterHour from '@apps/logs/qmail/components/filter/hour'
// import LogsQmailFilterDay from '@apps/logs/qmail/components/filter/day'

// import JSPipeline from 'js-pipeline'
//
// import PeriodicalPipeline from '@apps/logs/qmail/pipelines/filter/periodical'
// import MinutePipeline from '@apps/logs/qmail/pipelines/filter/minute'
// import HourPipeline from '@apps/logs/qmail/pipelines/filter/hour'
// import DayPipeline from '@apps/logs/qmail/pipelines/filter/day'
//
// import * as PeriodicalSources from '@apps/logs/qmail/sources/filter/periodical/index'
// import * as MinuteSources from '@apps/logs/qmail/sources/filter/minute/index'
// import * as HourSources from '@apps/logs/qmail/sources/filter/hour/index'
// import * as DaySources from '@apps/logs/qmail/sources/filter/day/index'

// import { requests, store } from '@apps/logs/qmail/sources/filter/index'

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
    LogsToolbar,
    LogsQmailFilterPeriodical,
    LogsQmailFilterHistorical,
    // LogsQmailFilterMinute,
    // LogsQmailFilterHour,
    // LogsQmailFilterDay
  },

  name: 'LogsQmailFilter',

  data () {
    return {
      id: 'logs.qmail.filter',
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
    //   // return (this.$route && this.$route.params && this.$route.params.qmail) ? this.$route.params.qmail : undefined
    //   return (this.$route && this.$route.query)
    //     ? this.$route.query
    //     : undefined
    // },
    // 'type': function () {
    //   return (this.filter) ? Object.keys(this.filter)[0] : undefined
    // },
    'filter': function () {
      // return (this.$route && this.$route.params && this.$route.params.qmail) ? this.$route.params.qmail : undefined
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
    'qmail': function () {
      return (this.filter && this.filterType) ? this.filter[this.filterType] : undefined
    }
  },

}
</script>
