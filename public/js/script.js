$(document).ready(function(){

	var campos = ["nombre","correo"];

	function validFields(){
		for(i in campos){
			if($("#"+campos[i]).val() === ""){
				return false;
			}
		}
		return true;
	}

	function sendPost(typeSubcri){
		alert("si");
		var tmpOtro = ($("#avarias:checked").length > 0)? true +$("#avarias").val()  : false+$("#avarias").val();
		var f = new Date();
		$.ajax({ 
		  url: "/saveContact",
		  method:"POST",
		  data: {
		  	nombre: $("#nombre").val(),
		  	correo: $("#correo").val(),
		  	opciones: {
		  		caminata: ($("#caminata:checked").length > 0)? true : false,
		  		picknic: ($("#Picknic:checked").length > 0)? true : false,
		  		sturisticos: ($("#sturisticos:checked").length > 0)? true : false,
		  		otro: tmpOtro
		  	},
		  	suscribirseMail: ($("#sMail:checked").length > 0)? true : false,
		  	susCribirsePagos:  typeSubcri,
		  	fecha: f
		  }})
		.done(function(sucs) {
			alert(sucs.token);
			console.log(sucs);
		})
	};


	$("#btnFree").click(function(){
		validFields() ? sendPost(false) : alert("Debe ingresar su nombre y correo!");
	});

	$("#btnCost").click(function(){
		validFields() ? sendPost(true) : alert("Debe ingresar su nombre y correo!");
	});

	/*
		$("#target").submit(function(event){
	var sPagos;
	var tmpOtro = ($("#avarias:checked").length > 0)? true +$("#avarias").val()  : false+$("#avarias").val();
	var f = new Date();
		$.ajax({ 
		  url: "http://serverC.boxo.com.co/saveContact",
		  method:"POST",
		  data: {
		  	nombre: $("#nombre").val(),
		  	correo: $("#correo").val(),
		  	opciones: {
		  		caminata: ($("#caminata:checked").length > 0)? true : false,
		  		picknic: ($("#Picknic:checked").length > 0)? true : false,
		  		sturisticos: ($("#sturisticos:checked").length > 0)? true : false,
		  		otro: tmpOtro
		  	},
		  	suscribirseMail: ($("#sMail:checked").length > 0)? true : false,
		  	susCribirsePagos:  sPagos,
		  	fecha: f
		  }})
		.done(function(sucs){
			alert(sucs.token);
				console.log(sucs);
		})
	});
	*/

})