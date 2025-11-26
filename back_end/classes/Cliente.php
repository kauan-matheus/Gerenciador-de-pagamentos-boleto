<?php

require_once 'Crud.php';

class Cliente extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update cliente set cnpj = '{$atributos['cnpj']}', nome = '{$atributos['nome']}', email = '{$atributos['email']}', contato = '{$atributos['contato']}' where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}