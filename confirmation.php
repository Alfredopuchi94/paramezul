<?php

session_start();
session_unset();

require_once "./src/app_api/config/connection.php";
require_once "./src/app_api/modules/methods/cliente.php";

$id = $_GET["x"];
$salt = $_GET["y"];

$obj = new Methods();
$resp = $obj->checkAcount('cliente',$id, $salt);

if ($resp['active'] == '1') {
  header('Location: http://comiczone.hol.es/');
} else {
  $obj = new Methods();
  $resp = $obj->confirmAcount('cliente',$id, $salt);
  if ($resp) {
    header('Location: http://comiczone.hol.es/');
  } else {
    echo 'error';
  }

}




