export default function TecnicaPage() {
  return (
    <>
      <div className="main-main" style={{ padding: "60px 25px", color: "#fff" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          Documentação Técnica do Sistema
        </h1>
        <center>
        <hr style={{marginTop: "1px"}} className="hr" />
        </center>
        <p style={{ opacity: 0.9, marginTop: "15px", marginBottom: "30px" }}>
          Esta página apresenta uma visão técnica clara e objetiva do funcionamento
          do sistema de gerenciamento de pagamentos e boletos, destinado a novos
          usuários, administradores e desenvolvedores que desejam compreender sua
          arquitetura, lógica de operação e principais funcionalidades.
        </p>

        {/* Seções estruturadas */}
        <div className="estatisticas-container" style={{ textAlign: "left" }}>
          <h2 className="titulo" style={{ textAlign: "center", marginBottom: "25px" }}>
            Visão Geral do Sistema
          </h2>
          <p>
            O sistema é uma plataforma web desenvolvida para organizar, registrar e
            acompanhar pagamentos no formato de boletos. Seu objetivo principal é
            permitir que o usuário tenha controle total sobre:
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
            <li>Boletos cadastrados</li>
            <li>Situação atual de cada boleto</li>
            <li>Pagamentos realizados</li>
            <li>Gestão de valores e vencimentos</li>
            <li>Relatórios visuais e estatísticos</li>
          </ul>
        </div>

        <div className="estatisticas-container" style={{ textAlign: "left" }}>
          <h2 className="titulo" style={{ textAlign: "center", marginBottom: "25px" }}>
            Funcionalidades Disponíveis
          </h2>
          <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
            <li>Cadastro de novos boletos</li>
            <li>Edição de informações existentes</li>
            <li>Exclusão de boletos</li>
            <li>Atualização de status (pago, vencido, pendente, enviado)</li>
            <li>Dashboard com estatísticas em tempo real</li>
            <li>Filtro por período ou mês</li>
            <li>Gráfico em pizza dos estados dos boletos</li>
            <li>Interface amigável para administradores</li>
          </ul>
        </div>

        <div className="estatisticas-container" style={{ textAlign: "left" }}>
          <h2 className="titulo" style={{ textAlign: "center", marginBottom: "25px" }}>
            Painel do Administrador
          </h2>
          <p>
            O painel administrativo permite controlar completamente os boletos e seus
            respectivos estados. Entre os recursos disponíveis estão:
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
            <li>Criação rápida de boletos</li>
            <li>Gerenciamento massivo de dados</li>
            <li>Visualização detalhada de estatísticas financeiras</li>
            <li>Interface clara inspirada no design dos cards da homepage</li>
          </ul>
        </div>

        <div className="estatisticas-container" style={{ textAlign: "left" }}>
          <h2 className="titulo" style={{ textAlign: "center", marginBottom: "25px" }}>
            Como Navegar no Sistema
          </h2>
          <p>Um novo usuário pode seguir o fluxo abaixo:</p>
          <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
            <li>Acessar a página de login</li>
            <li>Navegar até o dashboard principal</li>
            <li>Usar o botão "Cadastrar boleto"</li>
            <li>Acompanhar estatísticas na área principal</li>
            <li>Aplicar filtros de mês para relatórios</li>
          </ol>
        </div>

        <p style={{ textAlign: "center", marginTop: "40px", opacity: 0.6 }}>
          Para mais detalhes técnicos e código-fonte completo, visite o repositório:
          <br />
          <a
            href="https://github.com/kauan-matheus/Gerenciador-de-pagamentos-boleto"
            target="_blank"
            style={{ color: "#a890ff", textDecoration: "underline" }}
          >
            github.com/kauan-matheus/Gerenciador-de-pagamentos-boleto
          </a>
        </p>
      </div>
    </>
  );
}