$( document ).ready(function() {
	var route = {};
	$.getJSON( "./src/app_api/modules/admin/routes.json", function( data ) {
		route = data; 
		console.log(data)
	});
	$('#form_create_admin').on('submit',function(e){
		e.preventDefault()
		var exp1 = validateName('#fname' ,$("#fname").val())
		var exp2 = validateName('#lname' ,$("#lname").val())
		var exp3 = validateEmail('#email' ,$("#email").val())
		var exp4 = validatePassword('#pass' ,$("#pass").val())
		var exp5 = validateTelephone('#tlf' ,$("#tlf").val())
		if (exp1 && exp2 && exp3 && exp4 && exp5) {
			$.ajax({
				beforeSend: function (){
					$('#sub').html('<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>')
					console.log('Status: tomo los datos')
				},
				url: route.create.url,
				type: route.create.type,
				data: $('#form_create_admin').serialize(),
				success: function (resp) {
					alert(resp);
					res = JSON.parse(resp)
						if (res.save == true) {
							$('#form_create_admin')[0].reset()
							$('#sub').html('<i style="color:green;" class="fa fa-floppy-o" aria-hidden="true"></i>')
						} else {
							$('#sub').html('<i style="color:red;" class="fa fa-exclamation-circle" aria-hidden="true"></i>')
						}
						console.log(res)
						$('#form_message').html(	
							'<div class="alert alert-light alert-dismissible fade show" role="alert">'+
							'		<ul>'+
							'			<li>Connection : '+res.connection+'</li>'+
							'			<li>Found : '+res.found+'</li>'+
							'			<li>Save : '+res.save+'</li>'+
							'		</ul>'+
							'		<button class="close" data-dismiss="alert" aria-label="Close">'+ 
							'			<i class="fa fa-window-close" aria-hidden="true"></i>'+
							'		</button>'+
							'</div>' )
					
				},
				error: function (jqXHR,estado,error) {
					console.log('----------------------')
					console.log('Status: Entro en error')
					console.log(estado)
					console.log(error)
				},
				complete: function (jqXHR,estado) {
					console.log('----------------------')
					console.log(estado)
				},
				timeout: 80000
			})
		}	 else{
			$('#form_message').html(	
						'<div class="alert alert-light alert-dismissible fade show" role="alert">'+
						'		<h3>Validation problems</h3>'+
						'		<button class="close" data-dismiss="alert" aria-label="Close">'+ 
						'			<i class="fa fa-window-close" aria-hidden="true"></i>'+
						'		</button>'+
						'</div>' )
		}
				
	});
	/** Login */
	$('#form_login_admin').on('submit',function(e){
		e.preventDefault()
		var exp1 = validateEmail('#email_admin' ,$("#email_admin").val())
		var exp2 = validatePassword('#pass_admin' ,$("#pass_admin").val())
		if (exp1 && exp2) {
			$.ajax({
				beforeSend: function (){
					$('#admin_sub').html('<i class="fa fa-spin fa-circle-o-notch" aria-hidden="true"></i>')
				},
				url: route.login.url,
				type: route.login.type,
				data: $('#form_login_admin').serialize(),
				success: function (resp) {
					res = JSON.parse(resp)
					if (res.data.active) {
						Cookies.set('fname', res.data.fname , { expires: 7 });
						Cookies.set('lname', res.data.lname , { expires: 7 });
						Cookies.set('email', res.data.email , { expires: 7 });
						Cookies.set('type',  res.data.type , { expires: 7 });
						//apppaj.000webhostapp.com
						window.location.replace("http://comiczone.hol.es/homeadmin");
						console.log(res)
					} else {
						alert('Usuario y/o contraseña invalida')
						$('#admin_sub').html('<i class="fa fa-times" aria-hidden="true"></i>')
					}
				},
				error: function (jqXHR,estado,error) {
					console.log('----------------------')
					console.log('Status: Entro en error')
					console.log(estado)
					console.log(error)
				},
				complete: function (jqXHR,estado) {
				}
			})
		} else {
			$('#form_message_admin').html(
						'<div class="alert alert-light alert-dismissible fade show" role="alert">'+
						'		<h3>Validation problems</h3>'+
						'		<button class="close" data-dismiss="alert" aria-label="Close">'+
						'			<i class="fa fa-window-close" aria-hidden="true"></i>'+
						'		</button>'+
						'</div>' )
		}
	})
});
	function validateName(input, str){
		if ( str.match(/^[A-Za-z]([a-zA-Z]| |-|')+$/g) ) {
			$(input).addClass('is-valid')
			$(input).removeClass('is-invalid')
			return true
		} else {
			$(input).addClass('is-invalid')
			$(input).removeClass('is-valid')
			
			return false
		}
	}
	/**
	* Validate the email
	*/
	function validateEmail(input, str){
		if ( str.match(/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/g) ) {
			$(input).addClass('is-valid')
			$(input).removeClass('is-invalid')
			return true
		} else {
			$(input).addClass('is-invalid')
			$(input).removeClass('is-valid')
			
			return false
		}
	}
	/**
	* length from 8 to 16 characters
	* MIN of 1 May / 1 number / 1 Symbol
	*/
	function validatePassword(input, str){
		if ( str.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/g) ) {
			$(input).addClass('is-valid')
			$(input).removeClass('is-invalid')
			return true
		} else {
			$(input).addClass('is-invalid')
			$(input).removeClass('is-valid')
			
			return false
		}
	}
	/**
	* Accepts:
	*   | +42 555.123.4567 | +1-(800)-123-4567 | +7 555 1234567   | +7(926)1234567  | (926) 1234567
	*	| +79261234567     | 926 1234567       | 9261234567       | 1234567         | 123-4567 
	*	| 123-89-01        | 495 1234567       | 469 123 45 67    | 89261234567     | 8 (926) 1234567 
	*	| 926.123.4567     | 415-555-1234      | 650-555-2345     | (416)555-3456   | 202 555 4567      
	*	| 4035555678       | 1 416 555 9292    | 0424 620 0101    | 0424-620-0101   | 0424-620-01-01   
	*	| (424) 620 0101   | (424)-620-0101    | +54 424 620 0101
	*/
	function validateTelephone(input, str){
		if ( str.match(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/g) ) {
			$(input).addClass('is-valid')
			$(input).removeClass('is-invalid')
			return true
		} else {
			$(input).addClass('is-invalid')
			$(input).removeClass('is-valid')
			
			return false
		}
	}
	
	/** Create Form */
		// setInterval( function(){
		// 	$.ajax({
		// 		beforeSend: function (){
		// 		},
		// 		url: 'back.php',
		// 		type: 'POST',
		// 		data: 'email=marco.jr1695@gmail.com',
		// 		success: function (res) {
		// 			console.log(res)
		// 			$('#text-container').html(res)
		// 		},
		// 		error: function (jqXHR,estado,error) {
		// 			console.log('----------------------')
		// 			console.log('Status: Entro en error')
		// 			console.log(estado)
		// 			console.log(error)
		// 		}
		// 	})
		// }, 3000)
