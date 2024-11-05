const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/knowledge",
  name: "Knowledge",
  component: Layout,
  redirect: "/knowledge",
  meta: {
    icon: "ep:tickets",
    title: "知识库",
    rank: 0
  },
  children: [
    {
      path: "/knowledge",
      name: "Knowledge",
      component: () => import("@/views/knowledge/index.vue"),
      meta: {
        title: "知识库",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} satisfies RouteConfigsTable;
