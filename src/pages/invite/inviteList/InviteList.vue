<template>
  <div class="InviteList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="推荐列表"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      :pagination="{
        current: pageNum,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <template slot="receiveStatus" slot-scope="{ text }">
        {{ text === 0 ? "未领取" : "已领取" }}
      </template>
      <template slot="levelStatus" slot-scope="{ text }">
        {{ text === 1 ? "一级" : text === 2 ? "二级" : "" }}
      </template>
    </custom-table>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import { recommendService as rs } from "@/services";

export default {
  name: "InviteList",
  components: { CustomTable },
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: "序号",
          customRender: (text, record, index) => `${index + 1}`,
          width: "7%",
        },
        {
          title: "用户名称",
          dataIndex: "userName",
          searchAble: true,
          width: "12%",
        },
        {
          title: "手机号码",
          dataIndex: "userPhone",
          searchAble: true,
        },
        {
          title: "是否领取",
          dataIndex: "receiveStatus",
          scopedSlots: { customRender: "receiveStatus" },
        },
        {
          title: "领取金额",
          dataIndex: "receiveMoney",
        },
        {
          title: "等级",
          dataIndex: "levelStatus",
          scopedSlots: { customRender: "levelStatus" },
        },
        {
          title: "领取时间",
          dataIndex: "receiveTime",
          dataType: "time",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          dataType: "time",
          visible: false,
        },
      ],
      dataSource: [],
      conditions: {},
      isShowAdd: false,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.loading = true;
      const { pageSize, pageNum, conditions } = this;
      rs.recommendList(pageSize, pageNum, { ...conditions }).then((result) => {
        const list = result.data.data;
        const { curPage, pageSize, total } = result.data.pagination;
        this.dataSource = list;
        this.pageNum = curPage;
        this.total = total;
        this.pageSize = pageSize;
        this.loading = false;
      });
    },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageNum = 1;
      this.conditions = conditions;
      this.getOrderList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getOrderList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getOrderList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getOrderList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getOrderList();
    },
  },
};
</script>

<style scoped lang="less">
.InviteList {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>