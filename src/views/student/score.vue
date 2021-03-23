<template>
  <!-- 成绩管理 -->
  <section class="home-container">
    <MasterPage title>
      <!-- <div slot="title-icon">
        <Icon type="ios-game-controller-b" />
      </div> -->
      <div slot="searchContent" class="search-content-slot">
        <Form :model="formItem" :label-width="50" label-position="left" ref="formValidate">
          <Row>
            <Col span="8">
              <FormItem label="科目：" style="margin-right:10px;">
                <Input id="course" v-model="courseName" placeholder="请输入" ></Input>
              </FormItem>
            </Col>
            <Button type="primary" @click="loadData">查询</Button>
          </Row>
        </Form>
      </div>
      <div slot="paddingContent">
        <Table stripe :columns="columns1" :data="tableDate" size="small" ></Table>
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
      page: 1,
      pagecount: 10,
      total: 0,
      studentObj: [],
      courseObj: [],
      eidtOrAdd: "",
      formItem: {
        stuId: "",
        courseId: "",
        score: "",
        score2: "",
        total_score:""
      },
      columns1: [
        { title: "账号（学号）", key: "username",align:"center"},
        { title: "姓名", key: "stuName",align:"center" },
        { title: "班级", key: "clazzName",align:"center" },
        { title: "科目", key: "courseName",align:"center" },
        { title: "平时成绩", key: "score",align:"center" },
        { title: "期末成绩", key: "score2",align:"center" },
        { title: "总分", key: "totalScore",align:"center" },
      ],
      tableDate: [],
      studentInfo: [],
      courseName: ""
    };
  },
  created() {},
  mounted() {
    this.studentInfo = JSON.parse(localStorage.getItem("student"));
    this.loadData();
  },
  methods: {
    //加载数据
    loadData() {
      var thiz = this;
      var params = {
        page: this.page,
        limit: this.pagecount,
        clazzId: this.studentInfo.clazzId,
        courseName: this.courseName,
        username: this.studentInfo.username
      };
      this.$get("score/getListByPage", params).then(function(msg) {
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
    }
  }
};
</script>
<style lang="postcss" scoped>
/* 表格头部 */
/* >>>  .ivu-table-header th{
    color:#FFD3B4;
    font-weight: bold;
    background-color: #212c31;
    border: none;
  } */
/* .ivu-table-header th{
  background: color #2d8cf0;
} */

.home-container {
}
.searchBtn {
  float: right;
}
.btnBox button {
  margin-right: 15px;
}
/* .ivu-icon-ios-game-controller-b {
  display: none;
} */
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

