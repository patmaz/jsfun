// module
(function(win, doc){
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

        function _keepListShort(list, length){
            var isTooLong = list.children.length > length;
            if(isTooLong){
                list.removeChild(list.lastChild);
            }
        }

        function getConversation(){
            return _conversation;
        }

        function storeAndShow(msg){
            var reply = _getRandomStuff(),
                list = doc.querySelectorAll('.list')[0],
                newConverstionItem = doc.createElement('div');
            _storeConversation(msg, reply);
            newConverstionItem.innerHTML = '<li><ul>' +
                                '<li>Komputer: ' + reply + '</li>' +
                                '<li>Ty: ' + msg + '</li>' +
                                '</ul></li>';
            list.insertBefore(newConverstionItem, list.firstChild);
            _keepListShort(list, 6);
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
    document.addEventListener('DOMContentLoaded', function() {
       var msgInput = doc.querySelector('.msg');
       msgInput.addEventListener('keypress', function(e){
            if(e.which === 13){
                var msg = this.value;
                win.botModule.storeAndShow(msg);
                this.value = '';
                return false;
            }
       });
    });
})(window, document);

// singleton (lazy)
(function(win, doc){
    var historySingleton = (function(){
        var instance;

        function init(){
            var _wrapper = doc.createElement('div');
            _wrapper.setAttribute('id', 'history');

            function _getConversation(){
                return win.botModule.getConversation();
            }

            function _wrapConversation(){
                var conversation = _getConversation();
                _wrapper.innerHTML = '';
                for(let i = 0; i < conversation.length; i++){
                    var newItem = doc.createElement('div');
                    newItem.innerHTML = i + '|' + conversation[i].message + '|' + conversation[i].reply + '<br>';
                    _wrapper.appendChild(newItem);
                }
            }

            function loadHistory(target){
                _wrapConversation();
                if(doc.getElementById('history')){
                    doc.getElementById('history').parentNode.removeChild(doc.getElementById('history'));
                    target.appendChild(_wrapper);
                } else {
                    target.appendChild(_wrapper);
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
    doc.addEventListener('DOMContentLoaded', function(e){
        doc.querySelectorAll('.show-history')[0].addEventListener('click', function(e){
            var history = historySingleton.getInstance();
            history.loadHistory(doc.getElementsByTagName('body')[0]);
        });
    });
})(window, document);