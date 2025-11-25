<?php

require_once 'Crud.php';

class Cliente extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update usuario set cnpj = '$atributos[0]', nome = '$atributos[1]', email = '$atributos[2]', contato = '$atributos[3]' where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}