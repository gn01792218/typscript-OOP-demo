import { Project, Listener } from '../../types/projectState/projectState'

//父類別，不需要被外面知道，不用export
//採用訂閱者模式
class State<T>{
    protected listeners:Listener<T>[] = []  //訂閱者陣列
    addListener(listernerFn:Listener<T>){ //供訂閱者註冊的方法
        this.listeners.push(listernerFn)
    }
}
//project的State
export class ProjectState extends State<Project>{
    private projects:Project[] = []; //資料陣列
    private static instance:ProjectState; //單例實體
    private constructor(){super()}
    static getInstance(){
        if(ProjectState.instance){
            return ProjectState.instance
        }
        return ProjectState.instance = new ProjectState()
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