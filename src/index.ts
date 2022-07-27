// Code

import { RenderForm, RenderList } from './class/render/render'
import '/dist/style.css'
//渲染form元素
const formTemplate1 = document.getElementById('form') as HTMLTemplateElement
const hostDiv1 = document.getElementById('app') as HTMLDivElement
const form1 = new RenderForm(formTemplate1,hostDiv1)

const listTemplate = document.getElementById('list') as HTMLTemplateElement
const activeList = new RenderList(listTemplate,hostDiv1,'active',{insertPosition:'beforeend'})
const finishedList = new RenderList(listTemplate,hostDiv1,'finished',{insertPosition:'beforeend'})