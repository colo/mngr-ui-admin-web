
<script>

let data_to_tabular = require('node-tabular-data').data_to_tabular

import * as Debug from 'debug'
const debug = Debug('components:chart')

import graph from '@mixins/graph'
import stat from '@mixins/stat'

export default {
  mixins: [graph, stat],

  // _chart_componets_defaults: {
  //   tabular: {
  //     lastupdate: 0,
  //     data: []
  //   }
  // },

  name: 'chart',

  charts: {},

  _chart_component_defaults: {
    type: 'stat'
  },
  // updated () {
  //   if(this.stat.data.length > 0)
  //     this.__process_stat(this.chart, this.id, this.stat.data)
  // },
  methods: {
    create () {
      debug('create', this.id)
      if (!this.$options['charts'][this.id]) {
        this.$options['charts'][this.id] = {}
      }

      this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._chart_component_defaults))
    },

    __update_data: function (data) {
      debug('__update_data %s %o %o', this.id, data, this.chart_init)

      if (data && data.length > 0) {
        // if(this.$options.__chart_init ==== false){
        if (this.chart_init === false) {
          this.__process_stat(this.chart, this.id, data)
          data_to_tabular(data, this.chart, this.id, (name, data) => this.update_chart_stat(name, data, true))
        } else {
          data_to_tabular(data, this.chart, this.id, this.update_chart_stat.bind(this))
        }
      }
    },
    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_stat (chart, name, stat) {
      debug('__process_stat', this.id)
      // console.log('__process_stat', name, stat)
      if (!Array.isArray(stat)) { stat = [stat] }

      if (isNaN(stat[0].value)) {
        // sdX.stats.

        let filtered = false
        if (chart.watch && chart.watch.filters) {
          Array.each(chart.watch.filters, function (filter) {
            let prop_to_filter = Object.keys(filter)[0]
            let value_to_filter = filter[prop_to_filter]

            if (
              stat[0].value[prop_to_filter] &&
              value_to_filter.test(stat[0].value[prop_to_filter]) === true
            ) {
              filtered = true
            }
          })
        } else {
          filtered = true
        }

        if (filtered === true && typeof chart.pre_process === 'function') {
          chart = chart.pre_process(chart, name, stat)

          this.__process_chart(chart, name, stat)
        }
      } else {
        if (typeof chart.pre_process === 'function') {
          chart = chart.pre_process(chart, name, stat)
        }

        this.__process_chart(chart, name, stat)
      }
    },

    /**
    * copied to mngr-ui-admin-app/os
    **/
    __process_chart (chart, name, stat) {
      debug('__process_chart', this.id)

      /// ///console.log('__process_chart', this.stat_data, name, stat)

      if (chart.init && typeof chart.init === 'function') {
        chart.init(this, chart, name, stat, 'chart')
        // this.$set(this, 'chart_init', true)
      }
      // else {
      this.$set(this, 'chart_init', true)
      // }

      /**
      * first update
      **/
      // if(this.stat_data.length > 0){
      // if (stat.length > 0) {
      //   data_to_tabular(stat, chart, name, this.update_chart_stat.bind(this))
      // }

      // this.__create_watcher(name, chart)
    }

    // __create_watcher(name, chart){
    //   let watcher = chart.watch || {}
    //
    //   watcher.value = watcher.value || ''
    //   watcher.transform = watcher.transform || ''
    //
    //   if(this.$options.__data_unwatcher){
    //     this.$options.__data_unwatcher()
    //     this.$options.__data_unwatcher === undefined
    //   }
    //
    //   let generic_data_watcher = function(current){
    //     ////console.log('generic_data_watcher...', name, current)
    //     if(current){
    //       // current = Array.clone(current)
    //       // if(this.$options.visible){
    //         // if(chart.watch && chart.watch.cumulative === true){//send all values
    //           ////////console.log('generic_data_watcher send all', name)
    //           data_to_tabular(current, chart, name, this.update_chart_stat.bind(this))
    //         // }
    //         // else{//send last only
    //         //   // //////console.log('generic_data_watcher send last', name, current)
    //         //   data_to_tabular([ current[current.length - 1] ], chart, name, this.update_chart_stat.bind(this))
    //         // }
    //
    //       // }
    //     }
    //   }
    //
    //   ////////console.log('gonna watch...', name, this.stat.data)
    //
    //   // this.$options.__data_unwatcher = this.$watch('stat_data', generic_data_watcher)
    //   this.$on('stat_data', generic_data_watcher)
    //
    // },

    // generic_data_watcher: data_to_tabular,

  }
}
</script>
