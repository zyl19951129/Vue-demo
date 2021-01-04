<template>
  <div class="categories">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="/goods">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog.visible = true"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <el-table
        border
        stripe
        :data="list"
        row-key="cat_id"
        lazy
        :load="onLoadChildren"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template #default="{ row }">
            <i
              v-if="!row.cat_deleted"
              class="el-icon-success"
              style="color: #39ce39;"
            ></i>
            <i v-else class="el-icon-error" style="color: #f56c6c;"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template #default="{ row }">
            <el-tag v-if="row.cat_level === 0" type="primary">一级</el-tag>
            <el-tag v-else-if="row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delCate(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[5, 10, 15, 20, 50]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialog.visible"
      width="50%"
    >
      <template #default>
        <el-form
          ref="addForm"
          label-width="80px"
          :model="addDialog.form.data"
          :rules="addDialog.form.rules"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model.trim="addDialog.form.data.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <zyl-cascader
              v-model="addDialog.form.data.parentGoodsCate"
              :showLevel="2"
              style="width: 100%;"
            ></zyl-cascader>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="addDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="add(addDialog.form.data)"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
// @ --> /src
import ZylCascader from '@/components/ZylCascader.vue';
export default {
  components: { ZylCascader },
  data() {
    return {
      addDialog: {
        visible: false,
        form: {
          data: { cat_name: '', parentGoodsCate: [] },
          rules: {
            cat_name: [
              { required: true, message: '请输入分类名称', trigger: 'change' },
            ],
          },
        },
      },
      list: [],
      listChild: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  methods: {
    // 删除商品分类
    delCate(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._plugns.delGoodsCate(row.cat_id).then((res) => {
            if (res.data.meta.status === 200) {
              console.log(res);
              this.getList();
              this.$message.success(res.data.meta.msg);
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 添加商品分类
    add(role) {
      this._plugns
        .addGoodsInfo({
          cat_name: role.cat_name,
          cat_pid: role.parentGoodsCate[role.parentGoodsCate.length - 1],
          cat_level: role.parentGoodsCate.length,
        })
        .then((res) => {
          if (res.data.meta.status === 201) {
            this.addDialog.visible = false;
            this.getList();
            this.$message.success(res.data.meta.msg);
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
    handleSizeChange(size) {
      this.page.size = size;
      this.page.current = 1;
      this.getList();
    },
    handleCurrentChange(current) {
      this.page.current = current;
      this.getList();
    },
    // 展开下拉框时获取加载子节点数据
    onLoadChildren(tree, treeNode, resolve) {
      this._plugns.getChildrenListByPid(tree.cat_id).then((res) => {
        res.data.data.forEach(
          (value) => (value.hasChildren = value.cat_level !== 2)
        );
        resolve(res.data.data);
      });
    },
    // 获取商品列表信息
    getList() {
      this._plugns
        .getGoodsInfo({
          type: 1,
          pagenum: this.page.current,
          pagesize: this.page.size,
        })
        .then((res) => {
          if (res.data.meta.status === 200) {
            console.log(res);
            res.data.data.result.forEach((value) => (value.hasChildren = true));
            this.list = res.data.data.result;
            this.page.total = res.data.data.total;
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.categories {
  height: 100%;
  padding: 20px;
  background-color: #eaedf1;
  margin-bottom: 60px;
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-table {
    margin-top: 20px;
  }
  .block {
    margin: 20px 0;
  }
}
</style>
