const chessTree = {
    value: 'e4',
    color: 'white',
    deep: 0,
    index: 0,
    id: 0,
    children: [
        {
            value: 'e3',
            color: 'black',
            deep: 1,
            index: 1,
            children: [
                'A1','A2','A3','A4',
                [
                    {   value: 'A5',
                        color: 'black',
                        index: '7#1',
                        children: [
                            'B1','B2','B3','B4', [{
                                value: 'B5',
                                color: 'black',
                                deep: 12,
                                index: '12#1',
                                children: [
                                ]
                            }],
                            'B6', 'B7'
                        ]
                    },
                    {   value: 'C5',
                        color: 'black',
                        index: '7#2',
                        children: [
                            'B1','B2',
                            [{
                                value: 'B3',
                                color: 'black',
                                deep: 10,
                                index: '10#1',
                                children: [
                                    [{
                                        value: 'G1',
                                        color: 'black',
                                        deep: 11,
                                        index: '11#1',
                                        children: [
                                        ]
                                    }],
                                    [{
                                        value: 'G2',
                                        color: 'black',
                                        deep: 12,
                                        index: '12#1',
                                        children: [
                                        ]
                                    }]
                                    [{
                                        value: 'G3',
                                        color: 'black',
                                        deep: 13,
                                        index: '13#1',
                                        children: [
                                        ]
                                    }]
                                ]
                            }],
                            'B4', [{
                                value: 'B5',
                                color: 'black',
                                deep: 12,
                                index: '12#1',
                                children: [
                                ]
                            }],
                            'B6', 'B7'
                        ]
                    }
                ],
                'A6', 'A7',
                [
                    {
                        value: 'A8',
                        color: 'black',
                        index: '10#1',
                        children: [
                            'B1', 'B2', 'B3', 'B4', [{
                                value: 'B5',
                                color: 'black',
                                deep: 8,
                                index: '7#',
                                children: []
                            }],
                            'B6', 'B7'
                        ]
                    }
                ]
            ],
        },
        {
            value: 'e5',
            color: 'black',
            deep: 1,
            index: 2,
            children: [

            ]
        }
    ]
}

const searchIndex = '7#2';


const chessTreeObject = {
    value: 'e4',
    color: 'white',
    deep: 0,
    index: 0,
    id: 0,
    children: [
        {
            value: 'e3',
            color: 'black',
            deep: 1,
            index: 1,
            id: 1,
            children: [
                {
                    value: 'e5',
                    color: 'black',
                    deep: 2,
                    index: 2,
                    id: 2,
                    children: [
                        {
                            value: 'f3',
                            color: 'white',
                            deep: 3,
                            index: 3,
                            id: 3,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 4,
                                    index: 4,
                                    id: 4,
                                    children: [

                                    ]
                                },
                            ]
                        },
                        {
                            value: 'f4',
                            color: 'white',
                            deep: 5,
                            index: 5,
                            id: 5,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 6,
                                    index: 6,
                                    id: 6,
                                    children: [

                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    value: 'f4',
                    color: 'black',
                    deep: 7,
                    index: 7,
                    id: 7,
                    children: [
                        {
                            value: 'f6',
                            color: 'white',
                            deep: 8,
                            index: 8,
                            id: 8,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 9,
                                    index: 9,
                                    id: 9,
                                    children: [

                                    ]
                                },
                                {
                                    value: 'Bc6',
                                    color: 'black',
                                    deep: 99,
                                    index: 99,
                                    id: 99,
                                    children: [

                                    ]
                                },
                            ]
                        },
                        {
                            value: 'f7',
                            color: 'white',
                            deep: 10,
                            index: 10,
                            id: 10,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 4,
                                    deep: 100,
                                    index: 100,
                                    id: 100,
                                    children: [

                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            value: 'e5',
            color: 'black',
            deep: 11,
            index: 11,
            id: 11,
            children: [
            ]
        },
        {
            value: 'e3',
            color: 'black',
            deep: 101,
            index: 101,
            id: 101,
            children: [
                {
                    value: 'e5',
                    color: 'black',
                    deep: 102,
                    index: 102,
                    id: 102,
                    children: [
                        {
                            value: 'f3',
                            color: 'white',
                            deep: 103,
                            index: 103,
                            id: 103,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 104,
                                    index: 104,
                                    id: 104,
                                    children: [

                                    ]
                                },
                            ]
                        },
                        {
                            value: 'f4',
                            color: 'white',
                            deep: 105,
                            index: 105,
                            id: 105,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 106,
                                    index: 106,
                                    id: 106,
                                    children: [

                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    value: 'f4',
                    color: 'black',
                    deep: 107,
                    index: 107,
                    id: 107,
                    children: [
                        {
                            value: 'f6',
                            color: 'white',
                            deep: 108,
                            index: 108,
                            id: 108,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 109,
                                    index: 109,
                                    id: 109,
                                    children: [

                                    ]
                                },
                                {
                                    value: 'Bc6',
                                    color: 'black',
                                    deep: 199,
                                    index: 199,
                                    id: 199,
                                    children: [

                                    ]
                                },
                            ]
                        },
                        {
                            value: 'f7',
                            color: 'white',
                            deep: 10,
                            index: 10,
                            id: 10,
                            children: [
                                {
                                    value: 'Bc5',
                                    color: 'black',
                                    deep: 4,
                                    deep: 100,
                                    index: 100,
                                    id: 100,
                                    children: [

                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        }
    ]
}

function searchItem(chessTreeObject, id) {
    if (chessTreeObject.id === id) {
        return chessTreeObject.value;
    }

    return chessTreeObject.children.forEach((value, index, ar) => {
       return  searchItemRecursive(value, id);
    });

    return false;
}

function searchItemRecursive(object, id, moves) {
    // console.log('We in object with id=', object.id);

    if (object.id === id) {
        // console.log('searched id=', object.id);
        moves.unshift(object.value);
        return object;
    }

    if (!object.children.length) {
        // console.log('no children');
        return false;
    }

    let result = false;


    // console.log('Each before result for object with id=' + object.id, result);

    object.children.every((value, index, ar) => {
        result = searchItemRecursive(value, id, moves);
        // console.log('Each result for object with id=' + object.id, result);
        if (result) {
            moves.unshift(object.value);
            return false;
        }
        return true;
    });
    // console.log('Each after result for object with id=' + object.id, result);
    return result;
}


// node ./scripts/object/tree.test.js

const moves = [];
console.log(searchItemRecursive(chessTreeObject, 199, moves));
console.log(moves);




