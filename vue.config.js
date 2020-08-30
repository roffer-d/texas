module.exports = {
    publicPath: "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: false,
    productionSourceMap: false,
    devServer:{
        port: 8888,
        proxy: {
            '/api': {
                target: 'http://localhost:8090',
                ws: true,
                changeOrigin: true,
            }
        },
        disableHostCheck:true
    }
}