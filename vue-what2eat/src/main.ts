import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import CoreuiVue from "@coreui/vue";
Vue.use(CoreuiVue);
import { CButton, CProgress, CTab, CCollapse } from "@coreui/vue";

Vue.component("CButton", CButton);
Vue.component("CProgress", CProgress);
Vue.component("CTab", CTab);
Vue.component("CCollapse", CCollapse);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
