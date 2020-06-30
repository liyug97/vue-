<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="row">
        <el-col>
          <span>商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            props.expandTrigger="hover"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = 'true'"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                  >{{item}}</el-tag>
                </template>
              </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态参数" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = 'true'"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" border stripe>
            <!--展开列-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                >{{item}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="removeParams(scope.row.attr_id)"
                >删除</el-button
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数的对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数的对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @closed="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //级联选择框双向绑定到的数组
      selectedCateKeys: [],
      activeName: "many",
      //动态数据的数据
      manyTableData: [],
      //静态数据的数据
      onlyTableData: [],
      //控制对话框的显示与隐藏
      addDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      editForm: {},
      //修改参数
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }
        ]
      },
      editDialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.cateList = res.data;
    },
    //级联选择框中变化，会触发这个函数
    handleChange() {
      this.getParamsData();
    },
    handleClick() {
      this.getParamsData();
      console.log(this.activeName);
    },
    async getParamsData() {
      console.log(this.selectedCateKeys);
      //选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      //证明选中的是三级
      console.log(this.selectedCateKeys);
      //根据所选分类的id,和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      console.log(res.data);
      res.data.forEach(item => {
        item.attr_vals ? item.attr_vals.split(" ") : [];
      });
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    //监听对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    //点击按钮，展示修改的对话框
    async showEditDialog(attr_id) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //点击按钮，修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败");
        }
        this.$message.success("修改参数成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    //根据id删除对应的参数项
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数,是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //用户取消了删除的操作
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      //删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.$message.success("删除参数成功");
      this.getParamsData();
    }
  },
  computed: {
    //如果按钮被禁用，则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态参数";
    }
  }
};
</script>
<style scoped>
.row {
  margin: 15px 0;
}
.el-tag{
    margin: 10px;
}
</style>
