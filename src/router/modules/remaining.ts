const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/test/:id",
    component: Layout,
    meta: {
      title: "测试",
      showLink: false,
      rank: 103
    },
    children: [
      {
        path: "",
        name: "Test",
        component: () => import("@/views/test/index.vue"),
        meta: {
          title: "测试页面"
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
