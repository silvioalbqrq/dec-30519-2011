# Registro de validação

## Cenário manual de cálculo

| Parâmetro | Valor de teste |
| --- | --- |
| Perfil | Atacadista (Anexo I) |
| Origem | Próprio Estado (CE) ou exterior do País |
| Carga tributária interna | 20% — alíquota geral |
| Produtos | R$ 1.000,00 |
| IPI | R$ 50,00 |
| Frete | R$ 30,00 |
| Seguro | R$ 20,00 |
| Outros encargos | R$ 0,00 |
| Simples Nacional | Não selecionado |
| Transferência | Não selecionada |
| Contrato de fidelidade | Não selecionado |
| FECOP | Selecionado, 2,58% |

**Memória esperada:** base documental de R$ 1.100,00; carga líquida de 8,00%; ICMS-ST de R$ 88,00; FECOP de R$ 28,38; total de R$ 116,38.

**Estado verificado no navegador:** a aplicação aceitou os cinco valores monetários no formato brasileiro (`1.000,00`, `50,00`, `30,00`, `20,00` e `0,00`) e preservou as seleções padrão do cenário para a execução do cálculo.

**Resultado verificado no navegador:** a mensagem de sucesso foi exibida e a memória apresentou exatamente R$ 1.100,00 de base documental, R$ 1.100,00 de base aplicável, 8,00% de carga final, R$ 88,00 de ICMS-ST, R$ 28,38 de FECOP e R$ 116,38 de total estimado.

**Cópia de conteúdo:** o botão **Copiar memória** foi acionado com sucesso e exibiu confirmação de cópia, preservando a possibilidade de reutilizar o conteúdo visível mesmo com as dissuasões de inspeção de interface ativas.

> Os dados acima são apenas valores sintéticos para conferir o funcionamento matemático da interface. Não representam uma apuração real nem substituem a validação tributária do caso concreto.
