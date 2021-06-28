<template>
  <div class="VersionList">
    <custom-table
      :columns="columns"
      :data-source="dataSource"
      :isShowAdd="isShowAdd"
      title="版本列表"
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
      <template slot="versionType" slot-scope="{ text }">
        {{ text === 1 ? "安卓" : "ios" }}
      </template>
      <template slot="status" slot-scope="{ text }">
        {{ text === 0 ? "禁用" : "启用" }}
      </template>
      <div slot="action" slot-scope="{ text, record }">
        <a
          style="margin-right: 8px"
          @click="editStatus(record.id)"
          v-auth="`status`"
          :disabled="record.status === 1 ? true : false"
        >
          <a-icon type="play-circle" /> 启用
        </a>
      </div>
    </custom-table>
    <edit-version
      ref="collectionForm"
      :visible="visible"
      :modalTitle="modalTitle"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @create="handleCreate"
    ></edit-version>
  </div>
</template>

<script>
import CustomTable from "@/pages/components/table/CustomTable";
import EditVersion from "@/pages/components/editVersion/EditVersion";
import { versionService as vs } from "@/services";

export default {
  name: "VersionList",
  components: { CustomTable, EditVersion },
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
          title: "版本名称",
          dataIndex: "versionName",
          searchAble: true,
        },
        {
          title: "版本描述",
          dataIndex: "versionDescription",
        },
        {
          title: "类型",
          dataIndex: "versionType",
          scopedSlots: { customRender: "versionType" },
          searchAble: true,
          dataType: "select",
          search: {
            selectOptions: [
              { title: "安卓", value: 1 },
              { title: "ios", value: 2 },
            ],
          },
        },
        {
          title: "下载地址",
          dataIndex: "downloadPath",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
          width: "8%",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      conditions: {},
      visible: false,
      modalTitle: "新增版本",
      versionId: undefined,
      confirmLoading: false,
      statusCode: 0,
      isShowAdd: true,
    };
  },
  created() {
    this.getVersionList();
  },
  methods: {
    getVersionList() {
      this.loading = true;
      const { pageNum, pageSize, conditions } = this;
      vs.versionList(pageSize, pageNum, { ...conditions }).then((result) => {
        const list = result.data.data;
        const { curPage, pageSize, total } = result.data.pagination;
        this.dataSource = list.map(function (value) {
          delete value.children;
          return value;
        });
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
      this.getVersionList();
    },
    onSizeChange(current, size) {
      this.pageNum = 1;
      this.pageSize = size;
      this.getVersionList();
    },
    onRefresh(conditions) {
      this.conditions = conditions;
      this.getVersionList();
    },
    onReset(conditions) {
      this.conditions = conditions;
      this.getVersionList();
    },
    onPageChange(page, pageSize) {
      this.pageNum = page;
      this.pageSize = pageSize;
      this.getVersionList();
    },
    //新增版本
    onAddNew() {
      this.visible = true;
    },
    //编辑状态
    editStatus(id) {
      let _self = this;
      this.versionId = id;
      this.$confirm({
        title: "提示",
        content: "此操作将启用该版本, 是否继续?",
        onOk() {
          _self.updateVersionStatus();
        },
        onCancel() {},
      });
    },
    //修改版本状态
    updateVersionStatus() {
      let status = 1;       //1： 启用
      this.confirmLoading = true;
      vs.updateVersionStatus(this.versionId, status).then((res) => {
        if (res.data.code == 1) {
          this.$message.success(res.data.msg);
          this.statusVisible = false;
          this.getVersionList();
        }
        this.confirmLoading = false;
      });
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
        this.saveAndUpdateVersion(values, form);
      });
    },
    //保存、修改版本信息
    saveAndUpdateVersion(params, form) {
      this.confirmLoading = true;
      vs.saveVersion(params).then((res) => {
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          form.resetFields();
          this.visible = false;
          this.getVersionList();
        }
        this.confirmLoading = false;
      });
    }
  },
};
</script>

<style scoped lang="less">
.VersionList {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>