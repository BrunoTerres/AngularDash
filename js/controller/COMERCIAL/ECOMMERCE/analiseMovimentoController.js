app.controller('analiseMovimentoController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[4]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
        
    $scope.divGeral = false;
    $scope.VisEcmAnaliseMovimento = {}
    
    //========== POST ECM ANALISE MOVIMENTO ==========/
    $scope.postEcmAnaliseMovimento = {
        method : 'POST',
        url : $scope.baseApi + 'analiseMovimento/',
        data : {'analiseMovimento':$scope.filtro},
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': $scope.login.token 
        } 
    };
    
    //==========ECM ANALISE MOVIMENTO ==========//
    $scope.ecmAnaliseMovimento = function(){
        $scope.divGeral = false;
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.transPend.visaoGeral==false){
                $scope.transPend.visaoGeral = true;
                $http($scope.postEcmAnaliseMovimento
                ).then(function(event){  
                    $scope.transPend.visaoGeral = false;                  
                    $scope.VisEcmAnaliseMovimento = event.data;                  
                    $scope.Semaforo();               
                    $scope.divGeral = true;     
                    
                }).catch(function(err){
                    console.log(err);                  
                    $scope.transPend.visaoGeral = false;
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 6');    
                    }; 
                });
            } else {
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');   
            }
        } else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');        
        }
    };
    
    //========== SEMAFORO ==========//
    $scope.Semaforo = function(){
        for (var i in $scope.VisEcmAnaliseMovimento.analise_movimento){
            if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].origem.trim() == 'NACIONAL'){
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem == 0){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'B'
                } else
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem < 20){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'R'
                } else
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem < 28){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'Y'
                } else {
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'G'
                }
                
            } else {
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem == 0){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'B'
                } else
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem < 25){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'R'
                } else
                if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].margem < 32){
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'Y'
                } else {
                    $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo = 'G'
                }
            }
            
            if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].dias_estoque <= 0){
                $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo_est = 'D'                
            } else 
            if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].dias_estoque < 15){
                $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo_est = 'R'                
            } else
            if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].dias_estoque < 25){
                $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo_est = 'Y'                
            } else
            if ($scope.VisEcmAnaliseMovimento.analise_movimento[i].dias_estoque < 40){
                $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo_est = 'G'                
            } else {
                $scope.VisEcmAnaliseMovimento.analise_movimento[i].semaforo_est = 'A'                
            }
        }        
    }
    
    //========== FUNCÕES PARA CORES TABLE ==========//
    $scope.propertyName = 'fat_prev';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    
    $scope.data = {
         selectedOption: {id:'X', name:'Status Produto'},
         availableOptions: [
            {id:'X', name:'Status Produto'},
            {id:'R', name:'VERMELHO'},
            {id:'Y', name:'AMARELO'},
            {id:'G', name:'VERDE'},
            {id:'B', name:'AZUL'}]
    };
    
    $scope.dataDiaEstoque = {
         selectedOption: {id:'X', name:'Status Dias Estoque'},
         availableOptions: [
            {id:'X', name:'Status Dias Estoque'},
            {id:'D', name:'PRETO'},
            {id:'R', name:'VERMELHO'},
            {id:'Y', name:'AMARELO'},
            {id:'G', name:'VERDE'},
            {id:'A', name:'AZUL'}]
    };

    $scope.dataSelect = function(){
        console.log('Opcoes', $scope.data)
    };
    
});

