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
                <FormItem label="姓名：" label-width="50" prop="name">
                  <Input v-model="name" placeholder="请输入" style="width:220px"></Input>
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
              <FormItem label="账号（学号）：" prop="customerName">
                <Input v-model="formItem.username" placeholder="请输入" maxlength="6" type="number"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="密码：" prop="name">
                <Input v-model="formItem.password" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="姓名：">
                <Input v-model="formItem.name" placeholder="请输入"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="性别：">
                <RadioGroup v-model="formItem.sex">
                  <span>
                    <Radio label="男"></Radio>
                  </span>
                  <span>
                    <Radio label="女"></Radio>
                  </span>
                </RadioGroup>
              </FormItem>
            </Col>
            <!-- <Col span="24">
              <FormItem label="班级：">
                <Select v-model="formItem.clazzId">
                  <option disabled value="">请选择</option>
                  <Option
                    v-for="(item, index) in clazzObj"
                    :value="item.id"
                    :key="index"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col> -->
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
      techerInfo:'',
      titleText: "",
      page: 1,
      pagecount: 10,
      total: 0,
      addModel: false,
      modalLoading: true,
      clazzObj: [],
      clazzItme:[],
      eidtOrAdd: "",
      username:'',
      name:'',
      formItem: {
        username: "",
        password: "",
        sex: "男",
        name: "",
        clazzId: "2",
      },
      columns1: [
        { title: "账号（学号）", key: "username",align:"center",width:160 },
        { title: "姓名", key: "name",align:"center" },
        { title: "性别", key: "sex",align:"center" },
        { title: "班级", key: "clazzName",align:"center" },
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
    };
  },
  created() {
  
  },
  mounted() {
    this.techerInfo = JSON.parse(localStorage.getItem("teacher"));
    console.log(this.techerInfo,1111)
    this.loadData();
    this.getClazz();
  },
  methods: {
    //加载数据
    loadData() {
      var thiz = this;
      var params = {
          page:this.page,
          limit:this.pagecount,
          clazzId:this.techerInfo.clazzId,
          name:this.name,
          username:this.username
      };
      console.log(params,222)
      this.$get("student/getListByPage", params)
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
          thiz.$post("student/deleteById", params)
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
          url = "student/insert";
        } else if (this.eidtOrAdd == 2) {
          url = "student/editById";
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
        username: '',
        password: '',
        name: '',
        sex: '',
        clazzId: ''
      };
    },
    //修改获取表单数据
    editData(row) {
      console.log(row)
      this.titleText = "修改";
      this.addModel = true;
      this.eidtOrAdd = 2;
      this.clazzObj = this.clazzItme;
      this.formItem = {
        username: row.username,
        password: row.password,
        name: row.name,
        sex: row.sex,
        clazzId: row.clazzName,
      };
      this.id = row.id;
      this.$set(this.formItem,"clazzId",row.clazzId);
      this.clazzObj.push({id:row.clazzId, name: row.clazzName });
    },
    //获取班级
    getClazz() {
      var thiz = this;
      var params = {
          page:this.page,
          limit:100
      };
      this.$get("clazz/getListByPage",params)
        .then(function(msg) {
          console.log(msg,7777);
          if (msg.rows.length > 0) {
              thiz.clazzObj = msg.rows;
              thiz.clazzItme = msg.rows;
              console.log(thiz.clazzObj ,444)
          } else {
              thiz.clazzObj = [];
          }
      });
    },
    getParams() {
        var params = {
            username: this.formItem.username,
            password: this.formItem.password,
            name: this.formItem.name,
            sex: this.formItem.sex,
            clazzId: this.techerInfo.clazzId
        };
        console.log(params,1111)
        return params;
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

