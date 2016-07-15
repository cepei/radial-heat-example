window.onload = function(){
var hierachy_data;

d3.json("hierachy.json", function(hierachy){
	segment_labels = [];
	for(key in hierachy){
		segment_labels.push(hierachy[key].name);

		}
	d3.csv("stackholders.csv", function(stackholders){
			holders_data = d3.nest().key(function(d) {
												return d.id;
											}).entries(stackholders);
			radialLabels = Object.keys(holders_data[0].values[0]);
			radialLabels.splice(0,1);
			data = [];
			console.log(hierachy)
			
			for(i in radialLabels){
				group = radialLabels[i]
				for(j in holders_data){
					 if(holders_data[j].key != "cuestiones"){
						var quali_value = holders_data[j].values[0][group]
						var quanti_value = 	hierachy[holders_data[j].key]
											.items
											.filter(function(value) { return value.name == quali_value })[0].value
						if(!quanti_value){
							console.log(holders_data[j]);
							console.log(quali_value);
							console.log(quanti_value)
						}
						data.push({theme: holders_data[j].key, value: quanti_value, group: group, position: quali_value});
						
					   }
					}
				
			}
					
			var chart = circularHeatChart()
				.accessor(function(d) {return d.value;})
				.innerRadius(50)
				.radialLabels(radialLabels)
				.segmentLabels(segment_labels)
				.range(["green", "orange"]);;			
			
			var div = d3.select("body").append("div")	
				.attr("class", "tooltip")				
				.style("opacity", 0);


			d3.select('#chart')
				.selectAll('svg')
				.data([data])
				.enter()
				.append('svg')
				.call(chart)
				
			d3.selectAll('#chart path')  
						.on("mouseover", function(d) {	
							console.log(d3.select(this))
							var datum = d3.select(this).data()[0];	
							div.transition()		
								.duration(20)		
								.style("opacity", .9);		
							div	.html("Grupo: " + datum.group 
								+ "<br/>Tema: " + datum.theme
								+ "<br/>Posición: " + datum.position)	
								.style("left", (d3.event.pageX) + "px")		
								.style("top", (d3.event.pageY - 28) + "px");	
							})					
						.on("mouseout", function(d) {		
							div.transition()		
								.duration(50)		
								.style("opacity", 0);	
						});
				  
		})
	
	})

}


