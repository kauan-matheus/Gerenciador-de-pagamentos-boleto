<?php

require_once 'DB.php';

class Crud
{
    protected array $atributos;
    protected string $tabela;

    public function __construct(array $atributos, string $tabela)
    {
        $this->atributos = $atributos;
        $this->tabela = $tabela;
    }

    public function create(): array {
        try {
            // Pega as colunas da tabela
            $stmt = DB::prepare("show columns from {$this->tabela}");
            $stmt->execute();
            $colunas = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (in_array('id', $colunas)) {
                $colunas = array_filter($colunas, fn($c) => $c !== 'id');
            }

            $colunasSql = implode(', ', $colunas);
            $placeholders = implode(', ', array_fill(0, count($this->atributos), '?'));

            $sql = "insert into {$this->tabela} ({$colunasSql}) values ({$placeholders})";

            $stmt = DB::prepare($sql);
            $stmt->execute(array_values($this->atributos));

            return [
                'type' => 'success',
                'message' => "{$this->tabela} cadastrado com sucesso!"
            ];
        } catch (PDOException $e) {
            return [
                'type' => 'error',
                'message' => "Erro ao cadastrar {$this->tabela}: " . $e->getMessage()
            ];
        }
    }



    public function read() :array
    {
        $sql = "select * from $this->tabela";
        $sql = DB::prepare($sql);
        $sql->execute();
        $sql = $sql->fetchAll(PDO::FETCH_ASSOC);
        //return json_encode($sql);
        return array(
                'type' => 'success',
                'data' => json_encode($sql)
            );
    }

    public function update(int $id, array $atributos) :array {
        return [];
    }

    public function delete(int $id) :array {

        try {
            $sql = "delete from $this->tabela where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();

            return $this->retorno('success', "$this->tabela excluído com sucesso!");
        } catch (PDOException $e) {
            return $this->retorno('error', "Não foi possível excluir o $this->tabela");
        }
    }

    public function getDados(int $id) :string {
        if (gettype($id) == 'integer') {
            $sql = "select * from $this->tabela where id = $id";
            $sql = DB::prepare($sql);
            $sql->execute();
            $sql = $sql->fetch(PDO::FETCH_ASSOC);
            return json_encode($sql);
        }
        else {
            return 'ID Inválido';
        }
    }

    public function retorno(string $type, string $message) :array {
        return array(
            'type' => $type,
            'message' => $message
        );
    }
}
