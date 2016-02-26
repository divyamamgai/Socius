<?php

$GLOBALS['ExotelToken'] = 'd50c4f8a64791c0993a165de33306da8226ac4e5';
$GLOBALS['ExotelSID'] = 'nitkkr';

if(isset($_GET['To'])&&isset($_GET['Body'])){

    $SendData = array(
        'From' => '8808891988',
        'To' => $_GET['To'],
        'Body' => $_GET['Body']
    );
    $URL = 'https://' . $GLOBALS['ExotelSID'] . ':' . $GLOBALS['ExotelToken'] . '@twilix.exotel.in/v1/Accounts/' . $GLOBALS['ExotelSID'] . '/Sms/send';
    $CurlHandle = curl_init();
    curl_setopt($CurlHandle, CURLOPT_VERBOSE, 1);
    curl_setopt($CurlHandle, CURLOPT_URL, $URL);
    curl_setopt($CurlHandle, CURLOPT_POST, 1);
    curl_setopt($CurlHandle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($CurlHandle, CURLOPT_FAILONERROR, 0);
    curl_setopt($CurlHandle, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($CurlHandle, CURLOPT_POSTFIELDS, http_build_query($SendData));
    $HTTPResult = curl_exec($CurlHandle);
    $Error = curl_error($CurlHandle);
    $HTTPCode = curl_getinfo($CurlHandle, CURLINFO_HTTP_CODE);
    curl_close($CurlHandle);
    echo '{"status":'.$HTTPCode.'}';
}

?>