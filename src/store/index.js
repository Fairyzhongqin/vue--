import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
console.info('store moduleFiles', modulesFiles.keys())
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // set './app.js' => 'app'
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})
let state = {},
    mutations = {},
    actions = {};
for (let item in modules) {
    state = { ...modules[item].state, ...state };
    mutations = { ...modules[item].mutations, ...mutations };
    actions = { ...modules[item].actions, ...actions };
}
// mutations.SAVE_ALL_INFO = function () {
//     sessionStorage.setItem("ORIGIN_INFO", JSON.stringify(modules));
// }
// mutations.CLEAR_ALL_INFO = function() {
//     let info = JSON.parse(sessionStorage.getItem("ORIGIN_INFO"));
//     for(let item in info) {
//         let name = `./${item}.js`;
//         modulesFiles(name).default.state = info[item].state;
//         // modules[item].state = info[item].state;
//     }
//     console.log(info);
//     // console.log(modulesFiles.keys())
//     console.log( modulesFiles(modulesFiles.keys()[25]), '00000000000')
//     console.log(Vue)
// }
let store = new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})

console.log('hhhhhh')
export default store