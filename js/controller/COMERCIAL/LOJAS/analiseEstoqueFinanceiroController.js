app.controller('analiseEstoqueFinanceiro', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[26]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    //==========  PAGINAÇÃO DA TABELA  ==========//
    $scope.contagemEstoque = 10;   
    
    $scope.selecaoEstoque ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterEstoque= function(data){
        $scope.contagemEstoque = data.id;   
    };
    
    $scope.contagemApagar = 10;   
    
    $scope.selecaoApagar ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterApagar = function(data){
        $scope.contagemApagar = data.id;   
    };
    
    $scope.selecaoEmpresa ={
             selectedOption: {id: 'EP', name: 'Empresa'},
             availableOptions: [
                {id:'EP', name:'Selecione a Loja'},
                {id:'999', name:'Todas Lojas'},
                {id:'102', name:'Itajaí Quiosque'},
                {id:'107', name:'Itajaí Loja'},
                {id:'106', name:'Balneário'},
                {id:'103', name:'Joinville'},
                {id:'104', name:'Blumenau'},   
                {id:'105', name:'São José'},       
                {id:'201', name:'Curitiba - Palladium'}, 
                {id:'202', name:'Curitiba - Jockey Plaza'},   
             ]
    };
    
    $scope.filterEmpresa = function(data){
        $scope.empresaSelecao = data.id;       
    }; 
    
    //==========  VARIÁVEIS GLOBAIS  ==========//
    $scope.dadosAnalise = [];
    $scope.empresaSelecao = '';
    
    //==========  POST PESQUISA ESTOQUE E APAGAR ==========//
    $scope.analiseLojasFinanceiroEstoque = function(){
        $scope.divApresenta = false;
        $scope.contagemEstoque = 10;   
        $scope.contagemApagar = 10;  
        $scope.divTableLojas = false;
        $scope.divTableLoja = false;
        if($scope.empresaSelecao == '' || $scope.empresaSelecao == 'EP'){
             growl.warning('<b>ATENÇÃO</b><br> Selecione a empresa para pesquisa!');
        }else{            
            $scope.analiseInfo = {
                'empresa': $scope.empresaSelecao
            }
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'analiseLojasFinanceiroEstoque/',
                    method: 'POST',
                    data: {'analiseLojasFinanceiroEstoque': $scope.analiseInfo},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                }).then(function(event){     
                    $scope.transPend.visaoGeral = false;             
                    $scope.dadosAnalise= event.data;           
                    if($scope.dadosAnalise.analiseEstoqueFinanceiro.empresa == '999'){
                        $scope.divTableLojas = true;
                    }else{
                        $scope.divTableLoja = true;  
                    }
                    $scope.divApresenta = true;                    
                }).catch(function(err){       
                    console.log(err)        
                    $scope.transPend.visaoGeral = false;                    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 61');   
                    };                     
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };            
        };      
    };
    
});

