<template>
  <div class="main">
    <div class="mapBox" id="map_1"></div>
    <div class="echartBox">
      <div ref="chart" id="echartMap"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
// import china from './china.json'
export default {
  name: 'mapDemo',
  data: () => {
    return {
      /**区域搜索设置 */
      opts: {
        subdistrict: 3,
        extensions: 'all',
      },
      aMap: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap()
    })
  },
  methods: {
    /**初始化高德地图 */
    initMap() {
      /* eslint-disable */
      const map = new AMap.Map('map_1', {
        resizeEnable: true,
        zoom: 3,
      })
      this.aMap = map
      this.district = new AMap.DistrictSearch(this.opts)
      this.district.search('中国', (status, result) => {
        if (status == 'complete') {
          this.getData(result.districtList[0], '', 100000)
        }
      })
    },
    /**初始化echart地图 */
    initChart(mapName, data) {
      this.echartsMap = echarts.init(document.getElementById('echartMap'))
      console.log(this.echartsMap)
      const option = {
        geo: {
          map: mapName,
        },
      }
      echarts.registerMap(mapName, data)
      this.echartsMap.setOption(option)
      this.echartsMap.on('click', this.echartsMapClick)
    },
    getData(data, level, adcode) {
      var subList = data.districtList
      if (subList) {
        var curlevel = subList[0].level
        if (curlevel === 'street') {
          // 如果为区县 特殊处理mapJson
          let mapJsonList = this.geoJsonData.features
          let mapJson = {}
          for (let i in mapJsonList) {
            if (mapJsonList[i].properties.name == this.cityName) {
              mapJson.features = [].concat(mapJsonList[i])
            }
          }
          this.mapData = []
          this.mapData.push({
            name: this.cityName,
            value: Math.random() * 100,
            level: curlevel,
          })
          this.initChart(this.cityName, mapJson)
          this.geoJsonData = mapJson
          return
        }
        //街道级以上的数据处理方式
        this.mapData = []
        for (var i = 0, l = subList.length; i < l; i++) {
          var name = subList[i].name
          var cityCode = subList[i].adcode
          this.mapData.push({
            name: name,
            value: Math.random() * 100,
            cityCode: cityCode,
            level: curlevel,
          })
        }
        this.loadMapData(adcode)
      }
    },
    loadMapData(areaCode) {
      AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
        var districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true,
          map: this.map,
        }))

        districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
          if (error) {
            console.error(error)
            return
          }
          let mapJson = {}
          mapJson.features = areaNode.getSubFeatures()
          this.geoJsonData = mapJson
          this.initChart(this.cityName, mapJson)
        })
      })
    },
    /**charts地图点击事件 */
    echartsMapClick(params) {
      if (this.polygon) this.aMap.remove(this.polygon)
      this.district.search(params.name, (status, result) => {
        if (status == 'complete') {
          console.log(result)
          this.cityName = params.name
          this.getData(
            result.districtList[0],
            '',
            result.districtList[0].adcode
          )
          let bounds = result.districtList[0].boundaries
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              this.polygon = new AMap.Polygon({
                map: this.aMap,
                strokeWeight: 1,
                strokeColor: '#02B8B5',
                fillColor: '#80d8ff',
                fillOpacity: 0.2,
                path: bounds[i],
              })
            }

            this.aMap.add(this.polygon)
            this.aMap.setFitView(this.polygon) //地图自适应
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.main {
  display: flex;
}
.mapBox {
  width: 50%;
  height: 800px;
}
.echartBox {
  width: 50%;
  height: 800px;
}
#echartMap {
  width: 100%;
  height: 100%;
}
</style>
