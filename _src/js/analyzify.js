/* 
 Author      : https://www.dannyfranca.com.br
 Repository  : https://github.com/dannyfranca/analyzify-framework
 */

/* global index, property, param, eval, ytVideos, window.ytPlayers, YT, parseFloat, dataLayer */

//-----PRESETS-----
window.BASE = document.location.hostname;
window.page = document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search;
window.ajaxPage = window.ajaxPage || false;
window.hidden = window.hidden || false;
window.query_string = QueryStringToJSON();
window.fwDebug = window.fwDebug || false; //debug switch
window.analyzifyInject = window.analyzifyInject || {};

//DATALAYER INIT
window.dataLayer = window.dataLayer || [];

/**
 * GLOBAL TO JQUERY LINK
 * 
 * Porta de entrada para invocar funções jQuery a partir do escopo global. Veja mais detalhes em <b>GLOBAL FUNCTION LISTENER</b>.
 * 
 * @param {function} callback
 * @returns {Create.scriptsAnonym$0}
 */
function Create(callback) {
    var jqObj = false;
    return {
        func: function (jqObj) {
            callback(jqObj);
        }
    };
}

/**
 * Função para pegar o path, inteiro ou uma parte, da URL.
 * 
 * @param {integer} n (Opcional) Ordem específica do URL Path.
 * @returns Retorna URL Path inteira ou fragmentada se n for definido.
 */
function getUrlPath(n) {
    var path = window.location.pathname.toLowerCase();
    if (n) {
        path = path.split("/")[n];
    }
    return path;
}

function QueryStringToJSON() {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

//GET PARAMETERS
/**
 * Recebe valor de determinado parâmetro da URL.
 * @param {string} name - Nome do parâmetro
 * @returns Valor do parâmetro setado em <b>name</b>
 */
function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results === null) {
        return null;
    } else {
        return results[1] || 0;
    }
}

/**
 * DATALAYER PUSH
 * 
 * Envia dados para a camada de dados do Google Tag Manager como evento omeado legacyEvent.
 * Se debug for true, exibirá os eventos no console do navegador.
 * 
 * @param {string/Integer/Float} cat - Categoria do Evento
 * @param {string/Integer/Float} act - Ação do Evento
 * @param {string/Integer/Float} lab - (Opcional) Rótulo do Evento
 * @param {string/Integer/Float} val - (Opcional) Valor do Evento
 * @param {boolean} nInt - (Opcional) Padrão: false. Se setado como true indica ao Analytics que é um <b>hit de não interação</b> (Não influencia na taxa de rejeição)
 * @param {string} tran - (Opcional) Se setado como qualquer valor, exceto null, será enviado <b>transport: beacon</b> ao Analytics (Tipo de transporte onde o Analytics coleta dados para enviar em um hit único ao final da sessão. Recomendado para eventos beforeUnload)
 * @param {string} exc - (Opcional) Se definido, informará ao Google Tag Manager quais tags de <b>evento não disparar</b>. se setado como <b>'fb'</b>, o evento apenas será enviado ao Analytics, se setado como <b>'ga'</b>, o evento apenas será enviado ao Facebook. Se setado como <b>'fbga' ou 'fb ga'</b> não será enviado evento algum, o que é válido se você apenas quiser enviar para suas outras integrações no GTM.
 * @param {object} obj - (Opcional) Objeto com métricas customizadas para expandir os dados enviados pelo dlPush().
 */
function dlPush(cat, act, lab, val, nInt, tran, exc, obj) {

    var event = {
        eventCategory: checkType(cat),
        eventAction: checkType(act),
        eventLabel: checkType(lab),
        eventValue: checkType(val),
        nonInteraction: nInt ? (nInt === true || nInt === 'true' || nInt === 1 ? true : false) : false,
        transport: tran ? 'beacon' : null,
        exceptions: exc ? String(exc) : null,
        event: 'legacyEvent'
    };

    if (typeof obj === 'object' && obj !== null) {
        Object.assign(event, obj);
    }

    if (cat && act && window.fwDebug !== true) {
        window.dataLayer.push(event);
    } else if (window.fwDebug === true) {
        console.log(JSON.stringify(event));
    }

    function checkType(param) {
        return (param ? (isNaN(Number(param)) ? String(param) : (typeof param === 'boolean' ? param : Number(param))) : null);
    }

    $(function () {
        window.jqLink.func({
            '$.sessionAlive': []
        });
    });
}

//INÍCIO FUNÇÕES JQUERY
$(function () {

    //-----JQUERY PRESETS-----
    window.height = $(window).height();
    window.width = $(window).width();
    window.hashVal = window.location.hash.replace(/^#/, "");
    window.menuInitialHeight = $('[data-menu*="fixed-"]').length ? $('[data-menu*="fixed-"]').outerHeight() : 0;
    window.logoDeltaHeight = $('[data-menu*="fixed-"]').length ? 27 : 0; //variação da altura da logo
    window.menuHeight = window.menuInitialHeight - window.logoDeltaHeight;

    //-----GET UTM TAGS-----
    window.utmSource = urlParam('utm_source');
    window.utmMedium = urlParam('utm_medium');
    window.utmCampaign = urlParam('utm_campaign');
    window.utmTerm = urlParam('utm_term');
    window.utmContent = urlParam('utm_content');

    //-----DATALAYER INITIAL PUSH-----
    window.dataLayer.push(
            {
                originalLocation: window.page,
                utmSource: window.utmSource,
                utmMedium: window.utmMedium,
                utmCampaign: window.utmCampaign,
                utmTerm: window.utmTerm,
                utmContent: window.utmContent
            }
    );

    /**
     * Injeta atributos e seus respectivos valores em elementos por meio de seletores jQuery.
     * 
     * Se select não for definido, usará os dados do objeto global analyzifyInject:
     *  window.analyzifyInject = {
     'selector1': {
     'attr1': "value",
     'attr2': "value"
     },
     'selector2': {
     'attr1': "value",
     'attr2': "value"
     }
     };
     * 
     * OBS: Para evitar sobrescrever o objeto de injeção, utilize o método <b>Object.assign(window.analyzifyInject, {...})</b>, que é uma alternativa ao array.push() para mesclar objetos.
     * Ex:
     *  Object.assign(window.analyzifyInject, {
     'selector1': {
     'attr1': "value",
     'attr2': "value"
     },
     'selector2': {
     'attr1': "value",
     'attr2': "value"
     }
     });
     * 
     * Nos valores dos atributos podem ser usados coringas que retornam valores dinamicamente de cada elemento:
     * 
     * - {{attr}}: Essa bloco é substituído pelo valor do atributo descrito. Ex: {{id}} é substituído pelo id do elemento. Se o atributo não existir, nada é substituído.
     * - [[count]]: Esse bloco é substituído pelo índice do seletor, começando de 1. Ex: Se a classe .cta estiver em 3 elemento, [[count]] irá incrementar de 1 a 3 em cada loop.
     * 
     * @param {Object/String} select - Seletor jQuery para aplicar atributos e respectivos valores, vide os outros parâmemetros. Se for um Objeto, deve ter a mesma estrutura da variável global analyzifyInject e injetará apenas os dados setados como parâmetro.
     * @param {String} attr - Nome do atributo a ser injetado
     * @param {String} value - Valor do atributo injetado
     */
    $.analyzifyInjection = function (select, attr, value) {
        if (typeof select === 'undefined') {
            if (typeof window.analyzifyInject !== undefined) {
                for (var selector in window.analyzifyInject) {
                    $(selector).each(function (index) {

                        var counter = index + 1;

                        for (var attribute in window.analyzifyInject[selector]) {

                            var attrValue = String(window.analyzifyInject[selector][attribute]);

                            if (attrValue !== "") {
                                //get term between braces
                                var match = attrValue.match(/\{\%([^}]+)\%\}/g);
                                if (typeof match !== 'undefined') {
                                    var attrNames = [];
                                    $.each(match, function (i, el) {
                                        if ($.inArray(el, attrNames) === -1)
                                            attrNames.push(el);
                                    });
                                    for (var i in attrNames) {
                                        var attrName = attrNames[i].replace('{%', '').replace('%}', '');
                                        var getAttr = $(this).attr(attrName);
                                        if (typeof getAttr !== 'undefined') {
                                            var regExp = new RegExp(attrNames[i], 'g');
                                            attrValue = attrValue.replace(regExp, getAttr).replace('_go', '');
                                        } else {
                                            console.warn('Attribute ' + attrName + ' undefined in ' + selector + '(index: ' + i);
                                        }
                                    }
                                }

                                //get index
                                if (attrValue.indexOf('[[count]]') !== -1) {
                                    attrValue = attrValue.replace(/\[{2}(count)\]{2}/g, counter);
                                }
                            }

                            $(this).attr(attribute, attrValue);
                        }
                    });
                }
            }
        } else if (typeof attr !== 'undefined' && typeof value !== 'undefined') {

        } else {
            console.warn('Attribute and/or value must be defined');
        }
    };

    $.analyzifyInjection();

    /**
     * Ações executadas quando a aba do navegador não está em foco, executada pela <b>PAGE VISIBILITY API</b>.
     */
    $.pageVisibilityHidden = function () {
        window.hidden = true;
        //YOUTUBE
        if (typeof window.ytPlayers !== "undefined" && window.ytPlayers) {
            ytPause();
        }

        if (window.fwDebug === true) {
            console.log('Tab Hidden');
        }
    };

    /**
     * Ações executadas quando a aba do navegador está em foco, executada pela <b>PAGE VISIBILITY API</b>.
     */
    $.pageVisibility = function () {
        window.hidden = false;
        //YOUTUBE
        if (typeof window.ytPlayers !== "undefined" && window.ytPlayers) {
            $.viewEvent('youtube', true);
        }

        if (window.fwDebug === true) {
            console.log('Tab Visible');
        }
    };

    /**
     * Ações executadas antes da página encerrar, executada em <b>window.onbeforeunload</b>.
     * 
     * - Envia tempo ativo, inclusive contadores customizados.
     * - Ativa função ytExit da integração com a API do YouTube, que marca como evento o tempo de saída do vídeo.
     */
    $.beforeUnload = function () {
        //ACTIVE TIME
        dlPush('Active Time', (window.ajaxPage === false ? window.activeTimerPath : window.ajaxPage.replace(/(https:|http:|)\/\//, '').toLowerCase()), (window.ajaxPage === false ? window.activeTimerFirstPath : null), null, true, 'beacon', null, {
            activeTime: window.activeTimer
        });

        //CUSTOM TIMES
        for (var name in window['customTimers']) {
            if (window['customTimers'][name]['activeListener'] === true) {
                dlPush('Custom Time', window['customTimers'][name]['name'], window['customTimers'][name]['path'], null, true, 'beacon', null, {
                    activeTime: window['customTimers'][name]['activeTimer']
                });
            }
        }

        //YOUTUBE
        if (typeof window.ytPlayers !== "undefined" && window.ytPlayers) {
            ytExit();
        }
    };

    //*****SETUP*****

    //
    /**
     * GLOBAL JQUERY FUNCTION LISTENER
     * 
     * Link para invocar funções do escopo jQuery a partir do escopo global.
     * 
     * @Param {Object} jqObj deve ser um objeto que contém como chaves os nomes das funções e como valores arrays com os parâmetros.
     * 
     * Para ativar funções jquery externamente:
     * 
     * <b>window.jqLink.func({
     *      functionName1: [param1, param2, ...],
     *      functionName2: [param1, param2, ...]
     * });</b>
     */
    window.jqLink = Create(function (jqObj) {
        if (jqObj) {
            for (property in jqObj) {
                try {
                    eval(property).apply(this, jqObj[property]);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.error(e.message);
                    }
                }
            }
        }
    });

    window.load = false;

    $(window).on("load", function () {
        window.load = true;
        window.dataLayer.push({event: 'pageLoad'});
        if (window.hashVal && $('[id="' + window.hashVal + '_go"]').length) {
            var goto = $('[id="' + window.hashVal + '_go"]').offset().top;
            $('html, body').animate({scrollTop: goto - window.menuInitialHeight + window.logoDeltaHeight}, 1000);
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        $.normalize();
        $.handleVisibilityChange();
    });

    //*****END PRESETS*****

    //-----WINDOW ACTIONS-----

    /**
     * SCROLL TRACKING
     * 
     * Responde ao rolamento de página e executando funções do framework após verificar se estão disponíveis.
     */

    window.lastScrollTop = $(window).scrollTop();
    window.scrollTop = $(window).scrollTop();
    $(window).scroll(function () {
        window.scrollTop = $(this).scrollTop(); //DISTANCIA DO TOPO
        $.scrollDirection(); //DIRECAO DA ROLAGEM
        $.userNonIdle();

        if (window.menuFixedTopExist === true) { //REDUZ MENU
            $.reduzMenu();
        }
        if (window.botaoTopoExist === true) { //BOTAO TOPO
            $.exibeBotaoTopo();
        }
        if (window.scrollSpyExist === true && window.load === true) { //SCROLLSPY
            $.scrollSpy();
        }
        if (window.viewEventExist === true && window.load === true) { //VIEWEVENT
            $.viewEvent();
        }
//        if (affixExist === true) { //AFFIX
//            affixScroll();
//            if (affixTopExist === true) {
//                affixTop();
//            }
//            if (affixBottomExist === true) {
//                affixBottom();
//            }
//            if (affixBothExist === true) {
//
//            }
//        }

        window.lastScrollTop = window.scrollTop; //ULTIMA DISTANCIA DO TOPO
    });

    /**
     * DIRECAO DA ROLAGEM
     * 
     * Função de suporte para desenvolvimento. Define scrollDir como 1 se rolando para baixo ou como -1 se rolando para cima. 
     */
    window.scrollDir;
    $.scrollDirection = function () {
        if (window.scrollTop > window.lastScrollTop) {
            window.scrollDir = 1;
        } else if (window.scrollTop < window.lastScrollTop) {
            window.scrollDir = -1;
        }
    };

    /**
     * RESIZE TRACKING
     * 
     * Responde ao redimensionamento do navegador e executa funções do framework após verificar se estão disponíveis.
     */
    $(window).resize(function () {
        window.height = $(window).height();
        window.width = $(window).width();
//        if (affixExist === true) { //AFFIX
//            $.affixCalc();
//            $.affixResize();
//        }
        $.normalize();
    });

    $.normalize = function () {
        if (window.load === true) {
            if (window.scrollSpyExist === true) { //SCROLLSPY
                $.scrollSpyCalc();
            }
            if (window.viewEventExist === true) { //VIEWEVENT
                $.viewEventCalc();
            }
            if (window.jSameHeightExist === true) { //IGUALA ALTURA DE BOX MENORES
                $.sameHeight();
            }
        }
    };

    //*****END WINDOW ACTIONS*****

    //-----EVENT TRACKING-----

    /**
     * <b>ACTIVE TIMER</b>
     * 
     * Rastreamento de tempo ativo do usuário.
     */
    window.idle = true;
    window.firstActive = false;
    window.idleTimer;
    window.activeTimer = 0;
    window.activeMaster = false;
    window.aliveCounter = 0;
    window.activeTimerId = setInterval(function () {
        if ((window.idle === false || window.activeMaster === true) && (window.firstActive === true)) {
            window.activeTimer += 1;
//            console.log('window.activeTimer');
        }
    }, 1000);
    window.activeTimerPath = getUrlPath();
    window.activeTimerFirstPath = getUrlPath(1);

    /**
     * Responde ao foco na página mediante clique.
     * 
     * <b>Atenção</b>: Se comporta de forma diferente ao PAGE VISIBILITY API. Mesmo se a aba estiver visível, essa função só ativa se a janela entrar em foco mediante clique.
     */
    $(window).focus(function () {
        $.userNonIdle();
        $.firstActive();
    });

    /**
     * Responde ao perder foco mediante clique externo.
     */
    $(window).blur(function () {
        window.idle = true;
    });

    /**
     * Responde ao apertar alguma tecla
     */
    $(window).on('keydown', function () {
        if (window.load === true) {
            $.userNonIdle();
            $.firstActive();
        }
    });

    /**
     * Responde ao movimento do mouse
     */
    $(window).on('mousemove', function () {
        $.userNonIdle();
        $.firstActive();
    });

    /**
     * Responde ao clique, especiicamente quando a tecla é apertada, ou segurada.
     */
    $(window).on('mousedown', function () {
        $.userNonIdle();
        $.firstActive();
    });

    /**
     * Armazena função que será executada antes da sessão terminar.
     */
    $(window).on('beforeunload', function () {
        $.beforeUnload();
    });

    /**
     * Informa ao framework que o usuário começou a interagir com a página por meio de uma variável e marcando o evento firstActive na camada de dados do GTM, previnindo que Analytics comece a rodar se usuário apenas abriu o navegador.
     */
    $.firstActive = function () {
        if (window.firstActive === false) {
            window.dataLayer.push({event: 'firstActive'});
            window.firstActive = true;
            if (window.viewEventExist === true && window.load === true) {
                $.viewEvent();
            }
            if (window.fwDebug === true) {
                console.log('First Active');
            }
        }
    };

    /**
     * Marca usuário como não ocioso e continua a contagem do tempo ativo.
     * 
     * Para a contagem se usuário ficar ocioso por 5 segundos.
     */
    $.userNonIdle = function () {
        window.idle = false;
        clearTimeout(window.idleTimer);
        window.idleTimer = setTimeout(function () {
            window.idle = true;
        }, 5000);
    };

    /**
     * Define variável activeMaster como true, o que faz o contador de interação não parar após o tempo ocioso. Útil para ativar se o usuário estiver vendo um vídeo, por exemplo.
     * 
     * @param {boolean} state
     */
    $.activeMaster = function (state) {
        (state === true || state === "true" || state === 1) ? window.activeMaster = true : window.activeMaster = false;
    };

    $.sessionAlive = function () {
        var getActiveTimer = window.activeTimer;
        clearTimeout(window.aliveTimer);
        window.aliveTimer = setTimeout(function () {
            if (getActiveTimer <= window.activeTimer - 10) {
                window.aliveCounter = 0;
                dlPush('Session Alive', (window.ajaxPage === false ? window.activeTimerPath : window.ajaxPage.replace(/(https:|http:|)\/\//, '').toLowerCase()), (window.ajaxPage === false ? window.activeTimerFirstPath : null), null, true, null, 'fb');
            } else {
                window.aliveCounter += 1;
            }
            if (window.aliveCounter < 1) {
                $.sessionAlive();
            }
        }, 1680000);
    };

    $.sessionAlive();

    /**
     * <b>CUSTOM TIMER</b>
     * 
     * Inicia contador ativo personalizado. Previne que o mesmo timer seja iniciado duas vezes.
     * 
     * @param {string} name - Nome único do Timer
     * @param {string} idleTrack - (Opcional) <b>Seletor CSS</b>. Se setado, rastreia o tempo ativo com o elemento específico. Se não setado, o temporizador contará continuamente a menos que a função <b>customUserNonIdle</b> seja executada.
     * @param {string} func - (Opcional) Nome da função executada em invervalos de tempo. Aceita várias funções separadas por ||
     * @param {Array} funcParams - (Opcional) Parâmetros da função.
     * @param {string} funcInterval - (Opcional) Intervalo de tempo em segundos que a função deve ser executada. Se não for setada, a função e parâmetros serão simplesmente ignorados.
     * @param {string} funcLimit - (Opcional) Limite de vezes que a função deve ser executada. Se não setada, a função será executada continuamente a cada intervalo de tempo.
     */
    $.customTimer = function (name, idleTrack, func, funcParams, funcInterval, funcLimit) {
        window['customTimers'] = window['customTimers'] || [];
        window['customTimers'][name] = window['customTimers'][name] || [];
        //check if timer is not already initiated
        if (typeof name !== "undefined" && typeof window['customTimers'][name]['timerInit'] === "undefined") {
            window['customTimers'][name]['name'] = name;
            window['customTimers'][name]['path'] = getUrlPath();
            window['customTimers'][name]['firstPath'] = getUrlPath(1);
            //setup
            window['customTimers'][name]['timerInit'] = true;
            window['customTimers'][name]['idle'] = false;
            window['customTimers'][name]['activeMaster'] = false;
            window['customTimers'][name]['activeTimer'] = 0;
            var counter = 1;
            func ? func = func.split('||') : '';
            funcLimit = isNaN(parseInt(funcLimit)) === false ? parseInt(funcLimit) : false;
            if (typeof idleTrack === "string") {
                $.customActiveListener(name, idleTrack);
            }

            window['customTimers'][name]['activeTimerId'] = setInterval(function () {
                if ((window['customTimers'][name]['idle'] === false || window['customTimers'][name]['activeMaster'] === true) && window.firstActive === true && window.hidden === false) {
                    window['customTimers'][name]['activeTimer'] += 1;
                    if (window.fwDebug === true) {
                        console.log(name + ' - ' + window['customTimers'][name]['activeTimer']);
                    }
                }
                if (typeof funcInterval !== "undefined" && isNaN(parseInt(funcInterval)) === false && window['customTimers'][name]['activeTimer'] >= funcInterval * counter && funcLimit !== 0) {
                    funcParams = $.isArray(funcParams) ? funcParams : [];
                    for (i = 0; i < func.length; i++) {
                        try {
                            eval(func[i]).apply(this, funcParams[i]);
                        } catch (e) {
                            if (e instanceof SyntaxError) {
                                console.error(e.message);
                            }
                        }
                    }
                    counter++;
                    if (funcLimit !== false) {
                        funcLimit--;
                    }
                }
            }, 1000);
        } else if (typeof name === "undefined") {
            console.warn('customTimer: "name" parameter must be defined');
        } else if (typeof window['customTimers'][name]['timerInit'] !== "undefined") {
            console.warn('customTimer: Custom Timer ' + name + ' already initiated. Limit execution to 1 to avoid unecessary executions.');
        } else {
            console.warn('customTimer: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues. Clue your code and explain whats changes you made.');
        }
    };

    /**
     * Elimina contador um contador ativo.
     * 
     * @param {string} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {boolean} definitive - (Opcional) Se setado como true, não permite que o contador de mesmo <b>name</b> seja iniciado novamente na mesma sessão. Se não setado, o contador pode ser reiniciado do zero executando <b>customTimer</b>.
     */
    $.unsetCustomTimer = function (name, definitive) {
        if (typeof name !== "undefined" && typeof window['customTimers'] !== "undefined" && typeof window['customTimers'][name] !== "undefined" && typeof window['customTimers'][name]['timerInit'] !== "undefined") {
            clearInterval(window['customTimers'][name]['activeTimerId']);
            definitive === true || definitive === 'true' || definitive === 1 ? '' : delete window['customTimers'][name]['timerInit'];
        } else if (typeof name === "undefined") {
            console.warn('unsetCustomTimer: "name" parameter must be defined');
        } else if (typeof window['customTimers'] === "undefined" || typeof window['customTimers'][name] === "undefined" || typeof window['customTimers'][name]['timerInit'] === "undefined") {
            console.warn('unsetCustomTimer: You cannot unset Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('unsetCustomTimer: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues. Clue your code and explain whats changes you made.');
        }
    };

    /**
     * Função que rastreia tempo ativo em um <b>customTimer</b> de mesmo <b>name</b> por meio de determinado seletor CSS.
     * 
     * Executada pelo <b>customTimer</b> caso seja definido um seletor CSS pelo parâmetro idleTrack.
     * 
     * @param {string} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {string} selector - <b>Seletor CSS</b>. Indica o elemento para rastrear o tempo ativo.
     */
    $.customActiveListener = function (name, selector) {
        if (typeof name !== "undefined" && typeof selector !== "undefined" && $(selector).length && typeof window['customTimers'] !== "undefined" && typeof window['customTimers'][name] !== "undefined" && typeof window['customTimers'][name]['timerInit'] !== "undefined" && typeof window['customTimers'][name]['activeListener'] === "undefined") {

            window['customTimers'][name]['activeListener'] = true;

            $(selector).focus(function () {
                $.customUserNonIdle(name, true);
            });

            $(selector).blur(function () {
                window['customTimers'][name]['idle'] = true;
            });

            $(selector).on('keydown', function () {
                $.customUserNonIdle(name, true);
            });

            $(selector).on('mousemove', function () {
                $.customUserNonIdle(name, true);
            });

            $(selector).on('mousedown', function () {
                $.customUserNonIdle(name, true);
            });

            $(selector).scroll(function () {
                $.customUserNonIdle(name, true);
            });

            var viewPercent = $(selector).attr('data-view-percent') ? parseInt($(selector).attr('data-view-percent')) : 50;
            var position = $(selector).offset().top;
            var height = $(selector).outerHeight();

            //Percent Test
            if (isNaN(viewPercent) === false) {
                if (viewPercent >= 0) {
                    viewPercent = (viewPercent <= 100 && viewPercent >= 0 ? viewPercent : 50);
                    var viewPositionTop = position - window.height + height * viewPercent / 100;
                    var viewPositionBottom = position - window.menuHeight + height * (100 - viewPercent) / 100;
                } else {
                    viewPercent = -(viewPercent >= -100 && viewPercent <= 0 ? viewPercent : -50);
                    var viewPositionTop = position - window.height * (100 - viewPercent) / 100;
                    var viewPositionBottom = position + height - window.height * viewPercent / 100;
                }
            }

            $(window).scroll(function () {
                if ((window.scrollTop >= viewPositionTop) && (window.scrollTop <= viewPositionBottom)) {
                    $.customUserNonIdle(name, true);
                }
            });

            $(window).resize(function () {
                var viewPercent = $(selector).attr('data-view-percent') ? parseInt($(selector).attr('data-view-percent')) : 50;
                var position = $(selector).offset().top;
                var height = $(selector).outerHeight();

                //Percent Test
                if (isNaN(viewPercent) === false) {
                    if (viewPercent >= 0) {
                        viewPercent = (viewPercent <= 100 && viewPercent >= 0 ? viewPercent : 50);
                        var viewPositionTop = position - window.height + height * viewPercent / 100;
                        var viewPositionBottom = position - window.menuHeight + height * (100 - viewPercent) / 100;
                    } else {
                        viewPercent = -(viewPercent >= -100 && viewPercent <= 0 ? viewPercent : -50);
                        var viewPositionTop = position - window.height * (100 - viewPercent) / 100;
                        var viewPositionBottom = position + height - window.height * viewPercent / 100;
                    }
                }
            });
        } else if (typeof name === "undefined") {
            console.warn('customActiveListener: "name" parameter must be defined');
        } else if (typeof selector === "undefined") {
            console.warn('customActiveListener: "selector" parameter must be defined');
        } else if ($(selector).length) {
            console.warn('customActiveListener: Selector ' + selector + ' dont exist in this page');
        } else if (typeof window['customTimers'] === "undefined" || typeof window['customTimers'][name] === "undefined" || typeof window['customTimers'][name]['timerInit'] === "undefined") {
            console.warn('customActiveListener: You cannot track Custom Timer ' + name + ', it is not initiated yet');
        } else if (typeof window['customTimers'][name]['activeListener'] !== "undefined") {
            if (window['customTimers'][name]['activeListener'] === true) {
                console.warn('customActiveListener: Custom Timer ' + name + ' is already being tracked');
            } else {
                console.warn('customActiveListener: Global variable window["customTimers"]["' + name + '"]["activeListener"] only can be setted to true, check if you are accidentally changed this value outside this function');
            }
        } else {
            console.error('customActiveListener: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues. Clue your code and explain whats changes you made.');
        }
    };

    /**
     * Continua o contador ativo por 5 segundos ou para imediatamente um <b>customTimer</b> de mesmo <b>name</b>. Semelhante ao <b>userNonIdle</b>.
     * 
     * @param {string} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {boolean} state - Se setado como true, contador ativo deixa de ficar ocioso e continua a contagem. Se setado como false, contador fica ocioso e para de contar imediatamente.
     */
    $.customUserNonIdle = function (name, state) {
        if (typeof name !== "undefined" && typeof window['customTimers'] !== "undefined" && typeof window['customTimers'][name] !== "undefined" && typeof window['customTimers'][name]['timerInit'] !== "undefined") {
            if (state === true || state === "true" || state === 1) {
                window['customTimers'][name]['idle'] = false;
                clearTimeout(window['customTimers'][name]['idleTimer']);
                window['customTimers'][name]['idleTimer'] = setTimeout(function () {
                    window['customTimers'][name]['idle'] = true;
                }, 5000);
            } else {
                window['customTimers'][name]['idle'] = true;
            }
        } else if (typeof name === "undefined") {
            console.warn('customUserNonIdle: "name" parameter must be defined');
        } else if (typeof window['customTimers'] === "undefined" || typeof window['customTimers'][name] === "undefined" || typeof window['customTimers'][name]['timerInit'] === "undefined") {
            console.warn('customUserNonIdle: You cannot change idle state of Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('customUserNonIdle: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues. Clue your code and explain whats changes you made.');
        }
    };

    /**
     * Ativa ou desativa customTimer permanentemente, ignorando estado ocioso o tempo ocioso definido por <b>customUserNonIdle</b>. Útil para ativar se o usuário estiver vendo um vídeo, por exemplo. Semelhante a <b>activeMaster</b>.
     * 
     * @param {type} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {type} state - Se setado como true, <b>customTimer</b> fica ativo definitivamente. Se setado como false, <b>customTimer</b> volta a lervar <b>customUserNonIdle</b> em consideração.
     */
    $.customActiveMaster = function (name, state) {
        if (typeof name !== "undefined" && typeof window['customTimers'] !== "undefined" && typeof window['customTimers'][name] !== "undefined" && typeof window['customTimers'][name]['timerInit'] !== "undefined") {
            (state === true || state === "true" || state === 1) ? window['customTimers'][name]['activeMaster'] = true : window['customTimers'][name]['activeMaster'] = false;
        } else if (typeof name === "undefined") {
            console.warn('customActiveMaster: "name" parameter must be defined');
        } else if (typeof window['customTimers'] === "undefined" || typeof window['customTimers'][name] === "undefined" || typeof window['customTimers'][name]['timerInit'] === "undefined") {
            console.warn('customActiveMaster: You cannot cahnge active master state of Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('customActiveMaster: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues. Clue your code and explain whats changes you made.');
        }
    };

    /**
     * <b>CLICK EVENT</b>
     * 
     * Executa funções mediante cliques em elementos marcados por data-click.
     * 
     * <b>data-click</b>
     * Funções a serem executadas separadas por ||. Ex: data-click="dlPush('cta click', 'cta1')||openModal('main')"
     * 
     * (Opcional) <b>data-click-limit</b>
     * Limite de execuções de cada função separados por vírgula. Ex: data-click-limit="1,null"
     */
    if ($('[data-click]').length) {
        var arrayClick = {};
        $('[data-click]').click(function () {
            var e = $(this).attr('data-click');
            typeof arrayClick[e] !== "undefined" ? '' : arrayClick[e] = {};
            typeof arrayClick[e].counter !== "undefined" ? '' : arrayClick[e].counter = 0;
            var clickFunc = e.split('||');
            var clickLimit = $(this).attr('data-click-limit') ? $(this).attr('data-click-limit').split(',') : 'notset';
            for (i = 0; i < clickFunc.length; i++) {
                var checkLimit = isNaN(parseInt(clickLimit[i]));
                if (checkLimit === false ? clickLimit[i] > arrayClick[e].counter : true) {
                    try {
                        eval(clickFunc[i]);
                    } catch (er) {
                        if (er instanceof SyntaxError) {
                            console.error(er.message);
                        }
                    }
                    if (checkLimit === true) {
                        console.warn('attribute data-click-limit must be like a number. check the [data-click="' + e + '"] element');
                    }
                }
            }
            arrayClick[e].counter++;
        });
    }

    //VIEW EVENT
    if ($('[data-view]').length) {
        window.viewEventExist = true;
        window.arrayView = {};
        var processingViewCalc = false;

        /**
         * <b>VIEW EVENT</b>
         * 
         * Executa funções mediante visualizações de elementos marcados por data-view.
         * 
         * É executada por padrão no rolamento e redimensionamento.
         * 
         * <b>data-view</b>
         * Nome do elemento visível. Pode ser marcado apenas como um atributo sem valor se não quiser atribuir um nome a ele.
         * 
         * Na ausência dos atributos data-view-act e data-nonview-act, data-view desempenha o papel de data-view-act, podendo setar funções separadas por || para serem executadas quando o elemento estiver visível. (Um atalho se você quiser apeans executar uma função quando o elemento estiver visível, não precisa rotular e nem executar ações quando o elemento não está visível). ex: data-view="dlPush('ad view', 'ad1')||adCount('ad#0057')"
         * 
         * (Opcional) <b>data-view-act</b>
         * Quando o elemento estiver visível, funções a serem executadas separadas por ||. Ex: data-view-act="dlPush('ad view', 'ad1')||adCount('ad#0057')"
         * 
         * (Opcional) <b>data-nonview-act</b>
         * Quando o elemento <b>não</b> estiver visível, funções a serem executadas separadas por ||. Ex: data-nonview-act="showElement('.firework')||hideElement('.smile')"
         * 
         * (Opcional) {Integer} <b>data-view-percent</b>
         * Para valores de 0 a 100:
         * Padrão: 50. Porcentagem do elemento visível. Se números maiores que 100 forem definidos, 50 será adotado como valor.
         * 
         * Para valores de -100 a -1:
         * Padrão: -50. A referência não será o elemento, mas sim a porcentagem da altura da tela.
         * 
         * Ex: Para data-view-percent="-60" as funções serão executadas quando o elemento estiver ocupando 60% da tela, seja em relação ao topo ou ao final do elemento. Útil se estiver rastreando visibilidade de longos elementos, como artigos.
         * 
         * (Opcional) {Integer} <b>data-view-time</b>
         * Só executa as funções se o contador ativo global (<b>window.activeTimer</b>) for maior ou igual ao valor de <b>data-view-time</b>. Útil para verificar se um usuário que chegou até determinado momento da página realmente consumiu o conteúdo antes ou apeans rolou até lá.
         * 
         * (Opcional) {Integer} <b>data-view-limit</b>
         * Limita o número de vezes que a função é executada quando o elemento está visível.
         * 
         * (Opcional) {Integer} <b>data-nonview-limit</b>
         * Limita o número de vezes que a função é executada quando o elemento <b>não</b> está visível.
         * 
         * <b>Um exemplo prático:</b>
         * Vamos imaginar um rastreamento do consumo de conteúdo de determinado artigo:
         * 
         * <article class="htmlchars" data-view="customTimer('artigo','.htmlchars')" data-view-limit="1">
         * ...
         *      Conteúdo do artigo aqui
         * ...
         * </article>
         * 
         * Nesse exemplo iniciamos um timer rastreando a interação com a tag do artigo com o seletor .htmlchars. Repare que não foi necessário usar data-view-act, também não precisava usar o data-view-limit, pois a função customTimer já verifica se o timer foi iniciado e não permite ser duplicado ou sobrescrito, foi só uma camada de segurança a mais. Depois o beforeunload se encarrega de enviar o timer para o GTM.
         * 
         * @param {string} view - (Opcional) Se setado, <b>viewEvent</b> verifica apenas se elementos marcados com <b>data-view</b> e valor <b>view</b> estão visíveis. Qualquer outro elemento visível não executará qualquer ação.
         * @param {boolean} ignorealt - (Opcional) Por padrão, as funções são executadas uma vez e só serão executadas novamente caso o elemento marcado não fique visível e venha ma ficar visível novamente. Com o ignorealt setado como true, a função é executada continuamente toda vez que a função <b>viewEvent</b> for invocada. Ex: É utilizado para dar play e pausar vídeo do YouTube quando a janela está ou não ativa, isso evita bugs e reações inesperadas. Não é usado true como padrão pois as funções seriam executadas diversas vezes enquanto o usuário rola pelo elemento visível.
         */
        $.viewEvent = function (view, ignorealt) {
            if (window.load === true && window.firstActive === true) {
                var selector = view ? '[data-view="' + view + '"]' : '[data-view]';

                $(selector).each(function () {
                    var e = $(this).attr('data-view');
                    if (typeof arrayView[e] !== "undefined") {
                        var timerCheck = window.activeTimer >= arrayView[e]['viewTime'];

                        if ((window.scrollTop >= arrayView[e]['viewPositionTop']) && (window.scrollTop < arrayView[e]['viewPositionBottom'])) {
                            if (arrayView[e]['viewHidden'] !== true && $(this).is(":visible")) {
                                if ((arrayView[e]['alt'] !== true || ignorealt === true) && timerCheck) {
                                    if ($(this).attr('data-view-act')) {
                                        var viewFunc = $(this).attr('data-view-act').split('||');
                                        for (i = 0; i < viewFunc.length; i++) {
                                            if (isNaN(parseInt(arrayView[e]['viewLimit'][i])) === false ? arrayView[e]['viewLimit'][i] > arrayView[e]['viewCounter'] : true) {
                                                try {
                                                    eval(viewFunc[i]);
                                                } catch (e) {
                                                    if (e instanceof SyntaxError) {
                                                        console.error(e.message);
                                                    }
                                                }
                                            }
                                        }
                                        ignorealt !== true ? arrayView[e]['viewCounter']++ : '';
                                    } else if (!($(this).attr('data-nonview-act'))) {
                                        var viewFunc = e.split('||');
                                        for (i = 0; i < viewFunc.length; i++) {
                                            if (isNaN(parseInt(arrayView[e]['viewLimit'][i])) === false ? arrayView[e]['viewLimit'][i] > arrayView[e]['viewCounter'] : true) {
                                                try {
                                                    eval(viewFunc[i]);
                                                } catch (e) {
                                                    if (e instanceof SyntaxError) {
                                                        console.error(e.message);
                                                    }
                                                }
                                            }
                                        }
                                        ignorealt !== true ? arrayView[e]['viewCounter']++ : '';
                                    }
                                }
                                arrayView[e]['alt'] = true;
                            }
                        } else {
                            if ((arrayView[e]['alt'] !== false || ignorealt === true) && timerCheck) {
                                if ($(this).attr('data-nonview-act')) {
                                    var viewFunc = $(this).attr('data-nonview-act').split('||');
                                    for (i = 0; i < viewFunc.length; i++) {
                                        if (isNaN(parseInt(arrayView[e]['nonViewLimit'][i])) === false ? arrayView[e]['nonViewLimit'][i] > arrayView[e]['nonViewCounter'] : true) {
                                            try {
                                                eval(viewFunc[i]);
                                            } catch (e) {
                                                if (e instanceof SyntaxError) {
                                                    console.error(e.message);
                                                }
                                            }
                                        }
                                    }
                                    ignorealt !== true ? arrayView[e]['nonViewCounter']++ : '';
                                }
                                arrayView[e]['alt'] = false;
                            }
                        }
                    } else {
                        console.warn('You cannot check if element [data-view="' + e + '"] is visible, positions is not calculated yet. You need to execute $.viewEventCalc first');
                    }
                });
            }
        };

        /**
         * Calcula as posição de cada elemento com data-view.
         * 
         * Executado em scroll e resize.
         */
        $.viewEventCalc = function (view) {
            if (processingViewCalc === false) {
                var selector = view ? '[data-view="' + view + '"]' : '[data-view]';
                
                $(selector).each(function () {
                    var e = $(this).attr('data-view');
                    if (typeof arrayView[e] !== "undefined") {
                        arrayView[e]['position'] = $(this).offset().top;
                        arrayView[e]['height'] = $(this).outerHeight();
                    } else {
                        arrayView[e] = {position: $(this).offset().top, height: $(this).outerHeight()};
                    }
                    var checkTime = isNaN(parseInt($(this).attr('data-view-time')));
                    arrayView[e]['viewTime'] = checkTime === false ? parseInt($(this).attr('data-view-time')) : 0;
                    arrayView[e]['viewPercent'] = $(this).attr('data-view-percent') ? parseInt($(this).attr('data-view-percent')) : 50;
                    typeof arrayView[e]['viewCounter'] !== "undefined" ? '' : arrayView[e]['viewCounter'] = 0;
                    typeof arrayView[e]['nonViewCounter'] !== "undefined" ? '' : arrayView[e]['nonViewCounter'] = 0;
                    arrayView[e]['viewLimit'] = $(this).attr('data-view-limit') ? $(this).attr('data-view-limit').split(',') : 'notset';
                    arrayView[e]['nonViewLimit'] = $(this).attr('data-nonview-limit') ? $(this).attr('data-nonview-limit').split(',') : 'notset';
                    arrayView[e]['viewHidden'] = $(this).attr('data-view-hidden');
                    arrayView[e]['viewHidden'] = arrayView[e]['viewHidden'] === 1 || arrayView[e]['viewHidden'] === true || arrayView[e]['viewHidden'] === 'true' ? true : false;
                    if (checkTime === true) {
                        console.warn('attribute data-click-time must be like a number. Check the [data-view="' + e + '"] element');
                    }
                    //Percent Test
                    if (isNaN(arrayView[e]['viewPercent']) === false) {
                        if (arrayView[e]['viewPercent'] >= 0) {
                            arrayView[e]['viewPercent'] = (arrayView[e]['viewPercent'] <= 100 && arrayView[e]['viewPercent'] >= 0 ? arrayView[e]['viewPercent'] : 50);
                            arrayView[e]['viewPositionTop'] = arrayView[e]['position'] - window.height + arrayView[e]['height'] * arrayView[e]['viewPercent'] / 100;
                            arrayView[e]['viewPositionBottom'] = arrayView[e]['position'] - window.menuHeight + arrayView[e]['height'] * (100 - arrayView[e]['viewPercent']) / 100;
                        } else {
                            arrayView[e]['viewPercent'] = -(arrayView[e]['viewPercent'] >= -100 && arrayView[e]['viewPercent'] <= 0 ? arrayView[e]['viewPercent'] : -50);
                            arrayView[e]['viewPositionTop'] = arrayView[e]['position'] - window.height * (100 - arrayView[e]['viewPercent']) / 100;
                            arrayView[e]['viewPositionBottom'] = arrayView[e]['position'] + arrayView[e]['height'] - window.height * arrayView[e]['viewPercent'] / 100;
                        }
                    }
                });
                $.viewEvent();
                processingViewCalc = false;
            }
        };
    }

    //PAGE VISIBILITY API
    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    /**
     * Após página carregada, executa ações das funções <b>pageVisibilityHidden</b>, se página <b>não</b> está visível, ou <b>pageVisibility</b>, se página está visível
     */
    $.handleVisibilityChange = function () {
        if (document[hidden]) { // If the page is hidden
            $.pageVisibilityHidden();
        } else { // if the page is shown
            $.pageVisibility();
        }
    };

    if (!(typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined")) {
        // Handle page visibility change
        document.addEventListener(visibilityChange, $.handleVisibilityChange, false);
    }

    /**
     * <b>OUTBOUND CLICKS</b>
     * 
     * Verifica se clique em um link tem destino fora do site. Se positivo, envia evento ao GTM informando site e link completo.
     */
    if (typeof window.BASE !== 'undefined') {
        $('a[href^="http"]').filter(function () {
            return this.href.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
        }).click(function () {
            var href = $(this).attr('href') ? $(this).attr('href') : '';
            if ((href.indexOf('http://') !== -1 || href.indexOf('https://') !== -1) && href.indexOf(window.BASE) === -1) {
                var site = href.replace(/(https:|http:|)\/\//, '');
                var n = site.indexOf('/');
                site = site.substring(0, n !== -1 ? n : site.length);
                dlPush('Click', 'Outgoing', site, href);
            }
        });
    }

    //*****EVENT TRACKING*****

    //-----FUNCIONALIDADES-----

    /**
     * <b>HASH ROLL</b>
     * 
     * Faz rolamento até elemento com <b>id</b> igual ao <b>href</b> do elemento clicado com sufixo <b>_go</b>.
     * Também previne comportamento padrão no processo.
     * @param event - Marcação apenas para prevenir comportamento padrão.
     */
    if ($('[id$="_go"]').length) {
        $('a[href^="#"]').click(function (event) {
            event.preventDefault();
            var selector = $('[id="' + $(this).attr('href').replace('#', '') + '_go"]');
            if (selector.length) {
                var goto = selector.offset().top;
                $('html, body').stop().animate({scrollTop: goto - window.menuInitialHeight + window.logoDeltaHeight}, 1000);
                return false;
            }
        });
    }

    /**
     * Exibe submenu ao clicar no ítem .submenu
     */
    $('.main_header_nav_item.submenu').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
        $(this).children('.main_header_nav_sub').slideToggle();
    });

    /**
     * <b>BACK TOPO</b>
     * 
     * Volta ao topo ao clicar no botão .j_back
     */
    $('.j_back').click(function () {
        $('html, body').animate({scrollTop: 0}, 1000);
    });

    /**
     * <b>YOUTUBE DYNAMIC PLAY</b>
     * 
     * Abre modal para carregar vídeos dinamicamente (Semelhante ao Active Pages). Em breve será modificada para aceitar a API do YouTube
     */
    $('.play_take_start').click(function () {
        var Testimony = $(this).attr('id');
        var Headding = $(this).find('h1').html();
        $('.play_take_content h1').html(Headding);
        $('.play_take_content .embed-container').html('<iframe width="640" height="360" src="https://www.youtube.com/embed/' + Testimony + '?rel=0&amp;showinfo=0&autoplay=1&origin=https://wspp.upinside.com.br" frameborder="0" allowfullscreen></iframe>');
        $('.play_take').fadeIn(200);
    });

    /**
     * Fecha a modal YOUTUBE DYNAMIC PLAY aberta
     */
    $('.play_take_close').click(function () {
        $('.play_take').fadeOut(200, function () {
            $('.play_take_content .embed-container').html('');
        });
    });

    /**
     * <b>REDUZ MENU</b>
     * 
     * Reduz altura do menu fixo suavemente, desde qeu devidamente marcado com data-menu e valor iniciado com "fixed-"
     */

    if ($('[data-menu="fixed-top"]').length) {
        /**
         * Reduz a altura do menu se posição do rolamento for maior que zero. E alterna entre logos branca e original na presença da lcasse .transparente
         */
        $.reduzMenu = function () {
            if (window.scrollTop > 0) {
                $('[data-menu="fixed-top"]').addClass('main_header_fixed');
                $.addLogo();
            }
            if (window.scrollTop === 0) {
                $('[data-menu="fixed-top"]').removeClass('main_header_fixed');
                $.addLogoWhite();
            }
        };
        /**
         * Se junto ao data-menu estiver presente a class .transparente, a logo será trocada para a versão branca.
         */
        $.addLogoWhite = function () {
            if ($('[data-menu="fixed-top"].transparente .img-logo.switch').length) {
                $('[data-menu="fixed-top"] .img-logo').attr('src', logoWhiteSrc);
                $('[data-menu="fixed-top"] .mobile_action').addClass('white');
            }
        };
        /**
         * Se junto ao data-menu estiver presente a class .transparente, a logo será trocada para a versão original.
         */
        $.addLogo = function () {
            if ($('[data-menu="fixed-top"].transparente .img-logo.switch').length) {
                $('[data-menu="fixed-top"] .img-logo').attr('src', logoSrc);
                $('[data-menu="fixed-top"] .mobile_action').removeClass('white');
            }
        };

        window.menuFixedTopExist = true;
        var logoSrc = $('[data-menu="fixed-top"] .img-logo').attr('src');
        var logoWhiteSrc = logoSrc.substr(0, logoSrc.indexOf('.')) + '-white.png';
        if ($('.j_padding_top').length) {
            $('.j_padding_top').css('padding-top', window.menuInitialHeight);
        } else {
            $('body').css('padding-top', window.menuInitialHeight);
        }
        $('[data-menu="fixed-top"]').addClass('fixed_top');
        if ($(window).scrollTop() > 0) {
            $('[data-menu="fixed-top"]').addClass('main_header_fixed');
        } else {
            $.addLogoWhite();
        }
    }

    /**
     * <b>MOBILE MENU</b>
     * 
     * Em telas menores, abre menu lateral
     */
    $('.mobile_action').click(function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
            $('.main_header_nav').animate({'left': '0px'}, 100);
        } else {
            $(this).removeClass('active');
            $('.main_header_nav').animate({'left': '-100%'}, 100);
        }
    });

    /**
     * <b>EXIBE BOTAO TOPO</b>
     * 
     * Exibe botão para voltar ao topo
     */
    if ($('.j_back').length) {
        window.botaoTopoExist = true;
        $.exibeBotaoTopo = function () {
            if (window.scrollTop > 0) {
                $('body').append('<div class="j_back backtop round" title="Voltar ao topo"></div>');
            } else {
                $('.j_back').remove();
            }
        };
    }

    //SCROLLSPY
    if ($('[data-spy]').length) {
        window.scrollSpyExist = true;
        var arraySpy = {};
        var processingSpy = false;
        var processingSpyCalc = false;

        /**
         * Calcula as posição de cada elemento com data-spy.
         */
        $.scrollSpyCalc = function () {
            if (processingSpyCalc === false) {
                processingSpyCalc = true;
                $('[data-spy]').each(function (i) {
                    arraySpy[i] = {dataspy: $(this).attr('id').replace("_go", ""), position: $(this).offset().top - window.menuInitialHeight, height: $(this).outerHeight()};
                });
                $.scrollSpy();
                processingSpyCalc = false;
            }
        };

        /**
         * <b>SCROLLSPY</b>
         * 
         * Muda cor dos ítens do menu com atributo <b>scrollspy</b>.
         * 
         * Na presença do atributo <b>data-spy</b> a função busca no mesmo elemento o valor do atributo <b>href</b> e verifica se é equivalente ao href do menu scrollspy. Verifica elementos com sufixo <b>_go</b> também.
         */
        $.scrollSpy = function () {
            if (processingSpy === false) {
                processingSpy = true;
                $('[data-spy]').each(function (i) {
                    if ((window.scrollTop >= arraySpy[i].position - 5) && (window.scrollTop < arraySpy[i].position + arraySpy[i].height - 5)) {
                        $('[scrollspy] [href="#' + arraySpy[i].dataspy + '"]').addClass('active');
                    } else {
                        $('[scrollspy] [href="#' + arraySpy[i].dataspy + '"]').removeClass('active');
                    }
                });
                processingSpy = false;
            }
        };
    }

//    //AFFIX
//    affixCalc();
//
//    function affixCalc() {
//        var affixCalc = (Math.floor(($('.j_affix').width() / $('.j_affix_height').width())) < 1);
//    }
//
//    if (($('.j_affix').length === 1) && ($('.j_affix_height').length === 1) && (affixCalc === true)) {
//        var affixPosition = $('.j_affix').offset().top;
//        var affixHeight = $('.j_affix').outerHeight();
//        var affixLastPosition = affixPosition;
//        var affixDelta = affixHeight - windowHeight;
//        var affixFirstMarginTop = $('.j_affix').css('margin-top');
//        var affixLastMarginTop = $('.j_affix').css('margin-top');
//        var affixBothControl;
//        var affixBothPosition;
//        var affixRefHeight = $('.j_affix_height').outerHeight();
//        function affixScroll() {
//            $('.j_affix').width();
//            affixHeight = $('.j_affix').outerHeight();
//            affixDelta = affixHeight - windowHeight;
//        }
//        function affixResize() {
//            affixHeight = $('.j_affix').outerHeight();
//            affixDelta = affixHeight - windowHeight;
//        }
//        //AFFIX TOP
//        if ($('[affixtop]').length) {
//            var affixTopExist = true;
//            function affixTop() {
//                if ((scrollTop >= affixPosition - menuHeight) && (scrollTop < affixPosition + affixRefHeight - affixHeight)) {
//                    $('[affixtop]').css({'margin-top': scrollTop - affixPosition + menuHeight});
//                } else if (scrollTop >= affixPosition + affixRefHeight - affixHeight) {
//                    affixLastMarginTop = $('[affixtop]').css('margin-top');
//                    $('[affixtop]').css({'margin-top': affixLastMarginTop});
//                } else {
//                    $('[affixtop]').css({'margin-top': affixFirstMarginTop});
//                }
//            }
//        }
//        //AFFIX BOTTOM
//        if ($('[affixbottom]').length) {
//            var affixBottomExist = true;
//            function affixBottom() {
//                if (scrollTop >= affixPosition + affixDelta) {
//                    $('[affixbottom]').css({position: 'fixed', bottom: 0});
//                } else {
//                    $('[affixbottom]').css({position: '', bottom: ''});
//                }
//            }
//        }
//        //AFFIX BOTH
//        if ($('[affixboth]').length) {
//            var affixBothExist = true;
//            function affixBoth() {
//                if ((scrollTop > lastScrollTop) && (scrollTop >= affixLastPosition + affixDelta)) {
//                    $('[affixboth]').css({position: 'fixed', bottom: 0, top: '', marginTop: ''});
//                    affixLastPosition = scrollTop;
//                    affixBothControl = 1;
//                    affixBothPosition = $('.j_affix').offset().top;
//                } else if ((scrollTop < lastScrollTop) && (scrollTop >= affixPosition - menuHeight) && (scrollTop <= affixLastPosition - affixDelta)) {
//                    $('[affixboth]').css({position: 'fixed', top: menuHeight, bottom: '', marginTop: ''});
//                    affixLastPosition = scrollTop;
//                    affixBothControl = 1;
//                    affixBothPosition = $('.j_affix').offset().top;
//                } else if (scrollTop < affixPosition - menuHeight) {
//                    $('[affixboth]').css({position: '', top: '', bottom: '', marginTop: ''});
//                    affixLastPosition = affixPosition;
//                } else if (((scrollTop > lastScrollTop) && ($('[affixboth]').css('top') === menuHeight + 'px')) || ((scrollTop < lastScrollTop) && ($('[affixboth]').css('bottom') === 0 + 'px'))) {
//                    if (affixBothControl === 1) {
//                        $('[affixboth]').css({position: '', marginTop: affixBothPosition, bottom: '', top: ''});
//                        affixBothControl += 1;
//                    }
//                    if (affixBothControl === 2) {
//
//                    }
//                }
//            }
//        }
//        if ((affixTopExist === true) || (affixBottomExist === true) || (affixBothExist === true)) {
//            var affixExist = true;
//        }
//    }

    //MODAL
    if ($('[data-modal]').length) {
        var jModalExist = true;
        var dataModal;
        var modalWidth;
        var modalHeight;

        /**
         * Invoca fechamento de modal ao clicar fora
         * @param event
         */
        $(document).on('click', function (event) {
            if ($(event.target).has('.j_modal_box').length) {
                $.closeModal();
            }
        });

        /**
         * Invoca fechamento da modal ao clicar no botão de fechar
         */
        $('.j_modal_close').click(function () {
            $.closeModal();
        });

        /**
         * Abre modal onde o valor do atributo <b>data-modal</b> é igual ao parâmetro <b>setDataModal</b>
         * @param {string} setDataModal
         */
        $.openModal = function (setDataModal) {
            dataModal = '[data-modal="' + setDataModal + '"]';
            if ($(dataModal).length) {
                $('body').css('overflow', 'hidden');
                $(dataModal).fadeIn();
                $(dataModal + ' input:text:visible:first').focus();
            }
        };

        /**
         * Fecha modais
         */
        $.closeModal = function () {
            $('body').css('overflow', '');
            $('[data-modal]').fadeOut(200);
        };

        /**
         * <b>MODAL BY URL PARAMETER</b>
         * 
         * Após carregar a página, abre modal se o parâmetro da URL <b>modal</b> for igual ao valor do atributo <b>data-modal</b>.
         */
        var modalParam = urlParam('modal');
        if ((modalParam) && (modalParam !== 0)) {
            $.openModal(modalParam);
        }
    }

    //IGUALAR ALTURA DE BOX MENORES
    if ($('[data-same-height]').length) {
        window.jSameHeightExist = true;
        var jSameHeight = {};
        var GreaterSameHeight = {};
        var processingHeights = false;

        /**
         * Iguala altura de boxes com mesmo valor de atributo <b>data-same-height</b>.
         */
        $.sameHeight = function () {
            if (processingHeights === false) {
                processingHeights = true;
                if (window.width > 440) {
                    $('[data-same-height]').each(function (i) {
                        $(this).css('height', '');
                        var order = $(this).attr('data-same-height');
                        typeof GreaterSameHeight[order] !== "undefined" ? '' : GreaterSameHeight[order] = 0;
                        jSameHeight[i] = {height: $(this).height()};
                        if (jSameHeight[i].height > GreaterSameHeight[order]) {
                            GreaterSameHeight[order] = jSameHeight[i].height;
                        }
                    });
                    $('[data-same-height]').each(function (i) {
                        var order = $(this).attr('data-same-height');
                        $(this).css('height', GreaterSameHeight[order]);
                    });
                    GreaterSameHeight = {};
                } else {
                    $('[data-same-height]').each(function (i) {
                        $(this).css('height', '');
                    });
                }
                $.normalize();
                processingHeights = false;
            }
        };
    }

    //*****END FUNCIONALIDADES*****

    //-----WIDGETS-----

    //SHARE BOX
    if ($('.sharebox').length) {

        //SHARE :: FACEBOOK
        $('.facebook a').click(function () {
            var share = 'https://www.facebook.com/sharer/sharer.php?u=';
            var urlOpen = $(this).attr('href');
            window.open(share + urlOpen, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=660, height=400");
            return false;
        });

        //SHARE :: GOOGLE PLUS
        $('.google a').click(function () {
            var share = 'https://plus.google.com/share?url=';
            var urlOpen = $(this).attr('href');
            window.open(share + urlOpen, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=516, height=400");
            return false;
        });

        //SHARE :: TWITTER
        $('.twitter a').click(function () {
            var share = 'https://twitter.com/share?url=';
            var urlOpen = $(this).attr('href');
            var complement = $(this).attr('rel');
            window.open(share + urlOpen + complement, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=660, height=400");
            return false;
        });

    }

    //ACCORDION
    if ($('[data-accord]').length) {
        $('[data-accord]').click(function () {
            var up = false;
            $('.j_accord_toogle_active').slideUp(200, function () {
                up = true;
                $(this).removeClass('j_accord_toogle_active');
                $.normalize();
            });
            $(this).find('.j_accord_toogle:not(.j_accord_toogle_active)').slideToggle(200, function () {
                up !== true ? $.normalize() : '';
            }).addClass('j_accord_toogle_active');
            up = false;
        });
    }


    //SLIDER
    if ($('[data-slide]').length) {
        var trackSlideClick;
        var trackSlideIndicator;
        var slideOrder;
        var slideId;
        $('[data-slide-go]').click(function () {
            slideId = $(this).attr('data-slide-go');
            trackSlideClick = '[data-slide="' + slideId + '"]';
            trackSlideIndicator = '[data-slide-ind="' + slideId + '"]';
            $.slideGo();
        });

        $('[data-slide-back]').click(function () {
            slideId = $(this).attr('data-slide-back');
            trackSlideClick = '[data-slide="' + slideId + '"]';
            trackSlideIndicator = '[data-slide-ind="' + slideId + '"]';
            $.slideBack();
        });

        $('[data-slide-ind]').click(function () {
            slideId = $(this).attr('data-slide-ind');
            trackSlideClick = '[data-slide="' + slideId + '"]';
            trackSlideIndicator = '[data-slide-ind="' + slideId + '"]';
            slideOrder = $(this).attr('data-order');
            $.slideIndicators();
        });

        /**
         * Avança para o próximo item do slider
         */
        $.slideGo = function () {
            if ($(trackSlideClick + '.first').next().length) {
                $(trackSlideClick + '.first').fadeOut(200, function () {
                    $(trackSlideClick + '.first').removeClass('first').next().fadeIn().addClass('first');
                    $(trackSlideIndicator + '.active').removeClass('active').next().fadeIn().addClass('active');
                });
            } else {
                $(trackSlideClick + '.first').fadeOut(200, function () {
                    $(trackSlideClick + '.first').removeClass('first');
                    $(trackSlideClick).eq(0).fadeIn().addClass('first');
                    $(trackSlideIndicator + '.active').removeClass('active');
                    $(trackSlideIndicator).eq(0).fadeIn().addClass('active');
                });
            }
            return false;
        };

        /**
         * Volta para o item anterior do slider
         */
        $.slideBack = function () {
            if ($(trackSlideClick + '.first').index() > 1) {
                $(trackSlideClick + '.first').fadeOut(200, function () {
                    $(trackSlideClick + '.first').removeClass('first').prev().fadeIn().addClass('first');
                    $(trackSlideIndicator + '.active').removeClass('active').prev().fadeIn().addClass('active');
                });
            } else {
                $(trackSlideClick + '.first').fadeOut(200, function () {
                    $(trackSlideClick + '.first').removeClass('first');
                    $(trackSlideClick + ':last-of-type').eq(0).fadeIn().addClass('first');
                    $(trackSlideIndicator + '.active').removeClass('active');
                    $(trackSlideIndicator + ':last-of-type').eq(0).fadeIn().addClass('active');
                });
            }
            return false;
        };

        /**
         * Avança para o item clicado do slider
         */
        $.slideIndicators = function () {
            if (!($(this).hasClass('active'))) {
                $(trackSlideClick + '.first').fadeOut(200, function () {
                    $(trackSlideClick + '.first').removeClass('first');
                    $(trackSlideClick).eq(slideOrder).fadeIn().addClass('first');
                    $('[data-slide-ind="' + slideId + '"]' + '.active').removeClass('active');
                    $('[data-slide-ind="' + slideId + '"][data-order="' + slideOrder + '"]').addClass('active');
                });
            }
            return false;
        };
    }

    //*****END WIDGETS*****

    //-----DEV TOOLS-----
    if (typeof window.BASE !== 'undefined' && window.BASE === 'localhost' || window.BASE === '127.0.0.1') { //Verifica se está em localhost

        $(window).resize(function () {
            $.definePrefix();
        });
//        $(window).scroll(function () {
//            $.appendScrollTop();
//        });

        /**
         * Verifica a resolução, define o prefixo responsivo e exibe na tela.
         */
        $.definePrefix = function () {
            if (window.width < 480) {
                prefix = '0 (Até 480)';
                $.executePrefix();
            } else if ((window.width >= 480) && (window.width < 768) && (prefix !== 'xs')) {
                prefix = 'xs (480 -> 768)';
                $.executePrefix();
            } else if ((window.width >= 768) && (window.width < 1024) && (prefix !== 'sm')) {
                prefix = 'sm (768 -> 1024)';
                $.executePrefix();
            } else if ((window.width >= 1024) && (window.width < 1280) && (prefix !== 'md')) {
                prefix = 'md (1024 -> 1280)';
                $.executePrefix();
            } else if ((window.width >= 1280) && (prefix !== 'lg')) {
                prefix = 'lg (Maior que 1280)';
                $.executePrefix();
            }
        };

        //DEBUG
        if ($('.debug').length) {
            $('.debug').each(function () {
                $(this).after('<p style="color: #fff; background: #333; padding: 10px">' + $(this).width() + 'px</p>');
            });
        }

        //SCROLLTOP PRINT
        $.appendScrollTop = function () {
            $('body').append('<span class="prefixLabel" style="position: fixed; left: 0; bottom: 0; background-color: rgba(70, 70, 70, 0.8); color: #fff; padding: 10px 16px; border-radius: 0 5px 0 0; text-transform: uppercase;">' + window.scrollTop + '</span>');
        };

        //RESOLUTION PREFIXES
        var prefix;
        var timerPref;

        $.timerPrefix = function () {
            clearTimeout(timerPref);
            timerPref = setTimeout(function () {
                $.removePrefix();
            }, 2000);
        };

        $.removePrefix = function () {
            $('span.prefixLabel').remove();
        };

        $.appendPrefix = function () {
            $('body').append('<span class="prefixLabel" style="position: fixed; left: 0; bottom: 0; background-color: rgba(70, 70, 70, 0.8); color: #fff; padding: 10px 16px; border-radius: 0 5px 0 0; text-transform: uppercase;">' + prefix + '</span>');
        };

        $.executePrefix = function () {
            $.removePrefix();
            $.appendPrefix();
            $.timerPrefix();
        };


        /**
         * Função que escreve no console em diferentes formatos dependendo dos parâmetros definidos ou não.
         * Usada para testes em desenvolvimento.
         *
         * @param x
         * @param y
         */
        $.echos = function (x, y) {
            if (x && y) {
                var echo = '(' + typeof x + ') x: ' + x + ' / ' + '(' + typeof y + ') y: ' + y;
            } else if (x) {
                var echo = '(' + typeof x + ') x: ' + x;
            } else if (y) {
                var echo = '(' + typeof y + ') y: ' + y;
            } else {
                var echo = 'no param';
            }

            consoleLog();
//        alert();

            function consoleLog() {
                console.log(echo);
            }

            function alert() {
                alert(echo);
            }
        };
    }

    //*****END DEV TOOLS*****

//MOBILE DETECTION SOON

}); //FIM FUNÇÕES JQUERY