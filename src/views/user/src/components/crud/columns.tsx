import type {
  LoadingConfig,
  AdaptiveConfig,
  PaginationProps
} from "@pureadmin/table";
import { tableData } from "./data";
import { ref, onMounted, reactive } from "vue";
import { clone, delay } from "@pureadmin/utils";
import type { PlusColumn } from "plus-pro-components";

export function useColumns(
  handleEdit: (index: number, row: any) => void,
  handleDelete: (index: number, row: any) => void
) {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name"
    },
    {
      label: "应用",
      prop: "app"
    },
    {
      label: "API KEY",
      prop: "key"
    },
    {
      label: "创建时间",
      prop: "created_at"
    },
    {
      label: "操作",
      cellRenderer: ({ index, row }) => (
        <div>
          <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
            查看
          </el-button>
          <el-button size="small" onClick={() => handleEdit(index + 1, row)}>
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            onClick={() => handleDelete(index + 1, row)}
          >
            删除
          </el-button>
        </div>
      )
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 20,
    currentPage: 1,
    pageSizes: [20, 40, 60],
    total: 0,
    align: "right",
    background: true,
    size: "default"
  });

  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: "正在加载第一页...",
    viewBox: "-10, -10, 50, 50",
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    // svg: "",
    // background: rgba()
  });

  /** 撑满内容区自适应高度相关配置 */
  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 110
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    // fixHeader: true
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    // zIndex: 100
  };

  function onSizeChange(val) {
    console.log("onSizeChange", val);
  }

  function onCurrentChange(val) {
    loadingConfig.text = `正在加载第${val}页...`;
    loading.value = true;
    delay(600).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    delay(600).then(() => {
      const newList = [];
      Array.from({ length: 6 }).forEach(() => {
        newList.push(clone(tableData, true));
      });
      newList.flat(Infinity).forEach((item, index) => {
        dataList.value.push({ id: index, ...item });
      });
      pagination.total = dataList.value.length;
      loading.value = false;
    });
  });

  return {
    loading,
    columns,
    dataList,
    pagination,
    loadingConfig,
    adaptiveConfig,
    onSizeChange,
    onCurrentChange
  };
}

export function useForm() {
  const formColumns: PlusColumn[] = [
    {
      label: "名称",
      width: 120,
      prop: "name",
      valueType: "copy"
    },
    {
      label: "应用",
      width: 120,
      prop: "status",
      valueType: "select",
      options: [
        {
          label: "未解决",
          value: "0",
          color: "red"
        },
        {
          label: "已解决",
          value: "1",
          color: "blue"
        },
        {
          label: "解决中",
          value: "2",
          color: "yellow"
        },
        {
          label: "失败",
          value: "3",
          color: "red"
        }
      ]
    }
  ];

  return {
    formColumns
  };
}
