app.controller('monitorAtacadoController', function($scope, $http,$timeout,growl,$interval){
    if (!$scope.permissoes[15]){
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
    var data = new Date();
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1);
    $scope.monitorDados = [];
    $scope.AgendamentoDados = [];
    $scope.temporizador = false;
    $scope.nextPrevious = false;
    $scope.infoAgendamento = {
        'justificativa': '',
        'data': primeiroDia,        
        'nomeCliente': '',
        'quantidade': '',
        'usuario': '', 
        'emissao': '',       
        'empresa':'',
        'produto':'',        
        'serie': '',            
        'nota': ''
    };

    //========== POST MONITOR ATACADO  ==========//    
    $scope.monitorAtacado = function(){
        growl.info('<b>AGUARDE</b><br> Fazendo Requisição De Dados!');
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'monitorAtacado/',
            method: 'POST',
            data: {'monitorAtacado': $scope.filtro},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){  
            $scope.transPend.visaoGeral = false; 
            $scope.monitorDados  = event.data;                     
            $scope.atualizaGraficos();
            $scope.nextPrevious = true;
            $scope.showPainel = 1;
        }).catch(function(err){    
            console.log(err);            
            $scope.transPend.visaoGeral = false;    
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);    
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 29'); 
            };   
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }     
    }; 

    //========== CHAMANDO FUNÇÃO POST MONITOR ATACADO ==========//  
    $scope.monitorAtacado();  

    //========== CHAMANDO FUNÇÃO AGENDAMENTO - CAPTAÇÃO DE DADOS E CHAMADA DE MODAL  ==========// 
    $scope.AgendamentoDeEntrega = function(empresa,serie,nota, cliente, emissao, produto, quantidade){
        $scope.infoAgendamento.usuario = $scope.login.usuario;  
        $scope.infoAgendamento.quantidade = quantidade;
        $scope.infoAgendamento.nomeCliente = cliente;
        $scope.infoAgendamento.produto = produto;
        $scope.infoAgendamento.emissao = emissao;        
        $scope.infoAgendamento.empresa = empresa;
        $scope.infoAgendamento.serie = serie;
        $scope.infoAgendamento.nota = nota;      
        $('#modalAgendamento').trigger('click'); 
    };

    //========== CHAMANDO FUNÇÃO AGENDAMENTO - INSERT TABELA NOTAS DT_  ==========// 
    $scope.agendamentoModal = function(){
        if(new Date() >  $scope.infoAgendamento.data){
            growl.warning('<b>ATENÇÃO</b><br> Data para agendamento deve ser maior que a data de hoje!');
        }
        else{
            if($scope.infoAgendamento.justificativa.length < 15){
                growl.warning('<b>ATENÇÃO</b><br> A Justificativa deve conter mais de 15 caracteres!');
            }
            else{               
                if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
                    $scope.transPend.visaoGeral = true;
                    $http({
                        url: $scope.baseApi + 'agendamentoDeEntrega/',
                        method: 'POST',
                        data: {'agendamentoDeEntrega': $scope.infoAgendamento},
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization': $scope.login.token 
                        }       
                    }).then(function(event){  
                        $scope.transPend.visaoGeral = false; 
                        $scope.AgendamentoDados = event.data; 
                        if($scope.AgendamentoDados.monitorsemvinculodeimeiCD.validador == true){
                            $scope.monitorDados.monitorsemvinculodeimeiCD.joinville = $scope.AgendamentoDados.monitorsemvinculodeimeiCD.joinville 
                            $scope.monitorDados.monitorsemvinculodeimeiCD.espiritosanto = $scope.AgendamentoDados.monitorsemvinculodeimeiCD.espiritosanto  
                            growl.success('<b>SUCESSO</b><br> Agendamento salvo!') 
                            $('#myModalAgendamento').modal('hide');
                        }else{
                            growl.warning('<b>ATENÇÃO</b><br> Tente agendar novamente!')  
                        };                                            
                    }).catch(function(err){   
                        console.log(err);
                        $scope.transPend.visaoGeral = false; 
                        if(err.data.error == false){
                            growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg);  
                        }else{
                            growl.error('<b>SERVIDOR</b><br> Erro de conexeão - ID: 29.1'); 
                        };     
                    })  
                }
                else{
                    growl.info('<b>AGUARDE</b><br> Transação Pendente!');
                };  
            };
        };
    };
    
    $scope.close = function(){
        $scope.infoAgendamento = {                      
            'justificativa': '',
            'data': primeiroDia,        
            'nomeCliente': '',
            'quantidade': '',
            'usuario': '', 
            'emissao': '',       
            'empresa':'',
            'produto':'',        
            'serie': '',            
            'nota': ''
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
    
    /*========== INICIO ATUALIZA GRAFICOS ==========*/    
    $scope.atualizaGraficos = function(){
        /*========== CONTROLE DE FATURAMENTO POR QUANTIDADE JV ==========*/   
        Highcharts.chart('hcControleDeDatasJV', {
            chart: {
                type: 'column'              
            },
            title: {
                text: 'Controle de Faturamento - Joinville'
            },            
            xAxis: {
                categories: $scope.monitorDados.monitorcontrolededatas.categories,
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
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                },
                column: {
                    pointPadding: 0.3,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name: 'Entrada de Pedido',
                    data: $scope.monitorDados.monitorcontrolededatas.joinville.qtdentradapedido                
                },
                {
                    name: 'Faturamento',
                    data: $scope.monitorDados.monitorcontrolededatas.espiritosanto.qtddatafaturada
                }     
                ,
                {
                    name: 'Emissão do Código de Rastreio',
                    data: $scope.monitorDados.monitorcontrolededatas.joinville.qtdrastreioemissao
                }, 
                {
                    name: 'Entrega Por Data',
                    data: $scope.monitorDados.monitorcontrolededatas.joinville.qtdrastreioentregadata
                },  
            ]
        });
        /*========== CONTROLE DE FATURAMENTO POR QUANTIDADE ES ==========*/   
        Highcharts.chart('hcControleDeDatasES', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Controle de Faturamento - Espírito Santo'
            },                       
            xAxis: {
                categories: $scope.monitorDados.monitorcontrolededatas.categories,
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
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    }
                },
                column: {
                    pointPadding: 0.3,
                    borderWidth: 0
                }
            },
            series: [{
                    name: 'Entrada de Pedido',
                    data: $scope.monitorDados.monitorcontrolededatas.espiritosanto.qtdentradapedido
                },                      
                {
                    name: 'Faturamento',
                    data: $scope.monitorDados.monitorcontrolededatas.espiritosanto.qtddatafaturada
                },     
                {
                    name: 'Emissão de Código de Rastreio',
                    data: $scope.monitorDados.monitorcontrolededatas.espiritosanto.qtdrastreioemissao
                }, 
                {
                    name: 'Data de Entrega',
                    data: $scope.monitorDados.monitorcontrolededatas.espiritosanto.qtdrastreioentregadata
                }                
            ]
        });       
    };
    
    $interval( function(){
        if(!$scope.temporizador){
           $scope.monitorAtacado();        
        }    
    },800000 );
    
    $scope.countShowPainel = function(){
        if ($scope.showPainel == 8){
            $scope.showPainel = 1;            
        } else {
            $scope.showPainel++;            
        }       
    };
    
    $interval( function(){
        if(!$scope.temporizador){             
            $scope.countShowPainel();          
        }
    }, 9000);
    
    $scope.somarShowPainel = function(sinal){
        if(sinal == 1){
            if($scope.showPainel <= 8 &&  $scope.showPainel >= 1){
                $scope.showPainel--;
                if($scope.showPainel == 0){
                    $scope.showPainel = 1
                }               
            }         
            else{
                 $scope.showPainel = 1
            }         
        }else 
        if(sinal == 2){
            if($scope.showPainel <= 8 && $scope.showPainel >= 1){
                $scope.showPainel++;
                 if($scope.showPainel == 9){
                    $scope.showPainel = 1
                }
            } else{
                 $scope.showPainel = 1
            }          
        }            
    };
    
});



