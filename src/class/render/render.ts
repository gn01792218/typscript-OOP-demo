import { Validatable } from '../../types/validation/validation'
import { RenderOption } from '../../types/gloable'
import { Project, ProjectType } from '../../types/projectState/projectState'
import { ProjectState } from '../state/state'
function autobind (_:any,_2:string,descriptior:PropertyDescriptor){
    const originalMethod = descriptior.value
    const adjDescriptor:PropertyDescriptor = {
        configurable:true,
        get(){
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
return adjDescriptor
}
function validate(validatableTnput: Validatable){
    let isValid = true
    const { required, value, minLength, maxLength, min, max} = validatableTnput
    if(required){
        //長度不等於0 且 isValid
        isValid = isValid && value.toString().trim().length !==0
    }
    if(typeof value === 'string' && minLength != null){  //對字串的檢查，!= null 就包含檢查null和undefiend
        isValid = isValid && value.length > minLength
    }
    if(typeof value === 'string' && maxLength != null){  //對字串的檢查，!= null 就包含檢查null和undefiend
        isValid = isValid && value.length < maxLength
    }
    if( min != null &&  typeof value === 'number'){  //對數字的檢查
        isValid = isValid && value > min
    }
    if( max != null &&  typeof value === 'number'){  //對數字的檢查
        isValid = isValid && value < max
    }
    return isValid
}

export class RenderHTML {
    element:HTMLElement
    //創建時，輸入template並選擇要掛載到哪個host上
    constructor(private template:HTMLTemplateElement,private hostEle:HTMLDivElement,private option:RenderOption = {insertPosition:'afterbegin'}){
        //將template的東西導入,true表示深度拷貝
        this.element = document.importNode(this.template.content,true).firstElementChild as HTMLElement
        //掛載到hostEle上
        this.hostEle.insertAdjacentElement(option.insertPosition,this.element)
    }
}
export class RenderForm extends RenderHTML{
    titleInput : HTMLInputElement
    decsriptionInput : HTMLInputElement
    propleInput : HTMLInputElement
    constructor(template:HTMLTemplateElement,hostEle:HTMLDivElement,_option:RenderOption = {insertPosition:'afterbegin'}){
        super(template,hostEle,_option)
        this.titleInput = this.element.querySelector('#title') as HTMLInputElement
        this.decsriptionInput = this.element.querySelector('#description') as HTMLInputElement
        this.propleInput = this.element.querySelector('#people') as HTMLInputElement
        this.addSubmitListener('submit',this.submitHandler)
    }
    
    private getUserInput():[string,string,number] | void{
        const title = this.titleInput.value
        const description = this.decsriptionInput.value
        const people = this.propleInput.value
        //設置驗證機制
        const titleValidatable : Validatable = {
            value:title,
            required:true,
        }
        const desValidatable : Validatable = {
            value:description,
            required:true,
            minLength:5,
            maxLength:50,
        }
        const peopleValidatable : Validatable = {
            value:+people,
            min:0,
            max:10
        }
        if(!validate(titleValidatable) || !validate(desValidatable) || !validate(peopleValidatable) ){
            alert('請檢查所有欄位都已輸入完畢')
            return
        }
        return [title,description,+people]
    }
    private clearUserInput () {
        this.titleInput.value = ""
        this.decsriptionInput.value = ""
        this.propleInput.value = ""
    }
    @autobind
    private submitHandler(eve:Event){
        //送出表單的方法
        //停止事件的默認動作-->例如 form的默認動作是送交(經http 請求)，阻止後，按下送出就不會送交
        eve.preventDefault()
        const userInput = this.getUserInput()
        if(Array.isArray(userInput)){
            const [title,description,people] = userInput
            const project:Project = {
                title:title,
                description:description,
                peopleNum:people,
                type:ProjectType.ACTIVE
            } 
            //單例資料管理
            const projectState = ProjectState.getInstance()
            projectState.addProject(project)
            this.clearUserInput()
        }
        
    }
    private addSubmitListener(eventName:string,handler:(eve:Event)=>void){
        //注意，callBack function必須要透過bind才會找到本體唷!!!!!
        this.element.addEventListener(eventName,handler)
    }
}
export class RenderList extends RenderHTML {
    private assignProjects:Project[]; //裝載訂閱ProjectState獲得的資料
    constructor(template:HTMLTemplateElement,hostEle:HTMLDivElement, private type:'active' | 'finished',_option:RenderOption = {insertPosition:'afterbegin'}){
        super(template,hostEle,_option)
        this.assignProjects = []
        this.element.id = `${this.type}-projects`
        //訂閱projectState以渲染資料
        const projectState = ProjectState.getInstance()
        projectState.addListener((projects:Project[])=>{
            //這裡會得到訂閱ProjectState送來的projects資料
            //只顯示該type相同的類型
            this.assignProjects = projects.filter(project=>{
                switch(this.type){
                    case 'active':
                        return project.type === ProjectType.ACTIVE
                    case 'finished':
                        return project.type === ProjectType.FINISHED
                }
            })
            this.renderProjects()
        })
        //渲染內容
        this.renderContent()
        
    }
    private renderContent(){
        const listid = `${this.type}-projects-list`
        //動態的給ulid
        this.element.querySelector('ul')!.id = listid
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+'PROJECTS'
    }
    private renderProjects(){
        const listEle = this.element.querySelector('ul')! as HTMLUListElement
        listEle.innerHTML = ''
        for (let projectItem of this.assignProjects){
            //建立li
            const item = document.createElement('li')
            item.textContent = projectItem.title
            listEle.appendChild(item)
        }
    }
}