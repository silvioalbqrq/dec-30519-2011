# Direção visual — Calculadora ICMS-ST | Decreto nº 30.519/2011

## Três abordagens consideradas

| Tema | Introdução muito breve | Probabilidade |
| --- | --- | --- |
| **Caderno Fiscal Cearense** | Interface técnico-institucional com a sobriedade de um processo fiscal bem organizado, reinterpretando o azul do print com textura de documentação e precisão editorial. | 0,07 |
| **Oficina de Dados** | Linguagem inspirada em medições, autopeças e tabelas técnicas, com foco em sinais visuais de conferência e processos operacionais. | 0,03 |
| **Arquivo de Conformidade** | Estética de acervo regulatório contemporâneo, com cartões claros, bordas finas e hierarquia documental mais marcada. | 0,09 |

## Abordagem escolhida: Caderno Fiscal Cearense

### Movimento de design

**Editorial institucional contemporâneo**, combinando a disciplina de sistemas públicos digitais com a clareza de um caderno técnico. A referência de cor do print é preservada: azul-petróleo profundo no cabeçalho, azul institucional como acento e superfícies azuladas muito claras no conteúdo.

### Princípios centrais

1. **Rastreabilidade antes de ornamentação:** cada valor deve revelar origem, fórmula e efeito no resultado.
2. **Densidade calma:** a tela comporta matéria tributária sem parecer burocrática ou visualmente pesada.
3. **Contraste funcional:** áreas de decisão usam azul escuro, textos explicativos usam cinza-azulado e os resultados se destacam com amplitude e nitidez.
4. **Estado visível:** seleção de regime, validade do formulário e componentes da memória de cálculo precisam ser inequívocos.

### Filosofia de cor

O **azul-petróleo `#0E4A69`** comunica segurança institucional e ancora o cabeçalho. O **azul institucional `#14629A`** deve orientar ações e estados ativos, sem cair em efeitos chamativos. Fundos **névoa `#F4F8FB`** e **branco documental `#FFFFFF`** mantêm o conteúdo respirável e compatível com leitura de números. Tons de ardósia criam hierarquia discreta para observações e avisos.

### Paradigma de layout

O layout se organiza como uma **folha de cálculo comentada**: uma faixa de contexto no alto, abas de cenário logo abaixo e um painel central que alterna entre formulário e memória de cálculo. No desktop, a área de resultado forma uma coluna editorial lateral; no celular, ela se torna uma seção fixa após o formulário. A composição evita cartões em grade repetitiva e faz o cálculo parecer um fluxo único de conferência.

### Elementos de assinatura

1. **Faixa azul técnica:** cabeçalho com textura discreta de linhas e peças abstratas, sem comprometer a legibilidade.
2. **Régua de cálculo:** uma linha de etapas numeradas que acompanha a base, a carga líquida e o resultado.
3. **Selo facetado:** símbolo geométrico sem texto usado como marca, marcador de resultado e favicon.

### Filosofia de interação

Os controles respondem como instrumentos de conferência: foco sempre visível, descrição contextual abaixo de cada campo e atualização intencional por botão de cálculo. A memória aparece com um deslocamento breve apenas após ação explícita, reforçando que o usuário concluiu uma etapa e não recebeu uma resposta opaca.

### Animação

Transições de `transform` e `opacity` entre 160 ms e 240 ms, usando `cubic-bezier(0.23, 1, 0.32, 1)`. Abas fazem uma troca seca e precisa; o painel de resultado entra de `translateY(8px)` para a posição final. Botões usam escala de `0.97` no clique. Todas as animações não essenciais são desligadas quando `prefers-reduced-motion` estiver ativo.

### Sistema tipográfico

**Manrope** é usada nos títulos e elementos numéricos, com pesos 600–800 para estrutura e resultado. **Source Sans 3** atende textos, rótulos e explicações legais por sua leitura eficiente em blocos técnicos. Títulos não excedem três níveis; números monetários recebem alinhamento tabular.

### Essência da marca

**Uma calculadora de conferência do ICMS-ST para operações de autopeças no Ceará, desenhada para transformar parâmetros legais em uma memória de cálculo legível.**

Personalidade: **precisa, serena, responsável**.

### Voz da marca

Os títulos devem ser diretos e descritivos; CTAs devem nomear a ação tributária; microtextos devem esclarecer limite e origem do dado sem linguagem alarmista.

> “Informe os valores da nota para montar a base de cálculo.”

> “Confira a memória antes de usar o valor para recolhimento.”

### Logotipo e marca

O logotipo combina o nome em tipografia editorial com um **selo geométrico facetado**, que sugere proteção, conferência e avanço sem usar símbolos públicos ou siglas. O símbolo aparece em destaque na barra superior e como favicon.

### Cor de assinatura

**Azul de conferência — `#14629A`**. Uma cor proprietária dentro da paleta do print, usada exclusivamente para etapas ativas, ações primárias e valores-chave.

## Style Decisions

1. A **régua de cálculo** é uma estrutura persistente e organiza o fluxo em base documental, carga líquida, adicionais/FECOP e resultado.
2. A superfície prioriza linhas documentais, divisões de razão e bordas técnicas sutis em vez de uma linguagem genérica de cartões de software.
3. O **selo facetado** é um ativo de marca e aparece somente no cabeçalho e em momentos-chave de conferência ou resultado.
