<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="addNewRoles">添加角色</el-button>
      <el-dialog title="添加角色" :visible.sync="addRoles.visible" width="50%">
        <template>
          <el-form
            :model="addRoles.form.ruleForm"
            :rules="addRoles.form.rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="角色名称" prop="username">
              <el-input v-model="addRoles.form.ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input v-model="addRoles.form.ruleForm.description"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoles.visible = false">取 消</el-button>
          <el-button type="primary" @click="addTheRoles">确 定</el-button>
        </span>
      </el-dialog>
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px;"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <!-- 下拉权限列表 -->
        <el-table-column type="expand">
          <template #default="slotProps">
            <el-row
              :class="{ oneRow: true }"
              v-for="value in slotProps.row.children"
              :key="value.id"
              :style="{ border: '1px solid #EBEEF5' }"
            >
              <el-col :span="5">
                <el-tag
                  type=""
                  effect="dark"
                  :style="{ margin: 10 + 'px' }"
                  closable
                  >{{ value.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="value2 in value.children"
                  :key="value2.id"
                  :style="{ border: '1px solid #EBEEF5' }"
                  :class="{ twoCol: true }"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      effect="dark"
                      :style="{ margin: 10 + 'px' }"
                      closable
                      >{{ value2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      effect="dark"
                      :style="{ margin: 10 + 'px' }"
                      v-for="value3 in value2.children"
                      :key="value3.id"
                      closable
                      @close="closeThree(slotProps.row, value3.id)"
                      >{{ value3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 数据列表 -->
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="360">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="360">
        </el-table-column>
        <el-table-column prop="address" label="操作" :class="{ operate: true }">
          <template #default="{row:role}">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="assignPermissionsRolesDisLog(role)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showRolesDisLog.dialogVisible"
        width="30%"
        @close="showRolesDisLog.defCheckedKeys = []"
      >
        <el-tree
          :data="showRolesDisLog.rightTree"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :props="showRolesDisLog.defaultProps"
          :default-checked-keys="showRolesDisLog.defCheckedKeys"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRolesDisLog.dialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="closeRolesDisLog">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      jurisdictionData: [],
      addRoles: {
        visible: false,
        form: {
          // 验证规则
          rules: {
            username: [
              { required: true, message: '请输入角色名', trigger: 'change' },
              {
                min: 2,
                max: 10,
                message: '角色名长度为2-10个字符的',
                trigger: 'change',
              },
            ],
            description: [
              {
                required: true,
                message: '请输入角色描述内容',
                trigger: 'change',
              },
              {
                min: 2,
                max: 16,
                message: '角色描述内容长度为2-16个字符的',
                trigger: 'change',
              },
            ],
          },
          ruleForm: {
            username: '',
            description: '',
          },
        },
      },
      showRolesDisLog: {
        type: 'tree',
        dialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'authName',
        },
        rightTree: null,
        role: null,
        defCheckedKeys: [],
      },
    };
  },
  methods: {
    // 添加新角色
    addNewRoles() {
      this.addRoles.visible = true;
    },
    addTheRoles() {
      var newRole = this.tableData.filter((value) => {
        return value.roleName === this.addRoles.form.ruleForm.username;
      });
      if (!newRole.length) {
        this._plugns
          .addNewRoles(
            this.addRoles.form.ruleForm.username,
            this.addRoles.form.ruleForm.description
          )
          .then((res) => {
            if (res.data.meta.status === 201) {
              this.tableData.push(res.data.data);
              this.getRolesInfomation();
              this.$message.success(res.data.meta.msg);
              this.$$refs.tree.resetFields();
              this.addRoles.visible = false;
            } else {
              this.$message.error(res.data.meta.msg);
            }
          });
      } else {
        alert('角色名已存在');
      }
    },
    // 获取树形结构数据
    getTreeInfo() {
      this._plugns.getRightsInfo(this.showRolesDisLog.type).then((res) => {
        if (res.data.meta.status === 200) {
          this.showRolesDisLog.rightTree = res.data.data;
          return res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
          throw res.data.meta.msg;
        }
      });
    },
    // 加载默认选中的key
    loadDefCheckedKeys(node) {
      if (!node.children || !node.children.length) {
        this.showRolesDisLog.defCheckedKeys.push(node.id);
      } else {
        node.children.forEach((value) => {
          this.loadDefCheckedKeys(value);
        });
      }
    },
    // 读取角色默认权限权限
    assignPermissionsRolesDisLog(role) {
      new Promise((resolve, reject) => {
        if (!this.showRolesDisLog.rightTree) {
          resolve(this.getTreeInfo());
        } else {
          resolve();
        }
      }).then(() => {
        this.showRolesDisLog.role = role;
        this.loadDefCheckedKeys(role);
        // 显示对话框
        this.showRolesDisLog.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.showRolesDisLog.defCheckedKeys);
        });
      });
    },
    // 给角色分配权限
    closeRolesDisLog() {
      const newArr = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ].join(',');
      this._plugns
        .addRolesOfAppoint(newArr, this.showRolesDisLog.role.id)
        .then((res) => {
          if (res.data.meta.status === 200) {
            this.showRolesDisLog.dialogVisible = false;
            this.getRolesInfomation();
            this.$message.success(res.data.meta.msg);
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
    // 获取角色权限信息
    getRolesInformation() {
      this._plugns.getRolesInfo().then((res) => {
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    // 删除角色权限
    closeThree(role, id2) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._plugns.delRolesOfAppoint(role, id2).then((res) => {
            if (res.data.meta.status === 200) {
              role.children = res.data.data;
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
  },
  created() {
    this.getRolesInformation();
  },
};
</script>
<style lang="less" scoped>
.roles {
  height: 100%;
  background-color: #eaedf1;
  padding: 20px;
  margin-bottom: 60px;
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .box-card {
    .el-button {
      margin-bottom: 20px;
    }
  }
  .oneRow {
    display: flex;
    align-items: center;
  }
  .twoCol {
    display: flex;
    align-items: center;
  }
  .operate {
    display: flex;
    align-items: center;
  }
  .el-table {
    .el-table-column {
    }
  }
}
</style>
