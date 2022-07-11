// Code
import {RenderHTML} from './class/class'


//渲染form元素
const formTemplate = document.getElementById('form') as HTMLTemplateElement
const hostDiv = document.getElementById('app') as HTMLDivElement
const form = new RenderHTML(formTemplate,hostDiv)