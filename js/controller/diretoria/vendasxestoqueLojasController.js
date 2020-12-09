app.controller('vendaxestoqueLojaController', function($scope, $http,growl){
    
    if (!$scope.permissoes[44]){
        window.location = "LOGIN/login.html";
    };
    
    $scope.gototop();
    
    //==========  TRANSPEND ==========//
    $scope.transPend = {
        visaoGeral: false,
        visaoPorTempo: false
    };

    //========== SHOW TABLE ==========//
    $scope.divGeral = false;
    $scope.divTH = false;


    //========== POST PARA PESQUISA AS LOJAS PARA SELECT HTML ==========// 
    $scope.empresasLojas = function(){
    if ($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo == false) {
        $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'empresasLojas/',
            method: 'GET',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': $scope.login.token 
            }
        }).then(function (event) {
            $scope.transPend.visaoGeral = false;             
            $scope.lojas = event.data.lojas;            
        }).catch(function (err) {
            console.log(err);
            $scope.transPend.visaoGeral = false;                
            if(err.data.error == false){
                growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
            }else{
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 47.2'); 
            };  
        })
    } else {
        growl.info('<b>AGUARDE</b><br> Transação Pendente!');
    };
    };
    
    $scope.empresasLojas();

    //========== POST PARA PESQUISAR ESTOQUE RESERVA LOJAS ==========//
    $scope.vendaxEstoqueLojas = function(){
        if($scope.empresa.id == 0){
            growl.warning('<b>ATENÇÃO</b><br> Selecione a Loja Para Pesquisa');
        }else{
            $scope.divGeral = false;
            var centroCusto = '1'
            if($scope.empresa.id ){
                if($scope.empresa.id == '102'){
                    centroCusto = '010518';
                }else if($scope.empresa.id == '107'){
                    centroCusto = '010545';
                }else if($scope.empresa.id == '106'){
                    centroCusto = '010544';
                }else if($scope.empresa.id == '103'){
                    centroCusto = '010520';
                }else if($scope.empresa.id == '104'){
                    centroCusto = '010523';
                }else if($scope.empresa.id == '105'){
                    centroCusto = '010532'
                }else if($scope.empresa.id == '201'){
                    centroCusto = '010527'
                }else if($scope.empresa.id == '202'){
                    centroCusto = '010536';
                };              
            };     

         
            
            var dataI = new Date($scope.filtro.dataInicial)
            var dataI = dataI.getFullYear() + '-' + (dataI.getMonth() + 1) + '-' +  dataI.getUTCDate();
            var dataF = new Date($scope.filtro.dataFim)
            var dataF = dataF.getFullYear() + '-' + (dataF.getMonth() + 1) + '-' +  dataF.getUTCDate(); 

            if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
                $scope.transPend.visaoGeral = true;
            $http({
                url: $scope.baseApi + 'vendaxEstoqueLojas/' + $scope.empresa.id + '/' + dataI + '/' + dataF + '/' + centroCusto,
                method: 'GET',              
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': $scope.login.token 
                }     
            }).then(function(event){
                $scope.transPend.visaoGeral = false;                
                $scope.divGeral = true;            
                
                $( document ).ready(function(){
                $('#vendaxestoque').DataTable({
                    "language": {
                        "url": "/mixtelDashboard/js/js/Portuguese-Brasil.json"
                    },   
                    "aLengthMenu": [[10,20,50, 75, -1], [10, 20, 50, 75, "All"]],
                    "iDisplayLength": 10,  
                    "bDestroy": true,            
                    "data": event.data.vendasxestoque.rows,                                
                    "columns": event.data.vendasxestoque.cols,
                    "order": [[ 4, "desc" ]],
                    //"columnDefs": [{
                    //    "targets": [6], 
                    //    "render": $.fn.dataTable.render.number( '.', ',', 2)
                    //},
                 

                    //],
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

                        var j = 4;
                        while(j < nb_cols){
                            if(j == 6){
                                break;
                            }
                               
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
                });  
    
            }).catch(function(err){          
                console.log(err);
                $scope.transPend.visaoGeral = false; 
                if(err.data.error == false){
                    growl.warning('<b>ATENÇÃO!</b><br>'+ err.data.msg); 
                }else{
                    growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 47.3'); 
                };     
            })  
            }else{
                growl.info('<b>AGUARDE</b><br> Transação Pendente!');
            };
        };        
    };    
});

