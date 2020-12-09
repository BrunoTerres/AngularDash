app.controller('lojasGerentesController', function($scope, $http,growl){
       
    
    if (!$scope.permissoes[7]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
        
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    //==========  SHOW TOP 10 ==========//
    $scope.showTop10 = false;
    
    //==========  SHOW TABLE ==========//
    $scope.showTable = false; 
    
    //==========  VARIAVEIS LOJAS GERENTES ==========// 
    $scope.empresaLancamento = '';
    $scope.empresaSelecao = ''
    $scope.visLjfGerentes = {
        visaogeral : {
            total : 0,
            quantidade : 0,
            clientes : 0
        },
        visaogeralporloja : [
            {
                empresa: '006',
                cliente: 0,
                produto: 0,
                valor : 0
            },{
                empresa: '107',
                cliente: 0,
                produto: 0,
                valor : 0
            },{
                empresa: '106',
                cliente: 0,
                produto: 0,
                valor : 0
            },{
                empresa: '007',
                cliente: 0,
                produto: 0,
                valor : 0
            },{
                empresa: '104',
                cliente: 0,
                produto: 0,
                valor : 0
            },{
                empresa: '201',
                cliente: 0,
                produto: 0,
                valor : 0
            }
        ]
    };
    $scope.visLjfGerentesVendedorGrupo = [];
    $scope.visLjfGerentesVendedorFornecedor = [];
    $scope.visLjfGerentesVendedorProduto = [];    
    $scope.visLjfGerentesFornecedorGrupo = [];
    $scope.visLjfGerentesFornecedorVendedores = [];
    $scope.visLjfGerentesFornecedorProduto = [] ;
    $scope.visLjfGerentesGrupoFornecedor = [];
    $scope.visLjfGerentesGrupoVendedor = []; 
    $scope.visLjfGerentesGrupoProduto = [];
    $scope.visLjfGerentesMetasVendedor = []
 
    //==========  ESCOLHA EMPRESA - PERFIL ADM ==========//
    if($scope.login.idperfil == 48){
        $scope.selecaoEmpresa ={
             selectedOption: {id: 'EP', name: 'Empresa'},
             availableOptions: [
                {id:'EP', name:'Selecione a empresa'},               
                {id:'201', name:'Curitiba - Palladium'},  
                {id:'202', name:'Curitiba - Jockey Plaza'}, 
             ]
        };  
        
    }
    else{
        $scope.selecaoEmpresa ={
             selectedOption: {id: 'EP', name: 'Empresa'},
             availableOptions: [
                {id:'EP', name:'Selecione a empresa'},
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
        
    }
      
    $scope.filterEmpresa = function(data){    
        $scope.empresaSelecao = data.id;       
    };    
    
    //==========  VARIAVEIS REQUISICAO POST ==========// 
    $scope.infoFuncionario = {
        'idperfil':$scope.login.idperfil,
        'lancamentoEmpresa':$scope.login.lancamento_empresa,
        'empresaAdmin':$scope.empresaSelecao,
        'dataInicial': '',
        'dataFim':'',
        'codigo': '',
        'name': '',
        'y': ''          
    }; 

    $scope.infoFornecedor = {
        'idperfil':$scope.login.idperfil,
        'lancamentoEmpresa':$scope.login.lancamento_empresa,
        'empresaAdmin':'',
        'dataInicial': '',
        'dataFim': '',
        'codigo': '',
        'name': '',
        'y':''
        
            
    };   

    $scope.infoGrupo = {
        'idperfil':$scope.login.idperfil,
        'lancamentoEmpresa':$scope.login.lancamento_empresa,
        'empresaAdmin':'',
        'dataInicial': '',
        'dataFim': '',
        'codigo':'',
        'name':'',
        'y':''
        
    };  

    $scope.infoMeta = {  
        'idperfil':$scope.login.idperfil,
        'lancamentoEmpresa':$scope.login.lancamento_empresa,
        'empresaAdmin':'',
        'indiceExcel': 99,
        'dataInicial': '',
        'dataFim': '',
        'codigo':'',
        'nome': '',
        'meta': '',
        'venda':''
               
    }
    
    $scope.showFaturamentoLoja = false
    $scope.showEmpresa = false
    
    //========== BOOLEAN APRESENTA GRAFICOS ==========//  
    $scope.vendasPorVendedor = false;
    $scope.vendasPorFabricante = false;
    $scope.vendasPorGrupo = false;    
    $scope.metaVendedor = false;    
    $scope.metaSegmento = false;
    
    //==========  MODAL VENDEDOR ==========//  
    $scope.vendedorGrupo = false
    $scope.vendedorFornecedor = false
    
    //==========  MODAL FORNECEDOR ==========// 
    $scope.fornecedorGrupo = false
    $scope.fornecedorVendedor = false
    $scope.fornecedorProduto = false
    
    //==========  MODAL  GRUPO ==========//     
    $scope.grupoFornecedor = false
    $scope.grupoVendedor = false
    $scope.grupoProduto = false    
    
    //==========  APRESENTAR SELECEÇÃO EMPRESA GERENTES/ADMIN ==========//
    $scope.showSelecaoEmpresa = function(){
        if($scope.login.idperfil == 1 || $scope.login.idperfil == 23 ||  $scope.login.idperfil == 38 || $scope.login.idperfil == 48 || $scope.login.idperfil==49 || $scope.login.idperfil==63){
            $scope.showEmpresa = true
        }
        
    };
    $scope.showSelecaoEmpresa();

    $scope.divGeral = false;
        
    //==========  LOJA FISICA GERENTES - VALIDACAO ==========//
    $scope.ljfGerentes = function(){
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.login.idperfil == 1 || $scope.login.idperfil == 23 ||   $scope.login.idperfil == 38 || $scope.login.idperfil == 48 || $scope.login.idperfil ==49 || $scope.login.idperfil==63){
                if($scope.empresaSelecao ==''){
                    growl.warning('<b>ATENÇÃO</b><br> Selecione a empresa para pesquisa!');
                }else{                    
                    $scope.ljfGerentesRequisicao();
                }            
            }else{                    
                    $scope.ljfGerentesRequisicao();
            }    
        }else{
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        }
    }; 
    
    //==========  LOJA FISICA GERENTES - REQUISICAO ==========//
    $scope.ljfGerentesRequisicao = function(){
        $scope.lojasGeralPost = {
            'dataInicial':  $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,
            'lancamentoEmpresa': $scope.filtro.lancamentoEmpresa,
            'codigoVendedor': $scope.filtro.codigoVendedor,
            'superUsuario': $scope.filtro.superUsuario,
            'idperfil': $scope.filtro.idperfil,
            'empresaAdmin': $scope.empresaSelecao
        };
        $scope.divGeral = false;
        if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            method : 'POST',
            url : $scope.baseApi + 'ljfGerentes/',
            data : {'ljfGerentes': $scope.lojasGeralPost},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }    
        }).then(function(event){
            $scope.transPend.visaoGeral = false;  
            $scope.visLjfGerentes = event.data; 
            if($scope.visLjfGerentes.error == true){
                growl.warning('<b>ATENÇÃO</b><br> Não existe dados na data selecionada!'); 
            }else{               
                var aux = $scope.login.lancamento_empresa.toString().split(',')                    
                $scope.empresaLancamento = aux[0]                    
                $scope.atualizaGraficos();  
                $scope.showTable = true;
                $scope.divGeral = true;
            };       
        }).catch(function(err){  
            console.log(err);       
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 7'); 
            };     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };      
    }
      
    //==========  PESQUISA - VENDEDORES -> GRUPOS ==========//
    $scope.ljfVendedorGrupo = function(){
        if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVendedorGrupo/',
                method: 'POST',
                data: {'ljfVendedorGrupo': $scope.infoFuncionario},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }    
            }).then(function(event){
                $scope.transPend.visaoGeral = false; 
                $scope.visLjfGerentesVendedorGrupo = event.data;      
                $scope.showTable = true;
                $scope.vendedorGrupo = true;
                $('#modalVendedor').trigger('click');
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 8'); 
                };       
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //==========  PESQUISA - VENDEDORES -> GRUPOS -> FORNECEDORES  ==========// 
    $scope.ljfVendedorFornecedor = function(codigo, name, y){
        $scope.infoVendedorFornecedor = {
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'codigoVendedor': $scope.infoFuncionario.codigo,            
            'dataInicial': $scope.filtro.dataInicial,
            'empresaAdmin':$scope.empresaSelecao,
            'dataFim': $scope.filtro.dataFim,
            'idperfil':$scope.login.idperfil,          
            'codigoGrupo': codigo,
            'name': name,
            'y': y             
            
        }       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVendedorFornecedor/',
                method: 'POST',
                data: {'ljfVendedorFornecedor': $scope.infoVendedorFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;              
                $scope.visLjfGerentesVendedorFornecedor = event.data;          
                $scope.vendedorGrupo = false
                $scope.vendedorFornecedor = true             
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 9'); 
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //==========  PESQUISA - VENDEDORES -> GRUPOS -> FORNECEDORES -> PRODUTOS  ==========// 
    $scope.ljfVendedorProdutos = function(codigo,name){
        $scope.infoProduto = {
            'codigoGrupo': $scope.infoVendedorFornecedor.codigoGrupo,
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'codigoVendedor': $scope.infoFuncionario.codigo,
            'dataInicial': $scope.filtro.dataInicial,
            'empresaAdmin':$scope.empresaSelecao,           
            'dataFim': $scope.filtro.dataFim,
            'idperfil':$scope.login.idperfil,         
            'codigoFornecedor': codigo,
            'name':name,
        };       
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVendedorProdutos/',
                method: 'POST',
                data: {'ljfVendedorProdutos':  $scope.infoProduto},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                $scope.ljftblVendFor = false;
                $scope.ljftblForProd = true;
                $scope.visLjfGerentesVendedorProduto = event.data;                  
                $scope.codigoFornecedor = $scope.visLjfGerentesVendedorProduto.ljfVendedoresProdutos[0].codigoFornecedor              
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 10'); 
                };       
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };       
    };
    
    //==========  PESQUISA FORNECEDORES -> GRUPOS ==========// 
    $scope.ljfFornecedorGrupo = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfFornecedorGrupo/',
                method: 'POST',
                data: {'ljfFornecedorGrupo': $scope.infoFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;               
                $scope.visLjfGerentesFornecedorGrupo = event.data                   
                $scope.fornecedorGrupo = true
                $('#modalFornecedor').trigger('click');
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 11'); 
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    //==========  PESQUISA FORNECEDORES -> GRUPOS -> VENDEDORES  ==========// 
    $scope.ljfFornecedorVendedor = function(codigo,name,y){
        $scope.infoFornecedorGrupo = {
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'codigoFornecedor': $scope.infoFornecedor.codigo,
            'dataInicial': $scope.filtro.dataInicial,
            'empresaAdmin':$scope.empresaSelecao, 
            'dataFim': $scope.filtro.dataFim,
            'idperfil':$scope.login.idperfil,         
            'codigoGrupo': codigo,
            'name': name,
            'y': y            
        };      
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfFornecedorVendedor/',
                method: 'POST',
                data: {'ljfFornecedorVendedor':$scope.infoFornecedorGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;               
                $scope.visLjfGerentesFornecedorVendedores = event.data;           
                $scope.fornecedorVendedor = true;
                $scope.fornecedorGrupo = false;
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 12'); 
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        } 
       
    };
    
    //==========  PESQUISA FORNECEDORES -> GRUPOS -> VENDEDORES ->PRODUTO  ==========// 
    $scope.lfFornecedorProduto = function(codigo,name,y){
        $scope.infoFornecedorVendedor = {
            'codigoGrupo': $scope.infoFornecedorGrupo.codigoGrupo,
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'codigoFornecedor': $scope.infoFornecedor.codigo,
            'dataInicial': $scope.filtro.dataInicial,
            'empresaAdmin':$scope.empresaSelecao, 
            'dataFim': $scope.filtro.dataFim,
            'idperfil':$scope.login.idperfil,
            'codigoVendedor': codigo,
            'name': name,
            'y': y            
        }; 
        
         if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'lfFornecedorProduto/',
                method: 'POST',
                data: {'lfFornecedorProduto': $scope.infoFornecedorVendedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;              
                $scope.visLjfGerentesFornecedorProduto = event.data;
                $scope.fornecedorVendedor = false;
                $scope.fornecedorProduto = true;
            }).catch(function(err){            
                 console.log(err);  
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 13');  
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        } 
        
    };   
    
    //==========  PESQUISA GRUPOS -> FORNECEDORES ==========// 
    $scope.ljfGrupoFornecedor = function(){    
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfGrupoFornecedor/',
                method: 'POST',
                data: {'ljfGrupoFornecedor':  $scope.infoGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;              
                $scope.visLjfGerentesGrupoFornecedor = event.data;                 
                $scope.grupoFornecedor = true   
                $('#modalGrupo').trigger('click');
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 14');  
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //==========  PESQUISA GRUPOS -> FORNECEDORES -> VENDEDORES ==========// 
    $scope.ljfGruposVendedores = function(codigo, name, y){
        $scope.infoFornecedorGrupo = {           
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'dataInicial': $scope.filtro.dataInicial,
            'codigoGrupo':$scope.infoGrupo.codigo ,
            'empresaAdmin':$scope.empresaSelecao, 
            'idperfil':$scope.login.idperfil,
            'dataFim': $scope.filtro.dataFim,            
            'codigoFornecedor': codigo,
            'name': name,
            'y': y            
        }; 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfGruposVendedores/',
                method: 'POST',
                data: {'ljfGruposVendedores':  $scope.infoFornecedorGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                 
                $scope.visLjfGerentesGrupoVendedor = event.data;                 
                $scope.grupoFornecedor = false
                $scope.grupoVendedor = true              
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 15'); 
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }
    };
    
    //==========  PESQUISA GRUPOS -> FORNECEDORES -> VENDEDORES -> PRODUTO ==========// 
    $scope.ljfGrupoProduto = function(codigo,name,y){
        $scope.infoVendedorGrupo = {            
            'codigoFornecedor': $scope.infoFornecedorGrupo.codigoFornecedor,
            'lancamentoEmpresa':$scope.login.lancamento_empresa,
            'dataInicial': $scope.filtro.dataInicial,
            'codigoGrupo':$scope.infoGrupo.codigo,
            'empresaAdmin':$scope.empresaSelecao, 
            'dataFim': $scope.filtro.dataFim,
            'idperfil':$scope.login.idperfil,           
            'codigoVendedor': codigo,
            'name':name,
            'y':y           
        };        
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfGrupoProduto/',
                method: 'POST',
                data: {'ljfGrupoProduto':  $scope.infoVendedorGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                
                $scope.visLjfGerentesGrupoProduto = event.data;
                $scope.grupoVendedor = false;
                $scope.grupoProduto = true;               
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 16'); 
                };     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };     
    };
     
    //==========  PESQUISA META VENDEDOR ==========// 
    $scope.ljfMetaVendedor = function(){
        if($scope.infoMeta.indiceExcel == 99){
            growl.warning('<b>Atenção</b><br>Selecione o vendedor para ver a meta!');
            
        }else{
            if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfMetaVendedor/',
                method: 'POST',
                data: {'ljfMetaVendedor': $scope.infoMeta},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){
                $scope.transPend.visaoGeral = false; 
                $scope.visLjfGerentesMetasVendedor = event.data;                                        
                $scope.showTable = true;    
                $scope.infoMeta.indiceExcel = 99;
                $('#modalMeta').trigger('click');
                $scope.atualizaGraficoMeta();
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;     
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 17');  
                };  
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
            
        };
        
    }
  
    //==========  APRESENTAR MODAL - TABLE ==========// 
    $scope.tableGrupo = function(){
        
        //==========  SHOW TABLE VENDEDORES ==========// 
        if($scope.vendedorFornecedor == true){
            $scope.vendedorFornecedor = false;
            $scope.vendedorGrupo = true;
        };
        
        //==========  SHOW TABLE FORNECEDOR  ==========// 
        if($scope.fornecedorVendedor == true){
            $scope.fornecedorVendedor = false;
            $scope.fornecedorGrupo = true;
        };
        
        if($scope.fornecedorProduto == true){            
            $scope.fornecedorProduto = false;
            $scope.fornecedorVendedor = true;
        };        
        
        //==========  SHOW TABLE GRUPOS ==========// 
        if($scope.grupoVendedor == true){           
            $scope.grupoVendedor = false; 
            $scope.grupoFornecedor = true;
        };
        
        if($scope.grupoProduto== true  ){
            $scope.grupoProduto = false;
            $scope.grupoVendedor = true;     
        };
    };
    
    $scope.close = function(){
        
        //==========  MODAL VENDEDOR ==========//  
        $scope.vendedorGrupo = false
        $scope.vendedorFornecedor = false

        //==========  MODAL FORNECEDOR ==========// 
        $scope.fornecedorGrupo = false
        $scope.fornecedorVendedor = false
        $scope.fornecedorProduto = false

        //==========  MODAL  GRUPO ==========//     
        $scope.grupoFornecedor = false
        $scope.grupoVendedor = false
        $scope.grupoProduto = false 
    };
    
    //========== HIGH CHARTS ==========//
    Highcharts.setOptions({
        title: {
            style: {
                color: 'rgba(115,135,156,1)',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            style: {
                color: 'rgba(115,135,156,1)',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    style: {
                        color: 'rgba(115,135,156,1)'
                    }
                }
            },
            line: {
                dataLabels: {
                    style: {
                        color: 'rgba(115,135,156,1)'
                    }
                }
            },
            column: {
                dataLabels: {
                    style: {
                        color: 'rgba(115,135,156,1)'
                    }
                }
            },
            bar: {
                dataLabels: {
                    style: {
                        color: 'rgba(115,135,156,1)'
                    }
                }
            }
        },
        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'rgba(115,135,156,1)'
            },
            itemHoverStyle:{
                color: 'gray'
            }   
        }
    });
    
    /*========== INICIO ATUALIZA GRAFICOS ==========*/      
    $scope.atualizaGraficos = function(){
        
        /*========================= META VENDEDOR  =========================  */  
        Highcharts.chart('hcMetaVendedor', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'Metas por Vendedor' 
            },
            subtitle: {
                text: 'Venda: ' + ( $scope.visLjfGerentes.metaVendedor.leg_total).toLocaleString('pt-BR') + '   Meta: ' + ( $scope.visLjfGerentes.metaVendedor.leg_meta).toLocaleString('pt-BR') + ' - ' + Math.round(( $scope.visLjfGerentes.metaVendedor.leg_total * 100) /  $scope.visLjfGerentes.metaVendedor.leg_meta)+'%' 
            },
            xAxis: {
                categories:  $scope.visLjfGerentes.metaVendedor.vendedores            
            },
            yAxis: [{
                min: 0
            }, {
                title: {
                    text: 'Venda'
                },
                opposite: true
            }],
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
               
            series: [{
                
                    name: 'Venda',
                    color: 'rgba(165,170,217,1)',
                    data:  $scope.visLjfGerentes.metaVendedor.vl_total_positivados,                               
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        y: 12, // 12 pixels down from the top
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                        
                    },                 
                    events: {
                    click: function (event) {                         
                            $scope.infoMeta.indiceExcel = event.point.options.indiceExcel
                            $scope.infoMeta.empresaAdmin = parseInt($scope.empresaSelecao)
                            $scope.infoMeta.dataInicial = $scope.filtro.dataInicial
                            $scope.infoMeta.dataFim = $scope.filtro.dataFim
                            $scope.infoMeta.codigo = event.point.options.codigo
                            $scope.infoMeta.nome = event.point.options.nome
                            $scope.infoMeta.meta = event.point.options.meta
                            $scope.infoMeta.venda = event.point.options.y                         
                        }
                    }                
                }, {
                    name: 'Meta',
                    color: 'rgba(126,86,134,.9)',
                    data:  $scope.visLjfGerentes.metaVendedor.metas,
                    pointPadding: 0.45,
                    pointPlacement: -0.2,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        y: 12, // 12 pixels down from the top
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }  
                    },
                    events: {
                        click: function (event) { 
                            $scope.infoMeta.indiceExcel = event.point.options.indiceExcel
                            $scope.infoMeta.empresaAdmin = parseInt($scope.empresaSelecao)
                            $scope.infoMeta.dataInicial = $scope.filtro.dataInicial
                            $scope.infoMeta.dataFim = $scope.filtro.dataFim
                            $scope.infoMeta.codigo = event.point.options.codigo
                            $scope.infoMeta.nome = event.point.options.nome
                            $scope.infoMeta.meta = event.point.options.y
                            $scope.infoMeta.venda = event.point.options.totalVendido                      
                        }
                    }
            }],
        });
        
        /*========================= VENDAS POR VENDEDOR =========================*/  
        Highcharts.chart('hcVendasPorVendedor', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Vendedor'
            },
            subtitle: {
                text: $scope.visLjfGerentes.empresa  
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            //color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Vendas R$',
                //data: [{name: "teste", y: 90.2}, {name:"teste2", y: 120}]
                data:   $scope.visLjfGerentes.vendaporvendedores,
                events: {
                    click: function (event) { 
                        $scope.infoFuncionario.dataInicial = $scope.filtro.dataInicial
                        $scope.infoFuncionario.dataFim = $scope.filtro.dataFim
                        $scope.infoFuncionario.codigo = event.point.options.codigo
                        $scope.infoFuncionario.name = event.point.name                         
                        $scope.infoFuncionario.y = event.point.options.y                         
                       
                    }
                }
            }]
        });        
        
        /*========================= VENDAS POR FABRICANTE  =========================*/  
        Highcharts.chart('hcVendasPorFabricante', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400               
            },
            title: {
                text: 'Vendas Por Fabricante'
            },
            subtitle: {
                text: $scope.visLjfGerentes.empresa  
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            //color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Vendas R$',
                //data: [{name: "teste", y: 90.2}, {name:"teste2", y: 120}]
                data: $scope.visLjfGerentes.vendasporfabricante,
                events: {
                    click: function (event) {                          
                        $scope.infoFornecedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoFornecedor.empresaAdmin = $scope.empresaSelecao
                        $scope.infoFornecedor.dataFim = $scope.filtro.dataFim
                        $scope.infoFornecedor.codigo = event.point.options.codigoFabricante
                        $scope.infoFornecedor.name = event.point.options.name
                        $scope.infoFornecedor.y = event.point.options.y                       
                    }
                }
            }],
             drilldown: {
        series: []
    }
        });      
     
        /*========================= VENDAS POR GRUPO  =========================*/          
        Highcharts.chart('hcVendasPorGrupo', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo'
            },
            subtitle: {
                text: $scope.visLjfGerentes.empresa   
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            //color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Vendas R$',
                //data: [{name: "teste", y: 90.2}, {name:"teste2", y: 120}]
                data: $scope.visLjfGerentes.vendasporgrupo,
                events: {
                    click: function (event) {   
                        $scope.infoGrupo.dataInicial = $scope.filtro.dataInicial
                        $scope.infoGrupo.empresaAdmin = $scope.empresaSelecao
                        $scope.infoGrupo.dataFim = $scope.filtro.dataFim
                        $scope.infoGrupo.codigo = event.point.options.codigoGrupo
                        $scope.infoGrupo.name = event.point.options.name
                        $scope.infoGrupo.y = event.point.options.y                                           
                    }
                }
            }]
        }); 
    };    
    
    /*========== INICIO ATUALIZA GRAFICO META ==========*/  
    $scope.atualizaGraficoMeta = function(){
        $scope.metaSegmento = true
        /*========================= META VENDEDOR  ========================= */   
        Highcharts.chart('hcMetaSegmentoVendedor', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'Metas por Vendedor' 
            },
            subtitle: {
                text: $scope.infoMeta.nome + ' - Venda: ' + ($scope.infoMeta.venda).toLocaleString('pt-BR') + '   Meta: ' + ( $scope.infoMeta.meta).toLocaleString('pt-BR') + ' - ' + Math.round(( $scope.infoMeta.venda * 100) /  $scope.infoMeta.meta)+'%' 
            },
            xAxis: {
                categories:  $scope.visLjfGerentesMetasVendedor.metaporsegmento.segmento            
            },
            yAxis: [{
                min: 0
            }, {
                title: {
                    text: 'Venda'
                },
                opposite: true
            }],
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
               
            series: [{
                
                    name: 'Venda',
                    color: 'rgba(165,170,217,1)',
                    data:  $scope.visLjfGerentesMetasVendedor.metaporsegmento.vl_total_positivados,                               
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        y: 12, // 12 pixels down from the top
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                        
                    }                               
                }, {
                    name: 'Meta',
                    color: 'rgba(126,86,134,.9)',
                    data: $scope.visLjfGerentesMetasVendedor.metaporsegmento.metas,
                    pointPadding: 0.45,
                    pointPlacement: -0.2,
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        y: 12, // 12 pixels down from the top
                        style: {
                            fontSize: '11px',
                            fontFamily: 'Verdana, sans-serif'
                        }  
                    }
            }],
        });
        
    };
    
});