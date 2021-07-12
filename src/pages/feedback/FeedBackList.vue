<template>
  <div class="FeedBackList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="问题反馈列表"
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
      <template slot="orderStatus" slot-scope="{ text }">
        {{ text === 0 ? "等待支付" : "支付完成" }}
      </template>
      <div slot="urls" class="classPh" slot-scope="{ text }">
        <viewer :images="text" class="classPh">
          <img v-for="(src, index) in text" :key="index" :src="src" alt="" />
          <!-- <img v-else src="@/assets/img/avater.png" alt="" /> -->
        </viewer>
      </div>
    </custom-table>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import { feedbackService as fs } from "@/services";

export default {
  name: "FeedBackList",
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
          title: "用户姓名",
          dataIndex: "nickName",
          searchAble: true,
          width: "15%",
        },
        {
          title: "反馈内容",
          dataIndex: "content",
          width: "25%",
        },
        {
          title: "图片",
          dataIndex: "urls",
          scopedSlots: { customRender: "urls" },
          width: "35%",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          dataType: "time",
        },
      ],
      dataSource: [],
      conditions: {},
      isShowAdd: false,
    };
  },
  created() {
    this.getFeedBackList();
  },
  methods: {
    getFeedBackList() {
      this.loading = true;
      const { pageSize, pageNum, conditions } = this;
      fs.feedBackList(pageSize, pageNum, { ...conditions }).then((result) => {
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
      this.getFeedBackList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getFeedBackList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getFeedBackList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getOrderList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getFeedBackList();
    },
  },
};
</script>

<style scoped lang="less">
.FeedBackList {
  background-color: @base-bg-color;
  padding: 24px;
}
.classPh {
  width: 40px;
  height: 40px;
  display: flex;
  img {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    margin-right: 10px;
  }
}
</style>