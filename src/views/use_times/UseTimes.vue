<template>
  <div class="use-times">
    <OperationBG :navContent="navContent"></OperationBG>
      <div ref="lineChart" class="line-chart"></div>
      <div ref="pieChart" class="pie-chart"></div>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG"
  import echarts from "echarts"
  export default {
    components:{OperationBG},
    data() {
      return {
        navContent:{
          icon: '&#xe6f5;',
          text: '使用统计'
        },
      }
    },
    mounted(){
      this.createLineCharts()
      this.createPieCharts()
    },
    methods: {
      createLineCharts() {
        let result = [],
            xData = []
        for (let i = 1; i<30; i++) {
          xData.push(i)
          const temp = Math.round(Math.random()*30)
          result.push(temp)
        }
        this.linechart = echarts.init(this.$refs.lineChart)
        this.linechart.setOption({
          grid: { top:50 ,x: 40, y: 5},
          title: {
            text: '用户日操作统计',
            subtext: '',
            x: 'center'
          },
          tooltip: {},
          backgroundColor: 'transparent',
          barWidth: 15,
          splitLine: {show: false},
          xAxis: {
            type: 'category',
            axisLine: {show: false},
            data: xData
          },
          yAxis: {type:'value'},
          series: [{
            name: '统计',
            type: 'line',
            itemStyle: {normal: {color: 'cornflowerblue', label: {show: true, position: 'top'}}},
            data: result,
          }]
        })
      },
      createPieCharts() {
        this.linechart = echarts.init(this.$refs.pieChart)
        this.linechart.setOption({
          title: {
            text: '文件类型统计',
            // subtext: '文件类型统计',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['文档', '图片', '视频', '音频', '其他']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 17, name: '文档'},
                {value: 22, name: '图片'},
                {value: 13, name: '视频'},
                {value: 11, name: '音频'},
                {value: 7, name: '其他'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 20,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0.9, 0, 0, 0.6)'
                }
              }
            }
          ],
          color: ['rgb(130,214,229)', 'rgb(150,155,178)', 'rgb(250,219,92)', 'rgb(252,157,154)', 'rgb(200,190,169)']
        })
      },
    }
  }
</script>

<style scoped>
  .use-times{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .line-chart{
    width: 900px;
    height: 450px;
    display: inline-block;
    margin-right: 20px;
    margin-top: 20px;
  }
  .pie-chart{
    width: 300px;
    height: 400px;
    display: inline-block;
    margin-top: 40px;

  }
</style>
