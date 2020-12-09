app.controller('fornecedorGeral', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[26]){
        window.location = "LOGIN/login.html";
    }
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };
    
    $scope.contagemEntrada = 10;   
    
    $scope.selecaoEntrada ={
        selectedOption: {id: '10', name: '10'},
        availableOptions: [
            {id:'10', name:'10'},
            {id:'20', name:'20'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterEntrada = function(data){
        $scope.contagemEntrada = data.id;   
    };
    
    $scope.contagemFornecedor= 15;   
    
    $scope.selecaoFornecedor ={
        selectedOption: {id: '15', name: '15'},
        availableOptions: [
            {id:'15', name:'15'},
            {id:'25', name:'25'},
            {id:'50', name:'50'},
            {id:'100', name:'100'}    
         
        ]
    };  
   
    $scope.filterFornecedor= function(data){
        $scope.contagemFornecedor = data.id;   
    }; 
    
    //==========  VARIÁVEIS GLOBAIS ==========//
    $scope.colorAtual = 'rgba(124, 181, 236)'
    $scope.colorPassado = 'rgba(42, 63, 84)'   
   
    $scope.infoProdututoEntrada = [];
    $scope.fornecedorListagem = [];    
    $scope.fornecedorInfo = [];
    $scope.infoEstoque = [];  
    $scope.apagarInfo = [];
    $scope.divApresenta = false;
    $scope.divApresentaFornecedor = false;
    
    //==========  FUNÇÃO PARA LISTAR FORNECEDORES ==========// 
    $scope.listarFornecedor = function(){
        $scope.fornecedorListagem = [];
        growl.info('<b>AGUARDE</b><br> Buscando Fornecedores'); 
        $http({
            method:'GET',
            url: $scope.baseApi +'listarFornecedor/',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            } 
        }).then(function(event){            
            $scope.fornecedorListagem = event.data.listaFornecedores     
            $scope.divApresentaFornecedor = true;             
        }).catch(function(err){          
            console.log(err);
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 56'); 
            };  
        });        
    };    
    
    $scope.listarFornecedor();
    
    //==========  FUNÇÃO PARA CAPTAR INFORMAÇÕES DO FORNECEDOR SELECIONADO ==========// 
    $scope.infoFornecedor= function(codigo,nome){
        $scope.dadosFornecedor = {
            dataInicial: $scope.filtro.dataInicial,
            dataFim: $scope.filtro.dataFim,
            idFornecedor: codigo,
            nome:nome
        };
        growl.info('<b>AGUARDE</b><br> Buscando dados do fornecedor pesquisado!'); 
        
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'infoFornecedor/',
            method: 'POST',
            data: {'infoFornecedor': $scope.dadosFornecedor},
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }      
        }).then(function(event){    
            $scope.transPend.visaoGeral = false;             
            $scope.fornecedorInfo = event.data;               
            if($scope.fornecedorInfo.mensagem == true){
                $scope.atualizaGraficos();
                $scope.divApresentaFornecedor = false;
                $scope.divApresenta = true;  
            }else{
                growl.warning('<b>ATENÇÃO</b><br> Não foi encontrado dados do fornecedor pesquisado!');  
            };
        }).catch(function(err){  
            console.log(err);         
            $scope.transPend.visaoGeral = false;
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 57');
            };                     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    //==========  FUNÇÃO PARA PESQUISA PRODUTOS NO ESTOQUE ==========// 
    $scope.pesquisaEstoqueFornecedor = function(validador, empresa){
        $scope.estoqueFornecedor = {
            'codigoFornecedor': $scope.fornecedorInfo.estoque.codigoFornecedor,
            'validador': validador,
            'empresa': empresa
        }
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'pesquisaEstoqueFornecedor/',
                method: 'POST',
                data: {'pesquisaEstoqueFornecedor': $scope.estoqueFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }       
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.infoEstoque = event.data;
                $('#modalEstoque').trigger('click');
            }).catch(function(err){               
                $scope.transPend.visaoGeral = false;
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 58');                     
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        }; 
    };
    
    //==========  FUNÇÃO PARA PESQUISA PRODUTOS  ==========// 
    $scope.ultimaEntrada = function(data,empresa){
        $scope.infoEntrada = {
            'codigoFornecedor': $scope.fornecedorInfo.codigoFornecedor,
            'empresa': empresa,
            'data': data            
        };
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'ultimaEntrada/',
                method: 'POST',
                data: {'ultimaEntrada': $scope.infoEntrada},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.infoProdututoEntrada = event.data;             
                $('#modalEntrada').trigger('click');
            }).catch(function(err){  
                console.log(err);             
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 59');  
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    $scope.infoApagar = function(){
        if($scope.transPend.visaoGeral==false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'infoApagar/',
                method: 'POST',
                data: {'infoApagar': $scope.fornecedorInfo.codigoFornecedor},
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }      
            }).then(function(event){  
                $scope.transPend.visaoGeral = false;                
                $scope.apagarInfo = event.data;             
                $('#modalApagar').trigger('click');
            }).catch(function(err){ 
                console.log(err);              
                $scope.transPend.visaoGeral = false;
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 60');    
                };                    
            })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
    };
    
    $scope.return = function(){
        if($scope.divApresenta == true){
            $scope.divApresenta = false;
            $scope.divApresentaFornecedor = true;
            $scope.infoProdututoEntrada = [];           
            $scope.fornecedorInfo = [];
            $scope.infoEstoque = []; 
            $scope.apagarInfo = [];
            
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
    
    /*==========  ATUALIZA GRAFICOS HIGH CHARTS ==========*/  
    $scope.atualizaGraficos = function(){
        
        /*========== QUANTIDADE ANO PASSADO X ATUAL ==========*/       
        Highcharts.chart('hcQtdeAnoPassadoxAtual', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Quantidade Ano Passado x Atual'
            },            
            xAxis: {
                categories: $scope.fornecedorInfo.anoPassadoxAtual.categories,
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
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoPassado,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.qtdeAnoPassado,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoAtual,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.qtdeAnoAtual,
                    color: $scope.colorAtual                    
                }                
            ]
        });
        
        /*========== TOTAL ANO PASSADO X ATUAL ==========*/       
        Highcharts.chart('hcTotalAnoPassadoxAtual', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Total Ano Passado x Atual'
            },            
            xAxis: {
                categories: $scope.fornecedorInfo.anoPassadoxAtual.categories,
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
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoPassado,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.totalAnoPassado,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoAtual,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.totalAnoAtual,
                    color: $scope.colorAtual                    
                }                
            ]
        });
        
        /*========== TOTAL ANO PASSADO X ATUAL ==========*/       
        Highcharts.chart('hcTktMedioAnoPassadoxAtual', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ticket Médio Ano Passado x Atual'
            },            
            xAxis: {
                categories: $scope.fornecedorInfo.anoPassadoxAtual.categories,
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
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoPassado,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.tktMedioAnoPassado,
                    color: $scope.colorPassado
                },
                {
                    name: $scope.fornecedorInfo.anoPassadoxAtual.anoAtual,
                    data: $scope.fornecedorInfo.anoPassadoxAtual.tktMedioAnoAtual,
                    color: $scope.colorAtual                    
                }                
            ]
        });
        
     
      
        
        
        
    }; 
});

