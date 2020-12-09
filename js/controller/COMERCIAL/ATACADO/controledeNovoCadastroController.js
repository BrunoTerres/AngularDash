app.controller('controleDeNovoCadastroController', function($scope, $http,growl){
    
    if (!$scope.permissoes[16]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
      
    //========== FUNÇÃO PARA PEGAR MÊS E ANO  ==========// 
    var data = new Date();      
    $scope.infoDate = {
        'dataAtual': data.getFullYear(),
        'dataPassada':data.getFullYear()-1
    };
     
    //==========  VARIAVEIS GLOBAIS ==========//
    $scope.cadastrosNovosPesquisaMes = [];
    $scope.infoMultiMarcaClientes = [];
    $scope.cadastrosNovosVendedor = [];
    $scope.infoFatClientesNovos = [];    
    $scope.infoFormePagamento = [];    
    $scope.infoVendCliente = [];    
    $scope.cadastrosNovos = [];     
    $scope.infoProdutos = []; 
    $scope.infoCliente = [];
    $scope.infoEstado = [];
    $scope.infoCidade = [];
    
    /*VALIDAÇÃO É UMA VARIAVEL PARA EVENT CLICK NO GRAFICO CADASTRO NOVOS CLIENTES.*/
    $scope.infoNovosCadastroMesAno ={
        'validacao': 99,
        'total': '',
        'mes': '',
        'ano':''      
    }; 

    $scope.infoVendedor = {
        'codigoVendedor':'',
        'total':'',
        'name': '',
        'ano': '',
        'mes': ''     
    }; 

    $scope.infoRegiao = {
            'anoMes': '',
            'codigo': '',
            'regiao': '',
            'total':''           
    };

    $scope.infoMapa = {
        'anoMes': '',
        'estado':'',
        'total': '',
        'uf':''
    };

    $scope.infoMultimarcas = {
        'codigoMarca': '',
        'total':'',
        'nome':'',
        'mes':'',
        'ano':''
    };

    $scope.infoFormPgto = {
        'codigo':'',
        'total': '',
        'nome': '',
        'mes':'',
        'ano':''
    };

    $scope.infoClientVend = {
        'codigo':'',
        'total': '',
        'nome': '',
        'mes':'',
        'ano':''
    };   
    
    //==========  VARIAVEIS GLOBAIS BOOLEANAS PARA APRESENTAÇÃO DE DIV ==========//
    $scope.apresentaProdutos = false;
    $scope.divCadastrosNovos = false;
    $scope.apresentaCliente = false;
    $scope.apresentaEstado = false;
    $scope.apresentaCidade = false;
    $scope.QuantidadeInfo = false;
    $scope.LimiteInfo = false; 
    
    //========== POST CONTROLE NOVOS CADASTROS ==========//    
    $scope.controleNovosCadastros = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'controleNovosCadastros/',
            method: 'POST',
            data: {'controleNovosCadastros': $scope.infoDate},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }        
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.cadastrosNovos  = event.data;               
            $scope.atualizaGraficos();        
        }).catch(function(err){    
            console.log(err);
            $scope.transPend.visaoGeral = false;  
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 30'); 
            };        
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        } 
    }; 
    
    //========== POST CLIENTES NOVOS MES SELECIONADO - GRAFICO CADASTROS NOVOS ==========//    
    $scope.controleNovosCadastrosPesquisaMes = function(){
        $scope.divCadastrosNovos = false;
        if($scope.infoNovosCadastroMesAno.validacao == 99){
           growl.warning('<b>Atenção</b><br>Selecione o encima da barra do mês para pesquisa!');   
        }else{         
            $scope.infoNovosCadastroMesAno.validacao = 99
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'controleNovosCadastrosPesquisaMes/',
                method: 'POST',
                data: {'controleNovosCadastrosPesquisaMes': $scope.infoNovosCadastroMesAno},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;  
                $scope.cadastrosNovosPesquisaMes  = event.data;                           
                $scope.atualizaGraficosCliente();                
                $scope.divCadastrosNovos = true;
                $scope.QuantidadeInfo = true;
            }).catch(function(err){    
                console.log(err);                
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 31'); 
                };      
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        }; 
    };
    
    //========== POST INFO CLIENTES POR VENDEDOR  ==========//  
    $scope.infoVendedorNovosClientes = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'infoVendedorNovosClientes/',
                method: 'POST',
                data: {'infoVendedorNovosClientes':  $scope.infoVendedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;  
                $scope.cadastrosNovosVendedor = event.data;                       
                $scope.divCadastrosNovos = true;
                $('#modalInfoCliente').trigger('click');
            }).catch(function(err){    
                console.log(err);              
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 32'); 
                };        
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };    
    
    //========== POST INFO CLIENTES FATURAMENTO POR PRODUTO  ==========//  
    $scope.infoProdutosFaturamento = function(codigo, cnpj, quantidade, y, nome){
        $scope.infoCliente = {
            'codigoVendedor':$scope.infoVendedor.codigoVendedor ,
            'ano': $scope.infoVendedor.ano,
            'mes': $scope.infoVendedor.mes,            
            'codigo': codigo,           
            'cnpj': cnpj,
            'nome':  nome,
            'quantidade': quantidade,
            'y': y,
        };     
        $scope.apresentaProdutos = false;
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
        $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoProdutosFaturamento/',
            method: 'POST',
            data: {'infoProdutosFaturamento': $scope.infoCliente},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){
            $scope.transPend.visaoGeral = false;    
            $scope.infoProdutos = event.data;              
            $scope.apresentaProdutos = true;           
            
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 33'); 
            };    
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };
    
    //========== POST GRAFICO QUANTIDADE REGIÃO - ESTADO -> CIDADE -> CLIENTE  ==========//  
    $scope.infoRegiaoEstado = function(){
        $scope.close();
       if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
        $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoRegiaoEstado/',
            method: 'POST',
            data: {'infoRegiaoEstado': $scope.infoRegiao},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
            $scope.infoEstado = event.data;
            $scope.width = 40;
            $scope.apresentaEstado = true;
            $('#modalInfoRegiao').trigger('click');
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;     
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 34'); 
            };   
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };         
    };
    
    $scope.infoEstadoCidade = function(estado,uf,quantidade){
        $scope.infoEst = {
            'codigoRegiao': $scope.infoEstado.infoRegiaoEstado.codigoRegiao,
            'ano': $scope.infoEstado.infoRegiaoEstado.ano,
            'mes': $scope.infoEstado.infoRegiaoEstado.mes,
            'total': quantidade,
            'estado': estado,
            'uf': uf,           
        }
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoEstadoCidade/',
            method: 'POST',
            data: {'infoEstadoCidade': $scope.infoEst},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
            $scope.infoCidade = event.data;  
            $scope.width = 40;
            $scope.apresentaEstado = false;
            $scope.apresentaCidade = true;           
        }).catch(function(err){    
            console.log(err);           
            $scope.transPend.visaoGeral = false;     
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 35'); 
            };   
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };         
    };
    
    $scope.infoCidadeCliente = function(cidade,quantidade){
        $scope.infoCity = {
            'codigoRegiao': $scope.infoCidade.infoEstadoCidade.codigoRegiao,
            'ano': $scope.infoCidade.infoEstadoCidade.ano,
            'mes': $scope.infoCidade.infoEstadoCidade.mes,
            'uf': $scope.infoCidade.infoEstadoCidade.uf,
            'total': quantidade,
            'cidade': cidade
            
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoCidadeCliente/',
            method: 'POST',
            data: {'infoCidadeCliente': $scope.infoCity},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }       
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
            $scope.infoCliente  = event.data; 
            $scope.width = 90;
            $scope.apresentaCidade = false;   
            $scope.apresentaCliente = true;           
        }).catch(function(err){    
            console.log(err);           
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 36'); 
            };       
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };   
    
    //========== POST GRAFICO QUANTIDADE MAPA GEOGRAFICO - ESTADO -> CIDADE -> CLIENTE  ==========// 
    $scope.infoEstadoCity = function(){
        $scope.close();
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoEstadoCity/',
            method: 'POST',
            data: {'infoEstadoCity': $scope.infoMapa},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.width = 40;
            $scope.infoCidade  = event.data;            
            $('#modalInfoEstado').trigger('click');
            $scope.apresentaCidade = true;                        
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 37'); 
            };      
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    $scope.infoCidadeClient = function(cidade,quantidade){
        $scope.infoCity = {
            'ano': $scope.infoCidade.infoEstadoCidade.ano,
            'mes':$scope.infoCidade.infoEstadoCidade.mes,
            'uf':$scope.infoCidade.infoEstadoCidade.uf,
            'cidade': cidade,
            'total': quantidade
            
        };        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoCidadeClient/',
            method: 'POST',
            data: {'infoCidadeClient': $scope.infoCity},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }       
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.width = 90;
            $scope.infoCliente  = event.data;
            $scope.apresentaCidade = false; 
            $scope.apresentaCliente = true;                       
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 38'); 
            };     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    //==========  POST GRAFICO LIMITE POR REGIÃO - ESTADO -> CIDADE -> CLIENTE  ==========//  
    $scope.infoRegiaoEstadoLimite = function(){
        $scope.close();
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoRegiaoEstadoLimite/',
            method: 'POST',
            data: {'infoRegiaoEstadoLimite':  $scope.infoRegiao},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.width = 40;
            $scope.infoEstado  = event.data;            
            $scope.apresentaEstado = true;
            $('#modalInfoRegion').trigger('click');
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;     
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 39'); 
            };    
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    $scope.infoEstadoCidadeLimite = function(estado,uf,y){
        $scope.infoEst = {
            'codigoRegiao': $scope.infoEstado.infoRegiaoEstadoLimite.codigoRegiao,
            'ano': $scope.infoEstado.infoRegiaoEstadoLimite.ano,
            'mes': $scope.infoEstado.infoRegiaoEstadoLimite.mes,
            'total': y,
            'estado': estado,
            'uf': uf,           
        };       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoEstadoCidadeLimite/',
            method: 'POST',
            data: {'infoEstadoCidadeLimite': $scope.infoEst},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }       
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
            $scope.width = 40;
            $scope.infoCidade = event.data;                      
            $scope.apresentaEstado = false;
            $scope.apresentaCidade = true;             
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;   
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 40'); 
            };  
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };       
    };
    
    $scope.infoCidadeClienteLimite = function(cidade, y){
        $scope.infoCity = {
            'codigoRegiao': $scope.infoCidade.infoCidadeClienteLimite.codigoRegiao,
            'ano': $scope.infoCidade.infoCidadeClienteLimite.ano,
            'mes': $scope.infoCidade.infoCidadeClienteLimite.mes,
            'uf': $scope.infoCidade.infoCidadeClienteLimite.uf,
            'total': y,
            'cidade': cidade            
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoCidadeClienteLimite/',
            method: 'POST',
            data: {'infoCidadeClienteLimite': $scope.infoCity},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
            $scope.width = 90;
            $scope.infoCliente  = event.data;
            $scope.apresentaCidade = false;   
            $scope.apresentaCliente = true;            
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 41');  
            };      
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //========== POST GRAFICO LIMITE MAPA GEOGRAFICO - ESTADO -> CIDADE -> CLIENTE  ==========// 
    $scope.infoEstadoCityLimite = function(){
        $scope.close();
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoEstadoCityLimite/',
            method: 'POST',
            data: {'infoEstadoCityLimite': $scope.infoMapa},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }       
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.width = 40;
            $scope.infoCidade  = event.data;   
            $scope.apresentaCidade = true;             
            $('#modalInfoState').trigger('click');
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 42');  
            };   
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    }; 
    
    $scope.infoCityCliente = function(cidade,y){
        $scope.infoCity = {
            'ano': $scope.infoCidade.infoEstadoLimite.ano,
            'mes':$scope.infoCidade.infoEstadoLimite.mes,
            'uf':$scope.infoCidade.infoEstadoLimite.uf,
            'cidade': cidade,
            'total': y            
        }; 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoCityCliente/',
            method: 'POST',
            data: {'infoCityCliente': $scope.infoCity},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;   
            $scope.width = 90;
            $scope.infoCliente  = event.data;            
            $scope.apresentaCidade = false; 
            $scope.apresentaCliente = true;
                    
        }).catch(function(err){    
            console.log(err);           
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 43'); 
            };        
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
        
    };
    
    //========== POST GRAFICO MULTIMARCAS - LISTAGEM DE CLIENTES ==========// 
    $scope.infoMultiMarcasCliente = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoMultiMarcasCliente/',
            method: 'POST',
            data: {'infoMultiMarcasCliente':  $scope.infoMultimarcas},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){ 
            $scope.transPend.visaoGeral = false; 
            $scope.infoMultiMarcaClientes = event.data;
            console.log($scope.infoMultiMarcaClientes)        
            $('#modalInfoMultiMarcas').trigger('click');                       
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 44'); 
            };  
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };    
    };   
    
    $scope.infoFormPagamento = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoFormPagamento/',
            method: 'POST',
            data: {'infoFormPagamento':  $scope.infoFormPgto},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;
            $scope.infoFormePagamento = event.data;           
            $('#modalInfoFormPgto').trigger('click');                        
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false; 
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 45');
            };     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    }
    
    $scope.infoVendLimiteCliente = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoVendLimiteCliente/',
            method: 'POST',
            data: {'infoVendLimiteCliente':  $scope.infoClientVend},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;    
            $scope.infoVendCliente  = event.data;       
            $('#modalInfoVendLimite').trigger('click');                   
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 46');
            };  
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    }
    
    //==========  APRESENTAR MODAL GRAFICO QUANTIDADE - TABLE ==========// 
    $scope.tableGrupo = function(){
        if($scope.apresentaCidade == true){
            $scope.width = 40;
            $scope.apresentaCidade = false;
            $scope.apresentaEstado = true;
        };
        
        if($scope.apresentaCliente == true ){ 
            $scope.width = 40;
            $scope.apresentaCliente = false;
            $scope.apresentaCidade = true;
        };
     
    };
    
    //========== FUNÇÕES PARA DEIXA FALSE VARIAVEIS E DEIXA EM BRANCO ARRAYS ==========// 
    $scope.esconderLimitexQuantidade = function(){
        if($scope.QuantidadeInfo  == true){
           $scope.LimiteInfo = false
        }else
        if( $scope.LimiteInfo == true){
            $scope.QuantidadeInfo  == false
        };  
    };
    
    $scope.close = function(){
        $scope.infoCliente = [];
        $scope.infoEstado = [];
        $scope.infoCidade = [];      
        
        $scope.apresentaEstado = false;
        $scope.apresentaCidade = false;
        $scope.apresentaCliente = false;
        
    };
    
    $scope.sair = function(){
        $scope.cadastrosNovosVendedor = [];        
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
    
    /*==========  ATUALIZA GRAFICOS HIGH CHARTS ==========*/  
    $scope.atualizaGraficos = function(){
        
        /*========== QUANTIDADE DE CADASTROS CADA MÊS ==========*/ 
        Highcharts.chart('hcNovosCadastros', {
            chart: {
                type: 'area',
                spacingBottom: 30
            },
            title: {
                text: 'Cadastro de Novos Clientes'
            },            
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.categories
            },
            yAxis: {
                title: {
                    text: 'Quantidade'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.x + ': ' + this.y;
                }
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.5
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    name: $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoAtual,
                    data: $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoAtualDados,
                    events: {
                        click: function (event) {  
                            $scope.QuantidadeInfo = false;
                            $scope.LimiteInfo = false; 
                            $scope.infoNovosCadastroMesAno.ano = $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoAtual
                            $scope.infoNovosCadastroMesAno.total = event.point.options.y
                            $scope.infoNovosCadastroMesAno.mes = event.point.category                            
                            $scope.infoNovosCadastroMesAno.validacao = 1    
                        }
                    } 
                },{
                    name: $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoPassado,
                    data: $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoPassadoDados,
                    events: {
                        click: function (event) { 
                            $scope.QuantidadeInfo = false;
                            $scope.LimiteInfo = false; 
                            $scope.infoNovosCadastroMesAno.ano = $scope.cadastrosNovos.cadastrosNovosClienteQtdeMes.anoPassado
                            $scope.infoNovosCadastroMesAno.total = event.point.options.y
                            $scope.infoNovosCadastroMesAno.mes = event.point.category                            
                            $scope.infoNovosCadastroMesAno.validacao = 1    
                        }
                    } 
                }                      
            ]
        });      
     
        
    };
    
    $scope.atualizaGraficosCliente = function(){
        
        /*========== QUANTIDADE DE CLIENTES POR REGIÃO ==========*/ 
        Highcharts.chart('hcQtdPorRegiao', {            
            chart: {
                polar: true,
                type: 'line',
                width: 700,
                height: 433
            },
            title: {
                text: 'Quantidade Por Região',
                x: -75
            },
            pane: {
                size: '100%'
            },
            xAxis: {
                categories: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesRegiao.categories,
               
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: [{
                name: 'Quantidade',
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesRegiao.data,
                pointPlacement: 'on',
                events: {
                        click: function (event) {                            
                            $scope.infoRegiao.anoMes = $scope.cadastrosNovosPesquisaMes.pesquisa;
                            $scope.infoRegiao.codigo = event.point.options.codigo;
                            $scope.infoRegiao.total = event.point.options.y;
                            $scope.infoRegiao.regiao = event.point.options.regiao;                         
                            $scope.infoRegiaoEstado();
                        }
                } 
            }]
        }); 
        
        /*========== LIMITE DE CLIENTES POR REGIÃO ==========*/ 
        Highcharts.chart('hcLimitePorRegiao', {            
            chart: {
                polar: true,
                type: 'line',
                width: 800,
                height: 433
            },
            title: {
                text: 'Limite Por Região',
                x: -75
            },
            pane: {
                size: '95%'
            },
            xAxis: {
                categories: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesRegiaoLimite.categories,
               
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>R${point.y:.2f}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: [{
                name: 'Limite',
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesRegiaoLimite.data,
                pointPlacement: 'on',
                 events: {
                        click: function (event) {                            
                            $scope.infoRegiao.anoMes = $scope.cadastrosNovosPesquisaMes.pesquisa;
                            $scope.infoRegiao.codigo = event.point.options.codigo;
                            $scope.infoRegiao.total = event.point.options.y;
                            $scope.infoRegiao.regiao = event.point.options.regiao;   
                            $scope.infoRegiaoEstadoLimite();                            
                        }
                } 
            }]
        }); 
        
        /*========== QUANTIDADE DE CLIENTES POR ESTADO - MAPA GEOGRAFICO ==========*/ 
        Highcharts.mapChart('hcMapaQtdEstado', {
            chart: {
                map: 'countries/br/br-all',
                height: 580,
                width:620
            },
            title: {
                text: 'Quantidade de Clientes Por Estado'
            },          
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                min: 0
            },
            series: [{
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesEstado,
                name:  'Quantidade',        
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },events: {
                    click: function (event) {                            
                        $scope.infoMapa.anoMes = $scope.cadastrosNovosPesquisaMes.pesquisa;
                        $scope.infoMapa.uf = event.point.properties["hc-a2"];
                        $scope.infoMapa.estado = event.point.properties.name;
                        $scope.infoMapa.total = event.point.options.value                        
                        $scope.infoEstadoCity();
                    }
                }   
            }]
        });
        
        /*========== LIMITE  DE CLIENTES POR ESTADO - MAPA GEOGRAFICO ==========*/ 
        Highcharts.mapChart('hcLimiteQtdEstado', {
            chart: {
                map: 'countries/br/br-all',
                height: 580,
                width:620
            },
            title: {
                text: 'Limite de Clientes Por Estado'
            },          
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                min: 0
            },
            series: [{
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesEstadoLimite,
                name:  'Limite',        
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },events: {
                    click: function (event) {                            
                        $scope.infoMapa.anoMes = $scope.cadastrosNovosPesquisaMes.pesquisa;
                        $scope.infoMapa.uf = event.point.properties["hc-a2"];
                        $scope.infoMapa.estado = event.point.properties.name;
                        $scope.infoMapa.total = event.point.options.value;                        
                        $scope.infoEstadoCityLimite();
                    }
                }    
            }]
        });        
        
        /*========================= QUANTIDADE POR TIPO_CLIENTE  =========================*/  
        Highcharts.chart('hcQtdTipoCliente', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 520
            },
            title: {
                text: 'Quantidade por Tipo de Cliente'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',                        
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Quantidade',                
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesTipo.data,
                events: {
                    click: function (event) { 
                        $scope.infoMultimarcas.mes = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesTipo.mes;
                        $scope.infoMultimarcas.ano = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesTipo.ano;
                        $scope.infoMultimarcas.codigoMarca = event.point.options.codigo;
                        $scope.infoMultimarcas.nome = event.point.options.name;
                        $scope.infoMultimarcas.total = event.point.options.y;                      
                        $scope.infoMultiMarcasCliente();
                    }
                }  
            }]
        });
        
        /*========================= CLIENTES NOVOS FORMAS DE PAGAMENTO  =========================*/  
        Highcharts.chart('hcFormPgto', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 520
            },
            title: {
                text: 'Quantidade Forma de Pagamento'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',                        
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Quantidade',                
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFormPgto.data,
                events: {
                    click: function (event) { 
                        $scope.infoFormPgto.mes =  $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFormPgto.mes;
                        $scope.infoFormPgto.ano =  $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFormPgto.ano;
                        $scope.infoFormPgto.codigo = event.point.options.codigo;
                        $scope.infoFormPgto.nome = event.point.options.name;
                        $scope.infoFormPgto.total = event.point.options.y;
                        $scope.infoFormPagamento();
                    }
                }  
            }]
        });
        
        /*========================= QUANTIDADE 1 FATURAMENTO X QUANTIDADE NOVOS CLIENTE P/ VENDEDOR  =========================*/  
        Highcharts.chart('hcQtdeFatClieNovos', {
            chart: {
                type: 'column',
                height: 600,
            },
            title: {
                text: 'Quantidade Clientes Novos -  Vendedores'
            },
            xAxis: {
                categories:$scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.categories
            },
            yAxis: [{
                min: 0
            }, {
                title: {
                    text: 'Quantidade'
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
                name: 'Quantidade Novos Clientes',
                color: 'rgba(165,170,217,1)',
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.dataQtde,
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
                            $scope.infoVendedor.ano = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.ano;
                            $scope.infoVendedor.mes = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.mes;
                            $scope.infoVendedor.codigoVendedor =  event.point.options.codigo;
                            $scope.infoVendedor.name = event.point.options.nome;
                            $scope.infoVendedor.total = event.point.options.y;
                            $scope.infoVendedorNovosClientes();                        
                        }
                } 
            }, {
                name: 'Quantidade Primeiro Faturamento',
                color: 'rgba(126,86,134,.9)',
                data: $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.dataFat,
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
                            $scope.infoVendedor.ano = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.ano
                            $scope.infoVendedor.mes = $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesFatEqtd.mes
                            $scope.infoVendedor.codigoVendedor = event.point.options.codigo
                            $scope.infoVendedor.name = event.point.options.nome
                            $scope.infoVendedor.y = event.point.options.y 
                            $scope.infoVendedorNovosClientes();  
                        }
                } 
            }],
        });
        
        /*========== TOTAL DA CARTEIRA POR VENDEDOR  ==========*/   
        Highcharts.chart('hcTotCarteiraVendedor', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Total Carteira Vendedor'
            },            
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Valores'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Valor: R$ <b>{point.y:.2f}</b>'
            },"series": [{ 
                    data:  $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesLimiteVend.data,
                    dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.2f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                events: {
                    click: function (event) { 
                        $scope.infoClientVend.mes =  $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesLimiteVend.mes;
                        $scope.infoClientVend.ano =  $scope.cadastrosNovosPesquisaMes.cadastroNovosClientesLimiteVend.ano;
                        $scope.infoClientVend.codigo = event.point.options.codigo;
                        $scope.infoClientVend.nome = event.point.options.name;
                        $scope.infoClientVend.total = event.point.options.y;
                        $scope.infoVendLimiteCliente();
                    }
                }  
            }]           
        });
        
    };
  
});

