<template>
  <div class="login">
    <div class="login-box">
      <div class="logo-box">
        <img src="../../public/NK.jpg" alt="" />
      </div>
      <div class="form-box" ref="mydiv">
        <el-form
          class="submit"
          :model="form.data"
          :rules="form.rules"
          ref="form"
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              autocomplete="off"
              prefix-icon="el-icon-s-custom"
              placeholder="请输入用户名"
              v-model="form.data.username"
              @keyup.enter.native="submit"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              autocomplete="off"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              v-model="form.data.password"
              @keyup.enter.native="submit"
            ></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        data: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: blur,
            },
            {
              min: 2,
              max: 16,
              message: '用户名长度为2-16个字符的',
              trigger: 'blur',
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: blur,
            },
            {
              min: 6,
              max: 12,
              message: '密码长度为6-12个字符',
              trigger: 'blur',
            },
          ],
        },
      },
    };
  },
  methods: {
    reset() {
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs.form
        .validate()
        .then(() => {
          return this._plugns.login(this.form.data);
        })
        .then((res) => {
          if (res.data.meta.status === 200) {
            localStorage.setItem('token', res.data.data.token);
            this.$router.push('/');
          } else {
            this.$message.error(res.data.meta.msg);
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b4b6b;
  height: 100vh;
  .login-box {
    position: relative;
    width: 450px;
    height: 304px;
    background-color: #fff;
    box-shadow: 0 0 5px 1px #fff;
    .logo-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border-radius: 50%;
      box-sizing: border-box;
      background-color: #efefef;
      box-shadow: 0 0 10px 1px #fff;
      padding: 10px;
      img {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        background-color: #ddd;
      }
    }
    .submit {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      .btn-box {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
