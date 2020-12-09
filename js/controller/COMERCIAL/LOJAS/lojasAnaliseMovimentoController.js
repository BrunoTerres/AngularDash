app.controller('lojasAnaliseMovimentoController', function($scope, $http,$timeout,growl){
   
    if (!$scope.permissoes[10]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
        
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    $scope.divShow = false;
    //========== VARIAVEIS GLOBAIS ==========//
    $scope.empresaSelecao = '';
    $scope.VisLojaEstoqueojasAnaliseMovimento = [];
    $scope.menu = false;
    $scope.divTodas = false;
    $scope.divLoja = false;
      
    //========== SELECT HTML EMPRESA  ==========//
    $scope.selecaoEmpresa ={
        selectedOption: {id: 'EP', name: 'Empresa'},
        availableOptions: [
            {id:'EP', name:'Selecione a empresa'},
            {id:'999', name:'Todas as lojas'},
            {id:'006', name:'Itajaí Quiosque'},
            {id:'107', name:'Itajaí Loja'},
            {id:'106', name:'Balneário'},
            {id:'007', name:'Joinville'},
            {id:'104', name:'Blumenau'}, 
            {id:'105', name:'São José'}, 
            {id:'201', name:'Curitiba - Palladium'},
            {id:'202', name:'Curitiba - Jockey Plaza'},
        ]
    }; 
    
    $scope.filterEmpresa = function(data){
        $scope.empresaSelecao = data.id;  
        $scope.nomeEmpresa = data.name.toUpperCase();     
    };   
     
    //========== POST LOJA ESTOQUE  ==========//
    $scope.lojasAnaliseMovimento = function(){
        $scope.VisLojaEstoqueojasAnaliseMovimento = [];
        $scope.divTodas = false;
        $scope.divLoja = false;
        $scope.divShow = false;       
        
        $scope.infoAnalise = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,
            'empresa':  $scope.empresaSelecao            
        };
        if($scope.empresaSelecao  == '' ){            
            growl.warning('<b>ATENÇÃO</b><br> Selecione a empresa para pesquisa!');
        }else{
            if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'lojasAnaliseMovimento/',
                method: 'POST',
                data: {'lojasAnaliseMovimento': $scope.infoAnalise},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){
                $scope.transPend.visaoGeral = false; 
                $scope.VisLojaEstoqueojasAnaliseMovimento = event.data;                
                if($scope.VisLojaEstoqueojasAnaliseMovimento.error == true){
                    growl.warning('<b>ATENÇÃO</b><br> Não existe dados na data selecionada!'); 
                }else{             
                    if($scope.empresaSelecao == '999'){
                        $scope.divTodas = true;
                    }else{
                        $scope.divLoja = true;
                    };
                    $scope.Semaforo($scope.empresaSelecao);
                    $scope.divShow = true;
                    $scope.menu = true;                   
                };           
            }).catch(function(err){          
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 26'); 
                };     
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        };
    };      
    
    //========== SEMAFORO ==========//
    $scope.Semaforo = function(empresa){

        if(empresa == '999'){
            for (var i in $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento){
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].origem == 'NACIONAL'){
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc < 25){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc < 28){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'G'
                    }

                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr < 25){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr < 28){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'G'
                    }
                    
                } else {
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc < 30){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_sc < 33){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_sc = 'G'
                    }

                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr < 30){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem_pr < 33){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_pr = 'G'
                    }
                }
                
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_sc <= 0){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_sc = 'D'                
                } else 
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_sc < 10){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_sc = 'R'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_sc < 15){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_sc = 'Y'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_sc < 31){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_sc = 'G'                
                } else {
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_sc = 'A'                
                }

                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_pr <= 0){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_pr = 'D'                
                } else 
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_pr < 10){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_pr = 'R'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_pr < 15){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_pr = 'Y'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque_pr < 31){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_pr = 'G'                
                } else {
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est_pr = 'A'                
                }
            }     
        }

        else{
            for (var i in $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento){
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].origem == 'NACIONAL'){
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem < 25){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem < 28){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'G'
                    }
                    
                } else {
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem == 0){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'B'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem < 30){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'R'
                    } else
                    if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].margem < 33){
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'Y'
                    } else {
                        $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo = 'G'
                    }
                }
                
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque <= 0){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est = 'D'                
                } else 
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque < 10){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est = 'R'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque < 15){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est = 'Y'                
                } else
                if ($scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].dias_estoque < 31){
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est = 'G'                
                } else {
                    $scope.VisLojaEstoqueojasAnaliseMovimento.analise_movimento[i].semaforo_est = 'A'                
                }
            }     
        }; 
    };
    
    //========== FUNCÕES PARA CORES TABLE ==========//
    $scope.propertyName = 'codigo';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName){
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