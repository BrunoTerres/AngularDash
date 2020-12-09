app.controller('analiseProdutoController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[14]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    }; 
    
    //==========  VARIAVEIS PARA TABELAS DINAMICAS ==========//
    $scope.contagemProduto = 15;   
    
    $scope.selecaoProduto ={
        selectedOption: {id: '15', name: '15'},
        availableOptions: [
            {id:'15', name:'15'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterProduto = function(data){    
        $scope.contagemProduto = data.id;   
    }; 
    
    //========== VARIAVEIS GLOBAIS ==========// 
    $scope.produtoGet = [];
    $scope.analiseProduct = [];
    $scope.analiseProductFatAnual = [];    
    
    //========== VARIAVEIS GLOBAIS BOOLEANAS PARA SHOW ==========// 
    $scope.tableProdutos = false;
    $scope.tableAnaliseProdutos = false;
    $scope.tableFaturamentoProduto = false;
    $scope.divApresenta = false;
    
    //========== POST PRODUTO  ==========// 
    $scope.getProduto = function(){
        $scope.produtoGet = [];
        $scope.infoDate = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim
        }  
        $scope.tableAnaliseProdutos = false;
        $scope.tableFaturamentoProduto = false;   
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'getProduto/',
            method: 'POST',
            data: {'getProduto':  $scope.infoDate},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){    
            $scope.transPend.visaoGeral = false;
            if(event.data.mensagem == true){
               growl.info('<b>AGUARDE</b><br> Não possui dados do produto nas datas informadas!'); 
            }else{                
                $scope.produtoGet = event.data; 
                $scope.tableProdutos = true;             
            };        
        }).catch(function(err){    
            console.log(err);         
            $scope.transPend.visaoGeral = false;             
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>Token utilizado para autenticação é inválido!');   
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 27');     
            };                   
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };     
    };
    
    $scope.getProduto();
    
    //========== POST ANALISE DO PRODUTO  ==========// 
    $scope.analiseProduto = function(codigo,nameProduto){
        $scope.infoProduto = {
            'dataInicial': $scope.filtro.dataInicial,
            'dataFim': $scope.filtro.dataFim,
            'nameProduto': nameProduto,
            'codigoProduto': codigo
        };    
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'analiseProduto/',
                method: 'POST',
                data: {'analiseProduto':  $scope.infoProduto},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){ 
                $scope.transPend.visaoGeral = false;            
                $scope.analiseProduct = event.data;        
                $scope.atualizaGraficos();               
                $scope.tableProdutos = false;
                $scope.divApresenta = true;  
                $scope.tableAnaliseProdutos = true;                
                $scope.analiseProdutoFaturamentoAnual();  
            }).catch(function(err){
                console.log(err);
                $scope.transPend.visaoGeral = false;                
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);   
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 28');   
                };                       
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };      
    };
    
    //========== POST PARA QUANTIDADE E FATURAMENTO ANO PASSADO X ANO ATUAL ==========// 
    $scope.analiseProdutoFaturamentoAnual = function(){
        $http({
            url: $scope.baseApi + 'analiseProdutoFaturamentoAnual/',
            method: 'POST',
            data: {'analiseProdutoFaturamentoAnual':  $scope.infoProduto},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }    
        }).then(function(event){   
            $scope.transPend.visaoGeral = false;             
            $scope.analiseProductFatAnual = event.data;           
            $scope.atualizaGraficoFaturamentoMensalProduto();
            $scope.tableFaturamentoProduto = true;

        }).catch(function(err){           
            console.log(err);
            $scope.transPend.visaoGeral = false;            
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 29');  
            };  
        })  

    };    
    
    $scope.close = function(){
        $scope.tableProdutos = true;
        $scope.divApresenta = false;         
        $scope.tableAnaliseProdutos = false;
        $scope.tableFaturamentoProduto = false;
        $scope.analiseProduct = []
        $scope.analiseProductFatAnual = []
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
        
        /*========================= VMD  =========================*/
        Highcharts.chart('hcVMD', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 520
            },
            title: {
                text: 'VMD'
            },subtitle: {
                text: 'Total: ' + $scope.analiseProduct.vmd.vmdtotal
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage} %',
                        style: {
                            //color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        },
                        connectorColor: 'silver'
                    }
                }
            },
            series: [{
                name: 'VMD',
                //data: [{name: "teste", y: 90.2}, {name:"teste2", y: 120}]
                data: $scope.analiseProduct.vmd.vmdtotalcanal
            }]
        });
       
        /*========== TICKET MÉDIO POR CANAL  ==========*/   
        Highcharts.chart('hcTicketMedioCanal', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Por Canal'
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
                    data: $scope.analiseProduct.ticketmedioporcanal,
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
                }     
                         
            }]           
        });
        
        /*========== QUANTIDADE POR CANAL  ==========*/   
        Highcharts.chart('hcQuantidadeCanal', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Por Canal'
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
                    text: 'Quantidade'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Quantidade: <b>{point.y}</b>'
            },"series": [{ 
                    data: $scope.analiseProduct.ticketmedioporcanalQuantidade,
                    dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',                   
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }     
                         
            }]           
        });
        
        /*========== TICKET MÉDIO POR DIA ==========*/   
        Highcharts.chart('hcTickerMedioDia', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Por Dia'
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
            xAxis: {
                categories: $scope.analiseProduct.ticketmedioporDia.categoria
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Valor: R$ <b>{point.y:.2f}</b>'
            },"series": [{ 
                    data: $scope.analiseProduct.ticketmedioporDia.series,
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
                }     
                         
            }]           
        });
        
        /*========== QUANTIDADE POR DIA  ==========*/   
        Highcharts.chart('hcQuantidadeDia', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Por Dia'
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
                    text: 'Quantidade'
                }
            }, 
            xAxis: {
                categories: $scope.analiseProduct.ticketmedioporDiaQuantidade.categoria
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Quantidade: <b>{point.y}</b>'
            },"series": [{ 
                    data: $scope.analiseProduct.ticketmedioporDiaQuantidade.series,
                    dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',                    
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }     
                         
            }]           
        });
        
        /*========== TICKET MÉDIO POR DIA E CANAL ==========*/  
        Highcharts.chart('hcTickerMedioDiaCanal', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Por Dia e Canal'
            },           
            xAxis: {
                categories: $scope.analiseProduct.ticketmedioporDiaCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Valores'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>R$ {point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
           series: $scope.analiseProduct.ticketmedioporDiaCanal.series           
        });        
        
        /*========== QUANTIDADE POR DIA E CANAL ==========*/  
        Highcharts.chart('hcQuantidadeDiaCanal', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Por Dia e Canal'
            },           
            xAxis: {
                categories: $scope.analiseProduct.ticketmedioporDiaCanalQuantidade.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Quantidade'
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
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
           series: $scope.analiseProduct.ticketmedioporDiaCanalQuantidade.series          
        }); 
        
        /*========== VENDA POR REGIAO - TOTAL ==========*/ 
        Highcharts.chart('hcVendaPorRegiaoTot', {            
            chart: {
                polar: true,
                type: 'line',
                width: 700,
                height: 433
            },
            title: {
                text: 'Venda Por Região - Total',
                x: -80
            },
            pane: {
                size: '92%'
            },
            xAxis: {
                categories: $scope.analiseProduct.vendaporregiao.categories,
               
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
                pointFormat: '<span style="color:{series.color}">{series.name}: R$ <b>{point.y:.2f}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },
            series: [{
                name: 'Total',
                data: $scope.analiseProduct.vendaporregiao.total,
                pointPlacement: 'on'
            }]
        }); 
        
        /*========== VENDA POR REGIAO - QUANTIDADE ==========*/  
        Highcharts.chart('hcVendaPorRegiaoQtd', {            
            chart: {
                polar: true,
                type: 'line'             
            },
            title: {
                text: 'Venda Por Região - Quantidade',
                x: -80
            },
            pane: {
                size: '92%'
            },
            xAxis: {
                categories: $scope.analiseProduct.vendaporregiao.categories,
               
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
                data: $scope.analiseProduct.vendaporregiao.quantidade,
                pointPlacement: 'on'
            }]
        });   
        
        /*========== MEDIA DE FRETE POR ESTADO - MAPA GEOGRAFICO ==========*/ 
        Highcharts.mapChart('hcMapaEstadoMediaFrete', {
            chart: {
                map: 'countries/br/br-all',
                height: 580,
                width:620
            },
            title: {
                text: 'Média de Frete Por Estado'
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
                data: $scope.analiseProduct.mediafreteporestado,
                name:  'Média de Frete',        
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }   
            }]
        });
        
        /*========== QUANTIDADE VENDIDA POR ESTADO - MAPA GEOGRAFICO ==========*/ 
        Highcharts.mapChart('hcMapaEstadoQuantidade', {
            chart: {
                map: 'countries/br/br-all',
                height: 580,
                width:620
            },
            title: {
                text: 'Quantidade Vendida Por Estado'
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
                data: $scope.analiseProduct.quantidadePorEstado,
                name:  'Quantidade',        
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }   
            }]
        });
        
    };   
    
    $scope.atualizaGraficoFaturamentoMensalProduto = function(){
        
        /*========== FATURAMENTO MENSAL PRODUTO ==========*/    
        Highcharts.chart('hcFaturamentoMensalProduto', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Faturamento Mensal'
            },
            xAxis: {
                categories: $scope.analiseProductFatAnual.faturamentoMensal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Valores'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>R$: {point.y:.2f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
                {
                name: $scope.analiseProductFatAnual.faturamentoMensal.yearPassado,
                data: $scope.analiseProductFatAnual.faturamentoMensal.faturamentoAnoPassado                
                },
                {
                name: $scope.analiseProductFatAnual.faturamentoMensal.yearAtual,
                data: $scope.analiseProductFatAnual.faturamentoMensal.faturamentoAnoAtual                
            }]
        });
        
        /*========== QUANTIADE MENSAL PRODUTO ==========*/    
        Highcharts.chart('hcQuantidadeMensalProduto', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Mensal'
            },
            xAxis: {
                categories: $scope.analiseProductFatAnual.faturamentoMensal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Valores'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b> {point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
                {
                name: $scope.analiseProductFatAnual.faturamentoMensal.yearPassado,
                data: $scope.analiseProductFatAnual.faturamentoMensal.quantidadeAnoPassado               
                },
                {
                name: $scope.analiseProductFatAnual.faturamentoMensal.yearAtual,
                data: $scope.analiseProductFatAnual.faturamentoMensal.quantidadeAnoAtual                
            }]
        });
    };
    
});

