<template>
  <q-page>
    <div class="q-pa-md">
      <div class="bg-primary text-white">
        <q-toolbar >
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" to="/"/>
            <q-breadcrumbs-el label="Munin" :to="{name : 'munin'}"/>
            <q-breadcrumbs-el label="Categories" v-bind="(!category) ? {'disabled' : true} : ''" :to="{name : 'munin_categories'}"/>
            <q-breadcrumbs-el :label="category" v-if="category" />
          </q-breadcrumbs>
        </q-toolbar>
        <!-- <q-toolbar>
          <q-btn flat class="q-mr-xs" label="Hosts" :to="{name : 'munin_hosts'}"/>
          <q-btn flat class="q-mr-xs" label="Categories" :to="{name : 'munin_categories'}"/>
        </q-toolbar> -->
      </div>

      <template v-for="(category_hosts, category_name) in categories_paths">
        <system-category-card
          :key="category_name"
          v-if="!category || category_name === category"
          :hosts="category_hosts"
          :category="category_name"
        />
      </template>

      <router-view :key="$route.path +'.'+ JSON.stringify($route.query)"></router-view>

      <template v-for="(category_hosts, category_name) in categories_paths">
        <system-category-card
          :key="category_name+'.bottom'"
          v-if="category_name === category"
          :hosts="category_hosts"
          :category="category_name"
        />
      </template>
    </div>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]" :duration="50">
      <q-btn fab icon="keyboard_arrow_up" color="primary" />
    </q-page-scroller>

  </q-page>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:pages:categories')

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/categories'

import DataSourcesMixin from '@mixins/dataSources'

import SystemCategoryCard from '@apps/munin/components/categoryCard.vue'

import { requests, store } from '@apps/munin/sources/categories/index'

export default {
  mixins: [DataSourcesMixin],
  components: { SystemCategoryCard },
  // extends: DataSourcesMixin,

  name: 'MuninCategories',

  // pipelines: {},
  // __pipelines_cfg: {},
  // unwatch_store: undefined,

  data () {
    return {
      height: '0px',

      // category: undefined,
      categories_paths: {},
      paths: [],
      /**
      * dataSources
      **/
      store: false,
      pipeline_id: 'input.munin.categories',

      id: 'munin.categories',
      path: 'all',

      components: {
        'all': [
          {
            source: {
              requests: requests

              // store: store
            }
          }

        ]
      }
    }
  },
  computed: {
    'category': function () {
      return (this.$route && this.$route.params && this.$route.params.category) ? this.$route.params.category : undefined
    }
  },
  methods: {
    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', this.$options.pipelines)

      if (this.$options.pipelines['input.munin.categories'] && this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories')) {
        // let requests = this.__components_sources_to_requests(this.components)
        // if (requests.once) {
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].options.requests.once.combine(requests.once)
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // }
        //
        // if (requests.periodical) {
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
        //   this.$options.pipelines['input.munin.categories'].get_input_by_id('input.munin.categories').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
        // }
      } else {
        let template = Object.clone(Pipeline)

        let pipeline_id = template.input[0].poll.id

        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
        Array.each(template.input[0].poll.conn, function (conn, index) {
          template.input[0].poll.conn[index].requests = this.__components_sources_to_requests(this.components)
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

        debug('create_pipelines %o', this.$options.pipelines)

        if (next) { next() }
      }
    }

    /**
    * @end pipelines
    **/

  }
}
</script>
