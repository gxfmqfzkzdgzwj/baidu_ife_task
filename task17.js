/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  // nowSelectCity: -1,
  // nowGraTime: "day"
  nowSelectCity: "北京",
  nowGraTime: "day"
}

//定义一个北京数组
var bgcolor = ['red','blue','yellow','black','green','orange'];

/**
 * 渲染图表 将内部renderData换为chardata
 */
//获取长度可以自己手写一个函数
  function getLength(o){
     var t = typeof o;
     if(t == 'string')
           return o.length;
      else if(t == 'object')
      {
         var n = 0;
         for(var i in o){
               n++;
         }
             return n;
       }
       return false;

  } 

function renderChart() {
  var city = pageState.nowSelectCity;
 // console.log(city);

  var Time = pageState.nowGraTime;
  //console.log(Time);
  var aqi_chart = document.getElementsByClassName("aqi-chart-wrap")[0];
  var dat = new Date("2016-01-01");
  var datStr;
 // console.log(chartData);

  //此处js获取对象length出现错误 结果为undefined  自己手动定义一个获取长度的函数
  aqi_chart.innerHTML = '';
  
  for(var o in chartData)
  {
     //datStr = getDateStr(dat);
     //console.log(datStr);
     var chart_div = document.createElement('div');
     chart_div.className = 'chartbox';
     aqi_chart.appendChild(chart_div);
     
     chart_div.title =  o;/////////////////////////////这儿为什么不显示
     chart_div.style.height = chartData[o];
     chart_div.style.backgroundColor = bgcolor[Math.ceil(Math.random()*5)];
     if(Time == "day")
        chart_div.style.width = 5 + 'px';
     else if(Time == "week")  
        chart_div.style.width = 10 + 'px';
     else if(Time == "month")
        chart_div.style.width = 20 + 'px';
    // dat.setDate(dat.getDate() + 1);
  }  
  console.log(aqi_chart);  
}

/**
 * 日、周、月的radio事件点击时的处理函数  //这个应该不对 
 */
function graTimeChange(event) {
  // 确定是否选项发生了变化
  var event = event || window.event;
  var target = event.target || event.srcElement;

  if(target.value == pageState.nowGraTime)
    return;
  else    
    {
     // console.log(target.value);
      pageState.nowGraTime = target.value;  // 设置对应数据
      initAqiChartData(); 
      renderChart();  // 调用图表渲染函数
    }

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var citySelect = document.getElementById("city-select");
  if(citySelect.value == pageState.nowSelectCity)
  {      
      return;
  }
  else    
    {
      //console.log(citySelect.value);
      //alert(citySelect.value);
      pageState.nowSelectCity = citySelect.value;  // 设置对应数据
     // console.log(pageState.nowSelectCity);
      initAqiChartData(); 
      renderChart();  // 调用图表渲染函数
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var form_gra_time = document.getElementById("form-gra-time");
  console.log(form_gra_time);
  form_gra_time.onchange = function(){
    graTimeChange();
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
var city_select = document.getElementById("city-select");
console.log(city_select);
var cityList = new Array();
var i = 0;
//var option = document.creatElement("option");
for(var city in aqiSourceData)
{
  cityList[i] = city;
  if(cityList[i] != "北京") 
     city_select.add(new Option(city,cityList[i]));//下拉列表添加与其他标签添加方式不同
}

//到这里都没有问题
city_select.onchange = function(){
  citySelectChange();
}

//添加onclick无效必须添加onchange事件
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
}

/**
 * 初始化图表需要的数据格式
 */
//如何计算一个月有多少天
function getCont(cur){
  var curDate = new Date(cur);
  console.log(curDate);
  var curMonth = curDate.getMonth();
 // console.log(curMonth);
  curDate.setMonth(curMonth+1);
  curDate.setDate(0);
  return curDate.getDate();
}



function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var aqi_chart = document.getElementsByClassName("aqi-chart-wrap")[0];
  var length = 31;
  var city = pageState.nowSelectCity;
  var renderData =  aqiSourceData[city];
 // console.log(renderData);
  var Time = pageState.nowGraTime;
  var sum = 0,daycnt = 0,id = 1,daynum = 0,totalday,Nowday;
  var totalday = getLength(renderData);
 // console.log(totalday);
  if(Time == "day")
  {
    chartData = {};
    chartData = aqiSourceData[city];
  }
  else if(Time == "week")
  {
    chartData = {};
    for(var day in renderData)
    {      
       var date = new Date(day);
       daynum++;
       daycnt++;
       sum += renderData[day];    
       if(date.getDay() == 0)
       {         
        chartData['第'+ id +'周'] = parseInt(sum/daycnt);
        sum = 0;
        daycnt = 0;
        id++;
        Nowday = daynum;        
       }
       if(totalday - Nowday < 7 && totalday - Nowday > 0)//最后不足一周  暂时这么办  不知道可不可行
       {
          chartData['第'+ id +'周'] = parseInt(sum/daycnt);
       }

    }

  // console.log(chartData);
  }
  else if(Time == "month")
  {
    chartData = {};
    sum = 0;
    daycnt = 0;
    daynum = 0;
    id = 1;
    for(var day in aqiSourceData[city])
    {
      var date = new Date(day);
   //   console.log(date.getDate());

//      console.log(getCont(date)+'天');//求天数的函数有错误  当前日期为30号时 求得天数为29天     

  //   console.log(length);
      sum += renderData[day];
      daynum++;
      daycnt++;
      //为什么if判断内部赋值不改变外部length的值////////////////////////////////////////////////
      console.log(length);
      //思路错了  周的思路应该也错了
      if(date.getDate() == length)
      {
        chartData['第'+id+'月'] = parseInt(sum/daycnt);
        sum = 0;
        daycnt = 0;
        Nowday = daynum;
        id++;
        if(id == 2)
          length = 29;
        else
          length = 30;
       // console.log(length);
//        console.log(date);

      }

    }

 }
 // console.log(Time);
 // console.log(chartData);
}

/**
 * 初始化函数
 */
function init() {
 initGraTimeForm()
 initCitySelector();
 initAqiChartData();
 renderChart();
}

init();

/*
document.getElementById("sect").value  -----这是获得选中的值
document.getElementById("sect").options------这是获得select中所有的值，是个数组

*/

//日周月的点击函数有问题
//一个月总共天数的求取有问题
//对于一个对象，例如charData 当不清空时 原来值就一直存在 影响数据显示
//script引入要放在body的前面 尽量不要放在head里 这样节点元素还未加载 容易报错
//设置title属性当鼠标停在上面即可显示
//对于一些局部变量 例如for循环里定义变量 在其内部if中修改，对于if外仍然显示变量为修改  这时最好将其定义为全局变量 作用域吗这块应该是