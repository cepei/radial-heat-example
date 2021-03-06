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
			
			console.log(d3.select("#filter"));
			

					
					
			for(i in radialLabels){
				group = radialLabels[i]
				for(j in holders_data){
					 if(holders_data[j].key != "cuestiones"){
						var cuestiones = holders_data[0].values[0][group];
						var quali_value = holders_data[j].values[0][group];
						var quanti_value = 	hierachy[holders_data[j].key]
											.items
											.filter(function(value) { return value.name == quali_value })[0].value
						if(!quanti_value){
							console.log(holders_data[j]);
							console.log(quali_value);
							console.log(quanti_value)
						}
						data.push({theme: hierachy[holders_data[j].key].name, 
									value: quanti_value, group: group, 
									position: quali_value,
									cuestiones: cuestiones});
						
					   }
					}
				
			}
					
			var chart = circularHeatChart()
				.accessor(function(d) {return d.value;})
				.innerRadius(50)
				.radialLabels(null)
				.segmentLabels(segment_labels)
				.range([ "#CEE3F6", "#0174DF"]);		
			
			var tip = d3.select("body").append("div")	
				.attr("class", "tooltip")				
				.style("opacity", 0);
				
			var cuestiones = d3.select(".cuestiones").append("div")	
				.attr("class", "cuest-text");


			d3.select('#chart')
				.selectAll('svg')
				.data([data])
				.enter()
				.append('svg')
				.call(chart)
				
			d3.select("#filter")
					.selectAll("div")
					.data(radialLabels)
					.enter()
					.append("div")
					.html(function(d) { console.log(d); return d; })
					.classed("filter-element", true)
					.on("mouseover", function(group) { 
						d3.select(this).classed("active", true );
						d3.selectAll('#chart path').each(
							function(d,i){
									d3.select(this).style("opacity", 0.1)									
								})
						d3.selectAll('#chart path').each(
							function(d,i){
								if(d.group == group){
									d3.select(this).style("opacity", 1)						
								}
							}
						)
						})      
					.on("mouseout",  function(group) { 
						d3.select(this).classed("active", false);
						d3.selectAll('#chart path').each(
							function(d,i){
									d3.select(this).style("opacity", 0.1)									
						})
						
						})
					
				
			d3.selectAll('#chart path')  
						.on("mouseover", function(d) {	
							var datum = d3.select(this).data()[0];								
							d3.selectAll(".filter-element")
								.each(function(d,i){
									if(d == datum.group ) d3.select(this).classed("active", true );
									})

							d3.selectAll('#chart path').each(
								function(d,i){
										d3.select(this).style("opacity", 0.1)									
									})
							d3.selectAll('#chart path').each(
								function(d,i){
									if(d.group == datum.group){
										d3.select(this).style("opacity", 1)						
									}
								}
							)		
							
								

							tip.transition()		
								.duration(2)		
								.style("opacity", .9);		
							tip	.html("<b>Grupo:</b> " + datum.group 
								+ "<br/><b>Tema:</b> " + datum.theme
								+ "<br/><b>Posición:</b> " + datum.position)	
								.style("left", (d3.event.pageX + 20) + "px")		
								.style("top", (d3.event.pageY + 50) + "px");	
								
								
							cuestiones.html(
											"<blockquote>" + datum.cuestiones + "</blockquote><br/><br/><i>" 
											+ datum.group + "</i>");
							})					
							
							
						.on("mouseout", function(d) {
							d3.selectAll('#chart path').each(
								function(d,i){
										d3.select(this).style("opacity", 0.1)									
							})		
							d3.selectAll(".filter-element")
								.classed("active", false );	
								
							tip.transition()		
								.duration(5)		
								.style("opacity", 0);	
								
							cuestiones.html("");
						})
						.style("opacity", 0.1);
				  
		})
	
	})

}


