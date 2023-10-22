<template>
  <div>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
/**
 * ol-
 *    -View 视图
 *
 *    -Map 构造地图
 *
 *    -layer 图层
 *      -Tile  切片图层/底层图层构造函数
 *      -Vector 创建矢量图层
 *
 *    -source 数据源
 *      -XYZ 本地离线瓦片所在路径
 *      -Vector 创建矢量数据源
 *
 *    -Feature 特性
 *
 *
 *    -geom 几何信息
 *      -Point   点
 *      -LineString  线
 *    -style 样式信息
 *      -Icon  自定义图片
 *      -Style  构建样式
 *      -Fill   填充
 *      -Circle 圆形
 *      -Stroke 边框
 *
 *
 *  */
import markeIcon from '../assets/alarm.png'
import { Map, View, Feature } from 'ol'
import { Tile } from 'ol/layer'
import { XYZ } from 'ol/source'
import { Point, LineString } from 'ol/geom'
import { Style, Stroke, Icon } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
export default {
  name: 'openLayers',
  data: () => {
    return {
      openMap: null,
      markeIcon: markeIcon,
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      /**1. 设置贴片图层 */
      let layer = new Tile({
        source: new XYZ({
          url: 'http://t{0-7}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles &TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=3c31d19c7941fccd5f91a08ff94e496a',
          // url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=3c31d19c7941fccd5f91a08ff94e496a', //parent.TiandituKey()为天地图密钥
          wrapX: true,
        }),
      })
      /** 2.设置视图 */
      let view = new View({
        center: [114.3, 30.5],
        zoom: 13,
        projection: 'EPSG:4326',
      })
      view.setMaxZoom(15)
      /**3. 挂载地图到指定target上 */
      this.openMap = new Map({
        target: 'map',
        layers: [layer],
        view: view,
      })
      this.initFeature()
    },

    /**通过几何信息和样式信息构建要素*/
    initFeature() {
      /**
       * 构建要素
       * 1.new Feature 构建几何信息
       * 2.new Style 构建样式信息
       */
      //点
      let point = new Feature({
        geometry: new Point([114.3, 30.5]),
      })
      let style = new Style({
        image: new Icon({
          width: '20',
          height: '20',
          src: require(`@/assets/alarm.png`),
          rotation: (Math.PI / 2) * 3,
        }),
      })
      // 线
      let line = new Feature({
        geometry: new LineString([
          [114.3, 30.5],
          [115.3, 31.5],
        ]),
      })
      let lineStyle = new Style({
        stroke: new Stroke({
          width: '3',
          color: '#000',
        }),
      })

      /**设置样式信息 */
      line.setStyle(lineStyle)
      point.setStyle(style)
      /** 把构建的要素加入到矢量数据源里 */
      let source = new VectorSource({
        features: [point, line],
      })
      /** 把数据源添加到矢量图层中 */
      let layer = new VectorLayer({
        source,
      })
      /**把矢量图层添加到地图容器 */
      this.openMap.addLayer(layer)
    },
  },
}
</script>

<style scoped lang="less">
.map {
  width: 100vw;
  height: 100vh;
}
</style>
