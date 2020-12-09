app.controller('atacadoController', function($scope, $http,$timeout,growl){

    if (!$scope.permissoes[0]){
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
    
    //========== VIS ATC VISAO GERAL ==========//
    $scope.visAtcVisaoGeral = {
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
    
    $scope.divReativadosVendedor = false;
    $scope.urlClientesNovos = false;
    $scope.divNovosVendedor = false; 
    
    $scope.clientesInfo = [];
    $scope.vendedorInfo = [];
    
    //========== POST ATC VISAO GERAL ==========//    
    $scope.postAtcVisaoGeral = {
        method:'POST',
        url: $scope.baseApi + 'atcVisaoGeral/',
        data: {'atcVisaoGeral':$scope.filtro},
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': $scope.login.token 
        }    
    };
 
    //========== ATC VISÃO GERAL ==========//
    $scope.atcVisaoGeral = function(){
       
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
                $http($scope.postAtcVisaoGeral
                ).then(function(event){     
                    $scope.transPend.visaoGeral = false;                   
                    $scope.visAtcVisaoGeral = event.data;   
                    if($scope.visAtcVisaoGeral.meta_geral >  0){
                        $scope.tendenciaMetaGeral();                   
                        $scope.atualizaGraficos();  
                        $scope.showTop10 = true; 
                        $scope.urlClientesNovos = true; 
                    }else{
                        growl.warning('<b>ATENÇÃO</b><br> Meta não cadastrada!');   
                    };                                   
                }).catch(function(err){                    
                    console.log(err);
                    $scope.transPend.visaoGeral = false;                   
                    if(err.data.error == false){
                        growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                    }else{
                        growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 2');   
                    };  
                });
            } else {
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');                 
            }
        } else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');     
        }
    };  
    
    //========== FUNÇÃO PARA CAPTAR OS CLIENTES NOVOS E REATIVADOS - > VENDEDOR  ==========//
    $scope.clientesNovoseReativados = function(valor){
      
        $scope.infoClientes = {
            dataInicial: $scope.filtro.dataInicial,
            dataFim: $scope.filtro.dataFim,
            validacao: valor
        }        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'clientesNovoseReativados/',
                method: 'POST',
                data: {'clientesNovoseReativados': $scope.infoClientes },
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }        
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;                 
                $scope.clientesInfo = event.data;                
                if($scope.infoClientes.validacao == 1){
                   $scope.divNovosVendedor = true 
                   $('#modalNovos').trigger('click'); 
                }else if($scope.infoClientes.validacao == 2){
                    $scope.divReativadosVendedor = true;
                    $('#modalReativados').trigger('click'); 
                };
            }).catch(function(err){ 
                console.log(err);
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 2.1');   
                };                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //========== FUNÇÃO PARA CAPTAR OS CLIENTES NOVOS E REATIVADOS - > VENDEDOR -> CLIENTE ==========//
    $scope.vendClieNovoseReativados = function(codigo,nome,valor){
        
        $scope.infoVendedor = {
            dataInicial: $scope.filtro.dataInicial,
            dataFim:$scope.filtro.dataFim,
            validacao: valor,
            codigo: codigo,
            nome: nome
        }
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'vendClieNovoseReativados/',
                method: 'POST',
                data: {'vendClieNovoseReativados': $scope.infoVendedor },
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }         
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                  
                $scope.vendedorInfo = event.data;                        
                $scope.divNovosVendedor = false;           
                $scope.divReativadosVendedor = false;                         
            }).catch(function(err){ 
                console.log(err);                
                $scope.transPend.visaoGeral = false;               
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 2.2');   
                };                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //========== FUNÇÃO PARA SETAR DIV'S DOS CLIENTES NOVOS E REATIVADOS  ==========//
    $scope.voltar = function(){
        if($scope.divNovosVendedor == false){
            $scope.divNovosVendedor = true;
            $scope.vendedorInfo = [];
        };  
        
        if($scope.divReativadosVendedor == false){
            $scope.divReativadosVendedor = true;
            $scope.vendedorInfo = [];
        };
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
    
    /*========== INICIO ATUALIZA GRAFICOS ==========*/    
    $scope.atualizaGraficos = function(){
        var yearCadCli = $scope.filtro.dataInicial.getYear();
        if (yearCadCli < 1000){
            yearCadCli += 1900;
        }
        
        /*========================= VENDAS POR REGIÃO  =========================*/        
        Highcharts.chart('hcVendasPorRegiao', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 320               
            },
            title: {
                text: 'Vendas Por Região'
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
                data: $scope.visAtcVisaoGeral.vendasporregiao,
                events: {
                    click: function (event) {
                        alert(
                            this.name + ' clicked\n' +
                            'Alt: ' + event.altKey + '\n' +
                            'Control: ' + event.ctrlKey + '\n' +
                            'Meta: ' + event.metaKey + '\n' +
                            'Shift: ' + event.shiftKey
                        );
                    }
                }
            }]
        });
       
        /*========================= VENDAS POR CANAL  =========================*/
        Highcharts.chart('hcVendasPorCanal', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 320
            },
            title: {
                text: 'Vendas Por Canal'
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
                data: $scope.visAtcVisaoGeral.vendasporcanal
            }]
        });     
        
        /*========================= META GERAL EMPRESA =========================*/        
        Highcharts.chart('hcMetaGeralEmpresa', {
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
                text: 'R$ ' + ($scope.visAtcVisaoGeral.meta_geral).toLocaleString('pt-BR')
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
                    text: 'km/h'
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
                data: [ Math.round(($scope.visAtcVisaoGeral.vl_total_positivados * 100) / $scope.visAtcVisaoGeral.meta_geral) ],
                tooltip: {
                    valueSuffix: ' %'
                }
            }]

        }); 
        
        /*========================= VENDAS POR DATA  =========================*/
        Highcharts.chart('hcVendasPorData', {
            chart: {
                type: 'areaspline',
                height: 500
            },
            title: {
                text: 'Vendas Por Data'
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.vendasdatamodalidade.categories
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
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: $scope.visAtcVisaoGeral.vendasdatamodalidade.series
        });        
        
        /*========================= VENDAS POSITIVADAS POR VENDEDOR INTERNO  =========================*/
        Highcharts.chart('hcVendasPositivadasPorVendedorInterno', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'Vendas Internas'
            },
            subtitle: {
                text: 'Venda: ' + ($scope.visAtcVisaoGeral.vendedores_internos.leg_total).toLocaleString('pt-BR') + '   Meta: ' + ($scope.visAtcVisaoGeral.vendedores_internos.leg_meta).toLocaleString('pt-BR') + ' - ' + Math.round(($scope.visAtcVisaoGeral.vendedores_internos.leg_total * 100) / $scope.visAtcVisaoGeral.vendedores_internos.leg_meta)+'%' 
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.vendedores_internos.vendedores
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
                data: $scope.visAtcVisaoGeral.vendedores_internos.vl_total_positivados,
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
                data: $scope.visAtcVisaoGeral.vendedores_internos.metas,
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
       
        /*========================= VENDAS POSITIVADAS POR VENDEDOR EXTERNO  =========================*/
        Highcharts.chart('hcVendasPositivadasPorVendedorExterno', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'Vendas Externas'
            },
            subtitle: {
                text: 'Venda: ' + ($scope.visAtcVisaoGeral.vendedores_externos.leg_total).toLocaleString('pt-BR') + '   Meta: ' + ($scope.visAtcVisaoGeral.vendedores_externos.leg_meta).toLocaleString('pt-BR') + ' - ' + Math.round(($scope.visAtcVisaoGeral.vendedores_externos.leg_total * 100) / $scope.visAtcVisaoGeral.vendedores_externos.leg_meta) + '%'
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.vendedores_externos.vendedores
            },
            yAxis: [{
                min: 0,
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
                data: $scope.visAtcVisaoGeral.vendedores_externos.vl_total_positivados,
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
                data: $scope.visAtcVisaoGeral.vendedores_externos.metas,
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
            }]
        });
        
        /*========================= VENDAS POSITIVADAS POR REPRESENTANTE  =========================*/
        Highcharts.chart('hcVendasPositivadasPorRepresentante', {
            chart: {
                type: 'column',
                height: 600
            },
            title: {
                text: 'Vendas Representantes'
            },
            subtitle: {
                text: 'Venda: ' + ($scope.visAtcVisaoGeral.vendedores_representante.leg_total).toLocaleString('pt-BR') + '   Meta: ' + ($scope.visAtcVisaoGeral.vendedores_representante.leg_meta).toLocaleString('pt-BR') + ' - ' + Math.round(($scope.visAtcVisaoGeral.vendedores_representante.leg_total * 100) / $scope.visAtcVisaoGeral.vendedores_representante.leg_meta)+'%' 
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.vendedores_representante.vendedores
            },
            yAxis: [{
                min: 0,
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
                data: $scope.visAtcVisaoGeral.vendedores_representante.vl_total_positivados,
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
                data: $scope.visAtcVisaoGeral.vendedores_representante.metas,
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
            }]
        });
        
        /*========================= VENDAS HAVAN  =========================*/
        Highcharts.chart('hcVendasHavan', {
            chart: {
                type: 'bar',
                height: 240
            },
            title: {
                text: 'Vendas Havan'
            },
            subtitle: {
                text: 'Venda: ' + ($scope.visAtcVisaoGeral.vendedores_havan.leg_total).toLocaleString('pt-BR') + '   Meta: ' + ($scope.visAtcVisaoGeral.vendedores_havan.leg_meta).toLocaleString('pt-BR') + ' - ' + Math.round(($scope.visAtcVisaoGeral.vendedores_havan.leg_total * 100) / $scope.visAtcVisaoGeral.vendedores_havan.leg_meta)+'%' 
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.vendedores_havan.vendedores,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                labels: {
                    overflow: 'justify'
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
            series: [{
                name: 'Venda',
                color: 'rgba(165,170,217,1)',
                data: $scope.visAtcVisaoGeral.vendedores_havan.vl_total_positivados,
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
                data: $scope.visAtcVisaoGeral.vendedores_havan.metas,
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
            }]
        }); 
        
        /*========================= VENDAS POR FORNECEDOR  =========================*/
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
                text: 'Geral'  
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
                data: $scope.visAtcVisaoGeral.vendasfornecedores
            }]
        });
       
        /*========================= VENDAS POR FORNECEDOR - INTERNO  =========================*/
        Highcharts.chart('hcVendasPorFornecedorInterno', {
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
                text: 'Interno'  
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
                data: $scope.visAtcVisaoGeral.vendasfornecedores_interno
            }]
        });
        
        /*========================= VENDAS POR FORNECEDOR - EXTERNO  =========================*/
        Highcharts.chart('hcVendasPorFornecedorExterno', {
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
                text: 'Externo'  
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
                data: $scope.visAtcVisaoGeral.vendasfornecedores_externo
            }]
        });
        
        /*========================= VENDAS POR FORNECEDOR -  HAVAN  =========================*/
        Highcharts.chart('hcVendasPorFornecedorHavan', {
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
                text: 'Havan'  
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
                data: $scope.visAtcVisaoGeral.vendasfornecedores_havan
            }]
        });
        
        /*========================= CADASTROS CLIENTES MÊS  =========================*/
        Highcharts.chart('hcCadCliMes', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Clientes Cadastrados'
            },
            subtitle: {
                text: yearCadCli
            },
            xAxis: {
                categories: $scope.visAtcVisaoGeral.cadastro_clientes_mes.mes
            },
            yAxis: {
                title: {
                    text: 'Quantidade'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: '.',
                data: $scope.visAtcVisaoGeral.cadastro_clientes_mes.qtd
            }]
        });
        
        /*========================= VENDAS POR TIPO CLIENTE  =========================*/
        Highcharts.chart('hcVendasPorTipoCliente', {
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
                text: 'Geral'  
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
                data: $scope.visAtcVisaoGeral.vendastipocliente
            }]
        });
        
        /*========================= VENDAS POR TIPO CLIENTE - INTERNO  =========================*/
        Highcharts.chart('hcVendasPorTipoClienteInterno', {
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
                text: 'Interno'  
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
                data: $scope.visAtcVisaoGeral.vendastipocliente_interno
            }]
        });
        
        /*========================= VENDAS POR TIPO CLIENTE - EXTERNO  =========================*/
        Highcharts.chart('hcVendasPorTipoClienteExterno', {
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
                text: 'Externo'  
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
                data: $scope.visAtcVisaoGeral.vendastipocliente_externo
            }]
        });
        
        /*========================= VENDAS POR TIPO CLIENTE - REPRESENTANTE  =========================*/
        Highcharts.chart('hcVendasPorTipoClienteRepresentante', {
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
                text: 'Representante'  
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
                data: $scope.visAtcVisaoGeral.vendastipocliente_representante
            }]
        });
        
        /*========================= VENDAS POR GRUPO PRODUTO  =========================*/
        Highcharts.chart('hcVendasPorGrupoProduto', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo de Produto'
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
                data: $scope.visAtcVisaoGeral.vendasporgrupo
            }]
        });
        
        /*========================= VENDAS POR GRUPO PRODUTO - INTERNO  =========================*/
        Highcharts.chart('hcVendasPorGrupoProdutoInterno', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo de Produto'
            },
            subtitle: {
                text: 'Interno'  
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
                data: $scope.visAtcVisaoGeral.vendasporgrupo_interno
            }]
        });
        
        /*========================= VENDAS POR GRUPO PRODUTO - EXTERNO  =========================*/
        Highcharts.chart('hcVendasPorGrupoProdutoExterno', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo de Produto'
            },
            subtitle: {
                text: 'Externo'  
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
                data: $scope.visAtcVisaoGeral.vendasporgrupo_externo
            }]
        });
        
        /*========================= VENDAS POR GRUPO PRODUTO - REPRESENTANTE  =========================*/
        Highcharts.chart('hcVendasPorGrupoProdutoRepresentante', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo de Produto'
            },
            subtitle: {
                text: 'Representante'  
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
                data: $scope.visAtcVisaoGeral.vendasporgrupo_representante
            }]
        }); 
        
        /*========================= VENDAS POR GRUPO PRODUTO - HAVAN  =========================*/
        Highcharts.chart('hcVendasPorGrupoProdutoHavan', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 400
            },
            title: {
                text: 'Vendas Por Grupo de Produto'
            },
            subtitle: {
                text: 'Havan'  
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
                data: $scope.visAtcVisaoGeral.vendasporgrupo_havan
            }]
        });
        
    };      

    $scope.tendenciaMetaGeral = function(){
        if ($scope.visAtcVisaoGeral.enableTendeciaMeta) {
            $scope.tendencia_meta_geral = {
                clientes: 0,
                meta: 0,
                venda: 0,
                dt_ideal: 0,
                dt_realizado: 0,
                valor_estimado: 0,
                percentual_estimado: 0
            }

            for (var i in  $scope.visAtcVisaoGeral.tendencia_meta_canal){
                $scope.tendencia_meta_geral.clientes       = $scope.tendencia_meta_geral.clientes       + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].clientes; 
                $scope.tendencia_meta_geral.meta           = $scope.tendencia_meta_geral.meta           + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].meta; 
                $scope.tendencia_meta_geral.venda          = $scope.tendencia_meta_geral.venda          + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].venda; 
                $scope.tendencia_meta_geral.dt_ideal       = $scope.tendencia_meta_geral.dt_ideal       + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].dt_ideal; 
                $scope.tendencia_meta_geral.dt_realizado   = $scope.tendencia_meta_geral.dt_realizado   + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].dt_realizado; 
                $scope.tendencia_meta_geral.valor_estimado = $scope.tendencia_meta_geral.valor_estimado + $scope.visAtcVisaoGeral.tendencia_meta_canal[i].valor_extimado;
            }

            $scope.tendencia_meta_geral.clientes       = $scope.tendencia_meta_geral.clientes       + 1;
            $scope.tendencia_meta_geral.meta           = $scope.tendencia_meta_geral.meta           + $scope.visAtcVisaoGeral.tendencia_meta_havan[0].meta; 
            $scope.tendencia_meta_geral.venda          = $scope.tendencia_meta_geral.venda          + $scope.visAtcVisaoGeral.tendencia_meta_havan[0].venda; 
            $scope.tendencia_meta_geral.dt_ideal       = $scope.tendencia_meta_geral.dt_ideal       + $scope.visAtcVisaoGeral.tendencia_meta_havan[0].dt_ideal; 
            $scope.tendencia_meta_geral.dt_realizado   = $scope.tendencia_meta_geral.dt_realizado   + $scope.visAtcVisaoGeral.tendencia_meta_havan[0].dt_realizado; 
            $scope.tendencia_meta_geral.valor_estimado = $scope.tendencia_meta_geral.valor_estimado + $scope.visAtcVisaoGeral.tendencia_meta_havan[0].valor_extimado;

            $scope.tendencia_meta_geral.percentual_estimado = (($scope.tendencia_meta_geral.valor_estimado * 100) / $scope.tendencia_meta_geral.meta)
        }
    };  
   
});

