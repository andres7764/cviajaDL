$(document).ready(function(){

	$("#target").submit(function(event){
		/*if(){

		} else {

		}*/
	var sPagos 
	var f = new Date();
		$.	ajax({ 
		  url: "http://serverC.boxo.com.co/saveContact",
		  method:"POST",
		  data: {
		  	nombre: $("#nombre").val(),
		  	correo: $("#correo").val(),
		  	opciones: {
		  		caminata: ($("#caminata:checked").length > 0)? true : false,
		  		picknic: ($("#Picknic:checked").length > 0)? true : false,
		  		sturisticos: ($("#sturisticos:checked").length > 0)? true : false,
		  		otro: ($("#avarias:checked").length > 0)? true : false
		  	},
		  	suscribirseMail: ($("#sMail:checked").length > 0)? true : false,
		  	susCribirsePagos:  sPagos,
		  	fecha: f
		  }})
		.done(function(sucs){
			alert(sucs.token);
				console.log(sucs);
		})

	})
})