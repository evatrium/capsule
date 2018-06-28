import {uniqueID} from "@iosio/utils/lib/number_generation";
import {getRandomName} from "@iosio/utils/lib/rando";

export const createFakeData = (count) => {

    let data = [];

    for (let i = 0; i < count; i++) {
        data.push({
            id: uniqueID(),
            title: getRandomName(),
            completed: false
        })
    }

    return data;

};

// console.log(JSON.stringify(createFakeData(10), null, 4));

const item_example ={
    "id": "eedb9889-6557-017b-a554-f79e4e0159ae",
    "title": "these alternative",
    "completed": false
};


export let initial_data = [
    {
        "id": "eedb9889-6557-017b-a554-f79e4e0159ae",
        "title": "these alternative",
        "completed": false
    },
    {
        "id": "89bfeb17-ce89-1e06-e601-e71864cac997",
        "title": "fluid wheel",
        "completed": false
    },
    {
        "id": "c00e6f98-8edc-e50f-a82f-69c8e12317bf",
        "title": "blushing wedding",
        "completed": false
    },
    {
        "id": "48144dca-7b88-e5c8-023d-d121ce0a955f",
        "title": "unhealthy guidance",
        "completed": false
    },
    {
        "id": "37b18463-2f62-01b1-bb0f-9182b425b3b2",
        "title": "carefree chicken",
        "completed": false
    },
    {
        "id": "45fc14b7-1641-1d5b-770f-bd2602c5dfe0",
        "title": "glistening flow",
        "completed": false
    },
    {
        "id": "55c02c26-b104-1f5c-2ecf-960e14ee4662",
        "title": "loose pause",
        "completed": false
    },
    {
        "id": "e5cc5917-6163-7cbe-3825-fcebd9102d8e",
        "title": "quick aspect",
        "completed": false
    },
    {
        "id": "66b8a913-2f4f-c8a0-6b85-1deeb09f3750",
        "title": "alive cry",
        "completed": false
    },
    {
        "id": "55fdd28a-e0a7-b420-6538-a181afb1861a",
        "title": "infatuated salt",
        "completed": false
    }
];