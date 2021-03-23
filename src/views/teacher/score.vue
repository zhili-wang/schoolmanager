<template>
  <!-- 学生管理 -->
  <section class="home-container">
    <MasterPage title>
      <div slot="title-icon">
        <Icon type="ios-game-controller-b" />
      </div>
      <div slot="searchContent" class="search-content-slot">
        <Form :model="formItem" label-position="left" ref="formValidate">
            <Row>
              <Col span="7">
                <FormItem label="账号（学号）：" label-width="100" prop="customerName">
                  <Input v-model="username" placeholder="请输入" style="width:220px"></Input>
                </FormItem>
              </Col>
              <Col span="7" style="margin-left:30px">
                <FormItem label="姓名：" label-width="50">
                  <Input v-model="stuName" placeholder="请输入" style="width:220px"></Input>
                </FormItem>
              </Col>
              <Button type="primary" @click="loadData" style="margin-left:-45px">查询</Button>
            </Row>
        </Form>
        <div class="btnBox">
          <Button type="primary" @click="addData">新增</Button>
        </div>
      </div>
      <div slot="paddingContent">
        <Table stripe :columns="columns1" :data="tableDate" size="small"></Table>
      </div>
      <div slot="pager">
        <Page
          :total="total"
          :page-size="pagecount"
          :current="page"
          show-sizer
          show-total
          class="paging"
          @on-change="changepage"
        />
      </div>
    </MasterPage>
    <!-- 新增&修改弹窗 -->
    <Modal
      v-model="addModel"
      ref="addModel"
      scrollable
      :title="titleText"
      @on-ok="saveData"
      class-name="vertical-center-modal"
    >
      <Form :model="formItem" :label-width="120" ref="formValidate">
        <div class="border1">
          <Row>
            <Col span="24">
              <FormItem label="姓名：" >
                <Select v-model="formItem.stuId">
                  <option disabled value="">请选择</option>
                  <Option
                    v-for="(item, index) in studentObj"
                    :value="item.id"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="科目：">
                <Select v-model="formItem.courseId">
                  <option disabled value="">请选择</option>
                  <Option
                    v-for="(item, index) in courseObj"
                    :value="item.id"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="成绩1">
                <Input v-model="formItem.score" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="成绩2">
                <Input v-model="formItem.score2" placeholder="请输入"></Input>
              </FormItem>
              <!-- <FormItem label="总分">
                <Input v-model="formItem.totalScore" disabled="false"></Input>
              </FormItem> -->
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  </section>
</template>
<script>
import MasterPage from "@/components/Master";
export default {
  components: {
    MasterPage
  },
  data() {
    return {
      titleText: "",
      page: 1,
      pagecount: 10,
      total: 0,
      addModel: false,
      modalLoading: true,
      studentObj: [],
      courseObj:[],
      eidtOrAdd: "",
      // totalScore:"",  //总分
      formItem: {
        stuId: "",
        courseId: "",
        score: "",
        score2: "",
        totalScore:""
      },
      columns1: [
        { title: "账号（学号）", key: "username",align:"center" },
        { title: "姓名", key: "stuName",align:"center" },
        { title: "班级", key: "clazzName",align:"center" },
        { title: "科目", key: "courseName",align:"center" },
        { title: "成绩1", key: "score",align:"center" },
        { title: "成绩2", key: "score2",align:"center" },
        { title: "总分", key: "totalScore",align:"center" },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.editData(params.row);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remover(params.row.id);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      tableDate: [],
      id:'',
      teacherInfo:[],
      stuName:'',
      username:'',
      itemObj1:'',
      itemObj2:''
    };
  },
  created() {
    
  },
  mounted() {
    this.teacherInfo = JSON.parse(localStorage.getItem("teacher"));
    this.loadData();
    this.getStudent();
    this.getCourse();
  },
  methods: {
    //加载数据
    loadData() {
      var thiz = this;
      var params = {
          page:this.page,
          limit:this.pagecount,
          clazzId:this.teacherInfo.clazzId,
          stuName:this.stuName,
          username:this.username
      };
      this.$get("score/getListByPage", params)
        .then(function(msg) {
          console.log(msg,666);
          if (msg.rows.length > 0) {
            thiz.tableDate = msg.rows;
            thiz.total = msg.total;
          } else {
            thiz.tableDate = [];
            thiz.total = 0;
          }

        });
    },
    //下一页上一页
    changepage(val) {
      this.page = val;
      this.loadData();
    },
    //删除
    remover(id) {
      var thiz = this;
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除吗？</p>",
        onOk: () => {
          var params = {
            id: id
          };
          thiz.$post("score/deleteById", params)
            .then(function(msg) {
              console.log(msg);
              if (msg == "1") {
                thiz.page=1;
                thiz.$Message.info("删除成功！");
              } else {
                thiz.$Message.error("删除失败！");
              }
              thiz.loadData();
            });
        },
        onCancel: () => {}
      });
    },
    //保存
    saveData() {
        var thiz = this;
        var params = this.getParams();
        var url = "";
        //---1为添加，2为保存
        if (this.eidtOrAdd == 1) {
          url = "score/insert";
        } else if (this.eidtOrAdd == 2) {
          url = "score/editById";
          params.id = this.id;
        }
        this.$post(url, params)
          .then(function(msg) {
            if (msg == "1") {
                thiz.$Message.info("保存成功！");
            }else {
                thiz.$Message.error("保存失败！");
            }
            thiz.addModel = false;
            thiz.loadData();
          });
    },
    //添加清空表单数据
    addData() {
      this.titleText = "添加";
      this.addModel = true;
      this.eidtOrAdd = 1;
      this.formItem = {
        stuId: '',
        courseId: '',
        score: '',
        score2: ''
      };
    },
    //修改获取表单数据
    editData(row) {
      console.log(row)
      this.titleText = "修改";
      this.addModel = true;
      this.eidtOrAdd = 2;
      this.studentObj = this.itemObj1;
      this.courseObj = this.itemObj2;
      this.formItem = {
        stuId: row.username,
        courseId: row.password,
        score: row.score,
        score2: row.score2
        // totalScore:row.score+row.score2
      };
      console.log(135);
      // this.totalScore = row.score + row.score2;
      this.id = row.id;
      this.$set(this.formItem,"stuId",row.stuId);
      this.$set(this.formItem,"courseId",row.courseId);
      //this.studentObj.push({id:row.stuId, name: row.stuName });
      //this.courseObj.push({id:row.courseId, name: row.courseName });
    },
    //获取学生
    getStudent() {
      var thiz = this;
      var params = {
          page:this.page,
          limit:100,
          clazzId:this.teacherInfo.clazzId
      };
      this.$get("student/getListByPage",params)
        .then(function(msg) {
          console.log(msg,7777);
          if (msg.rows.length > 0) {
              thiz.studentObj = msg.rows;
              thiz.itemObj1 = msg.rows;
          } else {
              thiz.studentObj = [];
          }
      });
    },
    //获取课程
    getCourse() {
      var thiz = this;
      var params = {
          page:this.page,
          limit:100,
      };
      this.$get("course/getListByPage",params)
        .then(function(msg) {
          console.log(msg,7777);
          if (msg.rows.length > 0) {
              thiz.courseObj = msg.rows;
              thiz.itemObj2 = msg.rows;
          } else {
              thiz.courseObj = [];
          }
      });
    },
    getParams() {
        var params = {
            stuId: this.formItem.stuId,
            courseId: this.formItem.courseId,
            score: this.formItem.score,
            score2: this.formItem.score2,
            totalScore:this.formItem.totalScore
        };
        return params;
    }
  },
  computed:{
    totalScoreSum:function(){
      return this.formItem.score+this.formItem.score2;
    }
  }
};
</script>
<style lang="postcss" scoped>
.home-container {
}
.searchBtn {
  float: right;
}
.btnBox button {
  margin-right: 15px;
}
.ivu-icon-ios-game-controller-b {
  display: none;
}
/* .ivu-modal {
  width: 50% !important;
} */
.border1 {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.ivu-tabs-nav .ivu-tabs-tab-active {
  color: #2d8cf0;
  font-size: 16px;
}
.titleName {
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: #01a7e8;
  font-size: 16px;
}

</style>

