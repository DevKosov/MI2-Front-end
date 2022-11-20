<?php

$sourceJson = file_get_contents('source.json');
$destinations = json_decode($sourceJson, true);   

$dataRecieved = $_POST['data'] ?? '';
$action = $_POST['action'] ?? '';

if ($dataRecieved){
    if ($action == 'delete') {
        unset($destinations[$dataRecieved]);
        echo json_encode($destinations);
    }
    else if ($action == 'updateOrAdd'){
        $destToModify = json_decode($dataRecieved, true);
        
        // J'ai essayer de sauvegarder l'image mais pas eu le temps
        // Decoder l'image 
        // echo('photoURL');
        // if (is_base64($destToModify['photoURL'])){
        //     $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $destToModify['photoURL']));
        //     // Le sauvegarder dans un ficher 
        //     file_put_contents(`../images/destination-${$destToModify['id']}.png`, $image);
        //     // Faire les changements || ajouter
        //     $destToModify['photoURL'] = `/images/destination-${$destToModify['id']}.png`;
        //     $destinations[$destToModify['id']] = $destToModify;
        // }
        // else {
            $destinations[$destToModify['id']] = $destToModify;
        // }
        
        echo json_encode($destinations);
    }
    // pour sauvegarder de nouveau dans le source.json
    $newData = json_encode($destinations);
    file_put_contents('source.json', $newData);   
}
else{
    echo json_encode($destinations);
}

function is_base64($s)
{
    return (bool) preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $s);
}