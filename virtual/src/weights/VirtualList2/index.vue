<template>
    <div ref="containerRef" class="container" @scroll="handleScroll($event)">
        <div class="container-placeholder" :style="{height:listHeight+'px'}"></div>
        <div ref="listRef" class="container-list" :style="{transform:'translate3d(0,'+top+'px,0)'}">
            <div
                v-for="item in visibleData"
                :key="item.index"
                class="container-item"
                :style="{height:itemHeight+'px',lineHeight:itemHeight+'px'}">
                <slot :item="item"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "virtualList2",
    props: {
        itemHeight: Number,
        list:Array
    },
    data() {
        return {
            screenHeight: 0,
            start: 0,
            end: 0,
            top: 0,
            tick: false
        }
    },
    computed: {
        listHeight() {
            return this.list.length * this.itemHeight
        },
        visibleData() {
            let { start, end } = this
            let start2 = start - 2
            let end2 = end + 2
            let len = this.list.length

            start = start2 < 0 ? 0 : start2
            end = end2 >= len ? len : end2
            return this.list.slice(start, end)
        },
        visibleCount() {
            const { itemHeight, screenHeight } = this
            return Math.ceil(screenHeight / itemHeight)
        }
    },
    mounted() {
        this.screenHeight = this.$el.clientHeight;
        this.end = this.start + this.visibleCount
    },
    methods: {
        handleScroll() {
            if (!this.tick) {
                requestAnimationFrame(this.scrollFunc)
                this.tick = true
            }
        },
        scrollFunc() {
            let top = this.$refs.containerRef.scrollTop
            const { itemHeight, visibleCount } = this
            this.start = Math.floor(top / itemHeight)
            this.end = this.start + visibleCount
            this.top = top - top % itemHeight

            this.tick = false
        }
    }
}
</script>

<style>
.container {
    position: relative;
    width: 100%;
    /*height: 500px;*/
    margin: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
}


.container-list {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
}

.container-item {
    box-sizing: border-box;
}
</style>
