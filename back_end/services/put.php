<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


// Intercepta requisição OPTIONS e retorna 200 direto
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../classes/Crud.php";
require_once "../classes/Boleto.php";
require_once "../classes/Cliente.php";
require_once "../classes/Servico.php";
require_once "../classes/Usuario.php";

$input = json_decode(file_get_contents("php://input"), true);

$tabela = $input['tab'] ?? '';
$dados = $input['dados'] ?? '';
$id = $input['id'] ?? '';

if (is_string($dados)) {
  $dados = json_decode($dados, true);
}

$crud = new crud([], $tabela);

switch ($tabela){
    case "boleto":
        $crud = new boleto($dados, $tabela);
        break;

    case "cliente":
        $crud = new cliente($dados, $tabela);
        break;

    case "usuario":
        $crud = new usuario($dados, $tabela);
        break;

    case "servico":
        $crud = new servico($dados, $tabela);
        break;

    default:
        echo json_encode([
            "type" => "error",
            "message" => "Tabela inválida: {$tabela}"
        ]);
        exit();
}

echo json_encode($crud->update($id, $dados));