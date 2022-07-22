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
    private listeners:any = []  //訂閱者陣列
    private projects:Project[] = []; //資料陣列
    private static instance:ProjectState; //單例實體
    private constructor(){}
    static getInstance(){
        if(ProjectState.instance){
            return ProjectState.instance
        }
        return ProjectState.instance = new ProjectState()
    }
    addListener(listernerFn:Function){ //供訂閱者註冊的方法
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
            this.assignProjects = projects
            this.renderProjects()
        })
        //...略
        this.renderContent()
    }
    //其他略...
    private renderProjects(){
        const listEle = this.element.querySelector('ul')! as HTMLUListElement
        console.log(listEle)
        for (let projectItem of this.assignProjects){
            //建立li
            const item = document.createElement('li')
            item.textContent = projectItem.title
            listEle.appendChild(item)
        }
    }
```
