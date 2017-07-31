# legacy-framework

Analyzify é o framework de rastreamento completo de eventos desde cliques até engajamento com elementos específicos de uma página.

Ele é projetado para trabalhar em conjunto com o Google Tag Manager, todos os eventos são inseridos em formato JSON na variável global monitorada dataLayer.

Com o Analyzify você é capaz de melhorar o conhecimento do seu público, a precisão das suas campanhas de remarketing, análise de eficiência das suas páginas, especialmente landing pages e ter gatilhos de eventos prontos para executar qualquer função que você queira, seja abrir uma modal, mudar a cor do seu background, carregar um chamar uma API dinamicamente ou seja lá o que você quiser fazer.

Se precisar de algum monitoramento extra, por API JS de algum Iframe por exemplo, o framework pode ser facilmente expandido. Você pode adicionar ações a eventos monitorados apenas setando variáveis globais.

## Setup

1. Carregue o Analzyfy.min.js após o jQuery, que deve estar pelo menos na versão 3.0. **OBS:** O Google recomenda colocar o script do Tag manager na abertura do <head>, porém, com as configurações do framework, não há problemas em carregar depois da abertura do <body>.
2. Importe GTM-config.json no seu GTM. **OBS:** Se você tem outras configurações no seu GTM, não há problemas. Todos os triggers são customizados, apenas verifique se por coincidência alguma variável sua do dataLayer configurada não está igual à alguma do GTM-config antes de confirmar a importação. Lembre-se de usar a opção "combinar" na hora da importação, e não "substituir".
3. No GTM, dentro da pasta "..Config - Tags IDs", insira seu o seu ID do Pixel do Facebook em "fbPixel" e seu ID do Google Analytics em "gaId". O restante das variáveis nessa pasta são opcionais, se você não definir, as tags relativas a elas não serão disparadas.
4. Agora no seu Analytics, em Administrador > Propriedade > Defnições Personalizadas você precisa definir 4 dimensões personalizadas:
    4.1. Client ID - escopo: Usuário
    4.2. Sesssion ID - escopo: Sessão
    4.3. Hit Timestamp - escopo: Hit
    4.4. User ID - escopo: Hit
5. Ainda em definições personalizadas, defina uma métrica personalizada:
    5.1. Total Engaged Time - escopo: Hit, formatação: tempo
6. Anote os índices das dimensões e métricas acima. Em Administrador > Vista da Propriedade > Métricas Calculadas adicione uma métrica calculada com nome "Average Active Time" com formatação "tempo" e fórmula "{{Total Engaged Time}} / {{Visualizações de página}}", sem aspas.
7. Voltando ao GTM, nas pastas "..Config - Custom Dimension" e "..Config - Custom Metrics", defina os valores como os respectivos índices anotados. Se você não realizou definições personalizadas anteriormente e fez na ordem escrita aqui, já devem estar com os valores corretos.

Feito isso, o setup está pronto e você já pode começar a rastrear com o Analyzify.

## Uso

Documentação detalhada em breve