app.controller('estoqueController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[22]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };    
    
   
    $scope.filtroPesquisa = {
        'radioButton': 1,
        'checkBox': true
    };
    
    $scope.estoqueDados = [];
    $scope.grupoInfo = [];
    $scope.produtoInfo = [];
    $scope.divFornecedor = false;
    $scope.grupoDiv = false;
    $scope.produtoDiv = false;
    $scope.divProduto = false;
    $scope.divGrupo = false;  
   
    
    //==========  VARIAVEIS PARA TABELAS DINAMICAS ==========//
    $scope.contagemFornecedor = 15;   
    
    $scope.selecaoFornecedor ={
        selectedOption: {id: '15', name: '15'},
        availableOptions: [
            {id:'15', name:'15'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterFornecedor = function(data){
        $scope.contagemFornecedor = data.id;   
    }; 
    
    $scope.contagemGrupo = 10;   
    
    $scope.selecaoGrupo ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterGrupo = function(data){
        $scope.contagemGrupo = data.id;   
    }; 
    
    $scope.contagemProduto = 10;   
    
    $scope.selecaoProduto ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterProduto = function(data){
        $scope.contagemProduto = data.id;   
    }; 
    
    //========== POST LOGISTICA - FORNECEDOR  ==========// 
    $scope.estoque = function(){
        $scope.divFornecedor = false;  
        $scope.produtoDiv = false;
        $scope.grupoDiv = false;        
        $scope.estoqueDados = [];
        $scope.contagemFornecedor = 15; 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'estoque/',
            method: 'POST',
            data: {'estoque': $scope.filtroPesquisa},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){                  
            $scope.estoqueDados  = event.data;             
            $scope.divFornecedor = true;
            $scope.grupoDiv = true;      
            $scope.transPend.visaoGeral = false;                         
        }).catch(function(err){  
            console.log(err) 
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 51');
            };                      
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };           
    };  
    
    //========== POST LOGISTICA - GRUPO ==========// 
    $scope.grupoEstoque = function(codigo,fornecedor){
        $scope.infoGrupo = {
            'dropShipping': $scope.filtroPesquisa.checkBox,           
            'codFornecedor': codigo,
            'fornecedor': fornecedor
        }
        $scope.grupoInfo  = [];
        $scope.produtoInfo = [];
        $scope.divGrupo = false;
        $scope.divProduto = false;
        $scope.contagemGrupo = 10; 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'grupoEstoque/',
            method: 'POST',
            data: {'grupoEstoque': $scope.infoGrupo},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){ 
            $scope.transPend.visaoGeral = false;                  
            $scope.grupoInfo = event.data;
            $scope.divGrupo = true;            
        }).catch(function(err){ 
            console.log(err)  
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 51.1');   
            };                    
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };
    
    //========== POST LOGISTICA - PRODUTO  ==========// 
    $scope.produtoEstoque = function(codigo, grupo){
        $scope.infoProduto ={
            'dropShipping': $scope.filtroPesquisa.checkBox,
            'radioButton': $scope.filtroPesquisa.radioButton,                     
            'codigoGrupo': codigo,
            'grupo': grupo
        }
        $scope.produtoInfo = [];
        $scope.divProduto = false; 
        $scope.contagemProduto = 10;         
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'produtoEstoque/',
            method: 'POST',
            data: {'produtoEstoque': $scope.infoProduto},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){                  
            $scope.produtoInfo  = event.data;           
            $('#modalGrupoProd').trigger('click');          
            
            $scope.transPend.visaoGeral = false;
        }).catch(function(err){   
            console.log(err);
            $scope.transPend.visaoGeral = false;            
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 51.2');    
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    }; 
    
    //========== DIV PARA ESCONDER PRODUTO -> GRUPO  ==========// 
    $scope.divGrupoProduto = function(){
        if($scope.divProduto == true){
            $scope.divProduto = false;
            $scope.divGrupo = true;
        };
    };
    
    //========== FECHAR MODAL E RESETAR VARIAVEIS GRUPO - > PRODUTO  ==========// 
    $scope.close = function(){
        $scope.produtoInfo = [];       
        $scope.divProduto = false;     
        $scope.contagemFornecedor = 15; 
        $scope.contagemGrupo = 10; 
        $scope.contagemProduto = 10;  
    };
      
});

