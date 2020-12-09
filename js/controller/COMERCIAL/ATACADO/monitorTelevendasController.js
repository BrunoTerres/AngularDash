app.controller('monitorTelevendasController', function($scope, $http,$timeout,growl,$interval){
      
    if (!$scope.permissoes[3]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();

    //==========  CHAMADA DE FUNÇÃO DO CONTROLLER LOGOUT BASE ==========//
    $scope.start(false);
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    //==========  VISAO ATACADO MONITOR ==========//
    $scope.visAtcMonitor = {
        clientes_cadastrados: 0,
        clientes_novos: 0,
        clientes_reativados: 0,
        outro_produtos: 0,
        pedidos_dias: 0,
        pedidos_mes: 0,
        percentual_meta: 0,
        positivados_dia: 0,
        positivados_mes: 0,
        percentual_metaDiaria: 0
    };
    $scope.divGeral = false;
    
    //========== POST ATC MONITOR ==========// 
    $scope.postAtcMonitor = {
        method : 'POST',
        url : $scope.baseApi + 'atcMonitor/',
        data : {'atcMonitor':  $scope.filtro},
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': $scope.login.token 
        }     
    };
    
    $scope.monitorMeta = true;
    //========== ATC MONITOR  ==========//
    $scope.atcMonitor = function(){
        console.log("ok")
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.transPend.visaoGeral==false){
                $scope.transPend.visaoGeral = true;
                $http($scope.postAtcMonitor
                ).then(function(event){                  
                    $scope.visAtcMonitor = event.data;                   
                    $scope.transPend.visaoGeral = false;                    
                    $scope.divGeral = true;
                    
                    if($scope.monitorMeta == true){
                        $scope.monitor();
                    }
                }).catch(function(err){
                    console.log(err);      
                    $scope.transPend.visaoGeral = false;
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 5');   
                    }; 
                });
            } else {
                growl.info('<b>AGUARDE</b><br> Transaçaõ Pendente!');   
            }
        } else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');    
        }
    };  
    
    $scope.atcMonitor();    
    
    $interval( function(){ $scope.atcMonitor(); }, 120000);
    

    $scope.showPainel = 1;
    
    $scope.countShowPainel = function(){
        if ($scope.showPainel == 8){
            $scope.showPainel = 1;
        } else {
                      
            if($scope.showPainel == 1){
                $scope.metaMensal = $scope.visAtcMonitor.percentual_meta;
                $scope.metaDiaria = $scope.visAtcMonitor.percentual_metaDiaria;
            };
            $scope.showPainel++;
        }          
    };  

    $scope.monitor = function(){
        $scope.monitorMeta = false;
        $interval( function(){ $scope.countShowPainel(); }, 5000);   
    };

});

