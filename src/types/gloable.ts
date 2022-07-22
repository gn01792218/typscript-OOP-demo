export interface RenderOption{
    insertPosition:'afterbegin' | 'beforeend'
}

export interface Draggable {
    dragStartHandler(event:DragEvent):void
    dragEndHandler(event: DragEvent):void
}
export interface Dropable {
    dragOverHandler(event:DragEvent):void  //判斷是否可以drop
    dropHandler(event:DragEvent):void
    dragLeaveHandler(event:DragEvent):void
}