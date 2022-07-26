<template>
    <div ref="containerRef" class="container" @scroll="handleScroll($event)">
        <div class="container-placeholder" :style="{height:listHeight+'px'}"></div>
        <div ref="listRef" class="container-list" :style="{transform:'translate3d(0,'+top+'px,0)'}">
            <div
                ref="items"
                v-for="item in visibleData"
                :key="item.index"
                class="container-item"
            >
                <slot :item="item" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "virtualList2",
    props: {
        estimateHeight: Number,
        list: Array
    },
    data() {
        return {
            screenHeight: 0,
            start: 0,
            end: 0,
            top: 0,
            tick: false,
            positions:[],
            bufferScale:1
        }
    },
    computed: {
        visibleData() {
            let { start, end } = this
            start = start - this.aboveCount;
            end = end + this.belowCount;
            const res = this.list.slice(0, 10)
            return res
        },
        aboveCount(){
            return Math.min(this.start,this.bufferScale * this.visibleCount)
        },
        belowCount(){
            return Math.min(this.list.length - this.end,this.bufferScale * this.visibleCount);
        },
        visibleCount() {
            // const { itemHeight, screenHeight } = this
            return Math.min(this.list.length - this.end,this.bufferScale * this.visibleCount);
        },
        //列表总高度
        listHeight(){
            let res = this.positions[this.positions.length - 1].bottom;
            console.log(res)
            return res
        }
    },
    created() {
        this.initPositions()
        console.log(this.positions)
    },
    mounted() {
        this.screenHeight = this.$el.clientHeight;
        this.end = this.start + this.visibleCount
    },
    updated(){
        this.$nextTick(function () {
            if(!this.$refs.items || !this.$refs.items.length){
                return ;
            }
            //获取真实元素大小，修改对应的尺寸缓存
            this.updateItemsSize();
            //更新列表总高度
            // let height = this.positions[this.positions.length - 1].bottom;
            //this.$refs.phantom.style.height = height + 'px'

            //更新真实偏移量
            this.setStartOffset();
        })
    },
    updated2(){
        let nodes = this.$refs.items;
        nodes.forEach((node)=>{
            let rect = node.getBoundingClientRect();
            let height = rect.height;
            let index = +node.id.slice(1)
            let oldHeight = this.positions[index].height;
            let dValue = oldHeight - height;
            //存在差值
            if(dValue){
                this.positions[index].bottom = this.positions[index].bottom - dValue;
                this.positions[index].height = height;
                for(let k = index + 1;k<this.positions.length; k++){
                    this.positions[k].top = this.positions[k-1].bottom;
                    this.positions[k].bottom = this.positions[k].bottom - dValue;
                }
            }
        })
    },
    methods: {
        initPositions() {
            this.positions = this.list.map((item, index) => {
                return {
                    index,
                    height: this.estimateHeight,
                    top: index * this.estimateHeight,
                    bottom: (index + 1) * this.estimateHeight
                }
            })
            console.log(this.positions)
        },
        //获取列表起始索引
        getStartIndex(scrollTop = 0){
            let item = this.positions.find(i => i && i.bottom > scrollTop);
            return item.index;
        },
        //获取列表项的当前尺寸
        updateItemsSize(){
            let nodes = this.$refs.items;
            nodes.forEach((node)=>{
                let rect = node.getBoundingClientRect();
                let height = rect.height;
                let index = +node.id.slice(1)
                let oldHeight = this.positions[index].height;
                let dValue = oldHeight - height;
                //存在差值
                if(dValue){
                    this.positions[index].bottom = this.positions[index].bottom - dValue;
                    this.positions[index].height = height;
                    for(let k = index + 1;k<this.positions.length; k++){
                        this.positions[k].top = this.positions[k-1].bottom;
                        this.positions[k].bottom = this.positions[k].bottom - dValue;
                    }
                }

            })
        },
        //获取当前的偏移量
        setStartOffset(){
            let startOffset;
            if(this.start >= 1){
                let size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0);
                startOffset = this.positions[this.start - 1].bottom - size;
            }else{
                startOffset = 0;
            }
            this.top = startOffset
        },
        handleScroll() {
            if (!this.tick) {
                requestAnimationFrame(this.scrollFunc)
                this.tick = true
            }
        },
        scrollFunc() {
            let scrollTop = this.$refs.containerRef.scrollTop
            const { visibleCount } = this
            this.start = this.getStartIndex(scrollTop)
            this.end = this.start + visibleCount
            this.setStartOffset();

            this.tick = false
        }
    }
}
</script>

<style>
.container {
    position: relative;
    width: 100%;
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
