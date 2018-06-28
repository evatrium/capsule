
import {initial_data} from "./data";
import {updateItemInObjArrById, removeItemFromObjArrById, findByIdInObjArr} from "@iosio/utils/lib/crud_operations";

const delay = (cb, del)=>{
        setTimeout(()=>{
            cb && cb();
        }, del ? del : 300)
    };

const delayPromise = (data, del)=>{
    return new Promise((resolve, reject)=>{
        let stringified = JSON.stringify(data, null, 4);
        delay(()=>resolve({data, stringified}), del);
    })
};


export class FakeApi {
    constructor(fake_api_url, fake_options) {
        this.fake_api_url = fake_api_url;
        this.fake_options = fake_options;
        this.data = initial_data;
    }

    getData = ( del)=>{
        return delayPromise(this.data, del);
    };


    updateByItemById = (item, del)=>{
        console.log('item to be updated on list', item);
        this.data = updateItemInObjArrById(this.data, 'id', item.id, item);
        console.log('updated list first item:', this.data[0]);
        return delayPromise(this.data, del);
    };
    
    deleteItemById = (item_id, del) => {
        this.data = removeItemFromObjArrById(this.data,'id',item_id);
        return delayPromise(this.data, del);
    };
    
    getItemById = (item_id, del) =>{
        let item = findByIdInObjArr(this.data,'id', item_id);
        return delayPromise(item, del);
    };
    
    requestAccess = (should_not_login = true, del)=>{
        
        const user = should_not_login ? {user: 'Joe Dirt', granted: true} : {granted:false};
        
        return delayPromise(user, del);
    }

}


