app.controller('ecommerceController', function($scope, $http,$timeout, growl){
   
    if (!$scope.permissoes[1]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };    

    var hoje = new Date();
    var ano = hoje.getFullYear();
    var mes = hoje.getMonth()+1;
    
    $scope.qtdDiasDoMes = $scope.diasNoMes(mes, ano);  
   
    $scope.infoFaturamento = {
        diaPesquisa: '',
        totalDia: '',
        canalMenu: ''
    };

    $scope.visEcmVisaoGeral = {
        visaogeral: ''
    };

 
    $scope.colorPassado = 'rgba(42, 63, 84)'
    $scope.visEcmVisaoGeralVendaAnual = [];  
    $scope.infoVendedorGrupo = [];
    $scope.infoGrupProduto = [];
    $scope.produtoDiaFat = [];
    $scope.checkoutNotas = [];  
    $scope.divVendGrupo = false;      
    $scope.divGrupoMarca = false;
    $scope.divMarcaProduto = false;
    $scope.divVendedor = false;
    $scope.divPrimeira = false; 
    $scope.divSegunda = false;
    $scope.divAnoPassado = false;
    $scope.marcaValue = '';

    /* VARIAVEIS GLOBAIS DE FILTRO MENU */
    $scope.filtroMenuSetarFalse = function(){
        $scope.divAnoPassado = false;     
        $scope.cardMargens = false;
        $scope.cardMetas = false; 
        $scope.cardLogistico = false; 
        $scope.cardCampanhas = false;  
        $scope.cardVendas = false; 
        $scope.cardVendasOut = false;   
        $scope.cardVendasAno = false;
        $scope.cardReclameAqui = false
    };
   
 
    //========== POST ECM VISÃO GERAL  ==========//
    $scope.postEcmVisaoGeral = {
        method : 'POST',
        url : $scope.baseApi + 'ecmVisaoGeral/',
        data :{'ecmVisaoGeral': $scope.filtro} ,
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': $scope.login.token 
        }  
    };    
    
    //========== ECM VISÃO GERAL  ==========//
    $scope.ecmVisaoGeral = function(){
        
        $scope.filtroMenuSetarFalse();     
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            $scope.filtro.canalMenu = $scope.canalMenu.id;
            $scope.filtro.filtroMenu = $scope.filtroMenu.id;
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http($scope.postEcmVisaoGeral
                ).then(function(event){      
                    $scope.transPend.visaoGeral = false;           
                    $scope.visEcmVisaoGeral = event.data;    
                    
                    $scope.divAnoPassado = true;              
                    /* CALCULO PARA PROJEÇÃO DE FATURAMENTO*/
                    if($scope.canalMenu.id == "01"){
                        var valorTotal = ($scope.visEcmVisaoGeral.visaogeral[0].valor_extimado);
                        var valorSite = ($scope.visEcmVisaoGeral.visaogeral[1].valor_extimado);
                        var valorMkt = ($scope.visEcmVisaoGeral.visaogeral[2].valor_extimado);
                        $scope.valorExtimadoTotal = parseFloat(valorTotal.toFixed(2));
                        $scope.valorExtimadoSite = parseFloat(valorSite.toFixed(2));
                        $scope.valorExtimadoMkt =  parseFloat(valorMkt.toFixed(2)); 
                    }else if($scope.canalMenu.id == "02"){
                        var valorSite = ($scope.visEcmVisaoGeral.visaogeral[0].valor_extimado);
                        $scope.valorExtimadoSite = parseFloat(valorSite.toFixed(2));
                    }else{
                        var valorMkt = ($scope.visEcmVisaoGeral.visaogeral[0].valor_extimado);
                        $scope.valorExtimadoMkt =  parseFloat(valorMkt.toFixed(2)); 
                    };
                    console.log($scope.visEcmVisaoGeral)

                    $scope.filtroMenus();                                                        
                  
                }).catch(function(err){
                    console.log(err);                                          
                    $scope.transPend.visaoGeral = false;                    
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR</b><br>Erro de Conexão ID: 3');   
                    };  
                });                
               } else {
                growl.info('<b>AGUARDE</b><br>Transação Pendente!');              
            }
        } else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválidas(s)');              
        }
    };    
    
    //========== GRAFICO ANUAL ECM VISÃO GERAL  ==========//
    $scope.graficoAnualEcmVisaoGeral = function(){
        $scope.infoData = {
            dataInicial: $scope.filtro.dataInicial,
            dataFim:  $scope.filtro.dataFim,
            canalMenu: $scope.filtro.canalMenu
        };              
        $http({
            url: $scope.baseApi + 'graficoAnualEcmVisaoGeral/',
            method: 'POST',
            data: {'graficoAnualEcmVisaoGeral':$scope.infoData},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }        
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;              
            $scope.visEcmVisaoGeralVendaAnual = event.data;         
            $scope.vendasPorAnoGrafico();                        
        }).catch(function(err){            
            console.log(err);
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.1');  
            };  
        });       
    };

    $scope.vendasPorAnoGrafico = function(){
        /*========================= VENDAS POR ANO  =========================*/
        Highcharts.chart('hcVendasPorAno', {
            chart: {
                type: 'line',
                height: 500
               
            },
            title: {
                text: 'Vendas Por Ano'
            },           
            subtitle: {
                    text:'Total R$: ' +  ($scope.visEcmVisaoGeralVendaAnual.vendasporano.totalAno).toLocaleString('pt-BR')
            },     
            xAxis: {
                categories: $scope.visEcmVisaoGeralVendaAnual.vendasporano.categories
            },
            yAxis: {
                title: {
                    text: 'Valores'
                }
            },            
            tooltip: {
                shared: true,
                valuePrefix: 'R$ '
            },            
            series: $scope.visEcmVisaoGeralVendaAnual.vendasporano.series
                       
        });  
        $scope.cardVendasAno = true;
    };   

    //========== POST FATUAMENTO DO DIA PRODUTO ==========//
    $scope.faturamentoDiaProduto = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.infoFaturamento.canalMenu = $scope.filtro.canalMenu
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'faturamentoDiaProduto/',
                method: 'POST',
                data: {'faturamentoDiaProduto': $scope.infoFaturamento},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.produtoDiaFat = event.data.faturamentodiaproduto;
                $scope.dataTablesModal(12)
                console.log( $scope.produtoDiaFat)
                $('#modalProduto').trigger('click'); 
            }).catch(function(err){         
                console.log(err);      
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.2');   
                };                     
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };       
    };
    
    //========== PESQUISA CHECKOUT -> NOTAS/PRODUTOS  ==========//
    $scope.pesquisaNFCheckout = function(data,empresa,checkout){
        $scope.infoCheckout = {
            data: data,
            empresa: empresa,
            checkout: checkout,
            validador: '2',
            canalMenu: $scope.filtro.canalMenu 
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaNFCheckout/',
                method: 'POST',
                data: {'pesquisaNFCheckout': $scope.infoCheckout},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;               
                $scope.checkoutNotas = event.data.pesquisaCheckout;                
                $scope.dataTablesModal(8);
                $('#modalCheckout').trigger('click'); 
            }).catch(function(err){               
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.3'); 
                };                    
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };
  
    //========== PESQUISA VENDEDOR - > GRUPO  ==========//
    $scope.margemVendGrupo = function(codigo,nome){
        $scope.infoVendedorM = {
            dataInicio: $scope.filtro.dataInicial,
            dataFim: $scope.filtro.dataFim, 
            local: $scope.filtro.local,            
            codigo: codigo,           
            nome:nome,                   
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'margemVendGrupo/',
                method: 'POST',
                data: {'margemVendGrupo':  $scope.infoVendedorM},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.infoVendedorGrupo = event.data;              
                $scope.dataTablesModal(1);
                $scope.divVendGrupo = true;
                $scope.divVendedor = true;
                $scope.marcaValue = '';
                $('#modalVendGrupo').trigger('click'); 
                
            }).catch(function(err){   
                console.log(err);            
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.4');
                };                      
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };

    //========== PESQUISA GRUPO -> MARCA  - ESSA FUNÇÃO É APENAS PARA CHAMAR A FUNÇÃO MARGEM GRUPO MARCA ECOMMERCE ==========//
    $scope.margemGrup = function(codigo, nome, value){
        $scope.infoVendedorM = {
            codigo: ''
        };
        $scope.divVendedor = false;
        $scope.marcaValue = value;
        $scope.margemGrupoMarcaEcommerce(codigo,nome,value);
    };

    //========== PESQUISA VENDEDOR - > GRUPO -> MARCA ==========//
    $scope.margemGrupoMarcaEcommerce = function(codigo,nome,value){
        $scope.grupoMarca = [];
        $scope.infoMarcaGrupo = {
            codigoVendedor: $scope.infoVendedorM.codigo,
            dataInicio: $scope.filtro.dataInicial,
            dataFim: $scope.filtro.dataFim, 
            local: $scope.filtro.local,            
            codigo: codigo,
            nome: nome,
            canalMenu: $scope.filtro.canalMenu
        };
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'margemGrupoMarcaEcommerce/',
                method: 'POST',
                data: {'margemGrupoMarcaEcommerce':  $scope.infoMarcaGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;               
                $scope.grupoMarca = event.data; 
                if(value == 4){
                    $('#modalVendGrupo').trigger('click'); 
                }
                $scope.dataTablesModal(2);                     
                $scope.divGrupoMarca = true;
                $scope.divVendGrupo = false;  
            }).catch(function(err){     
                console.log(err);          
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);     
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.5');  
                };                      
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };

    //========== PESQUISA MARCA - > PRODUTO  - ESSA FUNÇÃO É APENAS PARA CHAMAR A FUNÇÃO MARGEM GRUP MR PRODUTO ECOMMERCE ==========//
    $scope.margemPorMarca = function(marca, value){
        $scope.infoMarcaGrupo = {
            codigoVendedor:  '',         
            codigo: '',
            canalMenu: $scope.filtro.canalMenu            
        };
        $scope.margemGrupMarProdutoEcommerce(marca, value);

    };

    //========== PESQUISA VENDEDOR - > GRUPO -> MARCA - > PRODUTO ==========//  
    $scope.margemGrupMarProdutoEcommerce = function(marca,value){ 
        $scope.marcaProduto = [];
        $scope.infoProdutoMarca = {
            codigoVendedor:  $scope.infoMarcaGrupo.codigoVendedor,
            dataInicio: $scope.filtro.dataInicial,
            grupo: $scope.infoMarcaGrupo.codigo,  
            dataFim: $scope.filtro.dataFim,  
            local: $scope.filtro.local,           
            marca:marca,
            canalMenu: $scope.infoMarcaGrupo.canalMenu
        };
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'margemGrupMarProdutoEcommerce/',
                method: 'POST',
                data: {'margemGrupMarProdutoEcommerce':  $scope.infoProdutoMarca},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.marcaProduto = event.data; 
                if(value == 3){
                    $('#modalVendGrupo').trigger('click'); 
                }
                $scope.dataTablesModal(3);                       
                $scope.divGrupoMarca = false;                
                $scope.divMarcaProduto = true;                 
            }).catch(function(err){           
                console.log(err);    
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.6');  
                };                     
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };
    
    //========== PESQUISA SEM ETIQUETA -> NOTAS/PRODUTOS  ==========//
    $scope.nfSemEtiquetaEcommerce = function(data,empresa,semEtiqueta){
        $scope.semEtiqueNotas = [];
        $scope.infoSemEtiqueta = {
            semEtiqueta: semEtiqueta,
            empresa: empresa,
            data: data,
            canalMenu: $scope.filtro.canalMenu
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'nfSemEtiquetaEcommerce/',
                method: 'POST',
                data: {'nfSemEtiquetaEcommerce': $scope.infoSemEtiqueta},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;               
                $scope.semEtiqueNotas = event.data.pesquisaSemEtiqueta; 
                $scope.dataTablesModal(9);
                $('#modalSemEtiqueta').trigger('click'); 
            }).catch(function(err){    
                console.log(err);           
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.7');   
                };                    
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };

    //========== PESQUISA VENDEDOR - > MARCA -> PRODUTO  ==========//
    $scope.margemMarcaProdutoEcommerce = function(marca){ 
        $scope.infoMarca = {
            'dataInicio': $scope.visEcmVisaoGeral.margemPorVendedor.dataInicio,
            'dataFim': $scope.visEcmVisaoGeral.margemPorVendedor.dataFim,              
            'marca': marca           
        }; 
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'margemMarcaProdutoEcommerce/',
                method: 'POST',
                data: {'margemMarcaProduto': $scope.infoMarca},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.infoMarcaProduto  = event.data;               
                $('#modalMarca').trigger('click');           
            }).catch(function(err){    
                console.log(err)           
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.8');    
                };                      
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };      
    };

    //========== PESQUISA PRODUÇÃO - > PRODUTOS CHECKTOU E IMPRESSÃO  ==========//
    $scope.producaoCIProdutoEcommerce = function(data,empresa,total,value){
        $scope.infoProdutosProducao = [];
        $scope.contagemProducao  = 10;  
        $scope.infoProducao = {
            empresa: empresa,
            total: total,
            value: value,
            data: data,
            diaCheckout: '',
            canalMenu: $scope.filtro.canalMenu          
        };        
        if(value == 3 || value == 4){
            $scope.infoProducao.diaCheckout =  $scope.infoDiasProducao.diaCheckout
        }        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'producaoCIProdutoEcommerce/',
                method: 'POST',
                data: {'producaoCIProdutoEcommerce': $scope.infoProducao},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){     
                $scope.transPend.visaoGeral = false;          
                $scope.marginTop = '50px';
                $scope.marginBot = '20px';
                $scope.auto = 'auto'; 
                         
                if(value == 1 || value == 2){
                   
                    $scope.divSegunda = false;
                    $scope.divPrimeira = false;
                    $scope.infoDiasProducao = event.data.producaoCIProdutos; 
                    $scope.total =  $scope.infoProducao.total;
                    $scope.valor = value;
                   
                    if(value == 1){
                        $scope.valorPesquisa = 3;
                    }else if(value == 2){
                        $scope.valorPesquisa = 4;
                    }
                    $scope.data = $scope.infoProducao.data                   
                                     
                    $scope.divPrimeira = true;
                    $scope.tamanhoModal = '55%'; 
                    $scope.dataTablesModal(10)
                    $('#modalProdProducao').trigger('click');         
                }
                else if(value == 3 || value == 4){
                    $scope.tamanhoModal = '65%'; 
                    $scope.infoProduto = event.data.producaoCIProdutos;                   
                    $scope.divPrimeira = false;
                    $scope.divSegunda = true;
                    $scope.dataTablesModal(11)
                };
            }).catch(function(err){ 
                console.log(err)           
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.9');    
                };                    
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
    };
    
    //========== PESQUISA ESTOQUE - > GRUPO -> MARCA - > PRODUTOS  ==========//
    $scope.pesquisaEstoque = function(empresa, value, grupo, nomeGrupo, marca){
        $scope.empresa = {
            value: value,
            empresa: empresa,
            grupo: grupo,
            nomeGrupo,
            marca: marca           
        };      
       
        $http({
            url: $scope.baseApi + 'pesquisaEstoque/',
            method: 'POST',
            data: {'pesquisaEstoque': $scope.empresa},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }        
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;  
             
            if (value == 1){             
                $scope.grupoEstoque = event.data.estoqueGrupo;  
                $('#modalEstoquePesquisa').trigger('click'); 
                $scope.dataTablesModal(5);
                $scope.showDivGrupo = true;  
            }else if (value == 2){
                $scope.marcaEstoque = event.data.estoqueMarca;
                $scope.showDivGrupo = false;          
                $scope.dataTablesModal(6) ;
                $scope.showDivMarca = true;                 
            }else if (value == 3){
                $scope.produtosEstoque = event.data.estoqueProdutos;
                $scope.showDivGrupo = false;
                $scope.showDivMarca = false;           
                $scope.dataTablesModal(7);
                $scope.showDivProduto = true;    
            };    

        }).catch(function(err){            
            console.log(err);
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.11');  
            };  
        });    
    };

    //========== PESQUISA PARA PESQUISA OS PRODUTOS DA CAMPANHA ==========//
    $scope.ecommercePesquisarProdutoCampanha = function(id,nome,inicio,fim,canal){
        $scope.infoCampanha= {
            inicio: inicio,
            canal: canal,
            nome: nome,
            fim: fim,
            id: id          
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ecommercePesquisarProdutoCampanha/',
                method: 'POST',
                data: {'ecommercePesquisarProdutoCampanha': $scope.infoCampanha},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;
                var campanhaProduto = event.data.campanhaProduto
                if(campanhaProduto.error == true){
                    growl.warning('<b>ATENÇÃO</b><br> Não existe produtos cadastrados na campanha');      
                }else{
                    $scope.produtoCampanha = campanhaProduto.data;
                    $scope.divProdutosCampanha = true;
                    $('#modalProdutosDaCampanha').trigger('click');
                };
                   
            }).catch(function(err){ 
                console.log(err);           
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.12');    
                };                      
            })  
        }else
        {
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };  
        
    };

    //========== MENU ECOMMERCE ==========//
    $scope.menuEcommerceGeral = function(){
        $http({
            url: $scope.baseApi + 'menuEcommerceGeral/',
            method: 'POST',
            data: {'menuEcommerceGeral':$scope.filtro},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }        
        }).then(function(event){  
            $scope.transPend.visaoGeral = false;              
            $scope.menuEcommerce = event.data;         
            $scope.visEcmVisaoGeral.visaogeral = $scope.menuEcommerce.topo;
            if($scope.menuEcommerce.site == true && $scope.menuEcommerce.mkt == true){
                $scope.selectTodos = true
                $scope.canalMenu = {
                    id: '01'
                }
            }else{
                $scope.selectUnico = true;
                $scope.canalMenu = {
                    id: $scope.menuEcommerce.canal[0].id                  
                }
            };       
                             
        }).catch(function(err){            
            console.log(err);
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.10');  
            };  
        });       
    };

    //========== GET INFO RECLAME AQUI ==========//
    $scope.reclameAqui = function(){
        //========== ELETRUM  ==========//
        $http({
            url: 'https://iosite.reclameaqui.com.br/raichu-io-site-v1/company/public/ToIxqXSojcZC7PxB',
            method: 'GET',          
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
        }).then(function(event){   
            $scope.transPend.visaoGeral = false;
            var recebe = event.data; 
            $scope.filtro.seisMesesEletrum = recebe.companyIndex6Months;                                     
        }).catch(function(err){  
            console.log(err);        
            $scope.transPend.visaoGeral = false;  
            growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.13');   
        });

        //========== COMPREI E MEU ==========//
        $http({
            url: 'https://iosite.reclameaqui.com.br/raichu-io-site-v1/company/public/88593',
            method: 'GET',          
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
        }).then(function(event){   
            $scope.transPend.visaoGeral = false; 
            var recebe = event.data;    
            $scope.filtro.seisMesesComprei = recebe.companyIndex6Months;  
                       
        }).catch(function(err){  
            console.log(err);        
            $scope.transPend.visaoGeral = false;  
            growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 3.14');   
        });  

    };

    $scope.dadosReclameAqui = function(value,dados){
        if (value == 1){
            $scope.reclameAquiNome = 'Comprei e Meu';
        }else{
            $scope.reclameAquiNome = 'Eletrum';
        };

        $('#modalReclameAqui').trigger('click'); 

        $scope.reclameAquiReclamacoes = dados.totalComplains;
        $scope.reclameAquiRespondidas = dados.totalAnswered;
        $scope.reclameAquiNaoRespondidas = dados.totalNotAnswered;
        $scope.reclameAquiAvaliadas = dados.totalEvaluated;


        /*========== RECLAME AQUI ==========*/      
        var gaugeOptions = {

            chart: {
                type: 'solidgauge'
            },
        
            title: null,
        
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
        
            tooltip: {
                enabled: false
            },
        
            // the value axis
            yAxis: {
                stops: [
                    [0.3, '#DF5353'], // RED
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#55BF3B'] // GREEN
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
        
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };         
        
        /*========== RECLAME AQUI - RECLAMAÇÕES RESPONDIDAS  ==========*/   
        var chartSpeed = Highcharts.chart('hcReclameAquiRR', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'RECLAMAÇÕES RESPONDIDAS',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px'
                        
                    }
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Reclamações respondidas',
                data: [parseFloat(dados.answeredPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));

        /*========== RECLAME AQUI - VOLTARIA A FAZER NEGÓCIO ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiVFN', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {                    
                    text:'VOLTARIA A FAZER NEGÓCIO',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px' 
                    }
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Voltaria a Fazer Negócio',
                data: [parseFloat(dados.dealAgainPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));

        /*========== RECLAME AQUI - INDICE DE SOLUÇÃO ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiIS', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {                   
                    text:'ÍNDICE DE SOLUÇÃO',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px' 
                    }
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Índice de Solução',
                data: [parseFloat(dados.solvedPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));

        /*========== RECLAME AQUI - NOTA DO CONSUMIDOR ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiNC', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 10,
                title: {
                    text: 'NOTA DO CONSUMIDOR',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '15px' 
                    }
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Nota do Consumidor',
                data: [parseFloat(dados.consumerScore)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));

    };

    //========== CHAMADA DE FUNÇÃO ==========//
    $scope.menuEcommerceGeral();
    $scope.filtroMenuSetarFalse();
    $scope.reclameAqui();

    //========== DATA TABLE ==========//
    $scope.filtroMenus = function(){

        //========== METAS ==========//  
        if($scope.filtro.filtroMenu == "01" || $scope.filtro.filtroMenu == "02"){
            $scope.cardMetas = true; 
            $scope.metaTotal = {
                meta: 0,
                valor: 0 
            };
            
            $scope.metaSite = {
                meta: 0,
                valor: 0 
            };
            
            $scope.metaMkt = {
                meta: 0,
                valor: 0 
            };
            
            if ($scope.visEcmVisaoGeral.metas != null){
                for(var i = 0; i < $scope.visEcmVisaoGeral.metas.length; i++){
                    if($scope.filtro.canalMenu == "01"){
                        if ($scope.visEcmVisaoGeral.metas[i].meta == "TOTAL") {                           
                            $scope.metaTotal.meta = $scope.visEcmVisaoGeral.metas[i].valor
                        };
                    };

                    if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "02"){
                        if ($scope.visEcmVisaoGeral.metas[i].meta == "SITE") {                       
                            $scope.metaSite.meta = $scope.visEcmVisaoGeral.metas[i].valor
                        };
                    };
                    
                    if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "03"){                        
                        if ($scope.visEcmVisaoGeral.metas[i].meta == "MKT") {                          
                            $scope.metaMkt.meta = $scope.visEcmVisaoGeral.metas[i].valor
                        
                        };
                    };
                       
                };
    
                for(var i = 0; i < $scope.visEcmVisaoGeral.visaogeral.length; i++){
                    if($scope.filtro.canalMenu == "01"){
                        if ($scope.visEcmVisaoGeral.visaogeral[i].tipo == "Total"){
                            $scope.metaTotal.valor = $scope.visEcmVisaoGeral.visaogeral[i].valor
                        };
                    };

                    if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "02"){
                        if ($scope.visEcmVisaoGeral.visaogeral[i].tipo == "Site"){
                            $scope.metaSite.valor = $scope.visEcmVisaoGeral.visaogeral[i].valor
                        } ;
                    };    

                    if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "03" ){
                      
                        if ($scope.visEcmVisaoGeral.visaogeral[i].tipo == "Marketplace"){                          
                            $scope.metaMkt.valor = $scope.visEcmVisaoGeral.visaogeral[i].valor
                        } ;
                    };                                
                };
            };
   
            var diasTotal = [];
            var diasMkt = [];
            var diasSite = [];
            
            var vlDiasTotal = 0;
            var vlDiasMkt = 0;
            var vlDiasSite = 0;     
            for(var i =0; i < $scope.visEcmVisaoGeral.vendaspordata.categories.length; i++){
                if($scope.metaTotal.meta > 0){                
                    vlDiasTotal = $scope.metaTotal.meta / $scope.qtdDiasDoMes;
                    diasTotal.push(parseFloat(vlDiasTotal.toFixed(2)));                      
                };

                if($scope.metaSite.meta > 0){
                    vlDiasSite = $scope.metaSite.meta / $scope.qtdDiasDoMes;
                    diasSite.push(parseFloat(vlDiasSite.toFixed(2)));
                };

                if($scope.metaMkt.meta > 0){
                    vlDiasMkt = $scope.metaMkt.meta / $scope.qtdDiasDoMes;
                    diasMkt.push(parseFloat(vlDiasMkt.toFixed(2)));
                };
               
            };
            $scope.totalMeta = diasTotal;       
            $scope.mktMeta = diasMkt;
            $scope.siteMeta = diasSite;
            var categories = []
            var totalValor = []
            var totalProjecao = []
            var totalMeta = []

            /*========================= GERAL =========================*/
            if($scope.filtro.canalMenu == "01"){
                totalValor.push($scope.visEcmVisaoGeral.visaogeral[0].valor,$scope.visEcmVisaoGeral.visaogeral[1].valor,$scope.visEcmVisaoGeral.visaogeral[2].valor);
                totalProjecao.push($scope.valorExtimadoTotal,$scope.valorExtimadoSite,$scope.valorExtimadoMkt);
                totalMeta.push($scope.metaTotal.meta,$scope.metaSite.meta,$scope.metaMkt.meta);
                categories.push('Total');
                /*========================= META -  GERAL  =========================*/
                Highcharts.chart('hcMetaGeral', {
                        chart: {
                            type: 'gauge',
                            plotBackgroundColor: null,
                            plotBackgroundImage: null,
                            plotBorderWidth: 0,
                            plotShadow: false
                        },
                        title: {
                            text: 'Meta Geral'
                        },
                        subtitle: {
                            text: 'R$ ' + ($scope.metaTotal.meta).toLocaleString('pt-BR')
                        },
                        pane: {
                            startAngle: -150,
                            endAngle: 150,
                            background: [{
                                backgroundColor: {
                                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                    stops: [
                                        [0, '#FFF'],
                                        [1, '#333']
                                    ]
                                },
                                borderWidth: 0,
                                outerRadius: '109%'
                            }, {
                                backgroundColor: {
                                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                    stops: [
                                        [0, '#333'],
                                        [1, '#FFF']
                                    ]
                                },
                                borderWidth: 1,
                                outerRadius: '107%'
                            }, {
                                // default background
                            }, {
                                backgroundColor: '#DDD',
                                borderWidth: 0,
                                outerRadius: '105%',
                                innerRadius: '103%'
                            }]
                        },
                        // the value axis
                        yAxis: {
                            min: 0,
                            max: 200,
                            minorTickInterval: 'auto',
                            minorTickWidth: 1,
                            minorTickLength: 10,
                            minorTickPosition: 'inside',
                            minorTickColor: '#666',
                            tickPixelInterval: 30,
                            tickWidth: 2,
                            tickPosition: 'inside',
                            tickLength: 10,
                            tickColor: '#666',
                            labels: {
                                step: 2,
                                rotation: 'auto'
                            },
                            title: {
                                text: '%'
                            },
                            plotBands: [{
                                from: 0,
                                to: 120,
                                color: '#55BF3B' // green
                            }, {
                                from: 120,
                                to: 160,
                                color: '#DDDF0D' // yellow
                            }, {
                                from: 160,
                                to: 200,
                                color: '#DF5353' // red
                            }]
                        },
        
                        series: [{
                            name: 'Meta',
                            data: [ Math.round(($scope.metaTotal.valor * 100) / $scope.metaTotal.meta) ],
                            tooltip: {
                                valueSuffix: ' %'
                            }
                        }]
                });

                /*========================= META E VENDAS POR DATA - GERAL =========================*/    
                Highcharts.chart('hcMetaseVendas', {
                    chart: {
                        type: 'line',
                        height: 500
                    },
                    title: {
                        text: 'Meta e Vendas Por Data'
                    },
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendaspordata.categories
                    },         
                    
                    yAxis: {
                        title: {
                            text: 'Valores'
                        }
                    },
                    tooltip: {
                        shared: true,
                        valuePrefix: 'R$ ',              
                    },
                    series:
                    [   {                
                            name: 'Meta Total',
                            data:  $scope.totalMeta                    
                        },         
                        {                
                            name: $scope.visEcmVisaoGeral.vendaspordata.series[0].name,
                            data: $scope.visEcmVisaoGeral.vendaspordata.series[0].data,
                            events: {
                                click: function (event) {  
                                    $scope.infoFaturamento.diaPesquisa = '';
                                    $scope.infoFaturamento.totalDia = '';
                                    $scope.infoFaturamento.validacao = '';
                                    if(event.point.options.y > 0){
                                        var auxiliar = event.point.category.split(' ');
                                        $scope.infoFaturamento.diaPesquisa = auxiliar[0];
                                        $scope.infoFaturamento.totalDia = event.point.options.y;  
                                        $scope.infoFaturamento.validacao = 'T';
                                        $scope.faturamentoDiaProduto();
                                    }else{                               
                                        growl.warning('<b>ATENÇÃO</b><br>O dia selecionado não houve faturamento!'); 
                                    };
                                    
                                }
                            }   
                        },
                        {
                            name: 'Meta Marketplace',
                            data:  $scope.mktMeta
                        },              
                        {
                            name: $scope.visEcmVisaoGeral.vendaspordata.series[1].name,
                            data: $scope.visEcmVisaoGeral.vendaspordata.series[1].data,
                            events: {
                                click: function (event) {  
                                    $scope.infoFaturamento.diaPesquisa = '';
                                    $scope.infoFaturamento.totalDia = '';
                                    $scope.infoFaturamento.validacao = '';
                                    if(event.point.options.y > 0){
                                        var auxiliar = event.point.category.split(' ');
                                        $scope.infoFaturamento.diaPesquisa = auxiliar[0];
                                        $scope.infoFaturamento.totalDia = event.point.options.y;
                                        $scope.infoFaturamento.validacao = 'M';
                                        $scope.faturamentoDiaProduto();
                                    }else{                               
                                        growl.warning('<b>ATENÇÃO</b><br>O dia selecionado não houve faturamento!'); 
                                    };
                                    
                                }
                            }   
                        },
                        {                
                            name: 'Meta Site',
                            data:  $scope.siteMeta
                        },             
                        {
                            name: $scope.visEcmVisaoGeral.vendaspordata.series[2].name,
                            data: $scope.visEcmVisaoGeral.vendaspordata.series[2].data,
                            events: {
                                click: function (event) {  
                                    $scope.infoFaturamento.diaPesquisa = '';
                                    $scope.infoFaturamento.totalDia = '';
                                    $scope.infoFaturamento.validacao = '';
                                    if(event.point.options.y > 0){
                                        var auxiliar = event.point.category.split(' ');
                                        $scope.infoFaturamento.diaPesquisa = auxiliar[0];
                                        $scope.infoFaturamento.totalDia = event.point.options.y;
                                        $scope.infoFaturamento.validacao = 'S';
                                        $scope.faturamentoDiaProduto();
                                    }else{                               
                                        growl.warning('<b>ATENÇÃO</b><br>O dia selecionado não houve faturamento!'); 
                                    };
                                    
                                }
                            }   
                        }
                    ]       
                });                
            };

            
            /*========================= SITE =========================*/
            if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "02"){
                categories.push('Site');

                /*========================= META =========================*/
                Highcharts.chart('hcMetaSite', {
                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Meta Site'
                    },
                    subtitle: {
                        text: 'R$ ' + ($scope.metaSite.meta).toLocaleString('pt-BR')
                    },
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },
        
                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 200,
        
                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',
        
                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: '%'
                        },
                        plotBands: [{
                            from: 0,
                            to: 120,
                            color: '#55BF3B' // green
                        }, {
                            from: 120,
                            to: 160,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 160,
                            to: 200,
                            color: '#DF5353' // red
                        }]
                    },
        
                    series: [{
                        name: 'Meta',
                        data: [ Math.round(($scope.metaSite.valor * 100) / $scope.metaSite.meta) ],
                        tooltip: {
                            valueSuffix: ' %'
                        }
                    }]
        
                });

                /*========================= META E VENDAS POR DATA =========================*/
                if($scope.filtro.canalMenu == "02"){
                    totalValor.push($scope.visEcmVisaoGeral.visaogeral[0].valor);
                    totalProjecao.push($scope.valorExtimadoSite);
                    totalMeta.push($scope.metaSite.meta);
                    
                    Highcharts.chart('hcMetaseVendas', {
                        chart: {
                            type: 'line',
                            height: 500
                        },
                        title: {
                            text: 'Meta e Vendas Por Data'
                        },
                        xAxis: {
                            categories: $scope.visEcmVisaoGeral.vendaspordata.categories
                        },         
                        
                        yAxis: {
                            title: {
                                text: 'Valores'
                            }
                        },
                        tooltip: {
                            shared: true,
                            valuePrefix: 'R$ ',              
                        },
                        series:
                        [          
                            {                
                                name: 'Meta Site',
                                data:  $scope.siteMeta
                            },             
                            {
                                name: $scope.visEcmVisaoGeral.vendaspordata.series[2].name,
                                data: $scope.visEcmVisaoGeral.vendaspordata.series[2].data,
                                events: {
                                    click: function (event) {  
                                        $scope.infoFaturamento.diaPesquisa = '';
                                        $scope.infoFaturamento.totalDia = '';
                                        $scope.infoFaturamento.validacao = '';
                                        if(event.point.options.y > 0){
                                            var auxiliar = event.point.category.split(' ');
                                            $scope.infoFaturamento.diaPesquisa = auxiliar[0];
                                            $scope.infoFaturamento.totalDia = event.point.options.y;
                                            $scope.infoFaturamento.validacao = 'S';
                                            $scope.faturamentoDiaProduto();
                                        }else{                               
                                            growl.warning('<b>ATENÇÃO</b><br>O dia selecionado não houve faturamento!'); 
                                        };
                                        
                                    }
                                }   
                            }
                        ]       
                    });
                    
                };

                
            };
            
            /*========================= MARKETPLACE =========================*/
            if($scope.filtro.canalMenu == "01" || $scope.filtro.canalMenu == "03"){
                categories.push('Marketplace');

                /*========================= META =========================*/
                Highcharts.chart('hcMetaMkt', {
                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage: null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title: {
                        text: 'Meta Marketplace'
                    },
                    subtitle: {
                        text: 'R$ ' + ($scope.metaMkt.meta).toLocaleString('pt-BR')
                    },
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#FFF'],
                                    [1, '#333']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '109%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#333'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '107%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#DDD',
                            borderWidth: 0,
                            outerRadius: '105%',
                            innerRadius: '103%'
                        }]
                    },
        
                    // the value axis
                    yAxis: {
                        min: 0,
                        max: 200,
        
                        minorTickInterval: 'auto',
                        minorTickWidth: 1,
                        minorTickLength: 10,
                        minorTickPosition: 'inside',
                        minorTickColor: '#666',
        
                        tickPixelInterval: 30,
                        tickWidth: 2,
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#666',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: '%'
                        },
                        plotBands: [{
                            from: 0,
                            to: 120,
                            color: '#55BF3B' // green
                        }, {
                            from: 120,
                            to: 160,
                            color: '#DDDF0D' // yellow
                        }, {
                            from: 160,
                            to: 200,
                            color: '#DF5353' // red
                        }]
                    },
        
                    series: [{
                        name: 'Meta',
                        data: [ Math.round(($scope.metaMkt.valor * 100) / $scope.metaMkt.meta) ],
                        tooltip: {
                            valueSuffix: ' %'
                        }
                    }]
        
                });

                /*========================= META E VENDAS POR DATA =========================*/
                if( $scope.filtro.canalMenu == "03"){

                    totalValor.push($scope.visEcmVisaoGeral.visaogeral[0].valor);
                    totalProjecao.push($scope.valorExtimadoMkt);
                    totalMeta.push($scope.metaMkt.meta);    
                    Highcharts.chart('hcMetaseVendas', {
                        chart: {
                            type: 'line',
                            height: 500
                        },
                        title: {
                            text: 'Meta e Vendas Por Data'
                        },
                        xAxis: {
                            categories: $scope.visEcmVisaoGeral.vendaspordata.categories
                        },         
                        
                        yAxis: {
                            title: {
                                text: 'Valores'
                            }
                        },
                        tooltip: {
                            shared: true,
                            valuePrefix: 'R$ ',              
                        },
                        series:
                        [   
                            {
                                name: 'Meta Marketplace',
                                data:  $scope.mktMeta
                            },              
                            {
                                name: $scope.visEcmVisaoGeral.vendaspordata.series[1].name,
                                data: $scope.visEcmVisaoGeral.vendaspordata.series[1].data,
                                events: {
                                    click: function (event) {  
                                        $scope.infoFaturamento.diaPesquisa = '';
                                        $scope.infoFaturamento.totalDia = '';
                                        $scope.infoFaturamento.validacao = '';
                                        if(event.point.options.y > 0){
                                            var auxiliar = event.point.category.split(' ');
                                            $scope.infoFaturamento.diaPesquisa = auxiliar[0];
                                            $scope.infoFaturamento.totalDia = event.point.options.y;
                                            $scope.infoFaturamento.validacao = 'M';
                                            $scope.faturamentoDiaProduto();
                                        }else{                               
                                            growl.warning('<b>ATENÇÃO</b><br>O dia selecionado não houve faturamento!'); 
                                        };
                                        
                                    }
                                }   
                            }
                        ]       
                    });
                };

                
            };

     
            /*========================= PROJEÇÃO PARA FATURAMENTO  =========================*/  
            if($scope.valorExtimadoTotal > 0 ||  $scope.valorExtimadoSite > 0 || $scope.valorExtimadoMkt > 0){
                Highcharts.chart('hcProjecaoFaturamento', {
                    chart: {
                        type: 'column',
                        height: 400
                    },
                    title: {
                        text: 'Projeção de Faturamento'
                    },            
                    xAxis: {
                        categories: categories
                    },

                yAxis: [{
                        min: 0,
                        title: {
                            text: 'Projeção de Faturamento'
                        }
                    }, {
                        title: {
                            text: 'Total'
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
                    series: [                    
                        
                        {
                            name: 'Faturado',
                            color: 'rgb(157,199,241)',
                            data: totalValor,
                            pointPadding: 0.3,
                            pointPlacement: -0.2,
                            tooltip: {
                                valuePrefix: 'R$ ',                       
                            },
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}',
                                rotation: 0,
                                color: '#FFFFFF',
                                align: 'right',
                                y: 12, // 12 pixels down from the top
                                style: {
                                    fontSize: '11px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },            
                        {
                            name: 'Projeção de Faturamento',
                            color: 'rgb(89,100,114)',
                            data: totalProjecao,
                            pointPadding: 0.4,
                            pointPlacement: -0.2,
                            tooltip: {
                                valuePrefix: 'R$ ',                       
                            },
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}',
                                rotation: 0,
                                color: '#FFFFFF',
                                align: 'right',
                                y: 12, // 12 pixels down from the top
                                style: {
                                    fontSize: '11px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }                        
                        },
                        {
                            name: 'Meta',
                            color: 'rgb(130,202,122)',
                            data: totalMeta,
                            pointPadding: 0.45,
                            pointPlacement: -0.2,
                            tooltip: {
                                valuePrefix: 'R$ ',                       
                            },
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}',
                                rotation: 0,
                                color: '#FFFFFF',
                                align: 'right',
                                y: 12, // 12 pixels down from the top
                                style: {
                                    fontSize: '11px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        } 
                    ]               
                });  
            };  
        }; 

        //========== LOGÍSTICO ==========//  
        if($scope.filtro.filtroMenu == "01" || $scope.filtro.filtroMenu == "03"){
            $scope.cardLogistico = true; 
            //========== FILA PARA FATURAMENTO ==========//     
            $('#filaFaturamento').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "bFilter": false,
                "bInfo": false,          
                "paging": false,                     
                "data": $scope.visEcmVisaoGeral.filaparafaturamento.rows,                                
                "columns":  $scope.visEcmVisaoGeral.filaparafaturamento.cols,             
                "bDestroy": true,  
                "columnDefs": [{
                        "targets": [1,2], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       

                    var j = 1;               
                    while(j < nb_cols){                 

                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );

                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                               
            });

            //========== MARGEM POR VENDEDOR ==========//     
            var estoqueEcommerce = $('#estoqueEcommerce').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "bFilter": false,
                "bInfo": false,          
                "paging": false,           
                "data": $scope.visEcmVisaoGeral.ecEcommerce.rows,                                
                "columns":  $scope.visEcmVisaoGeral.ecEcommerce.cols,             
                "bDestroy": true,  
                "columnDefs": [{
                        "targets": [1,2], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {
                        "targets": 3,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idEstoqueEcommerce\" style="font-size:5px" class="btn btn-round  pull-right" type="button"><span style="font-size:8px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }

                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       

                    var j = 1;               
                    while(j < nb_cols){
                        if(j == 3){
                            break;
                        };

                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );

                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                               
            });

            $('#estoqueEcommerce tbody').off().on( 'click','button', function () {
                var action = this.id;
                if(action == "idEstoqueEcommerce"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = estoqueEcommerce.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = estoqueEcommerce.row( $(this).parents('tr') ).data();
                    };
                    $scope.pesquisaEstoque(record[0],1,'','','');
                };   
            }); 
             
        };

        //========== RECLAME AQUI ==========// 
        if($scope.filtro.filtroMenu =="01" || $scope.filtro.filtroMenu == "04"){
            $scope.cardReclameAqui = true; 
            var compreieMeu = $scope.visEcmVisaoGeral.reclameAqui.compreieMeu;
            var eletrum =  $scope.visEcmVisaoGeral.reclameAqui.eletrum;
            //========== COMPREI E MEU ==========// 
            if(parseFloat(compreieMeu.finalScore) < 5){
                $scope.imgComprei = '/mixtelDashboard/templates/LAYOUT/images/nao-recomendada.274e374b.png'    
            }else if(parseFloat(eletrum.finalScore) < 6){
                $scope.imgComprei = '/mixtelDashboard/templates/LAYOUT/images/ruim.c1a21379.png' 
            }else if(parseFloat(eletrum.finalScore) < 7){                          
                $scope.imgComprei = '/mixtelDashboard/templates/LAYOUT/images/regular.9aef4b69.png' 
            }else if(parseFloat(eletrum.finalScore) < 8){
                $scope.imgComprei = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
            }else{
                $scope.imgComprei = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
            };
            var dataI = compreieMeu.start.split("T")
            $scope.dataInicialComprei= dataI[0]
            var dataF = compreieMeu.end.split("T")
            $scope.dataFinalComprei = dataF[0]  
    
            $scope.compreieMeu = compreieMeu;

            //========== ELETRUM ==========// 
            if(parseFloat(eletrum.finalScore) < 5){
                $scope.imgEletrum = '/mixtelDashboard/templates/LAYOUT/images/nao-recomendada.274e374b.png'    
            }else if(parseFloat(eletrum.finalScore) < 6){
                $scope.imgEletrun = '/mixtelDashboard/templates/LAYOUT/images/ruim.c1a21379.png' 
            }else if(parseFloat(eletrum.finalScore) < 7){                          
                $scope.imgEletrun = '/mixtelDashboard/templates/LAYOUT/images/regular.9aef4b69.png' 
            }else if(parseFloat(eletrum.finalScore) < 8){
                $scope.imgEletrun = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
            }else{
                $scope.imgEletrun = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
            };
            var dataI = compreieMeu.start.split("T")
            $scope.dataInicialEletrum = dataI[0]
            var dataF = compreieMeu.end.split("T")
            $scope.dataFinalEletrum = dataF[0]  
            
            $scope.eletrumR = eletrum;
            
        };

        //========== MARGENS ==========//       
        if($scope.filtro.filtroMenu == "01" || $scope.filtro.filtroMenu == "05"){
            $scope.cardMargens = true; 

            //========== MARGEM POR VENDEDOR ==========//     
            var tableMV = $('#margemVendedor').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.visEcmVisaoGeral.margemPorVendedor.rows,                                
                "columns":  $scope.visEcmVisaoGeral.margemPorVendedor.cols,             
                "bDestroy": true,  
                "order": [[ 4, "desc" ]],
                "columnDefs": [{
                        "targets": [2,3,4,5,6,7], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {
                        "targets": 8,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idMvendedor\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }

                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       

                    var j = 2;               
                    while(j < nb_cols){
                        if(j == 6){
                            break;
                        };

                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );

                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                               
            });

            $('#margemVendedor tbody').off().on( 'click','button', function () {
                var action = this.id;
                if(action == "idMvendedor"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableMV.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableMV.row( $(this).parents('tr') ).data();
                    }
                    $scope.margemVendGrupo(record[0],record[1])
                }
                        
                
            });  

            //========== MARGEM POR GRUPO ==========//     
            var tableMP = $('#margemGrupo').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },          
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.visEcmVisaoGeral.margemPorGrupo.rows,                                
                "columns":  $scope.visEcmVisaoGeral.margemPorGrupo.cols,             
                "bDestroy": true,  
                "order": [[4, "desc" ]],
                "columnDefs": [{
                        "targets": [2,3,4,5,6,7], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {
                    "targets": 8,
                    "width": "5%",   
                    "className":"txtAlign",            
                    "defaultContent": '<button  id=\"idMGrupo\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }

                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       

                    var j = 2;               
                    while(j < nb_cols){
                        if(j == 6){
                            break;
                        };

                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );

                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                               
            });

            $('#margemGrupo tbody').off().on( 'click','button', function () {
                var action = this.id;
                if(action == "idMGrupo"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableMP.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableMP.row( $(this).parents('tr') ).data();
                    }
                    $scope.margemGrup(record[0],record[1],4);               
                };                   
                
            });  
            
            //========== MARGEM POR MARCA ==========//     
            var tableMM = $('#margemMarca').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.visEcmVisaoGeral.margemPorMarca.rows,                                
                "columns":  $scope.visEcmVisaoGeral.margemPorMarca.cols,             
                "bDestroy": true,  
                "order": [[ 3, "desc" ]],
                "columnDefs": [{
                        "targets": [1,2,3,4,5,6], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {                  
                        "targets": 7,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idmMarca\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }

                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       

                    var j = 1;               
                    while(j < nb_cols){
                        if(j == 5){
                            break;
                        };

                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );

                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });

            $('#margemMarca tbody').off().on( 'click','button', function () {
                
                var action = this.id;
                if(action == "idmMarca"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableMM.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableMM.row( $(this).parents('tr') ).data();
                    }
                    $scope.margemPorMarca(record[0], 3)
                
                }
            }); 
        }; 

        //========== CAMPANHAS ==========// 
        if($scope.filtro.filtroMenu == "01" || $scope.filtro.filtroMenu == "06"){
            if($scope.visEcmVisaoGeral.campanhas.error == true){
                growl.warning('<b>ATENÇÃO!</b><br>Não existe campanha cadastrada');    
            }else{
                $scope.cardCampanhas = true;    
            
                var tableCampanhas = $('#campanhas').DataTable({
                    "language": {
                        "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                    },   
                    "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                    "iDisplayLength": 10,            
                    "data": $scope.visEcmVisaoGeral.campanhas.rows,                                
                    "columns":  $scope.visEcmVisaoGeral.campanhas.cols,             
                    "bDestroy": true,  
                    "columnDefs": [  
                        {   
                            "targets":[3,4],  
                            "render": function(data, type, row){
                            if(type === "sort" || type === "type"){
                                return data;
                            }
                            return moment(data).format("DD-MM-YYYY ");
                        }
                    
                        },               
                        {
                        "targets": 6,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idCampanhas\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                        }

                    ],
                                                                                
                });

                $('#campanhas tbody').off().on( 'click','button', function () {
                    var action = this.id;
                    if(action == "idCampanhas"){
                        var tr=$(this).parents('tr');
                        if ($(tr).hasClass("child")){
                        var record = tableCampanhas.row( $(this).parents('tr').prev('tr') ).data();
                        }else{
                        var record = tableCampanhas.row( $(this).parents('tr') ).data();
                        };           
                        $scope.ecommercePesquisarProdutoCampanha(record[0], record[1], record[3], record[4], record[2])
                    };  
                }); 
            };  
        }; 

        //========== VENDAS ==========// 
        if($scope.filtro.filtroMenu == "01" || $scope.filtro.filtroMenu == "07"){
            $scope.cardVendas = true;   

            /*========================= VENDAS POR FABRICANTE  =========================*/
            Highcharts.chart('hcVendasPorFabricante', {
            chart: {
                    type: 'column',
                    height: 500
                    
                },
                title: {
                    text: 'Vendas Por Fabricante'
                },            
                xAxis: {
                    categories: $scope.visEcmVisaoGeral.vendasporfornecedor.categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:,.2f}'
                        }
                    },column: {
                        pointPadding: 0.3,
                        borderWidth: 0
                    }
                },
                series: [  
                    {   name:'Venda ',               
                        data: $scope.visEcmVisaoGeral.vendasporfornecedor.data ,
                        color: $scope.colorPassado                 
                    },             
                ]
            });   

            /*========================= VENDAS POR GRUPO  =========================*/
            Highcharts.chart('hcVendasPorGrupo', {
                chart: {
                    type: 'column',
                    height: 500
                    
                },
                title: {
                    text: 'Vendas Por Grupo'
                },            
                xAxis: {
                    categories: $scope.visEcmVisaoGeral.vendasporgrupo.categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:,.2f}'
                        }
                    },column: {
                        pointPadding: 0.3,
                        borderWidth: 0
                    }
                },
                series: [  
                    {   name:'Venda ',               
                        data: $scope.visEcmVisaoGeral.vendasporgrupo.data ,
                        color: $scope.colorPassado                 
                    },             
                ]
            });

            /*========================= VENDAS POR VENDEDOR, FORNECEDOR E GRUPO - SITE E MKT =========================*/
            if ($scope.filtro.canalMenu == "01"){
                $scope.cardVendasOut = true; 

                /*========================= VENDAS POR VENDEDOR  =========================*/
                Highcharts.chart('hcVendasPorVendedor', {
                    chart: {
                        type: 'column',
                        height: 500
                        
                    },
                    title: {
                        text: 'Vendas Por Vendedor'
                    },            
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendasporvendedor.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}'
                            }
                        },column: {
                            pointPadding: 0.3,
                            borderWidth: 0
                        }
                    },
                    series: [  
                        {   name:'Venda ',               
                            data: $scope.visEcmVisaoGeral.vendasporvendedor.data ,
                            color: $scope.colorPassado                 
                        },             
                    ]
                });


                /*========================= VENDAS POR FABRICANTE  =========================*/
                Highcharts.chart('hcVendasPorFabricanteSite', {
                    chart: {
                        type: 'column',
                        height: 500
                        
                    },
                    title: {
                        text: 'Vendas Por Fabricante - Site'
                    },            
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendasporfornecedorsite.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}'
                            }
                        },column: {
                            pointPadding: 0.3,
                            borderWidth: 0
                        }
                    },
                    series: [  
                        {   name:'Venda ',               
                            data: $scope.visEcmVisaoGeral.vendasporfornecedorsite.data ,
                            color: $scope.colorPassado                 
                        },             
                    ]
                });

                /*========================= VENDAS POR GRUPO =========================*/
                Highcharts.chart('hcVendasPorGrupoSite', {
                    chart: {
                        type: 'column',
                        height: 500
                        
                    },
                    title: {
                        text: 'Vendas Por Grupo - Site'
                    },            
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendasporgruposite.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}'
                            }
                        },column: {
                            pointPadding: 0.3,
                            borderWidth: 0
                        }
                    },
                    series: [  
                        {   name:'Venda ',               
                            data: $scope.visEcmVisaoGeral.vendasporgruposite.data ,
                            color: $scope.colorPassado                 
                        },             
                    ]
                }); 
                
                /*========================= VENDAS POR FABRINCATE =========================*/
                Highcharts.chart('hcVendasPorFabricanteMkt', {
                    chart: {
                        type: 'column',
                        height: 500
                        
                    },
                    title: {
                        text: 'Vendas Por Fabricante - Marktplace'
                    },            
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendasporfornecedormkt.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}'
                            }
                        },column: {
                            pointPadding: 0.3,
                            borderWidth: 0
                        }
                    },
                    series: [  
                        {   name:'Venda ',               
                            data: $scope.visEcmVisaoGeral.vendasporfornecedormkt.data ,
                            color: $scope.colorPassado                 
                        },             
                    ]
                });

                /*========================= VENDAS POR GRUPO =========================*/ 
                Highcharts.chart('hcVendasPorGrupoMkt', {
                    chart: {
                        type: 'column',
                        height: 500
                        
                    },
                    title: {
                        text: 'Vendas Por Grupo - Markplace'
                    },            
                    xAxis: {
                        categories: $scope.visEcmVisaoGeral.vendasporgrupomkt.categories,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:,.2f}'
                            }
                        },column: {
                            pointPadding: 0.3,
                            borderWidth: 0
                        }
                    },
                    series: [  
                        {   name:'Venda ',               
                            data: $scope.visEcmVisaoGeral.vendasporgrupomkt.data ,
                            color: $scope.colorPassado                 
                        },             
                    ]
                }); 
            };
        
            /*========================= VENDAS POR DATA - ALL  =========================*/
            Highcharts.chart('hcVendasPorDataAll', {
                chart: {
                    type: 'areaspline',
                    height: 500
                },
                title: {
                    text: 'Venda por data / canal'
                },
                legend: {
                    layout: 'horizontal'/*,
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'*/
                },
                xAxis: {
                    categories: $scope.visEcmVisaoGeral.vendaspordataporcanal.categories
                    /*plotBands: [{ // visualize the weekend
                        from: 4.5,
                        to: 6.5,
                        color: 'rgba(68, 170, 213, .2)'
                    }]*/
                },
                yAxis: {
                    /*title: {
                        text: 'Fruit units'
                    }*/
                },
                tooltip: {
                    shared: true,
                    valuePrefix: 'R$ '
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: $scope.visEcmVisaoGeral.vendaspordataporcanal.series
            });

            $scope.graficoAnualEcmVisaoGeral();              
            
        };
    };

    $scope.dataTablesModal = function(value){

        if(value == 1){

            var tableMVG = $('#margemVendedorG').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.infoVendedorGrupo.margemVendedorGrupo.rows,                                
                "columns":  $scope.infoVendedorGrupo.margemVendedorGrupo.cols,             
                "bDestroy": true, 
                "order": [[ 4, "desc" ]], 
                "columnDefs": [{
                        "targets": [2,3,4,5,6,7], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                   
                    },
                    {                  
                        "targets": 8,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idMvendedorG\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 2;               
                    while(j < nb_cols){
                        if(j == 6){
                            break;
                        };
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
            $('#margemVendedorG tbody').off().on( 'click','button', function () {
                var action = this.id;
                if(action == "idMvendedorG"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableMVG.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableMVG.row( $(this).parents('tr') ).data();
                    }
                    $scope.margemGrupoMarcaEcommerce(record[0], record[1],'')
                }
                        
                
            });
        
        }

        else if(value == 2){

            var tableMVGM = $('#margemVendedorGM').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.grupoMarca.margemVendedorGrupoMarca.rows,                                
                "columns":  $scope.grupoMarca.margemVendedorGrupoMarca.cols,             
                "bDestroy": true, 
                "order": [[ 3, "desc" ]], 
                "columnDefs": [{
                        "targets": [1,2,3,4,5,6], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {                  
                        "targets": 7,
                        "width": "5%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idMvendedorGM\" class="btn btn-round  pull-right" type="button"><span style="font-size:10px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 1;               
                    while(j < nb_cols){
                        if(j == 5){
                            break;
                        };
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
            $('#margemVendedorGM tbody').off().on( 'click','button', function () {
                
                var action = this.id;
                if(action == "idMvendedorGM"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableMVGM.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableMVGM.row( $(this).parents('tr') ).data();
                    };                   
                    $scope.margemGrupMarProdutoEcommerce(record[0],'');                 
                  
                };
            });
        }  
        
        else if(value == 3){
            $('#margemVendedorGMP').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.marcaProduto.margemMarcaProduto.rows,                                
                "columns":  $scope.marcaProduto.margemMarcaProduto.cols,             
                "bDestroy": true,
                "order": [[ 4, "desc" ]],  
                "columnDefs": [{
                        "targets": [2,3,4,5,6,7], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 2;               
                    while(j < nb_cols){                      
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });   
        }

        else if(value == 5){

            var tableEstoqueGrupo = $('#estoqueGrupo').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.grupoEstoque.rows,                                
                "columns":  $scope.grupoEstoque.cols,             
                "bDestroy": true,  
                "order": [[ 3, "desc" ]],
                "columnDefs": [{
                        "targets": [2,3], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {                  
                        "targets": 4,
                        "width": "2%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idEstoqueGrupo\" style="font-size:5px" class="btn btn-round  pull-right" type="button"><span style="font-size:8px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 2;               
                    while(j < nb_cols){
                        if(j == 4){
                            break;
                        };
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
            $('#estoqueGrupo tbody').off().on( 'click','button', function () {
                
                var action = this.id;
                if(action == "idEstoqueGrupo"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableEstoqueGrupo.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableEstoqueGrupo.row( $(this).parents('tr') ).data();
                    };                   
                    $scope.pesquisaEstoque($scope.empresa.empresa, 2, record[0], record[1],'')             
                  
                };
            });
        } 
        
        else if(value == 6){

            var tableEstoqueMarca = $('#estoqueMarca').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.marcaEstoque.rows,                                
                "columns":  $scope.marcaEstoque.cols,             
                "bDestroy": true,
                "order": [[2, "desc" ]],  
                "columnDefs": [{
                        "targets": [1,2], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    },
                    {                  
                        "targets": 3,
                        "width": "2%",   
                        "className":"txtAlign",            
                        "defaultContent": '<button  id=\"idEstoqueMarca\" style="font-size:5px" class="btn btn-round  pull-right" type="button"><span style="font-size:8px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 1;               
                    while(j < nb_cols){
                        if(j == 3){
                            break;
                        };
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
            $('#estoqueMarca tbody').off().on( 'click','button', function () {
                
                var action = this.id;
                if(action == "idEstoqueMarca"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableEstoqueMarca.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableEstoqueMarca.row( $(this).parents('tr') ).data();
                    };   
                    console.log(record)               
                    $scope.pesquisaEstoque($scope.empresa.empresa, 3, $scope.empresa.grupo, $scope.empresa.nomeGrupo,record[0])             
                  
                };
            });
        }  

        else if(value == 7){

            $('#estoqueProdutos').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.produtosEstoque.rows,                                
                "columns":  $scope.produtosEstoque.cols,             
                "bDestroy": true,
                "order": [[3, "desc" ]],    
                "columnDefs": [{
                        "targets": [2,3], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 2;               
                    while(j < nb_cols){                        
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });    
          
        }  

        else if(value == 8){

            $('#checkout').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.checkoutNotas.rows,                                
                "columns":  $scope.checkoutNotas.cols,             
                "bDestroy": true,  
                "columnDefs": [{
                        "targets": [5,6], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 5;               
                    while(j < nb_cols){                       
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });    
           
        } 
        
        else if(value == 9){

            $('#semEtiqueta').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.semEtiqueNotas.rows,                                
                "columns":  $scope.semEtiqueNotas.cols,             
                "bDestroy": true,  
                "columnDefs": [{
                        "targets": [5,6], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 5;               
                    while(j < nb_cols){                       
    
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });    
           
        }  

        else if(value == 10){

            var tableProducao = $('#producao').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.infoDiasProducao.rows,                                
                "columns":  $scope.infoDiasProducao.cols,             
                "bDestroy": true,  
                "columnDefs": [ 
                    {targets:0,  
                        render: function(data, type, row){
                        if(type === "sort" || type === "type"){
                            return data;
                        }
                        return moment(data).format("DD-MM-YYYY ");
                    }
                    
                    },                               
                    {                  
                        "targets": 2,
                        "width": "1%",  
                        "defaultContent": '<button  id=\"idProducaoCheckout\" style="font-size:5px" class="btn btn-round  pull-right" type="button"><span style="font-size:8px" class="glyphicon glyphicon-search" style="color:#2A3F54" aria-hidden="true"></span></button>'
                    }
    
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 1;               
                    while(j < nb_cols){                      
                        if(j == 2){
                            break;
                        };
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
            $('#producao tbody').off().on( 'click','button', function () {
                
                var action = this.id;
                if(action == "idProducaoCheckout"){
                    var tr=$(this).parents('tr');
                    if ($(tr).hasClass("child")){
                    var record = tableProducao.row( $(this).parents('tr').prev('tr') ).data();
                    }else{
                    var record = tableProducao.row( $(this).parents('tr') ).data();
                    };                   
                    $scope.producaoCIProdutoEcommerce(record[0], $scope.infoProducao.empresa, $scope.infoProducao.total, $scope.valorPesquisa)  ;          
                  
                };
            });
        }  

        else if(value == 11){

            $('#producaoProdutos').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.infoProduto.rows,                                
                "columns":  $scope.infoProduto.cols,             
                "bDestroy": true,  
                "columnDefs": [{
                        "targets": [3,4], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 3;               
                    while(j < nb_cols){                      
                       
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
        } 

        else if(value == 12){

            $('#faturamentoDiaProduto').DataTable({
                "language": {
                    "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                },   
                "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                "iDisplayLength": 10,            
                "data": $scope.produtoDiaFat.rows,                                
                "columns": $scope.produtoDiaFat.cols,             
                "bDestroy": true,  
                "order": [[3, "desc" ]], 
                "columnDefs": [{
                        "targets": [2,3], 
                        "render": $.fn.dataTable.render.number( '.', ',', 2)
                    }
                ],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api();
                    nb_cols = api.columns().nodes().length;                  
                
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '')*1 :
                            typeof i === 'number' ?
                                i : 0;
                    };                       
    
                    var j = 2;               
                    while(j < nb_cols){                      
                       
                        // Total over all pages
                        total = api
                            .column(j)
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0 );
    
                        var pageTotal = api
                        .column( j, { page: 'current'} )
                        .data()
                        .reduce( function (a, b) {
                            return Number(a) + Number(b);
                        }, 0 );
                    // Update footer
                    $( api.column(j).footer() ).html(/*'Total Page: <br>'+ pageTotal +*/   Number(total).toLocaleString('pt-br', {
                        maximumFractionDigits: 2
                        }));
                        j++;                       
                    } 
                },                                                      
            });
    
        } 
          
    };
    
    $scope.tableGrupo = function(){
        if($scope.divGrupoMarca == true){ 
            $scope.grupoMarca = [];
            $scope.divVendGrupo = true;
            $scope.divGrupoMarca = false; 
            $scope.divMarcaProduto = false;  
        };

        if($scope.divMarcaProduto == true ){
            $scope.marcaProduto = []; 
            $scope.divVendGrupo = false;          
            $scope.divGrupoMarca = true; 
            $scope.divMarcaProduto = false; 
            
        }
    };
    
    $scope.close = function(){
        $scope.infoVendedorGrupo = [];
        $scope.grupoMarca = [];
        $scope.marcaProduto = [];
        $scope.divVendGrupo = false;
        $scope.divGrupoMarca = false;  
        $scope.divMarcaProduto = false;

    };

    $scope.menu = function(value){
        if(value == 1){
            $scope.divSegunda = false;
            $scope.divPrimeira = true;
            $scope.tamanhoModal = '40%'; 
        }else if(value == 2){
            $scope.divSegunda = false;
            $scope.divPrimeira = false;
            $scope.tamanhoModal = '40%'; 
        }else if(value == 3){    
            $scope.showDivGrupo = true;                        
            $scope.showDivMarca = false;
            $scope.marcas = [];            
        }else if(value == 4){
            $scope.showDivMarca = true;
            $scope.showDivProduto = false;
            $scope.produtos = [];
        };
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

});