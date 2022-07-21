# Ts OOP Project
## 實作流程
### 1.建立渲染app的class
### 2.和input元素的互動 : 
#### 使用bind方法讓addEventListener抓的到class的this-->使用裝飾器(記得先打開ts config的experimentalDecorators)
### 3.驗證input的function
#### 1.定義Validatable interface
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
#### 2.製作validate()
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
#### 3.為getUserInput方法加裝驗證