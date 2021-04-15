<template>
	<div class="all-writ-group" @click="clickHandle">
		<div class="writ-group-first"></div>
		<div class="writ-group-second">
			<div class="writ-group-second-bac"></div>
			<span>{{tipName[0]}}</span>
			<span>{{tipName[1]}}</span>
		</div>
		<div class="writ-group-third">
			<div class="writ-group-third-first writ-group-third-common"></div>
			<div class="writ-group-third-second writ-group-third-common"></div>
			<div class="writ-group-third-third writ-group-third-common"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'tips',
	props: {
    tipName: {
      type: Array,
      default: ()=> {
        return ['文书','合集']
      }
    }
	},
	methods: {
		clickHandle() {
			this.$emit('clickHandle')
		}
	}
};
</script>

<style lang="less" scoped>
.all-writ-group {
  display: flex;
  flex-direction: row;
  position: absolute;
  height: 60px;
  width: 35px;
  top: 20px;
  right: 10px;
  z-index: 102;
  cursor: pointer;
  transition: all 1s;
  // transform: translateX(30px);
  &:hover {
    // transform: translateX(0px);
    width: 65px;
    .writ-group-second {   
      transform: translate(1);
      .writ-group-second-bac {  
        // transform: translateZ(0px);
      }
    }

    span:first-of-type {
      display: inline-block;
      margin-top: 10px;
    }
    span:last-of-type {
      z-index: 104;
      display: inline-block;
    }
    .writ-group-third {
      .writ-group-third-common {
        width: 4px;
      }
    }
  }
  .writ-group-first {
    width: 8px;
    height: 40px;
    margin-top: 10px;
    margin-right: -4px;
    background-color: #64798a;
    z-index: 103;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .writ-group-second {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 50px;
    height: 60px;
    background-color: #0099ff;
    color: #fefefe;
    text-align: center;
    transform: translate(0.5);
    span {
      z-index: 104;
      display: none;
    }
    .writ-group-second-bac {
      position: absolute;
      width: 0;
      height: 0;
      // border-style: solid;
      // border-color: #0083cc;
      // border-top-color: transparent;
      // border-left-color: transparent;
      // border-width: 30px 25px 30px 25px;
      right: 0;
      top: 0;
      // transform: translateZ(10px);
    }
  }
  .writ-group-third {
    width: 7px;
    height: 60px;
    .writ-group-third-common {
      height: 16px;
      width: 4px;
      margin: 3px 0;
    }
    .writ-group-third-first {
      background-color: #44c4a1;
    }
    .writ-group-third-second {
      background-color: #ff4c3e;
    }
    .writ-group-third-third {
      background-color: #f9dc32;
    }
  }
}
</style>