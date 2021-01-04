<template>
  <div class="zyl-cascader">
    <el-cascader
      :value="value"
      :options="options"
      :props="{
        expandTrigger: 'hover',
        checkStrictly,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      }"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {},
    },
    // 允许选中的层级，比如，只能选中第三级：[3]，比如，只能选中第一级和第三级：[1, 3]
    // 如果没传，那么就用ElementUI的Cascader组件默认的行为（只能选中叶子节点名）
    allowCheckedLevels: Array,
    // 显示的层级，比如，只显示两级：2，比如，要显示3级，就不传或3
    showLevel: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      options: [],
    };
  },
  methods: {
    handleChange(value) {
      // 如果限制了允许选中的层级 并且 选中的不是允许的，则清空值
      if (
        value.length &&
        this.allowCheckedLevels &&
        this.allowCheckedLevels.length &&
        !this.allowCheckedLevels.includes(value.length)
      ) {
        value = [];
        this.$message.warning(
          `只能选择第 <strong style="color:red">${this.allowCheckedLevels.join(
            ','
          )}</strong>级`
        );
      }
      this.$emit('input', value); // 为了支持v-model指令触发的
      this.$emit('change', value);
    },
  },
  computed: {
    checkStrictly() {
      // 如果 allowCheckedLevels 和 showLevel 一样，那么就不需要显示选项前的单选按钮
      if (
        this.allowCheckedLevels &&
        this.allowCheckedLevels.length === 1 &&
        this.allowCheckedLevels[0] === this.showLevel
      ) {
        return false;
      }
      return true;
    },
  },
  created() {
    this._plugns.getGoodsInfo({ type: this.showLevel }).then((res) => {
      if (res.data.meta.status === 200) {
        this.options = res.data.data;
      } else {
        this.$message.error(res.data.meta.msg);
      }
    });
  },
};
</script>
<style lang="less" scoped></style>
