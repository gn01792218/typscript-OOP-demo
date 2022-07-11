// Code
// import {RenderHTML} from './class/RenderHTML'
class RenderHTML {
    element:HTMLElement
    //創建時，輸入template並選擇要掛載到哪個host上
    constructor(private template:HTMLTemplateElement,private hostEle:HTMLDivElement){
        //將template的東西導入,true表示深度拷貝
        const templateNode = document.importNode(this.template.content,true)
        this.element = templateNode.firstElementChild as HTMLElement
        //掛載到hostEle上
        this.hostEle.insertAdjacentElement('afterbegin',this.element)
    }
}

//渲染form元素
const formTemplate = document.getElementById('form') as HTMLTemplateElement
const hostDiv = document.getElementById('app') as HTMLDivElement
const form = new RenderHTML(formTemplate,hostDiv)