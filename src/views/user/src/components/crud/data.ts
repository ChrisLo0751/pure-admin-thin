import dayjs from "dayjs";
import { clone } from "@pureadmin/utils";

const date = dayjs(new Date()).format("YYYY-MM-DD");

// 表格数据
const tableData = [
  {
    name: "Tom",
    app: "No. 189, Grove St, Los Angeles",
    key: "00000001",
    created_at: date
  }
];

const tableDataMore = clone(tableData, true).map(item =>
  Object.assign(item, {
    state: "California",
    city: "Los Angeles",
    "post-code": "CA 90036"
  })
);

const tableDataImage = clone(tableData, true).map((item, index) =>
  Object.assign(item, {
    image: `https://pure-admin.github.io/pure-admin-table/imgs/${index + 1}.jpg`
  })
);

const tableDataSortable = clone(tableData, true).map((item, index) => {
  delete item.date;
  Object.assign(item, {
    date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
  });
});

const tableDataDrag = clone(tableData, true).map((item, index) => {
  delete item.address;
  delete item.date;
  return Object.assign(item, {
    id: index + 1,
    date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`
  });
});

const tableDataEdit = clone(tableData, true).map((item, index) => {
  delete item.date;
  return Object.assign(item, {
    id: index + 1,
    date: `${dayjs(new Date()).format("YYYY-MM")}-${index + 1}`,
    address: "China",
    sex: index % 2 === 0 ? "男" : "女"
  });
});

export {
  tableData,
  tableDataDrag,
  tableDataMore,
  tableDataEdit,
  tableDataImage,
  tableDataSortable
};
