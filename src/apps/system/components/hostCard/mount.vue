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
      :ref="host+'.'+mount+'.used'"
      :id="host+'.'+mount+'.used'"
      :stat="{
        data: [used],
        length: 1
      }"
      :chart="{
        class: 'netdata-chart netdata-easypiechart-chart',
        params:{
          'bar-color': barColor,
          'size': 150,
          'title': 'Used: '+ mount,
          /* unit: 'kilobits/s', */
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
const debug = Debug('apps:system:components:hostCard:mount')

import chartTabular from '@components/chart.tabular'

import dbColors from '@dashblocks/src/components/dbcolors'

export default {
  components: { chartTabular },

  name: 'HostCardMount',

  // data () {
  //   return {
  //     barColor: dbColors.getColors(this.$store.state.layout.dark, this.$store.state.layout.dashboardColorScheme)[3]
  //
  //   }
  // },
  computed: {
    // Augment passed options with defaults for Dygraphs
    barColor: function () {
      return dbColors.getColors(this.$store.state.layout.dark, this.$store.state.layout.dashboardColorScheme)[3]
    }
  },

  props: {
    host: {
      type: String,
      default: ''
    },
    used: {
      type: Number,
      default: 0
    },
    mount: {
      type: String,
      default: ''
    },
  },
}

</script>
