<template>
  <div
    :class="chart.class"
    :style="chart.style"
  >
    <!-- linear-gauge | radial-gauge -->
    <trend
      :ref="id"
      :id="id"
      :data="values"
      v-bind="graphOptions"
    >
    </trend>

  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:wrappers:vueTrend')

import Trend from 'vuetrend'

import chartWrapperMixin from '@mixins/chartWrapper.vue'

// import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  mixins: [chartWrapperMixin],

  name: 'vue-trend-wrapper',

  _vuetrend_wrapper_defaults: {
    // autoDrawDuration: 1000, // 2000
    autoDrawEasing: 'ease',
    // gradient: ['#6fa8dc', '#42b983', '#2c3e50'],
    // padding: 8,
    // radius: 10, // 100
    smooth: true,
    // strokeWidth: 50
    gradientDirection: 'top',
    gradient: ['#b8f2e6', '#6fa8dc', '#42b983'],
    // padding: 12,
    // radius: 8,
    // strokeWidth: 10,
    // strokeLinecap: 'butt'
  },

  components: {
    Trend
  },

  // chart: null,
  freezed: false,

  // props: {
  //   EventBus: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //   id: {
  //     type: [String],
  //     default: () => ('')
  //   },
  //   chart: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   stat: {
  //     type: [Object],
  //     default: () => ({})
  //   },
  //
  //   freezed: {
  //     type: [Boolean],
  //     default: () => (false)
  //   },
  //   visible: {
  //     type: [Boolean],
  //     default: () => (true)
  //   },
  // },
  data () {
    return {
      values: [],
      // container_class_helper: '',
      // chart: null,
      // highlighted: false,
      // ready: false,
      // to_suspend: false,
    }
  },
  watch: {
    visible: function (val) {
      this.container_class_helper = (val === false) ? 'invisible' : ''
      // console.log('class visible', val, this.container_class_helper)
    }
  },

  computed: {
    // Augment passed options with defaults for Dygraphs
    graphOptions: function () {
      return Object.merge(Object.clone(this.$options._vuetrend_wrapper_defaults), this.chart.options)
    },
  },
  // created () {
  //   this.chart = this
  // },
  methods: {

    update (data) {
      debug('update', data, this.get_data(data))

      this.values = this.get_data(data)

      // console.log('update', this.$refs[this.id].)
      // this.$refs[this.id].$data.chart.options['value'] = this.stat.data.getLast()[1]
    },

    // update () {
    //   this.$set(this, 'values', [])
    //
    //   Array.each(this.stat.data, function (data) {
    //     this.values.push(data[1])
    //   }.bind(this))
    //
    //   // console.log('this.values', this.values)
    // },
    // updateOptions (options, block_redraw){
    //
    //   let self = this
    //
    //   if(this.highlighted == false && this.ready == true
    //     // && this.$options.freezed <= 2//needed number of iterations to update data 'onRange'
    //     // && this.freezed == false
    //   ){
    //
    //       this.chart.updateOptions(
    //         Object.merge(
    //           {
    //             'file': self.stat.data
    //           },
    //           options
    //         ),
    //         block_redraw
    //       );
    //
    //       this.chart.setSelection(this.chart.numRows() - 1, {}, false)
    //
    //
    //   }
    //
    // }
  }
}
</script>
