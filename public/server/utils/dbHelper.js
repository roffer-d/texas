const texasPool = require('./MongoPool');

const helper = {
    /**
     * @desc 查询数据
     * @param {String} dbName 数据库名称
     * @param {String} collection 集合（表）名
     * @param {Object} query 查询条件
     * @date 2020-08-12 16:02:01
     * @author Dulongfei
     *
     */
    find(dbName, collection, query = {}) {
        return new Promise((resolve, reject) => {
            const resoursePro = texasPool.acquire();//在这里请求一个连接池的连接，它返回的是一个promise对象，如果不明白的给个链接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
            resoursePro.then((client) => {
                let cursor = client.db(dbName).collection(collection).find(query);
                let somethign = cursor.toArray();
                somethign.then((result) => {
                    resolve(result)
                    texasPool.release(client).then(() => {//归还连接
                        console.log('release')
                    });
                }).catch((err) => {
                    texasPool.release(client).catch((err) => {
                        console.log(err)
                        reject(err)
                    })
                })
            })
        })
    },
    /**
     * @desc 插入数据
     * @param {String} dbName 数据库名称
     * @param {String} collection 集合（表）名
     * @param {Object} insertObj 插入的数据，自动判断单条(insertOne)、多条数据(insertMany)插入
     * @date 2020-08-12 15:58:43
     * @author Dulongfei
     *
     */
    save(dbName, collection, insertObj) {
        return new Promise((resolve, reject) => {
            const resoursePro = texasPool.acquire();
            resoursePro.then((client) => {
                let cursor = client.db(dbName).collection(collection);

                let method = insertObj && insertObj instanceof Array ? 'insertMany' : 'insertOne'

                cursor[method](insertObj, (err, res) => {
                    if (err) throw err;
                    console.log("插入的文档数量为: " + res.insertedCount);
                    resolve(res)
                    client.close();
                });
            })
        })
    },
    /**
     * @desc 更新数据
     * @param {String} dbName 数据库名称
     * @param {String} collection 集合（表）名
     * @param {Object} where 查询条件
     * @param {Object} update 修改内容
     * @param {Boolean} many 是否更新多条，默认false更新第一条
     * @date 2020-08-12 15:58:43
     * @author Dulongfei
     *
     */
    update(dbName, collection, where, update, many = false) {
        return new Promise((resolve, reject) => {
            const resoursePro = texasPool.acquire();
            resoursePro.then((client) => {
                let cursor = client.db(dbName).collection(collection);

                let method = many ? 'updateMany' : 'updateOne'
                console.log(method)
                cursor[method](where, update, function (err, res) {
                    if (err) throw err;
                    console.log("文档更新成功");
                    resolve(res)
                    client.close();
                });
            })
        })
    },
    /**
     * @desc 更新数据
     * @param {String} dbName 数据库名称
     * @param {String} collection 集合（表）名
     * @param {Object} where 查询条件
     * @param {Boolean} many 是否删除多条，默认false删除第一条
     * @date 2020-08-12 15:58:43
     * @author Dulongfei
     *
     */
    del(dbName, collection, where, many = false) {
        return new Promise((resolve, reject) => {
            const resoursePro = texasPool.acquire();
            resoursePro.then((client) => {
                let cursor = client.db(dbName).collection(collection);

                let method = many ? 'deleteMany' : 'deleteOne'
                console.log(method)
                cursor[method](where, (err, res) => {
                    if (err) throw err;
                    console.log("文档删除成功");
                    resolve(res)
                    client.close();
                });
            })
        })
    },
}

module.exports = helper