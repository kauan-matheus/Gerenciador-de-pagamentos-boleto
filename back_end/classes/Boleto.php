<?php

require_once 'Crud.php';

class Boleto extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update usuario set codigo = '$atributos[0]', emissao = '$atributos[1]', vencimento = '$atributos[2]', valor = '$atributos[3]', `status` = '$atributos[4]', cliente_id = $atributos[5], servico_id = $atributos[6] where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}