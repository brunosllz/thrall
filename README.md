GOALS
[] - Jogar os apps para um monorepo;
[] - Refatorar a estrutura do app;
[] - Criar documento da API;
[] - Ter uma cobertura de testes de ~90%;
[] - Especificar todas as funcionalidades que irão ser criadas no backend;
[] - Criar integração com o github, para melhor gerenciamento dos projetos;
[] - Criar um modulo de account onde tenha do o rastreio do usuário, criação de conta, providers conectados, etc;
[] - Definir padrões de erros;
[] - Criar métricas para API(quantas vez determinada rota foi chamada, quando tempo está levando para processar uma request, etc)

---

DEFINiÇÃO DA ESTRUTURA DE ERROS DA API

status code adequado com a operadora a ser notificada
{
code: <custom error code>
message: <readable human message>
}
