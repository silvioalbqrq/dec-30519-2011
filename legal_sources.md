# Fontes jurídicas e pressupostos de cálculo

> **Status:** notas de pesquisa para implementação. A calculadora deve exibir aviso de estimativa e orientar validação por contador ou profissional tributário antes de escrituração, recolhimento ou entrega de obrigação acessória.

| Fonte | Evidência verificada | Uso no produto |
| --- | --- | --- |
| [Decreto nº 30.519, de 26 de abril de 2011 — SEFAZ/CE](https://sefazlegis.sefaz.ce.gov.br/api/openFile?id=d5e33d14-7888-4f67-8687-a18f4f657953) | Publicação oficial com 16 páginas; o art. 1º vincula os estabelecimentos dos Anexos I e II ao regime de substituição tributária; o título confirma o âmbito de peças, componentes e acessórios para veículos. | Fonte principal para a identificação do regime, dos perfis de contribuinte e dos anexos. |
| [Portal de Serviços da SEFAZ/CE — Contrato de Fidelidade/Autopeças](https://portalservicos.sefaz.ce.gov.br/tema-geral+mercadorias-em-transito+emissao-de-dae-e-liberacao-de-mercadorias-em-transito+registrar-contrato-de-fidelidade-autopecas+64da4f5e170f5a26dc5952bc) | O resultado de busca oficial indica que há solicitações de redução do percentual de carga líquida no âmbito do Decreto nº 30.519/2011. | A tela deve permitir informar percentual de carga líquida aplicável, sem presumir reduções individualizadas. |
| [Instrução Normativa SEFAZ nº 151/2023 — LegisWeb](https://www.legisweb.com.br/legislacao/?id=454655) | Resultado de busca informa referência ao art. 4º do decreto e carga tributária líquida de 7,80% em hipótese específica. | O site tratará percentuais como parâmetros sujeitos a confirmação normativa e não como parecer tributário. |

## Dispositivos confirmados na consolidação consultada

| Dispositivo | Conteúdo confirmado | Decisão de implementação |
| --- | --- | --- |
| Art. 1º, caput | Os estabelecimentos do Anexo I (comércio atacadista) e do Anexo II (comércio varejista) ficam sujeitos à substituição tributária nas operações subsequentes quando a mercadoria entra no território cearense. | A interface separa os cenários **Atacadista/Varejista** e **Indústria fabricante**. |
| Art. 1º, § 2º | O estabelecimento industrial localizado no Ceará, fabricante de peças, componentes e acessórios, deve utilizar, nas operações internas, carga líquida de **8%**, conforme redação dada pelo Decreto nº 35.807/2023. | O cenário de indústria possui percentual padrão de 8,00%, editável apenas para possibilitar atualização normativa e hipóteses específicas. |
| Art. 2º | O imposto retido/recolhido equivale à carga líquida do Anexo III aplicada ao valor do documento fiscal de entrada, incluindo IPI, frete e carreto, seguro e outros encargos transferidos ao destinatário. | A fórmula principal soma os componentes da nota e aplica diretamente o percentual escolhido de carga líquida. |
| Art. 3º | Para contribuintes excluídos dos percentuais de carga líquida, a base inclui preço, frete/carreto, Imposto de Importação quando aplicável, IPI e despesas; sobre o montante é aplicado percentual de agregação de **100%**. | O produto apresenta este cenário como informativo e não o confunde com a fórmula principal de carga líquida. |
| Art. 4º | Contribuinte do Anexo I sob regime especial pode aplicar a carga líquida do Anexo III; há previsão de ajuste proporcional dentro de limites legais. | O formulário não presume regime especial; o usuário informa o percentual efetivamente aplicável e vê alerta para conferência do ato concessivo. |

## Anexo III — percentuais parametrizados

Os percentuais abaixo correspondem à redação do Anexo III indicada como atualizada pelo Decreto nº 35.807/2023 na consolidação consultada. Eles compõem a carga líquida principal antes de eventuais acréscimos do Simples Nacional ou redução de contrato de fidelidade.

| Perfil | Carga tributária interna da mercadoria | Próprio Estado ou exterior | Norte, Nordeste, Centro-Oeste ou ES | Sul e Sudeste, exceto ES |
| --- | ---: | ---: | ---: | ---: |
| Atacadista (Anexo I) | 7% — cesta básica | 2,96% | 5,50% | 7,25% |
| Atacadista (Anexo I) | 9,72% — álcool/gel não antisséptico, embalagem até 1 L | 2,82% | 10,05% | 12,83% |
| Atacadista (Anexo I) | 12% — cesta básica | 5,08% | 9,42% | 12,42% |
| Atacadista (Anexo I) | 20% | 8,00% | 19,71% | 21,00% |
| Atacadista (Anexo I) | 25% — álcool/gel não antisséptico, embalagem até 1 L | 7,26% | 25,85% | 33,00% |
| Atacadista (Anexo I) | 28% | 11,20% | 30,39% | 37,80% |
| Varejista (Anexo II) | 7% — cesta básica | 1,54% | 4,20% | 5,95% |
| Varejista (Anexo II) | 9,72% — álcool/gel não antisséptico, embalagem até 1 L | 2,82% | 10,05% | 12,83% |
| Varejista (Anexo II) | 12% — cesta básica | 2,64% | 7,20% | 10,20% |
| Varejista (Anexo II) | 20% | 8,00% | 19,71% | 21,00% |
| Varejista (Anexo II) | 25% — álcool/gel não antisséptico, embalagem até 1 L | 7,26% | 25,85% | 33,00% |
| Varejista (Anexo II) | 28% | 11,20% | 30,39% | 37,80% |

## Fórmula funcional adotada

Para os cenários de carga líquida, a aplicação será apresentada de forma explícita:

> **Base documental** = valor dos produtos + IPI + frete/carreto + seguro + outros encargos.  
> **Base com transferência** = base documental × 1,80, quando aplicável o § 4º do art. 2º.  
> **Carga líquida ajustada** = (percentual do Anexo III × (1 − 13,50%), se houver contrato de fidelidade homologado) + acréscimo do Simples Nacional, quando aplicável.  
> **ICMS-ST estimado** = base aplicável × carga líquida ajustada.  
> **FECOP** = base aplicável × percentual selecionado para a origem, quando devido, em DAE específico.  
> **Total estimado** = ICMS-ST estimado + FECOP, quando incluído.

| Condicionante | Parametrização prevista |
| --- | --- |
| Remetente optante pelo Simples Nacional | Acréscimo de 3% em operação interna, 4% nas regiões Sul/Sudeste exceto ES e 6% nas regiões Norte/Nordeste/Centro-Oeste e ES, conforme art. 2º, § 2º. |
| FECOP | Campo opcional com 2,58% em operação interna, 3% para Norte/Nordeste/Centro-Oeste/ES e 3,20% para Sul/Sudeste exceto ES, informado separadamente por se tratar de DAE específico, conforme art. 2º, § 1º, II. |
| Contrato de fidelidade | Redução de 13,50% sobre a carga do Anexo III, condicionada à autorização da SEFAZ, conforme art. 2º, § 5º. |
| Indústria fabricante no CE | Cenário interno com carga líquida padrão de 8%, conforme art. 1º, § 2º. |

## Regras de interface e transparência

1. A calculadora deve expor a memória do cálculo, com cada componente da base e o percentual aplicado.
2. A carga líquida deve ser escolhida em tabela orientativa ou informada manualmente quando houver hipótese específica, redução ou atualização posterior.
3. O resultado é uma estimativa de ICMS-ST a recolher, nunca um DAE, uma guia de recolhimento ou uma confirmação de enquadramento fiscal.
4. O Decreto nº 30.519/2011 e seus anexos podem receber alterações. A versão do site deve indicar a necessidade de conferir a legislação vigente e o enquadramento da mercadoria antes do uso operacional.
