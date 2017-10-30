/* 
 Author      : https://www.dannyfranca.com.br
 Repository  : https://github.com/dannyfranca/analyzify-framework
 */

/* global index, property, param, eval, parseFloat, dataLayer, p */

//ANALYZIFY INIT
window.ANALYZIFY = window.ANALYZIFY || {};
window.A = ANALYZIFY;

//DATALAYER INIT
window.dataLayer = window.dataLayer || [];

/**
 * Função para pegar o path, inteiro ou uma parte, da URL.
 * 
 * @param {integer} n (Opcional) Índice do URL Path.
 * @returns Retorna URL Path inteira ou fragmentada se n for definido.
 */
ANALYZIFY.urlPath = function (n) {
    var path = window.location.pathname.toLowerCase();
    if (n) {
        path = path.split("/")[n];
    }
    return path;
};

ANALYZIFY.queryStringToJSON = function () {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
};

//GET PARAMETERS
/**
 * Recebe valor de determinado parâmetro da URL.
 * @param {string} paramName - Nome do parâmetro
 * @returns Valor do parâmetro setado em <b>name</b>
 */
ANALYZIFY.urlParam = function (paramName) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === paramName) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

//---- PRESETS -----
ANALYZIFY.config = ANALYZIFY.config || {};
ANALYZIFY.config.backtop = ANALYZIFY.config.backtop || false;
ANALYZIFY.config.backtopContent = ANALYZIFY.config.backtopContent || '<analyzify-backtop title="Voltar ao topo"></analyzify-backtop>';
ANALYZIFY.config.redirectFade = ANALYZIFY.config.redirectFade || false;
ANALYZIFY.config.redirectFadeBg = ANALYZIFY.config.redirectFadeBg || '#111';
ANALYZIFY.config.redirectFadeContent = ANALYZIFY.config.redirectFadeContent || undefined;
ANALYZIFY.config.redirectFadeTime = ANALYZIFY.config.redirectFadeTime || 200;
ANALYZIFY.config.preloadTimer = ANALYZIFY.config.preloadTimer || undefined;
ANALYZIFY.config.analyzifyDefaultEventname = ANALYZIFY.config.analyzifyDefaultEventname || 'analyzifyEvent';
ANALYZIFY.config.dlPushExceptionDefault = ANALYZIFY.config.dlPushExceptionDefault || undefined;
ANALYZIFY.BASE = document.location.hostname;
ANALYZIFY.page = document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search;
ANALYZIFY.ajaxPage = ANALYZIFY.ajaxPage || false;
ANALYZIFY.tabHidden = ANALYZIFY.tabHidden || false;
ANALYZIFY.inject = ANALYZIFY.inject || {};
ANALYZIFY.activeTimerIntervalObj = ANALYZIFY.activeTimerIntervalObj || {300: 30, 600: 60, 3600: 300};
ANALYZIFY.customTimerIntervalObj = ANALYZIFY.customTimerIntervalObj || {};
ANALYZIFY.customTimerIntervalObj.sec = ANALYZIFY.customTimerIntervalObj.sec || {30: 5, 60: 10};
ANALYZIFY.customTimerIntervalObj.min = ANALYZIFY.customTimerIntervalObj.min || ANALYZIFY.activeTimerIntervalObj;
//DEBUG SWITCH
ANALYZIFY.debug = ANALYZIFY.debug || {};
ANALYZIFY.debugParam = ANALYZIFY.urlParam('debug');
if (ANALYZIFY.debugParam !== null) {
    ANALYZIFY.debug[ANALYZIFY.debugParam] = true;
}
//UTM PARAMETERS
ANALYZIFY.utmSource = ANALYZIFY.urlParam('utm_source');
ANALYZIFY.utmMedium = ANALYZIFY.urlParam('utm_medium');
ANALYZIFY.utmCampaign = ANALYZIFY.urlParam('utm_campaign');
ANALYZIFY.utmTerm = ANALYZIFY.urlParam('utm_term');
ANALYZIFY.utmContent = ANALYZIFY.urlParam('utm_content');
//DATALAYER INITIAL PUSH
window.dataLayer.push(
        {
            originalLocation: ANALYZIFY.page,
            utmSource: ANALYZIFY.utmSource,
            utmMedium: ANALYZIFY.utmMedium,
            utmCampaign: ANALYZIFY.utmCampaign,
            utmTerm: ANALYZIFY.utmTerm,
            utmContent: ANALYZIFY.utmContent
        }
);
//CUSTOM ENTRIES FOR PLUGINS
ANALYZIFY.customEntries = ANALYZIFY.customEntries || {};
ANALYZIFY.customEntries.pageHidden = ANALYZIFY.customEntries.pageHidden || {};
ANALYZIFY.customEntries.pageShow = ANALYZIFY.customEntries.pageShow || {};
ANALYZIFY.customEntries.pageLoad = ANALYZIFY.customEntries.pageLoad || {};
ANALYZIFY.customEntries.beforeUnload = ANALYZIFY.customEntries.beforeUnload || {};
ANALYZIFY.customEntries.exitIntent = ANALYZIFY.customEntries.exitIntent || {};
ANALYZIFY.customEntries.scroll = ANALYZIFY.customEntries.scroll || {};
ANALYZIFY.customEntries.resize = ANALYZIFY.customEntries.resize || {};
ANALYZIFY.customEntries.normalize = ANALYZIFY.customEntries.normalize || {};
ANALYZIFY.customEntries.navigate = ANALYZIFY.customEntries.navigate || {};


/**
 * GLOBAL TO JQUERY LINK
 * 
 * Porta de entrada para invocar funções jQuery a partir do escopo global. Veja mais detalhes em <b>GLOBAL FUNCTION LISTENER</b>.
 * 
 * @param {function} callback
 * @returns {ANALYZIFY.create.scriptsAnonym$0}
 */
ANALYZIFY.create = function (callback) {
    var jqObj = false;
    return {
        func: function (jqObj) {
            callback(jqObj);
        }
    };
};

/**
 * Função que escreve no console em diferentes formatos dependendo dos parâmetros definidos ou não.
 * Usada para testes em desenvolvimento.
 *
 * @param x - primeiro valor a ser logado
 * @param y
 * @param alert - se for true, executa alert() ao invés de console.log().
 */
ANALYZIFY.echos = function (x, y, alert) {
    if (x && y) {
        var echo = '(' + typeof x + ') x: ' + x + ' / ' + '(' + typeof y + ') y: ' + y;
    } else if (x) {
        var echo = '(' + typeof x + ') x: ' + x;
    } else if (y) {
        var echo = '(' + typeof y + ') y: ' + y;
    } else {
        var echo = 'no param';
    }

    alert !== true ? console.log(echo) : alert(echo);
};

/**
 * Muda o valor dentro de um objeto definido. Útil para atribuir um valor diante um evento, como por exemplo atribuir dinamicamente a ANALYZIFY.customEntries.exitIntent uma função para abrir uma modal específica relevante quando o usuário tentar sair da página.
 * 
 * @param {object} object - Objeto cujo valor será alterado internamente
 * @param {string} key - Nome de uma chave dentro do objeto object
 * @param {any} value - Novo valor atribuído a variável global
 */
ANALYZIFY.objChangeKeyVal = function (object, key, value) {
    if (typeof object === 'object' && object !== null) {
        if (typeof key === "string") {
            if (typeof value !== 'undefined') {
                object[key] = value;
            } else {
                console.error('changeObjVal: "value" parameter must be defined');
            }
        } else if (typeof key !== 'undefined') {
            console.error('changeObjVal: "variable" parameter must be a string');
        } else {
            console.error('changeObjVal: "variable" parameter must be defined');
        }
    } else if (object || object === false) {
        console.error('changeObjVal: "object" parameter must be an object');
    } else {
        console.error('changeObjVal: "object" parameter must be defined');
    }
};

/**
 * Insere o valor de um objeto dentro dele mesmo na chave pushObject.
 * 
 * @param {object} object - JSON a ser autoinserido.
 * @returns {object}
 */
ANALYZIFY.objSelfPush = function (object) {
    function Clone(x) {
        for (p in x) {
            this[p] = (typeof (x[p]) === 'object') ? new Clone(x[p]) : x[p];
        }
    }
    if (typeof object === 'object' && object !== null) {
        return (function (x) {
            var o = new Clone(x);
            o.pushObject = object;
            return o;
        })(object);
    } else if (object || object === false) {
        console.error('objSelfPush: "object" parameter must be an object');
    } else {
        console.error('objSelfPush: "object" parameter must be defined');
    }
};

ANALYZIFY.entryAssign = function (name, entryName, object) {
    if (typeof name === 'string') {
        if (typeof ANALYZIFY.customEntries[name] === 'object' && ANALYZIFY.customEntries[name] !== null) {
            if (typeof entryName === 'string') {
                if (!ANALYZIFY.customEntries[name][entryName]) {
                    if (typeof object === 'object' && object !== null) {
                        ANALYZIFY.customEntries[name][entryName] = {};
                        Object.assign(ANALYZIFY.customEntries[name][entryName], object);
                    } else if (object || object === false) {
                        console.error('entryAssign: "object" parameter must be an object');
                    } else {
                        console.error('entryAssign: "object" parameter must be defined');
                    }
                } else {
                    console.error('entryAssign: ANALYZIFY.customEntries.' + name + '.' + entryName + ' is already defined');
                }
            } else if (typeof entryName !== 'undefined') {
                console.error('entryAssign: "entryName" parameter must be a string');
            } else {
                console.error('entryAssign: "entryName" parameter must be defined');
            }
        } else {
            var errorName = ANALYZIFY.customEntries[name] === null ? ' value is null' : ' type is ' + typeof ANALYZIFY.customEntries[name];
            console.error('entryAssign: ANALYZIFY.customEntries.' + name + errorName);
        }
    } else if (typeof name !== 'undefined') {
        console.error('entryAssign: "name" parameter must be a string');
    } else {
        console.error('entryAssign: "name" parameter must be defined');
    }
};

ANALYZIFY.entryRemove = function (name, entryNames) {
    if (Array.isArray(entryNames)) {
        for (i = 0; i < entryNames.length; i++) {
            delete ANALYZIFY.customEntries[name][entryNames[i]];
        }
    } else if (typeof entryNames === 'string') {
        delete ANALYZIFY.customEntries[name][entryNames];
    } else {
        console.error('entryRemove: entryNames must be array or string');
    }
};

/**
 * DATALAYER PUSH
 * 
 * Envia dados para a camada de dados do Google Tag Manager como evento nomeado analyzifyEvent.
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
ANALYZIFY.dlp = ANALYZIFY.dlPush = function (cat, act, lab, val, nInt, tran, exc, obj) {

    if (typeof cat !== 'object') {
        cat = checkType(cat);
        act = checkType(act);
        lab = checkType(lab);
        val = checkType(val);
        nInt = nInt ? (nInt === true || nInt === 'true' || nInt === 1 ? true : false) : false;
        tran = tran === 'beacon' ? 'beacon' : undefined;
        exc = exc ? exc : undefined;

        var event = {
            eventCategory: cat,
            eventAction: act,
            eventLabel: lab,
            eventValue: val,
            nonInteraction: nInt,
            transport: tran,
            exceptions: exc,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            analyzifyEvent: ANALYZIFY.config.analyzifyDefaultEventname,
            event: 'analyzifyEvent'
        };

        var push = {
            eventCategory: cat,
            eventAction: act,
            eventLabel: lab,
            eventValue: val,
            nonInteraction: nInt,
            transport: tran,
            exceptions: exc,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            analyzifyEvent: ANALYZIFY.config.analyzifyDefaultEventname,
            event: 'analyzifyEvent'
        };

        if (typeof obj === 'object' && obj !== null) {
            Object.assign(push, obj);
        }

        if (cat && act && ANALYZIFY.debug !== true && ANALYZIFY.debug.dlPush !== true) {
            if (typeof obj === 'object' && obj !== null) {
                Object.assign(event, obj);
                Object.assign(push, obj);
            }
            Object.assign(push, {pushObject: event});
            window.dataLayer.push(push);
        } else if (ANALYZIFY.debug === true || ANALYZIFY.debug.dlPush === true) {
            console.log(push);
            console.log(JSON.stringify(push));
        } else if (!cat) {
            console.error('dlPush: Event Category param must be defined');
        } else if (!act) {
            console.error('dlPush: Event Action param must be defined');
        } else {
            console.error('dlPush: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
        }

        function checkType(param) {
            return (param ? (isNaN(Number(param)) ? String(param) : (typeof param === 'boolean' ? param : Number(param))) : undefined);
        }

        jQuery(function () {
            ANALYZIFY.jqLink.func({
                'sessionAlive': []
            });
        });
    } else if (typeof cat === 'object' && cat !== null) {
        if (!cat.eventCategory || !cat.eventAction) {
            cat.exception = cat.exception || '';
            cat.exception += ' ga';
        } else {
            cat.nonInteraction === true ? '' : cat.nonInteraction = false;
            cat.transport === 'beacon' ? '' : cat.transport = undefined;
        }
        cat.event = cat.event || 'analyzifyEvent';
        cat.analyzifyEvent = cat.analyzifyEvent || ANALYZIFY.config.analyzifyDefaultEventname;
        cat.referrer = cat.referrer || document.referrer;
        cat.userAgent = cat.userAgent || navigator.userAgent;
        cat.language = cat.language || navigator.language;
        if (ANALYZIFY.debug !== true && ANALYZIFY.debug.dlPush !== true) {
            window.dataLayer.push(ANALYZIFY.objSelfPush(cat));
        } else {
            cat = ANALYZIFY.objSelfPush(cat);
            console.log(cat);
            console.log(JSON.stringify(cat));
        }
    } else {
        console.error('dlPush: first param must be defined as a string or object');
    }
};
//INÍCIO FUNÇÕES JQUERY
jQuery(function () {

    //-----JQUERY PRESETS-----
    ANALYZIFY.height = jQuery(window).outerHeight();
    ANALYZIFY.width = jQuery(window).outerWidth();
    ANALYZIFY.hashVal = window.location.hash.replace(/^#/, "");
    ANALYZIFY.menuInitialHeight = jQuery('[data-menu*="fixed-"]').length ? jQuery('[data-menu*="fixed-"]').outerHeight() : 0;
    ANALYZIFY.logoDeltaHeight = jQuery('[data-menu*="fixed-"]').length ? 27 : 0; //variação da altura da logo
    ANALYZIFY.menuHeight = ANALYZIFY.menuInitialHeight - ANALYZIFY.logoDeltaHeight;
    ANALYZIFY.jqMobile = ANALYZIFY.jqMobile || {};
    ANALYZIFY.jqMobile.present = typeof jQuery.mobile !== 'undefined' ? true : false;

    /**
     * 
     * @param {array} funcs - Array de funções a serem executadas por eval()
     * @param {array} limit - Array de limites de execução de cada função em funcs
     * @param {integer} counter - Contador de execuções do evento
     * @param {string} log - Texto a ser exibido no console no debug e antes do erro
     * @param {boolean} debug - Se true, função executada é exibida no console
     * @returns {undefined}
     */
    ANALYZIFY.attrExec = function (funcs, limit, counter, log, debug) {
        for (i = 0; i < funcs.length; i++) {
            var checkLimit = isNaN(parseInt(limit[i]));
            if (checkLimit === false ? limit[i] > counter : true) {
                try {
                    eval('ANALYZIFY.' + funcs[i]);
                } catch (er) {
                    var error = er;
                    try {
                        eval('window.' + funcs[i]);
                    } catch (er) {
                        console.error('(ANALYZIFY scope) ' + log + error.message);
                        console.error('(window scope) ' + log + er.message);
                    }
                }
                if (ANALYZIFY.debug === true || debug === true) {
                    console.log(log + funcs[i]);
                }
            }
        }
    };

    /**
     * Injeta atributos e seus respectivos valores em elementos por meio de seletores jQuery.
     * 
     * Se select não for definido, usará os dados do objeto global analyzifyInject:
     *  analyzifyInject = {
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
     * OBS: Para evitar sobrescrever o objeto de injeção, utilize o método <b>Object.assign(analyzifyInject, {...})</b>, que é uma alternativa ao array.push() para mesclar objetos.
     * Ex:
     *  Object.assign(analyzifyInject, {
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
    ANALYZIFY.analyzifyInjection = function (select, attr, value) {
        if (typeof select === 'undefined') {
            if (typeof ANALYZIFY.inject === 'object' && ANALYZIFY.inject !== null) {
                for (var selector in ANALYZIFY.inject) {
                    jQuery(selector).each(function (index) {

                        var counter = index + 1;

                        for (var attribute in ANALYZIFY.inject[selector]) {

                            var attrValue = String(ANALYZIFY.inject[selector][attribute]);

                            if (attrValue !== "") {
                                var match = attrValue.match(/\{\%([^}]+)\%\}/g);
                                if (match !== null) {
                                    var attrNames = [];
                                    $.each(match, function (i, el) {
                                        if ($.inArray(el, attrNames) === -1)
                                            attrNames.push(el);
                                    });
                                    for (var i in attrNames) {
                                        var attrName = attrNames[i].replace('{%', '').replace('%}', '');
                                        var getAttr = jQuery(this).attr(attrName);
                                        if (typeof getAttr !== 'undefined') {
                                            var regExp = new RegExp(attrNames[i], 'g');
                                            attrValue = attrValue.replace(regExp, getAttr);
                                        } else {
                                            getAttr = jQuery(this).find('[' + attrName + ']').attr(attrName);
                                            if (typeof getAttr !== 'undefined') {
                                                var regExp = new RegExp(attrNames[i], 'g');
                                                attrValue = attrValue.replace(regExp, getAttr);
                                            } else {
                                                console.error('Attribute ' + attrName + ' undefined in ' + selector + '(index: ' + index + ') and his children');
                                            }
                                        }
                                    }
                                }

                                //get index
                                if (attrValue.indexOf('[[count]]') !== -1) {
                                    attrValue = attrValue.replace(/\[{2}(count)\]{2}/g, counter);
                                }
                            }

                            jQuery(this).attr(attribute, attrValue);
                        }
                    });
                }
            }
        } else if (typeof attr !== 'undefined' && typeof value !== 'undefined') {

        } else {
            console.error('Attribute and/or value must be defined');
        }
    };

    ANALYZIFY.analyzifyInjection();

    /**
     * Função de entrada para criação de plugins do Analyzify
     * 
     * @param {string} name - Nome do objeto filho de ANALYZIFY.customEntries
     */
    ANALYZIFY.setCustomEntry = function (name, data) {
        if (typeof name === 'string') {
            if (typeof ANALYZIFY.customEntries[name] === 'object' && ANALYZIFY.customEntries[name] !== null) {
                for (property in ANALYZIFY.customEntries[name]) {
                    ANALYZIFY.customEntries[name][property]['count'] = ANALYZIFY.customEntries[name][property]['count'] || 0;
                    if (!ANALYZIFY.customEntries[name][property]['limit'] || ANALYZIFY.customEntries[name][property]['count'] < ANALYZIFY.customEntries[name][property]['limit']) {
                        if (ANALYZIFY.customEntries[name][property]['action']) {
                            if (typeof ANALYZIFY.customEntries[name][property]['action'] === 'function') {
                                ANALYZIFY.customEntries[name][property]['action'](data);
                            } else {
                                console.error('setCustomEntry: ANALYZIFY.customEntries.' + name + '.' + property + '.action parameter must be a function');
                            }
                        } else {
                            console.error('setCustomEntry: ANALYZIFY.customEntries.' + name + '.' + property + '.action parameter must be defined')
                        }
                    }
                    if (ANALYZIFY.customEntries[name][property]['limit']) {
                        ANALYZIFY.customEntries[name][property]['count']++;
                    }
                }
            } else if (ANALYZIFY.customEntries[name] || ANALYZIFY.customEntries[name] === false) {
                console.error('setCustomEntry: ANALYZIFY.customEntries.' + name + ' parameter must be an object');
            } else {
                console.error('setCustomEntry: ANALYZIFY.customEntries.' + name + ' parameter must be defined');
            }

        } else {
            console.error('setCustomEntry: "name" parameter must be defined as a string');
        }
    };

    /**
     * (NÃO USE) Função em desenvolvimento para substituir eval(), não está pronta ainda.
     * 
     * @param {action} func
     */
    ANALYZIFY.functionify = function (func) {
        if (typeof name === 'string') {

            var match = func.match(/[a-zA-Z_$][0-9a-zA-Z_$]*\((['].*['])*[^()]*(['].*['])*\)/g);
            console.log(match);
            if (match !== null && match[0] === func) {
                func = func.substring(0, func.length - 1).split(/([^"']+)\(/).filter(Boolean);
                console.log(func[1]);
                func[1] = func[1].split(',');
                console.log(func[1]);
                if (typeof func[2] === 'undefined') {
                    ANALYZIFY[func[0]].apply(this, func[1]);
                } else {
                    console.log('something wrong');
                }
            } else {
                console.error('functionify: "func" parameter must be function like. You seted: ' + func + ' PS: You cannot use parenthesis and/or commas in parameter.');
            }
        } else {
            console.error('functionify: "func" parameter must be seted and an string');
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
     *  <b>window.jqLink.func({
     functionName1: [param1, param2, ...],
     functionName2: [param1, param2, ...]
     });</b>
     */
    ANALYZIFY.jqLink = ANALYZIFY.create(function (jqObj) {
        if (jqObj) {
            for (property in jqObj) {
                try {
                    ANALYZIFY[property].apply(this, jqObj[property]);
                } catch (er) {
                    console.error('jqLink ' + property + ': ' + er.message);
                }
            }
        }
    });

    ANALYZIFY.load = false;

    jQuery(window).on("load", function () {
        ANALYZIFY.load = true;
        var hashElement = jQuery('[id="' + ANALYZIFY.hashVal + '"]');
        window.dataLayer.push({event: 'pageLoad'});
        if (ANALYZIFY.hashVal && hashElement.length) {
            var goto = hashElement.offset().top;
            jQuery('html, body').animate({scrollTop: goto - ANALYZIFY.menuInitialHeight + ANALYZIFY.logoDeltaHeight}, 1000);
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        ANALYZIFY.normalize();
        ANALYZIFY.handleVisibilityChange();

        ANALYZIFY.setCustomEntry('pageLoad');
    });

    //*****END PRESETS*****

    //-----WINDOW ACTIONS-----

    /**
     * SCROLL TRACKING
     * 
     * Responde ao rolamento de página e executando funções do framework após verificar se estão disponíveis.
     */

    ANALYZIFY.lastScrollTop = jQuery(window).scrollTop();
    ANALYZIFY.scrollTop = jQuery(window).scrollTop();
    jQuery(window).on('scroll', function () {
        ANALYZIFY.scrollTop = jQuery(this).scrollTop(); //DISTANCIA DO TOPO
        ANALYZIFY.scrollDirection(); //DIRECAO DA ROLAGEM
        ANALYZIFY.userNonIdle();

        if (ANALYZIFY.menuFixedTopExist)
            ANALYZIFY.reduzMenu(); //REDUZ MENU

        if (ANALYZIFY.scrollTop > 0) {
            $(A).trigger('scroll:top', [ANALYZIFY.scrollTop]);
        } else {
            $(A).trigger('scroll:zero');
        }

        if (ANALYZIFY.scrollSpyExist && ANALYZIFY.load)
            ANALYZIFY.scrollSpy(); //SCROLLSPY

        if (ANALYZIFY.lazyLoadExist && ANALYZIFY.load)
            ANALYZIFY.lazyLoad(); //LAZY LOAD

        if (ANALYZIFY.viewEventExist && ANALYZIFY.load)
            ANALYZIFY.viewEvent(); //VIEWEVENT

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
        ANALYZIFY.setCustomEntry('scroll');
        ANALYZIFY.firstActive();

        ANALYZIFY.lastScrollTop = ANALYZIFY.scrollTop; //ULTIMA DISTANCIA DO TOPO
    });

    /**
     * DIRECAO DA ROLAGEM
     * 
     * Função de suporte para desenvolvimento. Define scrollDir como 1 se rolando para baixo ou como -1 se rolando para cima. 
     */
    ANALYZIFY.scrollDirDir;
    ANALYZIFY.scrollDirection = function () {
        if (ANALYZIFY.scrollTop > ANALYZIFY.lastScrollTop) {
            ANALYZIFY.scrollDirDir = 1;
        } else if (ANALYZIFY.scrollTop < ANALYZIFY.lastScrollTop) {
            ANALYZIFY.scrollDirDir = -1;
        }
    };

    /**
     * RESIZE TRACKING
     * 
     * Responde ao redimensionamento do navegador e executa funções do framework após verificar se estão disponíveis.
     */
    jQuery(window).on('resize', function () {
        ANALYZIFY.height = jQuery(window).outerHeight();
        ANALYZIFY.width = jQuery(window).outerWidth();

        ANALYZIFY.setCustomEntry('resize');
        ANALYZIFY.normalize();
    });

    ANALYZIFY.normalize = function () {
        if (ANALYZIFY.load === true) {
            if (ANALYZIFY.scrollSpyExist)
                ANALYZIFY.scrollSpyCalc(); //SCROLLSPY

            if (ANALYZIFY.lazyLoadExist)
                ANALYZIFY.lazyLoadCalc(); //LAZY LOAD

            if (ANALYZIFY.viewEventExist)
                ANALYZIFY.viewEventCalc(); //VIEWEVENT

            if (ANALYZIFY.jSameHeightExist)
                ANALYZIFY.sameHeight(); //IGUALA ALTURA DE BOX MENORES

            ANALYZIFY.setCustomEntry('normalize');
        }
    };

    //*****END WINDOW ACTIONS*****

    //-----EVENT TRACKING-----

    /**
     * <b>ACTIVE TIMER</b>
     * 
     * Rastreamento de tempo ativo do usuário.
     */
    ANALYZIFY.activeTimer = {};
    ANALYZIFY.activeTimer.firstActive = false;
    ANALYZIFY.activeTimer.idle = true;
    ANALYZIFY.activeTimer.idleTimer;
    ANALYZIFY.activeTimer.counter = 0;
    ANALYZIFY.activeTimer.aliveTimer;
    ANALYZIFY.activeTimer.activeMaster = false;
    ANALYZIFY.activeTimer.aliveCounter = 0;
    ANALYZIFY.activeTimer.activeTimer = setInterval(function () {
        if ((ANALYZIFY.activeTimer.idle === false || ANALYZIFY.activeTimer.activeMaster === true) && (ANALYZIFY.activeTimer.firstActive === true)) {
            ANALYZIFY.activeTimer.counter += 1;
            if (ANALYZIFY.debug === true || ANALYZIFY.debug.activeTimer === true) {
                console.log(ANALYZIFY.activeTimer.counter);
            }
        }
    }, 1000);
    ANALYZIFY.activeTimer.path = ANALYZIFY.urlPath();
    ANALYZIFY.activeTimer.firstPath = ANALYZIFY.urlPath(1);

    /**
     * Responde ao foco na página mediante clique.
     * 
     * <b>Atenção</b>: Se comporta de forma diferente ao PAGE VISIBILITY API. Mesmo se a aba estiver visível, essa função só ativa se a janela entrar em foco mediante clique.
     */
    jQuery(window).focus(function () {
        ANALYZIFY.userNonIdle();
        ANALYZIFY.firstActive();
    });

    /**
     * Responde ao perder foco mediante clique externo.
     */
    jQuery(window).blur(function () {
        ANALYZIFY.activeTimer.idle = true;
    });

    /**
     * Responde ao apertar alguma tecla
     */
    jQuery(window).on('keydown', function () {
        if (ANALYZIFY.load === true) {
            ANALYZIFY.userNonIdle();
            ANALYZIFY.firstActive();
        }
    });

    /**
     * Responde ao movimento do mouse
     */
    jQuery(window).on('mousemove', function () {
        ANALYZIFY.userNonIdle();
        ANALYZIFY.firstActive();
    });

    /**
     * Responde ao clique, especiicamente quando a tecla é apertada, ou segurada.
     */
    jQuery(window).on('mousedown', function () {
        ANALYZIFY.userNonIdle();
        ANALYZIFY.firstActive();
    });

    /**
     * 
     * @param {integer/object} interval - Tempo em segundos do intervalo de tempo a ser retornado ou Objeto com limites de tempo em segundos e intervalos a serem retornados.
     * @param {string} scope - Escopo de tempo registrado. Deve ser "sec" para segundos, "min" para minutos, "h" para horas ou "%" para porcentagem .
     * @param {number} counter - Valor do contador.
     * @returns {String} String que representa os intervalos de tempo. Ex: 8 - 9 min
     */
    ANALYZIFY.timerInterval = function (interval, scope, counter) {
        if (typeof interval === 'number') {
            return getInterval(interval);
        } else if (typeof interval === 'object' && interval !== null) {
            var limits = Object.keys(interval);
            var limitsLength = limits.length;
            for (var i = 0; i <= limitsLength; i++) {
                if (!(i === limitsLength)) {
                    if (counter < parseInt(limits[i])) {
                        return getInterval(interval[limits[i]]);
                    }
                } else {
                    return getInterval(interval[limits[i - 1]], true);
                }
            }
        } else if (typeof interval === 'undefined' || interval === null) {
            console.error('timerInterval: "interval" parameter must be defined');
        } else {
            console.error('timerInterval: "interval" parameter must be a number or object');
        }

        function getInterval(int, last) {
            var stringScope = String(scope);
            if (stringScope === 'min') {
                var timerScope = 60;
            } else if (stringScope === 'h') {
                var timerScope = 3600;
            } else if (stringScope === '%' || stringScope === 'sec') {
                var timerScope = 1;
            } else {
                console.error('timerInterval: "scope" parameter must be defined as string \'sec\', \'min\', \'h\' or \'%\'');
            }
            if (typeof timerScope === 'number') {
                var divider = timerScope / int;
                var unities = parseInt(counter / int);
                var minutes = unities / divider;
                var margin = minutes + (1 / divider);
                if (last !== true) {
                    return minutes + ' - ' + margin + ' ' + stringScope;
                } else {
                    return minutes + '+ ' + stringScope;
                }
            }
        }
    };

    /**
     * Armazena função que será executada antes da sessão terminar.
     */
    jQuery(window).on('beforeunload', function () {
        //ACTIVE TIME
        ANALYZIFY.dlPush('Active Time', (ANALYZIFY.ajaxPage === false ? ANALYZIFY.activeTimer.path.toLowerCase() : ANALYZIFY.ajaxPage.toLowerCase().replace(/(https:|http:|)\/\//, '').replace(ANALYZIFY.BASE, '')), ANALYZIFY.activeTimer.firstPath.toLowerCase(), ANALYZIFY.activeTimer.counter, true, 'beacon', null, {
            activeTime: ANALYZIFY.activeTimer.counter,
            interval: ANALYZIFY.timerInterval(ANALYZIFY.activeTimerIntervalObj, 'min', ANALYZIFY.activeTimer.counter)
        });

        //CUSTOM TIMES
        for (var name in ANALYZIFY.customTimers) {
            if (ANALYZIFY.customTimers[name]['activeListener'] === true) {
                ANALYZIFY.dlPush('Custom Time', ANALYZIFY.customTimers[name]['name'], ANALYZIFY.customTimers[name]['firstPath'], ANALYZIFY.customTimers[name]['counter'], true, 'beacon', null, {
                    activeTime: ANALYZIFY.customTimers[name]['counter'],
                    interval: ANALYZIFY.timerInterval(ANALYZIFY.customTimers[name]['intervalObj'], ANALYZIFY.customTimers[name]['intervalObjScope'], ANALYZIFY.customTimers[name]['counter'])
                });
            }
        }

        ANALYZIFY.setCustomEntry('beforeUnload');
    });

    jQuery(document).mouseleave(function () {
        ANALYZIFY.setCustomEntry('exitIntent');
    });

    if (ANALYZIFY.jqMobile.present) {
        $(window).on("navigate", function (event, data) {
            var modalParam = ANALYZIFY.urlParam('modal');
            if ((modalParam) && (modalParam !== true)) {
                ANALYZIFY.openModal(modalParam);
                ANALYZIFY.jqMobile.lastModal = modalParam;
            } else if (ANALYZIFY.jqMobile.lastModal) {
                ANALYZIFY.closeModal(ANALYZIFY.jqMobile.lastModal, false);
                delete ANALYZIFY.jqMobile.lastModal;
            }
            ANALYZIFY.setCustomEntry('navigate', {event: event, data: data});
        });
    }

    /**
     * Informa ao framework que o usuário começou a interagir com a página por meio de uma variável e marcando o evento firstActive na camada de dados do GTM, previnindo que Analytics comece a rodar se usuário apenas abriu o navegador.
     */
    ANALYZIFY.firstActive = function () {
        if (ANALYZIFY.activeTimer.firstActive === false) {
            window.dataLayer.push({event: 'firstActive'});
            ANALYZIFY.activeTimer.firstActive = true;
            if (ANALYZIFY.viewEventExist && ANALYZIFY.load) {
                ANALYZIFY.viewEvent();
            }
            if (ANALYZIFY.debug === true || ANALYZIFY.debug.activity === true) {
                console.log('First Active');
            }
        }
    };

    /**
     * Marca usuário como não ocioso e continua a contagem do tempo ativo.
     * 
     * Para a contagem se usuário ficar ocioso por 5 segundos.
     */
    ANALYZIFY.userNonIdle = function () {
        ANALYZIFY.activeTimer.idle = false;
        clearTimeout(ANALYZIFY.activeTimer.idleTimer);
        ANALYZIFY.activeTimer.idleTimer = setTimeout(function () {
            ANALYZIFY.activeTimer.idle = true;
        }, 5000);
    };

    /**
     * Define variável activeMaster como true, o que faz o contador de interação não parar após o tempo ocioso. Útil para ativar se o usuário estiver vendo um vídeo, por exemplo.
     * 
     * @param {boolean} state
     */
    ANALYZIFY.activeMaster = function (state) {
        (state === true || state === "true" || state === 1) ? ANALYZIFY.activeTimer.activeMaster = true : ANALYZIFY.activeTimer.activeMaster = false;
    };

    ANALYZIFY.sessionAlive = function () {
        var getActiveTimer = ANALYZIFY.activeTimer.counter;
        clearTimeout(ANALYZIFY.activeTimer.aliveTimer);
        ANALYZIFY.activeTimer.aliveTimer = setTimeout(function () {
            if (getActiveTimer <= ANALYZIFY.activeTimer.counter - 10) {
                ANALYZIFY.activeTimer.aliveCounter = 0;
                ANALYZIFY.dlPush('Session Alive', (ANALYZIFY.ajaxPage === false ? ANALYZIFY.activeTimer.path : ANALYZIFY.ajaxPage.toLowerCase().replace(/(https:|http:|)\/\//, '').replace(ANALYZIFY.BASE, '')), ANALYZIFY.activeTimer.firstPath, null, true, null, 'fb');
            } else {
                ANALYZIFY.activeTimer.aliveCounter += 1;
            }
            if (ANALYZIFY.activeTimer.aliveCounter < 1) {
                ANALYZIFY.sessionAlive();
            }
        }, 1680000);
    };

    ANALYZIFY.sessionAlive();

    /**
     * <b>CUSTOM TIMER</b>
     * 
     * Inicia contador ativo personalizado. Previne que o mesmo timer seja iniciado duas vezes.
     * 
     * @param {string} name - Nome único do Timer
     * @param {string} idleTrack - (Opcional) <b>Seletor CSS</b>. Se setado, rastreia o tempo ativo com o elemento específico. Se não setado, o temporizador contará continuamente a menos que a função <b>customUserNonIdle</b> seja executada.
     * @param {object} intervalObj - (Opcional) Objeto para enviar timerInterval ao dataLayer.
     * @param {object} intervalObjScope - (Opcional) Escopo do timerInterval (sec, min, h ou %).
     * @param {function} func - (Opcional) Nome da função executada em invervalos de tempo
     * @param {string} funcInterval - (Opcional) Intervalo de tempo em segundos que a função deve ser executada. Se não for setada, a função e parâmetros serão simplesmente ignorados.
     * @param {string} funcLimit - (Opcional) Limite de vezes que a função deve ser executada. Se não setada, a função será executada continuamente a cada intervalo de tempo.
     */
    ANALYZIFY.customTimer = function (name, idleTrack, intervalObj, intervalObjScope, func, funcInterval, funcLimit) {
        ANALYZIFY.customTimers = ANALYZIFY.customTimers || [];
        ANALYZIFY.customTimers[name] = ANALYZIFY.customTimers[name] || [];
        ANALYZIFY.customTimers[name]['exeNumber'] = ANALYZIFY.customTimers[name]['exeNumber'] || 0;
        ANALYZIFY.customTimers[name]['exeNumber']++;
        //check if timer is not already initiated
        if (typeof name !== "undefined" && typeof ANALYZIFY.customTimers[name]['timerInit'] === "undefined") {
            ANALYZIFY.customTimers[name]['name'] = name;
            ANALYZIFY.customTimers[name]['path'] = ANALYZIFY.urlPath();
            ANALYZIFY.customTimers[name]['firstPath'] = ANALYZIFY.urlPath(1);
            //setup
            ANALYZIFY.customTimers[name]['timerInit'] = true;
            ANALYZIFY.customTimers[name]['idle'] = false;
            ANALYZIFY.customTimers[name]['activeMaster'] = false;
            ANALYZIFY.customTimers[name]['counter'] = 0;
            var intervalCounter = 1;
            funcLimit = isNaN(parseInt(funcLimit)) === false ? parseInt(funcLimit) : false;
            if (idleTrack) {
                if (typeof idleTrack === "string") {
                    ANALYZIFY.customActiveListener(name, idleTrack);
                } else {
                    console.error('customTimer: "idleTrack" parameter must be a string');
                }
            }
            if (typeof intervalObj === "undefined" || intervalObj === null) {
                intervalObj = "sec";
            } else {
                if (typeof intervalObj === "object") {
                    ANALYZIFY.customTimers[name]['intervalObj'] = intervalObj;
                    ANALYZIFY.customTimers[name]['intervalObjScope'] = intervalObjScope || "sec";
                } else if (intervalObj === "sec") {
                    ANALYZIFY.customTimers[name]['intervalObj'] = ANALYZIFY.customTimerIntervalObj.sec;
                    ANALYZIFY.customTimers[name]['intervalObjScope'] = "sec";
                } else if (intervalObj === "min") {
                    ANALYZIFY.customTimers[name]['intervalObj'] = ANALYZIFY.customTimerIntervalObj.min;
                    ANALYZIFY.customTimers[name]['intervalObjScope'] = "min";
                } else {
                    console.error('customTimer: "intervalObj" parameter must be an object or a string, with value "sec" or "min"');
                }
            }

            ANALYZIFY.customTimers[name]['activeTimer'] = setInterval(function () {
                if ((ANALYZIFY.customTimers[name]['idle'] === false || ANALYZIFY.customTimers[name]['activeMaster'] === true) && ANALYZIFY.activeTimer.firstActive === true && ANALYZIFY.tabHidden === false) {
                    ANALYZIFY.customTimers[name]['counter'] += 1;
                    if (ANALYZIFY.debug === true || ANALYZIFY.debug.customTimers === true) {
                        console.log(name + ' - ' + ANALYZIFY.customTimers[name]['counter']);
                    }
                }
                if (typeof funcInterval !== "undefined" && isNaN(parseInt(funcInterval)) === false && ANALYZIFY.customTimers[name]['counter'] >= funcInterval * intervalCounter && funcLimit !== 0) {
                    func();
                    intervalCounter++;
                    if (funcLimit !== false) {
                        funcLimit--;
                    }
                }
            }, 1000);
        } else if (typeof name === "undefined") {
            console.error('customTimer: "name" parameter must be defined');
        } else if (typeof ANALYZIFY.customTimers[name]['timerInit'] !== "undefined") {
            if (ANALYZIFY.customTimers[name]['exeNumber'] >= 5) {
                console.warn('customTimer: Custom Timer ' + name + ' already initiated. Function fired ' + ANALYZIFY.customTimers[name]['exeNumber'] + ' times. Limit execution number.');
            }
        } else {
            console.error('customTimer: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
        }
    };

    /**
     * Elimina contador um contador ativo.
     * 
     * @param {string} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {boolean} definitive - (Opcional) Se setado como true, não permite que o contador de mesmo <b>name</b> seja iniciado novamente na mesma sessão. Se não setado, o contador pode ser reiniciado do zero executando <b>customTimer</b>.
     */
    ANALYZIFY.unsetCustomTimer = function (name, definitive) {
        if (typeof name !== "undefined" && typeof ANALYZIFY.customTimers !== "undefined" && typeof ANALYZIFY.customTimers[name] !== "undefined" && typeof ANALYZIFY.customTimers[name]['timerInit'] !== "undefined") {
            clearInterval(ANALYZIFY.customTimers[name]['activeTimer']);
            definitive === true || definitive === 'true' || definitive === 1 ? '' : delete ANALYZIFY.customTimers[name]['timerInit'];
        } else if (typeof name === "undefined") {
            console.error('unsetCustomTimer: "name" parameter must be defined');
        } else if (typeof ANALYZIFY.customTimers === "undefined" || typeof ANALYZIFY.customTimers[name] === "undefined" || typeof ANALYZIFY.customTimers[name]['timerInit'] === "undefined") {
            console.warn('unsetCustomTimer: You cannot unset Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('unsetCustomTimer: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
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
    ANALYZIFY.customActiveListener = function (name, selector) {
        if (typeof name !== "undefined" && typeof selector !== "undefined" && jQuery(selector).length !== 0 && typeof ANALYZIFY.customTimers !== "undefined" && typeof ANALYZIFY.customTimers[name] !== "undefined" && typeof ANALYZIFY.customTimers[name]['timerInit'] !== "undefined" && typeof ANALYZIFY.customTimers[name]['activeListener'] === "undefined") {

            ANALYZIFY.customTimers[name]['activeListener'] = true;

            var viewPercent = jQuery(selector).attr('data-view-percent') ? parseInt(jQuery(selector).attr('data-view-percent')) : 50;
            var position = jQuery(selector).offset().top;
            var height = jQuery(selector).outerHeight();

            //Percent Test
            if (isNaN(viewPercent) === false) {
                if (viewPercent >= 0) {
                    viewPercent = (viewPercent <= 100 && viewPercent >= 0 ? viewPercent : 50);
                    var viewPositionTop = position - ANALYZIFY.height + height * viewPercent / 100;
                    var viewPositionBottom = position - ANALYZIFY.menuHeight + height * (100 - viewPercent) / 100;
                } else {
                    viewPercent = -(viewPercent >= -100 && viewPercent <= 0 ? viewPercent : -50);
                    var viewPositionTop = position - ANALYZIFY.height * (100 - viewPercent) / 100;
                    var viewPositionBottom = position + height - ANALYZIFY.height * viewPercent / 100;
                }
            }

            jQuery(selector).focus(function () {
                ANALYZIFY.customUserNonIdle(name, true);
            });

            jQuery(selector).blur(function () {
                ANALYZIFY.customUserNonIdle(name, false);
            });

            jQuery(selector).on('keydown', function () {
                ANALYZIFY.customUserNonIdle(name, true);
            });

            jQuery(selector).on('mousemove', function () {
                if ((ANALYZIFY.scrollTop >= viewPositionTop) && (ANALYZIFY.scrollTop <= viewPositionBottom)) {
                    ANALYZIFY.customUserNonIdle(name, true);
                }
            });

            jQuery(selector).on('mousedown', function () {
                ANALYZIFY.customUserNonIdle(name, true);
            });

            jQuery(selector).scroll(function () {
                ANALYZIFY.customUserNonIdle(name, true);
            });

            jQuery(window).scroll(function () {
                if ((ANALYZIFY.scrollTop >= viewPositionTop) && (ANALYZIFY.scrollTop <= viewPositionBottom)) {
                    ANALYZIFY.customUserNonIdle(name, true);
                }
            });

            jQuery(window).resize(function () {
                var viewPercent = jQuery(selector).attr('data-view-percent') ? parseInt(jQuery(selector).attr('data-view-percent')) : 50;
                var position = jQuery(selector).offset().top;
                var height = jQuery(selector).outerHeight();

                //Percent Test
                if (isNaN(viewPercent) === false) {
                    if (viewPercent >= 0) {
                        viewPercent = (viewPercent <= 100 && viewPercent >= 0 ? viewPercent : 50);
                        var viewPositionTop = position - ANALYZIFY.height + height * viewPercent / 100;
                        var viewPositionBottom = position - ANALYZIFY.menuHeight + height * (100 - viewPercent) / 100;
                    } else {
                        viewPercent = -(viewPercent >= -100 && viewPercent <= 0 ? viewPercent : -50);
                        var viewPositionTop = position - ANALYZIFY.height * (100 - viewPercent) / 100;
                        var viewPositionBottom = position + height - ANALYZIFY.height * viewPercent / 100;
                    }
                }
            });
        } else if (typeof name === "undefined") {
            console.warn('customActiveListener: "name" parameter must be defined');
        } else if (typeof selector === "undefined") {
            console.warn('customActiveListener: "selector" parameter must be defined');
        } else if (jQuery(selector).length === 0) {
            console.warn('customActiveListener: Selector ' + selector + ' dont exist in this page');
        } else if (typeof ANALYZIFY.customTimers === "undefined" || typeof ANALYZIFY.customTimers[name] === "undefined" || typeof ANALYZIFY.customTimers[name]['timerInit'] === "undefined") {
            console.warn('customActiveListener: You cannot track Custom Timer ' + name + ', it is not initiated yet');
        } else if (typeof ANALYZIFY.customTimers[name]['activeListener'] !== "undefined") {
            if (ANALYZIFY.customTimers[name]['activeListener'] === true) {
                console.warn('customActiveListener: Custom Timer ' + name + ' is already being tracked');
            } else {
                console.warn('customActiveListener: Global variable window["customTimers"]["' + name + '"]["activeListener"] only can be setted to true, check if you are accidentally changed this value outside this function');
            }
        } else {
            console.error('customActiveListener: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
        }
    };

    /**
     * Continua o contador ativo por 5 segundos ou para imediatamente um <b>customTimer</b> de mesmo <b>name</b>. Semelhante ao <b>userNonIdle</b>.
     * 
     * @param {string} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {boolean} state - Se setado como true, contador ativo deixa de ficar ocioso e continua a contagem. Se setado como false, contador fica ocioso e para de contar imediatamente.
     */
    ANALYZIFY.customUserNonIdle = function (name, state) {
        if (typeof name !== "undefined" && typeof ANALYZIFY.customTimers !== "undefined" && typeof ANALYZIFY.customTimers[name] !== "undefined" && typeof ANALYZIFY.customTimers[name]['timerInit'] !== "undefined") {
            if (state === true || state === "true" || state === 1) {
                ANALYZIFY.customTimers[name]['idle'] = false;
                clearTimeout(ANALYZIFY.customTimers[name]['idleTimer']);
                ANALYZIFY.customTimers[name]['idleTimer'] = setTimeout(function () {
                    ANALYZIFY.customTimers[name]['idle'] = true;
                }, 5000);
            } else {
                ANALYZIFY.customTimers[name]['idle'] = true;
            }
        } else if (typeof name === "undefined") {
            console.warn('customUserNonIdle: "name" parameter must be defined');
        } else if (typeof ANALYZIFY.customTimers === "undefined" || typeof ANALYZIFY.customTimers[name] === "undefined" || typeof ANALYZIFY.customTimers[name]['timerInit'] === "undefined") {
            console.warn('customUserNonIdle: You cannot change idle state of Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('customUserNonIdle: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
        }
    };

    /**
     * Ativa ou desativa customTimer permanentemente, ignorando estado ocioso o tempo ocioso definido por <b>customUserNonIdle</b>. Útil para ativar se o usuário estiver vendo um vídeo, por exemplo. Semelhante a <b>activeMaster</b>.
     * 
     * @param {action} name - Deve ser o mesmo usado para iniciar o contador na função <b>customTimer</b>.
     * @param {action} state - Se setado como true, <b>customTimer</b> fica ativo definitivamente. Se setado como false, <b>customTimer</b> volta a lervar <b>customUserNonIdle</b> em consideração.
     */
    ANALYZIFY.customActiveMaster = function (name, state) {
        if (typeof name !== "undefined" && typeof ANALYZIFY.customTimers !== "undefined" && typeof ANALYZIFY.customTimers[name] !== "undefined" && typeof ANALYZIFY.customTimers[name]['timerInit'] !== "undefined") {
            (state === true || state === "true" || state === 1) ? ANALYZIFY.customTimers[name]['activeMaster'] = true : ANALYZIFY.customTimers[name]['activeMaster'] = false;
        } else if (typeof name === "undefined") {
            console.warn('customActiveMaster: "name" parameter must be defined');
        } else if (typeof ANALYZIFY.customTimers === "undefined" || typeof ANALYZIFY.customTimers[name] === "undefined" || typeof ANALYZIFY.customTimers[name]['timerInit'] === "undefined") {
            console.warn('customActiveMaster: You cannot change active master state of Custom Timer ' + name + ', it is not initiated yet.');
        } else {
            console.error('customActiveMaster: Error not identified. If you are seeing this in your console, please, report in the repository issues tab: https://github.com/dannyfranca/analyzify-framework/issues.what changes you made');
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
    if (jQuery('[data-click]').length) {
        var arrayClick = {};
        jQuery('[data-click]').click(function () {
            var e = jQuery(this).attr('data-click');
            arrayClick[e] = arrayClick[e] || {};
            arrayClick[e].counter = arrayClick[e].counter || 0;
            var clickFunc = e.split('||');
            var clickLimit = jQuery(this).attr('data-click-limit') ? jQuery(this).attr('data-click-limit').split(',') : 'notset';
            ANALYZIFY.attrExec(clickFunc, clickLimit, arrayClick[e].counter, 'data-click: ', ANALYZIFY.debug.click);
            arrayClick[e].counter++;
        });
    }

    //VIEW EVENT
    if (jQuery('[data-view]').length) {
        ANALYZIFY.viewEventExist = true;
        ANALYZIFY.arrayView = {};
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
        ANALYZIFY.viewEvent = function (view, ignorealt) {
            if (ANALYZIFY.load && ANALYZIFY.activeTimer.firstActive) {
                var selector = view ? '[data-view="' + view + '"]' : '[data-view]';

                jQuery(selector).each(function () {
                    var e = jQuery(this).attr('data-view');
                    if (typeof ANALYZIFY.arrayView[e] !== "undefined") {
                        var timerCheck = ANALYZIFY.activeTimer.counter >= ANALYZIFY.arrayView[e]['viewTime'];

                        if ((ANALYZIFY.scrollTop >= ANALYZIFY.arrayView[e]['viewPositionTop']) && (ANALYZIFY.scrollTop < ANALYZIFY.arrayView[e]['viewPositionBottom'])) {
                            if (ANALYZIFY.arrayView[e]['viewHidden'] !== true && jQuery(this).is(":visible")) {
                                if ((ANALYZIFY.arrayView[e]['alt'] !== true || ignorealt === true) && timerCheck) {
                                    if (ANALYZIFY.arrayView[e]['viewAct']) {
                                        ANALYZIFY.attrExec(ANALYZIFY.arrayView[e]['viewAct'], ANALYZIFY.arrayView[e]['viewLimit'], ANALYZIFY.arrayView[e]['viewCounter'], 'data-view-act: ', ANALYZIFY.debug.view);
                                        ignorealt !== true ? ANALYZIFY.arrayView[e]['viewCounter']++ : '';
                                    } else if (!ANALYZIFY.arrayView[e]['nonViewAct']) {
                                        var viewFunc = e.split('||');
                                        ANALYZIFY.attrExec(viewFunc, ANALYZIFY.arrayView[e]['viewLimit'], ANALYZIFY.arrayView[e]['viewCounter'], 'data-view: ', ANALYZIFY.debug.view);
                                        ignorealt !== true ? ANALYZIFY.arrayView[e]['viewCounter']++ : '';
                                    }
                                }
                                ANALYZIFY.arrayView[e]['alt'] = true;
                            }
                        } else {
                            if ((ANALYZIFY.arrayView[e]['alt'] === true || ignorealt === true) && timerCheck) {
                                if (ANALYZIFY.arrayView[e]['nonViewAct']) {
                                    ANALYZIFY.attrExec(ANALYZIFY.arrayView[e]['nonViewAct'], ANALYZIFY.arrayView[e]['nonViewLimit'], ANALYZIFY.arrayView[e]['nonViewCounter'], 'data-nonview-act: ', ANALYZIFY.debug.view);
                                    ignorealt !== true ? ANALYZIFY.arrayView[e]['nonViewCounter']++ : '';
                                }
                            }
                            ANALYZIFY.arrayView[e]['alt'] = false;
                        }
                    } else {
                        console.warn('viewEvent: You cannot check if element [data-view="' + e + '"] is visible, positions is not calculated yet. You need to execute ANALYZIFY.viewEventCalc first');
                    }
                });
            }
        };

        /**
         * Calcula as posição de cada elemento com data-view.
         * 
         * Executado em scroll e resize.
         * 
         * @param {string} view - Para calcular apenas um elemento. Não é recomendado, pois se um elemento muda seus dimensões, outros também mudam como consequência, especialmente os que estão abaixo.
         */
        ANALYZIFY.viewEventCalc = function (view) {
            if (processingViewCalc === false) {
                var selector = view ? '[data-view="' + view + '"]' : '[data-view]';

                jQuery(selector).each(function () {
                    var e = jQuery(this).attr('data-view');
                    ANALYZIFY.arrayView[e] = ANALYZIFY.arrayView[e] || {};
                    ANALYZIFY.arrayView[e]['position'] = jQuery(this).offset().top;
                    ANALYZIFY.arrayView[e]['height'] = jQuery(this).outerHeight();
                    var viewTime = jQuery(this).attr('data-view-time');
                    var checkTime = isNaN(parseInt(viewTime));
                    ANALYZIFY.arrayView[e]['viewAct'] = jQuery(this).attr('data-view-act') ? jQuery(this).attr('data-view-act').split('||') : false;
                    ANALYZIFY.arrayView[e]['nonViewAct'] = jQuery(this).attr('data-nonview-act') ? jQuery(this).attr('data-nonview-act').split('||') : false;
                    ANALYZIFY.arrayView[e]['viewTime'] = checkTime === false ? parseInt(jQuery(this).attr('data-view-time')) : 0;
                    ANALYZIFY.arrayView[e]['viewPercent'] = jQuery(this).attr('data-view-percent') ? parseInt(jQuery(this).attr('data-view-percent')) : 50;
                    ANALYZIFY.arrayView[e]['viewCounter'] = ANALYZIFY.arrayView[e]['viewCounter'] || 0;
                    ANALYZIFY.arrayView[e]['nonViewCounter'] = ANALYZIFY.arrayView[e]['nonViewCounter'] || 0;
                    ANALYZIFY.arrayView[e]['viewLimit'] = jQuery(this).attr('data-view-limit') ? jQuery(this).attr('data-view-limit').split(',') : 'notset';
                    ANALYZIFY.arrayView[e]['nonViewLimit'] = jQuery(this).attr('data-nonview-limit') ? jQuery(this).attr('data-nonview-limit').split(',') : 'notset';
                    ANALYZIFY.arrayView[e]['viewHidden'] = jQuery(this).attr('data-view-hidden');
                    ANALYZIFY.arrayView[e]['viewHidden'] = ANALYZIFY.arrayView[e]['viewHidden'] === 1 || ANALYZIFY.arrayView[e]['viewHidden'] === true || ANALYZIFY.arrayView[e]['viewHidden'] === 'true' ? true : false;
                    if (typeof viewTime !== 'undefined' && checkTime === true) {
                        console.warn('attribute data-view-time must be like a number. Check the [data-view="' + e + '"] element');
                    }
                    //Percent Test
                    if (isNaN(ANALYZIFY.arrayView[e]['viewPercent']) === false) {
                        if (ANALYZIFY.arrayView[e]['viewPercent'] >= 0) {
                            ANALYZIFY.arrayView[e]['viewPercent'] = (ANALYZIFY.arrayView[e]['viewPercent'] <= 100 && ANALYZIFY.arrayView[e]['viewPercent'] >= 0 ? ANALYZIFY.arrayView[e]['viewPercent'] : 50);
                            ANALYZIFY.arrayView[e]['viewPositionTop'] = ANALYZIFY.arrayView[e]['position'] - ANALYZIFY.height + ANALYZIFY.arrayView[e]['height'] * ANALYZIFY.arrayView[e]['viewPercent'] / 100;
                            ANALYZIFY.arrayView[e]['viewPositionBottom'] = ANALYZIFY.arrayView[e]['position'] - ANALYZIFY.menuHeight + ANALYZIFY.arrayView[e]['height'] * (100 - ANALYZIFY.arrayView[e]['viewPercent']) / 100;
                        } else {
                            ANALYZIFY.arrayView[e]['viewPercent'] = -(ANALYZIFY.arrayView[e]['viewPercent'] >= -100 && ANALYZIFY.arrayView[e]['viewPercent'] <= 0 ? ANALYZIFY.arrayView[e]['viewPercent'] : -50);
                            ANALYZIFY.arrayView[e]['viewPositionTop'] = ANALYZIFY.arrayView[e]['position'] - ANALYZIFY.height * (100 - ANALYZIFY.arrayView[e]['viewPercent']) / 100;
                            ANALYZIFY.arrayView[e]['viewPositionBottom'] = ANALYZIFY.arrayView[e]['position'] + ANALYZIFY.arrayView[e]['height'] - ANALYZIFY.height * ANALYZIFY.arrayView[e]['viewPercent'] / 100;
                        }
                    }
                });
                ANALYZIFY.viewEvent();
                processingViewCalc = false;
            }
        };
    }

    //PAGE VISIBILITY API

    /**
     * Ações executadas quando a aba do navegador não está em foco, executada pela <b>PAGE VISIBILITY API</b>.
     */
    ANALYZIFY.pageVisibilityHidden = function () {
        ANALYZIFY.tabHidden = true;

        if (ANALYZIFY.debug === true || ANALYZIFY.debug.activity === true) {
            console.log('Tab Hidden');
        }

        ANALYZIFY.setCustomEntry('pageHidden');
    };

    /**
     * Ações executadas quando a aba do navegador está em foco, executada pela <b>PAGE VISIBILITY API</b>.
     */
    ANALYZIFY.pageVisibility = function () {
        ANALYZIFY.tabHidden = false;

        if (ANALYZIFY.debug === true || ANALYZIFY.debug.activity === true) {
            console.log('Tab Visible');
        }

        if (ANALYZIFY.viewEventExist && ANALYZIFY.load)
            ANALYZIFY.viewEvent(); //VIEWEVENT
        ANALYZIFY.setCustomEntry('pageShow');
    };

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
    ANALYZIFY.handleVisibilityChange = function () {
        if (document[hidden]) { // If the page is hidden
            ANALYZIFY.pageVisibilityHidden();
        } else { // if the page is shown
            ANALYZIFY.pageVisibility();
        }
    };

    if (!(typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined")) {
        // Handle page visibility change
        document.addEventListener(visibilityChange, ANALYZIFY.handleVisibilityChange, false);
    }

    /**
     * <b>OUTBOUND CLICKS</b>
     * 
     * Verifica se clique em um link tem destino fora do site. Se positivo, envia evento ao GTM informando site e link completo.
     */
    if (typeof ANALYZIFY.BASE !== 'undefined') {
        jQuery('a[href^="http"]').filter(function () {
            return this.href.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);
        }).click(function () {
            var href = jQuery(this).attr('href') ? jQuery(this).attr('href') : '';
            if ((href.indexOf('http://') !== -1 || href.indexOf('https://') !== -1) && href.indexOf(ANALYZIFY.BASE) === -1) {
                var site = href.replace(/(https:|http:|)\/\//, '');
                var n = site.indexOf('/');
                site = site.substring(0, n !== -1 ? n : site.length);
                ANALYZIFY.dlPush('Click', 'Outgoing', site, href);
            }
        });
    }

    //*****EVENT TRACKING*****

    //-----FUNCIONALIDADES-----

    /**
     * <b>HASH ROLL</b>
     * 
     * Faz rolamento até elemento com <b>id</b> igual ao <b>href</b> do elemento clicado com atributo <b>data-goto</b>.
     * Também previne comportamento padrão no processo.
     * @param event - Marcação apenas para prevenir comportamento padrão.
     */
    if (jQuery('[data-goto]').length) {
        jQuery('[data-goto]').click(function (event) {
            event.preventDefault();
            var selector = jQuery(jQuery(this).attr("href"));
            if (selector.length) {
                jQuery('html, body').stop().animate({scrollTop: selector.offset().top - ANALYZIFY.menuInitialHeight + ANALYZIFY.logoDeltaHeight}, 1000);
            } else {
                jQuery('html, body').animate({scrollTop: 0}, 1000);
            }
            return false;
        });
    }

    /**
     * Exibe submenu ao clicar no ítem .submenu
     */
    jQuery('.main_header_nav_item.submenu').click(function () {
        if (!jQuery(this).hasClass('active')) {
            jQuery(this).addClass('active');
        } else {
            jQuery(this).removeClass('active');
        }
        jQuery(this).children('.main_header_nav_sub').slideToggle();
    });

    /**
     * <b>REDUZ MENU</b>
     * 
     * Reduz altura do menu fixo suavemente, desde qeu devidamente marcado com data-menu e valor iniciado com "fixed-"
     */

    if (jQuery('[data-menu="fixed-top"]').length) {
        /**
         * Reduz a altura do menu se posição do rolamento for maior que zero. E alterna entre logos branca e original na presença da lcasse .transparente
         */
        ANALYZIFY.reduzMenu = function () {
            if (ANALYZIFY.scrollTop > 0) {
                jQuery('[data-menu="fixed-top"]').addClass('main_header_fixed');
                ANALYZIFY.addLogo();
            }
            if (ANALYZIFY.scrollTop === 0) {
                jQuery('[data-menu="fixed-top"]').removeClass('main_header_fixed');
                ANALYZIFY.addLogoWhite();
            }
        };
        /**
         * Se junto ao data-menu estiver presente a class .transparente, a logo será trocada para a versão branca.
         */
        ANALYZIFY.addLogoWhite = function () {
            if (jQuery('[data-menu="fixed-top"].transparente .img-logo.switch').length) {
                jQuery('[data-menu="fixed-top"] .img-logo').attr('src', logoWhiteSrc);
                jQuery('[data-menu="fixed-top"] .mobile_action').addClass('white');
            }
        };
        /**
         * Se junto ao data-menu estiver presente a class .transparente, a logo será trocada para a versão original.
         */
        ANALYZIFY.addLogo = function () {
            if (jQuery('[data-menu="fixed-top"].transparente .img-logo.switch').length) {
                jQuery('[data-menu="fixed-top"] .img-logo').attr('src', logoSrc);
                jQuery('[data-menu="fixed-top"] .mobile_action').removeClass('white');
            }
        };

        ANALYZIFY.menuFixedTopExist = true;
        var logoSrc = jQuery('[data-menu="fixed-top"] .img-logo').attr('src');
        var logoWhiteSrc = logoSrc.substr(0, logoSrc.indexOf('.png')) + '-white.png';
        if (jQuery('.j_padding_top').length) {
            jQuery('.j_padding_top').css('padding-top', ANALYZIFY.menuInitialHeight);
        } else {
            jQuery('body').css('padding-top', ANALYZIFY.menuInitialHeight);
        }
        jQuery('[data-menu="fixed-top"]').addClass('fixed_top');
        if (jQuery(window).scrollTop() > 0) {
            jQuery('[data-menu="fixed-top"]').addClass('main_header_fixed');
        } else {
            ANALYZIFY.addLogoWhite();
        }
    }

    /**
     * <b>MOBILE MENU</b>
     * 
     * Em telas menores, abre menu lateral
     */
    ANALYZIFY.mobileMenuToggle = function () {
        if (!jQuery('.mobile_action').data('active')) {
            jQuery('.mobile_action').data('active', true);
            jQuery('.main_header_nav').animate({'left': '0px'}, 100);
        } else {
            jQuery('.mobile_action').data('active', false);
            jQuery('.main_header_nav').animate({'left': '-100%'}, 100);
        }
    };

    jQuery('.mobile_action').click(function () {
        ANALYZIFY.mobileMenuToggle();
    });

    /**
     * <b>EXIBE BOTAO TOPO</b>
     * 
     * Exibe botão para voltar ao topo
     */
    if (ANALYZIFY.config.backtop) {
        ANALYZIFY.botaoTopoExist = true;

        jQuery(ANALYZIFY.config.backtopContent).appendTo('body').on('click', function () {
            jQuery('html, body').animate({scrollTop: 0}, 1000);
        });
        
        jQuery(ANALYZIFY).on('scroll:zero', function(){
            jQuery('analyzify-backtop').fadeOut();
        });
        
        jQuery(ANALYZIFY).on('scroll:top', function(){
            jQuery('analyzify-backtop').fadeIn();
        });
    }

    //SCROLLSPY
    if (jQuery('[data-spy]').length) {
        ANALYZIFY.scrollSpyExist = true;
        var arraySpy = {};
        var processingSpy = false;
        var processingSpyCalc = false;

        /**
         * <b>SCROLLSPY</b>
         * 
         * Muda cor dos ítens do menu com atributo <b>scrollspy</b>.
         * 
         * Na presença do atributo <b>data-spy</b> a função busca no mesmo elemento o valor do atributo <b>href</b> e verifica se é equivalente ao href do menu scrollspy. Verifica elementos com sufixo <b>_go</b> também.
         */
        ANALYZIFY.scrollSpy = function () {
            if (processingSpy === false) {
                processingSpy = true;
                jQuery('[data-spy]').each(function (i) {
                    if (typeof arraySpy[i] !== 'undefined') {
                        if (ANALYZIFY.scrollTop >= arraySpy[i].position - 5 && ANALYZIFY.scrollTop < arraySpy[i].position + arraySpy[i].height - 5) {
                            jQuery('[data-scrollspy] [href="#' + arraySpy[i].dataspy + '"]').addClass('active');
                        } else {
                            jQuery('[data-scrollspy] [href="#' + arraySpy[i].dataspy + '"]').removeClass('active');
                        }
                    }
                });
                processingSpy = false;
            }
        };

        /**
         * Calcula as posição de cada elemento com data-spy.
         */
        ANALYZIFY.scrollSpyCalc = function () {
            if (processingSpyCalc === false) {
                processingSpyCalc = true;
                jQuery('[data-spy]').each(function (i) {
                    var id = jQuery(this).attr('id');
                    if (typeof id !== 'undefined') {
                        arraySpy[i] = {dataspy: id, position: jQuery(this).offset().top - ANALYZIFY.menuInitialHeight, height: jQuery(this).outerHeight()};
                    }
                });
                ANALYZIFY.scrollSpy();
                processingSpyCalc = false;
            }
        };
    }

    //LAZY LOAD
    if (jQuery('[data-src]').length) {
        ANALYZIFY.lazyLoadExist = true;
        var arraySrc = {};
        var processingLazyLoad = false;
        var processingLazyLoadCalc = false;

        /**
         * <b>LAZY LOAD</b>
         * 
         * Carrega imagens dinamicamente quando imagem está prestes a ficar visível.
         * 
         * Na presença do atributo <b>data-src</b> a função busca no mesmo elemento o valor do mesmo e muda o valor do atributo <b>src</b>, fazendo a imagem ser carregada dinamicamente.
         */
        ANALYZIFY.lazyLoad = function () {
            if (processingLazyLoad === false) {
                processingLazyLoad = true;
                jQuery('[data-src]').each(function (i) {
                    if (typeof arraySrc[i] !== 'undefined') {
                        if (ANALYZIFY.scrollTop >= arraySrc[i].position - ANALYZIFY.height && ANALYZIFY.scrollTop < arraySrc[i].position + arraySrc[i].height && !arraySrc[i].load) {
                            var element = jQuery(this);
                            if (!element.is('[data-src-bg]')) {
                                element.attr('src', arraySrc[i].source).load(function () {
                                    element.removeAttr('style').unwrap('[data-src-wrap]');
                                    if (element.is('[data-normalize]'))
                                        A.normalize();
                                });
                            } else {
                                element.css('background-image', 'url(' + arraySrc[i].source) + ')';
                            }
                            arraySrc[i].load = true;
                            if (ANALYZIFY.debug.lazyLoad === true)
                                console.log(element.attr('data-src'));
                        }
                    }
                });
                processingLazyLoad = false;
            }
        };

        /**
         * Calcula as posição de cada elemento com data-src.
         */
        ANALYZIFY.lazyLoadCalc = function () {
            if (processingLazyLoadCalc === false) {
                processingLazyLoadCalc = true;
                jQuery('[data-src]').each(function (i) {
                    var src = jQuery(this).attr('data-src');
                    if (typeof src !== 'undefined') {
                        arraySrc[i] = arraySrc[i] || {};
                        arraySrc[i].source = src;
                        arraySrc[i].position = jQuery(this).offset().top;
                        arraySrc[i].height = jQuery(this).outerHeight();
                        arraySrc[i].load = arraySrc[i].load || false;
                    }
                });
                ANALYZIFY.lazyLoad();
                processingLazyLoadCalc = false;
            }
        };
    }

    //FADE REDIRECTION
    if (ANALYZIFY.config.redirectFade) {
        $('a[href]:not([data-default]):not([rel]):not([target])').on('click', function (event) {
            if (this.pathname === window.location.pathname &&
                    this.protocol === window.location.protocol &&
                    this.host === window.location.host) {
            } else {
                event.preventDefault();
                var href = $(this).attr('href');
                var content = '<div class="center_fixed ds_none" style="background: ' + ANALYZIFY.config.redirectFadeBg + ' !important"></div>';
                jQuery(content).appendTo('body').append(ANALYZIFY.config.redirectFadeContent).fadeIn(ANALYZIFY.config.redirectFadeTime, function () {
                    window.location = href;
                });
            }
        });
    }

    //PRELOAD HANDLE
    $('[data-preload]:not([data-load])').fadeOut();
    $(window).on('load', function () {
        $('[data-preload][data-load]').fadeOut();
    });
    if (ANALYZIFY.config.preloadTimer) {
        setTimeout(function () {
            var preload = $('[data-preload]');
            if (preload.is(':visible'))
                preload.fadeOut();
        }, ANALYZIFY.config.preloadTimer);
    }

//    //AFFIX
//    affixCalc();
//
//    function affixCalc() {
//        var affixCalc = (Math.floor((jQuery('.j_affix').width() / jQuery('.j_affix_height').width())) < 1);
//    }
//
//    if ((jQuery('.j_affix').length === 1) && (jQuery('.j_affix_height').length === 1) && (affixCalc === true)) {
//        var affixPosition = jQuery('.j_affix').offset().top;
//        var affixHeight = jQuery('.j_affix').outerHeight();
//        var affixLastPosition = affixPosition;
//        var affixDelta = affixHeight - windowHeight;
//        var affixFirstMarginTop = jQuery('.j_affix').css('margin-top');
//        var affixLastMarginTop = jQuery('.j_affix').css('margin-top');
//        var affixBothControl;
//        var affixBothPosition;
//        var affixRefHeight = jQuery('.j_affix_height').outerHeight();
//        function affixScroll() {
//            jQuery('.j_affix').width();
//            affixHeight = jQuery('.j_affix').outerHeight();
//            affixDelta = affixHeight - windowHeight;
//        }
//        function affixResize() {
//            affixHeight = jQuery('.j_affix').outerHeight();
//            affixDelta = affixHeight - windowHeight;
//        }
//        //AFFIX TOP
//        if (jQuery('[affixtop]').length) {
//            var affixTopExist = true;
//            function affixTop() {
//                if ((scrollTop >= affixPosition - menuHeight) && (scrollTop < affixPosition + affixRefHeight - affixHeight)) {
//                    jQuery('[affixtop]').css({'margin-top': scrollTop - affixPosition + menuHeight});
//                } else if (scrollTop >= affixPosition + affixRefHeight - affixHeight) {
//                    affixLastMarginTop = jQuery('[affixtop]').css('margin-top');
//                    jQuery('[affixtop]').css({'margin-top': affixLastMarginTop});
//                } else {
//                    jQuery('[affixtop]').css({'margin-top': affixFirstMarginTop});
//                }
//            }
//        }
//        //AFFIX BOTTOM
//        if (jQuery('[affixbottom]').length) {
//            var affixBottomExist = true;
//            function affixBottom() {
//                if (scrollTop >= affixPosition + affixDelta) {
//                    jQuery('[affixbottom]').css({position: 'fixed', bottom: 0});
//                } else {
//                    jQuery('[affixbottom]').css({position: '', bottom: ''});
//                }
//            }
//        }
//        //AFFIX BOTH
//        if (jQuery('[affixboth]').length) {
//            var affixBothExist = true;
//            function affixBoth() {
//                if ((scrollTop > lastScrollTop) && (scrollTop >= affixLastPosition + affixDelta)) {
//                    jQuery('[affixboth]').css({position: 'fixed', bottom: 0, top: '', marginTop: ''});
//                    affixLastPosition = scrollTop;
//                    affixBothControl = 1;
//                    affixBothPosition = jQuery('.j_affix').offset().top;
//                } else if ((scrollTop < lastScrollTop) && (scrollTop >= affixPosition - menuHeight) && (scrollTop <= affixLastPosition - affixDelta)) {
//                    jQuery('[affixboth]').css({position: 'fixed', top: menuHeight, bottom: '', marginTop: ''});
//                    affixLastPosition = scrollTop;
//                    affixBothControl = 1;
//                    affixBothPosition = jQuery('.j_affix').offset().top;
//                } else if (scrollTop < affixPosition - menuHeight) {
//                    jQuery('[affixboth]').css({position: '', top: '', bottom: '', marginTop: ''});
//                    affixLastPosition = affixPosition;
//                } else if (((scrollTop > lastScrollTop) && (jQuery('[affixboth]').css('top') === menuHeight + 'px')) || ((scrollTop < lastScrollTop) && (jQuery('[affixboth]').css('bottom') === 0 + 'px'))) {
//                    if (affixBothControl === 1) {
//                        jQuery('[affixboth]').css({position: '', marginTop: affixBothPosition, bottom: '', top: ''});
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

    ANALYZIFY.navigate = function (obj, data) {
        var def = {
            params: undefined,
            removeParams: undefined,
            overwriteParams: false,
            path: undefined,
            hash: undefined
        };

        Object.assign(def, obj);

        if (typeof def.params === 'object' && def.params !== null && !jQuery.isEmptyObject(def.params)) {

            //parameters
            if (!def.overwriteParams) {
                Object.assign(def.params, ANALYZIFY.queryStringToJSON());
            } else {
                def.params = ANALYZIFY.queryStringToJSON();
            }

            //remove parameters
            if (typeof def.removeParams === 'object' && def.removeParams !== null) {
                for (param in def.removeParams) {
                    delete def.params[param];
                }
            }

            //serialize JSON into query string
            var params = jQuery.param(def.params);
        } else {
            var params = '';
        }

        //hash
        if (def.hash) {
            if (def.hash.indexOf('#') !== -1) {
                var hash = def.hash;
            } else {
                var hash = '#' + def.hash;
            }
        } else if (def.hash === false) {
            var hash = '';
        } else {
            var hash = window.location.hash;
        }

        //pathname
        if (def.path) {
            var path = def.path;
        } else if (def.path === false) {
            var path = '';
        } else {
            var path = window.location.pathname;
        }

        //if jQuery Mobile is present, use it!
        if (ANALYZIFY.jqMobile.present) {
            jQuery.mobile.navigate(path + params + hash, data);
        } else {
            window.location = path + params + hash;
        }
    };

    //MODAL
    if (jQuery('[data-modal]').length) {
        var dataModal;

        /**
         * Invoca fechamento de modal ao clicar fora
         * @param event
         */
        jQuery('[data-modal]').on('click', function (event) {
            if (jQuery(event.target).has('.j_modal_box').length) {
                var modal = jQuery(this).attr('data-modal');
                ANALYZIFY.closeModal(modal);
            }
        });

        /**
         * Invoca fechamento da modal ao clicar no botão de fechar
         */
        jQuery('.j_modal_close').click(function () {
            var modal = jQuery(this).parents('[data-modal]').attr('data-modal');
            ANALYZIFY.closeModal(modal);
        });

        /**
         * Abre modal onde o valor do atributo <b>data-modal</b> é igual ao parâmetro <b>setDataModal</b>
         * @param {string} setDataModal - Nome da modal a ser aberta
         * @param {boolean} historyChange - Se não for false e jQuery Mobile estiver carregado, modais afetarão o histórico do navegador
         */
        ANALYZIFY.openModal = function (setDataModal, historyChange) {
            var dataModal = '[data-modal="' + setDataModal + '"]';
            if (jQuery(dataModal).length) {
                jQuery('body').css('overflow', 'hidden');
                jQuery(dataModal).fadeIn(400, function () {
                    jQuery(this).children().fadeIn(400, function () {
                        jQuery(this).find('input:text:visible:first').focus();
                    });
                }).css("display", "flex");

                //jQuery Mobile - Modal to History
                if (historyChange !== false) {
                    if (ANALYZIFY.jqMobile.modalParamLoad !== true) {
                        var modalParam = ANALYZIFY.urlParam('modal');
                        if (!((modalParam) && (modalParam !== true))) {
                            ANALYZIFY.navigate({
                                params: {modal: setDataModal},
                                info: 'Modal opened'
                            });
                        }
                    }
                }
            }
        };

        /**
         * Fecha modais
         * @param {string} setDataModal - Nome da modal a ser fechada
         * @param {boolean} historyBack - Se plugin jQuery Mobile estiver presente, fechar modal volta o histórico a menos uqe historyBack seja false.
         */
        ANALYZIFY.closeModal = function (setDataModal, historyBack) {
            var dataModal = '[data-modal="' + setDataModal + '"]';
            if (jQuery(dataModal).length) {
                jQuery('body').css('overflow', '');
                jQuery(dataModal).children().fadeOut(200, function () {
                    jQuery(this).closest('[data-modal]').fadeOut(200);
                });

                //jQuery Mobile - Modal to History
                if (ANALYZIFY.jqMobile.present && historyBack !== false) {
                    var modalParam = ANALYZIFY.urlParam('modal');
                    if ((modalParam) && (modalParam !== true)) {
                        ANALYZIFY.navigate({
                            removeParams: {modal: setDataModal},
                            info: 'Modal closed'
                        });
                    }
                }
            }
        };

        /**
         * <b>MODAL BY URL PARAMETER</b>
         * 
         * Após carregar a página, abre modal se o parâmetro da URL <b>modal</b> for igual ao valor do atributo <b>data-modal</b>.
         */
        var modalParam = ANALYZIFY.urlParam('modal');
        if ((modalParam) && (modalParam !== true)) {
            ANALYZIFY.openModal(modalParam, false);
            ANALYZIFY.jqMobile.modalParamLoad = true;
        }
    }

    //IGUALAR ALTURA DE BOX MENORES
    if (jQuery('[data-same-height]').length) {
        ANALYZIFY.jSameHeightExist = true;
        var jSameHeight = {};
        var GreaterSameHeight = {};
        var processingHeights = false;

        /**
         * Iguala altura de boxes com mesmo valor de atributo <b>data-same-height</b>.
         */
        ANALYZIFY.sameHeight = function () {
            if (processingHeights === false) {
                processingHeights = true;
                if (ANALYZIFY.width > 460) {
                    jQuery('[data-same-height]').each(function (i) {
                        jSameHeight[i] = jSameHeight[i] || {};
                        jQuery(this).css('height', '');
                        if (jQuery(this).outerWidth() / ANALYZIFY.width < 0.8) {
                            jSameHeight[i].check = true;
                            var order = jQuery(this).attr('data-same-height');
                            typeof GreaterSameHeight[order] !== "undefined" ? '' : GreaterSameHeight[order] = 0;
                            jSameHeight[i].height = jQuery(this).height();
                            if (jSameHeight[i].height > GreaterSameHeight[order]) {
                                GreaterSameHeight[order] = jSameHeight[i].height;
                            }
                        } else {
                            jSameHeight[i].check = false;
                        }
                    });
                    jQuery('[data-same-height]').each(function (i) {
                        if (jSameHeight[i].check === true) {
                            var order = jQuery(this).attr('data-same-height');
                            jQuery(this).css('height', GreaterSameHeight[order]);
                        }
                    });
                    GreaterSameHeight = {};
                } else {
                    jQuery('[data-same-height]').each(function (i) {
                        jQuery(this).css('height', '');
                    });
                }
                ANALYZIFY.normalize();
                processingHeights = false;
            }
        };
    }

    //*****END FUNCIONALIDADES*****

    //-----WIDGETS-----

    //SHARE BOX
    if (jQuery('[data-sharebox]').length) {

        //SHARE :: FACEBOOK
        jQuery('[data-sharebox-facebook] a').click(function () {
            var share = 'https://www.facebook.com/sharer/sharer.php?u=';
            var urlOpen = jQuery(this).attr('href');
            window.open(share + urlOpen, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=660, height=400");
            return false;
        });

        //SHARE :: GOOGLE PLUS
        jQuery('[data-sharebox-google] a').click(function () {
            var share = 'https://plus.google.com/share?url=';
            var urlOpen = jQuery(this).attr('href');
            window.open(share + urlOpen, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=516, height=400");
            return false;
        });

        //SHARE :: TWITTER
        jQuery('[data-sharebox-twitter] a').click(function () {
            var share = 'https://twitter.com/share?url=';
            var urlOpen = jQuery(this).attr('href');
            var complement = jQuery(this).attr('rel');
            window.open(share + urlOpen + complement, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, width=660, height=400");
            return false;
        });

    }

    //ACCORDION
    if (jQuery('[data-accord]').length) {
        jQuery('[data-accord]').click(function () {
            var up = false;
            jQuery('.j_accord_toogle_active').slideUp(200, function () {
                up = true;
                jQuery(this).removeClass('j_accord_toogle_active');
                ANALYZIFY.normalize();
            });
            jQuery(this).find('.j_accord_toogle:not(.j_accord_toogle_active)').slideToggle(200, function () {
                up !== true ? ANALYZIFY.normalize() : '';
            }).addClass('j_accord_toogle_active');
            up = false;
        });
    }


    //SLIDER
    if (jQuery('[data-slide]').length) {
        var slideContentFirst;
        var slideContent;
        var slideIndicatorActive;
        var slideIndicator;
        var slideId;
        var slideDiv;
        jQuery('[data-slide-go]').click(function () {
            ANALYZIFY.slider(jQuery(this), 'go');
            return false;
        });

        jQuery('[data-slide-back]').click(function () {
            ANALYZIFY.slider(jQuery(this), 'back');
            return false;
        });

        jQuery('[data-slide-indicator] li').click(function () {
            var slideIndex = jQuery(this).index();
            ANALYZIFY.slider(jQuery(this), 'to', slideIndex);
            return false;
        });

        /*
         * 
         * @param {element} element - Objeto jQuery do Slider
         * @param {string} type - Método de execução do Slider, pode ser 'go', 'back', ou 'to'.
         * @param {integer} index - Índice do data-slide-content, caso do primeiro argumento ser 'to'
         * @returns {Boolean}
         */
        ANALYZIFY.slider = function (element, action, options) {
            slideDiv = element.closest('[data-slide]');
            slideId = slideDiv.attr('data-slide');
            slideContentFirst = slideDiv.find('[data-slide-content] > *.first');
            slideContent = slideDiv.find('[data-slide-content] > *');
            slideIndicatorActive = slideDiv.find('[data-slide-indicator] li.active');
            slideIndicator = slideDiv.find('[data-slide-indicator] li');

            if (typeof options === 'object' && options !== null) {
                var index = options.index;
            } else {
                var index = options;
            }

            switch (action) {
                case 'go':
                    if (slideContentFirst.next().length) {
                        slideContentFirst.fadeOut(200, function () {
                            jQuery(this).removeClass('first').next().fadeIn().addClass('first');
                            slideIndicatorActive.removeClass('active').next().addClass('active');
                        });
                    } else {
                        slideContentFirst.fadeOut(200, function () {
                            jQuery(this).removeClass('first');
                            slideContent.first().fadeIn().addClass('first');
                            slideIndicatorActive.removeClass('active');
                            slideIndicator.first().addClass('active');
                        });
                    }
                    break;
                case 'back':
                    if (slideContentFirst.index() >= 1) {
                        slideContentFirst.fadeOut(200, function () {
                            jQuery(this).removeClass('first').prev().fadeIn().addClass('first');
                            slideIndicatorActive.removeClass('active').prev().addClass('active');
                        });
                    } else {
                        slideContentFirst.fadeOut(200, function () {
                            jQuery(this).removeClass('first');
                            slideContent.last().fadeIn().addClass('first');
                            slideIndicatorActive.removeClass('active');
                            slideIndicator.last().addClass('active');
                        });
                    }
                    break;
                case 'to':
                    var selectedIndicator = slideIndicator.eq(index);
                    if (!selectedIndicator.hasClass('active')) {
                        slideContentFirst.fadeOut(200, function () {
                            jQuery(this).removeClass('first');
                            slideContent.eq(index).fadeIn().addClass('first');
                            slideIndicatorActive.removeClass('active');
                            selectedIndicator.addClass('active');
                        });
                    }
                    break;
                default:
                    console.log('slider: type parameter must on of these strings: "go", "back" or "to"');
                    break;
            }
        };
    }

    //*****END WIDGETS*****

    //-----DEV TOOLS-----
    if (typeof ANALYZIFY.BASE !== 'undefined' && (ANALYZIFY.BASE === 'localhost' || ANALYZIFY.BASE === '127.0.0.1')) { //Verifica se está em localhost

        jQuery(window).resize(function () {
            ANALYZIFY.definePrefix();
        });
//        jQuery(window).scroll(function () {
//            ANALYZIFY.appendScrollTop();
//        });

        /**
         * Verifica a resolução, define o prefixo responsivo e exibe na tela.
         */
        ANALYZIFY.definePrefix = function () {
            if (ANALYZIFY.width < 480) {
                prefix = '0 (Até 480)';
                ANALYZIFY.executePrefix();
            } else if ((ANALYZIFY.width >= 480) && (ANALYZIFY.width < 768) && (prefix !== 'xs')) {
                prefix = 'xs (480 -> 768)';
                ANALYZIFY.executePrefix();
            } else if ((ANALYZIFY.width >= 768) && (ANALYZIFY.width < 1024) && (prefix !== 'sm')) {
                prefix = 'sm (768 -> 1024)';
                ANALYZIFY.executePrefix();
            } else if ((ANALYZIFY.width >= 1024) && (ANALYZIFY.width < 1280) && (prefix !== 'md')) {
                prefix = 'md (1024 -> 1280)';
                ANALYZIFY.executePrefix();
            } else if ((ANALYZIFY.width >= 1280) && (prefix !== 'lg')) {
                prefix = 'lg (Maior que 1280)';
                ANALYZIFY.executePrefix();
            }
        };

        //IMAGE DEBUG
        var imgElements = ANALYZIFY.urlParam('imgdebug');
        if (jQuery(imgElements).length) {

            ANALYZIFY.imgDebug = function (element) {
                var width = element.width();
                var height = element.height();
                console.log(width + 'x' + height);
                element.after('<p style="color: #fff; background: #333; padding: 10px;">width: ' + width + 'px - RatioPadding: ' + (height / width * 100).toFixed(2) + '%</p>');
            };

            //ON LOAD
            $(window).on('load', function () {
                var elems = jQuery(imgElements).not(function () {
                    return $(this).closest('[data-src-wrap]').length;
                });
                elems.each(function () {
                    ANALYZIFY.imgDebug(jQuery(this));
                });
                $('<span style="padding: 5px; position: fixed; bottom: 20px; right: 100px; z-index: 200; background-color: #000; opacity: 0.7; color: #fff; border-radius: 5px; cursor: pointer">Get Ratio</span>').appendTo('body').on('click', function () {
                    jQuery(imgElements).each(function () {
                        ANALYZIFY.imgDebug(jQuery(this));
                    });
                });
            });
        }

        //SCROLLTOP PRINT
        ANALYZIFY.appendScrollTop = function () {
            jQuery('body').append('<span class="prefixLabel" style="position: fixed; left: 0; bottom: 0; background-color: rgba(70, 70, 70, 0.8); color: #fff; padding: 10px 16px; border-radius: 0 5px 0 0; text-transform: uppercase; z-index: 200;">' + ANALYZIFY.scrollTop + '</span>');
        };

        //RESOLUTION PREFIXES
        var prefix;
        var timerPref;

        ANALYZIFY.timerPrefix = function () {
            clearTimeout(timerPref);
            timerPref = setTimeout(function () {
                ANALYZIFY.removePrefix();
            }, 2000);
        };

        ANALYZIFY.removePrefix = function () {
            jQuery('span.prefixLabel').remove();
        };

        ANALYZIFY.appendPrefix = function () {
            jQuery('body').append('<span class="prefixLabel" style="position: fixed; left: 0; bottom: 0; background-color: rgba(70, 70, 70, 0.8); color: #fff; padding: 10px 16px; border-radius: 0 5px 0 0; text-transform: uppercase;">' + prefix + '</span>');
        };

        ANALYZIFY.executePrefix = function () {
            ANALYZIFY.removePrefix();
            ANALYZIFY.appendPrefix();
            ANALYZIFY.timerPrefix();
        };
    }

    //*****END DEV TOOLS*****

//MOBILE DETECTION SOON

}); //FIM FUNÇÕES JQUERY