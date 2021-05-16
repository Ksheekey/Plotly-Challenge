// reading the json file
d3.json("./samples.json").then((d) => {
    d3.select("#selDataset")
            .selectAll("option")
            .data(d.names)
            .enter()
            .append("option")
            .html(function(d) {
                return `<option value=${d}>${d}</option>`
            })
})


// setting default arrays
var dataData = [1,2,3,4,5,6,7,8,9,10]
var sortOTUs = ["top","mij","mil","tjr","eth","sgh","n6t","ngs","hhh","bdf"]
var textInfo = ["top","mij","mil","tjr","eth","sgh","n6t","ngs","hhh","bdf"]

// Display the default plot
function defaultplot() {
    //BAR CHART DEFAULT
    var traceBar = {
        x:dataData,
        y:sortOTUs,
        text:textInfo,
        type:"bar",
        orientation:"h"
    }

    var dataBar = [traceBar]

    var layoutBar = {
        title: 'Hover over the points to see the text',
    };

    //BUBBLE DEFAULT
    var traceBubble = {
        x: [1, 2, 3, 4],
        y: [10, 11, 12, 13],
        text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
        mode: 'markers',
        marker: {
          color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          size: [40, 60, 80, 100]
        }
      };

    var dataBubble = [traceBubble]

    var layoutBubble = {
        title: 'Bubble Chart Hover Text',
        showlegend: false,
        height: 500,
        width: 1100
      };

    //DISPLAY DEFAULTS
    Plotly.newPlot("bar", dataBar, layoutBar)
    Plotly.newPlot("bubble", dataBubble, layoutBubble)
}

// On change to the DOM, call getData()
d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(sample) {
    d3.json("./samples.json").then((d) => {
        var names = d.names;
        var samples = d.samples;
        var filterArray = samples.filter(sampleObject=>sampleObject.id==sample);
        var sampleValues = filterArray[0].sample_values;
        var otuIds = filterArray[0].otu_ids;
        var metaData = d.metadata;
        var filterMeta = metaData.filter(sampleObject=>sampleObject.id==sample);
        var filterMetaData = filterMeta[0]
        var abc = filterMeta.slice()
        
        d3.select(".panel-body")
            .selectAll("div")
            .data(abc)
            .enter()
            .append("div")
            .html(function(d) {
                return `<div>id: ${d.id}</div>
                <div>ethnicity: ${d.ethnicity}</div>
                <div>gender: ${d.gender}</div>
                <div>age: ${d.age}</div>
                <div>location: ${d.location}</div>
                <div>bbtype: ${d.bbtype}</div>
                <div>wfreq: ${d.wfreq}</div>`

            })

        



        var otuLabels = filterArray[0].otu_labels;
        console.log(otuLabels)
        
        var dropdownMenu = d3.select("#selDataset");
        var dataset = dropdownMenu.property("value");
        var sortOTUs = [];
        var dataData = [];
        
        //
        var sortOTU = otuIds.sort((a,b)=>b-a).slice(0,10).reverse()
        var dataData = sampleValues.sort((a,b)=>b-a).slice(0,10).reverse()

        sortOTU.forEach(function(xx) {
            sortOTUs.push(xx)
        })
        
        console.log(sortOTUs)
        console.log(dataData)

        // Call function to update the chart
        updatePlotlyBarX(dataData);
        //updatePlotlyBarY(sortOTUs);
    })

    //resetting the demographic info after each selection
    d3.select(".panel-body").html("")
}

//Update the restyled plot's values
function updatePlotlyBarX(newdata) {
    Plotly.restyle("bar", "x", [newdata]);
}
function updatePlotlyBarY(newdata) {
    Plotly.restyle("bar", "y", [newdata]);
}


defaultplot()