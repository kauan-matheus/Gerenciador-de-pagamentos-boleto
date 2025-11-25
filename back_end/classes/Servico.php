<?php

require_once 'Crud.php';

class Servico extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update usuario set nome = '$atributos[0]', descricao = '$atributos[1]', preco = '$atributos[2]' where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}