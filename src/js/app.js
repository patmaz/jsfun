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
            _conversation.push([message, reply]);
        }

        function storeAndShow(msg){
            var reply = _getRandomStuff();
            _storeConversation(msg, reply);
            $('.list').prepend('<li><ul>' +
                                '<li>Komputer: ' + reply + '</li>' +
                                '<li>Ty: ' + msg + '</li>' +
                                '</ul></li>');
        }

        //reveal module
        return{
            storeAndShow: storeAndShow
        }
    })();

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

    // decide what is in the global scope
    if(!win.botModule) win.botModule = botModule;
})(window, document, jQuery);