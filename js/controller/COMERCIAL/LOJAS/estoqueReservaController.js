app.controller('estoqueReservaController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[40]){
        window.location = "LOGIN/login.html";
    };
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== SHOW TABLE ==========//
    $scope.divGeral = false;

    //========== POST PARA PESQUISAR ESTOQUE RESERVA LOJAS ==========//
    $scope.estoqueReservaLojasPesquisa = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){              
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi + 'estoqueReservaLojasPesquisa/' + $scope.login.idperfil,
                method: 'GET',            
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                $scope.divGeral = true;
                $( document ).ready(function(){                 
                    $('#estoqueReserva').DataTable({
                        "language": {
                            "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                        },   
                        "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                        "iDisplayLength": 10,            
                        "data": event.data.dados.rows,                                
                        "columns": event.data.dados.cols,
                        "bDestroy": true,                                          
                    });   
                });                                
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                    
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:104');  
                };               
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };
    };    
});

