app.controller('monitorEcommerceController', function($scope, $http,growl,$interval){
      
    if (!$scope.permissoes[31]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();

    //==========  CHAMADA DE FUNÇÃO DO CONTROLLER LOGOUT BASE ==========//
    $scope.start(false);

    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    $scope.divGeral = false;
    $scope.reclameAqui = false; 
       
    //========== POST ECOMMERCE MONITOR ==========// 
    $scope.postEcmMonitor = {
        method : 'POST',
        url : $scope.baseApi + 'monitorEcommerce/',
        data : {'monitorEcommerce':  $scope.filtro},
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': $scope.login.token 
        }    
    };

    //========== ECOMMERCE MONITOR  ==========//
    $scope.monitorEcommerce = function(){
        if($scope.isValidDate($scope.filtro.dataInicial) && $scope.isValidDate($scope.filtro.dataFim)){
            if($scope.transPend.visaoGeral==false){
                $scope.transPend.visaoGeral = true;
                $http($scope.postEcmMonitor
                ).then(function(event){    
                    $scope.transPend.visaoGeral = false;  
                    var monitorDados = event.data.dadosMetaseReclameAqui;     
                    
                    if(monitorDados.error == true){
                        growl.warning('<b>ATENÇÃO</b><br> Não contém Meta ou Venda cadastrada!');   
                    }else{
                        $scope.transPend.visaoGeral = false;
                        $scope.metas = monitorDados.meta;
                                               
                        if($scope.reclameAqui == true){
                            $scope.seisMesesCM = monitorDados.seisMesesCM;
                            $scope.seisMeses = monitorDados.seisMeses; 
                          
                            //========== CAPTACAO DA IMAGEM RECLAME AQUI ==========//
                            if(parseFloat($scope.seisMeses.finalScore) < 5){
                                $scope.img = '/mixtelDashboard/templates/LAYOUT/images/nao-recomendada.274e374b.png'    
                            }else if(parseFloat($scope.seisMeses.finalScore) < 6){
                                $scope.img = '/mixtelDashboard/templates/LAYOUT/images/ruim.c1a21379.png' 
                            }else if(parseFloat($scope.seisMeses.finalScore) < 7){                          
                                $scope.img = '/mixtelDashboard/templates/LAYOUT/images/regular.9aef4b69.png' 
                            }else if(parseFloat($scope.seisMeses.finalScore) < 8){
                                $scope.img = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
                            }else{
                                $scope.img = '/mixtelDashboard/templates/LAYOUT/images/otimo.260df5de.png'
                            };
                             //========== CAPTACAO DE DATA RECLAME AQUI ==========//
                             var dataInicialReclameAqui = $scope.seisMeses.start.split("T")
                             $scope.dataInicialReclameAqui = dataInicialReclameAqui[0]
                             var dataFinalReclameAqui = $scope.seisMeses.end.split("T")
                             $scope.dataFinalReclameAqui = dataFinalReclameAqui[0]   

                            /*
                         
                            if(parseFloat($scope.seisMesesCM.finalScore) < 5){
                                $scope.imgCM = '/mixtelDashboard/templates/LAYOUT/images/nao-recomendada.274e374b.png'    
                            }else if(parseFloat($scope.seisMesesCM.finalScore) < 6){
                                $scope.imgCM = '/mixtelDashboard/templates/LAYOUT/images/ruim.c1a21379.png' 
                            }else if(parseFloat($scope.seisMesesCM.finalScore) < 7){                          
                                $scope.imgCM = '/mixtelDashboard/templates/LAYOUT/images/regular.9aef4b69.png' 
                            }else if(parseFloat($scope.seisMesesCM.finalScore) < 8){
                                $scope.imgCM = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
                            }else{
                                $scope.imgCM = '/mixtelDashboard/templates/LAYOUT/images/bom.e345739a.png'
                            };

                            

                            //========== CAPTACAO DE DATA COMPREI E MEU ==========//
                            var dataInicialCM = $scope.seisMesesCM.start.split("T")
                            $scope.dataInicialCM = dataInicialReclameAqui[0]
                            var dataFinalCM = $scope.seisMesesCM.end.split("T")
                            $scope.dataFinalCM = dataFinalReclameAqui[0]   

                            if($scope.seisMesesCM.status == 'NOT_RECOMMENDED'){
                                $scope.seisMesesCM.status = 'Não recomendada'    
                            };*/
                            $scope.filtro.seisMeses  = '';
                            //$scope.filtro.seisMesesCompreieMeu = '';    
                        };
                        $scope.atualizaGraficos();  
                        $scope.divGeral = true;
                    };                      
                }).catch(function(err){
                    console.log(err);                            
                    $scope.transPend.visaoGeral = false;                  
                    growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 66');                    
                });
            } else {
                growl.info('<b>AGUARDE</b><br> Transaçaõ Pendente!');   
            }
        } else {
            growl.warning('<b>ATENÇÃO</b><br> Data(s) Inválida(s)!');    
        }
    }; 
   
    //========== GET INFO RECLAME AQUI - ELETRUM ==========//
    $scope.reclameAquiEletrum = function(){
        $http({
            url: 'https://iosite.reclameaqui.com.br/raichu-io-site-v1/company/public/ToIxqXSojcZC7PxB',
            method: 'GET',          
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
        }).then(function(event){   
            $scope.transPend.visaoGeral = false;
            var recebe = event.data;    
            $scope.filtro.seisMeses = recebe.companyIndex6Months;             
            $scope.reclameAqui = true;
           // $scope.reclameAquiCompreieMeu();     
            setTimeout(function(){ $scope.monitorEcommerce(); }, 500);                                
        }).catch(function(err){  
            console.log(err);        
            $scope.transPend.visaoGeral = false;  
            growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 67');   
        });       
    };

    //========== GET INFO RECLAME AQUI - COMPREI E MEU ==========//
    $scope.reclameAquiCompreieMeu = function(){
        $http({
            url: 'https://iosite.reclameaqui.com.br/raichu-io-site-v1/company/public/88593',
            method: 'GET',          
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}      
        }).then(function(event){   
            $scope.transPend.visaoGeral = false; 
            var recebe = event.data;    
            $scope.filtro.seisMesesCompreieMeu = recebe.companyIndex6Months;    
                    
        }).catch(function(err){  
            console.log(err);        
            $scope.transPend.visaoGeral = false;  
            growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 68');   
        });       
    };
    
    $scope.reclameAquiEletrum();    
       
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

    /*========== INICIO ATUALIZA GRAFICOS ==========*/       
    $scope.atualizaGraficos = function(){
        /*========== RECLAME AQUI ELETRUM  ==========*/      
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
        
        /*========== RECLAME AQUI ELETRUM - RECLAMAÇÕES RESPONDIDAS  ==========*/   
        var chartSpeed = Highcharts.chart('hcReclameAquiEletrumRP', Highcharts.merge(gaugeOptions,{
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
                data: [parseFloat($scope.seisMeses.answeredPercentual)],
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

        /*========== RECLAME AQUI ELETRUM - VOLTARIA A FAZER NEGÓCIO ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiEletrumVN', Highcharts.merge(gaugeOptions,{
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
                data: [parseFloat($scope.seisMeses.dealAgainPercentual)],
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

        /*========== RECLAME AQUI ELETRUM - INDICE DE SOLUÇÃO ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiEletrumIS', Highcharts.merge(gaugeOptions,{
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
                data: [parseFloat($scope.seisMeses.solvedPercentual)],
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

        /*========== RECLAME AQUI ELETRUM - NOTA DO CONSUMIDOR ==========*/  
        var chartSpeed = Highcharts.chart('hcReclameAquiEletrumNC', Highcharts.merge(gaugeOptions,{
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
                data: [parseFloat($scope.seisMeses.consumerScore)],
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

        /*========== RECLAME AQUI COMPREI E MEU - RECLAMAÇÕES RESPONDIDAS  ========== 
        var chartSpeed = Highcharts.chart('hcReclameAquiCompreiRP', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Reclamações respondidas'
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Reclamações respondidas',
                data: [parseFloat($scope.seisMesesCM.answeredPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));*/  

        /*========== RECLAME AQUI COMPREI E MEU - VOLTARIA A FAZER NEGÓCIO ==========
        var chartSpeed = Highcharts.chart('hcReclameAquiCompreiVN', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Voltaria a Fazer Negócio'
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Voltaria a Fazer Negócio',
                data: [parseFloat($scope.seisMesesCM.dealAgainPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));*/  

        /*========== RECLAME AQUI COMPREI E MEU - INDICE DE SOLUÇÃO ==========
        var chartSpeed = Highcharts.chart('hcReclameAquiCompreiIS', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Índice de Solução'
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Índice de Solução',
                data: [parseFloat($scope.seisMesesCM.solvedPercentual)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));*/  

        /*========== RECLAME AQUI COMPREI E MEU - NOTA DO CONSUMIDOR ========== 
        var chartSpeed = Highcharts.chart('hcReclameAquiCompreiNC', Highcharts.merge(gaugeOptions,{
            yAxis: {
                min: 0,
                max: 10,
                title: {
                    text: 'Nota do Consumidor'
                }
            },
        
            credits: {
                enabled: false
            },
        
            series: [{
                name: 'Nota do Consumidor',
                data: [parseFloat($scope.seisMesesCM.consumerScore)],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:30px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                           '<span style="font-size:15px;color:silver">%</span></div>'
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }]
        
        }));*/ 

     
    }; 

    $interval( function(){
        if($scope.reclameAqui == true) {
             $scope.reclameAqui = false;            
        };
        $scope.monitorEcommerce();
    }, 600000);
    
    $interval( function(){
        if($scope.reclameAqui == false){
            $scope.reclameAqui = true;           
        }; 
        $scope.reclameAquiEletrum();       
    }, 21600000); 
   
    $scope.showPainel = 1;
    var i = 0
    $scope.countShowPainel = function(){
        if($scope.showPainel == 4){      
            $scope.showPainel = 1;
            i = 0;           
        }else{                           
            $scope.canal =  $scope.metas[i].canal
            $scope.metaMensal = $scope.metas[i].porcentMetaMensal
            $scope.metaDiaria = $scope.metas[i].porcentMetaDiaria
            $scope.showPainel++;
            i++
        }; 
    };  
  
    $interval( function(){ $scope.countShowPainel(); }, 10000);
    
});

