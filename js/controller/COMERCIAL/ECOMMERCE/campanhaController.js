app.controller('campanhaController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[29]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    //==========  ARRAY'S GLOBAIS ==========//    
    $scope.infoCampanha = [];  

    //========== MENU P/ VISUALIZAR PESQUISA DA CAMPANHA ==========//
    $scope.divVisualizarCampanha = false;

    //========== MENU P/ VISUALIZAR TELA DE CADASTRO DA CAMPANHA ==========//
    $scope.divCadastroCampanha = false;

    //========== MENU P/ VISUALIZAR BOTÃO VOLTAR CAMPANHA ==========//
    $scope.divVoltarVisualizarCampanha = false;

    //========== MENU P/ VISUALIZAR PRODUTOS CADASTRADOS NA CAMPANHA ==========//
    $scope.divVisualizarCampanhaProd = false;

    //========== MENU P/ VISUALIZAR TELA DE CADASTRO DE PRODUTO DA CAMPANHA ==========//
    $scope.divCadastroCampanhaProd = false;

    //========== MENU P/ VISUALIZAR FORMULARIO DE CADASTRO PRODUTO CAMPANHA ==========//
    $scope.divFormCampanhaCadastro = false;

    //========== FUNÇÃO PARA CRIAÇÃO DO INPUT DATE ==========//
    var data = new Date();
    var primeiroDiaCampanha = new Date(data.getFullYear(), data.getMonth(), 1)
    var ultimoDiaCampanha = new Date(data.getFullYear(), data.getMonth()+ 1, 0)

    //========== JSON PARA CAPTAR DADOS P/ CADASTRAR CAMPANHA ==========//
    $scope.cadastroCampanha = {
        dataInicial: primeiroDiaCampanha,
        dataFim: ultimoDiaCampanha,
        nome: $scope.login.nome,       
        nomeCampanha: '',      
        observacao: '',   
        canal: ''         
    };

    //========== JSON PARA CAPTAR DADOS P/ CADASTRAR CAMPANHA ==========//
    $scope.editarCampanha = {
        nome: $scope.login.nome,
        nomeCampanha: '',         
        dataInicial: '',
        observacao: '', 
        dataFim: '',
        canal: '',
        id: ''        
    };

    //========== JSON PARA CAPTAR DADOS P/ CADASTRAR PRODUTO NA CAMPANHA ==========//
    $scope.cadastrarProdCampanha = {
        usuario: $scope.login.nome,
        precoPraticado: '',       
        porcReducao: '',
        idCampanha: '',
        observacao: '',
        descricao: '',
        subgrupo: '',        
        custoSC: '',
        custoES: '',    
        marca: '',
        grupo: '',
        canal:'',
        sku:''     
    };

    //========== CAPTAR O CÓDIGO PRODUTO DIGITADO PELO USUÁRIO ==========//
    $scope.codigoProduto = '';

    //========== CADASTRO PRODUTO - CAPTAR O CANAL PELO SELECT ==========//
    $scope.canal = '';

    //========== CADASTRO EDITAR O PRODUTO - CAPTAR O CANAL PELO SELECT ==========//
    $scope.canalProduto = '';

    //========== ARRAY PRODUTO CAMPANHA GLOBAL ==========//
    $scope.infoProdutoCampanha = [];

    //========== FUNÇÃO P/ PESQUISA CAMPANHA ==========//
    $scope.pesquisaCampanhaEcommerce = function(value,nome){
        $scope.divVisualizarCampanhaProd = false;                           
        $scope.divCadastroCampanhaProd = false;                        
        $scope.divFormCampanhaCadastro = false;   
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if(value == 'N'){
                $scope.infoCampanha = [];
                $scope.filtro.validador = value;
                $scope.filtro.nome = nome;
            }else{
                $scope.infoCampanhaEditar = [];
                $scope.filtro.validador = value;
                $scope.filtro.nome = nome;
            }
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'pesquisaCampanhaEcommerce/',
                    method: 'POST',
                    data: {'pesquisaCampanhaEcommerce': $scope.filtro},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                }).then(function(event){ 
                    $scope.transPend.visaoGeral = false;  
                    if(value == 'N'){
                        $scope.infoCampanha = event.data;                         
                        if($scope.infoCampanha.pesquisaCampanha.error == true){
                            $scope.divCadastroCampanha = true;
                            growl.warning('<b>ATENÇÃO</b><br> Não existe campanha cadastrada');
                        }else{
                            $scope.divVisualizarCampanha = true;
                            $scope.divCadastroCampanha = false;
                                               
                        };   
                    }else{
                        $scope.infoCampanhaEditar = event.data;
                        //========== CRIAR DATA PARA CALENDARIO HTML ==========//                      
                        var dateInicio =  $scope.convercaoDataParaJS($scope.infoCampanhaEditar.pesquisaCampanha.data.inicioCampanha)
                        var dateFim = $scope.convercaoDataParaJS( $scope.infoCampanhaEditar.pesquisaCampanha.data.fimCampanha)    
                     
                        $scope.listaCanal.selectedOption =  {id: $scope.infoCampanhaEditar.pesquisaCampanha.data.canal, name: $scope.infoCampanhaEditar.pesquisaCampanha.data.canal };
                        $scope.listaCanal.availableOptions[0] = {id: $scope.infoCampanhaEditar.pesquisaCampanha.data.canal, name:$scope.infoCampanhaEditar.pesquisaCampanha.data.canal};   
                        
                        for( i = 0; i < $scope.listaCanal.availableOptions.length; i++){
                            if($scope.listaCanal.availableOptions[i].name == $scope.infoCampanhaEditar.pesquisaCampanha.data.canal && $scope.listaCanal.availableOptions[i].id  != $scope.infoCampanhaEditar.pesquisaCampanha.data.canal){
                                $scope.listaCanal.availableOptions.splice(i,2);                               
                            };
                        };

                        $scope.editarCampanha = {
                            nomeCampanha: $scope.infoCampanhaEditar.pesquisaCampanha.data.nomeCampanha,      
                            observacao: $scope.infoCampanhaEditar.pesquisaCampanha.data.observacao, 
                            id: $scope.infoCampanhaEditar.pesquisaCampanha.data.id,
                            nome: $scope.login.nome,
                            dataInicial: dateInicio,
                            dataFim: dateFim                                      
                        }; 
                        $('#modalEditar').trigger('click');              
                    };                                
                }).catch(function(err){   
                    console.log(err);                    
                    $scope.transPend.visaoGeral = false; 
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.10');  
                    };      
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválidas(s)');              
        };
    };

    //========== FUNÇÃO P/ CADASTRAR A CAMPANHA ==========//
    $scope.cadastrarCampanhaEcommerce = function(){
        if($scope.isValidDate($scope.cadastroCampanha.dataInicial) && $scope.isValidDate($scope.cadastroCampanha.dataFim)){  
            if($scope.cadastroCampanha.dataFim < $scope.cadastroCampanha.dataInicial) {
                growl.warning('<b>ATENÇÃO</b><br> Data fim da campanha não pode ser menor que a de início');   
            }else{
                $scope.cadastroCampanha.canal = $scope.canal;
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'cadastrarCampanhaEcommerce/',
                        method: 'POST',
                        data: {'cadastrarCampanhaEcommerce': $scope.cadastroCampanha},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }      
                    }).then(function(event){   
                        $scope.transPend.visaoGeral = false;                   
                        if(event.status == 200){                           
                            growl.success('<b>SUCESSO</b><br> Campanha cadastrada com sucesso!');
                        }else{
                            growl.error('<b>ERROR</b><br> Campanha não cadastrada, tente novamente!');
                        };                                       
                        $scope.pesquisaCampanhaEcommerce('N','');                                    
                    }).catch(function(err){   
                        console.log(err);
                        $scope.transPend.visaoGeral = false;
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.11');   
                        };       
                    })  
                }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };                 
            };            
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválidas(s)!');              
        };
    };

    //========== FUNÇÃO P/ EDITAR A CAMPANHA ==========//
    $scope.editarCampanhaEcommerce = function(){
        if($scope.isValidDate($scope.editarCampanha.dataFim) && $scope.isValidDate($scope.editarCampanha.dataFim)){  
            if($scope.editarCampanha.dataFim < $scope.editarCampanha.dataInicial){
                growl.warning('<b>ATENÇÃO</b><br> Data fim da campanha não pode ser menor que a de início');  
            }else{
                $scope.editarCampanha.canal = $scope.canal;
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'editarCampanhaEcommerce/',
                        method: 'POST',
                        data: {'editarCampanhaEcommerce': $scope.editarCampanha},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }      
                    }).then(function(event){       
                        $scope.transPend.visaoGeral = false;               
                        if(event.status == 200){                           
                            growl.success('<b>SUCESSO</b><br> Campanha alterada com sucesso!');
                            $('#myModalEditar').modal('hide');
                            $scope.editarCampanha = {
                                nome: $scope.login.nome,
                                nomeCampanha: '',         
                                dataInicial: '',
                                observacao: '', 
                                dataFim: '',
                                canal: '',
                                id: ''         
                            }; 
                            $scope.transPend.visaoGeral = false;     
                            $scope.pesquisaVendedorEcommerce();                       
                        }else{
                            growl.error('<b>ERROR</b><br> Campanha não alterada, tente novamente!');
                        };
                        $scope.pesquisaCampanhaEcommerce('N');                                    
                    }).catch(function(err){   
                        console.log(err);
                        $scope.transPend.visaoGeral = false;     
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.12');   
                        };  
                    })  
                }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };  
            };    
        }else{
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválidas(s)!');  
        };  
    };

    //========== FUNÇÃO P/ PESQUISA PRODUTOS GERAL DA CAMPANHA ==========//
    $scope.pesquisaCampanhaProdEcommerce = function(id,idCampanha,nome,value){
        /* VALUE 
            '' = PESQUISA TODOS PRODUTOS DA CAMPANHA
            'S' = PESQUISA APENAS 1 PRODUTO DA CAMPANHA PARA EDIÇÃO
            'N' = CADASTRO PRODUTO CAMPANHA
        */      
        $scope.divFormCampanhaCadastro = false; 
        $scope.infoCampanhaProduto = [];
        $scope.infoProdutoCampanha = [];
        $scope.produtoCampanha = [];        
        $scope.codigoProduto = ''; 
        $scope.canalProduto = '';  
        $scope.idCampanha = {
            idCampanha: idCampanha,  
            nome: nome,
            id: id                   
        };          
        $scope.canal = '';   
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaCampanhaProdEcommerce/',
                method: 'POST',
                data: {'pesquisaCampanhaProdEcommerce': $scope.idCampanha},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){                    
                $scope.transPend.visaoGeral = false;               
                if(event.data.produtosCampanha.error == true && value !='S'){
                    growl.warning('<b>ATENÇÃO</b><br> Não existe produto cadastrado na campanha!');                    
                    $scope.divCadastroCampanhaProd = true;  
                    $scope.divVisualizarCampanhaProd = false; 
                }else if(value == 'S'){
                    $scope.infoProdutoCampanha = event.data;                  
                    
                    $scope.infoProdutoCampanha.produtosCampanha.data.nome = $scope.login.nome;   
                    $('#modalEditarProduto').trigger('click');  
                    $scope.divCadastroCampanhaProd = false;  
                    $scope.divVisualizarCampanhaProd = false; 
                }else if(value == 'N'){
                    $scope.divCadastroCampanhaProd = true;  
                    $scope.divVisualizarCampanhaProd = false; 
                }else{   
                    $scope.nomeCampanha =  $scope.idCampanha.nome ;              
                    $scope.infoCampanhaProduto = event.data ;                  
                    $scope.divVisualizarCampanhaProd = true;   
                    $scope.divCadastroCampanhaProd = false;               
                };                                       
            }).catch(function(err){  
                console.log(err);                
                $scope.transPend.visaoGeral = false;   
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.13');  
                };    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };          
    };

    //========== FUNÇÃO P/ PESQUISA DADOS DA TABELA PRODUTO ==========//
    $scope.produtoCampanhaEcommerce = function(){
        $scope.produtoCampanha = [];
        if ($scope.codigoProduto != ''){
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'produtoCampanhaEcommerce/',
                    method: 'POST',
                    data: {'produtoCampanhaEcommerce': $scope.codigoProduto},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                }).then(function(event){       
                    $scope.transPend.visaoGeral = false;                
                    $scope.produtoCampanha = event.data;
                    if($scope.produtoCampanha.pesquisaProduto.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> S.K.U digitada não localizada, tente novamente!');    
                    }else{
                        $scope.divFormCampanhaCadastro = true;                      
                    };                                                              
                }).catch(function(err){   
                    console.log(err);
                    $scope.transPend.visaoGeral = false;   
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.14'); 
                    };    
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };    
        }else{
            growl.warning('<b>ATENÇÃO</b><br> Digite a S.K.U do produto!');
        }
       
    };

    //========== FUNÇÃO P/ CADASTRAR PRODUTOS NA CAMPANHA ==========//
    $scope.cadastroProdCampanhaEcommerce = function(){
        $scope.cadastrarProdCampanha.descricao = $scope.produtoCampanha.pesquisaProduto.data.descricao;
        $scope.cadastrarProdCampanha.custoSC = $scope.produtoCampanha.pesquisaProduto.data.custoSC;
        $scope.cadastrarProdCampanha.custoES = $scope.produtoCampanha.pesquisaProduto.data.custoES;
        $scope.cadastrarProdCampanha.marca =  $scope.produtoCampanha.pesquisaProduto.data.marca;        
        $scope.cadastrarProdCampanha.grupo = $scope.produtoCampanha.pesquisaProduto.data.grupo;
        $scope.cadastrarProdCampanha.sku = $scope.produtoCampanha.pesquisaProduto.data.codigo;
        $scope.cadastrarProdCampanha.idCampanha = $scope.idCampanha.idCampanha;      
        if ($scope.cadastrarProdCampanha.custoSC == 0 || $scope.cadastrarProdCampanha.custoES ==0 ){
            growl.warning('<b>ATENÇÃO</b><br>O Custo Santa Catarina ou Espírito Santo, está zerado!'); 
        }else{
            if($scope.cadastrarProdCampanha.precoPraticado == 0 || $scope.cadastrarProdCampanha.porcReducao == 0){
                growl.warning('<b>ATENÇÃO</b><br> Preço Pratica ou Porcentagem Redução, não preenchido!'); 
            }else{            
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'cadastroProdCampanhaEcommerce/',
                        method: 'POST',
                        data: {'cadastroProdCampanhaEcommerce': $scope.cadastrarProdCampanha},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }     
                    }).then(function(event){    
                        $scope.transPend.visaoGeral = false;                  
                        if(event.status == 200){                           
                            growl.success('<b>SUCESSO</b><br> Produto cadastrado com sucesso!');   
                            $scope.codigoProduto = '';
                            $scope.cadastrarProdCampanha = {
                                usuario: $scope.login.nome,
                                precoPraticado: '',       
                                porcReducao: '',
                                idCampanha: '',
                                observacao: '',
                                descricao: '',
                                subgrupo: '',        
                                custoSC: '',
                                custoES: '',    
                                marca: '',
                                grupo: '',
                                canal:'',
                                sku:''     
                            };
                        
                            $scope.divFormCampanhaCadastro = false;
                            $scope.divVisualizarCampanhaProd = true;                     
                        }else{
                            growl.error('<b>ERROR</b><br> Produto não cadastrado, tente novamente!');
                        };  
                        $scope.pesquisaCampanhaProdEcommerce('',$scope.idCampanha.idCampanha, $scope.idCampanha.nome,'');                          
                    }).catch(function(err){   
                        console.log(err);
                        $scope.transPend.visaoGeral = false;  
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.15'); 
                        };    
                    })  
                }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };  
            };  
        };       
    };
    
    //========== FUNÇÃO P/ EDITAR CADASTRO DO PRODUTO ==========//
    $scope.editarProdCampanhaEcommerce = function(){ 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'editarProdCampanhaEcommerce/',
                method: 'POST',
                data: {'editarProdCampanhaEcommerce': $scope.infoProdutoCampanha.produtosCampanha.data},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                    
                if(event.status == 200){                           
                    growl.success('<b>SUCESSO</b><br> Produto alterado com sucesso!');   
                    $('#myModalEditarProduto').modal('hide');                   
                }else{
                    growl.error('<b>ERROR</b><br> Produto não alterado, tente novamente!');
                }; 
                $scope.pesquisaCampanhaProdEcommerce('',$scope.infoProdutoCampanha.produtosCampanha.data.idCampanha, $scope.nomeCampanha,'');                          
            }).catch(function(err){   
                console.log(err);
                $scope.transPend.visaoGeral = false;   
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.16');  
                };    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
        
    };

    //========== FUNÇÃO P/ PESQUISA VENDEDOR ATACADO ==========//
    $scope.pesquisaVendedorEcommerce = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaVendedorEcommerce/',
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }              
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                var listVendedores = event.data.listaVendedores       
                $scope.listaCanal = {
                    selectedOption: listVendedores[0],
                    availableOptions: listVendedores
                };                                                  
            }).catch(function(err){   
                console.log(err);
                $scope.transPend.visaoGeral = false;     
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 3.17'); 
                };   
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    $scope.pesquisaVendedorEcommerce();

    //========== FUNÇÃO PARA ESCONDER E APARECER MENUS ==========//
    $scope.menus = function(value){
        //========== CADASTRO CAMPANHA ==========//
        if(value == 1){
            $scope.pesquisaVendedorEcommerce(); 
            $scope.divVisualizarCampanha = false;
            $scope.divCadastroCampanha = true;
            $scope.divVoltarVisualizar = true;            
            $scope.divVisualizarCampanhaProd = false;
            $scope.divCadastroCampanhaProd = false;   
            $scope.divFormCampanhaCadastro = false;
        }else if(value == 2){
            $scope.divVisualizarCampanha = true;
            $scope.divCadastroCampanha = false;
            $scope.divVoltarVisualizar = false
        };
    };

    //========== FUNÇÃO PARA CAPTAR VALOR DO CAMPO CANAL  DO CADASTRO PRODUTO ==========//
    $scope.filtroCanal = function(nome){
        $scope.canal= nome;  
    };

    //========== FUNÇÃO PARA CAPTAR VALOR DO CAMPO CANAL  DO CADASTRO PRODUTO ==========//
    $scope.filtroCanalProduto = function(nome){
        $scope.infoProdutoCampanha.produtosCampanha.data.canal = nome;  
    };

});

