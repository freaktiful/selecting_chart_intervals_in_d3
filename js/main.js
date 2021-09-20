/*
*    main.js
*    Mastering Data Visualization with D3.js
*    5.2 - Looping with intervals
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const MARGINHEIGHT = 400 - MARGIN.BOTTOM
const MARGINWIDTH = 900 - MARGIN.RIGHT

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const svgline = d3.select("#line-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

const gline = svgline.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

d3.csv("data/bar-data.csv").then(data => {
  data.forEach(d => {
    d.y = Number(d.y)
  })

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    //.domain([0, d3.max(data, d => d.y)])
    .domain([0, 1000])
    .range([HEIGHT, 0])

  const xAxisCall = d3.axisBottom(x)
  const xAxisGrid = d3.axisBottom(x).tickSize(-HEIGHT).tickFormat('').ticks(10);

  svg.append('g')
    .attr('class', 'x axis-grid')
    .attr('id', 'dom-grid')
    .attr("transform", `translate(${MARGIN.LEFT}, ${HEIGHT + MARGIN.TOP})`)
    .call(xAxisGrid);
  
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => d + "Hz")

  const yAxisGrid = d3.axisLeft(y).tickSize(-WIDTH).tickFormat('').ticks(4);

  svg.append('g')
    .attr('class', 'y axis-grid')
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    .call(yAxisGrid);

  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  var tip = d3.tip().attr('class', 'd3-tip')
        .html((EVENT, d) => {
          console.log(d)
          return `<div style="background-color:white;padding:6px;border-radius:5px">
                      <div><b>${d.date}</b></div>
                      <hr>
                      <div>Mesura de soroll: ${d.y}Hz</div>
                      </div>`
        })
  g.call(tip)

  const rects = g.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", d => y(d.y))
    .attr("x", (d) => x(d.date))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.y))
    .attr("fill", "grey")
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on("click", function (d) {
      windows = []
      document.getElementById("windows").innerHTML = addWindowText() 
      d3.selectAll('#rectwindow').remove()
      d3.selectAll("rect")
        .attr("fill", "grey")
      d3.select(this)
        .attr("fill", "#73EDFF");
      var x = document.getElementById("line-chart-display");
      if (x.style.display === "none") {
        x.style.display="block"
      }
    })
})

var datum = null
var scale = null

d3.csv("data/line-data.csv").then(data => {
  data.forEach(d => {
    d.measure = Number(d.measure)
  })

  datum = data
  
  const xline = d3.scaleBand()
    .domain(data.map(d => d.hour))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  scale = xline
  
  const yline = d3.scaleLinear()
    //.domain([0, d3.max(data, d => d.y)])
    .domain([0, 1000])
    .range([HEIGHT, 0])

  const xAxisCallLine = d3.axisBottom(xline).tickFormat((d, i) => {
    if (i%10 == 0) {
      return d
    } else return ""
  })
  const xAxisGridLine = d3.axisBottom(xline).tickSize(-HEIGHT).tickFormat('').ticks(10);

  svgline.append('g')
    .attr('class', 'x axis-grid')
    .attr('id', 'chart-grid')
    .attr("transform", `translate(${MARGIN.LEFT}, ${HEIGHT + MARGIN.TOP})`)
    .call(xAxisGridLine);
  
  gline.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCallLine)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCallLine = d3.axisLeft(yline)
    .ticks(5)
    .tickFormat(d => d + "Hz")

  const yAxisGridLine = d3.axisLeft(yline).tickSize(-WIDTH).tickFormat('').ticks(5);

  svgline.append('g')
    .attr('class', 'y axis-grid')
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    .call(yAxisGridLine);

  gline.append("g")
    .attr("class", "y axis")
    .attr("id", "y axis")
    .call(yAxisCallLine)

  gline.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#73EDFF')
    .attr('stroke-width', 4)
    .attr('d', d3.line()
      .x(d => xline(d.hour))
      .y(d => yline(d.measure))
    )
})

function scaleBandInvert(scale) {
  var domain = scale.domain();
  //var domelement = document.getElementById('chart-grid').getBoundingClientRect();
  //var paddingOuter = domelement.left// scale(domain[0]) + MARGIN.LEFT;
  var eachBand = scale.step();
  return function (value, offset) {
    var index = Math.floor((value - offset) / eachBand);
    return domain[Math.max(0,Math.min(index, domain.length-1))];
  }
}

function paintTooltip(e) {
    var val = scaleBandInvert(scale)(e.x, document.getElementById('chart-grid').getBoundingClientRect().left)

    return `<div style="background-color:white;padding:6px;border-radius:5px">
              <b>${val}</b>
            </div>`
}

const colors = ["yellow", "green", "red", "blue", "purple", "orange"]
var windows = []

var tipline = d3.tip().attr('class', 'd3-tip')
        .html(paintTooltip)
gline.call(tipline)

function addWindow(){

  var i = windows.length
  var classstart = 'rectstart_' + i
  var classend = 'rectend_' + i

  var color = colors[Math.floor(Math.random() * 6)]

  windows.push({x0: scaleBandInvert(scale)(MARGIN.LEFT + (WIDTH / 2) - 10, MARGIN.LEFT), 
                x1: scaleBandInvert(scale)(MARGIN.LEFT + (WIDTH / 2) + 10, MARGIN.LEFT), 
                color: color})
  document.getElementById("windows").innerHTML = addWindowText() 

  //Initial bar for the window
  svgline.append("rect").attr("class", classstart).attr("id", "rectwindow")
    .attr("width",1)
    .attr("height", HEIGHT)
    .attr("x", MARGIN.LEFT + (WIDTH / 2) - 10)
    .attr("y", MARGIN.TOP)
    .attr("fill",color)
    .attr("cursor", "move")
    .on('mouseover', tipline.show)
    .on('mouseout', tipline.hide)

  //Final bar for the window
  svgline.append("rect").attr("class", classend).attr("id", "rectwindow")
    .attr("width",1)
    .attr("height", HEIGHT)
    .attr("x", MARGIN.LEFT + (WIDTH / 2) + 10)
    .attr("y", MARGIN.TOP)
    .attr("fill",color)
    .attr("cursor", "move")
    .on('mouseover', tipline.show)
    .on('mouseout', tipline.hide)


    d3.selectAll("."+classstart).call(d3.drag().on("drag", function (e) {
      if (e.x >= MARGIN.LEFT) {
        d3.select(this).attr("x", e.x)
      }
      index = this.getAttribute("class").split('_')[1]
      windows[index].x0 = scaleBandInvert(scale)(e.x, MARGIN.LEFT)
      document.getElementById("windows").innerHTML = addWindowText()
    }))

    d3.selectAll("."+classend).call(d3.drag().on("drag", function (e) {
      if (e.x <= MARGIN.LEFT + WIDTH) {
        d3.select(this).attr("x", e.x)
      }
      index = this.getAttribute("class").split('_')[1]
      windows[index].x1 = scaleBandInvert(scale)(e.x, MARGIN.LEFT)
      document.getElementById("windows").innerHTML = addWindowText()
    }))

    

}

function addWindowText() {
  //console.log(scale)
  //console.log(datum)
  var string = ''
  for (var i=0; i<windows.length; i++) {  
    string += "<span style='color:" + windows[i].color + "'><b>Nueva ventana: </b></span>" + windows[i].x0 + ', ' + windows[i].x1 + '<hr>'
  }
  return string
}