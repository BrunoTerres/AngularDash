$(function(){
    $("#tabela input").keyup(function(){
        var index = $(this).parent().index();
        var nth = "#tabela td:nth-child("+(index+1).toString()+")";
        var valor = $(this).val().toUpperCase();
        var palavras = [];
        palavras = valor.split("%");
        $("#tabela tbody tr").show();
        $(nth).each(function(){
            var ok = false;
            var texto = $(this).text().toUpperCase();
            for (var i = 0; i < palavras.length; i++){
                if (texto.indexOf(palavras[i]) < 0) {
                    ok = true;
                }
            };
            if (ok){
                $(this).parent().hide();
            };
        });
    });
    $("#tabela input").blur(function(){
        $(this).val("");
    });
});



