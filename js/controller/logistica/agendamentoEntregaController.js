app.controller('agendamentoEntregaController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[23]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };    
    
   //==========  VARIAVEIS PARA TABELAS DINAMICAS ==========//
    $scope.contagemAgendamento = 10;  
    
    $scope.selecaoAgendamento ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };
    
    $scope.filterAgendamento = function(data){
        $scope.contagemAgendamento = data.id;   
    };    
  
    
    $scope.contagemHistorico = 10;  
    
    $scope.selecaoHistorico ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };
    
    $scope.filterHistorico= function(data){    
        $scope.contagemHistorico = data.id;   
    }; 
    
    //==========  VARIAVEIS GLOBAIS ==========//
    $scope.agendamentoHistorico = [];
    $scope.agendamentoInfoHistorico = [];
    
    $scope.showDiv = false;
    
    //========== POST HISTORICO AGENDAMENTO NOTA FISCAL - ATACADO  ==========// 
    $scope.historicoAgendamento = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'historicoAgendamento/',
            method: 'POST',
            data: {'historicoAgendamento': $scope.filtro},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }   
        }).then(function(event){    
            $scope.transPend.visaoGeral = false;                
            $scope.agendamentoHistorico  = event.data;
            if($scope.agendamentoHistorico.historicoAgendamento != ''){
                $scope.showDiv = true;
            }else{
              growl.warning('<b>ATENÇÃO</b><br> Não existe histórico no período filtrado');   
            }; 
        }).catch(function(err){ 
            console.log(err);
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 52');   
            };                       
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };           
    }; 
    
    $scope.historicoInfoAgendamento = function(serie,numero,empresa,emissao,codigoCliente,cliente){
        $scope.agendamentoInfo = {           
            'emissao': emissao,
            'cliente': cliente,                     
            'empresa': empresa,
            'numero': numero,
            'serie': serie,             
        };         
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'historicoInfoAgendamento/',
            method: 'POST',
            data: {'historicoInfoAgendamento': $scope.agendamentoInfo},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }       
        }).then(function(event){    
            $scope.transPend.visaoGeral = false;              
            $scope.agendamentoInfoHistorico  = event.data;                    
            $('#modalHistorico').trigger('click');
        }).catch(function(err){ 
            console.log(err);
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 53');   
            };                      
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
  
    
});

