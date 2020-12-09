app.controller('cadastroProdutoController', function($scope, $http,growl,Upload){

    if (!$scope.permissoes[36]){
        window.location = "LOGIN/login.html";
    };

    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    }; 

    //==========  VARIAVEIS GLOBAIS ==========//
    $scope.divVisualizar = false;
    $scope.divVisualizarProduto = false;
    $scope.divCadastro = false;   
    $scope.divCadastroProduto = false;   
    $scope.botaoVolta = false;
    $scope.esconderBotao = true;
    $scope.InativarProdutos =[];
    $scope.editarCadastro = [];
    $scope.inativar = [];   
    $scope.progressoFornecedor = 0; 
    $scope.progressoProdutos = 0;
    $scope.textoSelecione = 'Selecione o Arquivo'
    $scope.dadosCadastroFornecedor = {
        usuario: $scope.login.usuario,
        local:$scope.path,
        fornecedor: '',
        file: '',  
    };
    $scope.dadosCadastroProduto = {
        usuario: $scope.login.usuario,
        local: $scope.path,
        nomeProduto: '',      
        fileGeral: '',       
        fileKV: '',
        kv: 'N',
        fileFicha: '',
        ficha: 'N',
        fileVideo: '',  
        video: 'N',
        id:''    
    };
    
    //==========  POST PARA PESQUISA DA FORNECEDOR ==========//
    $scope.pesquisaFornecedor = function(value,id){
        $scope.infoPesquisa = {           
            value: value,
            id: id
        };   
      
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'pesquisaFornecedor/',
                method: 'POST',
                data: {'pesquisaFornecedor': $scope.infoPesquisa},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;
                var infoFornecedor  = event.data.marca;
                /* EDITAR */
                if(value == 'E'){                                      
                    $scope.editarCadastro = infoFornecedor.dados;  
                    $('#modalEditarCadastro').trigger('click');
                }
                /* INATIVAR */
                else if(value == 'S' || value == 'N' ){                    
                    $scope.inativar = infoFornecedor.dados;                 
                    $scope.inativar.status = value;
                    $('#modalInativarFornecedor').trigger('click')
                   
                }else{
                    if(infoFornecedor.error == true){
                        growl.warning('<b>ATENÇÃO!</b><br> Não existe Fornecedor(a) cadastrado(a).');  
                        $scope.divVisualizar = false;
                        $scope.divCadastro = true;
                    }else{
                        $scope.infoFornecedor = infoFornecedor.dados;
                        $scope.divVisualizar = true;
                        $scope.divCadastro = false;
                    }; 
                };                                                         
            }).catch(function(err){
                console.log(err)
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:84');  
                };                                   
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };                        
    };

    //==========  CHAMADA DE FUNÇÃO ==========//
    $scope.pesquisaFornecedor('','');
  
    //========== CAPTAÇÃO DE DADOS PARA CADASTRAR O FORNECEDOR ==========// 
    $scope.cadastroFornecedor = function() {
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            if ($scope.formCadastro.file.$valid && $scope.file) {
                $scope.dadosCadastroFornecedor.file = $scope.file; 
                $scope.file = '';             
                $scope.uploadCadastro();
            }else{               
                $scope.uploadCadastro();    
            }
        }else{

        };
    };

    //==========  POST PARA CADASTRO DO FORNECEDOR ==========//
    $scope.uploadCadastro = function () {
        Upload.upload({
            url: $scope.baseApi +'cadastroFornecedor/',
            data: $scope.dadosCadastroFornecedor,
            headers: {
                'Authorization': $scope.login.token 
            }
        }).then(function(event) {            
            $scope.transPend.visaoGeral = false;           
            if (event.data.error == true){
                growl.warning('<b>ATENÇÃO!</b><br>O fornecedor ' + $scope.dadosCadastroFornecedor.fornecedor + ' já existe!');
                $scope.progressoFornecedor = 0;  
            }else{
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Fornecedor cadastrado!');                
                    $scope.pesquisaFornecedor('','');
                    $scope.dadosCadastroFornecedor = [];
                    $scope.divVisualizar = true;
                    $scope.divCadastro = false;
                    $scope.progressoFornecedor = 0;                           
                }else{              
                    growl.warning('<b>ATENÇÃO!</b><br>Fornecedor não cadastrado!');
                }; 
            };       
        },function(err) {
            $scope.transPend.visaoGeral = false;   
            console.log(err);
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:85');  
            };        
        },function (evt) {            
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressoFornecedor = progressPercentage;
        });
    };

    //========== CAPTAÇÃO DE DADOS PARA EDITAR O FORNECEDOR ==========// 
    $scope.editarFornecedor = function(){
        $scope.editarCadastro.usuario = $scope.login.usuario;  
        $scope.editarCadastro.local = $scope.path;
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            if ($scope.formEditar.file.$valid && $scope.file){
                $scope.editarCadastro.caminhoLogo = $scope.file;  
                $scope.file = '';            
                $scope.uploadEditar();
            }else{               
                $scope.uploadEditar();
            }
        }else{

        };
    };

    //==========  POST PARA EDITAR DO FORNECEDOR ==========//
    $scope.uploadEditar = function () {
        Upload.upload({
            url: $scope.baseApi +'editarFornecedor/',
            data: $scope.editarCadastro,
            headers: {
                'Authorization': $scope.login.token 
            }
        }).then(function(event) {          
            $scope.transPend.visaoGeral = false;         
            if(event.status == 200){
                growl.success('<b>SUCESSO!</b><br>Fornecedor editado!');                
                $scope.pesquisaFornecedor('','');
                $('#myModalEditarCadastro').modal('hide'); 
                $scope.editarCadastro = []; 
                $scope.progressoFornecedor = 0;                  
            }else{
                growl.warning('<b>ATENÇÃO!</b><br>Fornecedor não foi editado!');                             
            };       
        },function(err) {
            $scope.transPend.visaoGeral = false;  
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:86');  
            };        
        },function (evt) {           
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressoFornecedor = progressPercentage;      
        });
    };

    //==========  POST PARA ATIVAR E INATIVAR O FORNECEDOR ==========//
    $scope.inativarFornecedor = function(id){
        if($scope.inativar.status == 'N'){
            $scope.inativar.status = 'S'
        }else if($scope.inativar.status == 'S'){
            $scope.inativar.status = 'N'
        }       
        $scope.infoInativacao = {
            status: $scope.inativar.status,
            usuario: $scope.login.usuario,
            id: id            
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'inativarFornecedor/',
                method: 'POST',
                data: {'inativarFornecedor': $scope.infoInativacao},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;              
                if(event.status == 200){
                    growl.success('<b>SUCESSO!</b><br>Fornecedor inativado!');                
                    $scope.pesquisaFornecedor('','');
                    $('#myModalInativarFornecedor').modal('hide'); 
                    $scope.editarCadastro = [];               
                }else{
                    growl.warning('<b>ATENÇÃO!</b><br>Fornecedor não foi inativado!');                             
                };                                                
            }).catch(function(err){    
                console.log(err);           
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:87');   
                }                                  
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };       
    }; 

    //==========  POST PARA PESQUISA PRODUTOS DO FORNECEDOR ==========//
    $scope.pesquisarFornProdutos = function(id, value,fornecedor){
        $scope.infoProdutos = {
            value: value,
            id: id
        };      
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'pesquisarFornProdutos/',
                method: 'POST',
                data: {'pesquisarFornProdutos': $scope.infoProdutos},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token                
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;   
                var infoProdutos = event.data.produtos;   
                if(fornecedor != ''){
                    $scope.fornecedor = fornecedor; 
                    $scope.pesquisaId = id;    
                }            
                if(value == 'E'){
                    $scope.editarCadastroProduto = infoProdutos.data;                   
                    $('#modalEditarCadastroProduto').trigger('click');
                }else if(value == 'S' || value == 'N'){
                    $scope.InativarProdutos = infoProdutos.data;
                    $scope.InativarProdutos.status = value;                   
                    $('#modalInativarProduto').trigger('click'); 
                    
                }else{   
                    if(infoProdutos.error == true){                        
                        growl.warning('<b>ATENÇÃO!</b><br>O fornecedor não contém produtos cadastrado'); 
                        $scope.dadosCadastroProduto.id = id; 
                        $scope.divVisualizarProduto = false;
                        $scope.divVisualizar = false;
                        $scope.divCadastroProduto = true;   
                    }else{     
                                        
                        $scope.infoProdutosForn = infoProdutos.data;                        
                        $scope.divVisualizarProduto = true;
                        $scope.divVisualizar = false;
                        $scope.divCadastroProduto = false;   
                    }  
                }                                              
            }).catch(function(err){
                console.log(err)
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:88'); 
                };                 
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };       
    };

    //========== CAPTAÇÃO DE DADOS PARA CADASTRAR O PRODUTO ==========// 
    $scope.cadastroProdutos = function() {
        
        if ($scope.formCadastroProd.fileGeral.$valid && $scope.fileGeral) {
            $scope.dadosCadastroProduto.fileGeral = $scope.fileGeral;       
        }

        if ($scope.formCadastroProd.fileKV.$valid && $scope.fileKV) {
            $scope.dadosCadastroProduto.fileKV = $scope.fileKV;
            $scope.dadosCadastroProduto.kv = 'S'
        }

        if ($scope.formCadastroProd.fileFicha.$valid && $scope.fileFicha) {
            $scope.dadosCadastroProduto.fileFicha = $scope.fileFicha;
            $scope.dadosCadastroProduto.ficha = 'S'
        }

        if ($scope.formCadastroProd.fileVideo.$valid && $scope.fileVideo) {
            $scope.dadosCadastroProduto.fileVideo = $scope.fileVideo;
            $scope.dadosCadastroProduto.video = 'S'
        }
        $scope.uploadCadastroProdutos();
    };

    //==========  POST PARA CADASTRO DO FORNECEDOR -> PRODUTO ==========//
    $scope.uploadCadastroProdutos = function () {
        Upload.upload({
            url: $scope.baseApi +'cadastroFornecedorProdutos/',
            data: $scope.dadosCadastroProduto,
            headers: {
                'Authorization': $scope.login.token 
            }
        }).then(function(event) {          
            $scope.transPend.visaoGeral = false;
            if(event.status == 200){
                growl.success('<b>SUCESSO!</b><br>Produto cadastrado!');
                $scope.divCadastro = false;   
                $scope.divCadastroProduto = false;   
                $scope.pesquisarFornProdutos($scope.dadosCadastroProduto.id,'','')      
                $scope.progressoProdutos = 0; 
                $scope.limparUpload();    
                $scope.dadosCadastroProduto = {
                    usuario: $scope.login.usuario,
                    local: $scope.path,
                    nomeProduto: '',      
                    fileGeral: '',       
                    fileKV: '',
                    kv: 'N',
                    fileFicha: '',
                    ficha: 'N',
                    fileVideo: '',  
                    video: 'N',
                    id:''    
                };
                                                 
            }else{              
                growl.warning('<b>ATENÇÃO!</b><br>Produto não cadastrado!');
            };        
        },function(err) {
            console.log(err)
            $scope.transPend.visaoGeral = false;  
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:89');  
            };                    
        },function (evt) {            
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressoProdutos = progressPercentage;          
        });
    };

    //========== CAPTAÇÃO DE DADOS PARA EDITAR O PRODUTO ==========//
    $scope.editarProdutos = function(){
        $scope.editarCadastroProduto.usuario = $scope.login.usuario; 
        $scope.editarCadastroProduto.local = $scope.path;  
        $scope.editarCadastroProduto.ficha = 'N';
        $scope.editarCadastroProduto.video = 'N'; 
        $scope.editarCadastroProduto.geral = 'N'; 
        $scope.editarCadastroProduto.kv = 'N';                   
        if ($scope.formEditarProd.fileGeral.$valid && $scope.fileGeral) {
            $scope.editarCadastroProduto.caminhoGeral = $scope.fileGeral;    
            $scope.editarCadastroProduto.geral = 'S'   
        }

        if ($scope.formEditarProd.fileKV.$valid && $scope.fileKV) {
            $scope.editarCadastroProduto.caminhoKV = $scope.fileKV;
            $scope.editarCadastroProduto.kv = 'S'
        }

        if ($scope.formEditarProd.fileFicha.$valid && $scope.fileFicha) {
            $scope.editarCadastroProduto.caminhoFicha = $scope.fileFicha;
            $scope.editarCadastroProduto.ficha = 'S'
        }

        if ($scope.formEditarProd.fileVideo.$valid && $scope.fileVideo) {
            $scope.editarCadastroProduto.caminhoVideo = $scope.fileVideo;
            $scope.editarCadastroProduto.video = 'S'
        }
        $scope.uploadEditarProdutos();
    };

    //==========  POST PARA EDITAR DO FORNECEDOR -> PRODUTOS ==========//
    $scope.uploadEditarProdutos = function () {
        Upload.upload({
            url: $scope.baseApi +'editarFornecedorProdutos/',
            data: $scope.editarCadastroProduto,
            headers: {
                'Authorization': $scope.login.token 
            }
        }).then(function(event) {          
            $scope.transPend.visaoGeral = false;
            if(event.status == 200){
                growl.success('<b>SUCESSO!</b><br>Produto editado!');
                $scope.divCadastro = false;   
                $scope.divCadastroProduto = false;
                $scope.limparUpload();               
                $scope.progressoProdutos = 0;   
                $scope.pesquisarFornProdutos($scope.pesquisaId,'',$scope.fornecedor) 
                $scope.editarCadastroProduto = []  
                $('#myModalEditarCadastroProduto').modal('hide');                     
            }else{              
                growl.warning('<b>ATENÇÃO!</b><br>Produto não editado!');
            };        
        },function(err) {
            console.log(err)
            $scope.transPend.visaoGeral = false;   
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
            }else{
                growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:90');  
            };        
        },function (evt) {      
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressoProdutos = progressPercentage;
        });
    };

    //==========  POST PARA ATIVAR E INATIVAR O PRODUTO DO FORNECEDOR ==========//
    $scope.inativarProdutos = function(id){
        if($scope.InativarProdutos.status == 'N'){
            $scope.InativarProdutos.status = 'S'
        }else if($scope.InativarProdutos.status == 'S'){
            $scope.InativarProdutos.status = 'N'
        }        
        $scope.infoInativacaoProd = {
            status: $scope.InativarProdutos.status,
            usuario: $scope.login.usuario,
            id: id            
        };            
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http
            ({
                url: $scope.baseApi +'inativarProdutos/',
                method: 'POST',
                data: {'inativarProdutos': $scope.infoInativacaoProd},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }
            }).then(function(event){
                $scope.transPend.visaoGeral = false;              
                if(event.status == 200){
                    if($scope.InativarProdutos.status == 'S'){
                        growl.success('<b>SUCESSO!</b><br>Produto inativado!'); 
                    }else{
                        growl.success('<b>SUCESSO!</b><br>Produto ativado!'); 
                    };                                  
                    $scope.pesquisarFornProdutos($scope.pesquisaId,'','');
                    $('#myModalInativarProduto').modal('hide'); 
                    $scope.InativarProdutos = [];               
                }else{
                    growl.warning('<b>ATENÇÃO!</b><br>Produto não foi inativado!');                             
                };                                                
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR!</b><br> Erro de conexeão - ID:91');  
                };                   
            });                 
        }else {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
        };
    };

    //==========  FUNÇÃO PARA LIMPAR AS VARIAVEIS FILES ==========//
    $scope.limparUpload = function(){
        $scope.fileGeral = '';
        $scope.fileKV = '';
        $scope.fileFicha = '';
        $scope.fileVideo = '';
    }

    //==========  MENU DO CADASTRO ==========//
    $scope.menu = function(value,fornecedor,id){
        
        if(value ==  1){           
            $scope.dadosCadastroFornecedor = {
                usuario: $scope.login.usuario,
                local:$scope.path,
                fornecedor: '',
                file: '',  
            };        
         
            $scope.botaoVolta = true;

            $scope.divVisualizar = false; 
            $scope.divVisualizarProduto = false;

            $scope.divCadastro = true;   
            $scope.divCadastroProduto = false;           
        }else if(value == 2){    
            $scope.limparUpload();       
            $scope.botaoVolta = false;  

            $scope.divVisualizar = true;
            $scope.divVisualizarProduto = false;

            $scope.divCadastro = false;   
            $scope.divCadastroProduto = false; 
        }else if(value == 3){
            $scope.divVisualizarProduto = false;
            $scope.divVisualizar = true;

            $scope.divCadastro = false;   
            $scope.divCadastroProduto = false; 
        }else if(value == 4){
            $scope.fornecedor = fornecedor;
            $scope.dadosCadastroProduto.id = id
            $scope.botaoVolta = true;
            $scope.divVisualizarProduto = false;
            $scope.divVisualizar = false;
            $scope.divCadastro = false;   
            $scope.divCadastroProduto = true; 
        }else if(value == 5){
            $scope.botaoVolta = true;
            $scope.esconderBotao = true;
            $scope.esconderBotao = false;
            $scope.divVisualizarProduto = false;
            $scope.divVisualizar = false;
            $scope.divCadastro = false;   
            $scope.divCadastroProduto = true;   
            $scope.dadosCadastroProduto.id = id; 
        }else if(value == 6){
            $scope.esconderBotao = true;
            $scope.botaoVolta = false;
            $scope.divVisualizarProduto = true;
            $scope.divVisualizar = false;
            $scope.divCadastro = false;   
            $scope.divCadastroProduto = false; 
            $scope.editarCadastroProduto = []  
        };
        
        
    };

});

