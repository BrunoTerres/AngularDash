app.controller('ordemDeCompraClienteController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[32]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== FUNÇÃO PARA CRIAÇÃO DO INPUT DATE ==========//
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1)
    var ultimoDia = new Date(data.getFullYear(), data.getMonth()+ 1, 0)

    //========== MENU PARA APRESENTAÇÃO OC ==========//
    $scope.botaoVoltaCadastroOC = false;
    $scope.divVisualizarOc = false;
    $scope.divCadastroOc = false;

    //========== MENU PARA APRESENTAÇÃO PRODUTOS DA OC ==========//
    $scope.divVisualizarOcPRod = false;
    $scope.divCadastroOcProd = false;
    $scope.divFormProdOC = false;
    $scope.botaoVisualizarProd = false;
    
    $scope.cadastroOc = {
        usuario: $scope.login.usuario,
        dataInicial: primeiroDia,
        dataFim: ultimoDia,        
    };
    
    $scope.codigoProduto = ''
    
    //========== POST PARA PESQUISA OC CLIENTE ==========// 
    $scope.pesquisaOcCLienteAtacado = function(id,value){
        //========== MENU PARA APRESENTAÇÃO OC ==========//
        $scope.botaoVoltaCadastroOC = false;
        $scope.divVisualizarOc = false;
        $scope.divCadastroOc = false;

        //========== MENU PARA APRESENTAÇÃO PRODUTOS DA OC ==========//
        $scope.divVisualizarOcPRod = false;
        $scope.divCadastroOcProd = false;
        $scope.divFormProdOC = false;
        $scope.botaoVisualizarProd = false;
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
           if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                if (value == 'E'){
                    $scope.filtro.id = id;
                }else{
                    $scope.filtro.id = 'x';
                };
            $http({
                url: $scope.baseApi + 'pesquisaOcCLienteAtacado/',
                method: 'POST',
                data: {'pesquisaOcCLienteAtacado': $scope.filtro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){                
                $scope.transPend.visaoGeral = false;
                if(value == 'E'){
                    $scope.filtro.id = 'x';
                    var editarOc = event.data.ordemDeCompra.data;                
                    editarOc.dataInicial = $scope.convertDateJavaScript(editarOc.dataInicial,'I');                    
                    editarOc.dataFim = $scope.convertDateJavaScript(editarOc.dataFim,'');     
                    $scope.editarOc = editarOc;                    
                    $('#modalEditarOC').trigger('click'); 
                }else{
                    var oc = event.data.ordemDeCompra;
                    if(oc.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Não existe ordem de compra cadastrada')
                        $scope.divVisualizarOc = false;
                        $scope.divCadastroOc = true;                       
                    }else{
                        $scope.divVisualizarOc = true;
                        $scope.divCadastroOc = false;                       
                        $scope.oc = oc.data;   
                    };
                };     
            }).catch(function(err){   
                console.log(err);        
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 69');        
                };                        
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }; 
        }else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        };
    };  

    //========== POST PARA CADASTRAR OC CLIENTE ==========// 
    $scope.cadastroOcClienteAtacado = function(){
        if($scope.cadastroOc.total == 0){
            growl.warning('<b>ATENÇÃO</b><br> Informe o valor total da OC')
        }else{
            if($scope.isValidDate($scope.cadastroOc.dataInicial) && $scope.isValidDate($scope.cadastroOc.dataFim)){
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                 $http({
                    url: $scope.baseApi + 'cadastroOcClienteAtacado/',
                    method: 'POST',
                    data: {'cadastroOcClienteAtacado': $scope.cadastroOc},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }    
                 }).then(function(event){                
                    $scope.transPend.visaoGeral = false;
                    var infoOc = event.data; 
                    if (infoOc.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Já Existe Uma OC Do Número: ' + $scope.cadastroOc.numeroOC); 
                    }else if(infoOc.error == false){
                        growl.success('<b>SUCESSO</b><br> OC Cliente Cadastrada!');
                        $scope.pesquisaOcCLienteAtacado('','');
                    }

                    if(event.status != 200){
                        growl.error('<b>ERROR</b><br> OC Cliente não cadastrada, tente novamente!');
                    };              
                   
                 }).catch(function(err){ 
                    console.log(err);           
                    $scope.transPend.visaoGeral = false;                   
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 70');        
                    };                       
                 })  
                 }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                 }; 
             }else {
                growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
             }; 
        };       
    }; 

    //========== POST PARA EDITAR OC CLIENTE ==========// 
    $scope.editarOcClienteAtacado = function(){
        if($scope.editarOc.total == 0){
            growl.warning('<b>ATENÇÃO</b><br> Informe o valor total da OC')
        }else{
            if($scope.isValidDate($scope.editarOc.dataInicial) && $scope.isValidDate($scope.editarOc.dataFim)){
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $scope.editarOc.usuario = $scope.login.usuario;
                 $http({
                    url: $scope.baseApi + 'editarOcClienteAtacado/',
                    method: 'POST',
                    data: {'editarOcClienteAtacado': $scope.editarOc},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                 }).then(function(event){                
                    $scope.transPend.visaoGeral = false;              
                    if(event.status == 200){
                        growl.success('<b>SUCESSO</b><br> OC Cliente Editada!');                   
                        $('#myModalEditarOC').modal('hide');
                        $scope.pesquisaOcCLienteAtacado('','');
                    }else{
                        growl.warning('<b>ATENÇÃO</b><br> OC Cliente Não Editada!');
                    };           
                 }).catch(function(err){  
                    console.log(err);          
                    $scope.transPend.visaoGeral = false;
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 71');       
                    };                     
                 })  
                 }else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                 }; 
            }else {
                growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
            };
        };
    };

    //========== CHAMADA DE MODAL PARA  EXCLUSAO OS CLIENTE ==========// 
    $scope.modalExcluirOcCliente = function(id,numeroOC){
        $scope.excluirOSCliente = {
            usuario: $scope.login.usuario,
            numeroOC: numeroOC,           
            id: id,            
        };
        $('#modalExcluirOc').trigger('click'); 
    };

    //========== POST PARA EXCLUIR OC CLIENTE ==========// 
    $scope.excluirOcClienteAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $scope.editarOc.usuario = $scope.login.usuario;
            $http({
                url: $scope.baseApi + 'excluirOcClienteAtacado/',
                method: 'POST',
                data: {'excluirOcClienteAtacado': $scope.excluirOSCliente},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){                
                $scope.transPend.visaoGeral = false;              
                if(event.status == 200){
                    growl.success('<b>SUCESSO</b><br> OC Cliente Excluída!');                   
                    $('#myModalExcluirOc').modal('hide');
                    $scope.pesquisaOcCLienteAtacado('','');
                }else{
                    growl.warning('<b>ATENÇÃO</b><br> OC Cliente Não Excluída!');
                };           
            }).catch(function(err){   
                console.log(err);         
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 72');      
                };                      
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    }; 

    //========== POST PARA PESQUISA O PRODUTO PARA CADASTRO NA OC ==========// 
    $scope.pesquisaProdutoOCAtacado = function(){
        if($scope.codigoProduto == ''){
            growl.warning('<b>ATENÇÃO</b><br> Digite o código do produto para pesquisa');    
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;      
                $http({
                    url: $scope.baseApi + 'pesquisaProdutoOCAtacado/',
                    method: 'POST',
                    data: {'pesquisaProdutoOCAtacado': $scope.codigoProduto},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }      
                }).then(function(event){                
                    $scope.transPend.visaoGeral = false;  
                    var infoProduto = event.data;
                    if(infoProduto.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Código do produto não encontrado!');    
                    }else{
                        $scope.cadastrarProdutoOc = infoProduto.data;                      
                        $scope.divFormProdOC = true;
                    };                                                 
                }).catch(function(err){ 
                    console.log(err);           
                    $scope.transPend.visaoGeral = false;                    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 73');     
                    };                       
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        };
        
    };

    //========== POST PARA PESQUISA PRODUTOS OC CLIENTE ==========// 
    $scope.pesquisaOcClienteProdAtacado = function(value,id,numeroOC, nomeCliente,quantidade,total){
        $scope.produtoInfo = {
            nomeCliente: nomeCliente,            
            numeroOC:numeroOC,            
            value: value,
            id: id
        };       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;         
            $http({
                url: $scope.baseApi + 'pesquisaOcClienteProdAtacado/',
                method: 'POST',
                data: {'pesquisaOcClienteProdAtacado': $scope.produtoInfo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){
                $scope.transPend.visaoGeral = false;  
                if(value == 'ED'){
                    $scope.editarProdutosOC = event.data.produtosOcCliente.data;
                    $('#modalEditarProdOC').trigger('click'); 
                }else{
                    if(value == ''){
                        $scope.infoProd = {                            
                            nomeCliente: nomeCliente, 
                            quantidade: quantidade,           
                            numeroOC:numeroOC,  
                            total: total,          
                            value: value,
                            id: id
                        };
                    };                    
                    var produtoOC = event.data.produtosOcCliente;
                    if(produtoOC.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Não existe produto cadastrado na ordem de compra');  
                        $scope.divVisualizarOcPRod = false;  
                        $scope.divCadastroOcProd = true;
                        $scope.divVisualizarOc = false;                    
                    }else{                   
                        $scope.divVisualizarOcPRod = true;  
                        $scope.divCadastroOcProd = false;
                        $scope.divVisualizarOc = false;
                        $scope.produtoOc = produtoOC.data; 
                        $scope.totalizadores = { quantidade: produtoOC.qtdeTotal,totalValor:produtoOC.valorTotal}
                                   
                    }; 
                };                  
            }).catch(function(err){     
                console.log(err);      
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 74');     
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };

    //========== POST PARA CADASTRAR PRODUTOS CLIENTE ==========// 
    $scope.cadastrarOcClienteProdAtacado = function(){
        if($scope.cadastrarProdutoOc.valorTotal == 0){
            growl.warning('<b>ATENÇÃO</b><br> Informe o valor total do produto')
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){                
                $scope.cadastrarProdutoOc.usuario = $scope.login.usuario; 
                $scope.cadastrarProdutoOc.id = $scope.infoProd.id;
                $scope.transPend.visaoGeral = true;                  
                $http({
                    url: $scope.baseApi + 'cadastrarOcClienteProdAtacado/',
                    method: 'POST',
                    data: {'cadastrarOcClienteProdAtacado': $scope.cadastrarProdutoOc},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }       
                }).then(function(event){                
                    $scope.transPend.visaoGeral = false;  
                    var prod = event.data.error         
                    if(prod.error == true){
                        growl.warning(prod.msg);  
                    }else{
                        growl.success(prod.msg);  
                        $scope.divFormProdOC = false;
                        $scope.pesquisaOcClienteProdAtacado('', $scope.infoProd.id, $scope.infoProd.numeroOC, $scope.infoProd.nomeCliente, $scope.infoProd.quantidade, $scope.infoProd.total);
                    };
                    if(event.status != 200){                         
                        growl.warning('<b>ERROR</b><br> Produto não cadastrado, tente novamente!');         
                    };                  
                                                 
                }).catch(function(err){
                    console.log(err);           
                    $scope.transPend.visaoGeral = false;                     
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 75');    
                    };                     
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };         
        };
        
    };

    //========== POST PARA EDITAR PRODUTOS CLIENTE ==========// 
    $scope.editarOcClienteProdAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){               
            $scope.transPend.visaoGeral = true;   
            $scope.editarProdutosOC.usuario = $scope.login.usuario;               
            $http({
                url: $scope.baseApi + 'editarOcClienteProdAtacado/',
                method: 'POST',
                data: {'editarOcClienteProdAtacado': $scope.editarProdutosOC},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){                
                $scope.transPend.visaoGeral = false;  
                var infoEdicao = event.data.error;
                console.log(infoEdicao)   
                if(infoEdicao.error == true){
                    growl.warning(infoEdicao.msg);  
                }else{
                    growl.success(infoEdicao.msg);  
                    $scope.divFormProdOC = false;                 
                    $scope.pesquisaOcClienteProdAtacado('', $scope.infoProd.id, $scope.infoProd.numeroOC, $scope.infoProd.nomeCliente, $scope.infoProd.quantidade, $scope.infoProd.total); 
                    $('#myModalEditarProdOC').modal('hide');           
                };
                if(event.status != 200){                         
                    growl.warning('<b>ERROR</b><br> Produto não cadastrado, tente novamente!');         
                };           
                                             
            }).catch(function(err){     
                console.log(err);       
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 76');     
                };                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };

    //========== CHAMADA DE MODAL PARA  EXCLUSAO OC PRODUTO CLIENTE ==========// 
    $scope.modalExcluirOcProdCliente = function(id, produto){
        $scope.excluirOCProdCliente = {
            usuario: $scope.login.usuario,
            produto: produto,           
            id: id,            
        };
        $('#modalExcluirOcProd').trigger('click');       
    };

    //========== POST PARA EXCLUIR OC PRODUTO CLIENTE ==========// 
    $scope.excluirOcProdClienteAtacado = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $scope.editarOc.usuario = $scope.login.usuario;
            $http({
                url: $scope.baseApi + 'excluirOcProdClienteAtacado/',
                method: 'POST',
                data: {'excluirOcProdClienteAtacado': $scope.excluirOCProdCliente},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){                
                $scope.transPend.visaoGeral = false;         
                if(event.status == 200){
                    growl.success('<b>SUCESSO</b><br> Produto Excluído!');                   
                    $('#myModalExcluirOcProd').modal('hide');
                    $scope.pesquisaOcClienteProdAtacado('', $scope.infoProd.id, $scope.infoProd.numeroOC, $scope.infoProd.nomeCliente, $scope.infoProd.quantidade, $scope.infoProd.total);    
                }else{
                    growl.warning('<b>ATENÇÃO</b><br> Produto Não Excluído!');
                };    
            }).catch(function(err){   
                console.log(err);         
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 77');    
                };                        
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    $scope.menus = function(value){
        if(value == 1){
            $scope.divCadastroOc = true;
            $scope.divVisualizarOc = false; 
            $scope.botaoVoltaCadastroOC = true;
        }
        else if(value == 2){
            $scope.divCadastroOc = false;
            $scope.divVisualizarOc = true; 
            $scope.botaoVoltaCadastroOC = false;
            $scope.cadastroOc = {
                usuario: $scope.login.usuario,
                dataInicial: primeiroDia,
                dataFim: ultimoDia,        
            };
        }
        else if(value == 3){
            $scope.excluirOSCliente = {
                numeroOC: '',
                id:''            
            };     
        }
        else if(value == 4){
            $scope.divVisualizarOc = true;
            $scope.divCadastroOcProd = false;
            $scope.divVisualizarOcPRod = false;
        }else if(value == 5){
            $scope.divVisualizarOc = true;
            $scope.divCadastroOcProd = false;
            $scope.divVisualizarOcPRod = false;
        }else if( value == 6){          
            $scope.divVisualizarOc = false;
            $scope.divCadastroOcProd = true;
            $scope.divVisualizarOcPRod = false;
            $scope.botaoVisualizarProd = true;
        }else if(value == 7){
            $scope.divVisualizarOc = false;
            $scope.divCadastroOcProd = false;
            $scope.divVisualizarOcPRod = true;
            $scope.botaoVisualizarProd = false;
            $scope.divFormProdOC = false;
            $scope.codigoProduto = ''
        };
    };

});

