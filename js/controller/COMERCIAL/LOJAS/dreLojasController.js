app.controller('dreLojasController', function ($scope, $http, $timeout, growl) {

    if (!$scope.permissoes[33]) {
        window.location = "LOGIN/login.html";
    };

    $scope.gototop();

    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== POST PARA PESQUISA AS LOJAS PARA SELECT HTML ==========// 
    $scope.empresasLojas = function(){
        if ($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo == false) {
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'empresasLojas/',
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function (event) {
                $scope.transPend.visaoGeral = false;             
                $scope.lojas = event.data.lojas
            }).catch(function (err) {
                console.log(err);
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 78'); 
                };  
            })
        } else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };

    $scope.empresasLojas(); 
    $scope.divGeral = false;

    //========== POST PARA PESQUISA DO DRE ==========// 
    $scope.dreLojas = function(){
        if($scope.empresa.id == 0){
            growl.warning('<b>ATENÇÃO</b><br> Selecione a Loja Para Pesquisa');
        }else{
            $scope.divGeral = false;
            if ($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)) {
                if ($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo == false) {
                    $scope.transPend.visaoGeral = true;
                    var empresa = ''
                    if($scope.empresa.id ){
                        if($scope.empresa.id == '102'){
                            empresa = '3';
                        }else if($scope.empresa.id == '103'){
                            empresa = '1';
                        }else if($scope.empresa.id == '104'){
                            empresa = '2';
                        }else if($scope.empresa.id == '105'){
                            empresa = '4';
                        }else if($scope.empresa.id == '201'){
                            empresa = '5';
                        }else if($scope.empresa.id == '106'){
                            empresa = '6';
                        }else if($scope.empresa.id == '107'){
                            empresa = '7';    
                        }else if($scope.empresa.id == '202'){
                            empresa = '8';
                        }else if($scope.empresa.id == '99'){
                            empresa = '99';
                        };
                    };               
                   
                    $scope.filtro.codigoEmpresa = empresa;
                    $http({
                        url: $scope.baseApi + 'dreLojas/',
                        method: 'POST',
                        data: { 'dreLojas': $scope.filtro },
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }
                    }).then(function (event) {
                        $scope.transPend.visaoGeral = false;
                        if(event.data.error == true){
                            growl.warning('<b>ATENÇÃO</b><br> Loja ou data informada não contém dados');
                        }else{
                            $scope.dreInfo = event.data.dados;                       
                            $scope.divGeral = true;  
                        };
                                          
                    }).catch(function (err) {
                        console.log(err);
                        $scope.transPend.visaoGeral = false;
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 79');
                    })
                } else {
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };
            } else {
                growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');
            };
        };
    };

});

