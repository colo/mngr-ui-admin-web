<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="text-grey-4 db-toolbar" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftShown = !leftShown" />

        <!-- <q-btn dense flat icon="img:dblogo.png" type="a" href="https://dashblocks.io" target="_blank" /> -->

        <!-- <q-toolbar-title v-if="!smallScreen" style="padding-left: 4px;">
          dashblocks.io
        </q-toolbar-title> -->

        <q-space></q-space>

        <q-btn
          v-if="smallScreen"
          :text-color="showSearchToolbar ? 'primary' : ''"
          dense
          unelevated
          icon="search"
          class="q-ma-xs"
          @click="showSearchToolbar = !showSearchToolbar"
        ></q-btn>

        <!-- <q-input v-if="!smallScreen" :dark="true" v-model="searchQuery" debounce="500" dense filled placeholder="Search" clearable class="col-md-3">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input> -->

        <!-- <q-btn dense unelevated icon="mdi-bell" class="q-ma-xs">
          <q-badge color="red" floating>5</q-badge>
          <q-menu v-model="messagesOpen">
            <messages @close="messagesOpen = false"></messages>
          </q-menu>
        </q-btn> -->

        <q-btn-dropdown dense unelevated v-model="settingsOpen" dropdown-icon="settings" class="ub-btn-dropdown-bare q-ma-xs">
          <settings @close="settingsOpen = false"></settings>
        </q-btn-dropdown>

        <!-- <q-btn-dropdown unelevated v-model="userInfoOpen" no-caps>
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar size="sm">
                <img src="images/avatars/male/1.png" />
              </q-avatar>
              <div class="text-center q-pa-sm">
                John Smith
              </div>
            </div>
          </template>
          <user-info></user-info>
        </q-btn-dropdown> -->
      </q-toolbar>
      <q-toolbar v-if="smallScreen && showSearchToolbar">
        <q-input :dark="true" v-model="searchQuery" debounce="500" dense filled placeholder="Search" clearable class="full-width">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <menu-drawer v-model="leftShown" :mini.sync="menuMini" :auto-expand="menuAutoExpand">
      <template v-slot:menu>
        <menu-list :menu-items="menuItems" v-on:expansionItemClick="menuMini = false"></menu-list>
      </template>
    </menu-drawer>

    <q-page-container>
      <transition :name="transitionName">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import MenuDrawer from '@dashblocks-template/src/components/menu/menudrawer.vue'
import MenuList from '@dashblocks-template/src/components/menu/menulist.vue'
import Settings from '@dashblocks-template/src/components/settings/settings.vue'
import UserInfo from '@dashblocks-template/src/components/user/userinfo.vue'
import Messages from '@dashblocks-template/src/components/user/messages.vue'

export default {
  name: 'MainLayout',
  components: {
    MenuDrawer,
    MenuList,
    Settings,
    UserInfo,
    Messages
  },
  data () {
    return {
      leftShown: true,
      rightShown: false,
      settingsOpen: false,
      messagesOpen: false,
      userInfoOpen: false,
      showSearchToolbar: false,
      searchQuery: '',
      transitionName: '',
      testColors: null,
      menuItems: [
        {
          id: '1',
          title: 'Logs',
          link: '/logs',
          icon: 'web',
          // items: [
          //   { icon: 'web', title: 'Web', link: '/logs/web'},
          //   { icon: 'search', title: 'Educativa', link: '/logs/educativa'}
          // ]
        },
        {
          id: '2',
          icon: 'person',
          title: 'System',
          link: '/system',
          items: [
            { icon: 'person', title: 'Hosts', link: '/system/hosts'},
            { icon: 'search', title: 'Categories', link: '/system/categories'}
          ]
        },
        {
          id: '3',
          icon: 'star_border',
          title: 'Munin',
          link: '/munin',
          items: [
            { icon: 'person', title: 'Hosts', link: '/munin/hosts'},
            { icon: 'search', title: 'Categories', link: '/munin/categories'}
          ]
        },
        { id: '4', icon: 'search', title: 'Vhosts', link: '/vhosts'},
        {
          id: '5',
          title: 'Educativa',
          icon: 'search',
          items: [
            { icon: 'search', title: 'Checks', link: '/checks'},
            { icon: 'search', title: 'Alerts', link: '/alerts'}
          ]
        },
        // { id: '1', title: 'Dashboard', link: '/', icon: 'dashboard' },
        // {
        //   id: 'observability',
        //   title: 'Observability Dashboards',
        //   icon: 'mdi-eye-check',
        //   caption: 'Monitor your Microservices',
        //   items: [
        //     { id: 'summary', title: 'Summary', link: '/summary', caption: 'Microservice Status', icon: 'mdi-chart-line-variant' },
        //     { id: 'requests', title: 'Requests', link: '/requests', icon: 'sync_alt', badge: '2070', badgeColor: 'accent' },
        //     { id: 'errors', title: 'Errors', link: '/errors', icon: 'error', caption: 'Errors Trend', badge: '10.62%', badgeColor: 'negative' },
        //     { id: 'apiop', title: 'API Operation', link: '/apiop', icon: 'settings_ethernet', caption: 'API Operation Scorecard' }
        //   ]
        // },
        // // { id: '3', title: 'Forms', link: '/forms', icon: 'mdi-playlist-edit' },
        // {
        //   id: '4',
        //   title: 'Tables',
        //   icon: 'mdi-table',
        //   items: [
        //     { id: 'quasartable', title: 'Quasar Tables', link: '/quasartable', icon: 'sync_alt' },
        //     { id: 'vgt', title: 'Vue-Good-Table', link: '/vgt', icon: 'sync_alt' }
        //   ]
        // },
        // {
        //   id: '5',
        //   title: 'Charts',
        //   icon: 'pie_chart',
        //   items: [
        //     { id: 'chartjs', title: 'Chart.js', link: '/chartjs', icon: 'mdi-chart-bar' },
        //     { id: 'dygraphs', title: 'Dygraphs', link: '/dygraphs', icon: 'mdi-chart-line' }
        //   ]
        // },
        // {
        //   id: '6',
        //   title: 'Style',
        //   icon: 'mdi-draw',
        //   items: [
        //     { id: '7', title: 'Typography', link: '/typography', icon: 'mdi-format-text' },
        //     { id: '8', title: 'Icons', link: '/icons', icon: 'mdi-dots-horizontal-circle-outline' },
        //     {
        //       id: '9',
        //       title: 'MDI Icons',
        //       caption: 'Material Design Icons',
        //       link: '/mdi',
        //       icon: 'mdi-dots-horizontal-circle-outline',
        //       badge: '5045',
        //       badgeColor: 'accent',
        //       sideCaption: 'icons'
        //     }
        //   ]
        // },
        // {
        //   id: 'pages',
        //   title: 'Pages',
        //   icon: 'mdi-link-box-outline',
        //   items: [{ id: '7', title: 'Login', link: '/login', icon: 'mdi-login' }]
        // }

        /*
        { title: 'Requests', link: '/requests', icon: 'sync_alt' },
        { title: 'Errors', link: '/errors', icon: 'error' },
        { title: 'API', link: '/api', icon: 'code' },
        { title: 'API Operation', link: '/apiop', icon: 'settings_ethernet' },
        { title: 'API Responses', link: '/apiresponses', icon: 'pie_chart' },
        { title: 'Rates & Durations', link: '/rates', icon: 'schedule' },
        { title: 'Payload', link: '/payload', icon: 'swap_vert' },
        { title: 'Last Errors', link: '/lasterrors', icon: 'error_outline' },
        { title: 'Longest Requests', link: '/longestrequests', icon: 'hourglass_empty' }
        */
      ]
    }
  },
  computed: {
    ...mapState({
      menuAutoExpand: state => state.layout.menuAutoExpand
    }),
    dark: {
      get () {
        return this.$store.state.layout.dark
      },
      set (value) {
        this.setDark({ dark: value })
      }
    },
    menuMini: {
      get () {
        return this.$store.state.layout.menuMini
      },
      set (value) {
        this.setMenuMini({ menuMini: value })
      }
    },
    smallScreen () {
      return ['xs', 'sm'].includes(this.$q.screen.name)
    }
  },
  watch: {
    dark: {
      handler: function (val) {
        this.$q.dark.set(val)
      }
    }
  },
  mounted () {
    // this.initialize()
    this.$q.dark.set(this.dark)
  },
  methods: {
    ...mapActions({
      setDark: 'layout/setDark',
      setMenuMini: 'layout/setMenuMini'
    }),
    // initialize () {
    //
    // }
  }
}
</script>
<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
