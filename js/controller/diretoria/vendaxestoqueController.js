app.controller('vendaxestoqueController', function($scope, $http,$timeout,growl){
    
    if (!$scope.permissoes[41]){
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

    //========== POST PARA PESQUISAR ESTOQUE RESERVA LOJAS ==========//
    $scope.vendaxEstoqueAtacadoEcommerce = function(){
        if($scope.transPend.visaoGeral == false && $scope.transPend.visaoPorTempo==false){
            $scope.transPend.visaoGeral = true;
        $http({
            url: $scope.baseApi + 'vendaxEstoqueAtacadoEcommerce/',
            method: 'POST',
            data: {'vendaxEstoqueAtacadoEcommerce': $scope.filtro},
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
                    data: event.data.vendasxestoque.rows,                                
                    columns: event.data.vendasxestoque.cols,
                    "footerCallback": function ( row, data, start, end, display ) {
                        var api = this.api();
                        nb_cols = api.columns().nodes().length;
                        console.log(nb_cols)
                      

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
                        $( api.column( j ).footer() ).html(/*'Total Page: <br>'+ pageTotal + '<br> Total: <br> ' +*/ total);
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
                growl.error('<b>SERVIDOR</b><br> Erro de conexão - ID: 47.1'); 
            };     
        })  
        }else{
            growl.info('<b>AGUARDE</b><br> Transação Pendente!');
        };
        
    };    
});

