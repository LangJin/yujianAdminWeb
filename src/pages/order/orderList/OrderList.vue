<template>
  <div class="OrderList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="订单列表"
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
      <div slot="classPh" class="classPh" slot-scope="{ text }">
        <viewer :images="[text]" class="classPh">
          <img v-if="text" :src="text" alt="" />
          <img v-else src="@/assets/img/avater.png" alt="" />
        </viewer>
      </div>
    </custom-table>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import { orderService as os } from "@/services";

export default {
  name: "OrderList",
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
          title: "用户头像",
          dataIndex: "avatarRrl",
          scopedSlots: { customRender: "classPh" },
          width: "10%",
        },
        {
          title: "用户名称",
          dataIndex: "userName",
          searchAble: true,
          width: "10%",
        },
        {
          title: "手机号码",
          dataIndex: "phone",
          searchAble: true,
        },
        {
          title: "订单号",
          dataIndex: "orderNum",
          searchAble: true,
        },
        {
          title: "总金额",
          dataIndex: "goodsPrice",
        },
        {
          title: "订单备注",
          dataIndex: "remark",
          width: "20%",
        },
        {
          title: "订单状态",
          dataIndex: "orderStatus",
          scopedSlots: { customRender: "orderStatus" },
          width: "10%"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          dataType: "time",
          visible: false
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
      os.orderList(pageSize, pageNum, { ...conditions }).then((result) => {
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
.OrderList {
  background-color: @base-bg-color;
  padding: 24px;
}
.classPh {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>