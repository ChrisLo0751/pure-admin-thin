const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "application",
  component: Layout,
  redirect: "/application",
  meta: {
    icon: "ep:home-filled",
    title: "应用",
    rank: 0
  },
  children: [
    {
      path: "/application",
      name: "Application",
      component: () => import("@/views/app/index.vue"),
      meta: {
        title: "应用",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
