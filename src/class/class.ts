export class RenderHTML {
    element:HTMLElement
    //創建時，輸入template並選擇要掛載到哪個host上
    constructor(private template:HTMLTemplateElement,private hostEle:HTMLDivElement){
        //將template的東西導入,true表示深度拷貝
        this.element = document.importNode(this.template.content,true).firstElementChild as HTMLElement
        //掛載到hostEle上
        this.hostEle.insertAdjacentElement('afterbegin',this.element)
    }
}
export default class RenderForm extends RenderHTML{
    titleInput : HTMLInputElement
    decsriptionInput : HTMLInputElement
    propleInput : HTMLInputElement
    constructor(template:HTMLTemplateElement,hostEle:HTMLDivElement){
        super(template,hostEle)
        this.titleInput = this.element.querySelector('#title') as HTMLInputElement
        this.decsriptionInput = this.element.querySelector('#description') as HTMLInputElement
        this.propleInput = this.element.querySelector('#people') as HTMLInputElement
        this.addSubmitListener('submit',this.submitHandler)
    }
    private submitHandler(eve:Event){
        //送出表單的方法
        //停止事件的默認動作-->例如 form的默認動作是送交(經http 請求)，阻止後，按下送出就不會送交
        eve.preventDefault()
        console.log(this.titleInput.value)
    }
    private addSubmitListener(eventName:string,handler:(eve:Event)=>void){
        console.log(eventName)
        console.log(handler)
        //注意，callBack function必須要透過bind才會找到本體唷!!!!!
        this.element.addEventListener(eventName,handler.bind(this))
    }
}