<template>
  <section class="login-container">
    <div class="bg-wrap" :style="{backgroundImage:`url(${login_img})`}">
      <div class="card-wrap">
        <Card style="width:23rem;" :dis-hover="true">
          <p slot="title" style="font-size:1rem">
            <Icon type="log-in"></Icon>欢迎登录学业信息管理系统
          </p>
          <Form ref="userForm" :model="userForm" :rules="ruleCustom">
            <FormItem prop="username">
              <Input v-model.trim="userForm.username" placeholder="请输入" size="large">
                <Icon type="ios-person-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model.trim="userForm.password"
                placeholder="请输入密码"
                size="large"
              >
                <Icon type="ios-lock-outline" slot="prepend" class="icon-cls"></Icon>
              </Input>
            </FormItem>
            <FormItem style="text-align: center;">
              <RadioGroup v-model="userForm.roleId">
                <span>
                  <Radio label="1">老师</Radio>
                </span>
                <span>
                  <Radio label="2">学生</Radio>
                </span>
                <span>
                  <Radio label="3">管理员</Radio>
                </span>
              </RadioGroup>
            </FormItem>
            <FormItem>
              <div class="btu-register">
                <Button type="primary" @click="btn_login()" @keyup.enter="enterSearch" long :loading="login_loading">登录</Button>
                <a href="#/register" style="float:right;font-size:15px;">去注册</a>
              </div>
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      login_loading: false,
      login_img: require("@/assets/timg.jpg"),
      userForm: {
        //username:'jx0001',
        //password:'666666',
        username: "",
        password: "",
        roleId: "1"
      },
      ruleCustom: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  created(){
    this.enterDown();
  },
  methods: {
    btn_login() {
      //this.$router.push('/')
      var thiz = this;
      var url = "teacher/login";
      if (this.userForm.roleId == "2") {
        url = "student/login";
      }
      var params = {
        username: this.userForm.username,
        password: this.userForm.password
      };
      this.$get(url, params).then(function(msg) {
        console.log(msg, 7890);
        if (msg != "") {
          if (thiz.userForm.roleId == "1") {
            thiz.$router.push("/api/student");
            localStorage.setItem("teacher", JSON.stringify(msg));
            localStorage.setItem("tName", msg.name);
          } else {
            localStorage.setItem("sName", msg.name);
            localStorage.setItem("student", JSON.stringify(msg));
            thiz.$router.push("/stu/homework");
          }
        } else {
          thiz.$Message.error("用户名或密码错误！");
        }
      });
    },

    //回车登录
    enterDown(){
      document.onkeydown = e =>{

        // alert(typeof e.key)	//输出string
        // alert(e.key);        //输出按下键的值
        // alert(e.target.baseURI);      // 登录页面的URL:http://localhost:8081/#/  或者  http://localhost:8081/login#/

          //13表示回车键，baseURI是当前页面的地址，为了更严谨，也可以加别的，可以打印e看一下
          if (e.key === 'Enter' && e.target.baseURI.match(/#\/$/)) {       // 使用正则匹配 #/ 结尾的页面，点击回车登录
          //回车后执行搜索方法
              this.btn_login()
          }
      }
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
  /* height: calc(100%); */
  height: 100%;
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
    left: 0px;
    bottom: 0px; */
    margin: auto;
    opacity:88%
  }
  & .icon-cls {
    font-weight: bold;
    width: 20px;
    font-size: 18px;
  }
}
</style>
