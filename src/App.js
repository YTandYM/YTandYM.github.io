import React, { useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

function App() {
  useEffect(() => {
    var map, district, polygons = [];
    var citySelect = document.getElementById('city');
    var districtSelect = document.getElementById('district');
    var areaSelect = document.getElementById('street');

    window._AMapSecurityConfig = {
      securityJsCode: "2e803736ac0504da65adee814cc6d307",
    };

    AMapLoader.load({
      key: '16745912922e513b08ec609abc01ed10',
      version: '1.4.15',
      plugins: ['AMap.DistrictSearch', 'AMap.Polygon'],
    }).then((AMap) => {
      map = new AMap.Map('container', {
        center: [116.30946, 39.937629],
        zoom: 3
      });

      var opts = {
        subdistrict: 1,
        showbiz: false
      };
      district = new AMap.DistrictSearch(opts);
      district.search('中国', function (status, result) {
        if (status === 'complete') {
          getData(result.districtList[0]);
        }
      });

      function getData(data, level) {
        var bounds = data.boundaries;
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            var polygon = new AMap.Polygon({
              map: map,
              strokeWeight: 1,
              strokeColor: '#0091ea',
              fillColor: '#80d8ff',
              fillOpacity: 0.2,
              path: bounds[i]
            });
            polygons.push(polygon);
          }
          map.setFitView(); // 地图自适应
        }

        // 清空下一级别的下拉列表
        if (level === 'province') {
          citySelect.innerHTML = '';
          districtSelect.innerHTML = '';
          areaSelect.innerHTML = '';
        } else if (level === 'city') {
          districtSelect.innerHTML = '';
          areaSelect.innerHTML = '';
        } else if (level === 'district') {
          areaSelect.innerHTML = '';
        }

        var subList = data.districtList;
        if (subList) {
          var contentSub = new Option('--请选择--');
          var curlevel = subList[0].level;
          var curList = document.querySelector('#' + curlevel);
          curList.add(contentSub);
          for (var j = 0, len = subList.length; j < len; j++) {
            var name = subList[j].name;
            var levelSub = subList[j].level;
            // var cityCode = subList[j].citycode;
            contentSub = new Option(name);
            contentSub.setAttribute("value", levelSub);
            contentSub.center = subList[j].center;
            contentSub.adcode = subList[j].adcode;
            curList.add(contentSub);
          }
        }
      }

      window.search = function search(obj) {
        // 清除地图上所有覆盖物
        for (var i = 0, l = polygons.length; i < l; i++) {
          polygons[i].setMap(null);
        }
        var option = obj[obj.options.selectedIndex];
        // var keyword = option.text; // 关键字
        var adcode = option.adcode;
        district.setLevel(option.value); // 行政区级别
        district.setExtensions('all');
        // 行政区查询
        // 按照adcode进行查询可以保证数据返回的唯一性
        district.search(adcode, function (status, result) {
          if (status === 'complete') {
            getData(result.districtList[0], obj.id);
          }
        });
      }

      window.setCenter = function setCenter(obj) {
        map.setCenter(obj[obj.options.selectedIndex].center);
      }
    }).catch(e => {
      console.error(e);
    });

    return () => {
      // 清理代码
    };
  }, []);

  return (
    <div>
      <div id="container" style={{ width: '100%', height: '100vh' }}></div>

      <div className="input-card">
        <h4>下属行政区查询</h4>
        <div className="input-item">
          <div className="input-item-prepend"><span className="input-item-text">省市区</span></div>
          <select id='province' style={{ width: '100px' }} onChange={(e) => window.search(e.target)}></select>
        </div>
        <div className="input-item">
          <div className="input-item-prepend"><span className="input-item-text">地级市</span></div>
          <select id='city' style={{ width: '100px' }} onChange={(e) => window.search(e.target)}></select>
        </div>
        <div className="input-item">
          <div className="input-item-prepend"><span className="input-item-text">区县</span></div>
          <select id='district' style={{ width: '100px' }} onChange={(e) => window.search(e.target)}></select>
        </div>
        <div className="input-item">
          <div className="input-item-prepend"><span className="input-item-text">街道</span></div>
          <select id='street' style={{ width: '100px' }} onChange={(e) => window.setCenter(e.target)}></select>
        </div>
      </div>
    </div>
  );
}

export default App;