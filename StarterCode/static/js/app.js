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
var sortOTUs = ["hw","challenge","plotly","script","java","camp","boot","science","data","rutgers"]
var textInfo = ["hw","challenge","plotly","script","java","camp","boot","science","data","rutgers"]

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

    var bubbleX = [1, 2, 3, 4]
    var bubbleY = [26, 27, 28, 29]

    //BUBBLE DEFAULT
    var maxmarkerSize = 40;
    var size = []
    maxmarkerSize.map(function(d) {
        d.push(size)
    });
    console.log(size)
    var traceBubble = {
        x: bubbleX,
        y: bubbleY,
        text: textInfo,
        mode: 'markers',
        marker: {
        size: size,
        //set 'sizeref' to an 'ideal' size given by the formula sizeref = 2. * max(array_of_size_values) / (desired_maximum_marker_size ** 2)
        sizeref: 2.0 * d3.max(size) / (maxmarkerSize**2),
        sizemode: 'area'
        }
    };
    // var traceBubble = {
    //     x: bubbleX,
    //     y: bubbleY,
    //     text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
    //     mode: 'markers',
    //     marker: {
    //       color: "red",
    //       size: 5
    //     }
    //   };

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
        //setting a variable to ensure proper reading
        var names = d.names;
        //console.log(names)

        //setting up variable and filtering for the charts
        var samples = d.samples;
        var filterArray = samples.filter(sampleObject=>sampleObject.id==sample);
        var sampleValues = filterArray[0].sample_values;
        var otuIds = filterArray[0].otu_ids;

        //filtering data for the demographic info panel
        var metaData = d.metadata;
        var filterMeta = metaData.filter(sampleObject=>sampleObject.id==sample);
        //var filterMetaData = filterMeta[0]
        var slicedMeta = filterMeta.slice()
        
        //inserting the demographic info to the panel
        d3.select(".panel-body")
            .selectAll("div")
            .data(slicedMeta)
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
        //console.log(otuLabels)
        
        //var dropdownMenu = d3.select("#selDataset");
        //var dataset = dropdownMenu.property("value");

        //creating empty lists for the (bar)chart info
        var sortOTUs = [];
        var dataData = [];
        var textInfo = [];
        //sorting the data into variables to call later
        var sortOTU = otuIds.sort((a,b)=>b-a).slice(0,10).reverse()
        var dataData = sampleValues.sort((a,b)=>b-a).slice(0,10).reverse()
        var textInfo = otuLabels.sort((a,b)=>b-a).slice(0,10).reverse()
        
        // making the OTU ID's into a string for the bar chart Y axis labels
        sortOTU.forEach(function(xx) {
            sortOTUs.push(`OTU ${xx}`)
        })




        
        //BUBBLE WORK***************
        var bubbleX = otuIds.sort((a,b)=>b-a).reverse()
        var bubbleY = sampleValues.reverse()
        var size = sampleValues.reverse()
        console.log(bubbleX)
        console.log(bubbleY)

        var maxmarkerSize = d3.max(sampleValues)
        //var desired_maximum_marker_size = sampleValues.max()
        console.log(maxmarkerSize)

        var sizeRef = 2.0 * d3.max(size) / (maxmarkerSize**2)
        console.log(sizeRef)






        
        // Call function to update the chart
        updatePlotlyBarX(dataData);
        updatePlotlyBarY(sortOTUs);
        updatePlotlyBarText(textInfo);

        updatePlotlyBubbleX(bubbleX);
        updatePlotlyBubbleY(bubbleY);
        updatePlotlyBubbleSize(size);
        updatePlotlyBubbleText(textInfo);
        updatePlotlyBubbleSizeref(sizeRef);
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
function updatePlotlyBarText(newdata) {
    Plotly.restyle("bar", "text", [newdata]);
}
function updatePlotlyBubbleX(newdata) {
    Plotly.restyle("bubble", "x", [newdata]);
}
function updatePlotlyBubbleY(newdata) {
    Plotly.restyle("bubble", "y", [newdata]);
}
function updatePlotlyBubbleSize(newdata) {
    Plotly.restyle("bubble", "marker", "size", [newdata]);
}
function updatePlotlyBubbleText(newdata) {
    Plotly.restyle("bubble", "text", [newdata]);
}
function updatePlotlyBubbleSizeref(newdata) {
    Plotly.restyle("bubble", "marker", "sizeref", [newdata]);
}

//calling defaults
defaultplot()