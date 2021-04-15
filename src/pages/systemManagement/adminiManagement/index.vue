<template>
  <div>
    <component :is="adminiManagementCurrentComponent"></component>
  </div>
</template>

<script>
import addAdministrator from "./addAdministrator/index";
import { mapState } from "vuex";
import adminList from "./adminList/index";

export default {
  name: "systemManagement",
  components: {
    adminList,
    addAdministrator,
  },
  computed: {
    ...mapState([
      "adminiManagementCurrentComponent"
    ])
  },
};
</script>