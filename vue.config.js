const constant = require('./public/server/utils/Constant')

module.exports = {
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false,
    productionSourceMap: false,
    devServer:{
        port: constant.CLIENT_PORT,
        proxy: {
            '/api': {
                target: `http://localhost:${constant.SERVER_PORT}`,
                ws: true,
                changeOrigin: true,
            }
        },
        disableHostCheck:true
    }
}