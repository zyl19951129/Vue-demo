<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <template>
        <el-table :data="tableData" border style="width: 100%;" stripe>
          <el-table-column type="index" label="#" width="100">
          </el-table-column>
          <el-table-column prop="authName" label="权限名称" width="380">
          </el-table-column>
          <el-table-column prop="path" label="路径" width="380">
          </el-table-column>
          <el-table-column prop="level" label="权限等级" width="380">
            <template #default="slotProps">
              <el-tag v-if="slotProps.row.level == 0">一级</el-tag>
              <el-tag type="success" v-else-if="slotProps.row.level == 1"
                >二级</el-tag
              >
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      type: 'list',
    };
  },
  methods: {
    getRightsIn() {
      this._plugns.getRightsInfo(this.type).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data;
        } else {
          this.$message.console.error(res.data.meta.msg);
        }
      });
    },
  },
  created() {
    this.getRightsIn();
  },
};
</script>
<style lang="less" scoped>
.rights {
  height: 100%;
  background-color: #eaedf1;
  padding: 20px;
  margin-bottom: 60px;
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-table {
    padding: 10px;
  }
}
</style>
