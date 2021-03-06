<?php 
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	class Methods2{
		public function tryToConnect(){
			$obj = new connect();
			$connect = $obj->connection();
			$res = false;
			if (mysqli_ping($connect)) { $res = true; }
			mysqli_close($connect);
			
			return $res;
		}
		// If exist the User 
		public function ifExist($table, $email){
			$obj = new connect();
			$connect = $obj->connection();
			$res = false;
			$email_lower = strtolower($email);
			$email_s = filter_var($email_lower, FILTER_SANITIZE_EMAIL);
			$sql= "SELECT email FROM $table WHERE email='$email_s'";
			$result = mysqli_query($connect, $sql);
			if (mysqli_num_rows($result) > 0) {
			    while($row = mysqli_fetch_assoc($result)) {
			       $res = true; 
			       break;
			    }
			}
			mysqli_close($connect);
			return $res;
		}
		
		// Create User
		public function create($fname,$lname,$email,$pass,$tlf,$type){
			$obj = new connect();
			$connect = $obj->connection();
			$res = false;
			date_default_timezone_set('America/La_Paz');
			$id = uniqid();
			$salt = md5(uniqid());
			$hash = password_hash($pass, PASSWORD_BCRYPT);
			$email_lower = strtolower($email);
			$email_s = filter_var($email_lower, FILTER_SANITIZE_EMAIL);
			$activate_code = md5(uniqid()).uniqid();
			$date = date("Y-m-d H:i:s", time());
			$sql= "INSERT INTO administrador (__id, fname, lname, email, tlf, type, salt, hash, activate_code, active, created_at, update_at) VALUES ('$id','$fname','$lname','$email_s','$tlf','$type','$salt','$hash','$activate_code','0','$date','$date')";
			if (mysqli_query($connect, $sql)) {
			  
			  $res = true;
			  $obj = new Mailer();
			  $messageHtml = $obj->admincontentHtml($fname,$lname,$id,$salt);
			  $messagePlain = $obj->admincontentPlain($fname,$lname,$id,$salt);
				$mail = new PHPMailer(true);
				try {
			    //Server settings
			    $mail->isSMTP();
			    $mail->Host = 'smtp.gmail.com';
			    $mail->SMTPAuth = true;
			    $mail->Username = 'alfredopuchi94@gmail.com';
			    $mail->Password = 'ajpt123400';
			    $mail->SMTPSecure = 'tls';
			    $mail->Port = 587;
			    //Recipients
			    $mail->setFrom('alfredopuchi94@gmail.com', 'Alfredo');
			    $mail->addAddress($email_s, $fname.' '.$lname);
			    $mail->isHTML(true);
			    $mail->Subject = 'Hi '.$fname.' - Confirmation Message';
			    $mail->Body    = $messageHtml;
			    $mail->AltBody = $messagePlain;
			    $mail->send();
				} catch (Exception $e) {
				    echo 'Mailer Error: ' . $mail->ErrorInfo;
				}
			}
			mysqli_close($connect);
			
			return $res;
		}
		
		//Check acount
		public function checkAcount($table, $id, $salt){
			$obj = new connect();
			$connect = $obj->connection();
			$res = 'not found';
			$sql= "SELECT * FROM $table WHERE __id='$id' AND salt='$salt'";
			$result = mysqli_query($connect, $sql);
			if (mysqli_num_rows($result)> 0) {
				while($row = mysqli_fetch_assoc($result)){
					$res = $row;
					break;
				}
			}
			mysqli_close($connect);
			return $res;
		}
		//confirm acount
		public function confirmAcount($table, $id, $salt){
			$obj = new connect();
			$connect = $obj->connection();
			$res = 'not found';
			date_default_timezone_set('America/La_Paz');
			$date = date("Y-m-d H:i:s", time());
			$update = "
			UPDATE $table
			SET active = '1',
			update_at='$date'
			WHERE __id='$id' AND salt='$salt';
			";
			if (mysqli_query($connect, $update)){
				$res = true;
			} 
			mysqli_close($connect);
			return $res;
		}
		// Login
		public function login($table, $email, $pass){
	      $obj = new connect();
	      $connect = $obj->connection();
	      $res = 'not found';
	      $email_lower = strtolower($email);
		  $email_s = filter_var($email_lower, FILTER_SANITIZE_EMAIL);
	      $sql= "SELECT * FROM $table WHERE email='$email_s'";
				$result = mysqli_query($connect, $sql);
				if (mysqli_num_rows($result) > 0) {
				  while($row = mysqli_fetch_assoc($result)) {
				    $res = $row;
				    break;
				  }
				}
				mysqli_close($connect);
	      if ($res) {
	        if ( password_verify($pass, $res['hash']) ) {
	          return $row;
	        }
	      } else {
	        return $res;
	      }
	    } 
		
}
