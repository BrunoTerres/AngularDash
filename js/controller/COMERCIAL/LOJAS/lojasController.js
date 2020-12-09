app.controller('lojasController', function($scope, $http,growl){
   
    if (!$scope.permissoes[2]){
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
    
    //==========  VISAO LOJA FISICA GERAL ==========//
    $scope.visaoLoja = function(){
         $scope.visLjfVisaoGeral = {
            visaogeral : {
                total : 0,
                quantidade : 0,
                clientes : 0,
                markdown:0
            },
            visaogeralporloja : [
                {
                    empresa: '006',
                    cliente: 0,
                    produto: 0,
                    markdown:0,
                    valor : 0
                },
                {
                    empresa: '107',
                    cliente: 0,
                    produto: 0,
                    markdown:0,
                    valor : 0
                },
                {
                    empresa: '106',
                    cliente: 0,
                    produto: 0,
                    markdown:0,
                    valor : 0
                },
                {
                    empresa: '007',
                    cliente: 0,
                    produto: 0,
                    valor : 0
                },{
                    empresa: '104',
                    cliente: 0,
                    produto: 0,
                    markdown:0,
                    valor : 0
                },{
                    empresa: '201',
                    cliente: 0,
                    produto: 0,
                    markdown:0,
                    valor : 0
                }
            ]
        };
    }
    $scope.visaoLoja();
    $scope.visLjfVendedorGrupo = [];
    $scope.visLjfVendedorFornecedor = [];
    $scope.visLjfVendedorProduto = []; 
    $scope.visLjfLucrGrupoProduto = [];
    $scope.visLjfLucrFornecedorProduto = [];
    $scope.vendasPorLoja = true;
    $scope.vendasPorData = false;
    $scope.vendasPorGrupo = false;
    $scope.vendasPorFabricante = false;
    $scope.vendasPorVendedor = false;
    $scope.vendasPorFormPagamento = false;
    $scope.lucratividade = false;
    $scope.lucratividadeGrupo = false;
    $scope.lucratividadeFornecedor = true;
    

    $scope.infoVendedor = {
        'codigoVendedor':'', 
        'dataInicial':'',
        'valida': false,
        'dataFim':'',
        'empresa':'',
        'nome':'',
        'y': '' 
    };
    
    /*MODAL SHOW*/
    $scope.vendedorGrupo = false;
    $scope.vendedorFornecedor = false;
    $scope.vendedorProduto = false;
    $scope.divApresenta = false;
    
   $scope.ljfVisaoGeral = function(){
        $scope.divApresenta = false;
        $scope.visaoLoja();
        $scope.lojasGeralPost = {
            'dataInicial':  $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,       
            'superUsuario': $scope.filtro.superUsuario,
            'idperfil': $scope.filtro.idperfil
        };
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http({
                        method : 'POST',
                        url : $scope.baseApi + 'ljfVisaoGeral/',
                        data : {'ljfVisaoGeral': $scope.lojasGeralPost},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }        
                }).then(function(event){      
                    $scope.transPend.visaoGeral = false;             
                    $scope.visLjfVisaoGeral = event.data;    
                    if($scope.visLjfVisaoGeral.mensagem == true){ 
                        $scope.visaoLoja();
                        growl.warning('<b>ATENÇÃO</b><br> Não existe dados na data informada!');   
                    }else
                    {
                        if($scope.visLjfVisaoGeral.luc_forn_cl_006_total[0] != ''){
                            $scope.totalforn006Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_006_total[0]
                            $scope.totalforn107Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_107_total[0]
                            $scope.totalforn106Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_106_total[0]
                            $scope.totalforn007Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_007_total[0]
                            $scope.totalforn104Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_104_total[0]
                            $scope.totalforn105Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_105_total[0]
                            $scope.totalforn201Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_201_total[0]   
                            $scope.totalforn202Cl =  $scope.visLjfVisaoGeral.luc_forn_cl_202_total[0] 

                            $scope.totalforn006Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_006_total[0]
                            $scope.totalforn107Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_107_total[0]
                            $scope.totalforn106Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_106_total[0]
                            $scope.totalforn007Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_007_total[0]
                            $scope.totalforn104Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_104_total[0]
                            $scope.totalforn105Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_105_total[0]
                            $scope.totalforn201Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_201_total[0] 
                            $scope.totalforn202Ot =  $scope.visLjfVisaoGeral.luc_forn_ot_202_total[0]

                            $scope.totalGrupo006 =  $scope.visLjfVisaoGeral.luc_grupo_006_total[0]
                            $scope.totalGrupo107 =  $scope.visLjfVisaoGeral.luc_grupo_107_total[0]
                            $scope.totalGrupo106 =  $scope.visLjfVisaoGeral.luc_grupo_106_total[0]
                            $scope.totalGrupo007 =  $scope.visLjfVisaoGeral.luc_grupo_007_total[0]
                            $scope.totalGrupo104 =  $scope.visLjfVisaoGeral.luc_grupo_104_total[0]
                            $scope.totalGrupo105 =  $scope.visLjfVisaoGeral.luc_grupo_105_total[0]
                            $scope.totalGrupo201 =  $scope.visLjfVisaoGeral.luc_grupo_201_total[0]   
                            $scope.totalGrupo202 =  $scope.visLjfVisaoGeral.luc_grupo_202_total[0]                      
                        };                         
                        $scope.divApresenta = true;
                        $scope.atualizaGraficos();
                        $scope.menu = true;                        
                        $scope.showTable = true;  
                    };
                      
                }).catch(function(err){ 
                    console.log(err) ;          
                    $scope.transPend.visaoGeral = false; 
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.1');  
                    };                        
                });  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };     
        }else{
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        };    
    };
    
    //==========  LOJA FISICA VISAO GERAL - VENDEDOR - > GRUPO ==========//
    $scope.ljfVisaoGeralVendedorGrupo = function(){
        if($scope.infoVendedor.valida == false){
            growl.warning('<b>Atenção</b><br>Selecione um vendedor!');
        }else{           
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                $http({
                    url: $scope.baseApi + 'ljfVisaoGeralVendedorGrupo/',
                    method: 'POST',
                    data: {'ljfVisaoGeralVendedorGrupo': $scope.infoVendedor},
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Authorization': $scope.login.token 
                    }       
                }).then(function(event){  
                    $scope.transPend.visaoGeral = false;               
                    $scope.visLjfVendedorGrupo = event.data                                   
                    $scope.vendedorGrupo = true;                   
                    $scope.infoVendedor.valida = false;
                    $('#modalVendedor').trigger('click');
                }).catch(function(err){            
                    console.log(err);
                    $scope.transPend.visaoGeral = false;
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.1');  
                    };      
                })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        };
    };
    
    //==========  LOJA FISICA VISAO GERAL - VENDEDOR - > GRUPO -> FORNECEDOR ==========//
    $scope.ljfVisaoGeralVendedorFornecedor = function(codigo, name, y){
        $scope.infoGrupo = {
            'codigoVendedor' : $scope.infoVendedor.codigoVendedor,
            'dataInicial': $scope.filtro.dataInicial,
            'empresa': $scope.infoVendedor.empresa,
            'dataFim': $scope.filtro.dataFim,
            'codigoGrupo': codigo,
            'name':name,
            'y': y             
        };      
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVisaoGeralVendedorFornecedor/',
                method: 'POST',
                data: {'ljfVisaoGeralVendedorFornecedor': $scope.infoGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.visLjfVendedorFornecedor  = event.data;               
                $scope.vendedorFornecedor = true;
                $scope.vendedorGrupo = false;                  
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.2');   
                };
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }
    };
    
    //==========  LOJA FISICA VISAO GERAL - VENDEDOR - > GRUPO - >FORNECEDOR -> PRODUTO ==========//
    $scope.ljfVisaoGeralVendedorProduto = function(codigo,name,y){
        $scope.infoFornecedor = {
            'codigoVendedor' : $scope.infoVendedor.codigoVendedor,
            'codigoGrupo': $scope.infoGrupo.codigoGrupo,
            'dataInicial': $scope.filtro.dataInicial,
            'empresa': $scope.infoVendedor.empresa,
            'dataFim': $scope.filtro.dataFim,
            'codigoFornecedor': codigo,
            'name': name,
            'y': y            
        };
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVisaoGeralVendedorProduto/',
                method: 'POST',
                data: {'ljfVisaoGeralVendedorProduto': $scope.infoFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){
                $scope.transPend.visaoGeral = false;                  
                $scope.visLjfVendedorProduto  = event.data;               
                $scope.vendedorFornecedor = false;
                $scope.vendedorProduto = true;               
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.3');   
                };                
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //==========  LOJA FISICA VISAO GERAL - LUCRATIVIDADE GRUPO - > PRODUTOS ==========//
    $scope.ljfVisaoGeralLucrGrupoProduto = function(codigo,empresa,nome, quantidade,totalProduto,totalLucro){
        $scope.infoLucrGrupo = {
            'dataInicial': $scope.filtro.dataInicial,           
            'dataFim': $scope.filtro.dataFim,
            'totalProduto': totalProduto,          
            'totalLucro': totalLucro,
            'quantidade': quantidade, 
            'codigoGrupo': codigo, 
            'empresa': empresa,
            'name': nome  
        };  
        if(empresa == '006'){
            $scope.empresaNome = 'ITAJAÍ';
        }else
        if(empresa == '007'){
            $scope.empresaNome = 'JOINVILLE';
        }else
        if(empresa == '104'){
            $scope.empresaNome = 'BLUMENAU';
        }else
        if(empresa == '105'){
            $scope.empresaNome = 'SÃO JOSÉ';
        }else
        if(empresa == '201'){
            $scope.empresaNome = 'CURITIBA - PALLADIUM';
        }else
        if(empresa == '202'){
            $scope.empresaNome = 'CURITIBA - JOCKEY PLAZA';
        };            
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVisaoGeralLucrGrupoProduto/',
                method: 'POST',
                data: {'ljfVisaoGeralLucrGrupoProduto': $scope.infoLucrGrupo},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                
                $scope.visLjfLucrGrupoProduto  = event.data;
                if($scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0] != ''){
                    $scope.quantidadeTotal = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].qtd_produto_total
                    $scope.quantidadeTotalPorc = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].pct_produto_total                    
                    $scope.totalProduto = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].tot_produto_total
                    $scope.totalProdutoPorc = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].pct_valor_total
                    $scope.custoTotal = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].tot_custo_total
                    $scope.lucroTotal = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].tot_lucro_total
                    $scope.lucroTotalPorc = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].pct_lucro_total             
                    $scope.markDown = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].markdown_total
                    $scope.markUp = $scope.visLjfLucrGrupoProduto.lucratividadeGrupoPorProdutoTotal[0].markup_total
                }; 
                $('#modalLucrGrupoProduto').trigger('click');
            }).catch(function(err){  
                console.log(err);                
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.4');  
                };                
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }
    };
    
    //==========  LOJA FISICA VISAO GERAL - LUCRATIVIDADE FORNECEDORES - > PRODUTOS ==========//
    $scope.ljfVisaoGeralLucrFornecedorProduto = function(codigo,empresa,nome, quantidade,totalProduto,totalLucro,validacaoAnd){
        $scope.infoLucrFornecedor = {
            'dataInicial': $scope.filtro.dataInicial,           
            'dataFim': $scope.filtro.dataFim,
            'totalProduto': totalProduto,            
            'codigoFornecedor': codigo, 
            'totalLucro': totalLucro,
            'quantidade': quantidade,
            'validacaoAnd': validacaoAnd,
            'empresa': empresa,
            'name': nome,              
        };      
        if(empresa == '006'){
            $scope.empresaNome = 'ITAJAÍ';
        }else
        if(empresa == '007'){
            $scope.empresaNome = 'JOINVILLE';
        }else
        if(empresa == '104'){
            $scope.empresaNome = 'BLUMENAU';
        }else
        if(empresa == '105'){
            $scope.empresaNome = 'SÃO JOSÉ';
        }else
        if(empresa == '201'){
            $scope.empresaNome = 'CURITIBA - PALLADIUM';
        }else
        if(empresa == '202'){
            $scope.empresaNome = 'CURITIBA - JOCKEY PLAZA';
        };
                          
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ljfVisaoGeralLucrFornecedorProduto/',
                method: 'POST',
                data: {'ljfVisaoGeralLucrFornecedorProduto': $scope.infoLucrFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                
                $scope.visLjfLucrFornecedorProduto = event.data;
                if($scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0] != ''){
                    $scope.quantidadeTotal = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].qtd_produto_total
                    $scope.quantidadeTotalPorc = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].pct_produto_total                    
                    $scope.totalProduto = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].tot_produto_total
                    $scope.totalProdutoPorc = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].pct_valor_total
                    $scope.custoTotal = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].tot_custo_total
                    $scope.lucroTotal = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].tot_lucro_total
                    $scope.lucroTotalPorc = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].pct_lucro_total             
                    $scope.markDown = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].markdown_total
                    $scope.markUp = $scope.visLjfLucrFornecedorProduto.lucratividadeFornecedorPorProdutoTotal[0].markup_total
                };    
                $('#modalLucrFornProduto').trigger('click');
            }).catch(function(err){            
                console.log(err);
                $scope.transPend.visaoGeral = false;  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 4.5');  
                };               
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    $scope.showButton = function(){
        
        if($scope.vendedorFornecedor == true){            
            $scope.vendedorFornecedor = false
            $scope.vendedorGrupo = true;  
        };
        
        if($scope.vendedorProduto == true){
            $scope.vendedorProduto = false
            $scope.vendedorFornecedor = true
        };
        
    };
    
    $scope.lucratividadeDiv = function(){
        if($scope.lucratividadeFornecedor == true){
            $scope.lucratividadeGrupo = false;
        }

        if($scope.lucratividadeGrupo == true){
            $scope.lucratividadeFornecedor = false;
        };

    };
    
    /*SETAR FALSO DIV MODAL*/
    $scope.close = function(){
        $scope.vendedorGrupo = false;
        $scope.vendedorFornecedor = false;
        $scope.vendedorProduto = false;
        $scope.infoVendedor.valida = false;
        
    };
    
    //========== HIGH CHARTS ==========//
    Highcharts.setOptions({
        colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
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
        }),
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
        
        /*========================= VENDAS POR LOJA  =========================*/  
        Highcharts.chart('hcVendasPorLoja', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Loja'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            //color: 'rgba(115,135,156,1)' //(Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'Vendas R$',
                //data: [{name: "teste", y: 90.2}, {name:"teste2", y: 120}]
                data: $scope.visLjfVisaoGeral.visaoporloja
            }]
        });
        
        /*========================= VENDAS POR DATA  =========================*/ 
        Highcharts.chart('hcVendasPorData', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Vendas Por Data'
            },
            xAxis: {
                categories: $scope.visLjfVisaoGeral.vendaspordata.categorias
            },
            yAxis: {
                title: {
                    text: 'Valores'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                line: {
                    allowPointSelect: true,    
                    dataLabels: {
                        enabled: false
                    },
                    enableMouseTracking: true
                }
            },
            series: $scope.visLjfVisaoGeral.vendaspordata.series
        }); 
        
        /*========================= VENDAS POR TIPO  =========================*/          
        Highcharts.chart('hcVendasPorTipo', {
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
                text: 'Geral'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo
            }]
        });
        
        /*========================= VENDAS POR TIPO - 006  =========================*/  
        Highcharts.chart('hcVendasPorTipo006', {
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
                text: 'Itajaí Quiosque'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo006
            }]
        });

        /*========================= VENDAS POR TIPO - 107  =========================*/  
        Highcharts.chart('hcVendasPorTipo107', {
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
                text: 'Itajaí Loja'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo007
            }]
        });

        /*========================= VENDAS POR TIPO - 106  =========================*/  
        Highcharts.chart('hcVendasPorTipo106', {
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
                text: 'Balneario'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo106
            }]
        });
        /*========================= VENDAS POR TIPO - 007  =========================*/  
        Highcharts.chart('hcVendasPorTipo007', {
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
                text: 'Joinville'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo007
            }]
        });
        
        /*========================= VENDAS POR TIPO - 104  =========================*/  
        Highcharts.chart('hcVendasPorTipo104', {
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
                text: 'Blumenau'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo104
            }]
        });

        /*========================= VENDAS POR TIPO - 105  =========================*/  
        Highcharts.chart('hcVendasPorTipo105', {
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
                text: 'São José'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo105
            }]
        });
        
        /*========================= VENDAS POR TIPO - 201  =========================*/  
        Highcharts.chart('hcVendasPorTipo201', {
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
                text: 'Curitiba - Palladium'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo201
            }]
        });

        /*========================= VENDAS POR TIPO - 202  =========================*/  
        Highcharts.chart('hcVendasPorTipo202', {
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
                text: 'Curitiba - Jockey Plaza'  
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
                data: $scope.visLjfVisaoGeral.vendaportipo202
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
                data: $scope.visLjfVisaoGeral.vendaporfabricante
            }]
        });
        
        /*========================= VENDAS POR VENDEDOR ITJ Quiosque  102 =========================*/  
        Highcharts.chart('hcVendasPorVendedorItj102', {
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
                text: 'Itajaí Quiosque'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_itj102,
                events: {
                    click: function (event) {                       
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });    

        /*========================= VENDAS POR VENDEDOR ITJ Loja 107 =========================*/  
        Highcharts.chart('hcVendasPorVendedorItj107', {
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
                text: 'Itajaí Loja'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_itj107,
                events: {
                    click: function (event) {                       
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });
        
        /*========================= VENDAS POR VENDEDOR BALNEARIO 106 =========================*/  
        Highcharts.chart('hcVendasPorVendedorItj106', {
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
                text: 'Balneario'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_itj106,
                events: {
                    click: function (event) {                       
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });
        /*========================= VENDAS POR VENDEDOR JVL  =========================*/  
        Highcharts.chart('hcVendasPorVendedorJvl', {
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
                text: 'Joinville'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_jvl,
                events: {
                    click: function (event) { 
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });
        
        /*========================= VENDAS POR VENDEDOR BLU  =========================*/  
        Highcharts.chart('hcVendasPorVendedorBlu', {
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
                text: 'Blumenau'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_blu,
                events: {
                    click: function (event) { 
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });

        /*========================= VENDAS POR VENDEDOR SP  =========================*/  
        Highcharts.chart('hcVendasPorVendedorSP', {
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
                text: 'São José'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_sp,
                events: {
                    click: function (event) { 
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });
        
        /*========================= VENDAS POR VENDEDOR CWB PALLADIUM =========================*/  
        Highcharts.chart('hcVendasPorVendedorCtb', {
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
                text: 'Curitiba - Palladium'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_ctb,
                events: {
                    click: function (event) { 
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name  
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });

        /*========================= VENDAS POR VENDEDOR CWB JOCKEY PLAZA  =========================*/  
        Highcharts.chart('hcVendasPorVendedorCtbJ', {
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
                text: 'Curitiba - Jockey Plaza'  
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
                data: $scope.visLjfVisaoGeral.vendaporvendedor_ctbJ,
                events: {
                    click: function (event) { 
                        $scope.infoVendedor.codigoVendedor = event.point.options.codigo  
                        $scope.infoVendedor.dataInicial = $scope.filtro.dataInicial
                        $scope.infoVendedor.empresa = event.point.options.empresa                       
                        $scope.infoVendedor.dataFim = $scope.filtro.dataFim
                        $scope.infoVendedor.nome = event.point.options.name  
                        $scope.infoVendedor.y = event.point.options.y 
                        $scope.infoVendedor.valida = true
                    }
                }
            }]
        });
        
        /*========================= VENDAS POR FPG  =========================*/  
        Highcharts.chart('hcVendasPorFpg', {
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
                text: 'Geral'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg
            }]
        });
        
        /*========================= VENDAS POR FPG - 006  =========================*/  
        Highcharts.chart('hcVendasPorFpg006', {
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
                text: 'Itajaí Quiosque'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg006
            }]
        });

        /*========================= VENDAS POR FPG - 107  =========================*/  
        Highcharts.chart('hcVendasPorFpg107', {
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
                text: 'Itajaí Loja'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg107
            }]
        });

        /*========================= VENDAS POR FPG - 106  =========================*/  
        Highcharts.chart('hcVendasPorFpg106', {
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
                text: 'Balneario'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg106
            }]
        });    
        /*========================= VENDAS POR FPG - 007  =========================*/  
        Highcharts.chart('hcVendasPorFpg007', {
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
                text: 'Joinville'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg007
            }]
        });
        
        /*========================= VENDAS POR FPG - 104  =========================*/  
        Highcharts.chart('hcVendasPorFpg104', {
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
                text: 'Blumenau'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg104
            }]
        });

        /*========================= VENDAS POR FPG - 105  =========================*/  
        Highcharts.chart('hcVendasPorFpg105', {
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
                text: 'São José'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg105
            }]
        });
        
        /*========================= VENDAS POR FPG - 201  =========================*/  
        Highcharts.chart('hcVendasPorFpg201', {
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
                text: 'Curitiba - Palladium'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg201
            }]
        });    

        /*========================= VENDAS POR FPG - 202  =========================*/  
        Highcharts.chart('hcVendasPorFpg202', {
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
                text: 'Curitiba - Jockey Plaza'  
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
                data: $scope.visLjfVisaoGeral.vendaporfpg202
            }]
        }); 
    }; 
});
