<template>
  <div>
    <a :href="href">最简单的打开和保存</a>
  </div>
</template>

<script>
import baseUrl from '@/utils/webIp'
export default {
  name: "pageOffice",
  data() {
    return {
      href: ''
    }
  },
  created() {
    const s = document.createElement('script');
    const s2 = document.createElement('script');
    s.type = 'text/javascript';
    s2.type = 'text/javascript';
    s.src = baseUrl + '/aj/pageoffice.js';
    s2.src = baseUrl + '/aj/jquery.min.js';
    s.id = 'po_js_main';
    document.body.appendChild(s2);
    document.body.appendChild(s);

    this.href = `javascript:POBrowser.openWindowModeless('${baseUrl}/aj/word','width=1200px;height=800px;');`
  }
}
</script>

<style lang="less" scoped>
</style>
