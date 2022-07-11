export class RenderHTML {
    element:HTMLElement
    //創建時，輸入template並選擇要掛載到哪個host上
    constructor(private template:HTMLTemplateElement,private hostEle:HTMLDivElement){
        //將template的東西導入,true表示深度拷貝
        this.element = document.importNode(this.template.content,true).firstChild as HTMLElement
        //掛載到hostEle上
        this.hostEle.insertAdjacentElement('afterbegin',this.element)
    }
}