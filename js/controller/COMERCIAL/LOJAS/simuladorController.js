app.controller('simuladorController', function($scope, $http, $timeout, cfpLoadingBar, $location, $anchorScroll,growl){
    
   
    $scope.baseApi = window.sessionStorage.getItem('baseApi'); 
    $scope.baseApi = 'http://200.150.114.227:7094/Datasnap/rest/TServerMethods/';
    //$scope.baseApi = 'http://192.168.0.162:5000/Datasnap/rest/TServerMethods/';

    if (!$scope.permissoes[6]){
       window.location = "LOGIN/login.html";
    }

    $scope.gototop();      
    
    //Empresas
    $scope.hideEmpObs = true;
    $scope.filtroEmpresa = function(){
        $scope.empresas = [];
        $scope.propertyName = 'empresa';
        $scope.obj = {
            tipo: 'consulta',
            dado: 'empresa',
            array: []
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };      
        growl.info('<b>Aguarde</b><br>Solicitando Dados ao Servidor!'); 
        $http($scope.objPostEmpresa
            ).then(function(event){           
            $scope.empresas = event.data;
            }).catch(function(err){
                growl.error('<b>SERVIDOR</b><br> Erro de conxeão');               
                console.log(error);
        });
    };
    
    $scope.gravarEmpresa = function(){
        $scope.obj = {
            tipo: 'insert',
            dado: 'empresa',
            array: $scope.empresas.empresas
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                growl.success('<b>ATENÇÃO</b><br> Parametros Por Empresa Gravado Com Sucesso!');               
                //$scope.filtroEmpresa();
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                
                console.log(error);
        });
    };
    //Fim Empresas
    
    //Grupo  
    $scope.hideGrpObs = true;
    $scope.filtroGrupo = function(codEmp, descEmp){
        $scope.grupos = []
        $scope.codEmpView = codEmp;
        $scope.descEmpView = descEmp;
        $scope.propertyName = 'grupo';
        $scope.obj = {
            tipo: 'consulta',
            dado: 'grupo',
            empresa: codEmp, 
            array: []
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                $scope.grupos = event.data;
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');             
                console.log(error);
        });
    };
    
    $scope.gravarGrupo = function(codEmp){
        $scope.obj = {
            tipo: 'insert',
            dado: 'grupo',
            empresa: codEmp,
            array: $scope.grupos.grupos
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                growl.success('<b>ATENÇÃO</b><br> Parametros Por Grupo Gravado Com Sucesso!');
                $scope.filtroGrupo(codEmp);
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                 
                console.log(error);
        });
    };
    //Fim Grupo
    
    //Produto
    $scope.hidePrdObs = true;
    $scope.filtroProduto = function(codEmp, descEmp){
        $scope.produtos = []
        $scope.codEmpView = codEmp;
        $scope.descEmpView = descEmp;
        $scope.propertyName = 'produto';
        growl.info('<b>Aguarde</b><br>Solicitando Dados ao Servidor!'); 
        $scope.obj = {
            tipo: 'consulta',
            dado: 'produto',
            empresa: codEmp, 
            array: []
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                $scope.produtos = event.data;               
                growl.success('<b>RETORNO!</b><br> Foi Encontrado ' + $scope.produtos.length + ' Produtos Com Estoque!');                
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                 
                console.log(error);
        });
    };
    
    $scope.gravarProduto = function(codEmp){        
        $scope.obj = {
            tipo: 'insert',
            dado: 'produto',
            empresa: codEmp,
            array: $scope.produtos.produtos
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'}
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                growl.success('<b>ATENÇÃO</b><br> Parametros Por Produto Gravado Com Sucesso!');                
                $scope.filtroProduto(codEmp);
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');             
                console.log(error);
        });
    };
    //Fim Produto
    
    //Fabricante
    $scope.filtroFabricante = function(codEmp, descEmp){
        $scope.fabricantes = [];
        $scope.codEmpView = codEmp;
        $scope.descEmpView = descEmp;
        $scope.propertyName = 'fabricante';
        growl.info('<b>Aguarde</b><br>Solicitando Dados ao Servidor!'); 
        $scope.obj = {
            tipo: 'consulta',
            dado: 'fabricante',
            empresa: codEmp, 
            array: []
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                $scope.fabricantes = event.data;                
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                 
                console.log(error);
        });
    };
    
    $scope.gravarFabricante = function(codEmp){
        $scope.obj = {
            tipo: 'insert',
            dado: 'fabricante',
            empresa: codEmp,
            array: $scope.fabricantes.fabricantes
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                growl.info('<b>Aguarde</b><br>Solicitando Dados ao Servidor!'); 
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');         
                console.log(error);
        });
    };
    //Fim Fabricante
    
    //Select Empresa
    $scope.selectEmp = function(){
        $scope.obj = {
            tipo: 'parametro',
            dado: 'empresa',
            usuario: $scope.login.usuario,
            array: []
        };
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };        
        $http($scope.objPostEmpresa
            ).then(function(event){                
                $scope.data = {
                     selectedOption: event.data.selEmp[0],
                     availableOptions: event.data.selEmp
                };                
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');               
                console.log(error);
        });
    };    
    $scope.selectEmp();
    $scope.dataSelect = function(){
        if ($scope.data.selectedOption.id != 'X'){
            $scope.filtroDados($scope.data.selectedOption.id)    
        }
    }
    //Fim Select Empresa
    //Filtrar Dados
    $scope.filtroDados = function(codEmp){
        $scope.propertyName = 'produto';
        $scope.retProd = [];
        $scope.obj = {
            tipo: 'parametro',
            dado: 'produtos',
            empresa: codEmp,
            usuario: $scope.login.usuario,
            array: []
        }; 
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                $scope.retProd = event.data;                  
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                
                console.log(error);
        });    
    }
    //Fim Filtrar Dados
        
    $scope.attObjConsProd = function(vProd, vDesc, vGrupo, vCusto, vVenda, vVendaOrig, vObs, codEmp){
        $scope.objConsProd = {};
        $scope.obj = {
            tipo: 'parametro',
            dado: 'preco',
            empresa: codEmp,
            usuario: $scope.login.usuario,
            produto: vProd,
            descricao: vDesc,
            grupo: vGrupo,
            custo: vCusto,
            venda: vVenda,
            venda_original: vVendaOrig,
            obs: vObs,
            usuario: $scope.login.usuario,
            idperfil: $scope.login.idperfil
        };
       
        $scope.objPostEmpresa = {
            method : 'POST',
            url : $scope.baseApi + 'semaforo',
            data : $scope.obj,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        };
        $http($scope.objPostEmpresa
            ).then(function(event){
                $scope.objConsProd = event.data;    
            }).catch(function(error){
                growl.error('<b>SERVIDOR</b><br> Erro de conexão');                
                console.log(error);
        }); 
    };
    
    //Loading Bar
    $scope.start = function() {
      cfpLoadingBar.start();
    };

    $scope.complete = function () {
      cfpLoadingBar.complete();
    }
    
    // fake the initial load so first time users can see it right away:
    $scope.start();
    $scope.fakeIntro = true;
    $timeout(function() {
      $scope.complete();
      $scope.fakeIntro = false;
    }, 750);
    //End Loagind Bar 
    
    //Order By
    $scope.propertyName = '';
    $scope.reverse = false;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

});