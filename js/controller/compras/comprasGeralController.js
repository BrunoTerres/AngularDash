app.controller('comprasGeralController', function($scope, $http,$timeout,growl,uiCalendarConfig,$compile){

    if (!$scope.permissoes[20]){
        window.location = "LOGIN/login.html";
    };      
       
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };      
    $scope.produtoFornCompras = [];
    $scope.geralCompras = [];  
    $scope.semagendamento = false;
    $scope.apresenta = false;     
    $scope.diaAgendamento = [];
    
    $('#calendar').fullCalendar({
        locale: 'pt-br'
    });

    //==========  VARIAVEIS PARA TABELAS DINAMICAS ==========//
    $scope.contagemSemana = 10;   

    $scope.selecaoSemana ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
        
        ]
    };  

    $scope.filterSemana = function(data){
        $scope.contagemSemana = data.id;   
    };   
    
    $scope.contagemProduto = 10;   
    
    $scope.selecaoProduto ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
        
        ]
    };  

    $scope.filterProduto = function(data){
        $scope.contagemProduto = data.id;   
    };  
    
    $scope.contagemFornecedor = 10;   
    
    $scope.selecaoFornecedor ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
        
        ]
    };  

    $scope.filterFornecedor = function(data){    
        $scope.contagemFornecedor = data.id;   
    }; 
    
    $scope.contagemAgendamento = 10;   
    
    $scope.selecaoAgendamento ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
        
        ]
    };  
    
    $scope.uiConfig = {
        calendar:{
          height: 500,
          editable: true,
          header:{
            left: '',
            center: 'title',
            right: 'prev,next'
          },
          eventClick: $scope.agendamentoDia
        }
    }; 
         
    $scope.events = [];  
    
    $scope.changeLang = function() {
        $scope.uiConfig.calendar.dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Quin", "Sex", "Sáb"];       
    
    };   
    $scope.changeLang();   
    
    $scope.filterAgendamento= function(data){
        $scope.contagemAgendamento = data.id;   
    };    
    
    //========== FUNÇÃO PARA CALENDARIO ==========//  
    $scope.agendamentoDia = function( date, jsEvent, view){
        $scope.infoAgendamento = date.className[0];     
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'agendamentoDia/',
            method: 'POST',
            data: {'agendamentoDia': $scope.infoAgendamento},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){   
            $scope.transPend.visaoGeral = false;               
            $scope.diaAgendamento = event.data; 
            $('#modalAgendamento').trigger('click')
        }).catch(function(err){  
            console.log(err);        
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 48');   
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    }; 
 
    //========== POST COMPRA POR FORNECEDOR  ==========// 
    $scope.comprasGeral = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'comprasGeral/',
            method: 'POST',
            data: {'comprasGeral': $scope.filtro},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }     
        }).then(function(event){ 
            $scope.transPend.visaoGeral = false;                 
            $scope.geralCompras = event.data; 
            if($scope.geralCompras.agendamentodeentrega != ''){  
              
                $scope.semagendamento = true;                 
                for(var i = 0; i < $scope.geralCompras.agendamentodeentrega.data.length; i++){
                    var date = new Date($scope.geralCompras.agendamentodeentrega.data[i]);             
                    $scope.events.push([
                      {title: $scope.geralCompras.agendamentodeentrega.titulo[i],start: new Date(date.getFullYear(), date.getMonth(), date.getDate()), className: [$scope.geralCompras.agendamentodeentrega.infoEntrega[i]]} 
                    ]);
                }
                
            }else{
                $scope.semagendamento = false;
            };            
            $scope.apresenta = true;
            $scope.atualizaGraficos();
        }).catch(function(err){   
            $scope.transPend.visaoGeral = false; 
            $scope.apresenta = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 49');   
            };                      
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }            

    };
    
    //========== POST COMPRA POR FORNECEDOR - > PRODUTO  ==========// 
    $scope.comprasFornProduto = function(codigo,nome,y){
        $scope.infoFornecedor = {
            'dataInicio': $scope.geralCompras.comprasGeralForn.dataInicio,
            'dataFim': $scope.geralCompras.comprasGeralForn.dataFim,
            'codigo': codigo,
            'nome':nome,
            'y':y
        };        
       
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'comprasFornProduto/',
            method: 'POST',
            data: {'comprasFornProduto': $scope.infoFornecedor},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){
            $scope.transPend.visaoGeral = false;                  
            $scope.produtoFornCompras  = event.data;           
            $('#modalFornProduto').trigger('click');
        }).catch(function(err){ 
            $scope.transPend.visaoGeral = false;
            $scope.inforFornecedor.valida = false;           
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 50');   
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
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
     
        /*========== QUANTIDADE POR CD ==========*/   
        Highcharts.chart('hcQtdePorCD', {
            chart: {
                type: 'column',
                height: 350
            },
            title: {
                text: 'Quantidade Por CD'
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
                    data: $scope.geralCompras.comprasporcd.quantidade,
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
        
        /*========== Total POR CD ==========*/   
        Highcharts.chart('hcTotalPorCD', {
            chart: {
                type: 'column',
                height: 350,
                
            },
            title: {
                text: 'Total Por CD'
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
                    text: 'Total'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Total: <b>{point.y:,.2f}</b>'
            },"series": [{                   
                    data: $scope.geralCompras.comprasporcd.total,
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
        
        /*========== QUANTIDADE POR  GRUPO ==========*/   
        Highcharts.chart('hcQtdePorGrupo', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade por Grupo'
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
                    data: $scope.geralCompras.compraporgrupo.quantidade,
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
        
        /*========== TOTAL POR  GRUPO ==========*/   
        Highcharts.chart('hcTotalPorGrupo', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Total por Grupo'
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
                    text: 'Total'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Total: <b>{point.y:,.2f}</b>'
            },"series": [{                   
                    data: $scope.geralCompras.compraporgrupo.total,
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
        
        
    };
    
});

