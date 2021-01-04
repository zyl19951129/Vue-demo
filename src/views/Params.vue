<template>
  <div class="params">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="警告提示的文案"
        type="warning"
        show-iconi
        :closable="false"
      >
      </el-alert>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.params {
  height: 100%;
  padding: 20px;
  background-color: #eaedf1;
  .el-breadcrumb {
    margin-bottom: 20px;
  }
}
</style>
