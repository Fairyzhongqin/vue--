import "../assets/css/public.css"

let myLoading = {};
myLoading.isLoading = false;
myLoading.install = function(Vue, options) {
  Vue.prototype.$loading = {};
  let page = Vue.extend({
    template: 
    `<div id='my-loading'>
      <div class='my-loading-bac'></div>
      <div class='my-is-loading'>
        <div class='my-is-loading-child1 my-is-loading-child'></div>
        <div class='my-is-loading-child2 my-is-loading-child'></div>
        <div class='my-is-loading-child3 my-is-loading-child'></div>
        <div class='my-is-loading-child4 my-is-loading-child'></div>
        <div class='my-is-loading-child5 my-is-loading-child'></div>
        <div class='my-is-loading-child6 my-is-loading-child'></div>
      </div>
    </div>`,
  })
  Vue.prototype.$loading.showLoading = () => {
    let item = document.querySelector("#my-loading");
    if(item == null) {
      let element = new page().$mount().$el;
      document.body.appendChild(element);
    }
  };
  Vue.prototype.$loading.hiddenLoading = function () {
    let item = document.querySelector("#my-loading");
    if(item && item !== null) {
      document.body.removeChild(item);
    }
  }
}
export default myLoading;