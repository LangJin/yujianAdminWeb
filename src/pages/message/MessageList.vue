<template>
  <div class="MessageList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="消息列表"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      @addNew="onAddNew"
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
      <template slot="isTrue" slot-scope="{ text }">
        {{ text === 0 ? "无效" : "有效" }}
      </template>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="editRecordStatus(record.id, record.isTrue)"
          v-auth="`status`"
          :disabled="record.status === 1 ? true : false"
        >
          <a-icon type="edit" /> 状态
        </a>
      </div>
    </custom-table>
    <!-- 新增、修改消息模板 -->
    <edit-message
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @create="handleCreate"
    ></edit-message>
    <!-- 修改状态 -->
    <a-modal
      :title="statusTitle"
      :visible="statusVisible"
      :confirm-loading="confirmLoading"
      @ok="statusOk"
      @cancel="statusCancel"
    >
      <a-form-item
        label="状态"
        :labelCol="{ span: 2 }"
        :wrapperCol="{ span: 12, offset: 1 }"
      >
        <a-select
          v-model="statusCode"
          style="width: 220px"
          @change="handleSelectChange"
        >
          <a-select-option :value="0"> 禁用 </a-select-option>
          <a-select-option :value="1"> 正常 </a-select-option>
        </a-select>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditMessage from "@/pages/components/editMessage/EditMessage";
import { messageService as ms } from "@/services";

export default {
  name: "MessageList",
  components: { CustomTable, EditMessage },
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
          title: "消息内容",
          dataIndex: "content",
          searchAble: true,
          width: "30%",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
        },
        {
          title: "状态",
          dataIndex: "isTrue",
          scopedSlots: { customRender: "isTrue" },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "新增消息模板",
      messageId: undefined,
      confirmLoading: false,
      statusTitle: "修改状态",
      statusVisible: false,
      statusCode: 0,
      isShowAdd: true,
    };
  },
  created() {
    this.getMessageTemplateList();
  },
  methods: {
    //获取消息模板列表
    getMessageTemplateList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      ms.messageTemplateList(pageSize, pageNum, { ...conditions }).then(
        (result) => {
          const list = result.data.data;
          const { curPage, pageSize, total } = result.data.pagination;
          this.dataSource = list;
          this.pageNum = curPage;
          this.total = total;
          this.pageSize = pageSize;
          this.loading = false;
        }
      );
    },
    onSearch(conditions, searchOptions) {
      console.log(searchOptions);
      this.pageNum = 1;
      this.conditions = conditions;
      this.getMessageTemplateList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getMessageTemplateList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getMessageTemplateList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getMessageTemplateList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getMessageTemplateList();
    },
    //新增消息模板
    onAddNew() {
      this.visible = true;
    },
    //新增、修改取消事件
    handleCancel() {
      const form = this.$refs.collectionForm.form;
      form.resetFields();
      this.visible = false;
    },
    //新增、修改弹窗确定事件
    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let params = {
          contents: [values.content],
        };
        this.saveAndUpdateVersion(params, form);
      });
    },
    //保存、修改消息模板
    saveAndUpdateVersion(params, form) {
      this.confirmLoading = true;
      ms.saveMessageTemplate(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getMessageTemplateList();
        }
        this.confirmLoading = false;
      });
    },
    //修改状态
    editRecordStatus(id, status) {
      this.messageId = id;
      this.statusCode = status;
      this.statusVisible = true;
    },
    //状态确定事件
    statusOk() {
      this.confirmLoading = true;
      ms.updateMessageTemplateStatus(this.messageId, this.statusCode).then(
        (res) => {
          if (res.data.code == 1) {
            this.$message.success(res.data.msg);
            this.statusVisible = false;
            this.getMessageTemplateList();
          }
          this.confirmLoading = false;
        }
      );
    },
    //状态取消事件
    statusCancel() {
      this.messageId = undefined;
      this.statusVisible = false;
    },
    //状态下拉框
    handleSelectChange(value) {
      this.statusCode = value;
    },
  },
};
</script>

<style scoped lang="less">
.MessageList {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>