<template>
  <div class="WithdrawalList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      title="提现列表"
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
      <template slot="status" slot-scope="{ text }">
        {{ text === 1 ? "申请中" : text === 2 ? "申请通过" : "申请失败" }}
      </template>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="auditRecord(record.id)"
          v-auth="`audit`"
          :disabled="record.status === 1 ? false : true"
        >
          <a-icon type="audit" />审核
        </a>
      </div>
    </custom-table>
    <audit-withdrawal
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @create="handleCreate"
    ></audit-withdrawal>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import { withdrawService as ws } from "@/services";
import AuditWithdrawal from "../../components/auditWithdrawal/AuditWithdrawal.vue";
import { mapMutations } from "vuex";

export default {
  name: "WithdrawalList",
  components: { CustomTable, AuditWithdrawal },
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
        },
        {
          title: "真实姓名",
          dataIndex: "userRealName",
          visible: false,
        },
        {
          title: "银行卡号",
          dataIndex: "number",
        },
        {
          title: "提现金额",
          dataIndex: "money",
        },
        {
          title: "手机号",
          dataIndex: "phone",
          searchAble: true,
        },
        {
          title: "银行名称",
          dataIndex: "bankName",
          visible: false,
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: "10%",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "审核",
      withdrawalId: undefined,
      confirmLoading: false,
    };
  },
  created() {
    this.getWithdrawalList();
  },
  methods: {
    ...mapMutations("account", ["setWithdrawCount"]),
    getWithdrawalList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      ws.withdrawalList(pageSize, pageNum, { ...conditions }).then((result) => {
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
      this.getWithdrawalList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getWithdrawalList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getWithdrawalList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getWithdrawalList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getWithdrawalList();
    },
    //审核按钮
    auditRecord(id) {
      this.withdrawalId = id;
      this.visible = true;
    },
    //审核取消事件
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
    },
    //审核弹窗确定事件
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let addValues = { withdrawalIdId: this.withdrawalId };
        let params = { ...addValues, ...values };

        this.auditWithdrawal(params, form);
      });
    },
    //修改审核记录状态
    auditWithdrawal(params, form) {
      this.confirmLoading = true;
      ws.auditWithdrawal(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getUntreatedWithdrawNum();
          this.getWithdrawalList();
        }
        this.confirmLoading = false;
      });
    },
    //获取未处理提现条数
    getUntreatedWithdrawNum() {
      ws.getUntreatedWithdrawNum().then((res) => {
        if (res.data.code == 1) {
          let count = res.data.data[0];
          const withdrawCount = { count: count };
          this.setWithdrawCount(withdrawCount);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.WithdrawalList {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>