<?php

require_once 'Crud.php';

class Boleto extends Crud {
    public function update(int $id, array $atributos): array {
        try {
            $sql = "update boleto set codigo = '{$atributos['codigo']}', emissao = '{$atributos['emissao']}', vencimento = '{$atributos['vencimento']}', valor = {$atributos['valor']}, `status` = {$atributos['status']}, cliente_id = {$atributos['cliente_id']}, servico_id = {$atributos['servico_id']} where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela atualizado com sucesso");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível atualizar o $this->tabela");
        }
    }
}