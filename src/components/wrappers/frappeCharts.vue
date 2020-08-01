<template>
  <!-- <div
    :id="id+'-container'"
    class="netdata-container-with-legend"
    v-bind:class="container_class_helper"
  > -->
     <div
       :ref="id"
       :id="id"
       :class="chart.class"
       :style="chart.style"
     >

    </div>
    <!-- <div
    class="netdata-chart-legend"
    :id="id+'-netdata-chart-legend'"
    >
    </div> -->
  <!-- </div> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:frappeCharts')

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

import netDataColors from '@libs/netdata/colors'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'frappe-charts-wrapper',

  _frappe_charts_wrapper_defaults: {
  },

  data () {
    return {
      // values: [],
      // labels: [],
      container_class_helper: '',
      frappe: undefined,
      // chart: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  // watch: {
  //   visible: function (val) {
  //     this.container_class_helper = (val == false) ? 'invisible' : ''
  //     // console.log('class visible', val, this.container_class_helper)
  //   }
  // },
  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      let options = Object.merge(this.defaultOptions, this.chart.options)
      return options
    },
    defaultOptions: function () {
      return {
        type: 'pie'
      }
    },

  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    },
    // dark: function () {
    //   // this.optionsChanged = true
    //   // this.params = Object.merge(this.graphOptions, this.chart.options)
    //   this.create()
    //   this.update()
    // },
    // colorScheme: function () {
    //   // this.params = Object.merge(this.graphOptions, this.chart.options)
    //   this.create()
    //   this.update()
    // }
  },

  // created () {
  //   let unwatch = this.$watch('stat.data', function (val, oldVal) {
  //     /// /console.log('created', this.id, this.stat.data)
  //
  //     // if(val.length > 1 && this.chart == null){
  //     if (val.length > 1) {
  //       this._create_frappe()
  //       unwatch()
  //     }
  //   })
  // },
  methods: {
    create: function () {
      if (!this.$options['charts'][this.id].graph) {
        if (!this.$options['charts'][this.id]) {
          this.$options['charts'][this.id] = {}
        }

        this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], Object.clone(this.$options._frappe_charts_wrapper_defaults))
        this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(this.chart.options)
        // this.$options.charts[this.id].__unwatch_options = this.$watch('chart.options', function (val) {
        //   // this.$options.charts[this.id].chart_options = this.graphOptions // Object.clone(val)
        //   this.create()
        // })//, { deep: true }

        if (document.getElementById(this.id)) {
          let data = this.handle_data(this.get_data())
          this.$options.charts[this.id].chart_options.data = data

          debug('create', this.id, this.$options.charts[this.id].chart_options)

          this.$options['charts'][this.id].graph = new Chart(
            document.getElementById(this.id), // containing div
            this.$options.charts[this.id].chart_options
          )

          if (this.chart.init) { this.chart.init(this, this.$options.charts[this.id].graph, 'frappe') }
        }

        // this.$options['charts'][this.id] = Object.merge(this.$options['charts'][this.id], this.defaultOptions)

        // let newData = this.format_values(this.values)
        // if (newData.length > 0) {
        //   this.init_chart(newData)
        // }
      }
    },
    detroy: function () {
      // if (this.$options['charts'][this.id].chart !== undefined && this.$options['charts'][this.id].chart.clear && typeof this.$options['charts'][this.id].chart.clear === 'function') {
      //   this.$options['charts'][this.id].chart.clear()
      // }
    },
    get_data: function (data) {
      data = (data && data.length > 0) ? data : (this.chart_data && this.chart_data.length > 0 && this.chart_data[0][0]) ? this.chart_data : this.$options.charts[this.id].buffered_data
      data = JSON.parse(JSON.stringify(data))
      return data
    },
    update: function (data) {
      debug('update', this.id, data, this.$options.charts[this.id].buffered_data, this.chart_data, this.get_data(data))
      let last = this.get_data(data).getLast()
      if (last.labels) {
        this.$options.charts[this.id].graph.update(this.handle_data(last))
      } else {
        this.$options.charts[this.id].graph.update(this.handle_data(this.get_data(data)))
      }
      // this.handle_data(this.get_data(data).getLast())
      if (data && data.length > 0) {
        this.$options.charts[this.id].buffered_data = Array.clone(data)
      }
    },
    handle_data: function (value) {
      let data = {labels: [], datasets: []}
      if (value && value.labels && value.datasets) {
        data = value
      } else if (this.$options.charts[this.id].chart_options.labels) {
        data.labels = this.$options.charts[this.id].chart_options.labels
        data.datasets = value
      }

      return data
    }
    // _create_frappe () {
    //   let options = Object.clone(this.graphOptions)
    //
    //   this.frappe = new Chart(
    //     document.getElementById(this.id), // containing div
    //     options
    //   )
    //
    //
    //   if (this.chart.init) { this.chart.init(this, this.chart, 'frappe') }
    // },
    // update () {
    //   let data = {
    //     labels: [],
    //     datasets: []
    //   }
    //
    //   // const skip = 15
    //   Array.each(this.stat.data, function (column, index) {
    //     // if(index == 0 || (index % skip == 0)){
    //
    //     data.labels.push(new Date(column[0]).toLocaleTimeString())
    //
    //     Array.each(column, function (value, value_index) {
    //       if (value_index != 0) {
    //         if (!data.datasets[value_index - 1]) {
    //           data.datasets[value_index - 1] = {
    //             name: this.chart.options.data.datasets[value_index - 1].name,
    //             chartType: this.chart.options.data.datasets[value_index - 1].chartType,
    //             values: []
    //           }
    //         }
    //
    //         data.datasets[value_index - 1].values.push(parseFloat((value.toFixed) ? value.toFixed(2) : value))
    //       }
    //     }.bind(this))
    //
    //     // }
    //   }.bind(this))
    //
    //   // console.log(data)
    //   this.chart.update(data)
    // },

  }
}
</script>
