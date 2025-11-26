<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Intercepta requisição OPTIONS e retorna 200 direto
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../classes/Crud.php";

$input = json_decode(file_get_contents("php://input"), true);

$tabela = $input['tab'] ?? '';
$id = $input['id'] ?? '';

$crud = new crud([], $tabela);
echo json_encode($crud->delete($id));