const MongoClient = require('mongodb').MongoClient;
const GenericPool = require('generic-pool');
const factory = {
    create: function() {
        /** 创建链接 返回一个mongodb的client链接对象　**/
        return MongoClient.connect("mongodb://" + "localhost" + ":" + "27017", { useUnifiedTopology: true });
    },
    destroy: function(client) {//销毁链接
        client.close();//关闭链接，这里需要注意，形参client就是上面我们创建的对象
    }
}

const opts = {
    max: 20,//最大链接数
    min: 1//最小。。
}

const myPool = GenericPool.createPool(factory, opts);//就是在这里创建链接池

module.exports = myPool;//export给其他模块使用