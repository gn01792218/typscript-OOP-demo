# Ts OOP Project
## 實作流程
### 1.建立渲染app的class
### 2.和input元素的互動 : 
#### 使用bind方法讓addEventListener抓的到class的this-->使用裝飾器(記得先打開ts config的experimentalDecorators)
### 3.驗證input的function
#### (1).定義Validatable interface
```Ts
interface Validatable {
    value: string | number ;
    required?:boolean;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
}
```
#### (2).製作validate()
```Ts
function validate(validatableTnput: Validatable){
    let isValid = true
    const { required, value, minLength, min, max} = validatableTnput
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
```
#### (3).為getUserInput方法加裝驗證
### 4.建立渲染List的class
### 5.建立ProjectState管理(類似vuex)資料 : 使用單例模式管理State、訂閱模式發送資料
```javascript
class ProjectState {
    private listeners:Listener[] = []  //訂閱者陣列
    private projects:Project[] = []; //資料陣列
    private static instance:ProjectState; //單例實體
    private constructor(){}
    static getInstance(){
        if(ProjectState.instance){
            return ProjectState.instance
        }
        return ProjectState.instance = new ProjectState()
    }
    addListener(listernerFn:Listener){ //供訂閱者註冊的方法
        this.listeners.push(listernerFn)
    }
    addProject(project:Project){ //新增項目的方法
        this.projects.push(project)
        //每次有新的資料增加，就呼叫this.listerners裡面的每個方法
        for(let listernerFn of this.listeners){
            //pass 訂閱者 要的資料
            //使用slice複製資料，才不會改到原始資料
            listernerFn(this.projects.slice())
        }
    }
}

```
#### (1) 在RenderForm中addProject
```javascript
class RenderForm extends RenderHTML{
    //略...
    @autobind
    private submitHandler(eve:Event){
        //略...
        //將取得的input資料送給ProjectState
        const projectState = ProjectState.getInstance()
        projectState.addProject(project)
        this.clearUserInput()
        }
    }

```
#### (2) 在RenderList中註冊ProjectState，以渲染Project (採subscription pattern)
使用ProjectState的addListerner方法，訂閱ProjectState
```javascript
class RenderList extends RenderHTML {
    private assignProjects:Project[]; //裝載訂閱ProjectState獲得的資料
    constructor(template:HTMLTemplateElement,hostEle:HTMLDivElement, private type:'active' | 'finished',_option:RenderOption = {insertPosition:'afterbegin'}){
        //...略
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
        //...略
        this.renderContent()
    }
    //其他略...
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
```
### 6.優化-建立ProjectItem class
#### HTML樣板
每個Project其實就是一個li，裡面放title、peopleNum、description資訊，如下
```html
<template id="single">
    <li>
      <h2></h2>
      <h3></h3>
      <p></p>
    </li>
  </template>

```
#### ProjectItem class
host的元素是HTMLUlelement唷~
```javascript
class ProjectItem extends RenderHTML<HTMLLIElement,HTMLUListElement> {
    private project:Project
    //getter for peopleNum str
    get peopleNumStr(){
        if(this.project.peopleNum === 1)return '1 person'
        return `${this.project.peopleNum} persons`
    }
    constructor(template:HTMLTemplateElement,hostEle:HTMLUListElement,project:Project,_option:RenderOption = {insertPosition:'afterbegin'}){
        super(template,hostEle)
        this.project = project
        this.renderContent()
    }
    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.peopleNumStr+' assigned'   //使用getter只要直接取用即可
        this.element.querySelector('p')!.textContent = this.project.description
    }
}

```
### 7.添加drag drop功能
添加兩個interface，分別是dragable、dropable。
我們要讓ProjectItem類別implment dragable ； 讓ProjectList類別implements dropable
```javascript
//定義interface
interface Draggable {
    dragStartHandler(event:DragEvent):void
    dragEndHandler(event: DragEvent):void
}
interface Dropable {
    dragOverHandler(event:DragEvent):void  //判斷是否可以drop
    dropHandler(event:DragEvent):void
    dragLeaveHandler(event:DragEvent):void
}

```
#### (1)讓ProjectItem類別implment dragable
```javascript
//為ProjectItem類implment dragable
class ProjectItem extends RenderHTML<HTMLLIElement,HTMLUListElement> implements Draggable {
    //...略
    constructor(template:HTMLTemplateElement,hostEle:HTMLUListElement,project:Project,_option:RenderOption = {insertPosition:'afterbegin'}){
        super(template,hostEle)
        this.project = project
        this.listenDragEvent()
        this.renderContent()
    }
    @autobind
    dragStartHandler(event: DragEvent): void {
        console.log(event)
    }
    dragEndHandler(_event: DragEvent): void {
        console.log('drag end')
    }
    listenDragEvent(){
        this.element.addEventListener('dragstart',this.dragStartHandler)
        this.element.addEventListener('dragend',this.dragEndHandler)
    }

```
#### (2)為ProjectState添加切換Project.type的功能
```javascript
export class ProjectState extends State<Project>{
    private projects:Project[] = []; //資料陣列
    //...略
    switchProjectType(projectId:string,newProjectType:ProjectType){
        const project = this.projects.find(project=>{
            return project.id === projectId
        })
        if(project) {
            project.type = newProjectType
            //記得重新渲染資料
            this.updateState()
        }
    }
    private updateState(){
        for(let listernerFn of this.listeners){
            //pass 訂閱者 要的資料
            //使用slice複製資料，才不會改到原始資料
            listernerFn(this.projects.slice())
        }
    }
}
```
#### (3)讓ProjectList類別implements dropable
```javascript
class RenderList extends RenderHTML<HTMLElement, HTMLDivElement> implements Dropable{
    //...略
    @autobind
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){  //限定只能是text/plain
            event.preventDefault()  //告訴瀏覽器，這個類別允許drop(默認是禁止的)
            const listEle = this.element.querySelector('ul')! as HTMLUListElement
            // listEle.classList.add('droppable')  //為可以dropable的區域添加高亮CSS
            listEle.style.backgroundColor = 'black'
        }
    }
    @autobind
    dragLeaveHandler(_event: DragEvent): void {
        const listEle = this.element.querySelector('ul')! as HTMLUListElement
        // listEle.classList.remove('droppable')  //移除dropable的區域添加高亮CSS
        listEle.style.backgroundColor = 'white'
    }
    @autobind
    dropHandler(event: DragEvent): void {
        //取得拖曳元素的id
        const projectid = event.dataTransfer!.getData('text/plain')
        //切換ProjectItem的type
        const projectState = ProjectState.getInstance()
        projectState.switchProjectType(projectid,this.type === 'active'? ProjectType.ACTIVE : ProjectType.FINISHED)

    }
    listenDragEvent(){
        this.element.addEventListener('dragover',this.dragOverHandler)
        this.element.addEventListener('dragleave',this.dragLeaveHandler)
        this.element.addEventListener('drop',this.dropHandler)
    }
```
#### 為li元素添加draggable屬性
```html
 <template id="single">
    <li draggable="true">
      <h2></h2>
      <h3></h3>
      <p></p>
    </li>
  </template>
```


