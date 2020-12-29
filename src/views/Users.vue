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
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </template>
          <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  placeholder="请输入用户名"
                  v-model="ruleForm.username"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  placeholder="请输入密码"
                  v-model="ruleForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="ruleForm.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input
                  placeholder="请输入电话"
                  v-model="ruleForm.mobile"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onClick">确 定</el-button>
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
            <el-switch v-model="slotProps.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
      dialogVisible: false,
      tableData: [],
      data: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      totall: 0,
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在1到16个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在6到16个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' },
        ],
        moble: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在3到11个字符', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onClick() {
      this.dialogVisible = false;
      this.$refs.ruleForm
        .validate()
        .then(() => {
          return this._plugns.addUsers(this.ruleForm);
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status === 201) {
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
