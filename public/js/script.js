$(document).ready(function() {

document.addEventListener("touchstart", function(){},  {passive: true});

  $('#plans').on('click',function (e) {
      e.preventDefault();
      var target = this.hash;
      var $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().bottom
      }, 1500, 'swing', function () {
          window.location.hash = target;
      });
  });

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
				swal("Suscripción completa!", sucs.token, "success");
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

	var sendDSusvcrib = function(){
		$.post("/cancelSuscription", {correo: $("#fieldDSusc").val()}, function(sucs) {
			  swal("Información!", sucs.token, "success");
			  modalReserve.hide();
			})
			.fail(function(err) {
				swal("Opps!", err, "warning");
			});
	}

	$("#btnFree").click(function() {
		validFields() ? sendPost(false) : alert("Debe ingresar su nombre y correo!");
	});

	$("#btnCost").click(function() {
		validFields() ? sendPost(true) : swal("Opps!", "Debe ingresar su nombre y correo!", "warning");
	});

	$("#main").click(function() {
		var lugar = getLugar(parseInt($(this).attr("id").split("_")[1]));
		$("#lugar").html(lugar);
		modalReserve.show();
	});

	$("#btnNewReserva").click(function(){
		validFieldsReserve() ? sendReserve($("#lugar").html()) : swal("Opps!", "Debe ingresar su nombre y correo!", "warning");
	});

	$("#close").click(function(){
		modalReserve.hide();
	});

	$("#cSuscrib").click(function(){
		($("#fieldDSusc").val() === "")? swal("Opps!", "Debe ingresar su correo para realizar esta acción!", "warning"): sendDSusvcrib();
	})

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
