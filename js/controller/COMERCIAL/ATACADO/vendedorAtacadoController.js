app.controller('vendedoresAtacadoController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[8]){
        window.location = "LOGIN/login.html";
    };      
       
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
  
    //========== VARIAVEIS VISAO GERAL ATACADO - VENDEDORES ==========//
    $scope.visAtcVendVisaoGeral = {
        meta_geral: 0,        
        enableTendeciaMeta: false,        
        vl_total_positivados: 0,
        qtd_total_positivados: 0,
        clientes_positivados: 0,
        vl_total_clientes_novos: 0,
        qtd_total_novos: 0,
        clientes_novos: 0,
        vl_total_clientes_reativados: 0,
        qtd_total_reativados: 0,
        clientes_reativados: 0,
        
        vendedores_internos: [],
        vendedores_externos: [],
        vendedores_havan: [],
        vendedores_outras: [],
        
        vendasporcanal: [],
        
        vendasporregiao: [],
        
        vendasfornecedores_interno: [],
        vendasfornecedores_externo: [],
        vendasfornecedores_havan: []
    };   
    $scope.visNfCarteiraClienteProduto = [];
    $scope.visAtcMapaCidadeCliente = [];
    $scope.visAtcFornecedorProduto = [];
    $scope.visNfCarteiraCliente = [];
    $scope.visAtcRegiaoEstado = [];
    $scope.visAtcRegiaoCidade = [];
    $scope.visAtcMapaCidade = [];
    $scope.ListVendedores = [];    
    $scope.data = [];
    
    $scope.inforFornecedor = { 
        'codigoFornecedor': '',
        'codigoVendedor': '',
        'ticket_medio': '',
        'dataInicial':'',
        'valida': false,
        'dataFim': '',
        'name':'',
        'y': ''
    };
    $scope.percentualAvistaAprazo = false; 
    $scope.vendaPorFormaPagamento = false;
    $scope.urlClienteReativado = false;
    $scope.vendaPorTipoCliente = false;
    $scope.carteiraClienteDiv = false;
    $scope.vendaPorFornecedor = false;
    $scope.carteiraDeClientes = false;
    $scope.urlClienteNovo = false;
    $scope.carteiraClientes = false;
    $scope.apresentarSelect = false;
    $scope.mapaClienteModal = false;
    $scope.regiaoCidadeDiv = false;   
    $scope.metaVisaoGeral = false;  
    $scope.vendaPorRegiao = false;
    $scope.mapaGeografico = false;
    $scope.mapaPositivado = false;
    $scope.cifraoCliente = false; 
    $scope.cifraoCidade = false;
    $scope.mapaCarteira = true;    
    $scope.NfCarteira = false;
    $scope.validacao = false;
    $scope.mapaVenda = false;
    $scope.divGeral = false;       
    $scope.volta = false;
    $scope.tituloMapa = '';   
    $scope.color = '';
   
    $scope.name = '';
    $scope.infoMapa = { 
        'dataInicial': '',
        'dataFim': '',
        'mapaEmBranco': false,  
        'mapaValidador': '', 
        'estado':'',
        'name': ''               
    };     
    $scope.tituloModal = '';
   
    //========== CAPTAR OS VENDEDORES PARA SELECT ADMIN E GERENTE ==========// 
    $scope.listaVendedores = function(){
        $http({
            url: $scope.baseApi + 'listaVendedores/',
            method: 'POST',
            data: {'listaVendedores': $scope.login},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }         
        }).then(function(event){  
            var vendedores = event.data.vendedoresLista;  
            $scope.data = {
                    selectedOption: vendedores[0],
                    availableOptions: vendedores
            };
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;  
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>Token utilizado para autenticação é inválido!');   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 18');  
            };    
        });         
    };
    
   if($scope.login.idperfil  == '1' || $scope.login.idperfil == '5' || $scope.login.codvendedor == '381'){
        $scope.listaVendedores();
        $scope.apresentarSelect = true;         
        $scope.filtro.codigoVendedor = ''
        $scope.dataSelect = function(){
            if ($scope.data.selectedOption.id != 'X'){
                $scope.filtroDados($scope.data.selectedOption.id)    
            }
        }        
        $scope.filtroDados = function(codVend){ 
            $scope.filtro.codigoVendedor = codVend;   
           
        };
    };
    
    //========== POST ATACADO VENDEDOR - GERAL  ==========// 
    $scope.atacadoVendedor = function(){
        $scope.urlClienteReativado = false;
        $scope.urlClienteNovo = false;       
        $scope.divGeral = false; 
        $scope.visAtcVendVisaoGeral = {
            meta_geral: 0,        
            enableTendeciaMeta: false,        
            vl_total_positivados: 0,
            qtd_total_positivados: 0,
            clientes_positivados: 0,
            vl_total_clientes_novos: 0,
            qtd_total_novos: 0,
            clientes_novos: 0,
            vl_total_clientes_reativados: 0,
            qtd_total_reativados: 0,
            clientes_reativados: 0,

            vendedores_internos: [],
            vendedores_externos: [],
            vendedores_havan: [],
            vendedores_outras: [],

            vendasporcanal: [],

            vendasporregiao: [],

            vendasfornecedores_interno: [],
            vendasfornecedores_externo: [],
            vendasfornecedores_havan: []
        };  

        $scope.msgSelecioneVendedor = function(){
            growl.warning('<b>ATENÇÃO</b><br>Selecione o vendedor para pesquisa')
        };

        if($scope.filtro.codigoVendedor == '' && $scope.login.idperfil  == '1'){
            $scope.msgSelecioneVendedor();           
        }else if($scope.filtro.codigoVendedor == '' &&  $scope.login.idperfil == '5')
            $scope.msgSelecioneVendedor(); 
        else if($scope.filtro.codigoVendedor == '' &&  $scope.login.codvendedor == '381'){
            $scope.msgSelecioneVendedor();
        }else{        
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'atacadoVendedor/',
                method: 'POST',
                data: {'atacadoVendedor': $scope.filtro},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                  
                $scope.visAtcVendVisaoGeral = event.data;  
                if($scope.visAtcVendVisaoGeral.mensagem == true){
                    growl.warning('<b>ATENÇÃO</b><br> Vendedor não possui dados referente ao período informado ou META não cadastrada');                    
                    $scope.visAtcVendVisaoGeral = {
                        meta_geral: 0,        
                        enableTendeciaMeta: false,        
                        vl_total_positivados: 0,
                        qtd_total_positivados: 0,
                        clientes_positivados: 0,
                        vl_total_clientes_novos: 0,
                        qtd_total_novos: 0,
                        clientes_novos: 0,
                        vl_total_clientes_reativados: 0,
                        qtd_total_reativados: 0,
                        clientes_reativados: 0,

                        vendedores_internos: [],
                        vendedores_externos: [],
                        vendedores_havan: [],
                        vendedores_outras: [],

                        vendasporcanal: [],

                        vendasporregiao: [],

                        vendasfornecedores_interno: [],
                        vendasfornecedores_externo: [],
                        vendasfornecedores_havan: []
                    };
                    $scope.divGeral = false; 
                    $scope.metaVisaoGeral = false;
                    $scope.vendaPorFornecedor = false;  
                    $scope.vendaPorTipoCliente = false;
                    $scope.vendaPorRegiao = false;
                    $scope.vendaPorFormaPagamento = false;
                    $scope.regiaoCidadeDiv = false; 
                    $scope.carteiraClientes = false;
                    $scope.percentualAvistaAprazo = false;                   
                
                }else{
                  
                    $scope.divGeral = true; 
                    /*
                    if($scope.login.idperfil  == '1' || $scope.login.idperfil == '5' || $scope.login.codvendedor == '381'){
                        $scope.filtro.codigoVendedor = '';
                    };*/
                    
                    if($scope.visAtcVendVisaoGeral.clientes_novos > 0){
                        $scope.urlClienteNovo = true;
                    };
                    
                    if($scope.visAtcVendVisaoGeral.clientes_reativados > 0){
                        $scope.urlClienteReativado = true;
                    };
                    
                    $scope.valorIdeal = $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].dt_ideal;
                    $scope.valorRealizado = $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].dt_realizado;    
                    $scope.diasUteis = $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].dias_uteis; 
                    $scope.diasRestantes = $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].dias_restantes; 
                    $scope.nomeDoVendedor = $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].name;
                    $scope.nameDoVendedor = 'Vendedor(a): ' + $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].name;
                    
                    $scope.carteiraCliente = $scope.visAtcVendVisaoGeral.clientesVendedores[0].carteira
                    $scope.clientesPositivados = $scope.visAtcVendVisaoGeral.clientesVendedores[0].clientePositivado;
                    $scope.clientesNovos = $scope.visAtcVendVisaoGeral.clientesVendedores[0].clienteNovos;
                    
                    $scope.limiteTotal = $scope.visAtcVendVisaoGeral.limitecliente[0].limiteTotal;
                    $scope.valorTotal = $scope.visAtcVendVisaoGeral.limitecliente[0].receberTotal;
                    
                   
                    $scope.mapaTrocarValores();
                    if($scope.login.idperfil == 1 || $scope.login.idperfil == 5){                        
                        $scope.listaVendedores(); 
                    }                   
                    $scope.atualizaGraficos();
                }; 
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 19');  
                };      
            });  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };   
            
        };
        
    };
    
    //========== POST ATACADO VENDEDOR - FORNECEDOR - > PRODUTO  ==========// 
    $scope.fornecedorProdutoAtacado = function(){
        if($scope.inforFornecedor.valida == false){            
            growl.warning('<b>ATENÇÃO</b><br>Selecione um fornecedor!');
            $scope.inforFornecedor.valida = false
            $scope.transPend.visaoGeral = false;
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'fornecedorProdutoAtacado/',
                method: 'POST',
                data: {'fornecedorProdutoAtacado': $scope.inforFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;               
                $scope.visAtcFornecedorProduto = event.data; 
                $('#modalProduto').trigger('click'); 
                $scope.inforFornecedor.valida = false;              
            }).catch(function(err){ 
                console.log(err);
                $scope.inforFornecedor.valida = false;
                $scope.transPend.visaoGeral = false;          
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 20');  
                };                     
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };            
        };       
    };
    
    //========== POST ATACADO VENDEDOR - REGIÃO - > ESTADO  ==========// 
    $scope.regiaoEstado = function(codigo, name, y){
        $scope.infoRegiao = {
            'codigoVendedor': $scope.filtro.codigoVendedor,
            'dataInicial': $scope.filtro.dataInicial,            
            'dataFim': $scope.filtro.dataFim,
            'codigoRegiao': codigo,
            'name': name,
            'y': y
        }    
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'regiaoEstado/',
                method: 'POST',
                data: {'regiaoEstado': $scope.infoRegiao},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;              
                $scope.visAtcRegiaoEstado = event.data;                
                $('#modalRegiao').trigger('click');                              
            }).catch(function(err){        
                console.log(err);    
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 21');  
                };                   
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }      
    };
    
    //========== POST ATACADO VENDEDOR - REGIÃO - > ESTADO -> CIDADE ==========// 
    $scope.regiaoCidade = function(uf,name,y){
        $scope.infoEstado = {
            'codigoRegiao': $scope.infoRegiao.codigoRegiao,
            'codigoVendedor':$scope.filtro.codigoVendedor,            
            'dataInicial': $scope.filtro.dataInicial,            
            'dataFim': $scope.filtro.dataFim,
            'uf': uf,
            'name': name,
            'y':y            
        }
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'regiaoCidade/',
                method: 'POST',
                data: {'regiaoCidade': $scope.infoEstado},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }          
            }).then(function(event){                  
                $scope.visAtcRegiaoCidade = event.data;                  
                $scope.regiaoCidadeDiv  = true
                $scope.transPend.visaoGeral = false;
            }).catch(function(err){     
                console.log(err);        
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 22');
                };                       
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }   
        
    };
    
    //========== CONSULTA CODIGO, NOME, CNPJ, A RECEBER, LIMITE, LIMITE ATUAL==========// 
    $scope.consultaLimiteCliente = function (){
        $('#modalInfoCliente').trigger('click');
    };
    
    //========== TROCAR DE VALORES DO MAPA - CARTEIRA, CLIENTES POSITIVADOS E VALOR TOTAL VENDIDO==========// 
    $scope.mapaTrocarValores = function(){
        $scope.listaVendedores(); 
        if($scope.mapaCarteira == true){   
            
            $scope.mapaPositivado = false;
            $scope.mapaVenda = false; 
            $scope.ModalCarteira = true;
            $scope.ModalPositivado = false;
            $scope.ModalTotal = false;            
            $scope.infoMapa.mapaValidador = 1;          
            $scope.data = $scope.visAtcVendVisaoGeral.mapageograficocarteira;
            $scope.tituloMapa = 'Carteira de Clientes';
            $scope.name = 'Total de clientes na carteira'; 
            $scope.tituloModal = 'Carteira de Clientes - Cidade';
            $scope.atualizaMapaGeografico();   
            
        }else   
        if($scope.mapaPositivado == true){
            
            $scope.mapaCarteira = false;  
            $scope.mapaVenda = false; 
            $scope.ModalCarteira = false;
            $scope.ModalPositivado = true;
            $scope.ModalTotal = false;
            $scope.infoMapa.mapaValidador = 2;           
            $scope.data = $scope.visAtcVendVisaoGeral.mapageograficopositivados;
            $scope.tituloMapa = 'Clientes Positivados';
            $scope.name = 'Total de clientes positivados';
            $scope.tituloModal = 'Clientes Positivados - Cidade';
            $scope.atualizaMapaGeografico();            
        }else   
        if($scope.mapaVenda == true){
            
            $scope.mapaPositivado = false;
            $scope.mapaCarteira = false;
            $scope.ModalCarteira = false;
            $scope.ModalPositivado = false;
            $scope.ModalTotal = true;
            $scope.infoMapa.mapaValidador = 3;         
            $scope.data = $scope.visAtcVendVisaoGeral.mapageograficovalorvendido;
            $scope.tituloMapa = 'Total de Venda Do Vendedor';
            $scope.name = 'Total de venda do vendedor';  
            $scope.tituloModal = 'Total De Venda Do Vendedor - Cidade';
            $scope.atualizaMapaGeografico();            
        };    
    };
    
    //========== FUNÇÃO ATACADO VENDEDORES - MAPA GEOGRAFICO CARTEIRA - > CIDADE ==========// 
    $scope.mapaCidade = function(){
        if($scope.infoMapa.mapaEmBranco == false){
            growl.warning('<b>ATENÇÃO</b><br>Selecione o estado!');
            $scope.infoMapa.mapaEmBranco = false
            $scope.transPend.visaoGeral = false;            
        }else{
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'mapaCidade/',
                method: 'POST',
                data: {'mapaCidade':  $scope.infoMapa},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }          
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                   
                $scope.visAtcMapaCidade = event.data;                 
                if($scope.infoMapa.mapaValidador == 3){
                    $scope.cifraoCidade = true; 
                }else{                    
                    $scope.cifraoCidade = false;
                }
                $('#mapaCidade').trigger('click');  
                $scope.infoMapa.mapaEmBranco = false                                  
            }).catch(function(err){      
                console.log(err);       
                $scope.transPend.visaoGeral = false;               
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 23'); 
                };                          
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            }   
        }        
    };
    
    //========== FUNÇÃO ATACADO VENDEDORES - MAPA GEOGRAFICO CARTEIRA - > CIDADE - > CLIENTE ==========// 
    $scope.mapaCliente = function(name){
        $scope.infoCidade = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,
            'mapaValidador':  $scope.infoMapa.mapaValidador,
            'codigoVendedor': $scope.filtro.codigoVendedor,
            'estado': $scope.infoMapa.estado,
            'cidade': name            
        };     
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'mapaCliente/',
            method: 'POST',
            data: {'mapaCliente':  $scope.infoCidade},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }         
        }).then(function(event){   
            $scope.transPend.visaoGeral = false;                  
            $scope.visAtcMapaCidadeCliente = event.data;  
            $scope.volta = true;
            $scope.mapaClienteModal = true;
            
            if($scope.infoMapa.mapaValidador == 1){  
                $scope.tituloModal = 'Carteira de Clientes - Cliente';
                $scope.cifraoCliente = false;             
            }else
            if($scope.infoMapa.mapaValidador == 2){
                $scope.tituloModal = 'Clientes Positivados - Cliente';
                $scope.cifraoCliente = false;              
            }else{
                $scope.tituloModal = 'Total De Venda Do Vendedor - Cliente';
                $scope.cifraoCliente = true;
            };          
            
        }).catch(function(err){         
            console.log(err);    
            $scope.transPend.visaoGeral = false;           
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 24'); 
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };    
    
    //========== FUNÇÃO ESCONDER DIV's ==========// 
    $scope.tableGrupo = function(){
        
        if($scope.regiaoCidadeDiv  ==  true){
            $scope.regiaoCidadeDiv  = false;
        };
        
        if($scope.volta == true){
            $scope.volta = false;
            $scope.mapaClienteModal = false;
            
            if($scope.infoMapa.mapaValidador == 1){
                $scope.tituloModal = 'Carteira de Clientes - Cidade';
            }else 
            if($scope.infoMapa.mapaValidador == 2){
                $scope.tituloModal = 'Clientes Positivados - Cidade';
            }else{
                $scope.tituloModal = 'Total De Venda Do Vendedor - Cidade';
            }
        }
          
    };
    
    //========== FUNÇÃO ATACADO VENDEDORES - VENDEDOR -> PESQUISA NF ==========// 
    $scope.vendedorPesquisaNfCarteira = function(codigo,nome){       
        $scope.infoCarteira = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,            
            'codigoVendedor': $scope.login.codvendedor,
            'codigo': codigo,            
            'name': nome
        }        
      
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'vendedorPesquisaNfCarteira/',
                method: 'POST',
                data: {'vendedorPesquisaNfCarteira': $scope.infoCarteira},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){    
                $scope.transPend.visaoGeral = false;                
                $scope.visNfCarteiraCliente = event.data;                
                $scope.carteiraClienteDiv = true;               
                
            }).catch(function(err){          
                console.log(err)   
                $scope.transPend.visaoGeral = false;               
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 25'); 
                };                      
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }    
        
    };
    
    //========== FUNÇÃO ATACADO VENDEDORES - VENDEDOR -> PESQUISA NF -> PRODUTO ==========// 
    $scope.vendedorPesquisaNfProduto = function(numero,serie,empresa,emissao,numeroinscricao,descricao,transportador,protocolo,codigoCliente,emissaoRastreio){  
        if($scope.baseApi == 'http://127.0.0.1:7000/' || $scope.baseApi == 'http://192.168.0.143:7000/'){
            path = 1            
        }else{
            path = 2
        }
        $scope.infoNf = {            
            'dataInicial': $scope.filtro.dataInicial,            
            'numeroinscricao': numeroinscricao,
            'dataFim': $scope.filtro.dataFim,
            'transportador': transportador,
            'codigoCliente': codigoCliente,
            'descricao': descricao,
            'protocolo': protocolo,            
            'empresa': empresa,
            'emissao':emissao,            
            'numero':numero,
            'serie': serie,     
            'path': path,       
            'emissaoRastreio': emissaoRastreio
        }      
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'vendedorPesquisaNfProduto/',
                method: 'POST',
                data: {'vendedorPesquisaNfProduto': $scope.infoNf},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                   
                $scope.visNfCarteiraClienteProduto  = event.data;       
                $('#modalNfProduto').trigger('click');                
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
    
    //========== FUNÇÃO SETAR FALSE DIV's ==========// 
    $scope.close = function(){
        $scope.regiaoCidadeDiv  = false;
        $scope.mapaClienteModal = false;
        $scope.cifraoCidade = false;
        $scope.cifraoCliente = false; 
        $scope.volta = false;
        $scope.carteiraClienteDiv = false;
    };
    
    //========== FUNÇÃO PARA CAPTAR OS CLIENTES NOVOS E REATIVADOS - > VENDEDOR - > CLIENTE  ==========//
    $scope.clientesNovoseReativados = function(valor){
        if(valor == 1){
            $('#modalNovos').trigger('click'); 
        }else 
        if(valor == 2){
           $('#modalReativados').trigger('click'); 
        } 
    };
    
    //========== HIGH CHARTS ==========//
    Highcharts.setOptions({
        /*colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        }),*/
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
    
    //========== ATUALIZA GRAFICO  ==========//
    $scope.atualizaGraficos = function(){
        
        /*========================= META VISÃO GERAL - VENDEDOR  =========================*/
        Highcharts.chart('hcMetaVisaoGeral',{
            chart: {
                type: 'bar',
                height:400
            },
            title: {
                text: 'Visão Geral'
            },
            subtitle: {
                text: $scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].nomePercentual
                
            },
            xAxis: {
                categories: [''],
                title: {
                    text: null
                }
            },             
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },            
            credits: {
                enabled: false
            },
            /*legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -1480,
                y: 65,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },*/

            series: [{  
                name:'Meta',
                color: 'rgba(126,86,134,.9)',
                data: [$scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].meta],
               pointPadding: 0.33
               
            }, {
                color: 'rgba(159,227,139,.9)',
                name: 'Tendência',
                data: [$scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].valor_extimado],
                pointPadding: 0.29
            }, {
                name: 'Realizado',
                color: 'rgba(165,170,217,1)',
                data: [$scope.visAtcVendVisaoGeral.vendedorMetaTendencia[0].venda],
                 pointPadding: 0.25
            }
            ]
        });
        
        /*========================= VENDAS POR FORNECEDOR - VENDEDOR  =========================*/
        Highcharts.chart('hcVendasPorFornecedor', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Fornecedor'
            },
            subtitle: {
                text: $scope.nomeDoVendedor
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
                name: 'Vendas R$',               
                data: $scope.visAtcVendVisaoGeral.vendasporfornecedor,
                events: {
                    click: function (event) {                      
                        $scope.inforFornecedor.codigoFornecedor  = event.point.options.codigo;
                        $scope.inforFornecedor.codigoVendedor = $scope.filtro.codigoVendedor;  
                        $scope.inforFornecedor.dataInicial = $scope.filtro.dataInicial;
                        $scope.inforFornecedor.name = event.point.options.name;
                        $scope.inforFornecedor.dataFim = $scope.filtro.dataFim;                       
                        $scope.inforFornecedor.y = event.point.options.y;
                        $scope.inforFornecedor.valida = true;                        
                    }
                }
            }]
        });
        
        /*========================= VENDAS POR TIPO DE CLIENTE - VENDEDOR  =========================*/
        Highcharts.chart('hcVendasPorTipoDeCliente', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Tipo de Cliente'
            },
            subtitle: {
                text: $scope.nomeDoVendedor
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
                name: 'Vendas R$',               
                data: $scope.visAtcVendVisaoGeral.vendatipocliente                 
            }]
        });
      
        /*========================= VENDAS POR FORMA DE PAGAMENTO - VENDEDOR  =========================*/
        Highcharts.chart('hcVendasPorFormaPagamento', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Forma de Pagamento'
            },
            subtitle: {
                text: $scope.nomeDoVendedor
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
                name: 'Vendas R$',               
                data: $scope.visAtcVendVisaoGeral.formapagamento                
            }]
        });        
        
        /*========================= PERCENTUAL CARTEIRA A VISTA X A PRAZO - VENDEDOR  =========================*/
        Highcharts.chart('hcPercentAvistaXaprazo', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Percentual Da Carteira'
            },
            subtitle: {
                text: $scope.nomeDoVendedor
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
                name: 'Vendas R$',               
                data: $scope.visAtcVendVisaoGeral.percentualcarteira
                 
            }]
        });
        
    };
 
    $scope.atualizaMapaGeografico = function(){
        /*========================= CLIENTES POR CARTEIRA MAPA GEOGRAFICO - VENDEDOR  =========================*/  
        Highcharts.mapChart('hcMapaRegiaoCarteira', {
            chart: {
                map: 'countries/br/br-all',
                height: 580,
                width:620
            },

            title: {
                text: $scope.name
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
                data: $scope.data,
                name: 'Total:',        
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }, 
                events: {
                    click: function (event) {                          
                        $scope.infoMapa.dataInicial =  $scope.filtro.dataInicial;
                        $scope.infoMapa.dataFim = $scope.filtro.dataFim;
                        $scope.infoMapa.codigoVendedor = $scope.filtro.codigoVendedor;
                        $scope.infoMapa.name = event.point.properties.name;                      
                        $scope.infoMapa.estado = event.point.properties["hc-a2"];
                        $scope.infoMapa.mapaEmBranco = true;
                    }
                }        
            }]
        });
        
    };
});