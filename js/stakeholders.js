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
				.range([ "#37B0CF", "#21285C"]);		
			
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
				
			
			//Filter	
			d3.select("#filter")
					.selectAll("div")
					.data(radialLabels)
					.enter()
					.append("div")
					.html(function(d) { console.log(d); return d; })
					.classed("filter-element", true)
					.on("mouseover", function(group) { 
						d3.select(this).classed("active", true );
						d3.selectAll('#chart .data-path').each(
							function(d,i){
									d3.select(this).style("opacity", 0.1)									
								})
						d3.selectAll('#chart .data-path').each(
							function(d,i){
								if(d.group == group){
									d3.select(this).style("opacity", 1)						
								}
							}
						)
						})      
					.on("mouseout",  function(group) { 
						d3.select(this).classed("active", false);
						d3.selectAll('#chart .data-path').each(
							function(d,i){
									d3.select(this).style("opacity", 0.1)									
						})
						
						})
					
					
			//Chart on mouse over	
			d3.selectAll('#chart .data-path')  
						.on("mouseover", function(d) {	
							var datum = d3.select(this).data()[0];								
							//d3.selectAll("svg textPath").classed("active", true );
							d3.selectAll("svg textPath").
								each(function(d,i){
									if(d == datum.theme)
										d3.select(this).classed("active", true);
									})
							
							d3.selectAll(".filter-element")
								.each(function(d,i){
									if(d == datum.group ) d3.select(this).classed("active", true );
									})

							d3.selectAll('#chart .data-path').each(
								function(d,i){
										d3.select(this).style("opacity", 0.1)									
									})
							d3.selectAll('#chart .data-path').each(
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
								
								
							cuestiones.html("<h4>Idea Principal</h4>" +
											"<blockquote>" + datum.cuestiones + "</blockquote><i>" 
											+ datum.group + "</i>");
							})					
							
							
						.on("mouseout", function(d) {
							d3.selectAll("svg textPath").classed("active", false );
							d3.selectAll('#chart .data-path').each(
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


	var width = 1000,
		height = 2000;

	var tree = d3.layout.tree()
	    .size([height, width - 360]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var domtree = d3.select("#tables")
		.append("tree")

	var svg = domtree
		.append("svg")
	    .style("height", height + "px")
	    .style("width", width + "px")
	  .append("g")
	    .attr("transform", "translate(40,0)");

	d3.csv("others.csv",function(data){
		datafiltered = data.filter(function(d){return d.Elementos != ""})
		var rootData = 	d3.nest()
						.key(function(d){return d.Elementos})
						.entries(datafiltered)
						.map(function(obj){
								var branch = {};
								branch["name"] = obj.key;
								//branch["children"] = obj.values;
								 branch["children"] = []
								var children = obj.values[0];
								var children_names = []
								for(var k in children){
									if(children[k]!="" && (children_names.indexOf(children[k]) == -1) ){
								 		//branch.children.push({"name":children[k], "children":k})
								 		children_names.push(children[k])
									}
								}

								for(var k_names in children_names){
									var subbranch = {"name":children_names[k_names], "children":[]}
									for(k_children in children){
										if(children[k_children] == children_names[k_names]){
											subbranch.children.push({"name":k_children})
										}
									}
									branch.children.push(subbranch)

								}
								//console.log(children_names);
								return branch;

							}
					)
		console.log(rootData);
		var headerNames = d3.keys(data[0]);
		var root = {"name":"", "children":rootData}
			var nodes = tree.nodes(root),
			  links = tree.links(nodes);

			var link = svg.selectAll("path.link")
			  .data(links)
			.enter().append("path")
			  .attr("class", "link")
			  .attr("d", diagonal);

			var node = svg.selectAll("g.node")
			  .data(nodes)
			.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

			node.append("circle")
			  .attr("r", 4.5);

			node.append("text")
			  .attr("dx", function(d) { return d.children ? 8 : 8; })
			  .attr("dy", function(d) { return d.children ? -2 : 3; })
			  //.attr("dy", 3)
			  .attr("text-anchor", function(d) { return d.children ? "start" : "start"; })
			  .text(function(d) { return d.name; });


		});
		d3.select(self.frameElement).style("height", height + "px");

}


