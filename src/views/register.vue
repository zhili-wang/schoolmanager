<template>
  <section class="login-container">
    <div class="bg-wrap" :style="{backgroundImage:`url(${login_img})`}">
      <div class="card-wrap">
        <Card style="width:350px" :dis-hover="true">
          <p slot="title" style="font-size:1rem">
            <Icon type="log-in"></Icon>注册
          </p>
          <Form ref="userForm" :model="userForm" :rules="ruleCustom">
            <FormItem prop="username">
              <RadioGroup
                v-model="button4"
                type="button"
                size="large"
                @on-change="register(button4)"
              >
                <Radio label="学生注册" border></Radio>
                <Radio label="老师注册" border></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="username" v-if="userForm.roleId == 2">
              <Input
                v-model.trim="userForm.username"
                placeholder="请输入学号"
                size="large"
                type="number"
                aria-modal="6"
              >
                <Icon type="ios-person-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="username" v-if="userForm.roleId == 1">
              <Input
                v-model.trim="userForm.teaname"
                placeholder="请输入账号"
                size="large"
                aria-modal="6"
              >
                <Icon type="ios-person-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>账号已jx开头的6位数
            </FormItem>
            <FormItem prop="password" style="margin-top:-15px;">
              <Input
                type="password"
                v-model.trim="userForm.password"
                placeholder="请输入密码"
                size="large"
              >
                <Icon type="ios-lock-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="text" v-model.trim="userForm.name" placeholder="请输入姓名" size="large">
                <Icon type="ios-person-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>
            </FormItem>
            <FormItem label="所在班级：" style="margin-top:-20px;">
              <Select v-model="userForm.clazzId">
                <Option
                  v-for="(item, index) in clazzObj"
                  :value="item.id"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所教科目：" v-if="userForm.roleId == 1" style="margin-top:-20px;">
              <Select v-model="userForm.courseId">
                <Option
                  v-for="(item, index) in courseObj"
                  :value="item.id"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="性别：" style="text-align: left;">
              <RadioGroup v-model="userForm.sex">
                <span>
                  <Radio label="男"></Radio>
                </span>
                <span>
                  <Radio label="女"></Radio>
                </span>
              </RadioGroup>
            </FormItem>

            <FormItem>
              <Button type="primary" @click="btn_login()" long :loading="login_loading">注册</Button>
              <a href="#/" style="float:right;font-size:15px;">去登录</a>
            </FormItem>
          </Form>
        </Card>
      </div>
      <Modal v-model="modal1" title="提示" @on-ok="ok">
        <p>恭喜你，注册成功！</p>
      </Modal>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      modal1: false,
      login_loading: false,
      login_img: require("@/assets/timg.jpg"),
      userForm: {
        username: "",
        password: "",
        roleId: "2",
        clazzId: "",
        sex: "男",
        courseId: "",
        name: "",
        teaname: ""
      },
      clazzObj: [],
      courseObj: [],
      button4: "学生注册",
      ruleCustom: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getClazz();
    this.getCourse();
  },
  methods: {
    register(flag) {
      if (flag == "老师注册") {
        this.userForm.roleId = 1;
      } else {
        this.userForm.roleId = 2;
      }
    },
    btn_login() {
      //this.$router.push('/')
      var thiz = this;
      var url = "";
      var params = {};
      if (this.userForm.roleId == "2") {
        if (this.userForm.username.length != 6) {
          thiz.$Message.error("账号必须为6位数！");
          return false;
        }
        params = {
          username: this.userForm.username,
          password: this.userForm.password,
          clazzId: this.userForm.clazzId,
          sex: this.userForm.sex,
          name: this.userForm.name
        };
        url = "student/insert";
      } else if (this.userForm.roleId == "1") {
        url = "teacher/insert";
        if (this.userForm.teaname.length != 6) {
          thiz.$Message.error("账号必须为6位！");
          return false;
        }
        if (this.userForm.teaname.indexOf("jx") <= -1) {
          thiz.$Message.error("账号必须以jx开头。");
          return false;
        }
        params = {
          username: this.userForm.teaname,
          password: this.userForm.password,
          clazzId: this.userForm.clazzId,
          sex: this.userForm.sex,
          courseId: this.userForm.courseId,
          name: this.userForm.name
        };
      }

      this.$get(url, params).then(function(msg) {
        console.log(msg, 7890);
        if (msg != "") {
          thiz.$Modal.confirm({
            title: "提示",
            content: "<p>恭喜你!注册成功!</p>",
            okText: "去登录",
            onOk: () => {
              thiz.$router.push("/");
            }
          });
        } else {
          thiz.$Message.error("用户名或密码错误！");
        }
      });
    },
    ok() {
      this.$router.push("/");
    },
    //获取班级
    getClazz() {
      var thiz = this;
      var params = {
        page: 1,
        limit: 100
      };
      this.$get("clazz/getListByPage", params).then(function(msg) {
        if (msg.rows.length > 0) {
          thiz.clazzObj = msg.rows;
        } else {
          thiz.clazzObj = [];
        }
      });
    },
    //获取科目
    getCourse() {
      var thiz = this;
      var params = {
        page: 1,
        limit: 100
      };
      this.$get("course/getListByPage", params).then(function(msg) {
        if (msg.rows.length > 0) {
          thiz.courseObj = msg.rows;
        } else {
          thiz.clazzObj = [];
        }
      });
    }
  }
};
</script>
<style lang="postcss" scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100%);
  & .bg-wrap {
    display: flex;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    /* position: relative; */
  }
  & .card-wrap {
    /* position: absolute;
    right: 100px;
    top: 40px; */
    margin: auto;
    opacity:90%
  }
  & .icon-cls {
    font-weight: bold;
    width: 20px;
    font-size: 18px;
  }
}
</style>
