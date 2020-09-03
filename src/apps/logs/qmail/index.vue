<template>
  <router-view :key="$route.path +'.'+ JSON.stringify($route.query)"></router-view>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:system:pages:qmail')

// import JSPipeline from 'js-pipeline'
// import Pipeline from '@apps/logs/pipelines/qmail'
//
// import DataSourcesMixin from '@mixins/dataSources'
//
// // import LogsWebCard from '@apps/logs/components/qmailCard.vue'
//
// import { requests, store } from '@apps/logs/sources/qmail/index'

export default {
  // mixins: [DataSourcesMixin],
  // components: { LogsWebCard },
  // extends: DataSourcesMixin,

  name: 'LogsWebs',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px'

      // qmail: [],
      //
      // filter: '',
      // loading: true,
      // allColumns: ['domain', 'host', 'path'],
      // visibleColumns: ['domain'],
      // pagination: {
      //   rowsPerPage: 50
      // },
      //
      // columns: [
      //   // { name: 'schema', label: 'Schema', field: 'schema', sortable: true, align: 'left' },
      //   {
      //     name: 'domain',
      //     required: true,
      //     label: 'Domain',
      //     align: 'left',
      //     field: 'domain',
      //     sortable: true
      //   },
      //   { name: 'host', align: 'left', label: 'Host', field: 'host', sortable: true },
      //   // {
      //   //   name: 'timestamp',
      //   //   align: 'left',
      //   //   label: 'Last Update',
      //   //   field: 'timestamp',
      //   //   sortable: true
      //   // },
      //   { name: 'path', align: 'left', label: 'Type', field: 'path', sortable: true }
      // ],
      //
      // // qmail: undefined,
      // // qmail_paths: {},
      // // paths: [],
      // /**
      // * dataSources
      // **/
      // store: false,
      // pipeline_id: 'input.logs.qmail',
      //
      // id: 'logs.qmail',
      // path: 'all',
      //
      // components: {
      //   'all': [
      //     {
      //       source: {
      //         requests: requests
      //
      //         // store: store
      //       }
      //     }
      //
      //   ]
      // }
    }
  },
  // computed: {
  //   'qmail': function () {
  //     return (this.$route && this.$route.params && this.$route.params.qmail) ? this.$route.params.qmail : undefined
  //   }
  // },
  // computed: {
  //   'qmail': function () {
  //     // return (this.$route && this.$route.params && this.$route.params.qmail) ? this.$route.params.qmail : undefined
  //     return (this.$route && this.$route.query)
  //       ? (this.$route.query.domain) ? this.$route.query.domain : (this.$route.query.host) ? this.$route.query.host : this.$route.query.path
  //       : undefined
  //   }
  // },
  methods: {
    /**
    * @start pipelines
    **/
    // create_pipelines: function (next) {
    //   debug('create_pipelines %o', this.$options.pipelines)
    //
    //   if (this.$options.pipelines['input.logs.qmail'] && this.$options.pipelines['input.logs.qmail'].get_input_by_id('input.logs.qmail')) {
    //     // let requests = this.__components_sources_to_requests(this.components)
    //     // if (requests.once) {
    //     //   this.$options.pipelines['input.logs.qmail'].get_input_by_id('input.logs.qmail').conn_pollers[0].options.requests.once.combine(requests.once)
    //     //   this.$options.pipelines['input.logs.qmail'].get_input_by_id('input.logs.qmail').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
    //     // }
    //     //
    //     // if (requests.periodical) {
    //     //   this.$options.pipelines['input.logs.qmail'].get_input_by_id('input.logs.qmail').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
    //     //   this.$options.pipelines['input.logs.qmail'].get_input_by_id('input.logs.qmail').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
    //     // }
    //   } else {
    //     let template = Object.clone(Pipeline)
    //
    //     let pipeline_id = template.input[0].poll.id
    //
    //     template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
    //
    //     let pipe = new JSPipeline(template)
    //
    //     this.$options.__pipelines_cfg[pipeline_id] = {
    //       ids: [],
    //       connected: [],
    //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
    //     }
    //
    //     // this.__after_connect_inputs(
    //     //   pipe,
    //     //   this.$options.__pipelines_cfg[pipeline_id],
    //     //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
    //     //     debug('__resume_pipeline CALLBACK')
    //     //     pipe.fireEvent('onOnce')
    //     //   }], this)
    //     // )
    //
    //     this.$options.pipelines[pipeline_id] = pipe
    //
    //     debug('create_pipelines %o', this.$options.pipelines)
    //
    //     if (next) { next() }
    //   }
    // }

    /**
    * @end pipelines
    **/

  }
}
</script>
