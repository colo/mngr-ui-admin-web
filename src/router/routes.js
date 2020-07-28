
const routes = [
  {
    path: '/',
    // component: () => import('layouts/App'),
    component: () => import('layouts/DashblocksTemplate'),
    meta: {
      breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
    },
    children: [
      {
        path: '',
        component: () => import('@apps/root/index.vue')
      },
      {
        path: '/vhosts',
        name: 'vhosts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "vhosts" */ '@apps/vhosts/index.vue'),
        meta: {
          breadcrumb: { label: 'Vhosts', icon: 'widgets', app: 'vhosts' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/checks',
        name: 'checks',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "checks" */ '@apps/checks/index.vue'),
        meta: {
          breadcrumb: { label: 'Checks', icon: 'widgets', app: 'checks' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: '/alerts',
        name: 'alerts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "alerts" */ '@apps/alerts/index.vue'),
        meta: {
          breadcrumb: { label: 'Alerts', icon: 'widgets', app: 'alerts' }
        }

        // children: [
        //   {
        //     path: ':host',
        //     name: 'Host',
        //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
        //     meta: {
        //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
        //     }
        //   }
        //   // {
        //   //   path: 'profile',
        //   //   component: () => import('pages/user-profile')
        //   // }
        // ]
      },
      {
        path: 'munin',
        name: 'munin',
        redirect: { name: 'munin_hosts' },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "munin" */ '@apps/munin/index.vue'),
        meta: {
          breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
        },

        children: [
          {
            path: 'hosts',
            name: 'munin_hosts',
            component: () => import(/* webpackChunkName: "munin.hosts" */ '@apps/munin/pages/hosts.vue'),
            meta: {
              breadcrumb: { label: 'Munin Hosts', icon: 'widgets', app: 'munin' }
            },
            children: [
              {
                path: ':host',
                name: 'munin_host',
                component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/pages/host.vue'),
                meta: {
                  breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'munin_categories',
            component: () => import(/* webpackChunkName: "munin.categories" */ '@apps/munin/pages/categories.vue'),
            meta: {
              breadcrumb: { label: 'Munin Categories', icon: 'widgets', app: 'munin' }
            },
            children: [
              {
                path: ':category',
                name: 'munin_category',
                component: () => import(/* webpackChunkName: "munin.category" */ '@apps/munin/pages/category.vue'),
                meta: {
                  breadcrumb: { label: 'Munin Category', icon: 'widgets', app: 'munin' }
                }
              }
            ]
          }

        ]
      },
      {
        path: 'system',
        name: 'system',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "system" */ '@apps/system/index.vue'),
        redirect: { name: 'system_hosts' },
        meta: {
          breadcrumb: { label: 'System', icon: 'widgets', app: 'system' }
        },

        children: [
          {
            path: 'hosts',
            name: 'system_hosts',
            component: () => import(/* webpackChunkName: "system.hosts" */ '@apps/system/pages/hosts.vue'),
            meta: {
              breadcrumb: { label: 'System Hosts', icon: 'widgets', app: 'system' }
            },
            children: [
              {
                path: ':host',
                name: 'system_host',
                component: () => import(/* webpackChunkName: "system.host" */ '@apps/system/pages/host.vue'),
                meta: {
                  breadcrumb: { label: 'System Host', icon: 'widgets', app: 'system' }
                }
              }
            ]
          },
          {
            path: 'categories',
            name: 'system_categories',
            component: () => import(/* webpackChunkName: "system.hosts" */ '@apps/system/pages/categories.vue'),
            meta: {
              breadcrumb: { label: 'System Categories', icon: 'widgets', app: 'system' }
            },
            children: [
              {
                path: ':category',
                name: 'system_category',
                component: () => import(/* webpackChunkName: "system.category" */ '@apps/system/pages/category.vue'),
                meta: {
                  breadcrumb: { label: 'System Category', icon: 'widgets', app: 'system' }
                }
              }
            ]
          }

        ]
      },
      {
        path: 'logs',
        name: 'logs',
        redirect: { name: 'logs_all' },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "logs" */ '@apps/logs/index.vue'),
        meta: {
          breadcrumb: { label: 'Logs', icon: 'widgets', app: 'logs' }
        },

        children: [
          {
            path: '',
            name: 'logs_all',
            // redirect: { name: 'logs_all' },
            component: () => import(/* webpackChunkName: "logs.web" */ '@apps/logs/pages/all.vue'),
            meta: {
              breadcrumb: { label: 'Logs All', icon: 'widgets', app: 'logs' }
            }
            // children: [
            //   {
            //     path: '',
            //     name: 'logs_web_all',
            //     component: () => import(/* webpackChunkName: "logs.web.all" */ '@apps/logs/pages/web/all.vue'),
            //     meta: {
            //       breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
            //     }
            //   },
            //   {
            //     path: 'filter',
            //     name: 'logs_web_filter',
            //     component: () => import(/* webpackChunkName: "logs.web.filter" */ '@apps/logs/pages/web/filter.vue'),
            //     meta: {
            //       breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
            //     }
            //   }
            // ]
          },
          {
            path: 'educativa',
            name: 'logs_educativa',
            redirect: { name: 'logs_educativa_all' },
            component: () => import(/* webpackChunkName: "logs.educativa" */ '@apps/logs/educativa/index.vue'),
            meta: {
              breadcrumb: { label: 'Logs Webs', icon: 'widgets', app: 'logs' }
            },
            children: [
              {
                path: '',
                name: 'logs_educativa_all',
                component: () => import(/* webpackChunkName: "logs.educativa.all" */ '@apps/logs/educativa/pages/all.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
                }
              },
              {
                path: 'filter',
                name: 'logs_educativa_filter',
                component: () => import(/* webpackChunkName: "logs.educativa.filter" */ '@apps/logs/educativa/pages/filter.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
                }
              }
            ]
          },
          {
            path: 'web',
            name: 'logs_web',
            redirect: { name: 'logs_web_all' },
            component: () => import(/* webpackChunkName: "logs.web" */ '@apps/logs/web/index.vue'),
            meta: {
              breadcrumb: { label: 'Logs Webs', icon: 'widgets', app: 'logs' }
            },
            children: [
              {
                path: '',
                name: 'logs_web_all',
                component: () => import(/* webpackChunkName: "logs.web.all" */ '@apps/logs/web/pages/all.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs All', icon: 'widgets', app: 'logs' }
                }
              },
              {
                path: 'filter',
                name: 'logs_web_filter',
                component: () => import(/* webpackChunkName: "logs.web.filter" */ '@apps/logs/web/pages/filter.vue'),
                meta: {
                  breadcrumb: { label: 'Logs Webs Filter', icon: 'widgets', app: 'logs' }
                }
              }
            ]
          }
          // {
          //   path: 'categories',
          //   name: 'logs_categories',
          //   component: () => import(/* webpackChunkName: "logs.categories" */ '@apps/logs/pages/categories.vue'),
          //   meta: {
          //     breadcrumb: { label: 'Logs Categories', icon: 'widgets', app: 'logs' }
          //   },
          //   children: [
          //     {
          //       path: ':category',
          //       name: 'logs_category',
          //       component: () => import(/* webpackChunkName: "logs.category" */ '@apps/logs/pages/category.vue'),
          //       meta: {
          //         breadcrumb: { label: 'Logs Category', icon: 'widgets', app: 'logs' }
          //       }
          //     }
          //   ]
          // }

        ]
      },
      // {
      //   path: '/tf',
      //   name: 'tf',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "tf" */ '@apps/tf/index.vue'),
      //   meta: {
      //     breadcrumb: { label: 'TensorFlow', icon: 'widgets', app: 'tf' }
      //   }
      //
      //   // children: [
      //   //   {
      //   //     path: ':host',
      //   //     name: 'Host',
      //   //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
      //   //     meta: {
      //   //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
      //   //     }
      //   //   }
      //   //   // {
      //   //   //   path: 'profile',
      //   //   //   component: () => import('pages/user-profile')
      //   //   // }
      //   // ]
      // },
      /** --------- **/
      // {
      //   path: '/brain',
      //   name: 'brain',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "brain" */ '@apps/brain/index.vue'),
      //   meta: {
      //     breadcrumb: { label: 'Barin', icon: 'widgets', app: 'brain' }
      //   }
      //
      //   // children: [
      //   //   {
      //   //     path: ':host',
      //   //     name: 'Host',
      //   //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
      //   //     meta: {
      //   //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
      //   //     }
      //   //   }
      //   //   // {
      //   //   //   path: 'profile',
      //   //   //   component: () => import('pages/user-profile')
      //   //   // }
      //   // ]
      // },
      // {
      //   path: '/neataptic',
      //   name: 'neataptic',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "neataptic" */ '@apps/neataptic/index.vue'),
      //   meta: {
      //     breadcrumb: { label: 'neataptic', icon: 'widgets', app: 'neataptic' }
      //   }
      //
      //   // children: [
      //   //   {
      //   //     path: ':host',
      //   //     name: 'Host',
      //   //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
      //   //     meta: {
      //   //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
      //   //     }
      //   //   }
      //   //   // {
      //   //   //   path: 'profile',
      //   //   //   component: () => import('pages/user-profile')
      //   //   // }
      //   // ]
      // },
      // {
      //   path: '/carrot',
      //   name: 'carrot',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "carrot" */ '@apps/carrot/index.vue'),
      //   meta: {
      //     breadcrumb: { label: 'carrot', icon: 'widgets', app: 'carrot' }
      //   }
      //
      //   // children: [
      //   //   {
      //   //     path: ':host',
      //   //     name: 'Host',
      //   //     component: () => import(/* webpackChunkName: "munin.host" */ '@apps/munin/host.vue'),
      //   //     meta: {
      //   //       breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
      //   //     }
      //   //   }
      //   //   // {
      //   //   //   path: 'profile',
      //   //   //   component: () => import('pages/user-profile')
      //   //   // }
      //   // ]
      // }
    ]
  }

  // {
  //   path: '/',
  //   component: () => import('layouts/App'),
  //   meta: {
  //     breadcrumb: { label: 'Home', icon: 'home' }
  //   },
  //   children: [
  //     {
  //       path: '',
  //       // path: '',
  //       component: () => import('@apps/root/index'),
  //       meta: {
  //         breadcrumb: { label: 'Index', icon: 'widgets', app: 'root' }
  //       }
  //
  //       // children: [
  //       //   {
  //       //     path: ':table',
  //       //     name: 'Table',
  //       //     component: () => import('@apps/root/table'),
  //       //     meta: {
  //       //       breadcrumb: { label: 'Table', icon: 'widgets' }
  //       //     }
  //       //   }
  //       //   // {
  //       //   //   path: 'profile',
  //       //   //   component: () => import('pages/user-profile')
  //       //   // }
  //       // ]
  //     },
  //     {
  //       path: '/munin',
  //       // path: '',
  //       component: () => import('@apps/munin/index'),
  //       meta: {
  //         breadcrumb: { label: 'Munin', icon: 'widgets', app: 'munin' }
  //       },
  //
  //       children: [
  //         {
  //           path: ':host',
  //           name: 'Host',
  //           component: () => import('@apps/munin/components/host'),
  //           meta: {
  //             breadcrumb: { label: 'Munin Host', icon: 'widgets', app: 'munin' }
  //           }
  //         }
  //         // {
  //         //   path: 'profile',
  //         //   component: () => import('pages/user-profile')
  //         // }
  //       ]
  //     },
  //
  //   ]
  //
  // }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
