import Vue from 'vue'
import { Button, CheckboxGroup } from 'element-ui'
import { Form,FormItem } from 'element-ui'
import { Input } from 'element-ui'
import {Message} from 'element-ui' 
import {Container,Header,Aside,Main} from 'element-ui'
import {Menu,MenuItem,Submenu} from 'element-ui'
import {Checkbox} from 'element-ui'
import {Upload,Steps,Step,Tabs,TabPane,Cascader,Alert,Tag,MessageBox,Select,Option,Tree,Breadcrumb,Card,BreadcrumbItem,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog } from "element-ui";
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
