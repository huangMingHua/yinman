
module.exports = {
    entry: [
        "./pages1/index/class/class.js"
    ],

    output: {
        path: __dirname + '/pages/index/class/',
        publicPath: "/pages/home/class/",
        filename: 'class.js'
    },

    module: {
  loaders: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}
};