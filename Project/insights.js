(async function() {
    const svg = d3.select("svg");
    const margin = { top: 20, right: 20, bottom: 100, left: 100 }; // Increase left margin
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    let data = await d3.csv("world-data-2023.csv");
    const keys = ["Agricultural Land( %)", "Land Area(Km2)", "Armed Forces size",
                         "Birth Rate", "Co2-Emissions", "CPI", "CPI Change (%)", "Fertility Rate", "Forested Area (%)", 
                         "GDP", "Gross primary education enrollment (%)", "Gross tertiary education enrollment (%)", 
                         "Infant mortality", "Life expectancy", "Maternal mortality ratio", "Out of pocket health expenditure", 
                         "Physicians per thousand", "Population", "Population: Labor force participation (%)", "Tax revenue (%)", 
                         "Total tax rate", "Unemployment rate", "Urban_population"];
    
    // Populate dropdown
    const select = d3.select("#attribute");
    select.selectAll("option")
        .data(keys)
        .enter().append("option")
        .text(d => d)
        .attr("value", d => d);

    // Setup scales
    const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    const yScale = d3.scaleLinear().range([height, 0]);
    const xAxis = chart.append("g").attr("transform", `translate(0,${height})`);
    const yAxis = chart.append("g");

    // Setup tooltip
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("padding", "10px")
        .style("background", "white")
        .style("border", "1px solid black")
        .style("pointer-events", "none");

    window.updateVisualization = function() {
        const selectedAttribute = select.property("value");
        const topN = +d3.select("#numCountries").property("value");

        // Update the chart title dynamically
        d3.select("#chartTitle").text(`Top ${topN} Countries by ${selectedAttribute}`);

                data.forEach(d => {
            if (typeof d[selectedAttribute] === 'string') {
                d[selectedAttribute] = +d[selectedAttribute].replace(/[, $%]/g, "");
            } else if (typeof d[selectedAttribute] === 'number') {
                d[selectedAttribute] = +d[selectedAttribute];
            } else {
                d[selectedAttribute] = 0;
            }
        });

        const sortedData = data.sort((a, b) => b[selectedAttribute] - a[selectedAttribute]).slice(0, topN);

        xScale.domain(sortedData.map(d => d.Country));
        yScale.domain([0, d3.max(sortedData, d => d[selectedAttribute])]);

        const bars = chart.selectAll(".bar")
            .data(sortedData, d => d.Country);

        bars.enter().append("rect")
            .attr("class", "bar")
            .merge(bars)
            .attr("x", d => xScale(d.Country))
            .attr("y", d => yScale(d[selectedAttribute]))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d[selectedAttribute]))
            .on("mouseover", function(event, d) {
                tooltip.style("display", "block")
                       .html(`${d.Country}<br>${selectedAttribute}: ${d[selectedAttribute]}`)
                       .style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            });

        xAxis.call(d3.axisBottom(xScale)).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        yAxis.call(d3.axisLeft(yScale));

        bars.exit().remove();
    };

    updateVisualization();
})();
