<template>
  <a-modal
    :visible="visible"
    :title="modalTitle"
    :confirm-loading="confirmLoading"
    okText="保存"
    @cancel="cancel"
    @ok="create"
  >
    <a-form
      :form="form"
      layout="vertical"
      :labelCol="{ span: 4 }"
      :wrapperCol="{ span: 15, offset: 1 }"
    >
      <a-form-item label="兴趣爱好" required>
        <a-checkbox-group
          v-model="userInterest"
          name="checkboxgroup"
          :options="plainOptions"
          @change="onChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      modalTitle: "选择兴趣爱好",
      confirmLoading: false,
      plainOptions: [
        {
          value: "健身",
          label: "健身",
        },
        {
          value: "滑雪",
          label: "滑雪",
        },
        {
          value: "跑步",
          label: "跑步",
        },
        {
          value: "高尔夫",
          label: "高尔夫",
        },
        {
          value: "网球",
          label: "网球",
        },
        {
          value: "音乐",
          label: "音乐",
        },
        {
          value: "吃吃吃",
          label: "吃吃吃",
        },
        {
          value: "电影",
          label: "电影",
        },
        {
          value: "动漫",
          label: "动漫",
        },
      ],
      userInterest: [],
      value: [],
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "form_in_modal" });
  },
  methods: {
    onChange(checkedValues) {
      if (this.value.length < 6 || checkedValues.length < 6) {
        this.value = checkedValues;
      }
      this.userInterest = this.value;
      if (checkedValues.length > 6) {
        this.$message.warn("最多只能选择6种兴趣哦~");
        return false;
      }
    },
    //取消
    cancel() {
      this.value = [];
      this.userInterest = [];
      this.$emit("interestCancel");
    },
    //确定
    create() {
      this.$emit("interestCreate", this.userInterest);
    },
  },
};
</script>
<style lang="less" scoped>
</style>