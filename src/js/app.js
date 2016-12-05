// module
(function(win, doc, $){
    var botModule = (function(){
        var _randomStuff = ['Boom',
                            'boom, boom',
                            'maybe boom'],
            _conversation = [];

        function _randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }

        function _getRandomStuff(){
            return _randomStuff[_randomIntFromInterval(0, _randomStuff.length-1)];
        }

        function _storeConversation(msg, reply) {
            var message = msg,
                reply = reply;
            _conversation.push({
                message: message,
                reply: reply
            });
        }

        function _keepListShort($list, length){
            var isTooLong = $list.children('li').length > length;
            if(isTooLong){
                $list.children('li').last().remove();
            }
        }

        function getConversation(){
            return _conversation;
        }

        function storeAndShow(msg){
            var reply = _getRandomStuff(),
                $list = $('.list');
            _storeConversation(msg, reply);
            $list.prepend('<li><ul>' +
                                '<li>Komputer: ' + reply + '</li>' +
                                '<li>Ty: ' + msg + '</li>' +
                                '</ul></li>');
            _keepListShort($list, 6);
        }

        console.log('I am not lazy');

        //reveal module
        return {
            storeAndShow: storeAndShow,
            getConversation: getConversation
        }
    })();

    // decide what is in the global scope
    if(!win.botModule) win.botModule = botModule;

    // use it
    $(doc).ready(function($) {
        $('.msg').on('keypress', function(e){
            if(e.which === 13){
                var msg = $(this).val();
                win.botModule.storeAndShow(msg);
                $(this).val('');
                return false;
            }
        });
    });
})(window, document, jQuery);

// singleton (lazy)
(function(win, $){
    var historySingleton = (function(){
        var instance;

        function init(){
            var _$wrapper = $('<div id="history"></div>');

            function _getConversation(){
                return win.botModule.getConversation();
            }

            function _wrapConversation(){
                var conversation = _getConversation();
                _$wrapper.empty();
                for(let i = 0; i < conversation.length; i++){
                    _$wrapper.append(i + conversation[i].message + '|' + conversation[i].reply + '<br>');
                }
            }

            function loadHistory($target){
                _wrapConversation();
                if($target.find('#history').length){
                    $target.find('#history').remove();
                    $target.append(_$wrapper);
                } else {
                    $target.append(_$wrapper);
                }
            }

            // lazy instantiation
            console.log('I am lazy');

            return {
                loadHistory: loadHistory
            };
        }

        // make sure that there is only one object
        return {
            getInstance: function(){
                if(!instance){
                    instance = init();
                }

                return instance;
            }
        }
    })();

    // this same object is used in different logics/actions
    $(win.document).ready(function(){
        $('.show-history').on('click', function(e){
            var history = historySingleton.getInstance();
            history.loadHistory($('body'));
        });
    });
})(window, jQuery);