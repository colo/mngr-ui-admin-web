<template>
  <!-- <div class="col"> -->
    <component
      :is="'chart-tabular'"
      :wrapper="{
        type: 'vueEasyPieChart',
        props: {
          colorScheme: $store.state.layout.dashboardColorScheme,
          dark: $store.state.layout.dark
        }
      }"
      :always_update="false"
      :ref="host+'.net.in'"
      :id="host+'.net.in'"
      :stat="{
        data: [[
          Date.now(),
          net / 125, //value
          (100 * net / net_max) || 0, //percent
          net_max / 125 || 0 //max
        ]],
        length: 1
      }"
      :chart="{
        class: 'netdata-chart netdata-easypiechart-chart',
        params:{
          'bar-color': barColor,
          'size': 150,
          title: 'Net Inbound',
          unit: 'kilobits/s',
          animate: { duration: 900, enabled: true }
        }
      }"
      :reactive="false"
      :no_buffer="false"
    >
    </component>
    <!-- <vue-easy-pie-chart-wrapper
      :id="host+'.'+mount+'.used'"
      :chart="{
        class: 'netdata-chart netdata-easypiechart-chart',
        params:{
          'bar-color': '#AD69AD',
          'size': 150,
          'percent': used || 0,
          'title': 'Used: '+ mount,
          /* unit: 'kilobits/s', */
        }
      }"
    /> -->
  <!-- </div> -->
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('apps:system:components:hostCard:netIn')

import chartTabular from '@components/chart.tabular'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  components: { chartTabular },

  name: 'HostCardNetIn',

  // data () {
  //   return {
  //     barColor: dbColors.getColors(this.$store.state.layout.dark, this.$store.state.layout.dashboardColorScheme)[3]
  //
  //   }
  // },
  computed: {
    // Augment passed options with defaults for Dygraphs
    barColor: function () {
      return dbColors.getColors(this.$store.state.layout.dark, this.$store.state.layout.dashboardColorScheme)[1]
    }
  },

  props: {
    host: {
      type: String,
      default: ''
    },
    net: {
      type: Number,
      default: 0
    },
    net_max: {
      type: Number,
      default: 0
    },
  },
}

</script>
