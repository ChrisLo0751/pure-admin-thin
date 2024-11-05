const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/user",
  name: "User",
  component: Layout,
  redirect: "/user",
  meta: {
    icon: "ep:user",
    title: "用户",
    rank: 0
  },
  children: [
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
