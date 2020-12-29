<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="data.query"
            @keyup.enter.native="onSearch"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @keyup.enter.native="onSearch"
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="2" class="btn">
          <template>
            <el-button type="primary" @click="goAddUser">添加用户</el-button>
          </template>
          <el-dialog
            title="添加用户"
            :visible.sync="addUserDisLog.visible"
            width="40%"
            :before-close="handleClose"
          >
            <el-form
              :model="addUserDisLog.form.ruleForm"
              :rules="addUserDisLog.form.rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  placeholder="请输入用户名"
                  v-model="addUserDisLog.form.ruleForm.username"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  placeholder="请输入密码"
                  v-model="addUserDisLog.form.ruleForm.password"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="addUserDisLog.form.ruleForm.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input
                  placeholder="请输入电话"
                  v-model="addUserDisLog.form.ruleForm.mobile"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
          <!-- <el-button type="primary">添加用户</el-button> -->
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column label="#" width="50%" type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              @change="setUserState(slotProps.row.id, slotProps.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(slotProps.row)"
            ></el-button>
            <el-dialog
              title="修改用户"
              :visible.sync="editUserDisLog.visible"
              width="40%"
              :before-close="handleClose"
            >
              <el-form
                :model="editUserDisLog.form.ruleForm"
                :rules="editUserDisLog.form.rules"
                ref="editRuleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input
                    placeholder="请输入用户名"
                    v-model="editUserDisLog.form.ruleForm.username"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="editUserDisLog.form.ruleForm.email"
                    placeholder="请输入邮箱"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                  <el-input
                    v-model="editUserDisLog.form.ruleForm.mobile"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editcancel">取 消</el-button>
                <el-button type="primary" @click="editUserIn">确 定</el-button>
              </span>
            </el-dialog>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUsers(slotProps.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="data.pagenum"
          :page-sizes="[1, 2, 5, 10, 15, 20]"
          :page-size="data.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totall"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      data: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      totall: 0,
      editUserDisLog: {
        visible: false,
        form: {
          ruleForm: {
            username: '',
            id: '',
            email: '',
            mobile: '',
          },
          rules: {
            email: [
              { required: true, message: '请输入邮箱', trigger: 'change' },
              {
                type: 'email',
                message: '邮箱格式不正确',
                trigger: 'change',
              },
            ],
            mobile: [
              { required: true, message: '请输入电话号码', trigger: 'change' },
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '电话号码格式不对',
                trigger: 'change',
              },
            ],
          },
        },
      },
      addUserDisLog: {
        visible: false,
        form: {
          ruleForm: {
            username: '',
            password: '',
            email: '',
            mobile: '',
          },
          rules: {
            username: [
              { required: true, message: '请输入用户名', trigger: 'change' },
              {
                min: 2,
                max: 16,
                message: '长度在2到16个字符',
                trigger: 'change',
              },
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'change' },
              {
                min: 6,
                max: 12,
                message: '长度在6到16个字符',
                trigger: 'change',
              },
            ],
            email: [
              { required: true, message: '请输入邮箱', trigger: 'change' },
              {
                type: 'email',
                message: '邮箱格式不正确',
                trigger: 'change',
              },
            ],
            mobile: [
              { required: true, message: '请输入电话号码', trigger: 'change' },
              {
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                message: '电话号码格式不对',
                trigger: 'change',
              },
            ],
          },
        },
      },
    };
  },
  methods: {
    setUserState(id, state) {
      this._plugns.editState(id, state).then((res) => {
        if (res.data.meta.status === 200) {
          this.$message.success('修改成功');
          this.getSomething();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    delUsers(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this._plugns.delUsers(id).then((res) => {
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功');
              this.getSomething();
            } else {
              this.$message.error(res.data.data.msg);
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
    goAddUser() {
      this.addUserDisLog.visible = true;
    },
    cancel() {
      this.addUserDisLog.visible = false;
      this.$refs.ruleForm.resetFields();
    },
    addUser() {
      this.addUserDisLog.visible = true;
      this.$refs.ruleForm
        .validate()
        .then(() => {
          return this._plugns.addUsers(this.addUserDisLog.form.ruleForm);
        })
        .then((res) => {
          this.addUserDisLog.visible = false;
          this.$refs.ruleForm.resetFields();
          if (res.data.meta.status === 201) {
            this.getSomething();
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
    editUser({ username, email, mobile, id }) {
      console.log(mobile);
      this.editUserDisLog.visible = true;
      this.editUserDisLog.form.ruleForm.username = username;
      this.editUserDisLog.form.ruleForm.email = email;
      this.editUserDisLog.form.ruleForm.mobile = mobile;
      this.editUserDisLog.form.ruleForm.id = id;
    },
    editcancel() {
      this.editUserDisLog.visible = false;
      this.$refs.editRuleForm.resetFields();
    },
    editUserIn() {
      // this.editUserDisLog.visible = true;
      this._plugns.editUsers(this.editUserDisLog.form.ruleForm).then((res) => {
        if (res.data.meta.status === 200) {
          console.log(res);
          this.editUserDisLog.visible = false;
          this.editUserDisLog.form.ruleForm.email = res.data.data.mobile;
          this.editUserDisLog.form.ruleForm.mobile = res.data.data.email;
          this.$refs.editRuleForm.resetFields();
          this.getSomething();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    getSomething() {
      this._plugns.getUsers(this.data).then((res) => {
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data.users;
          this.totall = res.data.data.total;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    onSearch() {
      this.data.pagenum = 1;
      this.getSomething();
    },
    handleSizeChange(size) {
      this.data.pagesize = size;
      this.getSomething();
    },
    handleCurrentChange(current) {
      this.data.pagenum = current;
      this.getSomething();
    },
  },
  created() {
    this.getSomething();
  },
};
</script>
<style lang="less" scoped>
.users {
  height: 100%;
  background-color: #eaedf1;
  padding: 20px;
  margin-bottom: 60px;
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-card {
    .el-row {
      .btn {
        margin-left: 20px;
        .el-dialog {
          ul {
            li {
              width: 100%;
              height: 50px;
              list-style: none;
              margin-bottom: 20px;
              span {
                display: inline-block;
                width: 80px;
                text-align: right;
              }
              .el-input {
                width: 80% !important;
              }
            }
          }
        }
      }
    }
    .el-table {
      margin-top: 20px;
    }
    .block {
      margin-top: 20px;
    }
  }
}
</style>
