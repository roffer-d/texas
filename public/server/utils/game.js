const game = {
    basePokerList:[
        {label:'A',value:1,color:1},{label:'A',value:1,color:2},{label:'A',value:1,color:3},{label:'A',value:1,color:4},
        {label:'K',value:13,color:1},{label:'K',value:12,color:2},{label:'K',value:13,color:3},{label:'K',value:13,color:4},
        {label:'Q',value:12,color:1},{label:'Q',value:12,color:2},{label:'Q',value:12,color:3},{label:'Q',value:12,color:4},
        {label:'J',value:11,color:1},{label:'J',value:11,color:2},{label:'J',value:11,color:3},{label:'J',value:11,color:4},
        {label:'10',value:10,color:1},{label:'10',value:10,color:2},{label:'10',value:10,color:3},{label:'10',value:10,color:4},
        {label:'9',value:9,color:1},{label:'9',value:9,color:2},{label:'9',value:9,color:3},{label:'9',value:9,color:4},
        {label:'8',value:8,color:1},{label:'8',value:8,color:2},{label:'8',value:8,color:3},{label:'8',value:8,color:4},
        {label:'7',value:7,color:1},{label:'7',value:7,color:2},{label:'7',value:7,color:3},{label:'7',value:7,color:4},
        {label:'6',value:6,color:1},{label:'6',value:6,color:2},{label:'6',value:6,color:3},{label:'6',value:6,color:4},
        {label:'5',value:5,color:1},{label:'5',value:5,color:2},{label:'5',value:5,color:3},{label:'5',value:5,color:4},
        {label:'4',value:4,color:1},{label:'4',value:4,color:2},{label:'4',value:4,color:3},{label:'4',value:4,color:4},
        {label:'3',value:3,color:1},{label:'3',value:3,color:2},{label:'3',value:3,color:3},{label:'3',value:3,color:4},
        {label:'2',value:2,color:1},{label:'2',value:2,color:2},{label:'2',value:2,color:3},{label:'2',value:2,color:4}
    ],
    //生成底牌
    genPokers(len){
        let count = this.basePokerList.length
        let ret = []
        while (ret.length < len){
            let random = Math.floor(Math.random() * count)
            if(!ret.includes(random)){
                ret.push(this.basePokerList[random])
            }
        }

        return ret
    }
}

module.exports = game