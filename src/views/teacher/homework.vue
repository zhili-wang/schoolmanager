<template>
  <!-- 学生管理 -->
  <section class="home-container">
    <MasterPage title>
      <!-- <div slot="title-icon">
        <Icon type="ios-game-controller-b" />
      </div> -->
      <div slot="searchContent" class="search-content-slot">
        <!-- <Form :model="formItem" :label-width="50" label-position="left" ref="formValidate">
            <Row>
              <Col span="6">
                <FormItem label="姓名：" >
                  <Input v-model="stuName" placeholder="请输入" style="width:220px"></Input>
                </FormItem>
              </Col>
              <Button type="primary" @click="loadData"style="margin-left:-15px">查询</Button>
            </Row>
        </Form> -->
        <div class="btnBox">
          <Button type="primary" @click="addData">新增</Button>
        </div>
      </div>
      <div slot="paddingContent">
        <Table
          stripe
          :columns="columns1"
          :data="tableDate"
          size="small"
        ></Table>
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
    <!-- 新增弹窗 -->
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
              <FormItem label="所教班级：">
                <Input
                  v-model="formItem.clazzName"
                  placeholder="请输入"
                  readonly
                  disabled
                ></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="所教科目：">
                <Input
                  v-model="formItem.courseName"
                  placeholder="请输入"
                  readonly
                  disabled
                ></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="作业描述：">
                <textarea
                  v-model="formItem.detail"
                  placeholder="请输入"
                  style="width: 100%"
                ></textarea>
              </FormItem>
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
    MasterPage,
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
      courseObj: [],
      eidtOrAdd: "",
      formItem: {
        clazzId: "",
        courseId: "",
        courseName: "",
        clazzName: "",
        detail: "",
      },
      columns1: [
        { title: "班级", key: "clazzName", align: "center", width: 250 },
        { title: "科目", key: "courseName", align: "center", width: 250 },
        { title: "作业描述", key: "detail", align: "center" },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "10px",
                  },
                  on: {
                    click: () => {
                      this.editData(params.row);
                    },
                  },
                },
                "修改作业"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      this.remover(params.row.id);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
      tableDate: [],
      id: "",
      teacherInfo: [],
      stuName: "",
      itemObj1: "",
      itemObj2: "",
    };
  },
  created() {},
  mounted() {
    this.teacherInfo = JSON.parse(localStorage.getItem("teacher"));
    console.log(this.teacherInfo, 123456);
    this.formItem.courseId = this.teacherInfo.courseId;
    this.formItem.courseName = this.teacherInfo.courseName;
    this.formItem.clazzId = this.teacherInfo.clazzId;
    this.formItem.clazzName = this.teacherInfo.clazzName;
    console.log(this.formItem.clazzName, 456789);

    this.loadData();
    this.getStudent();
    this.getCourse();
  },
  methods: {
    //加载数据
    loadData() {
      var thiz = this;
      var params = {
        page: this.page,
        limit: this.pagecount,
        clazzId: this.teacherInfo.clazzId,
      };
      this.$get("homework/getListByPage", params).then(function (msg) {
        console.log(msg, 666);
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
            id: id,
          };
          thiz.$post("homework/deleteById", params).then(function (msg) {
            console.log(msg);
            if (msg == "1") {
              thiz.page = 1;
              thiz.$Message.info("删除成功！");
            } else {
              thiz.$Message.error("删除失败！");
            }
            thiz.loadData();
          });
        },
        onCancel: () => {},
      });
    },
    //保存
    saveData() {
      var thiz = this;
      var params = this.getParams();
      var url = "";
      //---1为添加，2为保存
      if (this.eidtOrAdd == 1) {
        url = "homework/insert";
      } else if (this.eidtOrAdd == 2) {
        url = "homework/editById";
        params.id = this.id;
      }
      this.$post(url, params).then(function (msg) {
        if (msg == "1") {
          thiz.$Message.info("保存成功！");
        } else {
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
        detail: "",
      };
      this.formItem.courseId = this.teacherInfo.courseId;
      this.formItem.courseName = this.teacherInfo.courseName;
      this.formItem.clazzId = this.teacherInfo.clazzId;
      this.formItem.clazzName = this.teacherInfo.clazzName;
    },
    //修改获取表单数据
    editData(row) {
      console.log(row);
      this.titleText = "修改";
      this.addModel = true;
      this.eidtOrAdd = 2;
      this.formItem = {
        courseId: row.courseId,
        courseName: row.courseName,
        clazzId: row.clazzId,
        clazzName: row.clazzName,
        detail: row.detail,
      };
      this.id = row.id;
    },
    //获取学生
    getStudent() {
      var thiz = this;
      var params = {
        page: this.page,
        limit: 100,
        clazzId: this.teacherInfo.clazzId,
      };
      this.$get("student/getListByPage", params).then(function (msg) {
        console.log(msg, 7777);
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
        page: this.page,
        limit: 100,
      };
      this.$get("course/getListByPage", params).then(function (msg) {
        console.log(msg, 7777);
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
        courseId: this.formItem.courseId,
        clazzId: this.formItem.courseId,
        detail: this.formItem.detail,
      };
      return params;
    },
  },
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

