app.controller('visaoGeralFaturamentoController', function($scope, $http,growl){
    
    if (!$scope.permissoes[17]){
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
    
    $scope.colorPassado = 'rgba(42, 63, 84)'
    $scope.colorAtual = 'rgba(124, 181, 236)'
    $scope.mostraFaturamento = false;
    
    $scope.visaoGeralFat = {
        clientesMesAtual:{
            'mes':0,
            'positivadosAtacado':0,
            'positivadosEcommerce':0,
            'positivadosLoja':0,
            'quantidadeAtacado':0,
            'quantidadeEcommerce':0,
            'quantidadeLoja':0,
            'ticketAtacado':0,
            'ticketEcommerce':0,
            'ticketLoja':0,
            'totalAtacado':0,
            'totalEcommerce':0,
            'totalLoja':0
            
        },
        totalCanais:{
            'total':0,
            'quantidade':0,
            'ticketMedio':0,
            'positivados':0
        }
    };
    $scope.percentAtacadoMes = 0;
    $scope.percentEcommerceMes = 0;
    $scope.percentLojaMes = 0;
    
    $scope.percentAtacadoAnoPassado = 0;
    $scope.percentEcommerceAnoPassado = 0;
    $scope.percentLojaAnoPassado = 0;
    
    $scope.percentAtacadoAnoAtual = 0;
    $scope.percentEcommerceAnoAtual = 0;
    $scope.percentLojaAnoAtual = 0;

    /*========== POST DADOS VISÃO GERAL ==========*/ 
    $scope.visaoGeralFaturamentoCanal = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'visaoGeralFaturamentoCanal/',
                method: 'POST',
                data: {'visaoGeralFaturamentoCanal': $scope.infoDate},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){   
                $scope.transPend.visaoGeral = false;                
                $scope.visaoGeralFat  = event.data;  
                $scope.percentAtacadoMes = (($scope.visaoGeralFat.clientesMesAtual.totalAtacado / $scope.visaoGeralFat.totalCanais.total)*100);
                $scope.percentEcommerceMes = (($scope.visaoGeralFat.clientesMesAtual.totalEcommerce / $scope.visaoGeralFat.totalCanais.total)*100);
                $scope.percentLojaMes = (($scope.visaoGeralFat.clientesMesAtual.totalLoja / $scope.visaoGeralFat.totalCanais.total)*100);
                
                $scope.percentAtacadoAnoPassado = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoAtacadoTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoTotalFaturamento)*100);
                $scope.percentEcommerceAnoPassado = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoEcommerceTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoTotalFaturamento)*100);
                $scope.percentLojaAnoPassado = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoLojaTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoTotalFaturamento)*100);
                
                $scope.percentAtacadoAnoAtual = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualAtacadoTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualTotalFaturamento)*100);
                $scope.percentEcommerceAnoAtual = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualEcommerceTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualTotalFaturamento)*100);
                $scope.percentLojaAnoAtual = (($scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualLojaTotal / $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualTotalFaturamento)*100);
                
                $scope.atualizaGraficos();
                $scope.mostraFaturamento = true;
            }).catch(function(err){
                console.log(err);            
                $scope.transPend.visaoGeral = false;                  
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 47');   
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }
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
        
        /*========== QUANTIDADE ATACADO ==========*/       
        Highcharts.chart('hcQtdeAnoAtualAtacado', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Atacado'
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
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
            series: [  
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoPassadoAtacado ,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoAtualAtacado,
                    color: $scope.colorAtual
                    
                }                
            ]
        });
        
        /*========== FATURAMENTO ATACADO ==========*/       
        Highcharts.chart('hcFatAnoAtualAtacado', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Faturamento Atacado '
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Faturamento'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoPassadoAtacado,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoAtualAtacado,
                    color: $scope.colorAtual
                }        
            ]
        });
        
        /*========== QUANTIDADE ECOMMERCE==========*/       
        Highcharts.chart('hcQtdeAnoAtualEcommerce', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Ecommerce'
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
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
            series: [  
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoPassadoEcommerce,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoAtualEcommerce,
                    color: $scope.colorAtual
                }                
            ]
        });
        
        /*========== FATURAMENTO ECOMMERCE ==========*/       
        Highcharts.chart('hcFatAnoAtualEcommerce', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Faturamento Ecommerce'
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Faturamento'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoPassadoEcommerce,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoAtualEcommerce,
                    color: $scope.colorAtual
                }                
            ]
        });
        
        /*========== QUANTIDADE LOJA ==========*/       
        Highcharts.chart('hcQtdeAnoAtualLoja', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Loja' 
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
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
            series: [ 
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoPassadoLoja,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.qtdeAnoAtualLoja,
                    color: $scope.colorAtual
                }                
            ]
        });
        
        /*========== FATURAMENTO LOJA ==========*/       
        Highcharts.chart('hcFatAnoAtualLoja', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Faturamento Loja' 
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Faturamento'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoPassadoLoja,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.totAnoAtualLoja,
                    color: $scope.colorAtual
                }
            ]
        }); 
        
        /*========== TICKET MÉDIO ATACADO ==========*/       
        Highcharts.chart('hcTicketAnoAtualAtacado', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Atacado' 
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Ticket Médio'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoPassadoAtacado,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoAtualAtacado,                    
                    color: $scope.colorAtual
                }                
            ]
        });
        
        /*========== TICKET MÉDIO ECOMMERCE ==========*/       
        Highcharts.chart('hcTicketAnoAtualEcommerce', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Ecommerce' 
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Ticket Médio'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoPassadoEcommerce,                    
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoAtualEcommerce,
                    color: $scope.colorAtual
                }
            ]
        }); 
        
        /*========== TICKET MÉDIO LOJA ==========*/       
        Highcharts.chart('hcTicketAnoAtualLoja', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Loja' 
            },            
            xAxis: {
                categories: $scope.visaoGeralFat.visaoFaturamentoCanal.categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Ticket Médio'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:,.2f}</b></td></tr>',
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
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoPassadoLoja,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,                    
                    data: $scope.visaoGeralFat.visaoFaturamentoCanal.ticketAnoAtualLoja,
                    color: $scope.colorAtual
                }
            ]
        }); 
        
        /*========== FATURAMENTO ATACADO - ANO PASSADO X ANO ATUAL ==========*/  
        Highcharts.chart('hcFaturamentoAtc', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Faturamento Atacado - Ano Passado x Ano Atual'
            },
            tooltip: {
                pointFormat: '{series.name}: <b> R${point.y:,.2f}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Faturamento',
                colorByPoint: true,
                data: 
                [
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoAtacadoTotal                 
                    }, 
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualAtacadoTotal
                    }
                ]
            }]
        });
        
        /*========== FATURAMENTO ECOMMERCE - ANO PASSADO X ANO ATUAL ==========*/  
        Highcharts.chart('hcFaturamentoEc', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Faturamento Ecommerce - Ano Passado x Ano Atual'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>R$ {point.y:,.2f}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Faturamento',
                colorByPoint: true,
                data: 
                [
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoEcommerceTotal                
                    }, 
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualEcommerceTotal
                    }
                ]
            }]
        });
        
        /*========== FATURAMENTO LOJA - ANO PASSADO X ANO ATUAL ==========*/  
        Highcharts.chart('hcFaturamentoLj', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Faturamento Loja - Ano Passado x Ano Atual'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>R$ {point.y:,.2f}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Faturamento',
                colorByPoint: true,
                data: 
                [
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassado,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoPassadoLojaTotal              
                    }, 
                    {
                        name: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtual,
                        y: $scope.visaoGeralFat.visaoFaturamentoCanal.anoAtualLojaTotal
                    }
                ]
            }]
        });
        
    };  
});

