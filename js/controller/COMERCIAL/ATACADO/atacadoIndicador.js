app.controller('atacadoIndicador', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[24]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    $scope.infoIndicador = [];
    $scope.infoVendedor = [];
    $scope.card = false;
    
    $scope.atacadoIndicador = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'atacadoIndicador/',
                method: 'POST',
                data: {'atacadoIndicador': $scope.filtro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;                
                $scope.infoIndicador = event.data;                 
                if($scope.infoIndicador.atacadoIndicado.mensagem == true){
                    $scope.card = true; 
                   
                }else{
                    growl.warning('<b>ATENÇÃO</b><br>Não foi encontrado dados no período selecionado!');
                };                              
            }).catch(function(err){ 
                console.log(err);
                $scope.inforFornecedor.valida = false
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 54');  
                };                        
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
 
    };
    
    $scope.vendedorIndicador = function(valor,faixa){ 
        $scope.InfoAtacado = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,
            'faixa':  valor,
            'infoFaixa': faixa
        };
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'vendedorIndicador/',
                method: 'POST',
                data: {'vendedorIndicador': $scope.InfoAtacado },
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                  
                $scope.infoVendedor = event.data;
                $('#modalIndicador').trigger('click');                          
            }).catch(function(err){ 
                console.log(err);
                $scope.transPend.visaoGeral = false;               
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 55'); 
                };                      
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };

    };
});

