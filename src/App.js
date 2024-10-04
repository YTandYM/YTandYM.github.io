import React, { useEffect, useState } from 'react';
import { Button, Menu, Select, Drawer, message } from 'antd';
import AMapLoader from '@amap/amap-jsapi-loader';
import NotGoTo from './component/NotGoTo';

function App() {
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [open, setOpen] = useState(false);

  const [subPage, setSubPage] = useState('行程');

  const showDrawer = () => {
    if(selectedCity === ''){
      message.info('需要选择地级市哦');
      return;
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    var map, district, polygons = [];

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
          getData(result.districtList[0], 'province');
        }
      });

      function getData(data) {
        var bounds = data.boundaries;
        if (bounds) {
          for (var i = 0, l = bounds.length; i < l; i++) {
            var polygon = new AMap.Polygon({
              map: map,
              strokeWeight: 1,
              // strokeColor: '#0091ea',
              // fillColor: '#80d8ff',
              strokeColor: 'pink',
              fillColor: 'pink',
              fillOpacity: 0.2,
              path: bounds[i]
            });
            polygons.push(polygon);
          }
          map.setFitView(); // 地图自适应
        }

        var subList = data.districtList;
        console.log(subList);
        var level=subList[0].level;
        if (level === 'province') {
          setProvinceList(subList);
          setSelectedProvince('');
          setCityList([]);
          setSelectedCity('');
          setDistrictList([]);
          setSelectedDistrict('');
        } else if (level === 'city') {
          setCityList(subList);
          setSelectedCity('');
          setDistrictList([]);
          setSelectedDistrict('');
        } else if (level === 'district') {
          setDistrictList(subList);
          setSelectedDistrict('');
        }
      }

      window.search = function search(list, level, value) {
        // 清除地图上所有覆盖物
        for (var i = 0, l = polygons.length; i < l; i++) {
          polygons[i].setMap(null);
        }

        var option = list.find(item => item.name === value);
        if (!option) {
          return;
        }

        var adcode = option.adcode;
        district.setLevel(level); // 行政区级别
        district.setExtensions('all');
        // 行政区查询
        // 按照adcode进行查询可以保证数据返回的唯一性
        district.search(adcode, function (status, result) {
          if (status === 'complete') {
            getData(result.districtList[0]);
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
    <div style={{position:'relative'}}>
      <img src="appIcon.png" alt="App Icon" style={{ right: '10px', top:"0px", position: 'absolute', width: '50px', height: '50px' }} />
      <Menu 
        mode="horizontal"
        style={{backgroundColor: 'pink'}}
      >
        <Menu.Item key="province">
          省市区
          <Select 
            value={selectedProvince}
            style={{ width: '100px' }}
            onChange={(value) => {
              setSelectedProvince(value);
              window.search(provinceList, 'province', value);
            }}
            options={provinceList.map(item => ({ value: item.name, label: item.name }))}
          ></Select>
        </Menu.Item>
        <Menu.Item key="city">
          地级市
          <Select 
            disabled={cityList.length === 0}
            value={selectedCity}
            style={{ width: '100px' }}
            onChange={(value) => {
              setSelectedCity(value);
              window.search(cityList, 'city', value);
            }}
            options={cityList.map(item => ({ value: item.name, label: item.name }))}
          ></Select>
        </Menu.Item>
        <Menu.Item key="district">
          区县
          <Select 
            disabled={districtList.length === 0}
            value={selectedDistrict}
            style={{ width: '100px' }}
            onChange={(value) => {
              setSelectedDistrict(value);
              window.search(districtList, 'district', value);
            }}
            options={districtList.map(item => ({ value: item.name, label: item.name }))}
          ></Select>
        </Menu.Item>
        <Menu.Item>
          <Button 
            type="default"
            style={{backgroundColor: 'pink', border: '1px solid black'}}
            onClick={showDrawer}
          >
            查看
          </Button>
        </Menu.Item>
      </Menu>
      <div id="container" style={{ width: '100%', height: '100vh' }}></div>
      <Drawer 
        title={selectedProvince+" "+selectedCity+" "+selectedDistrict}
        onClose={onClose} 
        open={open}
        width={'80%'}
        style={{backgroundColor: 'pink'}}
      >
        <Menu
          mode="horizontal"
          style={{backgroundColor: 'pink'}}
          onClick={(e) => {setSubPage(e.key)}}
        >
          <Menu.Item key="行程">
            <p>行程</p>
          </Menu.Item>
          <Menu.Item key="图图">
            <p>图图</p>
          </Menu.Item>
          <Menu.Item key="杂项">
            <p>杂项</p>
          </Menu.Item>
        </Menu>
        {subPage === '行程' && <NotGoTo/>}
        {subPage === '图图' && <NotGoTo/>}
        {subPage === '杂项' && <NotGoTo/>}
      </Drawer>
    </div>
  );
}

export default App;