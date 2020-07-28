<template>
  <chart-tabular
    :wrapper="{
      type: 'amchartsWorldCityMap',
      props:{
        colorScheme: colorScheme,
        dark: dark,
        followColorScheme: false
      }
    }"
    :always_update="false"
    :ref="type+'.world_map_cities'"
    :id="type+'.world_map_cities'"
    :stat="{
      data: [
        world_map_cities
      ],
      length: 1,
      numeric: false
    }"
    :reactive="false"
    :no_buffer="false"
  >
  </chart-tabular>

</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:logs:web:components:worldCitiesMap')

import chartTabular from '@components/chart.tabular'

import { mapState } from 'vuex'

export default {
  components: { chartTabular },

  name: 'LogsWebWorldCitiesMap',

  data () {
    return {
      id: 'logs.web.world.cities.map',

    }
  },

  props: {
    world_map_cities: {
      type: Array,
      default: function () {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    },
    dark: {
      type: Boolean,
      default: false
    },
    colorScheme: {
      type: String,
      default: 'default'
    },
  }
  // computed: {
  //   ...mapState({
  //     dark: state => state.layout.dark,
  //     colorScheme: state => state.layout.dashboardColorScheme
  //   }),
  //   'filter': function () {
  //     // return (this.$route && this.$route.params && this.$route.params.web) ? this.$route.params.web : undefined
  //     return (this.$route && this.$route.query)
  //       ? this.$route.query
  //       : undefined
  //   },
  //   'type': function () {
  //     return (this.filter) ? Object.keys(this.filter)[0] : undefined
  //   },
  //   'web': function () {
  //     return (this.filter && this.type) ? this.filter[this.type] : undefined
  //   }
  // },

  // methods: {
  //   end: function () {
  //     // if (this.current_day === undefined) {
  //     return Date.now()
  //     // } else {
  //     // return this.current_day
  //     // }
  //   },
  //
  //   apply_zoom: function (data, categoryY, valueX) {
  //     const min_zoom = 0.5
  //     const max_zoom = 1
  //     /* const min_length = 8 */
  //     const max_length = 15
  //     let length = data.length
  //     /* let zoom = 1 */
  //
  //     if (data.length <= max_length) {
  //       return max_zoom
  //     } else {
  //       // let itemsWithNonZero = 0
  //       // for (let i = 0; i < max_length; i++) {
  //       //   if (data[i][valueX] > 0) {
  //       //     itemsWithNonZero++
  //       //   }
  //       // }
  //
  //       // let zoom = max_length / data.length
  //       // return (zoom > min_zoom) ? zoom : min_zoom
  //       return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
  //     }
  //   },
  //
  //   format_time: function (timestamp) {
  //     return moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
  //   },
  //   format_log: function (log) {
  //     return (log.length <= 100) ? log : log.substring(0, 96) + '...'
  //   },
  //   /**
  //   * @start pipelines
  //   **/
  //   create_pipelines: function (create_id, next) {
  //     debug('create_pipelines %o', this.$options.pipelines)
  //
  //     const pipelines = [PeriodicalPipeline]
  //     Array.each(pipelines, function (Pipeline) {
  //       let template = Object.clone(Pipeline)
  //
  //       debug('create_pipelines template %o', template)
  //
  //       let pipeline_id = template.input[0].poll.id
  //       if (!create_id || create_id === undefined || create_id === pipeline_id) {
  //         // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components[pipeline_id], pipeline_id)
  //         Array.each(template.input[0].poll.conn, function (conn, index) {
  //           template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.$options._logsWebFilterPeriodical_components, pipeline_id)
  //         }.bind(this))
  //
  //         let pipe = new JSPipeline(template)
  //
  //         this.$options.__pipelines_cfg[pipeline_id] = {
  //           ids: [],
  //           connected: [],
  //           suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
  //         }
  //
  //         // this.__after_connect_inputs(
  //         //   pipe,
  //         //   this.$options.__pipelines_cfg[pipeline_id],
  //         //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
  //         //     debug('__resume_pipeline CALLBACK')
  //         //     pipe.fireEvent('onOnce')
  //         //   }], this)
  //         // )
  //
  //         this.$options.pipelines[pipeline_id] = pipe
  //       }
  //     }.bind(this))
  //
  //     debug('create_pipelines %o', this.$options.pipelines)
  //
  //     if (next) { next() }
  //     // }
  //   },
  //
  //   /**
  //   * @end pipelines
  //   **/
  //
  // }

}
</script>
