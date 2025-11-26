<?php

require_once 'Crud.php';

class Servico extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update servico set nome = '{$atributos['nome']}', descricao = '{$atributos['descricao']}', preco = '{$atributos['preco']}' where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}