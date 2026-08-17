# Calculadora ICMS-ST — Autopeças | Ceará

Aplicação estática em React para estimar o ICMS-ST com carga líquida em operações com peças, componentes e acessórios para veículos no Ceará. A interface toma como referência o **Decreto nº 30.519/2011**, com percentuais do Anexo III indicados na consolidação que contempla a redação do Decreto nº 35.807/2023.

> **Aviso tributário:** este projeto produz uma estimativa a partir dos valores informados. Ele não valida CNAE, NCM, produto, ato concessivo, regime especial, contrato de fidelidade, legislação superveniente, DAE ou obrigação acessória. Confirme a apuração com profissional tributário habilitado antes de recolher ou escriturar.

## O que a calculadora cobre

| Cenário | Tratamento implementado |
| --- | --- |
| Atacadista e varejista | Percentuais do Anexo III por perfil, carga tributária interna e origem da mercadoria. |
| Indústria fabricante localizada no Ceará | Carga líquida padrão de 8% para operações internas, conforme art. 1º, § 2º. |
| Composição de base | Produtos, IPI, frete/carreto, seguro e outros encargos transferidos. |
| Situações adicionais | Acréscimo do Simples Nacional, FECOP em DAE próprio, redutor de fidelidade autorizado e acréscimo de 80% para transferência. |
| Transparência | Memória de cálculo copiável, tabela do Anexo III e referência direta ao decreto. |

## Fórmula mostrada pela aplicação

> **Base documental** = produtos + IPI + frete/carreto + seguro + outros encargos.  
> **Base aplicável** = base documental × 1,80, quando for a hipótese de transferência prevista no art. 2º, § 4º.  
> **ICMS-ST estimado** = base aplicável × carga líquida ajustada.  
> **Total estimado** = ICMS-ST + FECOP, quando este adicional estiver selecionado.

## Execução local

```bash
pnpm install
pnpm dev
```

Para uma verificação de produção:

```bash
pnpm check
pnpm build
```

## Proteção de interface e cópia de conteúdo

O projeto aplica **dissuasões de interface no navegador**: desativa atalhos usuais de inspeção, salvamento de página e clique com o botão direito quando não há texto selecionado. A cópia de conteúdo visível continua permitida, inclusive pelo botão **Copiar memória** e por seleção normal de texto.

Essa proteção é apenas uma camada de experiência e **não torna um frontend confidencial**. Todo site estático enviado ao navegador pode ser inspecionado por pessoas tecnicamente qualificadas; além disso, um repositório GitHub público expõe seu código-fonte. Caso o código precise permanecer restrito, mantenha o repositório privado e não trate a aplicação cliente como local para segredos, chaves ou regras tributárias proprietárias.

## Fontes de referência

1. [Decreto nº 30.519, de 26 de abril de 2011 — SEFAZ/CE](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=d5e33d14-7888-4f67-8687-a18f4f657953).
2. [Consolidação do Decreto nº 30.519/2011 — LegisWeb](https://www.legisweb.com.br/legislacao/?id=123302).
3. [Portal de Serviços SEFAZ/CE — Contrato de Fidelidade/Autopeças](https://portalservicos.sefaz.ce.gov.br/tema-geral+mercadorias-em-transito+emissao-de-dae-e-liberacao-de-mercadorias-em-transito+registrar-contrato-de-fidelidade-autopecas+64da4f5e170f5a26dc5952bc).

Os pressupostos e a tabela parametrizada também estão documentados em [`legal_sources.md`](./legal_sources.md).

