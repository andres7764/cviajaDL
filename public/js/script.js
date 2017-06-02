$(document).ready(function() {

	var modalReserve = $("#modalReserve");
	var campos = ["nombre", "correo"];
	var camposReserva = ["nombreReserve","correoReserve","activity"];

	function validFields() {
		for (i in campos) {
			if ($("#" + campos[i]).val() === "") {
				return false;
			}
		}
		return true;
	}
	function validFieldsReserve() {
		for (i in camposReserva) {
			if ($("#" + camposReserva[i]).val() === "") {
				return false;
			}
		}
		return true;
	}

	function sendPost(typeSubcri) {
		var tmpOtro = ($("#avarias:checked").length > 0) ? true + $("#avarias").val() : false + $("#avarias").val();
		var f = new Date();
		$.post("/saveContact", {
				nombre: $("#nombre").val(),
				correo: $("#correo").val(),
				opciones: {
					caminata: ($("#caminata:checked").length > 0) ? true : false,
					picknic: ($("#Picknic:checked").length > 0) ? true : false,
					sturisticos: ($("#sturisticos:checked").length > 0) ? true : false,
					otro: tmpOtro
				},
				suscribirseMail: ($("#sMail:checked").length > 0) ? true : false,
				susCribirsePagos: typeSubcri,
				fecha: f
			}, function(sucs) {
				swal("Guardado con exito!", sucs.token, "success");
				modal.style.display = "none";
			})
			.fail(function(err) {
				swal("Opps!", err, "warning");
			})
	};

	function sendReserve(lugar) {
		$.post("/saveReserva", {
				nombre: $("#nombreReserve").val(),
				correo: $("#correoReserve").val(),
				event:  $("#activity").val()
			}, function(sucs) {
				swal("Guardado con exito!", sucs.token, "success");
				modalReserve.hide();
			})
			.fail(function(err) {
				swal("Opps!", err, "warning");
			});
	};

	function getLugar(id){
		switch (id) {
			case 1:
				return "Choachí";
				break;
			case 2:
				return "Parque jericó"
				break;
			case 3:
				return "Sopó"
				break;
			case 4:
				return "Tocancipá"
				break;
			case 5:
				return "La vega"
				break;
			case 6:
				return "Tobia"
				break;
			case 7:
				return "Tobia"
				break;
			case 8:
				return "Tobia"
				break;								
			default:
				return "all"
				break;						
		}
	}


	$("#btnFree").click(function() {
		validFields() ? sendPost(false) : alert("Debe ingresar su nombre y correo!");
	});

	$("#btnCost").click(function() {
		validFields() ? sendPost(true) : swal("Opps!", "Debe ingresar su nombre y correo!", "warning");
	});

	$(".btnReserve").click(function() {
		var lugar = getLugar(parseInt($(this).attr("id").split("_")[1]));
		console.log(lugar);
		$("#lugar").html(lugar);
		modalReserve.show();
	});

	$("#btnNewReserva").click(function(){
		validFieldsReserve() ? sendReserve($("#lugar").html()) : swal("Opps!", "Debe ingresar su nombre y correo!", "warning");
	});

	$("#close").click(function(){
		modalReserve.hide();
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
